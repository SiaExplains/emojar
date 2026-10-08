// Time formatting for the media tools (trim points like “1:15.4”).

/** 75.4 → “1:15.4” */
export const fmtTime = (s: number) => {
  const m = Math.floor(s / 60);
  const sec = s - m * 60;
  return `${m}:${sec.toFixed(1).padStart(4, '0')}`;
};

/** Parses “1:15.4”, “75.4” or “0:05” into seconds (NaN if invalid). */
export function parseTime(v: string): number {
  const parts = v.trim().split(':').map(Number);
  if (!parts.length || parts.some((p) => !Number.isFinite(p) || p < 0))
    return NaN;
  return parts.reduce((acc, p) => acc * 60 + p, 0);
}
