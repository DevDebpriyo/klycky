

import { updateConfig, getConfig, resetConfig, KlyckyConfig } from '../config/index.js';
import { setTheme, getThemeNames } from '../themes/index.js';
import { getAggregateStats, getRecentHistory } from '../stats/index.js';
import { formatDuration } from '../utils/helpers.js';

export interface CommandResult {

  success: boolean;

  message: string;

  restart: boolean;

  quit: boolean;

  openThemePicker?: boolean;
}

// Executes command
export function executeCommand(input: string): CommandResult {
  const trimmed = input.trim();

  if (!trimmed.startsWith('/')) {
    return { success: false, message: 'Commands start with /', restart: false, quit: false };
  }

  const parts = trimmed.slice(1).split(/\s+/);
  const command = parts[0].toLowerCase();
  const args = parts.slice(1);

  switch (command) {
    case 'theme':
      return handleTheme(args);
    case 'themes':
      return handleThemeList();
    case 'mode':
      return handleMode(args);
    case 'time':
      return handleTime(args);
    case 'words':
      return handleWords(args);
    case 'restart':
    case 'r':
      return { success: true, message: 'Restarting...', restart: true, quit: false };
    case 'next':
    case 'n':
      return { success: true, message: 'Next session...', restart: true, quit: false };
    case 'quit':
    case 'q':
    case 'exit':
      return { success: true, message: 'Goodbye!', restart: false, quit: true };
    case 'stats':
      return handleStats();
    case 'history':
      return handleHistory();
    case 'best':
      return handleBest();
    case 'quote':
      return handleQuoteSwitch();
    case 'punct':
    case 'punctuation':
      return handleToggle('punctuation');
    case 'numbers':
    case 'nums':
      return handleToggle('numbers');
    case 'difficulty':
    case 'diff':
      return handleDifficulty(args);
    case 'zen':
      return handleToggle('zenMode');
    case 'focus':
      return handleToggle('focusMode');
    case 'caret':
      return handleCaret(args);
    case 'reset':
      return handleReset();
    case 'help':
    case '?':
      return handleHelp();
    default:
      return {
        success: false,
        message: `Unknown command: /${command}. Type /help for available commands.`,
        restart: false,
        quit: false,
      };
  }
}

// Handles theme
function handleTheme(args: string[]): CommandResult {
  if (args.length === 0) {
    const config = getConfig();
    return {
      success: true,
      message: `Current theme: ${config.theme}`,
      restart: false,
      quit: false,
    };
  }

  const themeName = args[0].toLowerCase();
  if (setTheme(themeName)) {
    updateConfig({ theme: themeName });
    return {
      success: true,
      message: `Theme changed to ${themeName}`,
      restart: true,
      quit: false,
    };
  }

  return {
    success: false,
    message: `Theme "${themeName}" not found. Use /themes to see available themes.`,
    restart: false,
    quit: false,
  };
}

function handleThemeList(): CommandResult {
  return {
    success: true,
    message: '',
    restart: false,
    quit: false,
    openThemePicker: true,
  };
}

function handleMode(args: string[]): CommandResult {
  if (args.length === 0) {
    const config = getConfig();
    return { success: true, message: `Current mode: ${config.mode}`, restart: false, quit: false };
  }

  const mode = args[0].toLowerCase();
  if (['time', 'words', 'quote', 'custom'].includes(mode)) {
    updateConfig({ mode });
    return { success: true, message: `Mode changed to ${mode}`, restart: true, quit: false };
  }

  return {
    success: false,
    message: 'Available modes: time, words, quote, custom',
    restart: false,
    quit: false,
  };
}

function handleTime(args: string[]): CommandResult {
  if (args.length === 0) {
    return {
      success: false,
      message: 'Usage: /time <seconds> (15, 30, 60, 120)',
      restart: false,
      quit: false,
    };
  }

  const seconds = parseInt(args[0], 10);
  if (isNaN(seconds) || seconds < 5 || seconds > 300) {
    return {
      success: false,
      message: 'Time must be between 5 and 300 seconds.',
      restart: false,
      quit: false,
    };
  }

  updateConfig({ mode: 'time', timeDuration: seconds });
  return {
    success: true,
    message: `Time set to ${seconds}s`,
    restart: true,
    quit: false,
  };
}

