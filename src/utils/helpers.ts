/**
 * Klycky - Shared utility functions
 */

/**
 * Clamp a number between min and max values.
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * Get the terminal width, with a fallback.
 */
export function getTerminalWidth(): number {
  return process.stdout.columns || 80;
}

/**
 * Get the terminal height, with a fallback.
 */
export function getTerminalHeight(): number {
  return process.stdout.rows || 24;
}

/**
 * Center a string within a given width.
 */
export function centerText(text: string, width?: number): string {
  const w = width ?? getTerminalWidth();
  const stripped = stripAnsi(text);
  const padding = Math.max(0, Math.floor((w - stripped.length) / 2));
  return ' '.repeat(padding) + text;
}

/**
 * Strip ANSI escape codes from a string to get the visible length.
 */
export function stripAnsi(str: string): string {
  // eslint-disable-next-line no-control-regex
  return str.replace(/\x1b\[[0-9;]*[a-zA-Z]/g, '');
}

/**
 * Get the visible length of a string (excluding ANSI codes).
 */
export function visibleLength(str: string): number {
  return stripAnsi(str).length;
}

/**
 * Pad a string to a fixed visible length (right-pad).
 */
export function padRight(str: string, length: number): string {
  const visible = visibleLength(str);
  if (visible >= length) return str;
  return str + ' '.repeat(length - visible);
}

/**
 * Pad a string to a fixed visible length (left-pad).
 */
export function padLeft(str: string, length: number): string {
  const visible = visibleLength(str);
  if (visible >= length) return str;
  return ' '.repeat(length - visible) + str;
}

/**
 * Shuffle an array in-place using Fisher-Yates algorithm.
 */
export function shuffle<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

/**
 * Create a delay (async sleep).
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Format a number as a percentage string.
 */
export function formatPercent(value: number): string {
  return `${Math.round(value)}%`;
}

/**
 * Format a duration in seconds to a readable string.
 */
export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  if (mins === 0) return `${secs}s`;
  return `${mins}m ${secs}s`;
}

/**
 * Get user's home directory.
 */
export function getHomeDir(): string {
  return process.env.HOME || process.env.USERPROFILE || '~';
}
