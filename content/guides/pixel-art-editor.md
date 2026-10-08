---
slug: draw-and-export-pixel-art-sprites-that-stay-sharp
tool: pixel-art-editor
title: 'Pixel Art Sprites: Grid Sizes, Animation and Sharp Exports'
description: How to pick a grid size, animate a sprite frame by frame, and export PNG, SVG, sprite sheets or GIFs that stay crisp at any scale.
tags: [Pixel Art, Sprites, Game Development]
---

To make pixel art that stays sharp, draw on a small grid such as 16×16, then scale it up by a whole number with nearest-neighbor scaling, so each source pixel becomes a clean square block. Never resize pixel art by an odd factor or with smoothing, because that blurs the edges. For animation, draw each frame on the same grid and export a sprite sheet or an animated GIF.

The [pixel art editor](/online-tool/image-tools/pixel-art-editor) is built around those rules. This guide covers how to choose a canvas, use the tools well, and what each export actually contains.

## Which grid size should I choose?

The editor offers square grids of 8×8, 16×16, 24×24, 32×32, 48×48 and 64×64. It starts at 16×16. Smaller grids are faster to fill and force you to simplify, which is the whole charm of the style.

- **8×8:** tiny icons, simple items, font glyphs.
- **16×16:** classic game characters and tiles, and the standard favicon size.
- **24×24 and 32×32:** more detailed characters, larger favicons and UI icons.
- **48×48 and 64×64:** portraits, scenes and detailed objects.

You can change the grid later. Growing it keeps your drawing in the top-left corner and adds empty space. Shrinking crops anything outside the new top-left area, and the editor asks for confirmation before it cuts off painted pixels.

## How do the drawing tools work?

There are four tools, each with a one-letter shortcut:

- **Pencil (P)** paints the current color. Fast strokes are joined with Bresenham's line algorithm, so there are no gaps between cells.
- **Eraser (E)** makes cells transparent again.
- **Fill (F)** floods a connected area of the same color. It's 4-connected: it spreads up, down, left and right, but not diagonally. A one-pixel diagonal line therefore works as a wall.
- **Eyedropper (I)** picks up a color from the canvas.

Colors come from the color input, an 18-color default palette, or **Recent colours**, which keeps your last 10. **Horizontal mirror (left ↔ right)** and **Vertical mirror (top ↔ bottom)** paint the reflected cells at the same time. Turn on both for four-way symmetry, which is handy for faces, shields and snowflakes.

**↶ Undo** and **↷ Redo** also work with Ctrl/⌘+Z, Shift+Ctrl/⌘+Z and Ctrl+Y. Undo history holds the last 100 changes.

You can draw without a mouse. Focus the canvas, move the cursor with the arrow keys, and press Space or Enter to use the current tool. Touch drawing works on phones and tablets.

## Worked example: a four-frame walk cycle

Say you draw a 16×16 character and want a short walking animation.

1. Draw the standing pose on frame 1.
2. Press **Duplicate** to copy it into frame 2, then move the legs. Turn on **Onion skin (show previous frame)** to see frame 1 faintly underneath.
3. Duplicate again for frames 3 and 4. The header reads "Frames (4 of 4)".
4. Use **←** and **→** to reorder frames if needed. **+ New** adds a blank frame instead, and **Delete** removes the current one. A project can hold up to 64 frames.
5. Once there's more than one frame, a preview appears. Press **▶ Play preview** and adjust **Frames per second** (1 to 24, default 6).

Now export with **Scale** set to 4× (64px):

- **⬇ PNG** saves the current frame as `pixel-art-64px.png`, 64 × 64 pixels.
- **⬇ Sprite sheet** places every frame side by side, up to 8 per row. Four frames give a 256 × 64 image named `pixel-art-sheet-4x64px.png`. Ten frames would wrap into two rows of 8 columns, for 512 × 128.
- **⬇ Animated GIF** saves `pixel-art-4f.gif`. At 6 fps, each frame shows for about 170 milliseconds (GIF stores delays in hundredths of a second), and the GIF loops forever.

Scale choices run from 1× to 32×. A 16×16 sprite at 32× becomes 512 × 512 pixels, with each original pixel as a perfect 32 × 32 block. Sheets wider than 16,384 pixels are refused with "Too wide — choose a smaller scale." because browsers can't make canvases that large.

## What do the export formats contain?

**PNG** is the safest choice for sharing and for game engines. It's lossless and keeps transparent pixels transparent.

**SVG** is a vector version of the current frame. Instead of one square per pixel, the editor merges each horizontal run of same-colored pixels into a single rectangle. A row with six black pixels in a line becomes one `<rect>` six units wide. That keeps files small. The SVG uses `shape-rendering="crispEdges"`, so browsers don't anti-alias the edges, and it scales to any size without blurring.

**Animated GIF** stores colors in a palette of up to 256 entries. The editor reserves one entry for transparency and, when your art has 255 colors or fewer (which pixel art almost always does), maps every color exactly instead of approximating it. Each frame is cleared before the next one draws, so transparent areas don't show leftovers from earlier frames. GIF transparency is on or off, with no partial alpha, which suits pixel art fine.

To combine your frames with photos or other images into a GIF, use the [GIF maker](/online-tool/image-tools/gif-maker). For a site icon, the [favicon generator](/online-tool/image-tools/favicon-generator) can turn a 32×32 PNG into the files browsers expect.

## Is my drawing saved?

Yes, but only in this browser. The editor autosaves the grid size, all frames, the frame rate and recent colors to local storage, and restores them when you come back. Nothing is uploaded. Private browsing windows and clearing site data erase the save, so export a PNG or sprite sheet of anything you want to keep.

## FAQ

### Why does my exported image look blurry in another app?

The export itself is sharp. Blur usually comes from the viewer or editor scaling it with smoothing. Scale it by whole numbers and pick "nearest neighbor" in that app's resize settings.

### How do I clear the canvas?

**Clear frame** empties the current frame only. Other frames are kept, and Undo brings the drawing back.

### Can I import an existing image?

No. The editor is for drawing from scratch. It doesn't load images.

Start a 16×16 sprite in the [pixel art editor](/online-tool/image-tools/pixel-art-editor) and export it at 32× for a crisp 512-pixel preview.
