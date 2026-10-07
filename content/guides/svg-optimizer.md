---
slug: clean-up-an-exported-svg-icon-before-you-ship-it
tool: svg-optimizer
title: Cleaning Up an Exported SVG Icon Before It Goes on Your Site
description: A walkthrough of shrinking a design-tool SVG from 976 to 335 bytes with SVGO, which settings matter, and the two cases where optimizing can break things.
tags: [SVG, Web Performance, Developer Tools, How-to]
---

An SVG exported from Illustrator, Inkscape or Figma usually contains editor comments, metadata, namespaces and coordinates written to six decimal places, none of which the browser needs. Running it through an optimizer such as SVGO removes that baggage and rewrites shapes more compactly; a simple icon often shrinks by half or more with no visible change. The two things worth checking afterwards are curve accuracy at low precision and anything in your code that targets elements by `id`.

Here is a full walkthrough with a real file, showing exactly what gets removed and which settings are worth touching.

## What does a typical exported SVG look like?

The sample built into our optimizer is a 120 x 120 smiley face, written the way design tools tend to export it. It is 976 bytes and includes:

- an `<?xml ... ?>` declaration and a "Generator: Adobe Illustrator" comment,
- an `inkscape` namespace and an `inkscape:label="Layer 1"` attribute,
- a `<metadata>` block with RDF data,
- an empty `<defs></defs>`,
- two nested `<g>` groups that do nothing,
- numbers like `cx="60.000000"` and `stroke-width="4.000000"`,
- `fill="#000000"` on the eyes, even though black is already the default fill.

Every one of those is valid SVG. None of it changes what you see.

## What changes after optimizing?

With the default settings (precision 3, multiple passes on), the same file comes out as one line of 335 bytes, about 65.7 % smaller:

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120"><circle cx="60" cy="60" r="50" fill="#fc0" stroke="#000" stroke-width="4"/><circle cx="42.5" cy="48" r="6"/><circle cx="77.5" cy="48" r="6"/><path fill="none" stroke="#000" stroke-linecap="round" stroke-width="5" d="M35 72c10 18 40 18 50 0"/></svg>
```

Look at what happened:

- The comment, metadata, editor namespace, empty `<defs>` and empty groups are gone.
- `#ffcc00` became `#fc0`, the short form of the same color.
- `fill="#000000"` disappeared from the eyes because it matched the default.
- The smile's path `M 35.000000 72.000000 C 45.000000 90.000000 ...` became `M35 72c10 18 40 18 50 0`, using relative coordinates that are shorter to write.

The before and after previews look identical, which is the point.

## Which settings should you change?

The [SVG optimizer](/online-tool/developer-tools/svg-optimizer) has one slider and four checkboxes. Here is what each did to the sample:

| Setting | Effect on the sample |
| --- | --- |
| **Number precision (decimal places)** at 0 | 331 bytes, but the eyes move from x = 42.5 to 43 and from 77.5 to 78 |
| **Remove width/height (keep viewBox, scales freely)** | 310 bytes; the SVG now sizes itself to its container |
| **Keep comments** | 397 bytes; the Illustrator comment stays |
| **Multiple passes (smaller)** off | 335 bytes; no difference on a file this simple |
| **Pretty-print output** | Adds line breaks and two-space indentation for readability |

**Precision** is the one to think about. It sets how many decimal places coordinates keep. For icons drawn on a whole-pixel grid, 1–3 is safe. At 0, anything sitting on a half pixel gets rounded, which is how the eyes above shifted half a unit. On a small icon that can look slightly lopsided; on a detailed illustration or a tiny viewBox (say `0 0 1 1`), low precision can visibly distort curves. Lower it step by step and watch the After preview.

**Remove width/height** is useful when the icon should fill whatever box CSS gives it. Leave it off if the SVG is used somewhere that relies on fixed dimensions, such as an email template or an app that reads the width attribute.

## How do you optimize your own file?

1. Drop an `.svg` file on the page, or paste the code into **SVG code**. **Load sample** fills in the smiley used above.
2. Adjust precision and the checkboxes. The result updates automatically after a short pause.
3. Read the size line, for example "976 B → 335 B (65.7 % smaller)", and compare the **Before** and **After** previews on the checkerboard background.
4. Copy the optimized code, or download it. A dropped `logo.svg` downloads as `logo.min.svg`.

Everything happens in your browser, and the previews are rendered as images, so any script embedded in an SVG never runs on the page.

## When can optimizing break something?

Two cases deserve a quick check before you replace the original:

- **IDs your code depends on.** The default preset removes IDs that nothing inside the file references and shortens the rest. In a test, `<g id="logo-mark">` disappeared entirely and `id="grad1"` became `id="a"`. If external CSS (`#logo-mark { ... }`), JavaScript or an animation library targets those IDs, it will stop matching. There is no toggle for this in the tool, so for such files keep the original or rename after optimizing.
- **Shapes you planned to edit later.** A `<rect>` may be converted into an equivalent `<path>`, and groups get flattened. That is fine for shipping, but less pleasant to edit by hand. Keep your source file in the design tool and treat the optimized SVG as a build output.

Accessibility text is safer than you might expect: a `<title>` element survived the default settings in testing, so screen readers still get the label.

If you need the icon as a bitmap afterwards, the [SVG to PNG converter](/online-tool/image-tools/svg-to-png) takes the optimized file directly.

## FAQ

### Is a smaller SVG actually faster if my server uses gzip?

Usually yes, though by less than the raw numbers suggest. Compression squeezes repeated text, but it cannot remove data that is not needed at all, such as metadata and extra decimals. Inlined icons also add to every HTML page that contains them.

### Why did the tool say "already optimised"?

The file came out the same size or larger, which happens with SVGs that were already minified. Leave the original as it is.

### Can I optimize an SVG that contains embedded PNG images?

Yes, but embedded bitmaps are stored as base64 data and are not recompressed, so savings come only from the markup around them.

Have an icon set to tidy up? Run each file through the [SVG optimizer](/online-tool/developer-tools/svg-optimizer) and check the previews side by side.
