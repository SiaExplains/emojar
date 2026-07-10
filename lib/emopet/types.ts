// Persisted schema for Emopet. Everything is derived deterministically from
// timestamps (lastTickAt, lastGemAccrualAt, createdAt) rather than a running
// interval, so offline catch-up and a future server-authoritative time source
// are trivial to bolt on. See docs/emopet-3d-game.plan.md §3.

export interface PetStats {
  hunger: number; // 0-100, decays over time, feeding restores it
  cleanliness: number; // 0-100, decays as poop accumulates, cleaning restores it
  health: number; // 0-100, driven by hunger/cleanliness neglect + treat actions
  happiness: number; // 0-100, driven by all of the above + play interactions
}

export interface Poop {
  id: string;
  x: number;
  z: number;
  createdAt: string; // ISO timestamp
}

export interface Pet {
  id: string; // uuid, generated client-side at creation
  species: string; // e.g. "cat", "dog", "panda" — maps to a model key
  nickname: string; // user-chosen, required at onboarding
  createdAt: string; // ISO timestamp — used to derive age
  ageDays: number; // derived/cached, recomputed from createdAt
  stats: PetStats;
  lastTickAt: string; // ISO timestamp of last stat-decay calculation
  poops: Poop[];
}

export interface Wallet {
  gem: number;
  lastGemAccrualAt: string; // ISO timestamp, drives offline-capped accrual
}

export interface Settings {
  soundOn: boolean;
  musicOn: boolean;
}

export interface PetState {
  version: 1;
  pet: Pet;
  wallet: Wallet;
  settings: Settings;
}

export type Mood = 'normal' | 'happy' | 'hungry' | 'dirty' | 'sick';
