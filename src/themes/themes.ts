/**
 * Klycky - Theme Definitions
 *
 * All built-in themes following the KlyckyTheme interface.
 * Ported from popular color schemes: Catppuccin, Tokyo Night, Nord, Gruvbox, Monokai, GitHub Dark.
 */

import { KlyckyTheme } from './themeTypes.js';

// ─── Catppuccin Mocha ────────────────────────────────────────
export const catppuccin: KlyckyTheme = {
  name: 'catppuccin',
  displayName: 'Catppuccin Mocha',
  variant: 'dark',
  colors: {
    background: '#1e1e2e',
    foreground: '#cdd6f4',
    dimmed: '#585b70',
    active: '#cba6f7',
    correct: '#a6e3a1',
    error: '#f38ba8',
    extra: '#f2cdcd',
    caret: '#f5e0dc',
    accent: '#cba6f7',
    accentSecondary: '#89b4fa',
    separator: '#45475a',
    statusBg: '#181825',
    statusFg: '#a6adc8',
    success: '#a6e3a1',
    warning: '#f9e2af',
    info: '#89dceb',
  },
};

// ─── Tokyo Night ─────────────────────────────────────────────
export const tokyoNight: KlyckyTheme = {
  name: 'tokyo-night',
  displayName: 'Tokyo Night',
  variant: 'dark',
  colors: {
    background: '#1a1b26',
    foreground: '#c0caf5',
    dimmed: '#565f89',
    active: '#bb9af7',
    correct: '#9ece6a',
    error: '#f7768e',
    extra: '#e0af68',
    caret: '#c0caf5',
    accent: '#7aa2f7',
    accentSecondary: '#bb9af7',
    separator: '#3b4261',
    statusBg: '#16161e',
    statusFg: '#a9b1d6',
    success: '#9ece6a',
    warning: '#e0af68',
    info: '#7dcfff',
  },
};

// ─── Nord ────────────────────────────────────────────────────
export const nord: KlyckyTheme = {
  name: 'nord',
  displayName: 'Nord',
  variant: 'dark',
  colors: {
    background: '#2e3440',
    foreground: '#d8dee9',
    dimmed: '#4c566a',
    active: '#88c0d0',
    correct: '#a3be8c',
    error: '#bf616a',
    extra: '#d08770',
    caret: '#eceff4',
    accent: '#81a1c1',
    accentSecondary: '#5e81ac',
    separator: '#3b4252',
    statusBg: '#242933',
    statusFg: '#e5e9f0',
    success: '#a3be8c',
    warning: '#ebcb8b',
    info: '#88c0d0',
  },
};

// ─── Gruvbox Dark ────────────────────────────────────────────
export const gruvbox: KlyckyTheme = {
  name: 'gruvbox',
  displayName: 'Gruvbox Dark',
  variant: 'dark',
  colors: {
    background: '#282828',
    foreground: '#ebdbb2',
    dimmed: '#665c54',
    active: '#fabd2f',
    correct: '#b8bb26',
    error: '#fb4934',
    extra: '#fe8019',
    caret: '#fbf1c7',
    accent: '#83a598',
    accentSecondary: '#d3869b',
    separator: '#3c3836',
    statusBg: '#1d2021',
    statusFg: '#d5c4a1',
    success: '#b8bb26',
    warning: '#fabd2f',
    info: '#83a598',
  },
};

// ─── Monokai Pro ─────────────────────────────────────────────
export const monokai: KlyckyTheme = {
  name: 'monokai',
  displayName: 'Monokai Pro',
  variant: 'dark',
  colors: {
    background: '#2d2a2e',
    foreground: '#fcfcfa',
    dimmed: '#727072',
    active: '#ffd866',
    correct: '#a9dc76',
    error: '#ff6188',
    extra: '#fc9867',
    caret: '#fcfcfa',
    accent: '#78dce8',
    accentSecondary: '#ab9df2',
    separator: '#403e41',
    statusBg: '#221f22',
    statusFg: '#c1c0c0',
    success: '#a9dc76',
    warning: '#ffd866',
    info: '#78dce8',
  },
};

// ─── GitHub Dark ─────────────────────────────────────────────
export const githubDark: KlyckyTheme = {
  name: 'github-dark',
  displayName: 'GitHub Dark',
  variant: 'dark',
  colors: {
    background: '#0d1117',
    foreground: '#c9d1d9',
    dimmed: '#484f58',
    active: '#58a6ff',
    correct: '#3fb950',
    error: '#f85149',
    extra: '#d29922',
    caret: '#f0f6fc',
    accent: '#58a6ff',
    accentSecondary: '#bc8cff',
    separator: '#21262d',
    statusBg: '#010409',
    statusFg: '#8b949e',
    success: '#3fb950',
    warning: '#d29922',
    info: '#58a6ff',
  },
};

/**
 * Registry of all built-in themes.
 */
export const THEMES: Record<string, KlyckyTheme> = {
  catppuccin,
  'tokyo-night': tokyoNight,
  nord,
  gruvbox,
  monokai,
  'github-dark': githubDark,
};

/**
 * Get sorted list of all available theme names.
 */
export function getThemeNames(): string[] {
  return Object.keys(THEMES).sort();
}
