/**
 * Klycky - ASCII Font
 *
 * Minimal block-style ASCII font for rendering large numbers
 * on the results screen.
 */

const FONT_MAP: Record<string, string[]> = {
  '0': [
    ' ╭──╮ ',
    ' │  │ ',
    ' │  │ ',
    ' ╰──╯ '
  ],
  '1': [
    ' ╭─╮  ',
    '   │  ',
    '   │  ',
    ' ╰─┴─ '
  ],
  '2': [
    ' ╭──╮ ',
    ' ╭──╯ ',
    ' │    ',
    ' ╰──╯ '
  ],
  '3': [
    ' ╭──╮ ',
    ' ╰──╮ ',
    '    │ ',
    ' ╰──╯ '
  ],
  '4': [
    ' │  │ ',
    ' ╰──┤ ',
    '    │ ',
    '    ╵ '
  ],
  '5': [
    ' ╭──╮ ',
    ' ╰──╮ ',
    '    │ ',
    ' ╰──╯ '
  ], // Let's refine the shape for some of these
  '6': [
    ' ╭──╮ ',
    ' ├──╮ ',
    ' │  │ ',
    ' ╰──╯ '
  ],
  '7': [
    ' ╭──╮ ',
    '    │ ',
    '   ╭╯ ',
    '   ╵  '
  ],
  '8': [
    ' ╭──╮ ',
    ' ├──┤ ',
    ' │  │ ',
    ' ╰──╯ '
  ],
  '9': [
    ' ╭──╮ ',
    ' ╰──┤ ',
    '    │ ',
    ' ╰──╯ '
  ],
  '%': [
    ' ╭╮ ╷ ',
    ' ╰╯╭╯ ',
    ' ╭╯╭╮ ',
    ' ╵ ╰╯ '
  ],
  '.': [
    '      ',
    '      ',
    '      ',
    '  ╷   '
  ],
  '-': [
    '      ',
    ' ───  ',
    '      ',
    '      '
  ],
  ' ': [
    '      ',
    '      ',
    '      ',
    '      '
  ],
};

// Adjusted '5'
FONT_MAP['5'] = [
  ' ╭──╮ ',
  ' ╰──╮ ',
  '    │ ',
  ' ╰──╯ '
];
// Wait, for 5 the top should be left aligned
FONT_MAP['5'] = [
  ' ╭──╮ ',
  ' ╰──╮ ',
  '    │ ',
  ' ╰──╯ '
];
FONT_MAP['5'] = [
  ' ╭─── ',
  ' ╰──╮ ',
  '    │ ',
  ' ╰──╯ '
];

/**
 * Render a string into a multi-line array of strings using the block font.
 */
export function renderLargeText(text: string): string[] {
  const result: string[] = ['', '', '', ''];
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const lines = FONT_MAP[char] || FONT_MAP[' '];
    for (let j = 0; j < 4; j++) {
      result[j] += lines[j];
    }
  }
  return result;
}
