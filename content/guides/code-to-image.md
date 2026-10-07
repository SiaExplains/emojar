---
slug: how-code-screenshot-generators-work
tool: code-to-image
title: How Code Screenshot Generators Work, From Tokens to PNG
description: "What happens between pasting code and downloading a polished PNG: syntax tokens, theme colors, canvas layout and 2× export, explained with practical tips."
tags: [Code, Images, Developer Tools]
---

A code screenshot generator works in three stages. First a syntax highlighter splits your code into tokens such as keywords, strings and comments. Then each token is painted onto a canvas in a color chosen by the theme, inside a window frame on a background. Finally the canvas is exported as a PNG at a multiple of its size for sharp results. Knowing what happens at each stage explains most of the quirks you'll run into, like odd colors, cut-off files and fonts that change between computers.

## Stage 1: how does the tool know what's a keyword?

The [Code to Image tool](/online-tool/developer-tools/code-to-image) uses highlight.js, a widely used open-source highlighter. It's loaded the first time you use the tool rather than with the page. Given a language, highlight.js runs a grammar over the text and labels every piece with a scope: `keyword`, `string`, `number`, `comment`, `title.function`, `params` and so on.

Take this line of TypeScript:

```ts
const total = items.length * 2; // double it
```

After highlighting, it becomes a sequence of labeled tokens: `const` (keyword), `total = items.` (no scope, plain text), `length` (property), ` * ` (plain), `2` (number), `; ` (plain) and `// double it` (comment). The plain parts keep the theme's default foreground color.

The **Language** menu offers 20 languages plus plain text, including JavaScript, TypeScript, Python, Go, Rust, SQL, Bash / Shell, YAML, HTML / XML and Dockerfile. "Detect automatically" asks highlight.js to try each grammar and keep the best-scoring one, and the tool then shows "Detected language: …" under the settings. Short snippets are ambiguous, so pick the language yourself when colors look wrong.

Before highlighting, tabs are converted to two spaces and trailing whitespace is trimmed, so indentation looks the same no matter which editor you copied from.

## Stage 2: how do tokens become colors?

Each theme is simply a table that maps scopes to colors. In One Dark, keywords are purple, strings green, numbers orange, function names blue and comments gray. Dracula, GitHub Light and Night Owl use their own palettes for the same scopes. If a scope has no entry in the theme, the tool tries its parent (`title.function` falls back to `title`), and if there's still no match the token uses the default text color.

That's why the same snippet can look richer in one theme than another. A theme that defines more scopes paints more of the code.

## Stage 3: how is the image laid out?

Nothing is rendered as HTML. The tool draws directly onto a `<canvas>`, which keeps the result identical to the preview. The layout is computed from a few measurements:

- **Character width.** The font is your system's monospace font (SF Mono, Menlo, Consolas or similar). The tool measures the width of one character and multiplies it by the longest line's length, with a minimum of 20 characters so tiny snippets don't produce a sliver.
- **Line height.** Each line is 1.6 times the font size. At the default 15px, that's 24px per line.
- **Gutter.** With **Line numbers** on, extra space is reserved on the left based on how many digits the last line number has.
- **Window bar.** With **Window buttons** on, a 40px bar holds the three colored dots and the **Window title**, centered and capped at 60 characters. The title only appears when window buttons are on.
- **Background.** Sunset, Ocean, Forest, Candy and Midnight are two-color diagonal gradients, and the window gets rounded corners and a soft drop shadow. **Padding** (16 to 128px) sets how much gradient shows around the window.

Choosing "None (transparent)" changes the geometry. Padding, rounded corners and the shadow are all dropped, and you get just the code window on a transparent PNG.

The 300-line limit also lives here. Very long files would produce enormous canvases, so only the first 300 lines are drawn and a message says so. For social posts, 10 to 25 lines is far more readable anyway.

## Stage 4: why export at 2×?

Screens with high pixel density show a 1× image slightly blurry. **Export size** multiplies the canvas dimensions: "1× (small)", "2× (sharp, recommended)" or "3× (print)". A card that measures 700 by 400 CSS pixels exports at 1400 by 800 pixels at 2×, and at 2100 by 1200 at 3×. Text stays crisp because it's redrawn at the higher resolution, not scaled up afterward.

**Download PNG** names the file after the window title, so `debounce.ts` downloads as `debounce.ts.png`, or `code.png` if the title is empty. **Copy image** puts the PNG on your clipboard through the browser's Clipboard API. Where that isn't supported, the button reads "Copy not supported — use Download". Everything happens in your browser, so private code never leaves your machine.

## Practical tips that follow from all this

1. **Format first.** The image reproduces your indentation exactly. Run messy code through the [JavaScript formatter](/online-tool/developer-tools/javascript-formatter) or the [JSON formatter](/online-tool/developer-tools/json-formatter) before you paste it.
2. **Fix the language before blaming the theme.** Flat, single-color output usually means detection guessed wrong.
3. **Expect font differences.** Because the font comes from your system, a colleague on Windows will get Consolas where you got SF Mono. Export once and share the PNG rather than asking others to recreate it.
4. **Keep lines short.** The window grows with the longest line, so one very long line shrinks everything in a feed.
5. **Always share the text too.** Images can't be searched, copied or read by screen readers. Add alt text that summarizes the code, and link a gist or repository.

## FAQ

### Can I highlight a single line?

Not currently. The options cover theme, background, padding, font size from 11 to 24px, title, window buttons and line numbers.

### Is a code image good for documentation?

Rarely. Docs readers need to copy code. Images work best for slides, social posts and thumbnails, where the visual matters more than reuse.

Make your next snippet presentable with [Code to Image](/online-tool/developer-tools/code-to-image).
