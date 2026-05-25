/**
 * Klycky - Input Handler
 *
 * High-performance keyboard event processing using raw stdin mode.
 * Captures keypresses without echo, handles special keys, and dispatches to the session.
 */

export type KeypressCallback = (key: string, raw: Buffer) => void;

/** Special key mappings from raw escape sequences */
const SPECIAL_KEYS: Record<string, string> = {
  '\r': 'enter',
  '\n': 'enter',
  '\x1b': 'escape',
  '\t': 'tab',
  '\x7f': 'backspace',
  '\b': 'backspace',
  '\x1b[A': 'up',
  '\x1b[B': 'down',
  '\x1b[C': 'right',
  '\x1b[D': 'left',
  '\x1b[3~': 'delete',
  '\x1b[H': 'home',
  '\x1b[F': 'end',
};

export interface KeyEvent {
  /** The readable key name or character */
  name: string;
  /** Whether Ctrl was held */
  ctrl: boolean;
  /** Whether the key is a printable character */
  printable: boolean;
  /** The raw character sequence */
  raw: string;
}

/**
 * Parse a raw keypress buffer into a KeyEvent.
 */
export function parseKeypress(data: Buffer): KeyEvent {
  const raw = data.toString('utf-8');

  // Check for explicit Ctrl+Backspace mappings
  if (raw === '\x17') { // Ctrl+W
    return { name: 'backspace', ctrl: true, printable: false, raw };
  }

  // Check for special keys FIRST
  // This prevents \r (0x0d), \n (0x0a), \t (0x09), \b (0x08)
  // from being incorrectly parsed as Ctrl+M, Ctrl+J, Ctrl+I, Ctrl+H
  if (raw in SPECIAL_KEYS) {
    // If the terminal sends \b (0x08) for Ctrl+Backspace, we can optionally treat it as ctrl: true
    // However, on some terminals (like Windows cmd), \b is the standard backspace.
    // We'll treat \b and \x7f as standard backspace (ctrl: false).
    return {
      name: SPECIAL_KEYS[raw],
      ctrl: false,
      printable: false,
      raw,
    };
  }

  // Check for Ctrl+key combinations (0x01-0x1a)
  // Note: we've already handled \t, \n, \r, \b above
  if (data.length === 1 && data[0] >= 1 && data[0] <= 26) {
    const letter = String.fromCharCode(data[0] + 96); // a=1, b=2, etc.
    return {
      name: letter,
      ctrl: true,
      printable: false,
      raw,
    };
  }

  // Printable characters
  if (data.length === 1 && data[0] >= 32 && data[0] < 127) {
    return {
      name: raw,
      ctrl: false,
      printable: true,
      raw,
    };
  }

  // UTF-8 multibyte characters
  if (raw.length === 1 && raw.charCodeAt(0) >= 32) {
    return {
      name: raw,
      ctrl: false,
      printable: true,
      raw,
    };
  }

  // Unknown/unhandled key
  return {
    name: 'unknown',
    ctrl: false,
    printable: false,
    raw,
  };
}

/**
 * Enable raw input mode on stdin.
 * Returns a cleanup function to restore normal mode.
 */
export function enableRawMode(): () => void {
  if (process.stdin.isTTY) {
    process.stdin.setRawMode(true);
  }
  process.stdin.resume();
  process.stdin.setEncoding('utf-8');

  return () => {
    if (process.stdin.isTTY) {
      process.stdin.setRawMode(false);
    }
    process.stdin.pause();
  };
}

/**
 * Listen for keypresses and invoke the callback.
 * Returns a cleanup function to stop listening.
 */
export function onKeypress(callback: (event: KeyEvent) => void): () => void {
  const handler = (data: Buffer | string) => {
    const buf = typeof data === 'string' ? Buffer.from(data, 'utf-8') : data;
    const event = parseKeypress(buf);
    callback(event);
  };

  process.stdin.on('data', handler);

  return () => {
    process.stdin.removeListener('data', handler);
  };
}
