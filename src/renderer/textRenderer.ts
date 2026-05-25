/**
 * Klycky - Text Renderer
 *
 * Renders the typing text with character-level coloring.
 * Optimized for minimal redraw:
 * - Builds each line into a single string before writing
 * - Clears only the typing region rows (not the full screen)
 * - All output goes through the write buffer
 */

import { TypingSession } from '../engine/session.js';
import { getTheme } from '../themes/themeLoader.js';
import { fgHex, bgHex } from '../themes/themeTypes.js';
import { wrapWords } from '../engine/wordGenerator.js';
import { calculateLayout } from './layout.js';
import { write, setCursor } from './screen.js';
import { ANSI } from '../utils/ansi.js';
import { KlyckyConfig } from '../config/defaults.js';

/**
 * Render the typing text area with word coloring and caret.
 * Writes only to the typing region rows — never touches other regions.
 */
export function renderText(session: TypingSession, config: KlyckyConfig): void {
  const theme = getTheme();
  const layout = calculateLayout();
  const bg = bgHex(theme.colors.background);
  const lines = wrapWords(session.words, layout.contentWidth);

  // Determine which lines to show (scrolling window around current word)
  const currentLineIndex = findCurrentLine(lines, session.currentWordIndex);
  const startLine = Math.max(0, currentLineIndex - 1);
  const endLine = Math.min(lines.length, startLine + layout.visibleLines);

  // Track word index globally across all lines
  let globalWordIndex = 0;
  for (let i = 0; i < startLine; i++) {
    globalWordIndex += lines[i].length;
  }

  // Pre-compute color codes to avoid repeated hex parsing
  const cCorrect = fgHex(theme.colors.correct) + bg;
  const cError = fgHex(theme.colors.error) + bg;
  const cActive = fgHex(theme.colors.active) + bg;
  const cDimmed = fgHex(theme.colors.dimmed) + bg;
  const cExtra = fgHex(theme.colors.extra) + bg;
  const reset = ANSI.RESET;

  // Set terminal cursor shape based on config
  let cursorShapeCode = '\x1b[5 q'; // default blinking bar (line)
  if (config.caretStyle === 'block') cursorShapeCode = '\x1b[1 q';
  else if (config.caretStyle === 'underline') cursorShapeCode = '\x1b[3 q';

  // Build output for all visible lines in a single buffer
  let buf = '';

  for (let lineIdx = startLine; lineIdx < endLine; lineIdx++) {
    // Double spacing: each text line is placed 2 rows apart
    const rowOffset = (lineIdx - startLine) * 2;
    const row = layout.typingStartRow + rowOffset;
    const line = lines[lineIdx];

    // Clear the text row
    buf += ANSI.moveTo(row, 1) + bg + ' '.repeat(layout.termWidth) + reset;
    
    // Also clear the spacer row below (if not the last row)
    if (rowOffset + 1 < layout.visibleLines * 2 - 1) {
      buf += ANSI.moveTo(row + 1, 1) + bg + ' '.repeat(layout.termWidth) + reset;
    }

    // Position cursor for actual text drawing
    buf += ANSI.moveTo(row, layout.leftMargin);

    // Build the colored line content
    let currentLineCol = layout.leftMargin;
    for (let wordIdx = 0; wordIdx < line.length; wordIdx++) {
      const word = line[wordIdx];
      const absWordIndex = globalWordIndex + wordIdx;

      // Space between words
      if (wordIdx > 0) {
        buf += bg + ' ' + reset;
        currentLineCol++;
      }

      // Render each character of this word
      for (let charIdx = 0; charIdx < word.length; charIdx++) {
        const char = word[charIdx];

        if (absWordIndex < session.currentWordIndex) {
          // Completed word
          const wr = session.wordResults[absWordIndex];
          if (wr && charIdx < wr.chars.length && wr.chars[charIdx].correct) {
            buf += cCorrect + char;
          } else {
            buf += cError + char;
          }
        } else if (absWordIndex === session.currentWordIndex) {
          // Current word being typed
          if (charIdx < session.currentCharIndex) {
            const wr = session.wordResults[absWordIndex];
            if (wr && charIdx < wr.chars.length && wr.chars[charIdx].correct) {
              buf += cCorrect + char;
            } else {
              buf += cError + char;
            }
          } else if (charIdx === session.currentCharIndex) {
            // Caret position
            setCursor(row, currentLineCol);
            // Print the current active character (subtle)
            buf += cDimmed + char;
          } else {
            // Upcoming chars in current word
            buf += cDimmed + char;
          }
        } else {
          // Future word (dimmed)
          buf += cDimmed + char;
        }
        
        currentLineCol++;
      }

      // Extra typed characters beyond word length (overtyping)
      if (absWordIndex === session.currentWordIndex && session.currentCharIndex > word.length) {
        const extraCount = Math.min(session.currentCharIndex - word.length, 5);
        for (let i = 0; i < extraCount; i++) {
          const extraChar = session.inputBuffer[word.length + i] || '·';
          buf += cExtra + extraChar;
          currentLineCol++;
        }
      }

      // Caret at end of current word OR end of extra typed characters
      if (
        absWordIndex === session.currentWordIndex &&
        session.currentCharIndex >= word.length
      ) {
        setCursor(row, currentLineCol);
      }
    }

    buf += reset;
    globalWordIndex += line.length;
  }

  // Clear any remaining typing rows that aren't used
  const usedRows = (endLine - startLine) * 2;
  const totalRows = layout.visibleLines * 2 - 1;
  for (let i = usedRows; i < totalRows; i++) {
    const row = layout.typingStartRow + i;
    buf += ANSI.moveTo(row, 1) + bg + ' '.repeat(layout.termWidth) + reset;
  }

  buf += cursorShapeCode;
  write(buf);
}

/**
 * Find which wrapped line the current word is on.
 */
function findCurrentLine(lines: string[][], currentWordIndex: number): number {
  let count = 0;
  for (let i = 0; i < lines.length; i++) {
    count += lines[i].length;
    if (currentWordIndex < count) return i;
  }
  return lines.length - 1;
}
