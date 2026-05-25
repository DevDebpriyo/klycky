/**
 * Klycky - Word Generator
 *
 * Generates word lists for typing sessions from built-in wordlists.
 * Supports difficulty levels, punctuation, and number injection.
 */

import { shuffle } from '../utils/helpers.js';

// ─── Built-in Word Lists ────────────────────────────────────

const EASY_WORDS = [
  'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'it',
  'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at', 'this',
  'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she', 'or',
  'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what', 'so',
  'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me', 'when',
  'make', 'can', 'like', 'time', 'no', 'just', 'him', 'know', 'take', 'people',
  'into', 'year', 'your', 'good', 'some', 'could', 'them', 'see', 'other', 'than',
  'then', 'now', 'look', 'only', 'come', 'its', 'over', 'think', 'also', 'back',
  'after', 'use', 'two', 'how', 'our', 'work', 'first', 'well', 'way', 'even',
  'new', 'want', 'day', 'much', 'find', 'here', 'thing', 'many', 'give', 'most',
];

const NORMAL_WORDS = [
  ...EASY_WORDS,
  'because', 'through', 'before', 'between', 'should', 'never', 'world', 'still',
  'another', 'system', 'number', 'problem', 'always', 'right', 'place', 'point',
  'small', 'large', 'group', 'important', 'often', 'change', 'different', 'life',
  'keep', 'help', 'turn', 'start', 'might', 'show', 'while', 'city', 'hand',
  'high', 'every', 'school', 'begin', 'story', 'under', 'night', 'great', 'move',
  'water', 'against', 'children', 'during', 'without', 'question', 'country',
  'follow', 'around', 'house', 'family', 'together', 'general', 'already',
  'program', 'company', 'develop', 'power', 'learn', 'possible', 'person',
  'consider', 'believe', 'provide', 'suggest', 'require', 'process', 'result',
  'include', 'continue', 'example', 'certain', 'support', 'interest', 'produce',
];

const HARD_WORDS = [
  ...NORMAL_WORDS,
  'acknowledge', 'algorithm', 'approximately', 'architecture', 'asynchronous',
  'bibliography', 'bureaucratic', 'catastrophe', 'circumference', 'collaboration',
  'comprehensive', 'configuration', 'consciousness', 'controversial', 'cryptocurrency',
  'demonstrative', 'deterioration', 'discrimination', 'electromagnetic', 'entrepreneurial',
  'extraordinary', 'functionality', 'implementation', 'infrastructure', 'initialization',
  'juxtaposition', 'knowledgeable', 'multithreading', 'neuroplasticity', 'optimization',
  'parallelism', 'perpendicular', 'questionnaire', 'reconnaissance', 'rehabilitation',
  'simultaneously', 'sophisticated', 'telecommunication', 'transformation', 'vulnerability',
  'synchronization', 'documentation', 'concatenation', 'encapsulation', 'polymorphism',
  'authentication', 'authorization', 'microservices', 'containerization', 'virtualization',
];

const PUNCTUATION_MARKS = ['.', ',', '!', '?', ';', ':', '-', "'"];
const NUMBER_WORDS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '15', '20', '25',
  '30', '42', '50', '64', '75', '99', '100', '128', '200', '256', '404', '500', '1024'];

export interface WordGenOptions {
  count: number;
  difficulty: 'easy' | 'normal' | 'hard';
  punctuation: boolean;
  numbers: boolean;
}

/**
 * Generate a list of random words for a typing session.
 */
export function generateWords(options: WordGenOptions): string[] {
  const { count, difficulty, punctuation, numbers } = options;

  // Select word pool based on difficulty
  let pool: string[];
  switch (difficulty) {
    case 'easy':
      pool = [...EASY_WORDS];
      break;
    case 'hard':
      pool = [...HARD_WORDS];
      break;
    default:
      pool = [...NORMAL_WORDS];
  }

  // Generate words by random selection
  const words: string[] = [];
  for (let i = 0; i < count; i++) {
    const idx = Math.floor(Math.random() * pool.length);
    let word = pool[idx];

    // Inject punctuation randomly (~15% of words)
    if (punctuation && Math.random() < 0.15) {
      const mark = PUNCTUATION_MARKS[Math.floor(Math.random() * PUNCTUATION_MARKS.length)];
      if (mark === '-') {
        // Hyphenated compound word
        const nextIdx = Math.floor(Math.random() * pool.length);
        word = word + '-' + pool[nextIdx];
      } else if (mark === "'") {
        word = word + "'s";
      } else {
        word = word + mark;
      }
    }

    // Inject numbers randomly (~10% of words)
    if (numbers && Math.random() < 0.1) {
      word = NUMBER_WORDS[Math.floor(Math.random() * NUMBER_WORDS.length)];
    }

    // Capitalize first word of "sentence" (~10% after punctuation)
    if (punctuation && i > 0 && Math.random() < 0.1) {
      word = word.charAt(0).toUpperCase() + word.slice(1);
    }

    words.push(word);
  }

  return words;
}

/**
 * Wrap words into lines that fit a given terminal width.
 * Returns an array of lines, each being an array of words.
 */
export function wrapWords(words: string[], maxWidth: number): string[][] {
  const lines: string[][] = [];
  let currentLine: string[] = [];
  let currentWidth = 0;

  for (const word of words) {
    const wordWidth = word.length + (currentLine.length > 0 ? 1 : 0); // +1 for space
    if (currentWidth + wordWidth > maxWidth && currentLine.length > 0) {
      lines.push(currentLine);
      currentLine = [word];
      currentWidth = word.length;
    } else {
      currentLine.push(word);
      currentWidth += wordWidth;
    }
  }

  if (currentLine.length > 0) {
    lines.push(currentLine);
  }

  return lines;
}
