'use client';

// Random starting state for the games without a hydration mismatch. The
// server and the first client render both build the state with the same
// seeded Math.random, so their markup matches; right after mount the state is
// rebuilt with real randomness, so every visit still gets a fresh round.

import {
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from 'react';

/** Small deterministic PRNG (mulberry32). */
function seeded(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Runs `make` with Math.random temporarily replaced by a seeded generator. */
export function withSeed<T>(make: () => T, seed = 20261020): T {
  const original = Math.random;
  Math.random = seeded(seed);
  try {
    return make();
  } finally {
    Math.random = original;
  }
}

/**
 * Fisher–Yates shuffle (unbiased). Unlike sort(() => Math.random() - 0.5) its
 * result depends only on the random numbers, not on the engine's sort
 * algorithm — which is what lets server and client agree.
 */
export function shuffle<T>(items: readonly T[]): T[] {
  const a = items.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * useState for a random initial value. `onReroll` runs with the fresh value
 * after mount, for state that is derived from it (e.g. a shuffled copy).
 */
export function useRandomState<T>(
  make: () => T,
  onReroll?: (value: T) => void,
): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => withSeed(make));
  // Refs keep the mount effect independent of the callbacks' identity.
  const makeRef = useRef(make);
  const rerollRef = useRef(onReroll);
  useEffect(() => {
    const fresh = makeRef.current();
    setValue(fresh);
    rerollRef.current?.(fresh);
  }, []);
  return [value, setValue];
}
