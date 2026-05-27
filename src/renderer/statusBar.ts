

import { getTheme } from '../themes/themeLoader.js';
import { fgHex, bgHex } from '../themes/themeTypes.js';
import { ANSI } from '../utils/ansi.js';
import { calculateLayout } from './layout.js';
import { write, clearRow } from './screen.js';
import { TypingSession } from '../engine/session.js';
import { generateSparkline, generateAccuracyMeter, generateFlowIndicator } from '../stats/metrics.js';
import { formatDuration } from '../utils/helpers.js';
import { KlyckyConfig } from '../config/defaults.js';
import { getConfig } from '../config/index.js';
import { renderLargeText } from '../utils/asciiFont.js';
import { getBestWpm } from '../stats/history.js';

export function renderLogo(): void {
  const theme = getTheme();
  const layout = calculateLayout();
  const bg = bgHex(theme.colors.background);

  const logo =
    ANSI.BOLD +
    fgHex(theme.colors.accent) + bg +
    '■ ' +
    ANSI.RESET +
    ANSI.BOLD +
    fgHex(theme.colors.foreground) + bg +
    'klycky' +
    ANSI.RESET;

  clearRow(layout.logoRow);
  const infoButton = ANSI.BOLD + fgHex(theme.colors.dimmed) + bg + ' ⓘ ' + ANSI.RESET;
  const infoCol = layout.leftMargin + layout.contentWidth - 3;
  write(ANSI.moveTo(layout.logoRow, layout.leftMargin) + logo + ANSI.moveTo(layout.logoRow, infoCol) + infoButton);
}

let lastTimerText = '';

// Renders mode row
export function renderModeRow(session: TypingSession, config: KlyckyConfig, force: boolean = false): void {
  const theme = getTheme();
  const layout = calculateLayout();
  const bg = bgHex(theme.colors.background);

  const modeLabel =
    fgHex(theme.colors.dimmed) + bg +
    config.mode +
    ANSI.RESET;

  let progressText = '';
  if (session.state === 'active') {
    if (config.mode === 'time') {
      const remaining = Math.ceil(session.getRemainingSeconds());
      progressText = `${remaining}s`;
    } else {
      const completed = session.getCompletedWordCount();
      const total = session.words.length;
      progressText = `${completed}/${total}`;
    }
  } else {
    if (config.mode === 'time') {
      progressText = `${config.timeDuration}s`;
    } else if (config.mode === 'words') {
      progressText = `${config.wordCount} words`;
    } else if (config.mode === 'quote') {
      progressText = 'quote';
    }
  }

  const fullText = config.mode + ' ' + progressText + (session.capsLockActive ? ' CAPS' : '');

  if (!force && fullText === lastTimerText) return;
  lastTimerText = fullText;

  const progressStyled =
    fgHex(session.state === 'active' ? theme.colors.accent : theme.colors.dimmed) + bg +
    progressText +
    ANSI.RESET;

  const sep =
    fgHex(theme.colors.separator) + bg +
    '  ·  ' +
    ANSI.RESET;

  clearRow(layout.modeRow);
  write(
    ANSI.moveTo(layout.modeRow, layout.leftMargin) +
    modeLabel + sep + progressStyled,
  );

  if (session.capsLockActive) {
    const warningText = 'caps lock is on';
    const warningCol = layout.leftMargin + layout.contentWidth - warningText.length;
    write(
      ANSI.moveTo(layout.modeRow, warningCol) +
      fgHex(theme.colors.error) + bg + warningText + ANSI.RESET,
    );
  }
}

// Resets timer cache
export function resetTimerCache(): void {
  lastTimerText = '';
}

export function renderSeparator(): void {
  const theme = getTheme();
  const layout = calculateLayout();
  const bg = bgHex(theme.colors.background);

  const separator =
    fgHex(theme.colors.separator) + bg +
    '─'.repeat(layout.contentWidth) +
    ANSI.RESET;

  clearRow(layout.separatorRow);
  write(ANSI.moveTo(layout.separatorRow, layout.leftMargin) + separator);
}

