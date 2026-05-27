

export type KeypressCallback = (key: string, raw: Buffer) => void;

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
  mouse?: boolean;
  x?: number;
  y?: number;
  mType?: 'press' | 'release';

  name: string;

  ctrl: boolean;

  printable: boolean;

  raw: string;
}

// Parses keypress
export function parseKeypress(data: Buffer): KeyEvent {
  const raw = data.toString('utf-8');
  const mouseMatch = raw.match(/^\x1b\[<([0-9]+);([0-9]+);([0-9]+)([Mm])$/);
  if (mouseMatch) {
    return {
      name: 'mouse',
      ctrl: false,
      printable: false,
      raw,
      mouse: true,
      x: parseInt(mouseMatch[2], 10),
      y: parseInt(mouseMatch[3], 10),
      mType: mouseMatch[4] === 'M' ? 'press' : 'release'
    };
  }
  

  if (raw === '\x17') { 
    return { name: 'backspace', ctrl: true, printable: false, raw };
  }

  if (raw in SPECIAL_KEYS) {

    return {
      name: SPECIAL_KEYS[raw],
      ctrl: false,
      printable: false,
      raw,
    };
  }

  if (data.length === 1 && data[0] >= 1 && data[0] <= 26) {
    const letter = String.fromCharCode(data[0] + 96); 
    return {
      name: letter,
      ctrl: true,
      printable: false,
      raw,
    };
  }

  if (data.length === 1 && data[0] >= 32 && data[0] < 127) {
    return {
      name: raw,
      ctrl: false,
      printable: true,
      raw,
    };
  }

  if (raw.length === 1 && raw.charCodeAt(0) >= 32) {
    return {
      name: raw,
      ctrl: false,
      printable: true,
      raw,
    };
  }

  return {
    name: 'unknown',
    ctrl: false,
    printable: false,
    raw,
  };
}

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

// Ons keypress
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
