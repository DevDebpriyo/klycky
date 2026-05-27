

import { TypingSession } from '../engine/session.js';
import { getTheme } from '../themes/themeLoader.js';
import { fgHex, bgHex } from '../themes/themeTypes.js';
import { wrapWords } from '../engine/wordGenerator.js';
import { calculateLayout } from './layout.js';
import { write, setCursor } from './screen.js';
import { ANSI } from '../utils/ansi.js';
import { KlyckyConfig } from '../config/defaults.js';

export function renderText(session: TypingSession, config: KlyckyConfig): void {
  const theme = getTheme();
  const layout = calculateLayout();
  const bg = bgHex(theme.colors.background);
  const lines = wrapWords(session.words, layout.contentWidth);

  const currentLineIndex = findCurrentLine(lines, session.currentWordIndex);
  const startLine = Math.max(0, currentLineIndex - 1);
  const endLine = Math.min(lines.length, startLine + layout.visibleLines);

  let globalWordIndex = 0;
  for (let i = 0; i < startLine; i++) {
    globalWordIndex += lines[i].length;
  }

  const cCorrect = fgHex(theme.colors.correct) + bg;
  const cError = fgHex(theme.colors.error) + bg;
  const cActive = fgHex(theme.colors.active) + bg;
  const cDimmed = fgHex(theme.colors.dimmed) + bg;
  const cExtra = fgHex(theme.colors.extra) + bg;
  const reset = ANSI.RESET;

  let cursorShapeCode = '\x1b[5 q'; 
  if (config.caretStyle === 'block') cursorShapeCode = '\x1b[1 q';
  else if (config.caretStyle === 'underline') cursorShapeCode = '\x1b[3 q';

  let buf = '';

  for (let lineIdx = startLine; lineIdx < endLine; lineIdx++) {

    const rowOffset = (lineIdx - startLine) * 2;
    const row = layout.typingStartRow + rowOffset;
    const line = lines[lineIdx];

    buf += ANSI.moveTo(row, 1) + bg + ' '.repeat(layout.termWidth) + reset;

    if (rowOffset + 1 < layout.visibleLines * 2 - 1) {
      buf += ANSI.moveTo(row + 1, 1) + bg + ' '.repeat(layout.termWidth) + reset;
    }

    buf += ANSI.moveTo(row, layout.leftMargin);

    let currentLineCol = layout.leftMargin;
    for (let wordIdx = 0; wordIdx < line.length; wordIdx++) {
      const word = line[wordIdx];
      const absWordIndex = globalWordIndex + wordIdx;

      if (wordIdx > 0) {
        buf += bg + ' ' + reset;
        currentLineCol++;
      }

      for (let charIdx = 0; charIdx < word.length; charIdx++) {
        const char = word[charIdx];

        if (absWordIndex < session.currentWordIndex) {

          const wr = session.wordResults[absWordIndex];
          if (wr && charIdx < wr.chars.length && wr.chars[charIdx].correct) {
            buf += cCorrect + char;
          } else {
            buf += cError + char;
          }
        } else if (absWordIndex === session.currentWordIndex) {

          if (charIdx < session.currentCharIndex) {
            const wr = session.wordResults[absWordIndex];
            if (wr && charIdx < wr.chars.length && wr.chars[charIdx].correct) {
              buf += cCorrect + char;
            } else {
              buf += cError + char;
            }
          } else if (charIdx === session.currentCharIndex) {

            setCursor(row, currentLineCol);

            buf += cDimmed + char;
          } else {

            buf += cDimmed + char;
          }
        } else {

          buf += cDimmed + char;
        }

        currentLineCol++;
      }

      if (absWordIndex === session.currentWordIndex && session.currentCharIndex > word.length) {
        const extraCount = Math.min(session.currentCharIndex - word.length, 5);
        for (let i = 0; i < extraCount; i++) {
          const extraChar = session.inputBuffer[word.length + i] || '·';
          buf += cExtra + extraChar;
          currentLineCol++;
        }
      }

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

  const usedRows = (endLine - startLine) * 2;
  const totalRows = layout.visibleLines * 2 - 1;
  for (let i = usedRows; i < totalRows; i++) {
    const row = layout.typingStartRow + i;
    buf += ANSI.moveTo(row, 1) + bg + ' '.repeat(layout.termWidth) + reset;
  }

  buf += cursorShapeCode;
  write(buf);
}

// Finds current line
function findCurrentLine(lines: string[][], currentWordIndex: number): number {
  let count = 0;
  for (let i = 0; i < lines.length; i++) {
    count += lines[i].length;
    if (currentWordIndex < count) return i;
  }
  return lines.length - 1;
}