export function renderLiveStats(session: TypingSession, config: KlyckyConfig): void {
  const layout = calculateLayout();

  if (config.zenMode || session.state !== 'active') {
    clearRow(layout.statsRow);
    return;
  }

  const theme = getTheme();
  const bg = bgHex(theme.colors.background);

  let statsLine = '';

  const wpm = Math.round(session.calculateWpm());
  statsLine +=
    fgHex(theme.colors.dimmed) + bg + 'wpm ' + ANSI.RESET +
    ANSI.BOLD + fgHex(theme.colors.accent) + bg + `${wpm}` + ANSI.RESET;

  if (config.showSparkline && session.wpmSamples.length > 1) {
    const sparkline = generateSparkline(session.wpmSamples, 15);
    statsLine +=
      fgHex(theme.colors.dimmed) + bg + '  ' + ANSI.RESET +
      fgHex(theme.colors.accentSecondary) + bg + sparkline + ANSI.RESET;
  }

  if (config.showAccuracy) {
    const accuracy = session.calculateAccuracy();
    const meter = generateAccuracyMeter(accuracy, 8);
    const accColor = accuracy >= 95 ? theme.colors.success : accuracy >= 80 ? theme.colors.warning : theme.colors.error;
    statsLine +=
      fgHex(theme.colors.dimmed) + bg + '  acc ' + ANSI.RESET +
      fgHex(accColor) + bg + meter + ANSI.RESET;
  }

  const flow = generateFlowIndicator(session.currentStreak);
  if (flow) {
    statsLine +=
      '  ' + fgHex(theme.colors.accent) + bg + flow + ANSI.RESET;
  }

  clearRow(layout.statsRow);
  write(ANSI.moveTo(layout.statsRow, layout.leftMargin) + statsLine);
}

export function renderFooter(mode: 'idle' | 'typing' | 'results' | 'command' | 'about'): void {
  const theme = getTheme();
  const layout = calculateLayout();
  const bg = bgHex(theme.colors.background);
  const dim = fgHex(theme.colors.dimmed) + bg;
  const fg = fgHex(theme.colors.foreground) + bg;
  const rst = ANSI.RESET;

  clearRow(layout.footerSepRow);
  write(
    ANSI.moveTo(layout.footerSepRow, layout.leftMargin) +
    fgHex(theme.colors.separator) + bg +
    '─'.repeat(layout.contentWidth) + rst,
  );

  let content = '';
  switch (mode) {
    case 'results':
      content =
        dim + 'tab' + rst + fg + ' next test  ' + rst +
        dim + 'esc' + rst + fg + ' quit' + rst;
      break;
    case 'command':
      content =
        dim + 'enter' + rst + fg + ' execute  ' + rst +
        dim + 'esc' + rst + fg + ' cancel' + rst;
      break;
    case 'typing':
      content =
        dim + 'tab' + rst + fg + ' restart  ' + rst +
        dim + 'esc' + rst + fg + ' reset' + rst;
      break;
    case 'idle':
    default:
      content =
        dim + 'tab' + rst + fg + ' restart  ' + rst +
        dim + 'esc' + rst + fg + ' quit  ' + rst +
        dim + '/' + rst + fg + ' command' + rst;
      break;
  }

  clearRow(layout.footerRow);
  write(ANSI.moveTo(layout.footerRow, layout.leftMargin) + content);
}

export function renderMessage(message: string): void {
  const theme = getTheme();
  const layout = calculateLayout();
  const bg = bgHex(theme.colors.background);

  clearRow(layout.messageRow);
  if (message) {
    write(
      ANSI.moveTo(layout.messageRow, layout.leftMargin) +
      fgHex(theme.colors.info) + bg + message + ANSI.RESET,
    );
  }
}

export function clearMessage(): void {
  const layout = calculateLayout();
  clearRow(layout.messageRow);
}

