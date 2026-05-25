/**
 * Klycky - History Manager
 *
 * Manages session history persistence and aggregate statistics.
 */

import {
  loadHistory,
  saveSessionToHistory,
  loadStats,
  saveStats,
  SessionRecord,
  AggregateStats,
} from '../config/configManager.js';
import { SessionMetrics } from './metrics.js';

/**
 * Record a completed session to history and update aggregate stats.
 */
export function recordSession(metrics: SessionMetrics, mode: string): void {
  // Save individual session record
  const record: SessionRecord = {
    timestamp: Date.now(),
    mode,
    duration: metrics.duration,
    wpm: metrics.wpm,
    rawWpm: metrics.rawWpm,
    accuracy: metrics.accuracy,
    consistency: metrics.consistency,
    errors: metrics.errors,
    wordsTyped: metrics.wordsTyped,
  };
  saveSessionToHistory(record);

  // Update aggregate stats
  const stats = loadStats();
  stats.totalSessions++;
  stats.totalTime += metrics.duration;
  stats.totalWords += metrics.wordsTyped;
  if (metrics.wpm > stats.bestWpm) {
    stats.bestWpm = metrics.wpm;
  }

  // Rolling average
  const prevTotal = stats.averageWpm * (stats.totalSessions - 1);
  stats.averageWpm = Math.round((prevTotal + metrics.wpm) / stats.totalSessions);

  const prevAccTotal = stats.averageAccuracy * (stats.totalSessions - 1);
  stats.averageAccuracy =
    Math.round(((prevAccTotal + metrics.accuracy) / stats.totalSessions) * 10) / 10;

  saveStats(stats);
}

/**
 * Get recent session history.
 */
export function getRecentHistory(count: number = 10): SessionRecord[] {
  const history = loadHistory();
  return history.slice(-count);
}

/**
 * Get the user's best WPM from history.
 */
export function getBestWpm(): number {
  const stats = loadStats();
  return stats.bestWpm;
}

/**
 * Get aggregate statistics.
 */
export function getAggregateStats(): AggregateStats {
  return loadStats();
}
