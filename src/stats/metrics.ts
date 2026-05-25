/**
 * Klycky - Metrics Calculator
 *
 * Computes typing performance metrics from session data.
 * Provides formatted metric output for display.
 */

import { TypingSession } from '../engine/session.js';

/**
 * Complete set of metrics for a finished session.
 */
export interface SessionMetrics {
  wpm: number;
  rawWpm: number;
  accuracy: number;
  consistency: number;
  errors: number;
  totalChars: number;
  correctChars: number;
  wordsTyped: number;
  duration: number;
  bestStreak: number;
  wpmSamples: number[];
}

/**
 * Extract all metrics from a completed typing session.
 */
export function computeMetrics(session: TypingSession): SessionMetrics {
  return {
    wpm: Math.round(session.calculateWpm()),
    rawWpm: Math.round(session.calculateRawWpm()),
    accuracy: Math.round(session.calculateAccuracy() * 10) / 10,
    consistency: Math.round(session.calculateConsistency() * 10) / 10,
    errors: session.totalErrors,
    totalChars: session.totalKeypresses,
    correctChars: session.getCorrectCharacters(),
    wordsTyped: session.getCompletedWordCount(),
    duration: Math.round(session.getElapsedSeconds()),
    bestStreak: session.bestStreak,
    wpmSamples: [...session.wpmSamples],
  };
}

/**
 * Generate a sparkline string from WPM samples.
 * Uses Unicode block elements: ▁▂▃▄▅▆▇█
 */
export function generateSparkline(samples: number[], maxWidth: number = 20): string {
  if (samples.length === 0) return '';

  const blocks = ['▁', '▂', '▃', '▄', '▅', '▆', '▇', '█'];

  // Use only the most recent samples that fit the width
  const displaySamples = samples.slice(-maxWidth);

  const min = Math.min(...displaySamples);
  const max = Math.max(...displaySamples);
  const range = max - min || 1;

  return displaySamples
    .map((val) => {
      const normalized = (val - min) / range;
      const index = Math.min(Math.floor(normalized * (blocks.length - 1)), blocks.length - 1);
      return blocks[index];
    })
    .join('');
}

/**
 * Generate an accuracy meter bar.
 * Example: █████████░ 98%
 */
export function generateAccuracyMeter(accuracy: number, width: number = 10): string {
  const filled = Math.round((accuracy / 100) * width);
  const empty = width - filled;
  return '█'.repeat(filled) + '░'.repeat(empty) + ` ${Math.round(accuracy)}%`;
}

/**
 * Generate flow indicator based on current streak.
 */
export function generateFlowIndicator(streak: number): string {
  if (streak >= 50) return 'flow ✦✦✦';
  if (streak >= 30) return 'flow ✦✦';
  if (streak >= 15) return 'flow ✦';
  return '';
}
