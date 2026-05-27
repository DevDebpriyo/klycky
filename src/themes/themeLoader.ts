

import { KlyckyTheme } from './themeTypes.js';
import { THEMES, catppuccin } from './themes.js';

let currentTheme: KlyckyTheme = catppuccin;

// Gets theme
export function getTheme(): KlyckyTheme {
  return currentTheme;
}

// Sets theme
export function setTheme(name: string): boolean {
  const normalized = name.toLowerCase().trim();
  const theme = THEMES[normalized];
  if (theme) {
    currentTheme = theme;
    return true;
  }
  return false;
}

export function getThemeByName(name: string): KlyckyTheme | undefined {
  return THEMES[name.toLowerCase().trim()];
}

export function themeExists(name: string): boolean {
  return name.toLowerCase().trim() in THEMES;
}
