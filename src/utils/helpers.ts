

// Clamps
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

// Gets terminal width
export function getTerminalWidth(): number {
  return process.stdout.columns || 80;
}

export function getTerminalHeight(): number {
  return process.stdout.rows || 24;
}

export function centerText(text: string, width?: number): string {
  const w = width ?? getTerminalWidth();
  const stripped = stripAnsi(text);
  const padding = Math.max(0, Math.floor((w - stripped.length) / 2));
  return ' '.repeat(padding) + text;
}

export function stripAnsi(str: string): string {

  return str.replace(/\x1b\[[0-9;]*[a-zA-Z]/g, '');
}

export function visibleLength(str: string): number {
  return stripAnsi(str).length;
}

export function padRight(str: string, length: number): string {
  const visible = visibleLength(str);
  if (visible >= length) return str;
  return str + ' '.repeat(length - visible);
}

export function padLeft(str: string, length: number): string {
  const visible = visibleLength(str);
  if (visible >= length) return str;
  return ' '.repeat(length - visible) + str;
}

export function shuffle<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function formatPercent(value: number): string {
  return `${Math.round(value)}%`;
}

export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  if (mins === 0) return `${secs}s`;
  return `${mins}m ${secs}s`;
}

export function getHomeDir(): string {
  return process.env.HOME || process.env.USERPROFILE || '~';
}
