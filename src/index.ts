#!/usr/bin/env node

import packageJson from '../package.json' with { type: 'json' };
import { loadConfig, getConfig, updateConfig } from './config/index.js';
import { setTheme, getThemeNames } from './themes/index.js';
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
  renderThemePicker, clearThemePicker,
} from './renderer/statusBar.js';
import { calculateLayout } from './renderer/layout.js';
import { createTimeSession } from './modes/timeMode.js';
import { createWordSession } from './modes/wordMode.js';
import { createQuoteSession } from './modes/quoteMode.js';
import { createCustomSession } from './modes/customMode.js';
import { executeCommand } from './commands/commandParser.js';
import { computeMetrics } from './stats/metrics.js';
import { recordSession } from './stats/history.js';

// Argses
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
  console.log(`klycky v${packageJson.version}`);
  process.exit(0);
}

const enum AppMode {
  Idle = 0,
  Typing = 1,
  Results = 2,
  Command = 3,
  ThemePicker = 5,
}

interface AppState {
  mode: AppMode;
  session: TypingSession;

  commandBuffer: string;
  commandMessage: string;
  commandMessageTimeout: ReturnType<typeof setTimeout> | null;

  tickTimer: ReturnType<typeof setInterval> | null;

  resultsEnteredAt: number;

  themePickerIndex: number;
  themePickerOriginal: string;

  running: boolean;
}

const RESULTS_DEBOUNCE_MS = 400;

const TIMER_TICK_MS = 200;

async function main(): Promise<void> {

  loadConfig();

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

  const currentConfig = getConfig();
  setTheme(currentConfig.theme);

  const state: AppState = {
    mode: AppMode.Idle,
    session: createSession(currentConfig),
    commandBuffer: '',
    commandMessage: '',
    commandMessageTimeout: null,
    tickTimer: null,
    resultsEnteredAt: 0,
    themePickerIndex: 0,
    themePickerOriginal: '',
    running: true,
  };

  enterAltScreen();
  const disableRawMode = enableRawMode();

  const cleanup = () => {
    if (state.tickTimer) clearInterval(state.tickTimer);
    if (state.commandMessageTimeout) clearTimeout(state.commandMessageTimeout);
    exitAltScreen();
    disableRawMode();
  };

  process.on('SIGINT', () => { cleanup(); process.exit(0); });
  process.on('SIGTERM', () => { cleanup(); process.exit(0); });

  onResize(() => {
    fillBackground();
    fullRender(state);
  });

  fullRender(state);

  state.tickTimer = setInterval(() => {
    if (state.mode === AppMode.Typing && state.session.state === 'active') {

      if (state.session.isTimeUp()) {
        state.session.finish();
        transitionToResults(state);
        return;
      }

      beginFrame();
      const cfg = getConfig();
      renderModeRow(state.session, cfg);
      endFrame();
    }
  }, TIMER_TICK_MS);

  onKeypress((event: KeyEvent) => {
    if (!state.running) return;



    if (event.ctrl && event.name === 'c') {
      state.running = false;
      cleanup();
      process.exit(0);
      return;
    }

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
      case AppMode.ThemePicker:
        handleThemePickerInput(state, event);
        break;
    }
  });
}

