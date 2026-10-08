---
slug: css-mesh-gradient-with-layered-radial-gradients
tool: gradient-mesh-generator
title: How to Make a Mesh Gradient in CSS Without Any Image File
description: CSS has no mesh gradient, but stacked radial-gradient() layers come close. See how the layers work, with the exact code for an aurora background.
tags: [CSS, Gradients, Web Design]
---

CSS has no native mesh gradient, but you can get the same soft, multi-color look by stacking several `radial-gradient()` layers over a background color. Each layer is one color that starts at its own position and fades to transparent, and where layers overlap the colors blend. It works in every current browser, scales to any size and needs no image file.

The [mesh gradient generator](/online-tool/color-tools/gradient-mesh-generator) builds that stack for you from draggable points. Here's how the technique works, with the exact CSS the default preset produces.

## What is a mesh gradient?

In vector design apps, a gradient mesh is a grid of points, each with its own color, and the app interpolates colors smoothly across the surface between them. That's very different from a linear gradient, which blends along a single line, or a single radial gradient, which blends outward from one center.

The web version is an approximation. Instead of a true grid, you place a few colored "light sources" and let each one fade out. Designers often call the result an aurora or blurry gradient background. With three to eight points, it's hard to tell apart from a real mesh at background scale.

## How does the layered CSS work?

Each point in the tool becomes one layer like this:

`radial-gradient(at 15% 20%, rgba(34, 211, 238, 0.85) 0, transparent 55%)`

Reading it left to right:

- **`at 15% 20%`** places the center 15% from the left and 20% from the top.
- **`rgba(…, 0.85) 0`** is the color at the center, at 85% opacity.
- **`transparent 55%`** is where it has fully faded. With no size given, a radial gradient is an ellipse sized to reach the farthest corner of the box, so 55% means the color is gone a little over halfway to that corner.

All the layers go into one `background-image` property, separated by commas, over a `background-color`. The first layer in the list paints on top. Layers in the middle of the list show through wherever the upper layers have faded out, which is what creates the blended look.

## Worked example: the Aurora preset

The tool opens on the **Aurora** preset: a dark navy background and four points. Its **CSS** panel contains:

```css
background-color: #0f172a;
background-image:
  radial-gradient(at 15% 20%, rgba(34, 211, 238, 0.85) 0, transparent 55%),
  radial-gradient(at 80% 15%, rgba(168, 85, 247, 0.8) 0, transparent 50%),
  radial-gradient(at 55% 85%, rgba(16, 185, 129, 0.75) 0, transparent 55%),
  radial-gradient(at 10% 90%, rgba(99, 102, 241, 0.7) 0, transparent 45%);
```

That's cyan at the top left, purple at the top right, green at the bottom center and indigo in the bottom-left corner. The hex colors you pick (`#22d3ee`, `#a855f7`, `#10b981`, `#6366f1`) are converted to `rgba()` so each point's **Opacity** slider can control its alpha. Paste the two lines into any element's style and it fills the element at any size.

Try dragging point 1 toward the center. Its `at` values update live, and because the radius is measured to the farthest corner, the cyan grows smaller as it moves inward. Raise **Radius (softness)** to compensate.

## What can I change for each point?

Click a numbered point on the preview, or pick it from the point buttons, then edit:

- **Colour**, using the color input.
- **x** and **y** as percentages from 0 to 100. You can also drag, or use the arrow keys once a point has focus.
- **Opacity**, from 5% to 100%.
- **Radius (softness)**, from 10% to 100%. Larger values overlap more and blend more softly.

**+ Add point** adds a new point in the center (up to 8), copying the selected point's opacity and radius. **Remove point** deletes the selected one, down to a minimum of 3. The **Background colour** shows through wherever no layer reaches. **Film grain** adds a faint noise texture layer on top, which helps hide color banding on large screens.

The other presets, **Peach**, **Ocean** and **Candy**, start from light backgrounds. **🎲 Randomize** builds three to five points around a random base hue, and **Reset** returns to Aurora with grain off.

## CSS, SVG or PNG: which output should I use?

The tool gives three outputs, and they aren't pixel-identical.

- **A · CSS** is exactly what the **CSS preview** shows. Use it for responsive page and section backgrounds. It costs no extra download.
- **B · SVG** draws the same gradients as SVG `radialGradient` elements, scaled to match the CSS ellipses. It adds a Gaussian blur filter so the colors melt together more smoothly. The blur's standard deviation is 4% of the shorter side, which is 43 pixels at 1920 × 1080. Switch to **SVG / PNG preview** to see it.
- **C · PNG image** renders that SVG to a canvas at the size you choose: 1920 × 1080, 2560 × 1440, 1080 × 1080, 1080 × 1920 (story) or 1200 × 630 (social card). The size also changes the preview's shape, so check your point positions after switching. Files download as names like `mesh-gradient-1920x1080.png`.

If your browser can't render the PNG, the tool says so and suggests downloading the SVG and converting it with the [SVG to PNG converter](/online-tool/image-tools/svg-to-png).

## Tips for gradients that look good

- **Keep contrast low behind text.** A busy mesh under body copy hurts readability, so lower opacities or use a dark background with light text.
- **Use colors that are neighbors on the color wheel.** Analogous hues blend into clean in-between tones. Opposite hues can produce muddy grays where they overlap.
- **Let one color dominate.** Give one point a larger radius than the rest.
- **Need a simple two-color fade instead?** The [gradient generator](/online-tool/color-tools/gradient-generator) handles linear and single radial gradients.

## FAQ

### Do layered radial gradients slow down a page?

Not noticeably. Browsers paint gradients natively, and a few layers are far lighter than downloading a large background image.

### Why does the SVG look smoother than the CSS?

The SVG and PNG add a blur filter that plain CSS gradients don't have. The CSS preview always shows exactly what the copied CSS produces.

### Can I animate the gradient?

Not in this tool. You can animate the copied CSS yourself, for example by changing `background-position` or using registered custom properties for the positions.

Drag a few colors into place in the [mesh gradient generator](/online-tool/color-tools/gradient-mesh-generator) and copy the CSS straight into your stylesheet.
