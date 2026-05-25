#!/usr/bin/env node

/**
 * Klycky - A beautiful, terminal-native typing application for developers.
 *
 * Entry point with proper state machine architecture:
 *
 *   AppMode.Idle        — waiting for user to start typing or enter command
 *   AppMode.Typing      — active typing session
 *   AppMode.Results     — showing session results (input-gated)
 *   AppMode.Command     — command palette overlay open
 *
 * Rendering is region-based and buffered:
 * - Static regions (logo, separators, footer) render only on state changes
 * - Dynamic regions (typing area, timer, stats) use incremental updates
 * - All output is batched via beginFrame/endFrame to prevent flickering
 */

import { loadConfig, getConfig, updateConfig } from './config/index.js';
import { setTheme } from './themes/index.js';
import { TypingSession } from './engine/session.js';
import { enableRawMode, onKeypress, KeyEvent } from './engine/inputHandler.js';
import {
  enterAltScreen, exitAltScreen, fillBackground,
  beginFrame, endFrame, onResize,
} from './renderer/screen.js';
import { renderText } from './renderer/textRenderer.js';
import {
  renderLogo, renderModeRow, renderSeparator, renderLiveStats,
  renderFooter, renderMessage, clearMessage, renderSessionSummary,
  renderCommandOverlay, clearCommandOverlay, resetTimerCache,
} from './renderer/statusBar.js';
import { createTimeSession } from './modes/timeMode.js';
import { createWordSession } from './modes/wordMode.js';
import { createQuoteSession } from './modes/quoteMode.js';
import { createCustomSession } from './modes/customMode.js';
import { executeCommand } from './commands/commandParser.js';
import { computeMetrics } from './stats/metrics.js';
import { recordSession } from './stats/history.js';

// ─── CLI Argument Parsing ────────────────────────────────────

const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
  console.log(`
  klycky - A beautiful terminal typing app

  Usage:
    klycky                    Start with default settings
    klycky --theme <name>     Start with a specific theme
    klycky --mode <mode>      Start with a specific mode (time, words, quote)
    klycky --time <seconds>   Set time duration
    klycky --words <count>    Set word count
    klycky --help             Show this help message
    klycky --version          Show version

  Commands (type / when idle to open command palette):
    /theme <name>     Change theme
    /themes           List available themes
    /mode <mode>      Switch typing mode
    /time <sec>       Set session duration
    /words <count>    Set word count target
    /restart          Restart current session
    /stats            View your statistics
    /caret <style>    Change caret style (line, block, underline)
    /difficulty <lvl> Change difficulty (easy, normal, hard)
    /quit             Exit Klycky
    /help             Show all commands

  Keyboard Shortcuts:
    Tab               Restart / next test
    Escape            Reset / quit
    Ctrl+Backspace    Delete entire word
    Ctrl+C            Force quit
  `);
  process.exit(0);
}

if (args.includes('--version') || args.includes('-v')) {
  console.log('klycky v1.0.0');
  process.exit(0);
}

// ─── Application Mode (State Machine) ────────────────────────

const enum AppMode {
  Idle = 0,
  Typing = 1,
  Results = 2,
  Command = 3,
}

interface AppState {
  mode: AppMode;
  session: TypingSession;

  // Command palette
  commandBuffer: string;
  commandMessage: string;
  commandMessageTimeout: ReturnType<typeof setTimeout> | null;

  // Timers
  tickTimer: ReturnType<typeof setInterval> | null;

  // Results guard: timestamp when results screen was shown.
  // Input is ignored for a short period after entering results.
  resultsEnteredAt: number;

  running: boolean;
}

// ─── Constants ───────────────────────────────────────────────

/** Minimum ms to hold the results screen before accepting input */
const RESULTS_DEBOUNCE_MS = 400;

/** Timer tick interval (ms) for updating countdown display */
const TIMER_TICK_MS = 200;

// ─── Main Application ───────────────────────────────────────

