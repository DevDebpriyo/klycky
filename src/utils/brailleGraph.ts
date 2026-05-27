

// Generates braille graph
export function generateBrailleGraph(data: number[], width: number, height: number): string[] {
  if (data.length === 0) {
    return Array(height).fill(' '.repeat(width));
  }

  const cols = width * 2;
  const resampled: number[] = [];

  if (data.length <= cols) {

    for (let i = 0; i < cols; i++) {
      const srcIdx = Math.floor((i / cols) * data.length);
      resampled.push(data[srcIdx]);
    }
  } else {

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

      const h1 = (col1 - min) / range;
      const h2 = (col2 - min) / range;

      const dots1 = Math.round(h1 * height * 4);
      const dots2 = Math.round(h2 * height * 4);

      let charCode = 0x2800;

      for (let dotRow = 0; dotRow < 4; dotRow++) {

        const absDotRow = r * 4 + dotRow;

        if ((height * 4 - absDotRow) <= dots1) {
          charCode |= dotFlags[dotRow][0];
        }
        if ((height * 4 - absDotRow) <= dots2) {
          charCode |= dotFlags[dotRow][1];
        }
      }

      rowStr += String.fromCharCode(charCode);
    }
    result.push(rowStr);
  }

  return result;
}
