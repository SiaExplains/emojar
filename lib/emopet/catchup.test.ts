import { describe, it, expect } from 'vitest';
import {
  accrueGems,
  computeTicks,
  decayStats,
  deriveVitals,
  clamp,
} from './catchup';
import { EMOPET_CONFIG } from './config';
import type { PetStats } from './types';

const MIN = 60_000;
const HOUR = 60 * MIN;
const T0 = Date.parse('2026-07-10T00:00:00.000Z');

const GEM = EMOPET_CONFIG.gem;
const STATS = EMOPET_CONFIG.stats;

const fullStats = (): PetStats => ({
  hunger: 100,
  cleanliness: 100,
  health: 100,
  happiness: 100,
});

// ---------------------------------------------------------------------------
// computeTicks — the shared primitive behind both accrual and decay.
// ---------------------------------------------------------------------------
describe('computeTicks', () => {
  const tick = MIN;
  const cap = 24 * HOUR;

  it('returns zero ticks and an unchanged timestamp for zero elapsed time', () => {
    const r = computeTicks(T0, T0, tick, cap);
    expect(r.ticks).toBe(0);
    expect(r.newLastAt).toBe(T0);
    expect(r.capped).toBe(false);
  });

  it('treats a backwards clock (now < lastAt) as zero elapsed, never negative', () => {
    const r = computeTicks(T0 - HOUR, T0, tick, cap);
    expect(r.ticks).toBe(0);
    expect(r.newLastAt).toBe(T0);
    expect(r.capped).toBe(false);
  });

  it('yields zero ticks for a partial interval and preserves the remainder', () => {
    const r = computeTicks(T0 + 0.5 * tick, T0, tick, cap);
    expect(r.ticks).toBe(0);
    // lastAt is NOT advanced, so the 30s carries forward to the next call.
    expect(r.newLastAt).toBe(T0);
  });

  it('floors multiple intervals and advances by only the consumed ticks', () => {
    const r = computeTicks(T0 + 3.5 * tick, T0, tick, cap);
    expect(r.ticks).toBe(3);
    expect(r.newLastAt).toBe(T0 + 3 * tick); // 0.5-tick remainder preserved
    expect(r.capped).toBe(false);
  });

  it('preserved remainders accumulate across several sub-tick calls', () => {
    // Simulates a frequent in-tab tick (elapsed < tickMs each call).
    let last = T0;
    let total = 0;
    for (let i = 1; i <= 4; i++) {
      const now = T0 + i * 0.4 * tick; // +0.4 tick each call
      const r = computeTicks(now, last, tick, cap);
      total += r.ticks;
      last = r.newLastAt;
    }
    // 4 × 0.4 = 1.6 ticks of real time → exactly one whole tick consumed.
    expect(total).toBe(1);
  });

  it('respects the offline cap and forfeits the excess by jumping to now', () => {
    const now = T0 + cap + 5 * tick; // well past the cap
    const r = computeTicks(now, T0, tick, cap);
    expect(r.capped).toBe(true);
    expect(r.ticks).toBe(Math.floor(cap / tick));
    // newLastAt must be `now`, not lastAt+cap — otherwise a reload would farm
    // the forfeited time again.
    expect(r.newLastAt).toBe(now);
  });
});

// ---------------------------------------------------------------------------
// GEM accrual (plan §5)
// ---------------------------------------------------------------------------
describe('accrueGems', () => {
  it('grants nothing for zero elapsed time', () => {
    const r = accrueGems(T0, T0);
    expect(r.earned).toBe(0);
    expect(r.newLastAccrualAt).toBe(T0);
    expect(r.capped).toBe(false);
  });

  it('grants nothing for a partial interval and leaves the clock untouched', () => {
    const half = GEM.tickIntervalMs / 2;
    const r = accrueGems(T0 + half, T0);
    expect(r.earned).toBe(0);
    expect(r.newLastAccrualAt).toBe(T0); // remainder preserved
  });

  it('grants gemPerTick for each whole interval across multiple intervals', () => {
    const elapsed = 3 * GEM.tickIntervalMs + GEM.tickIntervalMs / 2; // 3.5 intervals
    const r = accrueGems(T0 + elapsed, T0);
    expect(r.earned).toBe(3 * GEM.gemPerTick);
    expect(r.newLastAccrualAt).toBe(T0 + 3 * GEM.tickIntervalMs);
    expect(r.capped).toBe(false);
  });

  it('caps accrual at the offline maximum however long the user was away', () => {
    const maxTicks = Math.floor(GEM.offlineCapMs / GEM.tickIntervalMs);
    const now = T0 + GEM.offlineCapMs + 10 * GEM.tickIntervalMs; // way over cap
    const r = accrueGems(now, T0);
    expect(r.capped).toBe(true);
    expect(r.earned).toBe(maxTicks * GEM.gemPerTick);
    expect(r.newLastAccrualAt).toBe(now);
  });

  it('being away exactly the cap is not treated as over-cap', () => {
    const maxTicks = Math.floor(GEM.offlineCapMs / GEM.tickIntervalMs);
    const r = accrueGems(T0 + GEM.offlineCapMs, T0);
    expect(r.capped).toBe(false);
    expect(r.earned).toBe(maxTicks * GEM.gemPerTick);
  });
});

