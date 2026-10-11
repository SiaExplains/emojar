import { describe, expect, it } from 'vitest';
import { TITLE_LIMIT, brandedTitle, ogImage } from './og';

describe('brandedTitle', () => {
  it('adds the brand when the result fits', () => {
    expect(brandedTitle('Word Counter – Count Words')).toBe(
      'Word Counter – Count Words | Emojar',
    );
  });

  it('keeps long titles unbranded instead of truncating them', () => {
    const long =
      'Regex Tester & Explainer – Test and Visualize JavaScript Regex';
    expect(brandedTitle(long)).toBe(long);
  });

  it('respects the limit exactly and supports another brand', () => {
    const t = 'x'.repeat(TITLE_LIMIT - ' | Emojar Blog'.length);
    expect(brandedTitle(t, 'Emojar Blog')).toHaveLength(TITLE_LIMIT);
    expect(brandedTitle(`${t}y`, 'Emojar Blog')).toBe(`${t}y`);
  });
});

describe('ogImage', () => {
  it('builds an absolute /api/og URL with encoded params', () => {
    const url = new URL(ogImage('🎮', 'Emoji Snake & more', 'Play'));
    expect(url.origin).toBe('https://emojar.com');
    expect(url.pathname).toBe('/api/og');
    expect(url.searchParams.get('name')).toBe('Emoji Snake & more');
    expect(url.searchParams.get('emoji')).toBe('🎮');
  });
});
