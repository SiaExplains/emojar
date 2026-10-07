---
slug: what-size-to-export-svg-to-png
tool: svg-to-png
title: What Size Should You Export an SVG to PNG? A Practical Guide
description: Exporting an SVG logo or icon to PNG? Pick the right pixel width for screens, retina displays and print, and avoid missing fonts and blurry results.
tags: [SVG, Images, Design]
---

Export an SVG at **2–3 times the size it will be displayed** on screen, and at **inches × 300** pixels for print. A logo shown 200 pixels wide on a website should be exported around 400–600 pixels wide; a logo printed 3 inches wide needs about 900 pixels. Because SVG is vector-based, the PNG is equally sharp at any width you choose, so size it for where it's going rather than guessing.

## Why does the export size matter if SVG is "infinitely scalable"?

The SVG is scalable. The PNG isn't. An SVG stores shapes as math: "draw a circle of radius 40 here." A PNG stores a fixed grid of pixels. Converting means choosing how big that grid is, once. Make it too small and it looks blurry when scaled up; make it huge and you've created a heavy file for a 32-pixel icon.

High-density ("retina") screens add a twist. A phone or laptop with a 2× or 3× display uses 2 or 3 physical pixels for every CSS pixel. An icon displayed at 48 CSS pixels needs a 96- or 144-pixel-wide image to look crisp there.

## The sizing cheat sheet

| Where the PNG will be used | Display size       | Export width                  |
| -------------------------- | ------------------ | ----------------------------- |
| Favicon-style icon         | 32 px              | 64–96 px                      |
| App or toolbar icon        | 48 px              | 96–144 px                     |
| Website logo in a header   | 200 px             | 400–600 px                    |
| Social profile image       | varies by platform | at least 400 px, more is fine |
| Slide in a presentation    | full slide width   | 1920 px                       |
| Printed at 3 inches wide   | 3 in               | 900 px (3 × 300)              |
| Printed at 8 inches wide   | 8 in               | 2400 px (8 × 300)             |

You only set the width. The height follows the SVG's own proportions automatically, so a 4:1 wordmark exported at 1200 pixels wide comes out 1200 × 300.

## A pre-export checklist

Run through this before converting, especially for logos you'll hand to other people.

- **Convert text to outlines (paths).** Browsers don't load external fonts referenced by an SVG when rasterizing it, for security reasons. If your SVG uses a web font, the PNG will fall back to a default font or fail to render. In your design app, "Create outlines" or "Convert text to paths" fixes this permanently.
- **Embed linked images.** For the same reason, an SVG that references an external `.png` or `.jpg` by URL won't include that image. Embed it in the SVG instead.
- **Check the canvas.** The output is sized from the SVG's `width`/`height` attributes or its `viewBox`. If your logo sits in a big empty artboard, the PNG will have big empty margins too. Fit the artboard to the artwork before exporting.
- **Decide on the background.** PNG keeps transparency, which is usually what you want for logos. If the recipient needs a solid background, choose JPG, which fills transparent areas with white.
- **Export one size per use.** A 2400-pixel print file is overkill for a website header. Make separate exports instead of one huge one.

## How to convert SVG to PNG step by step

1. Open the [SVG to PNG converter](/online-tool/image-tools/svg-to-png) and add one or more SVG files.
2. Set **SVG output width** in pixels, anywhere from 16 to 8192. The default is 1024.
3. Leave **Convert to** on PNG (lossless, keeps transparency). JPG, WebP and PDF are available too if you need them.
4. Click **Convert** and download each PNG, or "Download all" for a batch. Every file in the batch is exported at the same width.

The SVGs are rendered by your browser, so your artwork stays on your device. If you need several sizes of the same logo, run the conversion again with a different width; it takes a second.

## Troubleshooting

- **"This SVG could not be rendered."** The file likely references external fonts or images. Outline the text and embed the images, then try again.
- **"This SVG file could not be read."** The markup is invalid, often because the file was saved as HTML or got truncated. Open it in a text editor and check that it starts with `<svg` or `<?xml`.
- **The PNG is square when the logo isn't.** The SVG has no `width`, `height` or `viewBox`, so a 512 × 512 default canvas was used. Add a `viewBox` that matches the artwork.
- **The result looks blurry.** It was exported smaller than it's displayed. Re-export at a larger width; never upscale the PNG afterwards.

## FAQ

### Is the PNG file going to be huge at 4000 pixels wide?

Simple flat logos compress very well as PNG, because they contain large areas of identical color. Detailed illustrations with gradients get bigger. If size matters, the [Image Compressor](/online-tool/image-tools/image-compressor) can convert the result to WebP.

### Can I convert an SVG straight to a PDF?

Yes. Choose PDF in the **Convert to** menu. Note that the SVG is rendered to pixels first at the width you set, so the PDF contains an image, not editable vector shapes.

### Should I use the PNG or keep the SVG on my website?

If the site accepts SVG, the original is usually the better choice: smaller and sharp at every size. Use PNG where SVG isn't accepted, such as many social profiles, email signatures and document editors.

Pick your width from the table and export it with the [SVG to PNG converter](/online-tool/image-tools/svg-to-png).
