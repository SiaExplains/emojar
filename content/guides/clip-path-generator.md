---
slug: css-clip-path-polygon-circle-inset-guide
tool: clip-path-generator
title: How to Cut Any Shape With CSS clip-path Polygons
description: How clip-path polygon(), circle(), ellipse() and inset() define a visible region, how the percentages work, and how a five-point star is plotted.
tags: [CSS, Web Design, Front End]
---

`clip-path` hides every part of an element that falls outside a shape you describe. The element keeps its normal size and place in the layout. Only the painted area changes. The most flexible shape is `polygon()`, a list of x y points in percent of the element's width and height. For example, `clip-path: polygon(50% 0%, 100% 100%, 0% 100%)` turns any box into a triangle.

There are also `circle()`, `ellipse()` and `inset()` for simpler cuts. This guide explains all four, then plots a star in the [clip-path generator](/online-tool/developer-tools/clip-path-generator).

## How do polygon coordinates work?

The basic shapes are defined in the W3C's CSS Shapes Module Level 1. In `polygon()`, each point is written as an x value, a space, and a y value, with commas between points. The origin `0% 0%` is the top-left corner of the element. `100% 100%` is the bottom-right. The browser joins the points in order and closes the shape automatically, from the last point back to the first.

Because the points are percentages, one clip-path fits any size. The triangle above works on a 50px icon and on a full-width banner. The order of the points matters, though. If two edges cross, you get a bow-tie shape instead of the outline you meant. That's why the generator inserts new points on the nearest edge instead of simply adding them to the end of the list.

## What about circle, ellipse and inset?

- `circle(40% at 50% 50%)` takes a radius and a center after the `at` keyword. A percentage radius is measured against the box's diagonal, divided by √2. On a square, that's simply the side length.
- `ellipse(45% 30% at 50% 50%)` takes a horizontal and a vertical radius. These are percentages of the width and the height.
- `inset(10%)` cuts in from the edges like a margin. It follows the same one-to-four-value pattern as `margin`: top, right, bottom, left. An optional `round` part rounds the corners, as in `inset(10% 20% round 5%)`.

Those three examples are the generator's own defaults and outputs. It writes the inset sides in their shortest form, so equal sides collapse into one value.

## How do I use the generator?

Choose a **Shape**: Polygon, Circle, Ellipse or Inset. The **Sample** menu picks what gets clipped: a Sunset gradient, an Ocean gradient or a Checker pattern. A faded copy of the sample stays visible behind the shape, so you can see what's being cut away. **Show outline** draws the shape's edge on top.

For polygons, you get twelve presets: Triangle, Rhombus, Trapezoid, Parallelogram, Pentagon, Hexagon, Octagon, Star, Arrow, Chevron, Message bubble and Cross. You can then edit the points in a few ways:

- Click or tap empty space in the preview to add a point on the nearest edge, and keep dragging to place it.
- Drag any numbered point to move it.
- Type exact x and y percentages in the **Points** list.
- Press **+ Add point** to add a point halfway along the edge after the selected point, or after the last point if none is selected.
- Select a point with Tab and nudge it with the arrow keys. Hold Shift to move it ten times as far. Press Delete or the ✕ button to remove it.

A polygon needs at least three points, so the delete buttons turn off at three. **Snap to grid** rounds dragged points to 5% or 10% steps and draws the grid lines. Points always stay between 0% and 100%.

Circle and ellipse use sliders for the radius and the center, and a draggable center handle. Inset has sliders for Top, Right, Bottom, Left and Corner round, each from 0 to 50%. **Reset** restores all four shapes to their defaults.

## Worked example: plotting a star

Pick **Polygon**, then the **Star** preset. The generator plots a five-pointed star as ten points. They alternate between an outer circle with a radius of 50% and an inner circle with a radius of 20%. Both circles are centered on the box, and the points are spaced 36° apart, starting straight up at the top. Each coordinate is rounded to one decimal:

```css
clip-path: polygon(
  50% 0%,
  61.8% 33.8%,
  97.6% 34.5%,
  69% 56.2%,
  79.4% 90.5%,
  50% 70%,
  20.6% 90.5%,
  31% 56.2%,
  2.4% 34.5%,
  38.2% 33.8%
);
```

Check the first two points. The top tip sits at 50% + 50 × cos(−90°) = 50% across and 50% + 50 × sin(−90°) = 0% down. The first inner point is 36° further around, on the small circle. That works out to 50 + 20 × cos(−54°) ≈ 61.8% across and 50 + 20 × sin(−54°) ≈ 33.8% down. The bottom inner point lands at 50% 70%, which is 20% below the center.

Now drag that point at 50% 70% upward to about 50% 60%. The two lower arms get thicker. Push it down to 50% 85% instead and the star's bottom notch nearly closes. The **Generated CSS** panel updates on every move, with one point per line, and **Copy CSS** copies it.

## What does clipping change besides looks?

The clipped-away area stops receiving clicks and hover, so the clickable region matches the visible shape. Clipping also cuts off anything painted outside the shape, including `box-shadow` and outlines. To keep a shadow, put `filter: drop-shadow()` on a wrapper element around the clipped one.

Shapes can be animated with a CSS transition, but only between shapes of the same type. Polygons also need the same number of points. If your two shapes differ, add extra points to the simpler one, for example by placing two points on the same spot.

For rounded corners alone, the [border radius generator](/online-tool/developer-tools/border-radius-generator) is simpler and keeps shadows intact. To rotate or scale the clipped element, the [CSS transform playground](/online-tool/developer-tools/css-transform-playground) writes the transform for you.

## FAQ

### Do I need -webkit-clip-path?

Not for current browsers. The basic shapes work unprefixed everywhere. Only very old Safari versions needed the prefix.

### Can I use pixels instead of percentages?

CSS allows any length in `polygon()`, but the generator works in percent so the shape scales with the element.

### Why does the circle radius slider stop at 75%?

On the square preview, a centered circle already covers the whole box at about 70.7%, half the diagonal. Going further would just show everything.

Draw your own shapes in the [clip-path generator](/online-tool/developer-tools/clip-path-generator).
