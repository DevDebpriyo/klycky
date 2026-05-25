/**
 * Klycky - Custom Text Mode
 *
 * User-provided text for typing practice.
 */

import { TypingSession } from '../engine/session.js';

/**
 * Create a session from custom user text.
 */
export function createCustomSession(text: string): TypingSession {
  const words = text.trim().split(/\s+/).filter((w) => w.length > 0);
  if (words.length === 0) {
    return new TypingSession(['type', 'something', 'here'], 'custom', 0);
  }
  return new TypingSession(words, 'custom', 0);
}