async function main(): Promise<void> {
  // Load configuration
  loadConfig();

  // Apply CLI argument overrides
  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--theme':
        if (args[i + 1]) { updateConfig({ theme: args[i + 1] }); i++; }
        break;
      case '--mode':
        if (args[i + 1]) { updateConfig({ mode: args[i + 1] }); i++; }
        break;
      case '--time':
        if (args[i + 1]) { updateConfig({ mode: 'time', timeDuration: parseInt(args[i + 1], 10) }); i++; }
        break;
      case '--words':
        if (args[i + 1]) { updateConfig({ mode: 'words', wordCount: parseInt(args[i + 1], 10) }); i++; }
        break;
    }
  }

  // Apply theme
  const currentConfig = getConfig();
  setTheme(currentConfig.theme);

  // Initialize state
  const state: AppState = {
    mode: AppMode.Idle,
    session: createSession(currentConfig),
    commandBuffer: '',
    commandMessage: '',
    commandMessageTimeout: null,
    tickTimer: null,
    resultsEnteredAt: 0,
    running: true,
  };

  // ─── Terminal Setup ─────────────────────────────────────
  enterAltScreen();
  const disableRawMode = enableRawMode();

  const cleanup = () => {
    if (state.tickTimer) clearInterval(state.tickTimer);
    if (state.commandMessageTimeout) clearTimeout(state.commandMessageTimeout);
    exitAltScreen();
    disableRawMode();
  };

  // Ensure clean exit on all termination signals
  process.on('SIGINT', () => { cleanup(); process.exit(0); });
  process.on('SIGTERM', () => { cleanup(); process.exit(0); });

  // ─── Resize Handler ────────────────────────────────────
  onResize(() => {
    fillBackground();
    fullRender(state);
  });

  // ─── Initial Render ────────────────────────────────────
  fullRender(state);

  // ─── Timer Tick ────────────────────────────────────────
  // Only updates the mode row (timer display) and checks time expiry.
  // Does NOT touch the typing area or other regions.
  state.tickTimer = setInterval(() => {
    if (state.mode === AppMode.Typing && state.session.state === 'active') {
      // Check time expiry
      if (state.session.isTimeUp()) {
        state.session.finish();
        transitionToResults(state);
        return;
      }

      // Update only the timer row — NOT the typing area
      beginFrame();
      const cfg = getConfig();
      renderModeRow(state.session, cfg); // content-throttled internally
      endFrame();
    }
  }, TIMER_TICK_MS);

  // ─── Input Handler ─────────────────────────────────────
  onKeypress((event: KeyEvent) => {
    if (!state.running) return;

    // ─── Global: Ctrl+C force quit ────────────────────
    if (event.ctrl && event.name === 'c') {
      state.running = false;
      cleanup();
      process.exit(0);
      return;
    }

    // ─── Dispatch by application mode ─────────────────
    switch (state.mode) {
      case AppMode.Idle:
        handleIdleInput(state, event);
        break;
      case AppMode.Typing:
        handleTypingInput(state, event);
        break;
      case AppMode.Results:
        handleResultsInput(state, event);
        break;
      case AppMode.Command:
        handleCommandInput(state, event);
        break;
    }
  });
}

// ─── Input Handlers (per mode) ───────────────────────────────

function handleIdleInput(state: AppState, event: KeyEvent): void {
  // Tab: restart with new words
  if (event.name === 'tab') {
    restartSession(state);
    return;
  }

  // Escape: quit
  if (event.name === 'escape') {
    gracefulQuit(state);
    return;
  }

  // /: open command palette
  if (event.printable && event.name === '/') {
    openCommandPalette(state);
    return;
  }

  // Any printable character: start typing
  if (event.printable && event.name !== ' ') {
    state.mode = AppMode.Typing;
    state.session.start();
    state.session.handleChar(event.name);

    // Render: typing area + mode row (timer started) + footer
    beginFrame();
    const cfg = getConfig();
    renderText(state.session, cfg);
    renderModeRow(state.session, cfg, true);
    renderLiveStats(state.session, cfg);
    renderFooter('typing');
    endFrame();
    return;
  }
}

function handleTypingInput(state: AppState, event: KeyEvent): void {
  // Tab: restart
  if (event.name === 'tab') {
    restartSession(state);
    return;
  }

  // Escape: reset to idle
  if (event.name === 'escape') {
    restartSession(state);
    return;
  }

  // Ctrl+/: open command palette during typing
  if (event.ctrl && event.name === '/') {
    openCommandPalette(state);
    return;
  }

  // ─── Typing input ─────────────────────────────────
  if (event.printable && event.name === ' ') {
    state.session.handleSpace();

    // Check if session finished (word/quote mode)
    if ((state.session.state as string) === 'finished') {
      transitionToResults(state);
      return;
    }
  } else if (event.name === 'backspace') {
    if (event.ctrl) {
      state.session.handleCtrlBackspace();
    } else {
      state.session.handleBackspace();
    }
  } else if (event.printable) {
    state.session.handleChar(event.name);
  } else {
    // Non-printable, non-special key — ignore
    return;
  }

  // Incremental render: only typing area and stats
  beginFrame();
  const cfg = getConfig();
  renderText(state.session, cfg);
  renderLiveStats(state.session, cfg);
  endFrame();
}

function handleResultsInput(state: AppState, event: KeyEvent): void {
  // ─── Debounce guard ────────────────────────────────
  // Ignore ALL input for RESULTS_DEBOUNCE_MS after entering results.
  // This prevents lingering keystrokes from skipping the results screen.
  const elapsed = Date.now() - state.resultsEnteredAt;
  if (elapsed < RESULTS_DEBOUNCE_MS) {
    return; // silently discard
  }

  // Tab: next test
  if (event.name === 'tab') {
    restartSession(state);
    return;
  }

  // Escape: quit
  if (event.name === 'escape') {
    gracefulQuit(state);
    return;
  }

  // All other keys are IGNORED in results mode.
  // User must press Tab (next test) or Escape (quit).
}

