/**
 * Klycky - Braille Graph
 *
 * Renders an array of data points into a multi-line Braille graph.
 */

export function generateBrailleGraph(data: number[], width: number, height: number): string[] {
  if (data.length === 0) {
    return Array(height).fill(' '.repeat(width));
  }

  // Resample data to fit width * 2 (since braille has 2 columns per char)
  const cols = width * 2;
  const resampled: number[] = [];
  
  if (data.length <= cols) {
    // Pad or stretch? Let's just stretch to fill width
    for (let i = 0; i < cols; i++) {
      const srcIdx = Math.floor((i / cols) * data.length);
      resampled.push(data[srcIdx]);
    }
  } else {
    // Decimate
    for (let i = 0; i < cols; i++) {
      const startIdx = Math.floor((i / cols) * data.length);
      const endIdx = Math.max(startIdx + 1, Math.floor(((i + 1) / cols) * data.length));
      let sum = 0;
      for (let j = startIdx; j < endIdx; j++) {
        sum += data[j];
      }
      resampled.push(sum / (endIdx - startIdx));
    }
  }

  const min = Math.min(...resampled);
  const max = Math.max(...resampled);
  const range = (max - min) || 1;

  // Braille character base is 0x2800
  // Dot matrix:
  // 0x01 (1)  0x08 (4)
  // 0x02 (2)  0x10 (5)
  // 0x04 (3)  0x20 (6)
  // 0x40 (7)  0x80 (8)
  const dotFlags = [
    [0x01, 0x08],
    [0x02, 0x10],
    [0x04, 0x20],
    [0x40, 0x80],
  ];

  const result: string[] = [];

  for (let r = 0; r < height; r++) {
    let rowStr = '';
    for (let c = 0; c < width; c++) {
      const col1 = resampled[c * 2];
      const col2 = resampled[c * 2 + 1];

      // Normalized height (0 to 1)
      const h1 = (col1 - min) / range;
      const h2 = (col2 - min) / range;

      // Dots available vertically: height * 4
      const dots1 = Math.round(h1 * height * 4);
      const dots2 = Math.round(h2 * height * 4);

      let charCode = 0x2800;

      for (let dotRow = 0; dotRow < 4; dotRow++) {
        // Absolute dot index from top (0 is top-most dot of the entire graph)
        const absDotRow = r * 4 + dotRow;
        
        // We fill from bottom up. Total dots = height * 4
        // So a dot is ON if (height * 4 - absDotRow) <= dots
        if ((height * 4 - absDotRow) <= dots1) {
          charCode |= dotFlags[dotRow][0];
        }
        if ((height * 4 - absDotRow) <= dots2) {
          charCode |= dotFlags[dotRow][1];
        }
      }

      // If nothing is set, we might use a blank or braille empty pattern (0x2800)
      rowStr += String.fromCharCode(charCode);
    }
    result.push(rowStr);
  }

  return result;
}
