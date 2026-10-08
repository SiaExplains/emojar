import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
import { beforeAll, describe, expect, it } from 'vitest';
import {
  liblouisVersion,
  loadLiblouis,
  uebBackTranslate,
  uebTranslate,
} from './liblouis';

beforeAll(async () => {
  // In tests, load the vendored build from disk instead of /vendor/….
  await loadLiblouis(
    pathToFileURL(resolve('public/vendor/liblouis/liblouis.mjs')).href,
  );
});

describe('liblouis UEB', () => {
  it('is the expected version', async () => {
    expect(await liblouisVersion()).toBe('3.39.0');
  });
  it('contracts common words in Grade 2', async () => {
    expect(await uebTranslate('the cat and the dog')).toBe('⠮⠀⠉⠁⠞⠀⠯⠀⠮⠀⠙⠕⠛');
    expect(await uebTranslate('knowledge for children')).toBe('⠅⠀⠿⠀⠡⠝');
  });
  it('round-trips Grade 2 and keeps line breaks', async () => {
    const text = 'Hello, World! 2026\n"quoted" words';
    expect(await uebBackTranslate(await uebTranslate(text))).toBe(text);
  });
  it('spells words out in Grade 1', async () => {
    expect(await uebTranslate('the', 'g1')).toBe('⠞⠓⠑');
  });
});
