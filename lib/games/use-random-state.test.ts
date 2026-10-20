import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { shuffle, withSeed } from './use-random-state';

describe('game randomness', () => {
  it('gives the same values for the same seed (server = first client render)', () => {
    const roll = () => Array.from({ length: 5 }, () => Math.random());
    expect(withSeed(roll)).toEqual(withSeed(roll));
    expect(withSeed(roll, 1)).not.toEqual(withSeed(roll, 2));
    // Math.random is restored afterwards, even if `make` throws.
    const original = Math.random;
    expect(() =>
      withSeed(() => {
        throw new Error('boom');
      }),
    ).toThrow('boom');
    expect(Math.random).toBe(original);
  });

  it('shuffles deterministically under a seed and keeps every item', () => {
    const items = Array.from({ length: 20 }, (_, i) => i);
    const a = withSeed(() => shuffle(items));
    expect(a).toEqual(withSeed(() => shuffle(items)));
    expect([...a].sort((x, y) => x - y)).toEqual(items);
    expect(a).not.toEqual(items);
    expect(items[0]).toBe(0); // the input isn't modified
  });

  it('game pages avoid sort-based shuffles, which differ between engines', () => {
    const dir = path.join(process.cwd(), 'app', 'games');
    const offenders = fs
      .readdirSync(dir, { withFileTypes: true })
      .filter((d) => d.isDirectory() && d.name !== 'emopet')
      .map((d) => path.join(dir, d.name, 'page.tsx'))
      .filter((f) => fs.existsSync(f))
      .filter((f) =>
        /sort\(\(\) =>\s*(Math\.random\(\) - 0\.5|0\.5 - Math\.random\(\))\)/.test(
          fs.readFileSync(f, 'utf8'),
        ),
      );
    expect(offenders).toEqual([]);
  });
});
