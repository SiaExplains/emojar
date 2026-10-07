---
slug: which-check-mark-arrow-or-currency-symbol-to-use
tool: special-characters
title: "Check Marks, Arrows, Currency Signs: Which Symbol to Pick"
description: ✓ or ✅? → or ⇒? A guide to choosing text symbols that render everywhere, avoiding lookalikes, and using them in HTML and CSS.
tags: [Unicode, Symbols, Writing]
---

For most documents, messages and web pages, pick the plain text version of a symbol: ✓ (U+2713) for a check mark, → (U+2192) for an arrow, and the real currency sign such as € (U+20AC) rather than a letter abbreviation. Text symbols take on the font and color of the surrounding text and look nearly the same everywhere. Save emoji-style marks such as ✅ and ❌ for casual messages, where a colorful, platform-specific look is fine.

The details matter more than you'd expect, so here is how to choose between similar symbols and how to avoid the lookalikes that quietly break things.

## Which check mark should you use?

Unicode has several check marks and crosses, and they behave differently:

| Symbol | Code point | Best for | Watch out for |
| --- | --- | --- | --- |
| ✓ Check mark | U+2713 | Documents, tables, UI labels | Thin in some fonts |
| ✔ Heavy check mark | U+2714 | Bolder ticks in lists | Can turn into an emoji on some phones |
| ☐ / ☑ Ballot box / with check | U+2610 / U+2611 | Printable to-do lists | ☑ also has an emoji form |
| ✅ White heavy check mark | U+2705 | Chat, social posts | Always an emoji; looks different per platform |
| ✗ / ✘ Ballot x / heavy | U+2717 / U+2718 | "No" in comparison tables | Pair the weight with ✓ or ✔ |
| ❌ Cross mark | U+274C | Casual messages | Emoji, red on most platforms |
| 🗸 Light check mark | U+1F5F8 | Rarely needed | Missing from many fonts |

A good rule: match weights. Use ✓ with ✗, or ✔ with ✘, so a feature table doesn't look lopsided. For a printable checklist, ☐ for open items and ☑ for finished ones reads clearly on paper. The [Check Mark Symbols](/online-tool/text-tools/special-characters/check-mark-symbols) page opens directly on this group.

## Which arrow means what?

Arrows carry meaning beyond direction, and readers in technical fields notice the difference.

- **→ Rightwards arrow** is the all-purpose choice: steps in a menu path ("File → Export"), before-and-after ("draft → final") or "leads to".
- **⇒ Rightwards double arrow** means "implies" in logic and math. In everyday writing it reads as a stronger "therefore".
- **⟶ Long rightwards arrow** gives the same meaning with more breathing room in diagrams and slides.
- **↩ and ↪ (arrows with hook)** suggest "return" or "reply", and **↻** suggests refresh or repeat.
- **➜ and ➤** are decorative, heavier arrows that suit headlines and bullet points better than body text.

Some arrows, including ↔, ↩ and ➡, also exist as emoji, so they may switch to a colored style on phones. The plain ones like →, ⇒ and ⟶ stay as text. The Arrows group also includes ▲ ▼ ◀ ▶ and the angle quotes « » ‹ ›, which are handy for "play" buttons and breadcrumb trails. Browse them all on the [Arrow Symbols](/online-tool/text-tools/special-characters/arrow-symbols) page.

## How do you write currency symbols correctly?

The symbol itself is the easy part. The [Currency Symbols](/online-tool/text-tools/special-characters/currency-symbols) page lists 30 signs, from € £ ¥ ₹ ₩ ₺ ₦ to ₿, plus the generic ¤. Placement is where people slip:

- In US and UK English, the sign goes before the amount with no space: €25, £9.99.
- Many European languages put it after the number with a space: 25 €.
- ¥ is used for both the Japanese yen and the Chinese yuan, so add the currency code (JPY or CNY) when the difference matters.
- In tables and invoices, the three-letter ISO code (EUR, GBP) is often clearer than any symbol, especially for audiences in several countries.

## Which lookalikes cause real problems?

Several symbols look almost identical to ordinary keyboard characters but are different code points. That's fine in prose and a problem anywhere a computer has to interpret the text.

| You mean | Real symbol | Lookalike | Why it matters |
| --- | --- | --- | --- |
| Multiplication | × U+00D7 | the letter x | "3 × 4" reads better; "3 x 4" is a letter |
| Minus | − U+2212 | hyphen - | Use − in typeset math, but spreadsheets and code expect the hyphen |
| Degrees | ° U+00B0 | º U+00BA | º is the masculine ordinal (as in "1º"), not degrees |
| Ranges | – U+2013 | hyphen - | "pages 10–12" uses the en dash |
| Apostrophe | ’ U+2019 | ' U+0027 | Curly in prose, straight in code |

The worked takeaway: "Temperature: 21 °C" uses the degree sign, and "Formula: =A1-B1" keeps the plain hyphen. Swapping either one produces text that looks right and behaves wrong.

## Should you paste the symbol, or use an HTML entity or CSS escape?

Clicking a symbol in the [Special Characters & Symbols](/online-tool/text-tools/special-characters) picker shows three forms of it. For ✓ they are:

- **Code point:** U+2713, useful for looking it up or searching.
- **HTML entity:** `&#x2713;`, which works even if your editor or CMS mangles non-ASCII text.
- **CSS escape:** `\2713`, for generated content.

On a normal UTF-8 web page, pasting the character directly is simplest. Use the entity when text passes through systems you don't control, such as old email templates. In CSS, a list marker looks like `li::before { content: "\2713"; }`. One catch: a single space right after a CSS escape is treated as the end of the escape and swallowed, so `"\2713 Done"` shows "✓Done". Add a second space, or write the space as `\20`, if you need the gap.

## How to find and collect symbols with the picker

1. Type into **Search symbols**. It matches symbol names and code points, so "euro", "degree", "check" and "U+2713" all work. Very short searches match a lot; "x" also hits every name containing "box".
2. Or press a group button: All, Arrows, Check marks & crosses, Currency, Math, Fractions, Greek letters, Accented letters and more. There are 588 symbols in 14 groups.
3. Click a symbol to copy it. It's also added to **Your symbols**, the tray at the top, and the line below the tray shows its name, code point, HTML entity and CSS escape.
4. Keep clicking to build a string such as ✓ → €, edit it in the tray if needed, then press **Copy all**. **Clear** empties the tray.

## FAQ

### Why does ✔ look like a green emoji on my phone?

Some symbols have both a text style and an emoji style, and certain apps pick the emoji style automatically. If you need a consistent look, use ✓ (U+2713), which has no emoji form.

### Will these symbols work in a filename or a social media bio?

Bios and posts accept them, since they are ordinary Unicode text. Filenames usually do too on modern systems, but older software and some file-sharing tools can mangle them, so stick to letters and digits for files you send around.

### Do screen readers read symbols aloud?

Often, by name ("check mark", "rightwards arrow"), but behavior varies by reader and settings. Don't let a symbol carry meaning on its own. Write "✓ Included" rather than a bare ✓ in a comparison table.

Find the symbol you need in the [Special Characters & Symbols](/online-tool/text-tools/special-characters) picker.
