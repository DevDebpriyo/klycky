

export type HexColor = string;

export interface KlyckyTheme {

  name: string;

  displayName: string;

  variant: 'dark' | 'light';

  colors: {

    background: HexColor;

    foreground: HexColor;

    dimmed: HexColor;

    active: HexColor;

    correct: HexColor;

    error: HexColor;

    extra: HexColor;

    caret: HexColor;

    accent: HexColor;

    accentSecondary: HexColor;

    separator: HexColor;

    statusBg: HexColor;

    statusFg: HexColor;

    success: HexColor;

    warning: HexColor;

    info: HexColor;
  };
}

export function hexToRgb(hex: HexColor): { r: number; g: number; b: number } {
  const clean = hex.replace('#', '');
  return {
    r: parseInt(clean.substring(0, 2), 16),
    g: parseInt(clean.substring(2, 4), 16),
    b: parseInt(clean.substring(4, 6), 16),
  };
}

// Fgs hex
export function fgHex(hex: HexColor): string {
  const { r, g, b } = hexToRgb(hex);
  return `\x1b[38;2;${r};${g};${b}m`;
}

export function bgHex(hex: HexColor): string {
  const { r, g, b } = hexToRgb(hex);
  return `\x1b[48;2;${r};${g};${b}m`;
}

// Colorizes
export function colorize(text: string, fg: HexColor, bg?: HexColor): string {
  const reset = '\x1b[0m';
  const fgCode = fgHex(fg);
  const bgCode = bg ? bgHex(bg) : '';
  return `${fgCode}${bgCode}${text}${reset}`;
}
