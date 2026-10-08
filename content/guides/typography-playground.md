---
slug: readable-web-typography-size-line-height-measure
tool: typography-playground
title: What Font Size, Line Height and Line Length Read Best?
description: Practical starting values for body text size, line height, letter spacing and line length, plus how WCAG contrast thresholds change for large text.
tags: [Typography, CSS, Web Design, Accessibility]
---

For body text on the web, a good starting point is a font size of 16 to 20 px, a unitless line height of about 1.5, and lines of roughly 45 to 75 characters. In CSS, that last one is a `max-width` of around 60–70ch. Leave letter spacing at `normal`. Keep the contrast between text and background at 4.5:1 or higher, the WCAG AA level for normal-sized text.

These numbers are starting points, not laws. Every font sets differently, so the reliable way to choose is to try them on real text. This guide explains why each setting matters, then tests a paragraph in the [typography playground](/online-tool/developer-tools/typography-playground).

## Why does line length matter so much?

Readers move along a line, then jump back to find the start of the next one. If lines are very long, that return jump gets harder and people lose their place. If lines are very short, the eye jumps too often and the text feels choppy. Typographers have long recommended somewhere between 45 and 75 characters per line for continuous reading, with about 66 as a comfortable middle.

The CSS `ch` unit makes this easy to set. `1ch` is the width of the digit 0 in the current font, so `max-width: 65ch` keeps lines close to 65 characters at any font size. Average letters are often a little narrower than a 0, so real lines may hold a few more characters than the number says.

## How should line height be set?

Line height is the vertical space each line takes up. For body text, 1.4 to 1.7 times the font size usually reads well. Longer lines generally need a bit more, and large headings can be set tighter, around 1.1 to 1.3. Write it without a unit, as in `line-height: 1.6`. A unitless value is passed down to child elements as a ratio, so each one recalculates it for its own font size. A fixed `24px` would be inherited as is and could crowd larger text.

## When should letter spacing change?

Fonts are designed with their spacing built in, so body text usually looks best at `normal`. Small positive values, around 0.05em to 0.1em, help all-caps labels and small text, because capitals set tightly can blur together. Large display headings sometimes look better with slightly negative spacing. Use `em` for spacing so it scales with the font size.

## How does contrast work?

The Web Content Accessibility Guidelines (WCAG 2) define contrast as a ratio between two colors' relative luminance. It runs from 1:1 (no difference) to 21:1 (black on white). The thresholds depend on text size:

| Level | Normal text | Large text |
| ----- | ----------- | ---------- |
| AA    | 4.5:1       | 3:1        |
| AAA   | 7:1         | 4.5:1      |

"Large" means at least 18 points, which is 24 px, or 14 points (about 18.66 px) when bold. The playground uses exactly those limits. It treats text as large at 24 px and above, or at 18.66 px and above with a weight of 700 or more.

## How do I use the playground?

Type your own text in **Sample text**, or load one of three samples: **Heading + paragraph**, **Long paragraph** or **UI labels**. Then adjust the settings on the left:

- **Font family** offers eleven system font stacks, such as System UI, Georgia, Verdana and ui-monospace. These are fonts already on the reader's device, so nothing is downloaded, and the preview shows what your CSS will really do.
- **Font size** runs from 8 to 96 px, or 0.5 to 6 rem. Switching **Size unit** converts the value at 16 px per rem.
- **Font weight** goes from 100 to 900 in steps of 100. **Line height** goes from 0.8 to 2.5.
- **Letter spacing** goes from −0.1 to 0.5 em, and **Word spacing** from −0.2 to 1 em.
- **Alignment** and **Text transform** set justification and case.
- **Text colour** and **Background** feed the contrast box, which shows the ratio and an AA and AAA pass or fail label.
- **Container max-width** sets the line length in ch or px.

Above the preview, **Mobile 375**, **Tablet 768** and **Desktop 1200** set the frame width. If the frame is wider than your screen, it's scaled down and a note says by how much. The **Generated CSS** panel writes a `.text` rule you can copy.

## Worked example: testing the defaults and a gray

The playground opens with System UI at 18 px, weight 400, line height 1.6, and `#1f2937` text on `#ffffff`, in a 65ch container. The generated rule is:

```css
.text {
  font-family:
    system-ui,
    -apple-system,
    'Segoe UI',
    Roboto,
    'Helvetica Neue',
    Arial,
    sans-serif;
  font-size: 18px;
  font-weight: 400;
  line-height: 1.6;
  letter-spacing: normal;
  color: #1f2937;
  background-color: #ffffff;
  max-width: 65ch;
}
```

At 18 px, a line height of 1.6 gives each line 28.8 px. The contrast box reads **14.68:1** (normal text), which passes both AA and AAA.

Now set **Text colour** to `#9ca3af`, a light gray often used for captions. The ratio falls to 2.54:1, and both labels turn to fail. Raising the size to 24 px makes it large text, which lowers the AA bar to 3:1. But 2.54 still fails. Pick `#6b7280` instead and the ratio is 4.83:1. That passes AA for normal text and fails AAA, which needs 7:1.

Finally, switch **Width unit** from ch to px. The tool converts 65ch to 585px, using its rough estimate that 1ch is half the font size: 65 × 9 px. The real ch width depends on the font, so a px width keeps the same line length only while you keep the same font and size. That's one reason ch is the better default.

## Why doesn't every weight change the text?

Many system fonts include only regular and bold. When a weight like 300 or 600 isn't installed, the browser falls back to the nearest one it has. The playground notes this under the preview. Variable system fonts, such as the default UI font on some devices, show every step.

For a full contrast check with more color formats, use the [contrast checker](/online-tool/color-tools/contrast-checker). To see how rem, em and ch turn into pixels, try the [CSS unit visualizer](/online-tool/developer-tools/css-unit-visualizer).

## FAQ

### Is 16px too small for body text?

It's the browser default and works for many fonts. Fonts with a small x-height often read better at 17 to 20 px.

### Should I justify body text?

Usually not on the web. Without hyphenation, justified text gets uneven gaps between words, especially in narrow columns on phones.

### Why use rem for font size?

It follows the reader's browser font-size setting. Pixel sizes don't, so people who need bigger text lose that choice.

Test your own text and settings in the [typography playground](/online-tool/developer-tools/typography-playground).
