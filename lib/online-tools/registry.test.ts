import { describe, expect, it } from 'vitest';
import { CALCULATORS } from './engines/calculators';
import { QUANTITIES } from './engines/units';
import { TRANSFORMS } from './engines/transforms';
import {
  CATEGORIES,
  FEATURED_TOOLS,
  featuredTools,
  TOOLS,
  getToolInCategory,
  relatedTools,
  searchIndex,
  toolPath,
  toolsInCategory,
  variantPath,
} from './registry';
import { faqJsonLd, toolMetadata, webApplicationJsonLd } from './seo';

describe('tool registry', () => {
  it('features only existing tools, once each', () => {
    expect(new Set(FEATURED_TOOLS).size).toBe(FEATURED_TOOLS.length);
    expect(featuredTools().map((t) => t.slug)).toEqual(FEATURED_TOOLS);
  });

  it('has unique tool slugs and URLs', () => {
    const slugs = TOOLS.map((t) => t.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    const urls = TOOLS.flatMap((t) => [
      toolPath(t),
      ...(t.variants ?? []).map((v) => variantPath(t, v)),
    ]);
    expect(new Set(urls).size).toBe(urls.length);
  });

  it('has unique titles and meta descriptions', () => {
    const titles = TOOLS.flatMap((t) => [
      t.title,
      ...(t.variants ?? []).map((v) => v.title),
    ]);
    expect(new Set(titles).size).toBe(titles.length);
    const metas = TOOLS.map((t) => t.metaDescription);
    expect(new Set(metas).size).toBe(metas.length);
  });

  it('keeps meta descriptions within search-result length', () => {
    for (const t of TOOLS)
      expect(t.metaDescription.length, t.slug).toBeLessThanOrEqual(175);
  });

  it('references valid categories, related tools and engine configs', () => {
    const cats = new Set(CATEGORIES.map((c) => c.slug));
    for (const t of TOOLS) {
      expect(cats.has(t.category), t.slug).toBe(true);
      t.alsoIn?.forEach((c) => expect(cats.has(c), t.slug).toBe(true));
      t.relatedTools.forEach((r) =>
        expect(
          TOOLS.some((x) => x.slug === r),
          `${t.slug} → ${r}`,
        ).toBe(true),
      );
      if (t.component === 'text-transform')
        expect(TRANSFORMS[String(t.config?.transform)], t.slug).toBeDefined();
      if (t.component === 'form-calculator')
        expect(CALCULATORS[String(t.config?.calculator)], t.slug).toBeDefined();
      if (t.component === 'unit-converter')
        expect(QUANTITIES[String(t.config?.quantity)], t.slug).toBeDefined();
      expect(t.howTo.length, t.slug).toBeGreaterThan(0);
      expect(t.about.length, t.slug).toBeGreaterThan(0);
      expect(t.faqs.length, t.slug).toBeGreaterThan(0);
    }
  });

  it('every category has tools and resolves only canonical URLs', () => {
    for (const c of CATEGORIES)
      expect(toolsInCategory(c.slug).length, c.slug).toBeGreaterThanOrEqual(2);
    expect(getToolInCategory('developer-tools', 'json-formatter')?.name).toBe(
      'JSON Formatter',
    );
    // Cross-listed tools keep a single canonical URL.
    expect(
      getToolInCategory('security-generators', 'uuid-generator'),
    ).toBeUndefined();
    expect(
      toolsInCategory('security-generators').some(
        (t) => t.slug === 'uuid-generator',
      ),
    ).toBe(true);
  });

  it('serves the URLs from the spec', () => {
    const expected = [
      '/online-tool/image-tools/image-converter',
      '/online-tool/image-tools/image-converter/jpg-to-png-converter',
      '/online-tool/pdf-tools/merge-pdf',
      '/online-tool/developer-tools/json-formatter',
      '/online-tool/developer-tools/jwt-decoder',
      '/online-tool/text-tools/word-counter',
      '/online-tool/color-tools/hex-to-rgb',
      '/online-tool/calculators/age-calculator',
      '/online-tool/security-generators/password-generator',
    ];
    const urls = new Set(
      TOOLS.flatMap((t) => [
        toolPath(t),
        ...(t.variants ?? []).map((v) => variantPath(t, v)),
      ]),
    );
    expected.forEach((u) => expect(urls.has(u), u).toBe(true));
  });

  it('builds related tools, search entries and SEO data', () => {
    const json = getToolInCategory('developer-tools', 'json-formatter')!;
    expect(relatedTools(json).map((t) => t.slug)).toContain('json-validator');
    expect(searchIndex().some((e) => e.name === 'JPG to PNG Converter')).toBe(
      true,
    );
    const meta = toolMetadata(json);
    expect(meta.alternates?.canonical).toBe(
      'https://emojar.com/online-tool/developer-tools/json-formatter',
    );
    expect(meta.title).toEqual({
      absolute: 'JSON Formatter – Format JSON Online | Emojar',
    });
    expect(webApplicationJsonLd(json)).toMatchObject({
      '@type': 'WebApplication',
      offers: { price: '0' },
    });
    expect(faqJsonLd(json.faqs).mainEntity).toHaveLength(json.faqs.length);
  });
});
