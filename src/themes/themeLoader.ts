/**
 * Klycky - Theme Loader
 *
 * Manages theme selection, switching, and provides the current active theme.
 */

import { KlyckyTheme } from './themeTypes.js';
import { THEMES, catppuccin } from './themes.js';

/** The currently active theme */
let currentTheme: KlyckyTheme = catppuccin;

/**
 * Get the currently active theme.
 */
export function getTheme(): KlyckyTheme {
  return currentTheme;
}

/**
 * Set the active theme by name.
 * Returns true if the theme was found and applied, false otherwise.
 */
export function setTheme(name: string): boolean {
  const normalized = name.toLowerCase().trim();
  const theme = THEMES[normalized];
  if (theme) {
    currentTheme = theme;
    return true;
  }
  return false;
}

/**
 * Get a theme by name without setting it as active.
 */
export function getThemeByName(name: string): KlyckyTheme | undefined {
  return THEMES[name.toLowerCase().trim()];
}

/**
 * Check if a theme exists by name.
 */
export function themeExists(name: string): boolean {
  return name.toLowerCase().trim() in THEMES;
}
