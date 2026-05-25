/**
 * Klycky - Layout Engine
 *
 * Calculates centered layouts and responsive positioning for all UI regions.
 * Defines precise row assignments for each UI component to enable
 * region-based incremental rendering.
 *
 * Layout regions (top to bottom):
 *   1. Logo row        — static unless resize
 *   2. Mode/timer row  — updates only on timer tick
 *   3. Separator       — static unless resize
 *   4. Typing area     — updates on keypress only
 *   5. Stats bar       — updates on keypress only
 *   6. Message row     — updates on command result
 *   7. Footer separator — static unless resize
 *   8. Footer          — static unless state change
 *   9. Command overlay — visible only in command mode
 */

import { getTerminalWidth, getTerminalHeight } from '../utils/helpers.js';

export interface LayoutDimensions {
  /** Terminal width */
  termWidth: number;
  /** Terminal height */
  termHeight: number;
  /** Content area width (capped for readability) */
  contentWidth: number;
  /** Left margin for centering content */
  leftMargin: number;

  // ─── Row assignments ───────────────────────────
  /** Row for the ASCII logo */
  logoRow: number;
  /** Row for mode / timer info */
  modeRow: number;
  /** Row for separator below header */
  separatorRow: number;
  /** First row of the typing text area */
  typingStartRow: number;
  /** Number of visible text lines in the typing area */
  visibleLines: number;
  /** Row for live stats (WPM sparkline, accuracy) */
  statsRow: number;
  /** Row for temporary messages (command results) */
  messageRow: number;
  /** Row for footer separator */
  footerSepRow: number;
  /** Row for the footer hints */
  footerRow: number;

  // ─── Command overlay ───────────────────────────
  /** Top row of command overlay */
  cmdOverlayTop: number;
  /** Height of command overlay */
  cmdOverlayHeight: number;
}

/** Maximum content width for comfortable reading */
const MAX_CONTENT_WIDTH = 70;
/** Minimum content width */
const MIN_CONTENT_WIDTH = 40;

/**
 * Calculate the current layout dimensions based on terminal size.
 * Cached per-frame — call once per render pass.
 */
export function calculateLayout(): LayoutDimensions {
  const termWidth = getTerminalWidth();
  const termHeight = getTerminalHeight();

  // Calculate visible lines based on available space
  // We'll use double spacing for text, so each line takes 2 rows
  const visibleLines = 3; // Keep to 3 lines (current, next, next-next) to keep it focused
  const typingBlockHeight = visibleLines * 2 - 1;

  const contentWidth = Math.max(
    MIN_CONTENT_WIDTH,
    Math.min(MAX_CONTENT_WIDTH, termWidth - 4),
  );

  // Center horizontally
  const leftMargin = Math.max(1, Math.floor((termWidth - contentWidth) / 2) + 1);

  // Vertical layout - center the typing area
  // Calculate the ideal starting row to perfectly center the block
  let typingStartRow = Math.floor((termHeight - typingBlockHeight) / 2);
  
  // Ensure it doesn't collide with the header
  typingStartRow = Math.max(8, typingStartRow);

  // Header elements
  const logoRow = Math.max(2, typingStartRow - 5);
  const modeRow = logoRow + 2;
  const separatorRow = modeRow + 1; // Not used as much, keeping for compatibility

  // Stats and footer elements
  const statsRow = typingStartRow + typingBlockHeight + 2;
  const messageRow = statsRow + 1;
  const footerSepRow = termHeight - 2;
  const footerRow = termHeight - 1;

  // Command overlay centered vertically
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
