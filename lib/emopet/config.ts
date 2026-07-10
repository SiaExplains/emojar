// Tunable constants for Emopet. Values are first-pass and meant to be tuned
// after playtesting (see plan §4/§5). Kept in one place so balancing never
// requires touching game logic.

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;

export const EMOPET_CONFIG = {
  version: 1 as const,
  storageKey: 'emopet:v1',

  gem: {
    // +gemPerTick every tickIntervalMs of real time.
    tickIntervalMs: 10 * MINUTE,
    gemPerTick: 5,
    // Idle accrual is capped: time beyond this on return earns nothing.
    offlineCapMs: 24 * HOUR,
    startingBalance: 100,
    // Reward granted by the (placeholder) rewarded-ad flow.
    adReward: 20,
  },

  stats: {
    // Base decay clock. Decay is expressed as points lost per tick, so a
    // frequent in-tab tick and a single on-load catch-up share one code path.
    tickIntervalMs: MINUTE,
    offlineCapMs: 24 * HOUR,
    // Points lost per tick. hunger -1/10min, cleanliness -1/8min.
    decayPerTick: {
      hunger: 1 / 10,
      cleanliness: 1 / 8,
    },
  },

  // How far each care action moves its stat.
  actions: {
    feed: 30, // hunger +
    clean: 100, // cleanliness restored to full + poop cleared
    treat: 25, // health +
    play: 20, // happiness +
  },

  starting: {
    hunger: 100,
    cleanliness: 100,
    health: 100,
    happiness: 100,
  },

  defaultSpecies: 'cat',
} as const;

export type EmopetConfig = typeof EMOPET_CONFIG;