function handleWords(args: string[]): CommandResult {
  if (args.length === 0) {
    return {
      success: false,
      message: 'Usage: /words <count> (10, 25, 50, 100)',
      restart: false,
      quit: false,
    };
  }

  const count = parseInt(args[0], 10);
  if (isNaN(count) || count < 5 || count > 500) {
    return {
      success: false,
      message: 'Word count must be between 5 and 500.',
      restart: false,
      quit: false,
    };
  }

  updateConfig({ mode: 'words', wordCount: count });
  return {
    success: true,
    message: `Word count set to ${count}`,
    restart: true,
    quit: false,
  };
}

function handleStats(): CommandResult {
  const stats = getAggregateStats();
  const msg = [
    `Sessions: ${stats.totalSessions}`,
    `Time: ${formatDuration(stats.totalTime)}`,
    `Words: ${stats.totalWords}`,
    `Best WPM: ${stats.bestWpm}`,
    `Avg WPM: ${stats.averageWpm}`,
    `Avg Acc: ${stats.averageAccuracy}%`,
  ].join('  │  ');

  return { success: true, message: msg, restart: false, quit: false };
}

function handleHistory(): CommandResult {
  const history = getRecentHistory(5);
  if (history.length === 0) {
    return { success: true, message: 'No history yet.', restart: false, quit: false };
  }

  const lines = history.map(
    (h) => `${h.wpm}wpm ${h.accuracy}% ${h.mode} ${formatDuration(h.duration)}`,
  );
  return { success: true, message: lines.join(' │ '), restart: false, quit: false };
}

function handleBest(): CommandResult {
  const stats = getAggregateStats();
  return {
    success: true,
    message: `Personal best: ${stats.bestWpm} WPM`,
    restart: false,
    quit: false,
  };
}

function handleQuoteSwitch(): CommandResult {
  updateConfig({ mode: 'quote' });
  return { success: true, message: 'Switched to quote mode', restart: true, quit: false };
}

function handleToggle(key: 'punctuation' | 'numbers' | 'zenMode' | 'focusMode'): CommandResult {
  const config = getConfig();
  const newValue = !config[key];
  updateConfig({ [key]: newValue } as Partial<KlyckyConfig>);
  return {
    success: true,
    message: `${key}: ${newValue ? 'on' : 'off'}`,
    restart: true,
    quit: false,
  };
}

function handleDifficulty(args: string[]): CommandResult {
  if (args.length === 0) {
    const config = getConfig();
    return {
      success: true,
      message: `Difficulty: ${config.difficulty}`,
      restart: false,
      quit: false,
    };
  }

  const level = args[0].toLowerCase() as 'easy' | 'normal' | 'hard';
  if (!['easy', 'normal', 'hard'].includes(level)) {
    return {
      success: false,
      message: 'Difficulty levels: easy, normal, hard',
      restart: false,
      quit: false,
    };
  }

  updateConfig({ difficulty: level });
  return { success: true, message: `Difficulty set to ${level}`, restart: true, quit: false };
}

function handleCaret(args: string[]): CommandResult {
  if (args.length === 0) {
    const config = getConfig();
    return {
      success: true,
      message: `Caret style: ${config.caretStyle}`,
      restart: false,
      quit: false,
    };
  }

  const style = args[0].toLowerCase() as 'line' | 'block' | 'underline';
  if (!['line', 'block', 'underline'].includes(style)) {
    return {
      success: false,
      message: 'Caret styles: line, block, underline',
      restart: false,
      quit: false,
    };
  }

  updateConfig({ caretStyle: style });
  return {
    success: true,
    message: `Caret style set to ${style}`,
    restart: false,
    quit: false,
  };
}

function handleReset(): CommandResult {
  resetConfig();
  return {
    success: true,
    message: 'Configuration reset to defaults.',
    restart: true,
    quit: false,
  };
}

function handleHelp(): CommandResult {
  const commands = [
    '/theme <name>  - Change theme',
    '/themes        - List themes',
    '/mode <mode>   - Switch mode',
    '/time <sec>    - Set duration',
    '/words <n>     - Set word count',
    '/restart       - Restart session',
    '/caret <style> - Change caret',
    '/difficulty    - Set difficulty',
    '/stats         - View stats',
    '/quit          - Exit Klycky',
  ];
  return {
    success: true,
    message: commands.join('  │  '),
    restart: false,
    quit: false,
  };
}
