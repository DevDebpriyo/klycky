/**
 * Klycky - Word Count Mode
 *
 * Fixed word-count typing mode (25, 50, 100 words).
 * Session ends when all words are completed.
 */

import { TypingSession } from '../engine/session.js';
import { generateWords } from '../engine/wordGenerator.js';
import { KlyckyConfig } from '../config/defaults.js';

/**
 * Create a new word count mode session.
 */
export function createWordSession(config: KlyckyConfig): TypingSession {
  const words = generateWords({
    count: config.wordCount,
    difficulty: config.difficulty,
    punctuation: config.punctuation,
    numbers: config.numbers,
  });

  return new TypingSession(words, 'words', 0);
}

/** Valid word count presets */
export const WORD_PRESETS = [10, 25, 50, 100];
