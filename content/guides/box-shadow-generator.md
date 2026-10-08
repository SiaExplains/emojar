---
slug: css-box-shadow-offset-blur-spread-explained
tool: box-shadow-generator
title: How Do Offset, Blur and Spread Shape a CSS Box Shadow?
description: What each of the four box-shadow lengths does, why layered low-opacity shadows look real, and how to put a shadow on one side only.
tags: [CSS, Web Design, Front End]
---

A CSS box shadow is a copy of the element's border box, painted behind it. Up to four lengths control it. The first two move it right and down, the third blurs its edge, and the fourth grows or shrinks it. Then comes a color, and an optional `inset` keyword moves the shadow inside the box. So `box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2)` drops a soft, faint shadow 10 pixels below the element.

Most good-looking shadows combine several of these layers. This guide explains each value, then builds a one-sided shadow and a layered one in the [box shadow generator](/online-tool/developer-tools/box-shadow-generator).

## What do the four lengths do?

The property is defined in the W3C's CSS Backgrounds and Borders Module Level 3. Each shadow layer reads like this:

```css
box-shadow: [inset] x-offset y-offset [blur] [spread] color;
```

- **X offset** moves the shadow right for positive values and left for negative ones.
- **Y offset** moves it down for positive values and up for negative ones. Light usually comes from above on screen, so a positive Y offset looks natural.
- **Blur** softens the edge. It can't be negative. The specification asks browsers to approximate a Gaussian blur with a standard deviation of half the blur value. Along a straight edge, that gives a fade as long as the blur value, centered on the edge. So a 30px blur fades over about 30 pixels, half inside the shadow's edge and half outside.
- **Spread** grows the shadow shape before it's blurred, or shrinks it when negative. A spread of 5px with no blur and no offset draws a solid 5px ring, a bit like a border that takes up no space.

The shadow follows the element's `border-radius`, so a rounded card gets a rounded shadow. It never affects layout. Other elements don't move to make room for it.

## What changes with inset?

The `inset` keyword draws the shadow inside the padding box instead of outside the border. The offsets then work in reverse visually. A positive Y offset makes the top edge look pressed in, because the shadow shows along the top inner edge. Inset shadows are useful for input fields, pressed buttons and wells.

## Why stack several shadows?

Real objects cast more than one shadow. Close to the object, the shadow is small and dark. Further away it's wide and faint. A single CSS shadow can only be one of these. Stacking a few low-opacity layers with growing offsets and blurs comes much closer to how light behaves.

The comma-separated layers are painted with the first one on top. The generator uses the same order. **Layer 1 is drawn on top of the others**, and the **↑ Up** and **↓ Down** buttons move the selected layer through the stack.

## How do I use the generator?

The left column edits one layer at a time. The heading shows which one, such as "Shadow 2 of 3", and the number buttons beside it switch layers. Each layer has sliders for **X offset** and **Y offset** (−100 to 100 px), **Blur** (0 to 150 px) and **Spread** (−60 to 60 px). The small number boxes next to the sliders accept values up to four times those limits if you need something larger. You also get a **Colour** picker, an **Opacity** slider from 0 to 100% and an **Inset (inner shadow)** checkbox.

**+ Add shadow** copies the current layer as a starting point, up to eight layers. **Remove** deletes the selected one, though at least one layer always stays. On the right, you can set the preview **Background** (light grey, white, mid grey, dark or a gradient), the **Card colour** and the **Card corners** radius. These only affect the preview. The generated CSS contains just the `box-shadow` declaration.

Six presets give you starting points: Soft, Layered, Sharp, Inset, Neumorphic and Glow. **🎲 Randomize** builds one to three random layers, and **Reset** brings back the default single shadow.

## Worked example: a bottom-only shadow

Start from the default layer, which produces `box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);`. Now set **Y offset** to 8, **Blur** to 6, **Spread** to −6 and **Opacity** to 40. The code panel shows:

```css
box-shadow: 0 8px 6px -6px rgba(0, 0, 0, 0.4);
```

The negative spread shrinks the shadow 6px on every side. The 6px blur only reaches about 3px back out, so on the left and right the shadow stays hidden under the card. The 8px offset moves it down, which hides the top as well and pushes a thin, soft strip out past the bottom edge. Swap the signs on the offset to move it to the top, or move the offset to X for a side shadow.

Next, click the **Layered** preset. It loads five layers with offsets of 1, 2, 4, 8 and 16 px, each with twice that much blur, all at 6% opacity:

```css
box-shadow:
  0 1px 2px rgba(0, 0, 0, 0.06),
  0 2px 4px rgba(0, 0, 0, 0.06),
  0 4px 8px rgba(0, 0, 0, 0.06),
  0 8px 16px rgba(0, 0, 0, 0.06),
  0 16px 32px rgba(0, 0, 0, 0.06);
```

Each layer is almost invisible on its own. Together they give a smooth fade that a single 32px shadow can't match. With several layers, the tool writes one per line so the code stays readable.

## Why does the code look shorter than the sliders?

The generator writes the shortest valid form. A zero length is written as `0` with no unit. If spread is zero it's left out, and if blur and spread are both zero, both are left out. That's why the Sharp preset becomes `box-shadow: 6px 6px #111827;`. Colors with an opacity below 100% become `rgba()`, so the transparency stays separate from the color you picked. At 100% the plain hex code is used.

## Where do shadows go wrong?

Animating `box-shadow` directly can be slow, because the browser repaints the blur on every frame. A common trick is to put the shadow on a pseudo-element and fade its opacity instead. And because a box shadow follows the box, it ignores transparent pixels inside an image. For those, `filter: drop-shadow()` traces the visible shape.

Shadows look best on a matching corner shape, so try the [border radius generator](/online-tool/developer-tools/border-radius-generator) next. For colors, the [color picker](/online-tool/color-tools/color-picker) gives you exact hex values to paste into the colour field.

## FAQ

### What's the difference between blur and spread?

Spread changes the shadow's size before blurring. Blur only softens its edge. They often work together, as in the one-sided example above.

### Can I use more than one shadow?

Yes. Separate them with commas. The first one in the list is painted on top. The generator handles up to eight.

### Does a shadow add to the element's size?

No. It takes no space in the layout and doesn't change the box size, even with a large spread.

Build and copy your own shadows in the [box shadow generator](/online-tool/developer-tools/box-shadow-generator).
