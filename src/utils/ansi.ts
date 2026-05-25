/**
 * Klycky - ANSI escape code constants for terminal control.
 * Used by the rendering system for cursor movement, screen clearing, and styling.
 */

export const ANSI = {
  // Screen control
  CLEAR_SCREEN: '\x1b[2J',
  CLEAR_LINE: '\x1b[2K',
  CLEAR_LINE_RIGHT: '\x1b[0K',

  // Cursor
  CURSOR_HOME: '\x1b[H',
  CURSOR_HIDE: '\x1b[?25l',
  CURSOR_SHOW: '\x1b[?25h',
  CURSOR_SAVE: '\x1b[s',
  CURSOR_RESTORE: '\x1b[u',

  // Alt screen buffer
  ALT_SCREEN_ON: '\x1b[?1049h',
  ALT_SCREEN_OFF: '\x1b[?1049l',

  // Style reset
  RESET: '\x1b[0m',
  BOLD: '\x1b[1m',
  DIM: '\x1b[2m',
  ITALIC: '\x1b[3m',
  UNDERLINE: '\x1b[4m',
  INVERSE: '\x1b[7m',
  STRIKETHROUGH: '\x1b[9m',

  /**
   * Move cursor to specific row/column (1-indexed).
   */
  moveTo(row: number, col: number): string {
    return `\x1b[${row};${col}H`;
  },

  /**
   * Move cursor up N rows.
   */
  moveUp(n: number): string {
    return `\x1b[${n}A`;
  },

  /**
   * Move cursor down N rows.
   */
  moveDown(n: number): string {
    return `\x1b[${n}B`;
  },

  /**
   * Move cursor right N columns.
   */
  moveRight(n: number): string {
    return `\x1b[${n}C`;
  },

  /**
   * Move cursor left N columns.
   */
  moveLeft(n: number): string {
    return `\x1b[${n}D`;
  },

  /**
   * Set foreground color using RGB values.
   */
  fgRgb(r: number, g: number, b: number): string {
    return `\x1b[38;2;${r};${g};${b}m`;
  },

  /**
   * Set background color using RGB values.
   */
  bgRgb(r: number, g: number, b: number): string {
    return `\x1b[48;2;${r};${g};${b}m`;
  },

  /**
   * Set foreground color using 256-color palette.
   */
  fg256(n: number): string {
    return `\x1b[38;5;${n}m`;
  },

  /**
   * Set background color using 256-color palette.
   */
  bg256(n: number): string {
    return `\x1b[48;5;${n}m`;
  },
} as const;
