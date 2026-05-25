/**
 * Klycky - Typing Session
 *
 * Core state machine for a typing session.
 * States: idle → active → finished
 *
 * Tracks character-level typing progress, errors, and timing.
 */

export type SessionState = 'idle' | 'active' | 'finished';

export interface CharResult {
  /** The expected character */
  expected: string;
  /** The character the user typed (empty if not yet typed) */
  typed: string;
  /** Whether the character was typed correctly */
  correct: boolean;
  /** Whether this character has been typed at all */
  attempted: boolean;
  /** Timestamp when this character was typed */
  timestamp: number;
}

export interface WordResult {
  /** The expected word */
  word: string;
  /** Characters typed for this word */
  chars: CharResult[];
  /** Whether the entire word was completed */
  completed: boolean;
  /** Whether the entire word was correct */
  correct: boolean;
}

export class TypingSession {
  /** Current session state */
  state: SessionState = 'idle';

  /** All words for this session */
  words: string[];

  /** Results tracking per word */
  wordResults: WordResult[];

  /** Index of the current word being typed */
  currentWordIndex: number = 0;

  /** Index of the current character within the current word */
  currentCharIndex: number = 0;

  /** Session start time (ms since epoch) */
  startTime: number = 0;

  /** Session end time (ms since epoch) */
  endTime: number = 0;

  /** Total characters typed (including errors) */
  totalKeypresses: number = 0;

  /** Total errors made */
  totalErrors: number = 0;

  /** Whether Caps Lock is currently detected */
  capsLockActive: boolean = false;

  /** Current streak of correct characters */
  currentStreak: number = 0;

  /** Best streak achieved in this session */
  bestStreak: number = 0;

  /** WPM samples taken at regular intervals (for sparkline) */
  wpmSamples: number[] = [];

  /** Timestamp of last WPM sample */
  private lastSampleTime: number = 0;

  /** Characters typed since last sample */
  private charsSinceLastSample: number = 0;

  /** Mode for this session */
  mode: string;

  /** Time limit for timed sessions (ms) */
  timeLimit: number;

  /** Input buffer for current word */
  inputBuffer: string = '';

  constructor(words: string[], mode: string = 'time', timeLimit: number = 30000) {
    this.words = words;
    this.mode = mode;
    this.timeLimit = timeLimit;

    // Initialize word results
    this.wordResults = words.map((word) => ({
      word,
      chars: word.split('').map((ch) => ({
        expected: ch,
        typed: '',
        correct: false,
        attempted: false,
        timestamp: 0,
      })),
      completed: false,
      correct: false,
    }));
  }

  /**
   * Start the typing session.
   */
  start(): void {
    if (this.state !== 'idle') return;
    this.state = 'active';
    this.startTime = Date.now();
    this.lastSampleTime = this.startTime;
  }

  /**
   * End the typing session.
   */
  finish(): void {
    if (this.state !== 'active') return;
    this.state = 'finished';
    this.endTime = Date.now();
    this.takeSample();
  }

  /**
   * Get elapsed time in milliseconds.
   */
  getElapsedMs(): number {
    if (this.state === 'idle') return 0;
    const end = this.state === 'finished' ? this.endTime : Date.now();
    return end - this.startTime;
  }

  /**
   * Get elapsed time in seconds.
   */
  getElapsedSeconds(): number {
    return this.getElapsedMs() / 1000;
  }

  /**
   * Get remaining time for timed sessions (in seconds).
   */
  getRemainingSeconds(): number {
    if (this.mode !== 'time') return Infinity;
    const remaining = (this.timeLimit - this.getElapsedMs()) / 1000;
    return Math.max(0, remaining);
  }

  /**
   * Check if the timed session has expired.
   */
  isTimeUp(): boolean {
    return this.mode === 'time' && this.getElapsedMs() >= this.timeLimit;
  }

  /**
   * Process a character input from the user.
   */
  handleChar(char: string): void {
    if (this.state !== 'active') return;
    if (this.currentWordIndex >= this.words.length) return;

    // Auto-start on first keypress
    if (this.startTime === 0) {
      this.start();
    }

    this.totalKeypresses++;
    this.inputBuffer += char;

    const wordResult = this.wordResults[this.currentWordIndex];
    const charIndex = this.currentCharIndex;

    if (charIndex < wordResult.chars.length) {
      const charResult = wordResult.chars[charIndex];
      charResult.typed = char;
      charResult.attempted = true;
      charResult.timestamp = Date.now();

      // Caps Lock detection heuristic
      const isUpper = char.length === 1 && char >= 'A' && char <= 'Z';
      const isLower = char.length === 1 && char >= 'a' && char <= 'z';
      const isExpectedLower = charResult.expected.length === 1 && charResult.expected >= 'a' && charResult.expected <= 'z';
      
      if (isUpper && isExpectedLower) {
        this.capsLockActive = true;
      } else if (isLower) {
        this.capsLockActive = false;
      }

      if (char === charResult.expected) {
        charResult.correct = true;
        this.currentStreak++;
        if (this.currentStreak > this.bestStreak) {
          this.bestStreak = this.currentStreak;
        }
      } else {
        charResult.correct = false;
        this.totalErrors++;
        this.currentStreak = 0;
      }
    } else {
      // Extra characters beyond word length (overtyping)
      this.totalErrors++;
      this.currentStreak = 0;
    }

    this.currentCharIndex++;
    this.charsSinceLastSample++;

    // Take WPM sample every 1 second
    const now = Date.now();
    if (now - this.lastSampleTime >= 1000) {
      this.takeSample();
    }
  }

