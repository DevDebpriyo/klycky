/**
 * Klycky - Configuration Manager
 *
 * Handles loading, saving, and managing configuration in ~/.klycky/.
 * All data is stored locally as JSON files.
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import { KlyckyConfig, DEFAULT_CONFIG } from './defaults.js';
import { getHomeDir } from '../utils/helpers.js';

/** Path to the Klycky configuration directory */
const CONFIG_DIR = path.join(getHomeDir(), '.klycky');
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json');
const STATS_FILE = path.join(CONFIG_DIR, 'stats.json');
const HISTORY_FILE = path.join(CONFIG_DIR, 'history.json');

/** In-memory config state */
let config: KlyckyConfig = { ...DEFAULT_CONFIG };

/**
 * Ensure the ~/.klycky/ directory exists.
 */
function ensureConfigDir(): void {
  try {
    if (!fs.existsSync(CONFIG_DIR)) {
      fs.mkdirSync(CONFIG_DIR, { recursive: true });
    }
  } catch {
    // Silently fail - config is optional
  }
}

/**
 * Load configuration from disk, merging with defaults.
 */
export function loadConfig(): KlyckyConfig {
  ensureConfigDir();
  try {
    if (fs.existsSync(CONFIG_FILE)) {
      const raw = fs.readFileSync(CONFIG_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      config = { ...DEFAULT_CONFIG, ...parsed };
    }
  } catch {
    config = { ...DEFAULT_CONFIG };
  }
  return config;
}

/**
 * Save current configuration to disk.
 */
export function saveConfig(): void {
  ensureConfigDir();
  try {
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2), 'utf-8');
  } catch {
    // Silently fail - config persistence is best-effort
  }
}

/**
 * Get the current configuration.
 */
export function getConfig(): KlyckyConfig {
  return config;
}

/**
 * Update configuration values (partial update).
 */
export function updateConfig(updates: Partial<KlyckyConfig>): KlyckyConfig {
  config = { ...config, ...updates };
  saveConfig();
  return config;
}

/**
 * Reset configuration to defaults.
 */
export function resetConfig(): KlyckyConfig {
  config = { ...DEFAULT_CONFIG };
  saveConfig();
  return config;
}

/**
 * Load session history from disk.
 */
export function loadHistory(): SessionRecord[] {
  ensureConfigDir();
  try {
    if (fs.existsSync(HISTORY_FILE)) {
      const raw = fs.readFileSync(HISTORY_FILE, 'utf-8');
      return JSON.parse(raw);
    }
  } catch {
    // Return empty on failure
  }
  return [];
}

/**
 * Save a session record to history.
 */
export function saveSessionToHistory(record: SessionRecord): void {
  ensureConfigDir();
  try {
    const history = loadHistory();
    history.push(record);
    // Keep last 100 sessions
    const trimmed = history.slice(-100);
    fs.writeFileSync(HISTORY_FILE, JSON.stringify(trimmed, null, 2), 'utf-8');
  } catch {
    // Silently fail
  }
}

/**
 * Load aggregate stats from disk.
 */
export function loadStats(): AggregateStats {
  ensureConfigDir();
  try {
    if (fs.existsSync(STATS_FILE)) {
      const raw = fs.readFileSync(STATS_FILE, 'utf-8');
      return JSON.parse(raw);
    }
  } catch {
    // Return defaults on failure
  }
  return {
    totalSessions: 0,
    totalTime: 0,
    totalWords: 0,
    bestWpm: 0,
    averageWpm: 0,
    averageAccuracy: 0,
  };
}

/**
 * Save aggregate stats to disk.
 */
export function saveStats(stats: AggregateStats): void {
  ensureConfigDir();
  try {
    fs.writeFileSync(STATS_FILE, JSON.stringify(stats, null, 2), 'utf-8');
  } catch {
    // Silently fail
  }
}

/**
 * Session record stored in history.
 */
export interface SessionRecord {
  timestamp: number;
  mode: string;
  duration: number;
  wpm: number;
  rawWpm: number;
  accuracy: number;
  consistency: number;
  errors: number;
  wordsTyped: number;
}

/**
 * Aggregate statistics across all sessions.
 */
export interface AggregateStats {
  totalSessions: number;
  totalTime: number;
  totalWords: number;
  bestWpm: number;
  averageWpm: number;
  averageAccuracy: number;
}