export function renderSessionSummary(session: TypingSession): void {
  const theme = getTheme();
  const layout = calculateLayout();
  const bg = bgHex(theme.colors.background);
  const dim = fgHex(theme.colors.dimmed) + bg;
  const accent = fgHex(theme.colors.accent) + bg;
  const fg = fgHex(theme.colors.foreground) + bg;
  const rst = ANSI.RESET;

  const wpm = Math.round(session.calculateWpm());
  const rawWpm = Math.round(session.calculateRawWpm());
  const accuracy = Math.round(session.calculateAccuracy() * 10) / 10;
  const consistency = Math.round(session.calculateConsistency() * 10) / 10;
  const errors = session.totalErrors;
  const duration = formatDuration(Math.round(session.getElapsedSeconds()));
  const streak = session.bestStreak;
  const bestWpm = Math.round(getBestWpm() || wpm);

  const startRow = Math.max(layout.logoRow + 2, layout.typingStartRow - 2);

  for (let i = 0; i < 15; i++) {
    clearRow(startRow + i);
  }

  const wpmAscii = renderLargeText(wpm.toString());
  const accAscii = renderLargeText(`${accuracy}%`);
  const bestAscii = renderLargeText(bestWpm.toString());

  const col1 = layout.leftMargin;
  const col2 = layout.leftMargin + 18;
  const col3 = layout.leftMargin + 36;

  write(ANSI.moveTo(startRow, col1) + dim + 'wpm' + rst);
  write(ANSI.moveTo(startRow, col2) + dim + 'acc' + rst);
  write(ANSI.moveTo(startRow, col3) + dim + 'best' + rst);

  for (let i = 0; i < 4; i++) {
    const row = startRow + 1 + i;
    write(ANSI.moveTo(row, col1) + ANSI.BOLD + accent + wpmAscii[i] + rst);
    write(ANSI.moveTo(row, col2) + fg + accAscii[i] + rst);
    write(ANSI.moveTo(row, col3) + dim + bestAscii[i] + rst);
  }

  const detailsRow = startRow + 6;

  const config = getConfig();
  let modeInfo = config.mode;
  if (config.mode === 'time') modeInfo += ` ${config.timeDuration}s`;
  else if (config.mode === 'words') modeInfo += ` ${config.wordCount}`;

  const testDetails = `${modeInfo} • theme ${config.theme}`;

  write(ANSI.moveTo(detailsRow, layout.leftMargin) + dim + testDetails + rst);
  write(ANSI.moveTo(detailsRow + 1, layout.leftMargin) + fgHex(theme.colors.separator) + bg + '─'.repeat(Math.min(40, layout.contentWidth)) + rst);

  const statRow = detailsRow + 2;
  const statItems = [
    { label: 'raw', value: `${rawWpm}`, color: theme.colors.foreground },
    { label: 'consistency', value: `${consistency}%`, color: theme.colors.info },
    { label: 'errors', value: `${errors}`, color: errors === 0 ? theme.colors.success : theme.colors.error },
    { label: 'streak', value: `${streak}`, color: theme.colors.accent },
    { label: 'time', value: duration, color: theme.colors.dimmed },
  ];

  let currentStr = '';
  for (let i = 0; i < statItems.length; i++) {
    const stat = statItems[i];
    currentStr += dim + stat.label + ' ' + rst + fgHex(stat.color) + bg + stat.value + rst + '   ';
  }

  write(ANSI.moveTo(statRow, layout.leftMargin) + currentStr);

  if (session.wpmSamples.length > 1) {
    const sparkRow = statRow + 2;
    const sparkline = generateSparkline(session.wpmSamples, Math.min(40, layout.contentWidth));
    write(
      ANSI.moveTo(sparkRow, layout.leftMargin) +
      dim + 'wpm over time ' + rst +
      fgHex(theme.colors.accentSecondary) + bg + sparkline + rst
    );
  }
}

export function renderCommandOverlay(buffer: string, message: string): void {
  const theme = getTheme();
  const layout = calculateLayout();
  const bg = bgHex(theme.colors.statusBg);
  const borderColor = fgHex(theme.colors.separator) + bg;
  const rst = ANSI.RESET;
  const accent = fgHex(theme.colors.accent) + bg;
  const fg = fgHex(theme.colors.foreground) + bg;
  const dim = fgHex(theme.colors.dimmed) + bg;

  const boxWidth = Math.min(50, layout.contentWidth);
  const boxLeft = Math.max(1, Math.floor((layout.termWidth - boxWidth) / 2) + 1);
  const boxTop = layout.cmdOverlayTop;

  write(
    ANSI.moveTo(boxTop, boxLeft) +
    borderColor + '╭' + '─'.repeat(boxWidth - 2) + '╮' + rst,
  );

  const titleText = ' command palette ';
  const titlePad = boxWidth - 2 - titleText.length;
  write(
    ANSI.moveTo(boxTop + 1, boxLeft) +
    borderColor + '│' + rst +
    accent + titleText + rst +
    bg + ' '.repeat(Math.max(0, titlePad)) + rst +
    borderColor + '│' + rst,
  );

  write(
    ANSI.moveTo(boxTop + 2, boxLeft) +
    borderColor + '├' + '─'.repeat(boxWidth - 2) + '┤' + rst,
  );

  const ALL_COMMAND_HINTS = [
    '/theme <name>', '/themes', '/mode <mode>', '/time <sec>', '/words <count>',
    '/restart', '/stats', '/caret <style>', '/difficulty <lvl>', '/quit', '/help'
  ];

  let prediction = '';
  let displayHints = ALL_COMMAND_HINTS;

  if (buffer.startsWith('/') && buffer.length > 1) {
    const search = buffer.split(' ')[0];
    const match = ALL_COMMAND_HINTS.find(c => c.startsWith(search));

    if (match && match.startsWith(buffer)) {
      prediction = match.slice(buffer.length);
    }

    const filtered = ALL_COMMAND_HINTS.filter(c => c.startsWith(search));
    if (filtered.length > 0) {
      displayHints = filtered;
    }
  }

  const cursorStr = '█';

  const visibleLen = 1 + buffer.length + 1 + prediction.length; 
  const inputPad = boxWidth - 2 - visibleLen;

  let inputRender = fg + ' ' + buffer + rst + cursorStr;
  if (prediction) {
    inputRender += dim + prediction + rst;
  }

  write(
    ANSI.moveTo(boxTop + 3, boxLeft) +
    borderColor + '│' + rst +
    inputRender +
    bg + ' '.repeat(Math.max(0, inputPad)) + rst +
    borderColor + '│' + rst,
  );

  const msgText = message ? ` ${message}` : '';
  const msgPad = boxWidth - 2 - Math.min(msgText.length, boxWidth - 2);
  write(
    ANSI.moveTo(boxTop + 4, boxLeft) +
    borderColor + '│' + rst +
    (message
      ? fgHex(theme.colors.info) + bg + msgText.slice(0, boxWidth - 2) + rst
      : bg + ' '.repeat(boxWidth - 2) + rst) +
    bg + ' '.repeat(Math.max(0, msgPad)) + rst +
    borderColor + '│' + rst,
  );

  const helpLines: string[] = [];
  for (let i = 0; i < 8; i += 2) {
    const c1 = displayHints[i] || '';
    const c2 = displayHints[i+1] || '';
    if (!c1 && !c2) break;
    helpLines.push(`${c1.padEnd(16)} ${c2}`);
  }

  for (let i = 0; i < helpLines.length; i++) {
    const helpText = ' ' + helpLines[i];
    const hPad = boxWidth - 2 - helpText.length;
    write(
      ANSI.moveTo(boxTop + 5 + i, boxLeft) +
      borderColor + '│' + rst +
      dim + helpText + rst +
      bg + ' '.repeat(Math.max(0, hPad)) + rst +
      borderColor + '│' + rst,
    );
  }

  const bottomRow = boxTop + 5 + helpLines.length;
  write(
    ANSI.moveTo(bottomRow, boxLeft) +
    borderColor + '╰' + '─'.repeat(boxWidth - 2) + '╯' + rst,
  );
}

