// Geometry for the grid splitter, collage maker, social resizer and watermark.

export type Rect = { x: number; y: number; w: number; h: number };

/* ---------- Grid splitter ---------- */

export type Tile = Rect & { row: number; col: number; post: number };

/** Largest centred crop with the aspect ratio `aw:ah`. */
export function centerCrop(w: number, h: number, aw: number, ah: number): Rect {
  const target = aw / ah;
  if (w / h > target) {
    const cw = Math.round(h * target);
    return { x: Math.round((w - cw) / 2), y: 0, w: cw, h };
  }
  const ch = Math.round(w / target);
  return { x: 0, y: Math.round((h - ch) / 2), w, h: ch };
}

/**
 * Splits `area` into rows × cols tiles with integer edges that cover it
 * exactly. `post` is the Instagram upload order: the last tile (bottom right)
 * is posted first so the grid reads correctly on the profile.
 */
export function splitGrid(area: Rect, rows: number, cols: number): Tile[] {
  const tiles: Tile[] = [];
  const total = rows * cols;
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++) {
      const x0 = area.x + Math.round((c * area.w) / cols);
      const x1 = area.x + Math.round(((c + 1) * area.w) / cols);
      const y0 = area.y + Math.round((r * area.h) / rows);
      const y1 = area.y + Math.round(((r + 1) * area.h) / rows);
      tiles.push({
        x: x0,
        y: y0,
        w: x1 - x0,
        h: y1 - y0,
        row: r,
        col: c,
        post: total - (r * cols + c),
      });
    }
  return tiles;
}

/* ---------- Collage ---------- */

export type CollageLayout = {
  id: string;
  label: string;
  /** Cells as fractions of the canvas (0–1). */
  cells: Rect[];
};

const grid = (rows: number, cols: number): Rect[] => {
  const out: Rect[] = [];
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++)
      out.push({ x: c / cols, y: r / rows, w: 1 / cols, h: 1 / rows });
  return out;
};

export const COLLAGE_LAYOUTS: CollageLayout[] = [
  { id: '2h', label: '2 side by side', cells: grid(1, 2) },
  { id: '2v', label: '2 stacked', cells: grid(2, 1) },
  { id: '3h', label: '3 columns', cells: grid(1, 3) },
  {
    id: '3l',
    label: '1 large + 2',
    cells: [
      { x: 0, y: 0, w: 0.6, h: 1 },
      { x: 0.6, y: 0, w: 0.4, h: 0.5 },
      { x: 0.6, y: 0.5, w: 0.4, h: 0.5 },
    ],
  },
  {
    id: '3t',
    label: '1 wide + 2',
    cells: [
      { x: 0, y: 0, w: 1, h: 0.6 },
      { x: 0, y: 0.6, w: 0.5, h: 0.4 },
      { x: 0.5, y: 0.6, w: 0.5, h: 0.4 },
    ],
  },
  { id: '4g', label: '2 × 2 grid', cells: grid(2, 2) },
  {
    id: '4l',
    label: '1 large + 3',
    cells: [
      { x: 0, y: 0, w: 0.65, h: 1 },
      { x: 0.65, y: 0, w: 0.35, h: 1 / 3 },
      { x: 0.65, y: 1 / 3, w: 0.35, h: 1 / 3 },
      { x: 0.65, y: 2 / 3, w: 0.35, h: 1 / 3 },
    ],
  },
  {
    id: '5m',
    label: '2 + 3',
    cells: [
      { x: 0, y: 0, w: 0.5, h: 0.55 },
      { x: 0.5, y: 0, w: 0.5, h: 0.55 },
      { x: 0, y: 0.55, w: 1 / 3, h: 0.45 },
      { x: 1 / 3, y: 0.55, w: 1 / 3, h: 0.45 },
      { x: 2 / 3, y: 0.55, w: 1 / 3, h: 0.45 },
    ],
  },
  { id: '6g', label: '3 × 2 grid', cells: grid(2, 3) },
  {
    id: '7m',
    label: '3 + 4',
    cells: [
      ...[0, 1, 2].map((i) => ({ x: i / 3, y: 0, w: 1 / 3, h: 0.5 })),
      ...[0, 1, 2, 3].map((i) => ({ x: i / 4, y: 0.5, w: 1 / 4, h: 0.5 })),
    ],
  },
  { id: '8g', label: '4 × 2 grid', cells: grid(2, 4) },
  { id: '9g', label: '3 × 3 grid', cells: grid(3, 3) },
];

/**
 * Converts fractional cells to pixels with an even `gap` between cells and
 * around the edge.
 */
export function collageRects(
  cells: Rect[],
  width: number,
  height: number,
  gap: number,
): Rect[] {
  const iw = width - gap;
  const ih = height - gap;
  const half = gap / 2;
  return cells.map((c) => {
    const x0 = half + c.x * iw + half;
    const y0 = half + c.y * ih + half;
    const x1 = half + (c.x + c.w) * iw - half;
    const y1 = half + (c.y + c.h) * ih - half;
    return {
      x: Math.round(x0),
      y: Math.round(y0),
      w: Math.max(1, Math.round(x1) - Math.round(x0)),
      h: Math.max(1, Math.round(y1) - Math.round(y0)),
    };
  });
}

/* ---------- Fit maths ---------- */

/**
 * Source rectangle that fills `dw × dh` (object-fit: cover). `fx`/`fy` (0–1)
 * choose which part of the overflow stays visible; `zoom` ≥ 1 crops further.
 */
export function coverSource(
  sw: number,
  sh: number,
  dw: number,
  dh: number,
  fx = 0.5,
  fy = 0.5,
  zoom = 1,
): Rect {
  const scale = Math.max(dw / sw, dh / sh) * Math.max(1, zoom);
  const w = dw / scale;
  const h = dh / scale;
  return {
    x: (sw - w) * Math.min(1, Math.max(0, fx)),
    y: (sh - h) * Math.min(1, Math.max(0, fy)),
    w,
    h,
  };
}

