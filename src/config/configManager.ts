

import * as fs from 'node:fs';
import * as path from 'node:path';
import { KlyckyConfig, DEFAULT_CONFIG } from './defaults.js';
import { getHomeDir } from '../utils/helpers.js';

const CONFIG_DIR = path.join(getHomeDir(), '.klycky');
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json');
const STATS_FILE = path.join(CONFIG_DIR, 'stats.json');
const HISTORY_FILE = path.join(CONFIG_DIR, 'history.json');

let config: KlyckyConfig = { ...DEFAULT_CONFIG };

function ensureConfigDir(): void {
  try {
    if (!fs.existsSync(CONFIG_DIR)) {
      fs.mkdirSync(CONFIG_DIR, { recursive: true });
    }
  } catch {

  }
}

// Loads config
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

// Saves config
export function saveConfig(): void {
  ensureConfigDir();
  try {
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2), 'utf-8');
  } catch {

  }
}

export function getConfig(): KlyckyConfig {
  return config;
}

export function updateConfig(updates: Partial<KlyckyConfig>): KlyckyConfig {
  config = { ...config, ...updates };
  saveConfig();
  return config;
}

export function resetConfig(): KlyckyConfig {
  config = { ...DEFAULT_CONFIG };
  saveConfig();
  return config;
}

export function loadHistory(): SessionRecord[] {
  ensureConfigDir();
  try {
    if (fs.existsSync(HISTORY_FILE)) {
      const raw = fs.readFileSync(HISTORY_FILE, 'utf-8');
      return JSON.parse(raw);
    }
  } catch {

  }
  return [];
}

export function saveSessionToHistory(record: SessionRecord): void {
  ensureConfigDir();
  try {
    const history = loadHistory();
    history.push(record);

    const trimmed = history.slice(-100);
    fs.writeFileSync(HISTORY_FILE, JSON.stringify(trimmed, null, 2), 'utf-8');
  } catch {

  }
}

export function loadStats(): AggregateStats {
  ensureConfigDir();
  try {
    if (fs.existsSync(STATS_FILE)) {
      const raw = fs.readFileSync(STATS_FILE, 'utf-8');
      return JSON.parse(raw);
    }
  } catch {

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

export function saveStats(stats: AggregateStats): void {
  ensureConfigDir();
  try {
    fs.writeFileSync(STATS_FILE, JSON.stringify(stats, null, 2), 'utf-8');
  } catch {

  }
}

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

export interface AggregateStats {
  totalSessions: number;
  totalTime: number;
  totalWords: number;
  bestWpm: number;
  averageWpm: number;
  averageAccuracy: number;
}
