---
slug: unminify-css-to-debug-a-production-stylesheet
tool: css-formatter
title: How to Unminify CSS and Debug a Production Stylesheet
description: 'A walkthrough for tracking down a style override in minified production CSS: beautify it, find the rule, understand the cascade, and fix it at the source.'
tags: [CSS, Debugging, Formatting]
---

To unminify CSS, run it through a formatter. It parses the stylesheet and prints it back with one declaration per line, every rule block indented, and media queries and nested rules indented one level deeper. The CSS still behaves exactly the same. The difference is that you can now search it, read the cascade, and find the rule that's overriding yours.

This guide walks through a common case: a button looks wrong in production, and the only stylesheet you can see is `main.4f9a1c.min.css`.

## The situation

Locally, your `.btn` is full-width on mobile. In production it isn't. DevTools says the `width` comes from line 1, column 48,213 of a minified file, which doesn't tell you much. Here's a small piece of that file:

```css
.btn {
  color: #fff;
  background: #0070f3;
}
.btn:hover,
.btn:focus-visible {
  background: #0059c1;
}
@media (max-width: 600px) {
  .btn {
    width: 100%;
    padding: 12px 0;
  }
}
```

## Step 1: Beautify the stylesheet

Open the stylesheet in DevTools' Sources panel or in a new tab, copy all of it, and paste it into the [CSS Formatter](/online-tool/developer-tools/css-formatter). Choose an **Indent** (2 spaces, 4 spaces or Tab) and click **Format CSS**:

```css
.btn {
  color: #fff;
  background: #0070f3;
}
.btn:hover,
.btn:focus-visible {
  background: #0059c1;
}
@media (max-width: 600px) {
  .btn {
    width: 100%;
    padding: 12px 0;
  }
}
```

Every selector in a comma-separated list now gets its own line, so `.btn:focus-visible` is easy to find. Media queries wrap their rules in an indented block, so you can see straight away which rules apply only on small screens.

## Step 2: Search for every rule that touches the property

Copy the formatted output into your editor and search for the selector or the property. Since each declaration now has its own line, a search for `width:` gives one hit per declaration rather than one hit for the whole file. Look for:

- **A later rule with the same specificity.** In the cascade, the later rule wins, so a `.btn { width: auto }` below your media query overrides it.
- **A more specific selector**, like `.header .btn` or `button.btn`, which beats `.btn` regardless of order.
- **`!important`** anywhere on that property.
- **A media query in a different order than you expect.** Bundlers sometimes merge files, so a third-party stylesheet's rules can end up after yours.

In our case, a component library's `.toolbar .btn { width: auto; }` came later and was more specific, so it won.

## Step 3: Fix it in the source, not the bundle

The formatted file is for diagnosis. Fix the problem in your source stylesheet or component, by raising specificity deliberately, reordering imports, or using a cascade layer, then rebuild. Editing the minified bundle directly won't survive the next deploy.

## What else changes when you format?

Formatting uses Prettier, which normalizes a few things besides whitespace. Here's an input and its output:

```css
a {
  color: #fff;
  margin: 0px 0 0.5em;
  transition: all 0.2s ease-in-out;
}
```

```css
a {
  color: #fff;
  margin: 0px 0 0.5em;
  transition: all 0.2s ease-in-out;
}
```

- Hex colors are lowercased: `#FFF` → `#fff`.
- Leading zeros are added: `.5em` → `0.5em`, `.2s` → `0.2s`.
- Empty declarations like `;;` are dropped.
- Keyword case is left alone (`RED` stays `RED`), and values aren't converted or shortened. `0px` stays `0px`.

None of these change how the browser renders the page. Comments are kept, including `/*! license */` comments.

Native CSS nesting is supported too:

```css
.card {
  padding: 16px;
  &:hover {
    color: red;
  }
}
```

## Troubleshooting format errors

The stylesheet is parsed before it's printed, so broken CSS produces an error rather than mangled output:

> The code could not be parsed. CssSyntaxError: Unclosed block (1:1)

The usual causes:

- **You copied only part of the file.** Copying from DevTools sometimes truncates very long lines.
- **A stray brace** left over from a bad merge.
- **Preprocessor syntax** that isn't plain CSS, such as Sass `//` line comments or Less mixin calls. Compile it first, or format the compiled output.

## Tips for working with formatted CSS

- **Format your source maps' original sources instead, if you can.** If DevTools shows the original SCSS or CSS files through source maps, use those. The formatter is for when source maps aren't available.
- **Keep both versions side by side.** DevTools reports line and column numbers in the minified file. To map one to the formatted version, search for the selector instead of counting lines.
- **Don't commit formatted vendor CSS.** Note what you need to override, and keep vendor files untouched.

The formatter runs entirely in your browser with Prettier loaded on demand, so internal stylesheets stay private. To check your colors once you've found the rule, the [Color Converter](/online-tool/color-tools/color-converter) translates between hex, RGB and HSL.

## FAQ

### Can it turn formatted CSS back into minified CSS?

No, this tool only beautifies. Minify as part of your build, where the minifier can also merge rules and drop unused selectors.

### Does it sort properties or remove duplicates?

No. Declaration order is part of how CSS behaves (a later `background` overrides an earlier one), so the formatter never reorders or removes declarations, apart from empty `;;`.

### Will it format CSS inside an HTML file?

Paste the whole HTML document into the [HTML Formatter](/online-tool/developer-tools/html-formatter) instead. It formats `<style>` blocks with the same CSS rules.

Track down your next override faster with the [CSS Formatter](/online-tool/developer-tools/css-formatter).
