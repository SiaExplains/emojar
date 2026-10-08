// Helpers for the world time-zone map: DST detection, the sun's position for
// the day/night overlay, map projection and the bundled city list.

import CITIES from '../data/cities.json';
import { timeZoneOffset } from './dates';

/** [name, ISO country, lat, lon, IANA zone, isCapital] */
export type City = [string, string, number, number, string, 0 | 1];
export const MAP_CITIES = CITIES as City[];

/** Standard (non-DST) offset: the smaller of the January and July offsets. */
export function standardOffset(tz: string, year: number): number {
  return Math.min(
    timeZoneOffset(new Date(Date.UTC(year, 0, 1)), tz),
    timeZoneOffset(new Date(Date.UTC(year, 6, 1)), tz),
  );
}

export function isDst(tz: string, at: Date): boolean {
  const year = at.getUTCFullYear();
  const jan = timeZoneOffset(new Date(Date.UTC(year, 0, 1)), tz);
  const jul = timeZoneOffset(new Date(Date.UTC(year, 6, 1)), tz);
  return jan !== jul && timeZoneOffset(at, tz) === Math.max(jan, jul);
}

export function observesDst(tz: string, year: number): boolean {
  return (
    timeZoneOffset(new Date(Date.UTC(year, 0, 1)), tz) !==
    timeZoneOffset(new Date(Date.UTC(year, 6, 1)), tz)
  );
}

/**
 * Sub-solar point (where the sun is overhead), accurate to a fraction of a
 * degree — plenty for shading a world map.
 */
export function subsolarPoint(at: Date): { lat: number; lon: number } {
  const jd = at.getTime() / 86_400_000 + 2440587.5;
  const n = jd - 2451545.0;
  const L = (280.46 + 0.9856474 * n) % 360;
  const g = ((357.528 + 0.9856003 * n) % 360) * (Math.PI / 180);
  const lambda =
    (L + 1.915 * Math.sin(g) + 0.02 * Math.sin(2 * g)) * (Math.PI / 180);
  const eps = (23.439 - 0.0000004 * n) * (Math.PI / 180);
  const decl = Math.asin(Math.sin(eps) * Math.sin(lambda));
  // Equation of time (minutes) shifts solar noon away from 12:00 UTC.
  const ra = Math.atan2(Math.cos(eps) * Math.sin(lambda), Math.cos(lambda));
  let eot = (L * Math.PI) / 180 - ra;
  eot = Math.atan2(Math.sin(eot), Math.cos(eot)) * (720 / Math.PI);
  const minutes =
    at.getUTCHours() * 60 + at.getUTCMinutes() + at.getUTCSeconds() / 60;
  let lon = -((minutes + eot - 720) / 4);
  lon = ((lon + 540) % 360) - 180;
  return { lat: (decl * 180) / Math.PI, lon };
}

/** True when the sun is above the horizon at the given place. */
export function isDaylight(
  lat: number,
  lon: number,
  sun: { lat: number; lon: number },
) {
  const r = Math.PI / 180;
  const cos =
    Math.sin(lat * r) * Math.sin(sun.lat * r) +
    Math.cos(lat * r) * Math.cos(sun.lat * r) * Math.cos((lon - sun.lon) * r);
  return cos > -0.0145; // sun's apparent radius + refraction (≈ −0.83°)
}

/** Equirectangular projection into a W×H box. */
export const project = (lat: number, lon: number, w: number, h: number) => ({
  x: ((lon + 180) / 360) * w,
  y: ((90 - lat) / 180) * h,
});

export function searchCities(q: string, limit = 12): City[] {
  const s = q.trim().toLowerCase();
  if (!s) return [];
  const starts: City[] = [];
  const contains: City[] = [];
  for (const c of MAP_CITIES) {
    const n = c[0].toLowerCase();
    const zone = c[4].toLowerCase().replace(/_/g, ' ');
    if (n.startsWith(s)) starts.push(c);
    else if (n.includes(s) || zone.includes(s) || c[1].toLowerCase() === s)
      contains.push(c);
  }
  return [...starts, ...contains].slice(0, limit);
}

/** Hours between two zones' wall clocks at the given instant. */
export function hourDifference(a: string, b: string, at: Date): number {
  return (timeZoneOffset(at, b) - timeZoneOffset(at, a)) / 60;
}
