import { describe, expect, it } from 'vitest';
import data from '../data/emojis.json';
import { INDEXED_EMOJI_SLUGS, isEmojiIndexed } from './emoji-index';

describe('INDEXED_EMOJI_SLUGS', () => {
  it('only lists slugs that have an emoji page', () => {
    const slugs = new Set(data.map((e) => e.slug));
    const missing = [...INDEXED_EMOJI_SLUGS].filter((s) => !slugs.has(s));
    expect(missing).toEqual([]);
  });

  it('keeps a small share of the emoji pages indexed', () => {
    expect(INDEXED_EMOJI_SLUGS.size).toBeGreaterThanOrEqual(100);
    expect(INDEXED_EMOJI_SLUGS.size).toBeLessThanOrEqual(200);
  });
});

describe('isEmojiIndexed', () => {
  it('is true for a listed emoji and false otherwise', () => {
    expect(isEmojiIndexed('face-with-tears-of-joy')).toBe(true);
    expect(isEmojiIndexed('1st-place-medal')).toBe(false);
    expect(isEmojiIndexed('not-an-emoji')).toBe(false);
  });
});