// ---------------------------------------------------------------------------
// Stat decay (plan §4)
// ---------------------------------------------------------------------------
describe('decayStats', () => {
  it('leaves stats and the clock unchanged for zero elapsed time', () => {
    const r = decayStats(fullStats(), T0, T0);
    expect(r.stats).toEqual(fullStats());
    expect(r.newLastTickAt).toBe(T0);
    expect(r.capped).toBe(false);
  });

  it('does not decay within a partial tick interval', () => {
    const r = decayStats(fullStats(), T0 + STATS.tickIntervalMs / 2, T0);
    expect(r.stats).toEqual(fullStats());
    expect(r.newLastTickAt).toBe(T0); // remainder preserved
  });

  it('decays hunger and cleanliness at their rates across multiple intervals', () => {
    const minutes = 100;
    const now = T0 + minutes * STATS.tickIntervalMs;
    const r = decayStats(fullStats(), now, T0);
    // hunger -1/10min → -10 ; cleanliness -1/8min → -12.5
    expect(r.stats.hunger).toBeCloseTo(
      100 - minutes * STATS.decayPerTick.hunger,
      6,
    );
    expect(r.stats.cleanliness).toBeCloseTo(
      100 - minutes * STATS.decayPerTick.cleanliness,
      6,
    );
    expect(r.newLastTickAt).toBe(now);
  });

  it('clamps decayed stats at zero and never goes negative', () => {
    const now = T0 + 100_000 * STATS.tickIntervalMs; // absurdly long, but capped
    const r = decayStats(fullStats(), now, T0);
    expect(r.stats.hunger).toBe(0);
    expect(r.stats.cleanliness).toBe(0);
    expect(r.stats.hunger).toBeGreaterThanOrEqual(0);
  });

  it('caps offline decay at the configured maximum window', () => {
    const cappedMinutes = STATS.offlineCapMs / STATS.tickIntervalMs; // 1440
    const startHunger = 100;
    // Away exactly cap vs. far beyond cap → identical decay.
    const atCap = decayStats(fullStats(), T0 + STATS.offlineCapMs, T0);
    const overCap = decayStats(fullStats(), T0 + 5 * STATS.offlineCapMs, T0);

    const expectedHunger = clamp(
      startHunger - cappedMinutes * STATS.decayPerTick.hunger,
    );
    expect(atCap.stats.hunger).toBeCloseTo(expectedHunger, 6);
    expect(overCap.stats.hunger).toBeCloseTo(expectedHunger, 6);
    expect(overCap.capped).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// Derived vitals
// ---------------------------------------------------------------------------
describe('deriveVitals', () => {
  it('is a no-op when zero ticks elapse', () => {
    const stats = { hunger: 40, cleanliness: 40, health: 70, happiness: 55 };
    expect(deriveVitals(stats, 0)).toEqual({ health: 70, happiness: 55 });
  });

  it('erodes health while hunger/cleanliness are in neglect territory', () => {
    const neglected = {
      hunger: 5,
      cleanliness: 5,
      health: 100,
      happiness: 100,
    };
    const r = deriveVitals(neglected, 10);
    expect(r.health).toBeLessThan(100);
  });

  it('keeps derived vitals within 0..100', () => {
    const neglected = { hunger: 0, cleanliness: 0, health: 1, happiness: 1 };
    const r = deriveVitals(neglected, 10_000);
    expect(r.health).toBeGreaterThanOrEqual(0);
    expect(r.happiness).toBeGreaterThanOrEqual(0);
    expect(r.health).toBeLessThanOrEqual(100);
    expect(r.happiness).toBeLessThanOrEqual(100);
  });
});
