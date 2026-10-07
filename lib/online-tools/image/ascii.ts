// Image → ASCII art. Characters are about twice as tall as they are wide, so
// rows are sampled at half the column density to keep proportions.

export const ASCII_CHARSETS: Record<string, { label: string; chars: string }> =
  {
    standard: { label: 'Standard', chars: '@%#*+=-:. ' },
    detailed: {
      label: 'Detailed (70 levels)',
      chars:
        '$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\\|()1{}[]?-_+~<>i!lI;:,"^`\'. ',
    },
    blocks: { label: 'Blocks', chars: '█▓▒░ ' },
    binary: { label: 'Two-tone', chars: '# ' },
  };

export type AsciiResult = {
  text: string;
  rows: number;
  cols: number;
  /** Average colour per character, row-major, when `color` was requested. */
  colors?: [number, number, number][];
};

/**
 * `chars` runs from darkest (dense) to lightest (sparse), as drawn on a light
 * background. `invert` flips that for dark backgrounds.
 */
export function imageToAscii(
  img: { data: Uint8ClampedArray; width: number; height: number },
  opts: {
    cols: number;
    chars: string;
    invert?: boolean;
    color?: boolean;
    aspect?: number;
  },
): AsciiResult {
  const chars = Array.from(opts.chars);
  if (chars.length < 2) throw new Error('Use at least two characters.');
  const cols = Math.max(1, Math.min(opts.cols, img.width));
  const cellW = img.width / cols;
  const cellH = cellW / (opts.aspect ?? 0.5);
  const rows = Math.max(1, Math.round(img.height / cellH));
  const lines: string[] = [];
  const colors: [number, number, number][] = [];
  for (let r = 0; r < rows; r++) {
    let line = '';
    const y0 = Math.floor((r * img.height) / rows);
    const y1 = Math.max(y0 + 1, Math.floor(((r + 1) * img.height) / rows));
    for (let c = 0; c < cols; c++) {
      const x0 = Math.floor(c * cellW);
      const x1 = Math.max(x0 + 1, Math.floor((c + 1) * cellW));
      let sr = 0;
      let sg = 0;
      let sb = 0;
      let n = 0;
      for (let y = y0; y < y1; y++)
        for (let x = x0; x < x1; x++) {
          const i = (y * img.width + x) * 4;
          const a = img.data[i + 3] / 255;
          // Transparent pixels count as white (the usual page background).
          sr += img.data[i] * a + 255 * (1 - a);
          sg += img.data[i + 1] * a + 255 * (1 - a);
          sb += img.data[i + 2] * a + 255 * (1 - a);
          n++;
        }
      const R = sr / n;
      const G = sg / n;
      const B = sb / n;
      let lum = (0.2126 * R + 0.7152 * G + 0.0722 * B) / 255;
      if (opts.invert) lum = 1 - lum;
      line +=
        chars[Math.min(chars.length - 1, Math.round(lum * (chars.length - 1)))];
      if (opts.color)
        colors.push([Math.round(R), Math.round(G), Math.round(B)]);
    }
    lines.push(line.replace(/\s+$/, ''));
  }
  return {
    text: lines.join('\n'),
    rows,
    cols,
    ...(opts.color ? { colors } : {}),
  };
}