/** Destination rectangle that shows all of the source inside `dw × dh`. */
export function containDest(
  sw: number,
  sh: number,
  dw: number,
  dh: number,
): Rect {
  const scale = Math.min(dw / sw, dh / sh);
  const w = Math.round(sw * scale);
  const h = Math.round(sh * scale);
  return { x: Math.round((dw - w) / 2), y: Math.round((dh - h) / 2), w, h };
}

/* ---------- Social media presets ---------- */

export type SocialPreset = { id: string; label: string; w: number; h: number };

export const SOCIAL_PLATFORMS: Record<
  string,
  { name: string; presets: SocialPreset[] }
> = {
  instagram: {
    name: 'Instagram',
    presets: [
      { id: 'ig-portrait', label: 'Post — portrait 4:5', w: 1080, h: 1350 },
      { id: 'ig-square', label: 'Post — square 1:1', w: 1080, h: 1080 },
      { id: 'ig-landscape', label: 'Post — landscape 1.91:1', w: 1080, h: 566 },
      { id: 'ig-story', label: 'Story / Reel 9:16', w: 1080, h: 1920 },
      { id: 'ig-profile', label: 'Profile picture', w: 320, h: 320 },
    ],
  },
  facebook: {
    name: 'Facebook',
    presets: [
      { id: 'fb-post', label: 'Feed post / link image', w: 1200, h: 630 },
      { id: 'fb-square', label: 'Square post', w: 1080, h: 1080 },
      { id: 'fb-cover', label: 'Page cover', w: 851, h: 315 },
      { id: 'fb-event', label: 'Event cover', w: 1920, h: 1005 },
      { id: 'fb-story', label: 'Story', w: 1080, h: 1920 },
      { id: 'fb-profile', label: 'Profile picture', w: 720, h: 720 },
    ],
  },
  'twitter-x': {
    name: 'X (Twitter)',
    presets: [
      { id: 'x-post', label: 'Post image 16:9', w: 1600, h: 900 },
      { id: 'x-square', label: 'Post image 1:1', w: 1080, h: 1080 },
      { id: 'x-header', label: 'Header', w: 1500, h: 500 },
      { id: 'x-profile', label: 'Profile picture', w: 400, h: 400 },
    ],
  },
  linkedin: {
    name: 'LinkedIn',
    presets: [
      { id: 'li-post', label: 'Post / link image', w: 1200, h: 627 },
      { id: 'li-square', label: 'Square post', w: 1080, h: 1080 },
      { id: 'li-banner', label: 'Profile background', w: 1584, h: 396 },
      { id: 'li-company', label: 'Company page cover', w: 1128, h: 191 },
      { id: 'li-profile', label: 'Profile picture', w: 400, h: 400 },
    ],
  },
  youtube: {
    name: 'YouTube',
    presets: [
      { id: 'yt-thumb', label: 'Video thumbnail', w: 1280, h: 720 },
      { id: 'yt-banner', label: 'Channel banner', w: 2560, h: 1440 },
      { id: 'yt-profile', label: 'Channel icon', w: 800, h: 800 },
      { id: 'yt-shorts', label: 'Shorts cover 9:16', w: 1080, h: 1920 },
    ],
  },
  pinterest: {
    name: 'Pinterest',
    presets: [
      { id: 'pin', label: 'Standard pin 2:3', w: 1000, h: 1500 },
      { id: 'pin-square', label: 'Square pin', w: 1000, h: 1000 },
    ],
  },
  tiktok: {
    name: 'TikTok',
    presets: [
      { id: 'tt-video', label: 'Video / photo 9:16', w: 1080, h: 1920 },
      { id: 'tt-profile', label: 'Profile picture', w: 200, h: 200 },
    ],
  },
};

/* ---------- Watermark placement ---------- */

export type Anchor =
  | 'top-left'
  | 'top'
  | 'top-right'
  | 'left'
  | 'center'
  | 'right'
  | 'bottom-left'
  | 'bottom'
  | 'bottom-right';

export const ANCHORS: Anchor[] = [
  'top-left',
  'top',
  'top-right',
  'left',
  'center',
  'right',
  'bottom-left',
  'bottom',
  'bottom-right',
];

/** Centre point for a `w × h` mark anchored inside `W × H` with a margin. */
export function anchorPoint(
  anchor: Anchor,
  W: number,
  H: number,
  w: number,
  h: number,
  margin: number,
): { x: number; y: number } {
  const col = anchor.endsWith('left') ? 0 : anchor.endsWith('right') ? 2 : 1;
  const row = anchor.startsWith('top')
    ? 0
    : anchor.startsWith('bottom')
      ? 2
      : 1;
  const x = col === 0 ? margin + w / 2 : col === 2 ? W - margin - w / 2 : W / 2;
  const y = row === 0 ? margin + h / 2 : row === 2 ? H - margin - h / 2 : H / 2;
  return { x, y };
}

/**
 * Centre points for a tiled watermark: a staggered grid that still covers the
 * corners after the marks are rotated.
 */
export function tilePoints(
  W: number,
  H: number,
  stepX: number,
  stepY: number,
): { x: number; y: number }[] {
  const pts: { x: number; y: number }[] = [];
  const sx = Math.max(8, stepX);
  const sy = Math.max(8, stepY);
  let row = 0;
  for (let y = -sy; y <= H + sy; y += sy, row++) {
    const offset = row % 2 ? sx / 2 : 0;
    for (let x = -sx + offset; x <= W + sx; x += sx) pts.push({ x, y });
  }
  return pts;
}
