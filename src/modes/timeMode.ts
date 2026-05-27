

import { TypingSession } from '../engine/session.js';
import { generateWords } from '../engine/wordGenerator.js';
import { KlyckyConfig } from '../config/defaults.js';

export function createTimeSession(config: KlyckyConfig): TypingSession {

  const estimatedWords = Math.ceil((80 * config.timeDuration) / 60 * 1.5);

  const words = generateWords({
    count: Math.max(50, estimatedWords),
    difficulty: config.difficulty,
    punctuation: config.punctuation,
    numbers: config.numbers,
  });

  return new TypingSession(words, 'time', config.timeDuration * 1000);
}

export const TIME_PRESETS = [15, 30, 60, 120];