function handleCommandInput(state: AppState, event: KeyEvent): void {
  // Escape: close command palette
  if (event.name === 'escape') {
    closeCommandPalette(state);
    return;
  }

  // Enter: execute command
  if (event.name === 'enter') {
    const result = executeCommand(state.commandBuffer);

    if (result.quit) {
      exitAltScreen();
      process.exit(0);
      return;
    }

    // Close command palette
    state.commandBuffer = '';
    state.commandMessage = '';
    state.mode = AppMode.Idle;

    if (result.restart) {
      const config = getConfig();
      setTheme(config.theme);
      state.session = createSession(config);
      resetTimerCache();
    }

    // Full repaint after command
    fillBackground();
    fullRender(state);

    // Show result message temporarily
    if (result.message) {
      showMessage(state, result.message);
    }
    return;
  }

  // Backspace
  if (event.name === 'backspace') {
    if (state.commandBuffer.length > 1) {
      state.commandBuffer = state.commandBuffer.slice(0, -1);
    } else {
      // Backspace on just "/" — close palette
      closeCommandPalette(state);
      return;
    }
  } else if (event.printable) {
    state.commandBuffer += event.name;
  }

  // Re-render overlay only
  beginFrame();
  renderCommandOverlay(state.commandBuffer, state.commandMessage);
  endFrame();
}

// ─── State Transitions ───────────────────────────────────────

function transitionToResults(state: AppState): void {
  state.mode = AppMode.Results;
  state.resultsEnteredAt = Date.now();

  // Flush any pending stdin data by draining the buffer
  // (Node.js will deliver buffered keystrokes — our debounce guard handles them)

  // Compute and record metrics
  const metrics = computeMetrics(state.session);
  recordSession(metrics, state.session.mode);

  // Render results
  beginFrame();
  const config = getConfig();
  renderModeRow(state.session, config, true);
  renderSessionSummary(state.session);
  renderFooter('results');
  endFrame();
}

function restartSession(state: AppState): void {
  const config = getConfig();
  setTheme(config.theme);
  state.session = createSession(config);
  state.mode = AppMode.Idle;
  state.commandBuffer = '';
  state.commandMessage = '';
  resetTimerCache();

  fillBackground();
  fullRender(state);
}

function openCommandPalette(state: AppState): void {
  state.mode = AppMode.Command;
  state.commandBuffer = '/';
  state.commandMessage = '';

  beginFrame();
  renderCommandOverlay(state.commandBuffer, '');
  renderFooter('command');
  endFrame();
}

function closeCommandPalette(state: AppState): void {
  state.commandBuffer = '';
  state.commandMessage = '';
  state.mode = AppMode.Idle;

  // Restore the screen under the overlay
  fillBackground();
  fullRender(state);
}

function gracefulQuit(state: AppState): void {
  state.running = false;
  if (state.tickTimer) clearInterval(state.tickTimer);
  if (state.commandMessageTimeout) clearTimeout(state.commandMessageTimeout);
  exitAltScreen();
  if (process.stdin.isTTY) process.stdin.setRawMode(false);
  process.stdin.pause();
  process.exit(0);
}

// ─── Session Factory ─────────────────────────────────────────

function createSession(config: ReturnType<typeof getConfig>): TypingSession {
  switch (config.mode) {
    case 'words':
      return createWordSession(config);
    case 'quote':
      return createQuoteSession();
    case 'custom':
      return createCustomSession('The quick brown fox jumps over the lazy dog');
    case 'time':
    default:
      return createTimeSession(config);
  }
}

// ─── Rendering ───────────────────────────────────────────────

/**
 * Full render of all regions. Used on startup, resize, and session restart.
 * Buffered into a single stdout write.
 */
function fullRender(state: AppState): void {
  const config = getConfig();

  beginFrame();
  renderLogo();
  renderModeRow(state.session, config, true);
  renderSeparator();
  renderText(state.session, config);
  renderLiveStats(state.session, config);
  renderFooter(state.mode === AppMode.Results ? 'results' : 'idle');
  endFrame();
}

/**
 * Show a temporary message that auto-clears after 3 seconds.
 */
function showMessage(state: AppState, message: string): void {
  beginFrame();
  renderMessage(message);
  endFrame();

  if (state.commandMessageTimeout) {
    clearTimeout(state.commandMessageTimeout);
  }

  state.commandMessageTimeout = setTimeout(() => {
    beginFrame();
    clearMessage();
    endFrame();
  }, 3000);
}

// ─── Start ───────────────────────────────────────────────────
main().catch((err) => {
  exitAltScreen();
  console.error('Klycky error:', err);
  process.exit(1);
});
