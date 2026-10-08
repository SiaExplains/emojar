---
slug: how-css-specificity-works-a-b-c-scores
tool: css-specificity-calculator
title: Why Does My CSS Rule Lose? Specificity Scores Explained
description: How browsers score selectors as (a, b, c), how :is(), :not(), :has() and :where() count under Selectors Level 4, and how ties are broken.
tags: [CSS, Front End, Web Development]
---

When two CSS rules set the same property on the same element, the browser keeps the one with the higher specificity. Specificity is a score of three numbers, written (a, b, c): IDs, then classes, attributes and pseudo-classes, then elements and pseudo-elements. The browser compares them left to right, so `#app p` at (1, 0, 1) beats `.nav .menu .item a` at (0, 3, 1). If the scores are equal, the rule that comes later in the stylesheet wins.

That's the short version. The details get tricky with newer selectors like `:is()` and `:where()`. This guide walks through the rules one column at a time, then runs a real tie through the [CSS specificity calculator](/online-tool/developer-tools/css-specificity-calculator).

## What do the three columns count?

The rules come from the W3C's Selectors Level 4 specification. Each simple selector adds 1 to exactly one column:

- **A** counts ID selectors, such as `#app`.
- **B** counts class selectors (`.card`), attribute selectors (`[type="text"]`) and pseudo-classes (`:hover`, `:first-child`).
- **C** counts type selectors (`button`, `li`) and pseudo-elements (`::after`).

Some parts count nothing at all. The universal selector `*` adds zero, and so do the combinators: the space, `>`, `+` and `~`. So `#app .card:hover > button` scores (1, 2, 1). That's one ID, one class plus one pseudo-class, and one element.

The columns never carry over. Eleven classes don't turn into an ID. A score of (0, 11, 0) still loses to (1, 0, 0), because the browser stops at the first column that differs.

## Where do old pseudo-elements fit?

CSS2 wrote pseudo-elements with a single colon, as in `a:before`. Browsers still accept that spelling for four of them: `:before`, `:after`, `:first-line` and `:first-letter`. They count as elements in column C, not as pseudo-classes. The calculator follows this and adds a note, so `a:before` shows (0, 0, 2) rather than (0, 1, 1).

## How do :is(), :not(), :has() and :where() count?

Level 4 gave the functional pseudo-classes their own rules. The pseudo-class itself adds nothing. Instead, it takes the score of the most specific selector inside it.

- `:is()`, `:not()` and `:has()` take the specificity of their most specific argument. `:is(#main, .content) p` scores (1, 0, 1), because `#main` outranks `.content`. That holds even when the element only matches through `.content`.
- `:where()` always counts zero, whatever is inside it.
- `:nth-child(An+B of S)` and `:nth-last-child()` with an `of` part count one pseudo-class plus the most specific selector in S. Plain `:nth-child(odd)` or `:nth-of-type(2)` is just one pseudo-class.

The calculator also treats the older aliases `:matches()`, `:-webkit-any()` and `:-moz-any()` like `:is()`. It counts `:host()` and `:host-context()` as a pseudo-class plus their argument, and `::slotted()` as a pseudo-element plus its argument. An empty `:is()` or `:where()` counts zero. An empty `:not()` or `:has()` is an error, and the tool reports ":not() needs at least one selector."

The nesting selector `&` is a special case. Its real score is the parent rule's specificity, which a single line can't show. The tool counts it as zero and says so in a note.

## Worked example: a tie and the Level 4 set

Open the calculator and click the **Which wins?** example. It loads four lines:

| Line | Selector       | Score     |
| ---- | -------------- | --------- |
| 1    | `.card .title` | (0, 2, 0) |
| 2    | `div.card h2`  | (0, 1, 2) |
| 3    | `h2.title`     | (0, 1, 1) |
| 4    | `.card .title` | (0, 2, 0) |

The **Ranking — most specific first** panel puts line 4 at the top with a "wins" badge, then line 1, then `div.card h2`, then `h2.title`. Lines 1 and 4 tie, so the tool notes that two selectors tie and that the rule written later wins. Here that's the one on line 4. Notice that `div.card h2` has more parts than `.card .title` and still loses. Two elements can't outweigh a second class.

Now click **Level 4**. The results show exactly the rules above:

| Selector                         | Score     | Why                                         |
| -------------------------------- | --------- | ------------------------------------------- |
| `:is(#main, .content) p`         | (1, 0, 1) | takes `#main` (1, 0, 0), plus `p`           |
| `:where(#main, .content) p`      | (0, 0, 1) | `:where()` counts 0, only `p` is left       |
| `li:not(.done, #pinned)`         | (1, 0, 1) | takes `#pinned` (1, 0, 0), plus `li`        |
| `figure:has(> img.wide)`         | (0, 1, 2) | takes `> img.wide` (0, 1, 1), plus `figure` |
| `li:nth-child(2n+1 of .visible)` | (0, 2, 1) | one pseudo-class plus `.visible`, plus `li` |

Each card colors the parts by column: rose for A, amber for B and sky blue for C. Below the score, three boxes list which parts landed in each column. Hover a chip to see its explanation. The notes under the card spell it out, for example ":where() always counts 0."

## What does the tool accept?

Type one selector per line. A comma-separated list such as `div.x, p.y` is split into separate entries, and each one gets its own score. That matches how the cascade treats them. Comments are dropped, and if you paste a whole rule, everything from `{` onward is ignored.

The parser checks the syntax as it goes, so typos show up as plain-language errors. A trailing comma gives "The selector list ends with a comma — remove it or add a selector." An ID that starts with a digit, like `#1st`, gets a hint to escape it. Unquoted numbers in attribute values ask for quotes, as in `[data-id="1"]`. Everything runs in your browser, so the selectors you paste stay on your machine.

## What sits above specificity?

Specificity is only one step of the cascade. Before it, the browser checks origin and importance, so a `!important` declaration beats any selector score. It also checks cascade layers and whether a style is inline. A `style` attribute outranks every selector. Specificity only decides between declarations that are still tied after those steps. After it, source order breaks any remaining tie.

If you want to tidy the stylesheet you're debugging first, run it through the [CSS formatter](/online-tool/developer-tools/css-formatter). For layout rules that still won't behave, the [Flexbox playground](/online-tool/developer-tools/flexbox-playground) shows what each property does.

## FAQ

### Is specificity a base-10 number?

No. It's three separate counts compared in order. Writing (0, 11, 0) as "110" would wrongly suggest it beats (1, 0, 0).

### Why use :where() at all?

It keeps a selector's score at zero, so anyone can override it with a single class. That makes it a good fit for resets and library defaults.

### Does :not(.a, #b) count both arguments?

No. It counts only the most specific one, here `#b`, so it adds (1, 0, 0).

### Do combinators add anything?

No. The space, `>`, `+` and `~` count zero, and so does `*`.

Paste the selectors from your own stylesheet into the [CSS specificity calculator](/online-tool/developer-tools/css-specificity-calculator) to see which one wins.
