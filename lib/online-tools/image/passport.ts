// Passport/visa photo sizes and print-sheet layout. Sizes follow the issuing
// authorities' published specifications; rules change, so the tool page tells
// users to check the official requirements before submitting.

export type PassportPreset = {
  id: string;
  label: string;
  widthMm: number;
  heightMm: number;
  /** Chin-to-crown height as a share of the photo height (min, max). */
  head: [number, number];
};

const IN = 25.4;

export const PASSPORT_PRESETS: PassportPreset[] = [
  {
    id: 'us',
    label: 'United States — passport & visa (2 × 2 in)',
    widthMm: 2 * IN,
    heightMm: 2 * IN,
    head: [0.5, 0.69],
  },
  {
    id: 'uk',
    label: 'United Kingdom — passport (35 × 45 mm)',
    widthMm: 35,
    heightMm: 45,
    head: [29 / 45, 34 / 45],
  },
  {
    id: 'schengen',
    label: 'EU / Schengen — passport, ID & visa (35 × 45 mm)',
    widthMm: 35,
    heightMm: 45,
    head: [32 / 45, 36 / 45],
  },
  {
    id: 'canada',
    label: 'Canada — passport (50 × 70 mm)',
    widthMm: 50,
    heightMm: 70,
    head: [31 / 70, 36 / 70],
  },
  {
    id: 'india',
    label: 'India — passport (35 × 45 mm)',
    widthMm: 35,
    heightMm: 45,
    head: [0.7, 0.8],
  },
  {
    id: 'india-visa',
    label: 'India — visa (2 × 2 in)',
    widthMm: 2 * IN,
    heightMm: 2 * IN,
    head: [0.5, 0.69],
  },
  {
    id: 'china',
    label: 'China — passport & visa (33 × 48 mm)',
    widthMm: 33,
    heightMm: 48,
    head: [28 / 48, 33 / 48],
  },
  {
    id: 'australia',
    label: 'Australia — passport (35 × 45 mm)',
    widthMm: 35,
    heightMm: 45,
    head: [32 / 45, 36 / 45],
  },
  {
    id: 'japan',
    label: 'Japan — passport (35 × 45 mm)',
    widthMm: 35,
    heightMm: 45,
    head: [32 / 45, 36 / 45],
  },
];

export function mmToPx(mm: number, dpi = 300): number {
  return Math.round((mm / IN) * dpi);
}

export type SheetSpec = { id: string; label: string; wMm: number; hMm: number };

export const SHEETS: SheetSpec[] = [
  { id: '4x6', label: '4 × 6 in photo print', wMm: 6 * IN, hMm: 4 * IN },
  { id: 'a4', label: 'A4 paper', wMm: 210, hMm: 297 },
  { id: 'letter', label: 'US Letter paper', wMm: 8.5 * IN, hMm: 11 * IN },
];

export type SheetLayout = {
  width: number;
  height: number;
  photos: { x: number; y: number; w: number; h: number }[];
};

/**
 * Tiles as many photos as fit on a sheet, centred. Tries both orientations and
 * both a spaced layout (gap + margin) and an edge-to-edge one, keeping whichever
 * fits more photos (spaced wins ties). All values in pixels at `dpi`.
 */
export function sheetLayout(
  photoWmm: number,
  photoHmm: number,
  sheet: { wMm: number; hMm: number },
  dpi = 300,
): SheetLayout {
  const spaced = layoutWith(photoWmm, photoHmm, sheet, dpi, 2, 4);
  const tight = layoutWith(photoWmm, photoHmm, sheet, dpi, 0, 0);
  return tight.photos.length > spaced.photos.length ? tight : spaced;
}

function layoutWith(
  photoWmm: number,
  photoHmm: number,
  sheet: { wMm: number; hMm: number },
  dpi: number,
  gapMm: number,
  marginMm: number,
): SheetLayout {
  const fit = (sw: number, sh: number) => {
    const cols = Math.floor(
      (sw - 2 * marginMm + gapMm) / (photoWmm + gapMm) + 1e-9,
    );
    const rows = Math.floor(
      (sh - 2 * marginMm + gapMm) / (photoHmm + gapMm) + 1e-9,
    );
    return { sw, sh, cols: Math.max(0, cols), rows: Math.max(0, rows) };
  };
  const a = fit(sheet.wMm, sheet.hMm);
  const b = fit(sheet.hMm, sheet.wMm);
  const best = b.cols * b.rows > a.cols * a.rows ? b : a;
  const width = mmToPx(best.sw, dpi);
  const height = mmToPx(best.sh, dpi);
  const pw = mmToPx(photoWmm, dpi);
  const ph = mmToPx(photoHmm, dpi);
  const gap = mmToPx(gapMm, dpi);
  const blockW = best.cols * pw + Math.max(0, best.cols - 1) * gap;
  const blockH = best.rows * ph + Math.max(0, best.rows - 1) * gap;
  const x0 = Math.round((width - blockW) / 2);
  const y0 = Math.round((height - blockH) / 2);
  const photos: SheetLayout['photos'] = [];
  for (let r = 0; r < best.rows; r++)
    for (let c = 0; c < best.cols; c++)
      photos.push({
        x: x0 + c * (pw + gap),
        y: y0 + r * (ph + gap),
        w: pw,
        h: ph,
      });
  return { width, height, photos };
}
