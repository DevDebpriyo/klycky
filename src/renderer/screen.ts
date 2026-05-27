

import { ANSI } from '../utils/ansi.js';
import { getTheme } from '../themes/themeLoader.js';
import { bgHex } from '../themes/themeTypes.js';

let writeBuffer = '';
let buffering = false;
let cursorTarget: { row: number; col: number } | null = null;

// Begins frame
export function beginFrame(): void {
  buffering = true;
  writeBuffer = '';
}

// Sets cursor
export function setCursor(row: number, col: number): void {
  cursorTarget = { row, col };
}

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

export function write(content: string): void {
  if (buffering) {
    writeBuffer += content;
  } else {
    process.stdout.write(content);
  }
}

export function enterAltScreen(): void {
  process.stdout.write(ANSI.ALT_SCREEN_ON + ANSI.CURSOR_HIDE + ANSI.MOUSE_TRACKING_ON);
  fillBackground();
}

export function exitAltScreen(): void {
  process.stdout.write(ANSI.CURSOR_SHOW + ANSI.MOUSE_TRACKING_OFF + ANSI.ALT_SCREEN_OFF + ANSI.RESET);
}

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

export function clearRow(row: number): void {
  const theme = getTheme();
  const bg = bgHex(theme.colors.background);
  const cols = process.stdout.columns || 80;
  write(ANSI.moveTo(row, 1) + bg + ' '.repeat(cols) + ANSI.RESET);
}

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

export function writeAt(row: number, col: number, text: string): void {
  write(ANSI.moveTo(row, col) + text);
}

export function onResize(callback: () => void): void {
  process.stdout.on('resize', callback);
}
