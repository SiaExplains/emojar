/**
 * Build emojis.json from a local CLDR annotations.json.
 * Optional: if ./emoji-test.txt exists, enrich with category + version.
 *
 * Input  (required): ./annotations.json
 * Input  (optional): ./emoji-test.txt
 * Output: ./emojis.json
 *
 * Node 18+ (uses native fs/promises)
 */
import { readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

// ---- config (change paths if needed) ----
const ANNOTATIONS_PATH = path.resolve("./annotations.json");
const EMOJI_TEST_PATH = path.resolve("./emoji-test.txt");
const OUTPUT_PATH = path.resolve("./emojis.json");

// ---- utils ----
const uniq = (arr) => Array.from(new Set(arr));
function slugify(name) {
  return String(name || "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Very lightweight category guesser (used only when emoji-test.txt is absent)
function guessCategory(name = "", keywords = []) {
  const s = (name + " " + keywords.join(" ")).toLowerCase();

  if (/\bface|smil|grin|cry|tear|kiss|heart|love|angry|sad|joy|emoji\b/.test(s))
    return "Smileys & Emotion";
  if (/\bhand|thumb|person|people|man|woman|family|baby|gesture|body|eye|mouth|nose|ear\b/.test(s))
    return "People & Body";
  if (/\bcat|dog|monkey|bear|flower|tree|leaf|sun|moon|star|rain|cloud|animal|nature|plant\b/.test(s))
    return "Animals & Nature";
  if (/\bfood|drink|pizza|burger|fruit|vegetable|cake|coffee|tea|beer|wine\b/.test(s))
    return "Food & Drink";
  if (/\bball|sport|game|trophy|medal|celebrat|party|music|guitar|violin\b/.test(s))
    return "Activities";
  if (/\bcar|bus|train|ship|boat|plane|airplane|rocket|bike|bicycle|traffic|map|building|beach|mountain\b/.test(s))
    return "Travel & Places";
  if (/\bphone|computer|laptop|camera|tv|watch|tool|key|lock|bulb|bag|money|card|gift|book|scissors\b/.test(s))
    return "Objects";
  if (/\barrow|symbol|sign|mark|cross|check|star|sparkles|recycle|infinity|om|atom|peace|copyright|tm\b/.test(s))
    return "Symbols";
  if (/\bflag\b/.test(s)) return "Flags";
  return "Uncategorized";
}

// Parse emoji-test.txt if present -> Map<char, {category, name, version}>
function parseEmojiTest(text) {
  const lines = text.split(/\r?\n/);
  let currentGroup = null;
  const map = new Map();

  for (const line of lines) {
    const g = line.match(/^#\s*group:\s*(.+)$/i);
    if (g) {
      currentGroup = g[1].trim();
      continue;
    }
    if (!line || line.startsWith("#") || !line.includes("#")) continue;

    const [, right] = line.split("#");
    if (!right) continue;
    const r = right.trim();
    const charMatch = r.match(/^(\S+)/);
    if (!charMatch) continue;
    const char = charMatch[1];

    const nameAndVersion = r.slice(char.length).trim();
    const verMatch = nameAndVersion.match(/\bE(\d+(?:\.\d+)?)\b/i);
    const version = verMatch ? verMatch[1] : "1.0";
    const name = nameAndVersion.replace(/\bE\d+(\.\d+)?\b/i, "").trim();

    if (char && currentGroup) {
      map.set(char, { category: currentGroup, name, version });
    }
  }
  return map;
}

// Filter: best-effort to keep only emoji-like keys if emoji-test.txt is absent.
// Keeps ZWJ sequences, emoji presentation selectors, skin tones, and common emoji ranges.
function looksLikeEmoji(cpStr) {
  // If any char is in typical emoji planes or it contains ZWJ/VS-16, treat as emoji
  if (/\u200D|\uFE0F/.test(cpStr)) return true; // ZWJ or VS16
  // skin tones
  if (/[\u{1F3FB}-\u{1F3FF}]/u.test(cpStr)) return true;
  // Common emoji blocks
  if (/[\u{1F300}-\u{1FAFF}]/u.test(cpStr)) return true;
  if (/[\u2600-\u27BF]/.test(cpStr)) return true; // Misc symbols + Dingbats
  // Flags (regional indicators)
  if (/[\u{1F1E6}-\u{1F1FF}]/u.test(cpStr)) return true;
  // Hearts etc.
  if (/[\u2660-\u2666\u2764]/.test(cpStr)) return true;
  return false;
}

async function main() {
  // 1) read annotations.json
  const raw = await readFile(ANNOTATIONS_PATH, "utf8");
  const ann = JSON.parse(raw);

  // CLDR structures vary slightly; support both common shapes:
  // { annotations: { identity: {...}, annotations: { "😀": {default:[], tts:[]} } } }
  // or { main: { en: { annotations: [ {cp, keywords, tts} ] } } }
  const mapFromCLDR = new Map();

  if (ann?.annotations?.annotations && typeof ann.annotations.annotations === "object") {
    // key-value map form
    for (const [cp, entry] of Object.entries(ann.annotations.annotations)) {
      if (!cp) continue;
      const keywords = Array.isArray(entry.default) ? entry.default : [];
      const name = Array.isArray(entry.tts) && entry.tts[0] ? entry.tts[0] : null;
      mapFromCLDR.set(cp, { keywords, name });
    }
  } else if (ann?.main) {
    // array form
    const anyLang = Object.values(ann.main)[0];
    const list = anyLang?.annotations || [];
    for (const entry of list) {
      const cp = entry.cp;
      if (!cp) continue;
      const keywords = Array.isArray(entry.keywords) ? entry.keywords : [];
      const name = entry.tts || null;
      mapFromCLDR.set(cp, { keywords, name });
    }
  } else {
    throw new Error("Unsupported annotations.json shape.");
  }

  // 2) optionally read emoji-test.txt to enrich + hard-filter to emojis
  let emojiTestMap = null;
  if (existsSync(EMOJI_TEST_PATH)) {
    const et = await readFile(EMOJI_TEST_PATH, "utf8");
    emojiTestMap = parseEmojiTest(et);
  }

  // 3) build final list
  const out = [];

  for (const [cp, data] of mapFromCLDR.entries()) {
    // If we have emoji-test.txt, include only chars present there.
    if (emojiTestMap && !emojiTestMap.has(cp)) continue;

    // If we don't have emoji-test, drop obvious non-emoji.
    if (!emojiTestMap && !looksLikeEmoji(cp)) continue;

    const name = data.name || ""; // if missing, slug will still work
    const keywords = uniq(
      (data.keywords || [])
        .map((k) => String(k).toLowerCase().trim())
        .filter(Boolean)
    );

    let category = "Uncategorized";
    let version = "1.0";

    if (emojiTestMap && emojiTestMap.has(cp)) {
      const e = emojiTestMap.get(cp);
      category = e.category || category;
      version = e.version || version;
      // Prefer emoji-test name if CLDR name missing
      if (!name && e.name) data.name = e.name;
    } else {
      // Heuristic category when no emoji-test
      category = guessCategory(name, keywords);
    }

    out.push({
      slug: slugify(data.name || name || cp),
      char: cp,
      name: data.name || name || cp,
      category,
      keywords,
      version,
    });
  }

  // Sort by category then name for stability
  out.sort((a, b) =>
    a.category === b.category
      ? a.name.localeCompare(b.name)
      : a.category.localeCompare(b.category)
  );

  await writeFile(OUTPUT_PATH, JSON.stringify(out, null, 2), "utf8");
  console.log(`✅ Wrote ${out.length} entries to ${OUTPUT_PATH}`);
}

main().catch((e) => {
  console.error("Failed:", e);
  process.exit(1);
});
