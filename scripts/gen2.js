
/**
 * generate.js — unified emoji JSON generator (deduped, canonicalized)
 * ---------------------------------------------------------------
 * Inputs (expected in the same directory by default):
 *   - emoji-test.txt              (Unicode source of truth with group/subgroup and status)
 *   - emoji-sequences.txt         (optional; we don't strictly need it here)
 *   - emoji-zwj-sequences.txt     (optional; we don't strictly need it here)
 *   - annotations.json            (optional; CLDR-like map for names/keywords)
 *
 * Output:
 *   - emojis.json — array of { slug, char, name, category, subgroup, keywords, version }
 *
 * Key features:
 *   - Collapses VS16 (U+FE0F) variants under one canonical key (stripVS16).
 *   - Prefers fully-qualified > minimally-qualified > unqualified > component.
 *   - Emits exactly one record per canonical emoji (no "-2" duplicates).
 *   - Ensures every output record has a `char` (renderable) and a unique slug.
 *
 * Usage:
 *   node generate.js
 *   # Optional CLI args to override paths:
 *   node generate.js --emoji-test ./emoji-test.txt --annotations ./annotations.json --out ./emojis.json
 */

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

// ---------------- CLI ARG PARSER ------------------------------------------------
function getArg(flag, fallback = null) {
  const idx = process.argv.indexOf(flag);
  if (idx !== -1 && idx + 1 < process.argv.length) return process.argv[idx + 1];
  return fallback;
}

const ROOT = process.cwd();
const PATHS = {
  emojiTest: resolve(ROOT, getArg("--emoji-test", "./emoji-test.txt")),
  emojiSeq: resolve(ROOT, getArg("--emoji-sequences", "./emoji-sequences.txt")),
  emojiZwj: resolve(ROOT, getArg("--emoji-zwj-sequences", "./emoji-zwj-sequences.txt")),
  annotations: resolve(ROOT, getArg("--annotations", "./annotations.json")),
  out: resolve(ROOT, getArg("--out", "./emojis.json")),
};

function readMaybe(path) {
  return existsSync(path) ? readFileSync(path, "utf8") : "";
}

// ---------------- UTILS ---------------------------------------------------------
const FE0F = 0xFE0F; // VARIATION SELECTOR-16
const stripVS16 = (s) => [...s].filter(ch => ch.codePointAt(0) !== FE0F).join("");

const STATUS_RANKS = {
  "fully-qualified": 3,
  "minimally-qualified": 2,
  "unqualified": 1,
  "component": 0,
};

function statusRankFromLeft(leftPart) {
  // left part example: "1F3FB 200D 2696 FE0F ; fully-qualified # 👩🏻‍⚖️ woman judge: light skin tone"
  const m = leftPart.match(/;\s*(fully-qualified|minimally-qualified|unqualified|component)/i);
  if (!m) return 0;
  return STATUS_RANKS[m[1].toLowerCase()] ?? 0;
}

