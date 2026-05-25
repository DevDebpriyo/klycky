/**
 * Klycky - Default Configuration
 *
 * Defines the default settings applied when no user configuration exists.
 */

export interface KlyckyConfig {
  /** Current theme name */
  theme: string;

  /** Typing mode: 'time' | 'words' | 'quote' | 'custom' */
  mode: string;

  /** Time duration in seconds (for time mode) */
  timeDuration: number;

  /** Word count target (for word count mode) */
  wordCount: number;

  /** Caret style: 'line' | 'block' | 'underline' */
  caretStyle: 'line' | 'block' | 'underline';

  /** Whether to include punctuation in generated text */
  punctuation: boolean;

  /** Whether to include numbers in generated text */
  numbers: boolean;

  /** Difficulty level: 'easy' | 'normal' | 'hard' */
  difficulty: 'easy' | 'normal' | 'hard';

  /** Show live WPM sparkline during typing */
  showSparkline: boolean;

  /** Show live accuracy meter during typing */
  showAccuracy: boolean;

  /** Zen mode - minimal UI */
  zenMode: boolean;

  /** Focus mode - hide non-essential elements */
  focusMode: boolean;
}

/**
 * Default configuration values.
 */
export const DEFAULT_CONFIG: KlyckyConfig = {
  theme: 'catppuccin',
  mode: 'time',
  timeDuration: 30,
  wordCount: 50,
  caretStyle: 'line',
  punctuation: false,
  numbers: false,
  difficulty: 'normal',
  showSparkline: true,
  showAccuracy: true,
  zenMode: false,
  focusMode: false,
};
