

import { getTerminalWidth, getTerminalHeight } from '../utils/helpers.js';

export interface LayoutDimensions {

  termWidth: number;

  termHeight: number;

  contentWidth: number;

  leftMargin: number;

  logoRow: number;

  modeRow: number;

  separatorRow: number;

  typingStartRow: number;

  visibleLines: number;

  statsRow: number;

  messageRow: number;

  footerSepRow: number;

  footerRow: number;

  cmdOverlayTop: number;

  cmdOverlayHeight: number;
}

const MAX_CONTENT_WIDTH = 70;

const MIN_CONTENT_WIDTH = 40;

// Calculates layout
export function calculateLayout(): LayoutDimensions {
  const termWidth = getTerminalWidth();
  const termHeight = getTerminalHeight();

  const visibleLines = 3; 
  const typingBlockHeight = visibleLines * 2 - 1;

  const contentWidth = Math.max(
    MIN_CONTENT_WIDTH,
    Math.min(MAX_CONTENT_WIDTH, termWidth - 4),
  );

  const leftMargin = Math.max(1, Math.floor((termWidth - contentWidth) / 2) + 1);

  let typingStartRow = Math.floor((termHeight - typingBlockHeight) / 2);

  typingStartRow = Math.max(8, typingStartRow);

  const logoRow = Math.max(2, typingStartRow - 5);
  const modeRow = logoRow + 2;
  const separatorRow = modeRow + 1; 

  const statsRow = typingStartRow + typingBlockHeight + 2;
  const messageRow = statsRow + 1;
  const footerSepRow = termHeight - 2;
  const footerRow = termHeight - 1;

  const cmdOverlayHeight = Math.min(16, termHeight - 4);
  const cmdOverlayTop = Math.max(2, Math.floor((termHeight - cmdOverlayHeight) / 2));

  return {
    termWidth,
    termHeight,
    contentWidth,
    leftMargin,
    logoRow,
    modeRow,
    separatorRow,
    typingStartRow,
    visibleLines,
    statsRow,
    messageRow,
    footerSepRow,
    footerRow,
    cmdOverlayTop,
    cmdOverlayHeight,
  };
}
