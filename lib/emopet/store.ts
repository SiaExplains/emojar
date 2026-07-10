// Zustand store for Emopet. Holds the single PetState, exposes the care/economy
// actions, and persists to the injected PetRepository after every mutation.
// All timestamp math is delegated to the pure helpers in ./catchup.

import { create } from 'zustand';
import { EMOPET_CONFIG } from './config';
import { accrueGems, clamp, computeAgeDays, decayStats } from './catchup';
import { LocalStoragePetRepository, type PetRepository } from './repository';
import type { Mood, PetState } from './types';

// Repository is module-scoped so it can be swapped (e.g. for an API repo, or a
// fake in tests) without threading it through every call site.
let repository: PetRepository = new LocalStoragePetRepository();

export function setPetRepository(repo: PetRepository): void {
  repository = repo;
}

function uuid(): string {
  if (
    typeof globalThis.crypto !== 'undefined' &&
    typeof globalThis.crypto.randomUUID === 'function'
  ) {
    return globalThis.crypto.randomUUID();
  }
  // Fallback for older runtimes.
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function createDefaultState(
  now: number = Date.now(),
  species: string = EMOPET_CONFIG.defaultSpecies,
  nickname = '',
): PetState {
  const iso = new Date(now).toISOString();
  return {
    version: EMOPET_CONFIG.version,
    pet: {
      id: uuid(),
      species,
      nickname,
      createdAt: iso,
      ageDays: 0,
      stats: { ...EMOPET_CONFIG.starting },
      lastTickAt: iso,
      poops: [],
    },
    wallet: {
      gem: EMOPET_CONFIG.gem.startingBalance,
      lastGemAccrualAt: iso,
    },
    settings: {
      soundOn: false,
      musicOn: false,
    },
  };
}

/**
 * Advance a PetState to `now`: apply time-based stat decay and offline-capped
 * GEM accrual, both driven purely by stored timestamps. Backs both `tick`
 * (periodic, in-tab) and `catchUpOnLoad` (once, on return) — they are the same
 * computation, differing only in when they run.
 */
function advanceToNow(state: PetState, now: number): PetState {
  const decay = decayStats(
    state.pet.stats,
    now,
    Date.parse(state.pet.lastTickAt),
  );
  const gems = accrueGems(now, Date.parse(state.wallet.lastGemAccrualAt));

  return {
    ...state,
    pet: {
      ...state.pet,
      stats: decay.stats,
      lastTickAt: new Date(decay.newLastTickAt).toISOString(),
      ageDays: computeAgeDays(Date.parse(state.pet.createdAt), now),
    },
    wallet: {
      ...state.wallet,
      gem: state.wallet.gem + gems.earned,
      lastGemAccrualAt: new Date(gems.newLastAccrualAt).toISOString(),
    },
  };
}

export function computeMood(state: PetState): Mood {
  const { hunger, cleanliness, health, happiness } = state.pet.stats;
  if (health < 20) return 'sick';
  if (hunger < 20) return 'hungry';
  if (cleanliness < 20 || state.pet.poops.length > 2) return 'dirty';
  if (happiness > 80 && hunger > 60 && cleanliness > 60 && health > 60) {
    return 'happy';
  }
  return 'normal';
}

export interface PetStore {
  state: PetState | null;
  hydrated: boolean;
  adInFlight: boolean;

  /** Load from the repository (or create a fresh pet), then catch up to now. */
  hydrate: () => void;
  /** Create a new pet and persist it (used by onboarding in a later phase). */
  createPet: (species: string, nickname: string) => void;

  feed: () => void;
  clean: () => void;
  treat: () => void;
  play: () => void;

  tick: () => void;
  catchUpOnLoad: () => void;

  addGem: (amount: number) => void;
  watchAdForGem: () => Promise<'completed' | 'skipped'>;

  reset: () => void;
}

export const usePetStore = create<PetStore>((set, get) => {
  // Persist helper: every mutation routes through here so the repository is the
  // single source of truth on disk.
  const commit = (next: PetState) => {
    set({ state: next });
    repository.save(next);
  };

  // Apply a mutation to the current pet, no-op if there is no pet yet.
  const mutate = (fn: (s: PetState) => PetState) => {
    const current = get().state;
    if (!current) return;
    commit(fn(current));
  };

  return {
    state: null,
    hydrated: false,
    adInFlight: false,

    hydrate: () => {
      const loaded = repository.load() ?? createDefaultState();
      const caughtUp = advanceToNow(loaded, Date.now());
      commit(caughtUp);
      set({ hydrated: true });
    },

    createPet: (species, nickname) => {
      commit(createDefaultState(Date.now(), species, nickname));
      set({ hydrated: true });
    },

    feed: () =>
      mutate((s) => ({
        ...s,
        pet: {
          ...s.pet,
          stats: {
            ...s.pet.stats,
            hunger: clamp(s.pet.stats.hunger + EMOPET_CONFIG.actions.feed),
          },
        },
      })),

    clean: () =>
      mutate((s) => ({
        ...s,
        pet: {
          ...s.pet,
          poops: [],
          stats: {
            ...s.pet.stats,
            cleanliness: clamp(
              s.pet.stats.cleanliness + EMOPET_CONFIG.actions.clean,
            ),
          },
        },
      })),

    treat: () =>
      mutate((s) => ({
        ...s,
        pet: {
          ...s.pet,
          stats: {
            ...s.pet.stats,
            health: clamp(s.pet.stats.health + EMOPET_CONFIG.actions.treat),
          },
        },
      })),

    play: () =>
      mutate((s) => ({
        ...s,
        pet: {
          ...s.pet,
          stats: {
            ...s.pet.stats,
            happiness: clamp(
              s.pet.stats.happiness + EMOPET_CONFIG.actions.play,
            ),
          },
        },
      })),

    tick: () => mutate((s) => advanceToNow(s, Date.now())),

    catchUpOnLoad: () => mutate((s) => advanceToNow(s, Date.now())),

    addGem: (amount) =>
      mutate((s) => ({
        ...s,
        wallet: {
          ...s.wallet,
          // GEM never goes negative (plan §11).
          gem: Math.max(0, s.wallet.gem + amount),
        },
      })),

    // Placeholder rewarded-ad flow. The single Promise-returning boundary means
    // a real ad SDK later replaces only this body, not any caller (plan §5).
    watchAdForGem: async () => {
      // Guard against double-grants from rapid repeated taps.
      if (get().adInFlight) return 'skipped';
      set({ adInFlight: true });
      try {
        const result = await playRewardedAd();
        if (result === 'completed') {
          get().addGem(EMOPET_CONFIG.gem.adReward);
        }
        return result;
      } finally {
        set({ adInFlight: false });
      }
    },

    reset: () => {
      repository.clear();
      set({ state: null, hydrated: false });
    },
  };
});

/**
 * Rewarded-ad boundary. Real ad networks (Ad Manager / Adsterra / etc.) wire in
 * here later; for now it simulates a completed view after a short delay.
 */
export function playRewardedAd(): Promise<'completed' | 'skipped'> {
  return new Promise((resolve) => {
    setTimeout(() => resolve('completed'), 2000);
  });
}
