// Persistence boundary (plan §3). All game code reads/writes PetState through
// this interface — never localStorage directly — so swapping to a real API/DB
// later is a one-line change (LocalStoragePetRepository → ApiPetRepository).

import { EMOPET_CONFIG } from './config';
import type { PetState } from './types';

export interface PetRepository {
  load(): PetState | null;
  save(state: PetState): void;
  clear(): void;
}

export class LocalStoragePetRepository implements PetRepository {
  private key: string;

  constructor(key: string = EMOPET_CONFIG.storageKey) {
    this.key = key;
  }

  load(): PetState | null {
    // Guard SSR / private-mode / disabled-storage — treat as "no save".
    if (typeof window === 'undefined' || !window.localStorage) return null;
    try {
      const raw = window.localStorage.getItem(this.key);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as PetState;
      // Only accept the schema version we understand; anything else is a miss
      // (a future migration would live here).
      if (parsed?.version !== EMOPET_CONFIG.version) return null;
      return parsed;
    } catch {
      // Corrupt JSON — don't crash the game, just start fresh.
      return null;
    }
  }

  save(state: PetState): void {
    if (typeof window === 'undefined' || !window.localStorage) return;
    try {
      window.localStorage.setItem(this.key, JSON.stringify(state));
    } catch {
      // Quota exceeded or storage disabled — non-fatal for an MVP.
    }
  }

  clear(): void {
    if (typeof window === 'undefined' || !window.localStorage) return;
    try {
      window.localStorage.removeItem(this.key);
    } catch {
      // ignore
    }
  }
}

// Later: export class ApiPetRepository implements PetRepository { ... }
