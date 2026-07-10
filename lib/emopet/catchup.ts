// Pure, timestamp-driven catch-up math. No I/O, no React, no localStorage —
// everything here is a deterministic function of (now, lastAt, config) so it
// can be unit-tested in isolation. This is the highest-bug-risk part of the
// feature (offline catch-up), which is exactly why it lives on its own.
//
// One shared primitive — computeTicks — backs both stat decay and GEM accrual,
// so the offline cap behaves identically for both (plan §4/§5).

import { EMOPET_CONFIG } from './config';
import type { PetStats } from './types';

export function clamp(value: number, min = 0, max = 100): number {
  return Math.min(max, Math.max(min, value));
}

export interface TickResult {
  /** Whole ticks elapsed since lastAt, after applying the offline cap. */
  ticks: number;
  /** New lastAt timestamp (ms) to persist. */
  newLastAt: number;
  /** True when the raw elapsed time exceeded the offline cap. */
  capped: boolean;
}

/**
 * Count how many whole `tickMs` intervals elapsed between `lastAt` and `now`,
 * and return the timestamp to persist as the new `lastAt`.
 *
 * Remainder handling is deliberate and load-bearing:
 *   - Uncapped: advance `newLastAt` by only the *consumed* whole ticks, so the
 *     sub-tick remainder carries forward. Without this, a frequent in-tab tick
 *     (elapsed < tickMs → 0 ticks) that reset lastAt to `now` every call would
 *     starve accrual/decay forever.
 *   - Capped: the raw elapsed exceeded the cap, so we forfeit the excess and
 *     jump `newLastAt` to `now`. Advancing by only the capped ticks would leave
 *     lastAt in the past and let a user farm the forfeited time by reloading.
 */
export function computeTicks(
  now: number,
  lastAt: number,
  tickMs: number,
  offlineCapMs: number,
): TickResult {
  const elapsed = Math.max(0, now - lastAt);
  const capped = elapsed > offlineCapMs;
  const usableElapsed = capped ? offlineCapMs : elapsed;
  const ticks = Math.floor(usableElapsed / tickMs);
  const newLastAt = capped ? now : lastAt + ticks * tickMs;
  return { ticks, newLastAt, capped };
}

export interface GemAccrualResult {
  /** GEM earned over the elapsed window (never negative). */
  earned: number;
  /** Timestamp (ms) to store as wallet.lastGemAccrualAt. */
  newLastAccrualAt: number;
  capped: boolean;
}

/** Offline-capped idle GEM accrual (plan §5). */
export function accrueGems(
  now: number,
  lastGemAccrualAt: number,
  config: typeof EMOPET_CONFIG = EMOPET_CONFIG,
): GemAccrualResult {
  const { tickIntervalMs, gemPerTick, offlineCapMs } = config.gem;
  const { ticks, newLastAt, capped } = computeTicks(
    now,
    lastGemAccrualAt,
    tickIntervalMs,
    offlineCapMs,
  );
  return {
    earned: ticks * gemPerTick,
    newLastAccrualAt: newLastAt,
    capped,
  };
}

export interface StatDecayResult {
  stats: PetStats;
  /** Timestamp (ms) to store as pet.lastTickAt. */
  newLastTickAt: number;
  capped: boolean;
}

/**
 * Time-based stat decay (plan §4). hunger and cleanliness decay directly on the
 * clock; health and happiness are *derived* from them rather than decayed
 * independently — health sags under hunger/cleanliness neglect, and happiness
 * tracks the overall average.
 */
export function decayStats(
  stats: PetStats,
  now: number,
  lastTickAt: number,
  config: typeof EMOPET_CONFIG = EMOPET_CONFIG,
): StatDecayResult {
  const { tickIntervalMs, offlineCapMs, decayPerTick } = config.stats;
  const { ticks, newLastAt, capped } = computeTicks(
    now,
    lastTickAt,
    tickIntervalMs,
    offlineCapMs,
  );

  const hunger = clamp(stats.hunger - ticks * decayPerTick.hunger);
  const cleanliness = clamp(
    stats.cleanliness - ticks * decayPerTick.cleanliness,
  );
  const { health, happiness } = deriveVitals(
    { hunger, cleanliness, health: stats.health, happiness: stats.happiness },
    ticks,
  );

  return {
    stats: { hunger, cleanliness, health, happiness },
    newLastTickAt: newLastAt,
    capped,
  };
}

const NEGLECT_THRESHOLD = 30;

/**
 * Derive health and happiness from the (already decayed) primary stats.
 * Pure and monotonic: with zero elapsed ticks it returns the inputs unchanged,
 * so it never mutates state on a no-op catch-up.
 */
export function deriveVitals(
  stats: PetStats,
  ticks: number,
): Pick<PetStats, 'health' | 'happiness'> {
  if (ticks <= 0) {
    return { health: stats.health, happiness: stats.happiness };
  }

  // Neglect: how far hunger/cleanliness have fallen below the comfort line.
  const neglect =
    Math.max(0, NEGLECT_THRESHOLD - stats.hunger) +
    Math.max(0, NEGLECT_THRESHOLD - stats.cleanliness);

  // Health erodes only while neglected; recovers gently otherwise.
  const healthDelta = neglect > 0 ? -0.05 * neglect * ticks : 0.02 * ticks;
  const health = clamp(stats.health + healthDelta);

  // Happiness eases toward the average of the other three stats.
  const target = (stats.hunger + stats.cleanliness + health) / 3;
  const step = clamp(0.02 * ticks, 0, 1); // fraction of the gap closed
  const happiness = clamp(stats.happiness + (target - stats.happiness) * step);

  return { health, happiness };
}

/** Whole days since createdAt — cosmetic age counter (plan §4). */
export function computeAgeDays(createdAtMs: number, now: number): number {
  return Math.max(0, Math.floor((now - createdAtMs) / (24 * 60 * 60_000)));
}
