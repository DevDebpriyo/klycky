
export type SessionState = 'idle' | 'active' | 'finished';

export interface CharResult {

  expected: string;

  typed: string;

  correct: boolean;

  attempted: boolean;

  timestamp: number;
}

export interface WordResult {

  word: string;

  chars: CharResult[];

  completed: boolean;

  correct: boolean;
}

// Typings session
export class TypingSession {

  state: SessionState = 'idle';

  words: string[];

  wordResults: WordResult[];

  currentWordIndex: number = 0;

  currentCharIndex: number = 0;

  startTime: number = 0;

  endTime: number = 0;

  totalKeypresses: number = 0;

  totalErrors: number = 0;

  capsLockActive: boolean = false;

  currentStreak: number = 0;

  bestStreak: number = 0;

  wpmSamples: number[] = [];

  private lastSampleTime: number = 0;

  private charsSinceLastSample: number = 0;

  mode: string;

  timeLimit: number;

  inputBuffer: string = '';

  constructor(words: string[], mode: string = 'time', timeLimit: number = 30000) {
    this.words = words;
    this.mode = mode;
    this.timeLimit = timeLimit;

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

  start(): void {
    if (this.state !== 'idle') return;
    this.state = 'active';
    this.startTime = Date.now();
    this.lastSampleTime = this.startTime;
  }

  finish(): void {
    if (this.state !== 'active') return;
    this.state = 'finished';
    this.endTime = Date.now();
    this.takeSample();
  }

  getElapsedMs(): number {
    if (this.state === 'idle') return 0;
    const end = this.state === 'finished' ? this.endTime : Date.now();
    return end - this.startTime;
  }

  getElapsedSeconds(): number {
    return this.getElapsedMs() / 1000;
  }

  getRemainingSeconds(): number {
    if (this.mode !== 'time') return Infinity;
    const remaining = (this.timeLimit - this.getElapsedMs()) / 1000;
    return Math.max(0, remaining);
  }

  isTimeUp(): boolean {
    return this.mode === 'time' && this.getElapsedMs() >= this.timeLimit;
  }

  handleChar(char: string): void {
    if (this.state !== 'active') return;
    if (this.currentWordIndex >= this.words.length) return;

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

      this.totalErrors++;
      this.currentStreak = 0;
    }

    this.currentCharIndex++;
    this.charsSinceLastSample++;

    const now = Date.now();
    if (now - this.lastSampleTime >= 1000) {
      this.takeSample();
    }
  }

  handleSpace(): boolean {
    if (this.state !== 'active') return false;
    if (this.currentWordIndex >= this.words.length) return false;

    const wordResult = this.wordResults[this.currentWordIndex];

    wordResult.completed = true;
    wordResult.correct = wordResult.chars.every((c) => c.correct) &&
      this.inputBuffer.length === wordResult.word.length;

    this.currentWordIndex++;
    this.currentCharIndex = 0;
    this.inputBuffer = '';
    this.totalKeypresses++;
    this.charsSinceLastSample++;

    if (this.currentWordIndex >= this.words.length) {
      this.finish();
      return true;
    }

    return true;
  }

  handleBackspace(): void {
    if (this.state !== 'active') return;

    // go back to previous word if it has errors
    if (this.currentCharIndex === 0) {
      if (this.currentWordIndex > 0) {
        const prev = this.wordResults[this.currentWordIndex - 1];
        if (prev.completed && !prev.correct) {
          this.currentWordIndex--;
          prev.completed = false;
          this.currentCharIndex = prev.chars.length;
          this.inputBuffer = prev.chars.map(c => c.typed).join('');
        }
      }
      return;
    }

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

  handleCtrlBackspace(): void {
    if (this.state !== 'active') return;

    // if current word is empty, try going back to previous word
    if (this.currentCharIndex === 0) {
      if (this.currentWordIndex > 0) {
        const prev = this.wordResults[this.currentWordIndex - 1];
        if (prev.completed && !prev.correct) {
          this.currentWordIndex--;
          prev.completed = false;
          // clear the whole previous word
          for (let i = 0; i < prev.chars.length; i++) {
            prev.chars[i].typed = '';
            prev.chars[i].attempted = false;
            prev.chars[i].correct = false;
          }
          this.currentCharIndex = 0;
          this.inputBuffer = '';
        }
      }
      return;
    }

    const wordResult = this.wordResults[this.currentWordIndex];
    for (let i = 0; i < wordResult.chars.length; i++) {
      wordResult.chars[i].typed = '';
      wordResult.chars[i].attempted = false;
      wordResult.chars[i].correct = false;
    }
    this.currentCharIndex = 0;
    this.inputBuffer = '';
  }

  private takeSample(): void {
    const elapsed = this.getElapsedSeconds();
    if (elapsed <= 0) return;

    const wpm = this.calculateWpm();
    this.wpmSamples.push(Math.round(wpm));
    this.lastSampleTime = Date.now();
    this.charsSinceLastSample = 0;
  }

  getCorrectCharacters(): number {
    let count = 0;
    for (let i = 0; i <= this.currentWordIndex; i++) {
      if (i >= this.wordResults.length) break;
      const wr = this.wordResults[i];
      if (i < this.currentWordIndex) {
        if (wr.correct) count += wr.word.length + 1;
      } else {

        for (let j = 0; j < this.currentCharIndex; j++) {
           if (wr.chars[j] && wr.chars[j].correct) count++;
        }
      }
    }
    return count;
  }

  calculateWpm(): number {
    const elapsed = this.getElapsedSeconds();
    if (elapsed <= 0) return 0;
    const minutes = elapsed / 60;
    return this.getCorrectCharacters() / 5 / minutes;
  }

  calculateRawWpm(): number {
    const elapsed = this.getElapsedSeconds();
    if (elapsed <= 0) return 0;
    const minutes = elapsed / 60;
    return this.totalKeypresses / 5 / minutes;
  }

  calculateAccuracy(): number {
    if (this.totalKeypresses === 0) return 100;
    const correct = Math.max(0, this.totalKeypresses - this.totalErrors);
    return (correct / this.totalKeypresses) * 100;
  }

  calculateConsistency(): number {
    if (this.wpmSamples.length < 2) return 100;

    const mean = this.wpmSamples.reduce((a, b) => a + b, 0) / this.wpmSamples.length;
    if (mean === 0) return 0;

    const variance =
      this.wpmSamples.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) /
      this.wpmSamples.length;
    const stdDev = Math.sqrt(variance);

    const cv = stdDev / mean;
    return Math.max(0, Math.min(100, (1 - cv) * 100));
  }

  getCurrentWord(): string {
    if (this.currentWordIndex >= this.words.length) return '';
    return this.words[this.currentWordIndex];
  }

  getCompletedWordCount(): number {
    return this.wordResults.filter((w) => w.completed).length;
  }
}
