

export const ANSI = {

  CLEAR_SCREEN: '\x1b[2J',
  CLEAR_LINE: '\x1b[2K',
  CLEAR_LINE_RIGHT: '\x1b[0K',

  CURSOR_HOME: '\x1b[H',
  CURSOR_HIDE: '\x1b[?25l',
  CURSOR_SHOW: '\x1b[?25h',
  CURSOR_SAVE: '\x1b[s',
  CURSOR_RESTORE: '\x1b[u',

  ALT_SCREEN_ON: '\x1b[?1049h',
  ALT_SCREEN_OFF: '\x1b[?1049l',

  MOUSE_TRACKING_ON: '\x1b[?1000h\x1b[?1015h\x1b[?1006h',
  MOUSE_TRACKING_OFF: '\x1b[?1000l\x1b[?1015l\x1b[?1006l',
  RESET: '\x1b[0m',
  BOLD: '\x1b[1m',
  DIM: '\x1b[2m',
  ITALIC: '\x1b[3m',
  UNDERLINE: '\x1b[4m',
  INVERSE: '\x1b[7m',
  STRIKETHROUGH: '\x1b[9m',

  moveTo(row: number, col: number): string {
    return `\x1b[${row};${col}H`;
  },

  moveUp(n: number): string {
    return `\x1b[${n}A`;
  },

  moveDown(n: number): string {
    return `\x1b[${n}B`;
  },

  moveRight(n: number): string {
    return `\x1b[${n}C`;
  },

  moveLeft(n: number): string {
    return `\x1b[${n}D`;
  },

  fgRgb(r: number, g: number, b: number): string {
    return `\x1b[38;2;${r};${g};${b}m`;
  },

  bgRgb(r: number, g: number, b: number): string {
    return `\x1b[48;2;${r};${g};${b}m`;
  },

  fg256(n: number): string {
    return `\x1b[38;5;${n}m`;
  },

  bg256(n: number): string {
    return `\x1b[48;5;${n}m`;
  },
} as const;