// Handles idle input
function handleIdleInput(state: AppState, event: KeyEvent): void {

  if (event.name === 'tab') {
    restartSession(state);
    return;
  }

  if (event.name === 'escape') {
    gracefulQuit(state);
    return;
  }

  if (event.printable && event.name === '/') {
    openCommandPalette(state);
    return;
  }

  if (event.printable && event.name !== ' ') {
    state.mode = AppMode.Typing;
    state.session.start();
    state.session.handleChar(event.name);

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

  if (event.name === 'tab') {
    restartSession(state);
    return;
  }

  if (event.name === 'escape') {
    restartSession(state);
    return;
  }

  if (event.ctrl && event.name === '/') {
    openCommandPalette(state);
    return;
  }

  if (event.printable && event.name === ' ') {
    state.session.handleSpace();

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

    return;
  }

  beginFrame();
  const cfg = getConfig();
  renderText(state.session, cfg);
  renderLiveStats(state.session, cfg);
  endFrame();
}

function handleResultsInput(state: AppState, event: KeyEvent): void {

  const elapsed = Date.now() - state.resultsEnteredAt;
  if (elapsed < RESULTS_DEBOUNCE_MS) {
    return;
  }

  if (event.name === 'tab') {
    restartSession(state);
    return;
  }

  if (event.name === 'escape') {
    gracefulQuit(state);
    return;
  }

}



function handleCommandInput(state: AppState, event: KeyEvent): void {

  if (event.name === 'escape') {
    closeCommandPalette(state);
    return;
  }

  if (event.name === 'enter') {
    const result = executeCommand(state.commandBuffer);

    if (result.quit) {
      exitAltScreen();
      process.exit(0);
      return;
    }

    if (result.openThemePicker) {
      openThemePickerPalette(state);
      return;
    }

    state.commandBuffer = '';
    state.commandMessage = '';
    state.mode = AppMode.Idle;

    if (result.restart) {
      const config = getConfig();
      setTheme(config.theme);
      state.session = createSession(config);
      resetTimerCache();
    }

    fillBackground();
    fullRender(state);

    if (result.message) {
      showMessage(state, result.message);
    }
    return;
  }

  if (event.name === 'backspace') {
    if (state.commandBuffer.length > 1) {
      state.commandBuffer = state.commandBuffer.slice(0, -1);
    } else {

      closeCommandPalette(state);
      return;
    }
  } else if (event.printable) {
    state.commandBuffer += event.name;
  }

  beginFrame();
  renderCommandOverlay(state.commandBuffer, state.commandMessage);
  endFrame();
}



function transitionToResults(state: AppState): void {
  state.mode = AppMode.Results;
  state.resultsEnteredAt = Date.now();

  const metrics = computeMetrics(state.session);
  recordSession(metrics, state.session.mode);

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

  fillBackground();
  fullRender(state);
}

function openThemePickerPalette(state: AppState): void {
  const config = getConfig();
  state.themePickerOriginal = config.theme;

  const themes = getThemeNames();
  state.themePickerIndex = Math.max(0, themes.indexOf(config.theme));
  state.mode = AppMode.ThemePicker;
  state.commandBuffer = '';
  state.commandMessage = '';

  fillBackground();
  beginFrame();
  renderLogo();
  renderThemePicker(state.themePickerIndex);
  renderFooter('idle');
  endFrame();
}

function handleThemePickerInput(state: AppState, event: KeyEvent): void {
  const themes = getThemeNames();

  if (event.name === 'escape') {
    // revert to the original theme
    setTheme(state.themePickerOriginal);
    updateConfig({ theme: state.themePickerOriginal });
    state.mode = AppMode.Idle;
    state.session = createSession(getConfig());
    resetTimerCache();
    fillBackground();
    fullRender(state);
    return;
  }

  if (event.name === 'enter') {
    // confirm current selection
    const selectedTheme = themes[state.themePickerIndex];
    updateConfig({ theme: selectedTheme });
    state.mode = AppMode.Idle;
    state.session = createSession(getConfig());
    resetTimerCache();
    fillBackground();
    fullRender(state);
    showMessage(state, `Theme set to ${selectedTheme}`);
    return;
  }

  if (event.name === 'up' || event.name === 'down') {
    if (event.name === 'up') {
      state.themePickerIndex = (state.themePickerIndex - 1 + themes.length) % themes.length;
    } else {
      state.themePickerIndex = (state.themePickerIndex + 1) % themes.length;
    }

    // live preview
    const previewTheme = themes[state.themePickerIndex];
    setTheme(previewTheme);

    fillBackground();
    beginFrame();
    renderLogo();
    renderThemePicker(state.themePickerIndex);
    renderFooter('idle');
    endFrame();
    return;
  }
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

main().catch((err) => {
  exitAltScreen();
  console.error('Klycky error:', err);
  process.exit(1);
});
