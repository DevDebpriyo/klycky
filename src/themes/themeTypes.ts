/**
 * Klycky - Theme Type Definitions
 *
 * Defines the color palette schema and interface tokens for all themes.
 * Every theme must implement the KlyckyTheme interface.
 */

/**
 * Hex color string (e.g., "#cdd6f4")
 */
export type HexColor = string;

/**
 * Complete theme interface defining all color tokens.
 */
export interface KlyckyTheme {
  /** Unique theme identifier */
  name: string;

  /** Human-readable display name */
  displayName: string;

  /** Theme variant for categorization */
  variant: 'dark' | 'light';

  colors: {
    /** Main background color */
    background: HexColor;

    /** Primary foreground / text color */
    foreground: HexColor;

    /** Dimmed / secondary text (for upcoming words) */
    dimmed: HexColor;

    /** Active / currently typed word highlight */
    active: HexColor;

    /** Correct character color */
    correct: HexColor;

    /** Incorrect / error character color */
    error: HexColor;

    /** Extra (overtyped) character color */
    extra: HexColor;

    /** Caret / cursor color */
    caret: HexColor;

    /** Primary accent color (UI highlights, sparkline peaks) */
    accent: HexColor;

    /** Secondary accent (subtle highlights) */
    accentSecondary: HexColor;

    /** Separator / border color */
    separator: HexColor;

    /** Status bar / header background */
    statusBg: HexColor;

    /** Status bar / header text */
    statusFg: HexColor;

    /** Success / positive indicator */
    success: HexColor;

    /** Warning indicator */
    warning: HexColor;

    /** Info / neutral indicator */
    info: HexColor;
  };
}

/**
 * Parse a hex color string to RGB components.
 */
export function hexToRgb(hex: HexColor): { r: number; g: number; b: number } {
  const clean = hex.replace('#', '');
  return {
    r: parseInt(clean.substring(0, 2), 16),
    g: parseInt(clean.substring(2, 4), 16),
    b: parseInt(clean.substring(4, 6), 16),
  };
}

/**
 * Apply a hex foreground color using ANSI escape codes.
 */
export function fgHex(hex: HexColor): string {
  const { r, g, b } = hexToRgb(hex);
  return `\x1b[38;2;${r};${g};${b}m`;
}

/**
 * Apply a hex background color using ANSI escape codes.
 */
export function bgHex(hex: HexColor): string {
  const { r, g, b } = hexToRgb(hex);
  return `\x1b[48;2;${r};${g};${b}m`;
}

/**
 * Apply both foreground and background hex colors.
 */
export function colorize(text: string, fg: HexColor, bg?: HexColor): string {
  const reset = '\x1b[0m';
  const fgCode = fgHex(fg);
  const bgCode = bg ? bgHex(bg) : '';
  return `${fgCode}${bgCode}${text}${reset}`;
}