export function clearCommandOverlay(): void {
  const layout = calculateLayout();
  const totalRows = layout.cmdOverlayHeight + 2;
  for (let i = 0; i < totalRows; i++) {
    clearRow(layout.cmdOverlayTop + i);
  }
}

export function renderAboutScreen(): void {
  const theme = getTheme();
  const layout = calculateLayout();
  const bg = bgHex(theme.colors.background);
  const fg = fgHex(theme.colors.foreground) + bg;
  const dim = fgHex(theme.colors.dimmed) + bg;
  const accent = ANSI.BOLD + fgHex(theme.colors.accent) + bg;
  const rst = ANSI.RESET;

  const startRow = layout.logoRow + 4;
  
  for (let i = 0; i < 20; i++) {
    clearRow(startRow + i);
  }

  const col = layout.leftMargin;
  let row = startRow;
  
  write(ANSI.moveTo(row++, col) + fg + "Klycky is a terminal-native typing application" + rst);
  write(ANSI.moveTo(row++, col) + fg + "inspired by Monkeytype and built for developers." + rst);
  row++;
  
  write(ANSI.moveTo(row++, col) + fg + "It exists to bring a premium, distraction-free typing" + rst);
  write(ANSI.moveTo(row++, col) + fg + "experience directly into your terminal workflow." + rst);
  row++;
  
  write(ANSI.moveTo(row++, col) + fg + "The project is evolving with more features planned." + rst);
  write(ANSI.moveTo(row++, col) + fg + "Our goal is building a beautiful terminal typing experience." + rst);
  row++;
  
  write(ANSI.moveTo(row++, col) + fg + "A lot of work is still left to be done and I'd be" + rst);
  write(ANSI.moveTo(row++, col) + fg + "happy to accept ideas and contributions :D" + rst);
  row++;
  
  write(ANSI.moveTo(row++, col) + fg + "Thanks for checking out this project!" + rst);
  row++;
  
  const repoUrl = "https://github.com/Debpriyo/klycky";
  const repoText = "Star this project on GitHub";
  const repoLink = `\x1b]8;;${repoUrl}\x1b\\\x1b[4m${accent}${repoText}${rst}\x1b]8;;\x1b\\`;
  write(ANSI.moveTo(row++, col) + repoLink);
  
  row += 3;
  const authorUrl = "https://debpriyo.is-a.dev/";
  const authorText = "Deb";
  const authorLink = `\x1b]8;;${authorUrl}\x1b\\\x1b[4m${accent}${authorText}${rst}\x1b]8;;\x1b\\`;
  
  const footerText = dim + "Made with ❤️ by " + rst + authorLink;
  write(ANSI.moveTo(row, col) + footerText);
}
