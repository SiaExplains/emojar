/**
 * gen-rich.js — Enriches data/emojis.json with keywords, description,
 * codepoints, aliases, and relatedSlugs using CLDR annotations.
 *
 * Usage (from scripts/):
 *   node gen-rich.js
 *
 * Usage (from repo root):
 *   node scripts/gen-rich.js --emojis data/emojis.json --annotations scripts/annotations.json --out data/emojis.json
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

function getArg(flag, fallback) {
  const idx = process.argv.indexOf(flag);
  if (idx !== -1 && idx + 1 < process.argv.length) return process.argv[idx + 1];
  return fallback;
}

const PATHS = {
  emojis: resolve(
    __dirname,
    getArg('--emojis', '../data/emojis.json'),
  ),
  annotations: resolve(
    __dirname,
    getArg('--annotations', './annotations.json'),
  ),
  out: resolve(
    __dirname,
    getArg('--out', '../data/emojis.json'),
  ),
};

// ---- helpers ----

function uniq(arr) {
  return [...new Set(arr)];
}

function charToCodepoints(char) {
  return [...char].map(
    (c) => 'U+' + c.codePointAt(0).toString(16).toUpperCase().padStart(4, '0'),
  );
}

function nameToAlias(name) {
  return (
    ':' +
    name
      .toLowerCase()
      .replace(/[''`]/g, '')
      .replace(/&/g, 'and')
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '') +
    ':'
  );
}

function deriveKeywordsFromName(name) {
  return name
    .toLowerCase()
    .replace(/[''`]/g, '')
    .split(/[\s,:()\-]+/)
    .filter((t) => t.length > 1);
}

function buildDescription(emoji, cldrTts) {
  const { name, category, subgroup, version, keywords } = emoji;
  const tts = cldrTts || name;
  const topKw = keywords.slice(0, 4).join(', ');
  const since = version ? ` since Unicode ${version}` : '';
  const kwPart = topKw ? ` It is associated with: ${topKw}.` : '';
  return `The ${tts} emoji is part of the ${category} category (${subgroup || category})${since}.${kwPart}`;
}

// ---- load annotations ----

function loadAnnotations(path) {
  if (!existsSync(path)) return {};
  let raw;
  try {
    raw = JSON.parse(readFileSync(path, 'utf8'));
  } catch {
    return {};
  }
  // Structure: { annotations: { annotations: { "<char>": { default: [...], tts: [...] } } } }
  return raw?.annotations?.annotations ?? {};
}

// ---- related slugs ----

function buildRelatedIndex(emojis) {
  // Map: subgroup -> slug[]
  const bySubgroup = new Map();
  // Map: keyword -> slug[]
  const byKeyword = new Map();

  for (const e of emojis) {
    if (!bySubgroup.has(e.subgroup)) bySubgroup.set(e.subgroup, []);
    bySubgroup.get(e.subgroup).push(e.slug);

    for (const kw of e.keywords) {
      if (!byKeyword.has(kw)) byKeyword.set(kw, []);
      byKeyword.get(kw).push(e.slug);
    }
  }
  return { bySubgroup, byKeyword };
}

function pickRelated(emoji, index, count = 6) {
  const { bySubgroup, byKeyword } = index;
  const candidates = new Map(); // slug -> score

  const addCandidate = (slug, score) => {
    if (slug === emoji.slug) return;
    candidates.set(slug, (candidates.get(slug) || 0) + score);
  };

  // Same subgroup: highest priority
  for (const slug of bySubgroup.get(emoji.subgroup) || []) {
    addCandidate(slug, 3);
  }

  // Overlapping keywords
  for (const kw of emoji.keywords) {
    for (const slug of byKeyword.get(kw) || []) {
      addCandidate(slug, 1);
    }
  }

  const sorted = [...candidates.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([slug]) => slug);

  return sorted.slice(0, count);
}

// ---- main ----

(function main() {
  console.log('Loading emojis from', PATHS.emojis);
  const emojis = JSON.parse(readFileSync(PATHS.emojis, 'utf8'));

  console.log('Loading annotations from', PATHS.annotations);
  const annotations = loadAnnotations(PATHS.annotations);

  // Pass 1: enrich keywords + build description data
  const enriched = emojis.map((emoji) => {
    const ann = annotations[emoji.char] ?? null;
    const cldrKeywords = ann?.default ?? [];
    const cldrTts = ann?.tts?.[0] ?? null;

    const nameKw = deriveKeywordsFromName(emoji.name);
    const subgroupKw = deriveKeywordsFromName(emoji.subgroup || '');
    const categoryKw = deriveKeywordsFromName(emoji.category || '');
    const raw = uniq([...cldrKeywords, ...nameKw, ...subgroupKw, ...categoryKw]).filter((k) => k.length > 0);
    // Ensure minimum 3 keywords — pad with generic fallbacks if needed
    const fallbacks = ['emoji', 'unicode', 'character', 'symbol'];
    const keywords = raw.length >= 3 ? raw : uniq([...raw, ...fallbacks]).slice(0, Math.max(3, raw.length + fallbacks.length));

    const codepoints = charToCodepoints(emoji.char);
    const aliases = [nameToAlias(emoji.name)];

    return {
      ...emoji,
      keywords,
      codepoints,
      aliases,
      _cldrTts: cldrTts, // temp field, removed after description
    };
  });

  // Pass 2: build related index (uses enriched keywords)
  const index = buildRelatedIndex(enriched);

  // Pass 3: add description + relatedSlugs, remove temp field
  const final = enriched.map((emoji) => {
    const description = buildDescription(emoji, emoji._cldrTts);
    const relatedSlugs = pickRelated(emoji, index, 6);
    const { _cldrTts, ...rest } = emoji;
    return { ...rest, description, relatedSlugs };
  });

  // Stats
  const withKeywords = final.filter((e) => e.keywords.length >= 3).length;
  const withDescription = final.filter((e) => e.description.length >= 80).length;
  const withRelated = final.filter((e) => e.relatedSlugs.length >= 4).length;

  console.log('\n=== Enrichment summary ===');
  console.log(`Total emojis:          ${final.length}`);
  console.log(`≥3 keywords:           ${withKeywords} / ${final.length}`);
  console.log(`description ≥80 chars: ${withDescription} / ${final.length}`);
  console.log(`≥4 relatedSlugs:       ${withRelated} / ${final.length}`);

  // Sample for review
  const sample = final.find((e) => e.slug === 'grinning-face') ?? final[0];
  console.log('\n=== Sample entry (grinning-face or first) ===');
  console.log(JSON.stringify(sample, null, 2));

  console.log(`\nWriting to ${PATHS.out} ...`);
  writeFileSync(PATHS.out, JSON.stringify(final, null, 2), 'utf8');
  console.log('Done.');
})();
