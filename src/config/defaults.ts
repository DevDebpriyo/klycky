

export interface KlyckyConfig {

  theme: string;

  mode: string;

  timeDuration: number;

  wordCount: number;

  caretStyle: 'line' | 'block' | 'underline';

  punctuation: boolean;

  numbers: boolean;

  difficulty: 'easy' | 'normal' | 'hard';

  showSparkline: boolean;

  showAccuracy: boolean;

  zenMode: boolean;

  focusMode: boolean;
}

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
