---
slug: how-to-type-math-symbols-in-docs-latex-and-html
tool: math-symbols
title: How to Type Math Symbols in Documents, LaTeX and HTML
description: One symbol, three forms. How to choose between pasting ∑, writing \sum in LaTeX or using an HTML entity, and how to avoid look-alikes such as Σ versus ∑.
tags: [Math, LaTeX, Unicode, Reference]
---

To type a math symbol, use the form your destination understands. Paste the Unicode character itself, such as ≤, into documents, chats and slides. Write the LaTeX command, such as `\leq`, inside a LaTeX math environment. Use the HTML entity, such as `&le;`, or a numeric reference in web pages. Most symbols have all three forms, and picking the character with the right name matters as much as its shape.

## Why does one symbol have three different forms?

Each form is meant for a different system.

- **The Unicode character** is the symbol itself, stored as a code point. ≤ is U+2264 LESS-THAN OR EQUAL TO. Any modern app that handles text can show it, as long as a font has the glyph. This is what you paste into Word, Google Docs, email or a code comment.
- **The LaTeX command** is an instruction for a typesetting engine. `\leq` tells LaTeX to draw the symbol with correct spacing as part of a formula. It only works inside math mode, between `$ … $` or in an equation environment.
- **The HTML entity** is a way to write the character in HTML source using plain ASCII. `&le;` and `&#8804;` both display ≤ in a browser.

The [Math Symbols Reference](/online-tool/reference-tools/math-symbols) puts all three on one card for each symbol, along with its name and a short note on what it means.

## How do you find and copy a symbol?

The search box matches four things: the symbol's name ("integral"), its LaTeX command (`\leq`), words in its meaning note, and the symbol itself if you paste it. You can also type a code point such as U+2211 or 0x2211.

The category chips narrow the list: Arithmetic, Algebra, Calculus, Geometry, Logic, Set theory, Probability & statistics, Greek letters, Relations, Operators and Arrows. Some symbols belong to more than one group. Infinity (∞) is in both Algebra and Calculus, and ⇒ is in both Logic and Arrows, with a different meaning note in each. The "All" view lists each symbol only once, so it shows 298 distinct symbols.

On each card:

1. Click the large symbol to copy the character.
2. Click the small U+ button to copy the code point.
3. Click the LaTeX button, when there is one, to copy the command.
4. Click the last button to copy the HTML form. It is the named entity when HTML has one, and a decimal reference like `&#8710;` when it does not.

## Worked example: writing "the sum is at most n"

Say you need the expression ∑ aᵢ ≤ n in three places. Search for "sum" and open the Summation card:

| Field   | Value                      |
| ------- | -------------------------- |
| Symbol  | ∑                          |
| Unicode | U+2211                     |
| LaTeX   | `\sum`                     |
| HTML    | `&sum;`                    |
| Meaning | Sum of a sequence of terms |

Then search for `\leq` and you get three matches, because the LaTeX search finds any command that contains what you typed: `\leq`, `\leqq` and `\leqslant`. The one you want is "Less-than or equal to", which is U+2264 with the HTML entity `&le;`.

Now use the right form in each place:

- In a Google Doc, paste ∑ and ≤ straight from the cards.
- In LaTeX, write `$\sum_{i=1}^{n} a_i \leq n$`.
- In HTML, write `&sum; a<sub>i</sub> &le; n`.

HTML entity names are case-sensitive. The HTML button copies the lowercase `&sum;`, and the capitalized `&Sum;` is also a valid name for the same character.

## Why do look-alike symbols matter?

Several symbols look nearly identical but are different characters with different meanings. Search for "sum" and you will also find Σ, the Greek capital sigma (U+03A3). It looks like ∑, but it is a letter, not the summation operator. A screen reader says "sigma" for one and "summation" for the other. Search engines and equation tools also treat them differently.

Other pairs to watch:

- **∆ and Δ.** ∆ (U+2206, Increment) and Δ (U+0394, Greek capital delta) both use `\Delta` in LaTeX. ∆ has no named HTML entity, so the tool gives `&#8710;`, while Δ is `&Delta;`.
- **− and -.** The real minus sign is U+2212. The hyphen on your keyboard is U+002D HYPHEN-MINUS. In running text, the true minus is wider and lines up with the plus sign. LaTeX math mode turns a typed - into a proper minus for you, which is why the Minus sign card has no LaTeX command.
- **ε and ϵ.** In LaTeX, `\epsilon` draws the lunate form ϵ, and `\varepsilon` draws ε. The tool lists both, so you can match the one in your textbook.

This is also why Unicode has a whole block called Mathematical Operators, separate from the Greek alphabet. If you want to dig into the code points behind any of these, the [Unicode Character Explorer](/online-tool/reference-tools/unicode-character-explorer) shows a character's official name, category and bytes.

## Which LaTeX packages do you need?

Most commands work in plain LaTeX. Some need the amssymb package, which comes with every major TeX distribution. The blackboard-bold letters are the common case: `\mathbb{R}` for ℝ and `\mathbb{N}` for ℕ need `\usepackage{amssymb}`. Symbols such as + and − have no LaTeX button because you type them directly. If you compile with a Unicode engine like XeLaTeX or LuaLaTeX with the unicode-math package, you can also paste the characters straight into your formulas.

For entities outside mathematics, such as arrows, quotes or currency, the [HTML Entity Reference](/online-tool/developer-tools/html-entity-reference) searches the full list. To work a calculation rather than write it, try the [scientific calculator](/online-tool/calculators/scientific-calculator).

## FAQ

### How do I type the not-equal sign?

Copy ≠ from its card. In LaTeX, write `\neq`. In HTML, write `&ne;`. On a Mac keyboard, Option and = together also type it.

### Why do some symbols show as boxes?

The font in your app does not include that glyph. The character is still correct, and it will appear once you switch to a font with broader math coverage, such as Cambria Math or STIX Two.

### Is π in geometry or Greek letters?

Both. It has a card in each group, with a meaning note for that context, but the character is the same U+03C0.

Need a symbol now? Open the [Math Symbols Reference](/online-tool/reference-tools/math-symbols), search by name or LaTeX, and click to copy.