function slugify(str) {
  return str
    .toLowerCase()
    .normalize("NFKD")
    .replace(/['’`]/g, "")             // drop apostrophes
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/--+/g, "-");
}

function cleanForSlug(name) {
  // a tiny normalizer for names coming from CLDR/emoji-test
  return name.replace(/[:]/g, "").replace(/\s+/g, " ").trim();
}

function uniqueSlug(base, taken) {
  let candidate = base;
  let i = 2;
  while (taken.has(candidate)) {
    candidate = `${base}-${i++}`;
  }
  taken.add(candidate);
  return candidate;
}

// ---------------- PARSERS -------------------------------------------------------

/**
 * Parse emoji-test.txt
 * Returns a Map<canonicalKeyWithoutVS16, { char, name, group, subgroup, version, _rank }>
 *  - char: best (highest-ranked) actual emoji string to emit (prefer fully-qualified)
 *  - name/group/subgroup/version: from right comment region
 *  - _rank: numerical rank used internally for choosing best variant
 */
function parseEmojiTest(txt) {
  const map = new Map();
  let group = "";
  let subgroup = "";

  const lines = txt.split(/\r?\n/);
  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;

    if (line.startsWith("#")) {
      const grp = line.match(/^#\s*group:\s*(.+)$/i);
      if (grp) { group = grp[1].trim(); continue; }
      const sub = line.match(/^#\s*subgroup:\s*(.+)$/i);
      if (sub) { subgroup = sub[1].trim(); continue; }
      continue;
    }

    // "left # right" split
    const parts = line.split("#");
    if (parts.length < 2) continue;
    const left = parts[0].trim();
    const right = parts[1].trim();

    // Extract emoji (first token after '#')
    const rightTokens = right.split(/\s+/);
    const emoji = rightTokens[0];
    if (!emoji) continue;

    // Extract version Exx.x
    const verMatch = right.match(/\sE(\d+(?:\.\d+)?)(?:\s|$)/);
    const version = verMatch ? verMatch[1] : "1.0";

    // Name is everything after the emoji and version marker
    // e.g. "👩🏻‍⚖️ woman judge: light skin tone E12.1"
    let name = right.replace(/^(\S+)\s+/, ""); // drop emoji itself
    name = name.replace(/\sE\d+(?:\.\d+)?\s*$/, "").trim();

    const rank = statusRankFromLeft(left);
    const key = stripVS16(emoji); // canonical key collapses FE0F variants
    const current = map.get(key);
    if (!current || rank > current._rank) {
      map.set(key, {
        char: emoji,
        name,
        group,
        subgroup,
        version,
        _rank: rank
      });
    }
  }
  return map;
}

/**
 * Parse annotations.json (optional)
 * Expected structure examples:
 *   {
 *     "👩🏻‍⚖️": { "name": "woman judge: light skin tone", "keywords": ["judge","woman","light skin tone"] },
 *     "👨🏿‍⚖️": { "name": "...", "keywords": [...] }
 *   }
 * or
 *   {
 *     "annotations": {
 *        "👩🏻‍⚖️": { "default": "woman judge: light skin tone", "keywords": ["judge","woman"] }
 *     }
 *   }
 */
function parseAnnotations(jsonTxt) {
  if (!jsonTxt) return {};
  let raw;
  try {
    raw = JSON.parse(jsonTxt);
  } catch (e) {
    console.warn("annotations.json is not valid JSON, ignoring.");
    return {};
  }

  // normalize to emoji-> { name, keywords[] }
  const out = {};
  const src = raw.annotations || raw;
  for (const key of Object.keys(src)) {
    const val = src[key];
    if (!val) continue;
    if (typeof val === "string") {
      out[key] = { name: val, keywords: [] };
    } else {
      const name = val.name || val.default || val.t || val.cldr || "";
      const keywords = Array.isArray(val.keywords) ? val.keywords : [];
      out[key] = { name, keywords };
    }
  }
  return out;
}

// ---------------- MAIN ----------------------------------------------------------
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
    // Only emit entries that carry a renderable char (i.e., best variant stored by parseEmojiTest)
    if (!meta.char) continue;

    const cp = meta.char;
    const ann = annotations[cp] || annotations[canonical] || null;
    const preferredName = (ann && ann.name) ? ann.name : meta.name || cp;
    const name = preferredName.trim();

    const keywords = ann && Array.isArray(ann.keywords) ? ann.keywords : [];
    const category = meta.group || "Uncategorized";
    const subgroup = meta.subgroup || undefined;
    const version = meta.version || "1.0";

    const nameForSlug = cleanForSlug(name);
    const baseSlug = slugify(nameForSlug);
    const finalSlug = uniqueSlug(baseSlug, seenSlugs);

    out.push({
      slug: finalSlug,
      char: cp,
      name,
      category,
      subgroup,
      keywords,
      version
    });
  }

  // Sort for stable output (by category then name)
  out.sort((a, b) => {
    if (a.category !== b.category) return a.category.localeCompare(b.category);
    return a.name.localeCompare(b.name);
  });

  writeFileSync(PATHS.out, JSON.stringify(out, null, 2), "utf8");
  console.log(`Wrote ${out.length} emojis to ${PATHS.out}`);
})();