  /**
   * Handle space/word completion.
   * Returns true if we advanced to the next word.
   */
  handleSpace(): boolean {
    if (this.state !== 'active') return false;
    if (this.currentWordIndex >= this.words.length) return false;

    const wordResult = this.wordResults[this.currentWordIndex];

    // Mark word as completed
    wordResult.completed = true;
    wordResult.correct = wordResult.chars.every((c) => c.correct) &&
      this.inputBuffer.length === wordResult.word.length;

    // Advance to next word
    this.currentWordIndex++;
    this.currentCharIndex = 0;
    this.inputBuffer = '';
    this.totalKeypresses++;
    this.charsSinceLastSample++;

    // Check if all words are completed (for word mode)
    if (this.currentWordIndex >= this.words.length) {
      this.finish();
      return true;
    }

    return true;
  }

  /**
   * Handle backspace.
   */
  handleBackspace(): void {
    if (this.state !== 'active') return;
    if (this.currentCharIndex === 0) return;

    this.currentCharIndex--;
    this.inputBuffer = this.inputBuffer.slice(0, -1);

    const wordResult = this.wordResults[this.currentWordIndex];
    if (this.currentCharIndex < wordResult.chars.length) {
      const charResult = wordResult.chars[this.currentCharIndex];
      charResult.typed = '';
      charResult.attempted = false;
      charResult.correct = false;
    }
  }

  /**
   * Handle Ctrl+Backspace (delete entire word).
   */
  handleCtrlBackspace(): void {
    if (this.state !== 'active') return;

    const wordResult = this.wordResults[this.currentWordIndex];
    for (let i = 0; i < wordResult.chars.length; i++) {
      wordResult.chars[i].typed = '';
      wordResult.chars[i].attempted = false;
      wordResult.chars[i].correct = false;
    }
    this.currentCharIndex = 0;
    this.inputBuffer = '';
  }

  /**
   * Take a WPM sample for the sparkline.
   */
  private takeSample(): void {
    const elapsed = this.getElapsedSeconds();
    if (elapsed <= 0) return;

    const wpm = this.calculateWpm();
    this.wpmSamples.push(Math.round(wpm));
    this.lastSampleTime = Date.now();
    this.charsSinceLastSample = 0;
  }

  /**
   * Get total correct characters currently typed (used for WPM).
   */
  getCorrectCharacters(): number {
    let count = 0;
    for (let i = 0; i <= this.currentWordIndex; i++) {
      if (i >= this.wordResults.length) break;
      const wr = this.wordResults[i];
      if (i < this.currentWordIndex) {
        if (wr.correct) count += wr.word.length + 1; // +1 for the space
      } else {
        // Current word: count correct characters
        for (let j = 0; j < this.currentCharIndex; j++) {
           if (wr.chars[j] && wr.chars[j].correct) count++;
        }
      }
    }
    return count;
  }

  /**
   * Calculate current WPM (words per minute).
   * Standard: 1 word = 5 characters.
   */
  calculateWpm(): number {
    const elapsed = this.getElapsedSeconds();
    if (elapsed <= 0) return 0;
    const minutes = elapsed / 60;
    return this.getCorrectCharacters() / 5 / minutes;
  }

  /**
   * Calculate raw WPM (including errors).
   */
  calculateRawWpm(): number {
    const elapsed = this.getElapsedSeconds();
    if (elapsed <= 0) return 0;
    const minutes = elapsed / 60;
    return this.totalKeypresses / 5 / minutes;
  }

  /**
   * Calculate accuracy as a percentage.
   */
  calculateAccuracy(): number {
    if (this.totalKeypresses === 0) return 100;
    const correct = Math.max(0, this.totalKeypresses - this.totalErrors);
    return (correct / this.totalKeypresses) * 100;
  }

  /**
   * Calculate consistency as a percentage.
   * Based on standard deviation of WPM samples.
   */
  calculateConsistency(): number {
    if (this.wpmSamples.length < 2) return 100;

    const mean = this.wpmSamples.reduce((a, b) => a + b, 0) / this.wpmSamples.length;
    if (mean === 0) return 0;

    const variance =
      this.wpmSamples.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) /
      this.wpmSamples.length;
    const stdDev = Math.sqrt(variance);

    // Coefficient of variation inverted to percentage
    const cv = stdDev / mean;
    return Math.max(0, Math.min(100, (1 - cv) * 100));
  }

  /**
   * Get the current word being typed.
   */
  getCurrentWord(): string {
    if (this.currentWordIndex >= this.words.length) return '';
    return this.words[this.currentWordIndex];
  }

  /**
   * Get the number of completed words.
   */
  getCompletedWordCount(): number {
    return this.wordResults.filter((w) => w.completed).length;
  }
}
