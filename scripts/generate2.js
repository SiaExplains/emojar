// gen2.js (generatev2)
// Usage: node gen2.js  (requires emoji-test.txt in the same folder)

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import * as path from "node:path";

// ---------- utils ----------
const read = (p) => readFileSync(p, "utf8");

const slugify = (s) =>
  s.toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/--+/g, "-");

const uniq = (arr) => Array.from(new Set(arr));

function makeSlugger() {
  const seen = new Map();
  return function uniqueSlug(base) {
    const b = slugify(base || "emoji");
    const n = (seen.get(b) || 0) + 1;
    seen.set(b, n);
    return n === 1 ? b : `${b}-${n}`;
  };
}
const uniqueSlug = makeSlugger();

// ---------- CLDR (optional, for better names/keywords) ----------
function pickArray(...candidates) {
  for (const c of candidates) {
    if (Array.isArray(c)) return c;
  }
  return [];
}

function loadCLDRAnnotations(filePath) {
  if (!existsSync(filePath)) return {};
  let json;
  try {
    json = JSON.parse(read(filePath));
  } catch {
    return {};
  }

  // Try the common shapes:
  // 1) { annotations: { annotations: [...] } }
  // 2) { annotationsDerived: { annotations: [...] } }
  // 3) { main: { en: { annotations: { annotations: [...] } } } }
  // 4) Rare: { annotations: [...] } (already the array)
  // Fallback: {} (ignore)
  const rootA = json?.annotations;
  const rootB = json?.annotationsDerived;
  const rootC = json?.main?.en?.annotations;

  const list = pickArray(
    rootA?.annotations, rootB?.annotations, rootC?.annotations,
    json?.annotations
  );

  const out = {};
  for (const entry of list) {
    // Expected entry like:
    // { "cp": "🇩🇪", "annotations": { "default": { "tts": "flag: Germany", "keywords": [...] } } }
    const cp = entry?.cp;
    if (!cp) continue;
    const def = entry?.annotations?.default || {};
    const tts = def.tts;
    const keywords = Array.isArray(def.keywords) ? def.keywords : [];

    if (!out[cp]) out[cp] = { name: undefined, keywords: [] };
    if (tts && !out[cp].name) out[cp].name = tts;
    if (keywords.length) out[cp].keywords.push(...keywords);
  }

  for (const k of Object.keys(out)) {
    out[k].keywords = uniq((out[k].keywords || []).map(String));
  }
  return out;
}

function mergeCLDRMaps(a, b) {
  const out = { ...a };
  for (const [cp, obj] of Object.entries(b)) {
    if (!out[cp]) { out[cp] = { name: obj.name, keywords: [...(obj.keywords || [])] }; continue; }
    if (!out[cp].name && obj.name) out[cp].name = obj.name;
    out[cp].keywords = uniq([...(out[cp].keywords || []), ...(obj.keywords || [])]);
  }
  return out;
}

// ---------- emoji-test (source of truth) ----------
function parseEmojiTest(txt) {
  const map = new Map();
  let group = "";
  let subgroup = "";

  const lines = txt.split(/\r?\n/);
  for (const raw of lines) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) {
      const grp = line.match(/^#\s*group:\s*(.+)$/i);
      if (grp) { group = grp[1].trim(); continue; }
      const sub = line.match(/^#\s*subgroup:\s*(.+)$/i);
      if (sub) { subgroup = sub[1].trim(); continue; }
      continue;
    }

    const parts = line.split("#");
    if (parts.length < 2) continue;

    const left = parts[0].trim();
    const right = parts[1].trim();

    const rightTokens = right.split(/\s+/);
    const emoji = rightTokens[0];
    if (!emoji) continue;

    const verMatch = right.match(/\sE(\d+(?:\.\d+)?)(?:\s|$)/);
    const version = verMatch ? verMatch[1] : "1.0";

    let name = right.replace(/^(\S+)\s+/, "");
    name = name.replace(/\sE\d+(\.\d+)?\s*$/, "").trim();

    const isFully = /;\s*fully-qualified/.test(left);
    if (map.has(emoji) && !isFully) continue;

    map.set(emoji, { name, group, subgroup, version });
  }
  return map;
}

// ---------- main ----------
(function main() {
  const cwd = process.cwd();
  const emojiTestPath = path.join(cwd, "emoji-test.txt");
  if (!existsSync(emojiTestPath)) {
    console.error("ERROR: emoji-test.txt not found. Place it next to gen2.js.");
    process.exit(1);
  }

  const emojiTest = parseEmojiTest(read(emojiTestPath));

  // Optional CLDR enrichment
  const cldrA = loadCLDRAnnotations(path.join(cwd, "annotations.json"));               // optional
  const cldrB = loadCLDRAnnotations(path.join(cwd, "annotations-derived.json"));       // optional
  const cldr = mergeCLDRMaps(cldrA, cldrB);

  const out = [];
  for (const [cp, meta] of emojiTest.entries()) {
    const fromCLDR = cldr[cp] || {};
    const name = fromCLDR.name || meta.name || cp;

    const kwFromName = name.toLowerCase().split(/[\s,:()\-]+/).filter(Boolean);
    const keywords = uniq([...(fromCLDR.keywords || []), ...kwFromName]);
    let nameWithoutPrefix = name.replace(/^(\S+)\s+/, ""); // drop glyph

    out.push({
      slug: uniqueSlug(name),
      char: cp,
      name: nameWithoutPrefix,
      category: meta.group || "Uncategorized",
      subgroup: meta.subgroup || undefined,
      keywords,
      version: meta.version || "1.0",
    });
  }

  out.sort((a, b) =>
    (a.category || "").localeCompare(b.category || "") || a.name.localeCompare(b.name)
  );

  const dest = path.join(cwd, "emojis.json");
  writeFileSync(dest, JSON.stringify(out, null, 2), "utf8");

  const total = out.length;
  const flags = out.filter(e => e.category === "Flags").length;
  const people = out.filter(e => e.category === "People & Body").length;
  console.log(`✅ Wrote ${total} emoji to ${dest}`);
  console.log(`   • Flags: ${flags}`);
  console.log(`   • People & Body: ${people}`);
})();
