/**
 * Klycky - Screen Controller
 *
 * Low-level terminal control with buffered output to eliminate flickering.
 * All writes are batched into a single stdout.write() call per frame.
 *
 * Key anti-flicker strategies:
 * - Single buffered write per render pass
 * - Cursor positioning instead of clearing
 * - Line-level clearing (ANSI clear-to-end) instead of full-screen clear
 * - Hidden cursor during renders
 */

import { ANSI } from '../utils/ansi.js';
import { getTheme } from '../themes/themeLoader.js';
import { bgHex } from '../themes/themeTypes.js';

// ─── Write Buffer ────────────────────────────────────────────
// Accumulate all output into a buffer, then flush once.
// This prevents interleaved partial writes that cause flickering.

let writeBuffer = '';
let buffering = false;
let cursorTarget: { row: number; col: number } | null = null;

/**
 * Begin buffering output. All write() calls will accumulate
 * until flush() is called.
 */
export function beginFrame(): void {
  buffering = true;
  writeBuffer = '';
}

/**
 * Set the final cursor position for the current frame.
 * The cursor will be moved and shown at this position when endFrame() is called.
 */
export function setCursor(row: number, col: number): void {
  cursorTarget = { row, col };
}

/**
 * Flush the accumulated buffer to stdout in a single write.
 */
export function endFrame(): void {
  if (cursorTarget) {
    writeBuffer += ANSI.moveTo(cursorTarget.row, cursorTarget.col) + ANSI.CURSOR_SHOW;
    cursorTarget = null;
  } else {
    writeBuffer += ANSI.CURSOR_HIDE;
  }

  if (writeBuffer.length > 0) {
    process.stdout.write(writeBuffer);
  }
  writeBuffer = '';
  buffering = false;
}

/**
 * Write content to stdout (or buffer if buffering is active).
 */
export function write(content: string): void {
  if (buffering) {
    writeBuffer += content;
  } else {
    process.stdout.write(content);
  }
}

/**
 * Enter the alternate screen buffer and prepare for rendering.
 */
export function enterAltScreen(): void {
  process.stdout.write(ANSI.ALT_SCREEN_ON + ANSI.CURSOR_HIDE);
  fillBackground();
}

/**
 * Exit the alternate screen buffer and restore terminal state.
 */
export function exitAltScreen(): void {
  process.stdout.write(ANSI.CURSOR_SHOW + ANSI.ALT_SCREEN_OFF + ANSI.RESET);
}

/**
 * Fill the entire screen with the theme background color.
 * Used only on initial render and terminal resize — never during typing.
 */
export function fillBackground(): void {
  const theme = getTheme();
  const bg = bgHex(theme.colors.background);
  const rows = process.stdout.rows || 24;
  const cols = process.stdout.columns || 80;

  let buf = ANSI.CURSOR_HOME;
  const line = bg + ' '.repeat(cols) + ANSI.RESET;
  for (let i = 0; i < rows; i++) {
    buf += line;
  }
  buf += ANSI.CURSOR_HOME;
  process.stdout.write(buf);
}

/**
 * Clear a specific row by overwriting it with background color.
 * Uses a single positioned write — no screen-level clearing.
 */
export function clearRow(row: number): void {
  const theme = getTheme();
  const bg = bgHex(theme.colors.background);
  const cols = process.stdout.columns || 80;
  write(ANSI.moveTo(row, 1) + bg + ' '.repeat(cols) + ANSI.RESET);
}

/**
 * Clear a range of rows efficiently in a single buffered write.
 */
export function clearRows(startRow: number, endRow: number): void {
  const theme = getTheme();
  const bg = bgHex(theme.colors.background);
  const cols = process.stdout.columns || 80;
  const line = bg + ' '.repeat(cols) + ANSI.RESET;

  let buf = '';
  for (let r = startRow; r <= endRow; r++) {
    buf += ANSI.moveTo(r, 1) + line;
  }
  write(buf);
}

/**
 * Write text at a specific row/col position.
 */
export function writeAt(row: number, col: number, text: string): void {
  write(ANSI.moveTo(row, col) + text);
}

/**
 * Listen for terminal resize events.
 */
export function onResize(callback: () => void): void {
  process.stdout.on('resize', callback);
}
