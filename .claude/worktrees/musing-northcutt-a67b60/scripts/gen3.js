/**
 * generate.final.v2.js — emoji JSON generator (deduped, canonicalized, strips "E0.x" tokens from names)
 *
 * Changes vs v1:
 *  - Strips any leading/trailing "E<version>" markers (e.g., "E0.6") from names,
 *    including ones coming from annotations.json, so slugs won't start with "e0-6-...".
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

function getArg(flag, fallback = null) {
  const idx = process.argv.indexOf(flag);
  if (idx !== -1 && idx + 1 < process.argv.length) return process.argv[idx + 1];
  return fallback;
}

const ROOT = process.cwd();
const PATHS = {
  emojiTest: resolve(ROOT, getArg('--emoji-test', './emoji-test.txt')),
  annotations: resolve(ROOT, getArg('--annotations', './annotations.json')),
  out: resolve(ROOT, getArg('--out', './emojis.json')),
};

function readMaybe(path) {
  return existsSync(path) ? readFileSync(path, 'utf8') : '';
}

// ---------------- UTILS ----------------
const FE0F = 0xfe0f;
const stripVS16 = (s) =>
  [...s].filter((ch) => ch.codePointAt(0) != FE0F).join('');

const STATUS_RANKS = {
  'fully-qualified': 3,
  'minimally-qualified': 2,
  unqualified: 1,
  component: 0,
};

function statusRankFromLeft(leftPart) {
  const m = leftPart.match(
    /;\s*(fully-qualified|minimally-qualified|unqualified|component)/i,
  );
  return m ? (STATUS_RANKS[m[1].toLowerCase()] ?? 0) : 0;
}

function slugify(str) {
  return str
    .toLowerCase()
    .normalize('NFKD')
    .replace(/['’`]/g, '')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/--+/g, '-');
}

function cleanForSlug(name) {
  return name.replace(/[:]/g, '').replace(/\s+/g, ' ').trim();
}

// Remove E-version markers like "E0.6" (with or without parentheses) at start/end or standalone
function stripEmojiVersionTokens(str) {
  // remove tokens like "(E0.6)" anywhere
  let s = str.replace(/\(\s*E\d+(?:\.\d+)?\s*\)/gi, ' ');
  // remove leading or trailing E version tokens
  s = s.replace(/^(?:\s*E\d+(?:\.\d+)?\s*[-–—:]?\s*)+/gi, ''); // at start
  s = s.replace(/(?:\s*[-–—:]?\s*E\d+(?:\.\d+)?)\s*$/gi, ''); // at end
  // remove any remaining isolated tokens " E0.6 " in the middle (rare)
  s = s.replace(/\bE\d+(?:\.\d+)?\b/gi, ' ');
  return s.replace(/\s{2,}/g, ' ').trim();
}

function uniqueSlug(base, taken) {
  let candidate = base;
  let i = 2;
  while (taken.has(candidate)) candidate = `${base}-${i++}`;
  taken.add(candidate);
  return candidate;
}

// --------------- PARSERS ---------------
function parseEmojiTest(txt) {
  const map = new Map();
  let group = '';
  let subgroup = '';

  for (const raw of txt.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line) continue;

    if (line.startsWith('#')) {
      const grp = line.match(/^#\s*group:\s*(.+)$/i);
      if (grp) {
        group = grp[1].trim();
        continue;
      }
      const sub = line.match(/^#\s*subgroup:\s*(.+)$/i);
      if (sub) {
        subgroup = sub[1].trim();
        continue;
      }
      continue;
    }

    const parts = line.split('#');
    if (parts.length < 2) continue;
    const left = parts[0].trim();
    const right = parts[1].trim();

    const rightTokens = right.split(/\s+/);
    const emoji = rightTokens[0];
    if (!emoji) continue;

    const verMatch = right.match(/\sE(\d+(?:\.\d+)?)(?:\s|$)/);
    const version = verMatch ? verMatch[1] : '1.0';

    let name = right.replace(/^(\S+)\s+/, ''); // drop emoji
    name = name.replace(/\sE\d+(?:\.\d+)?\s*$/, '').trim(); // drop trailing E version
    name = stripEmojiVersionTokens(name); // extra safety

    const rank = statusRankFromLeft(left);
    const key = stripVS16(emoji);
    const current = map.get(key);
    if (!current || rank > current._rank) {
      map.set(key, {
        char: emoji,
        name,
        group,
        subgroup,
        version,
        _rank: rank,
      });
    }
  }
  return map;
}

function parseAnnotations(jsonTxt) {
  if (!jsonTxt) return {};
  let raw;
  try {
    raw = JSON.parse(jsonTxt);
  } catch {
    return {};
  }

  const out = {};
  const src = raw.annotations || raw;
  for (const key of Object.keys(src)) {
    const val = src[key];
    if (!val) continue;
    if (typeof val === 'string') {
      out[key] = { name: stripEmojiVersionTokens(val), keywords: [] };
    } else {
      const name = stripEmojiVersionTokens(
        val.name || val.default || val.t || val.cldr || '',
      );
      const keywords = Array.isArray(val.keywords) ? val.keywords : [];
      out[key] = { name, keywords };
    }
  }
  return out;
}

// --------------- MAIN ------------------
(function main() {
  const emojiTestTxt = readMaybe(PATHS.emojiTest);
  if (!emojiTestTxt) {
    console.error(`Missing emoji-test.txt at ${PATHS.emojiTest}`);
    process.exit(1);
  }
  const annotationsTxt = readMaybe(PATHS.annotations);
  const annotations = parseAnnotations(annotationsTxt);

  const map = parseEmojiTest(emojiTestTxt);
  const seenSlugs = new Set();
  const out = [];

  for (const [canonical, meta] of map.entries()) {
    if (!meta.char) continue;
    const cp = meta.char;
    const ann = annotations[cp] || annotations[canonical] || null;

    const preferredNameRaw = ann && ann.name ? ann.name : meta.name || cp;
    const preferredName = stripEmojiVersionTokens(preferredNameRaw);
    const name = preferredName.trim();

    const keywords = ann && Array.isArray(ann.keywords) ? ann.keywords : [];
    const category = meta.group || 'Uncategorized';
    const subgroup = meta.subgroup || undefined;
    const version = meta.version || '1.0';

    const baseSlug = slugify(cleanForSlug(name));
    const finalSlug = uniqueSlug(baseSlug, seenSlugs);

    out.push({
      slug: finalSlug,
      char: cp,
      name,
      category,
      subgroup,
      keywords,
      version,
    });
  }

  out.sort((a, b) => {
    if (a.category !== b.category) return a.category.localeCompare(b.category);
    return a.name.localeCompare(b.name);
  });

  writeFileSync(PATHS.out, JSON.stringify(out, null, 2), 'utf8');
  console.log(`Wrote ${out.length} emojis to ${PATHS.out}`);
})();
