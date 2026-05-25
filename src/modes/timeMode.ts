/**
 * Klycky - Time Mode
 *
 * Fixed-duration typing mode (15s, 30s, 60s).
 * Session ends when the timer expires.
 */

import { TypingSession } from '../engine/session.js';
import { generateWords } from '../engine/wordGenerator.js';
import { KlyckyConfig } from '../config/defaults.js';

/**
 * Create a new time mode session.
 */
export function createTimeSession(config: KlyckyConfig): TypingSession {
  // Generate enough words for the time duration
  // Estimate: ~80 WPM max * (duration/60) * 1.5 buffer
  const estimatedWords = Math.ceil((80 * config.timeDuration) / 60 * 1.5);

  const words = generateWords({
    count: Math.max(50, estimatedWords),
    difficulty: config.difficulty,
    punctuation: config.punctuation,
    numbers: config.numbers,
  });

  return new TypingSession(words, 'time', config.timeDuration * 1000);
}

/** Valid time duration presets */
export const TIME_PRESETS = [15, 30, 60, 120];
