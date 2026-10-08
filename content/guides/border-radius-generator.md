---
slug: css-border-radius-shorthand-and-blob-shapes
tool: border-radius-generator
title: How Does border-radius Make Pills, Circles and Blobs?
description: How the border-radius shorthand assigns corners, what the slash does, why 50% makes a circle and 9999px a pill, and how blob shapes are built.
tags: [CSS, Web Design, Front End]
---

`border-radius` rounds each corner of a box with a curve. With one value, every corner gets the same quarter circle. With up to four values, they go clockwise from the top left. A slash adds a second set of radii, so each corner can be a quarter ellipse instead. That second set is what turns a plain box into a pill, an egg or a soft blob. For example, `border-radius: 50%` turns a square into a circle.

This guide covers the shorthand, the slash and the scaling rule that makes pills work. Then it builds a blob in the [border radius generator](/online-tool/developer-tools/border-radius-generator).

## How are the four values assigned?

The property is defined in the W3C's CSS Backgrounds and Borders Module Level 3. The corners always run clockwise from the top left: top-left, top-right, bottom-right, bottom-left. Shorter lists fill in the missing corners from the opposite ones:

| Written               | Top-left | Top-right | Bottom-right | Bottom-left |
| --------------------- | -------- | --------- | ------------ | ----------- |
| `10px`                | 10px     | 10px      | 10px         | 10px        |
| `10px 20px`           | 10px     | 20px      | 10px         | 20px        |
| `10px 20px 30px`      | 10px     | 20px      | 30px         | 20px        |
| `10px 20px 30px 40px` | 10px     | 20px      | 30px         | 40px        |

The generator always writes the shortest form that expands back to your corners. Four equal corners become one value. If the bottom-left matches the top-right, the fourth value is dropped. If the bottom-right also matches the top-left, only two remain. Zero is written as `0` without a unit. So setting the corners to 24, 24, 0 and 0 px gives `border-radius: 24px 24px 0 0;`, the shape the Ticket tab preset uses.

## What does the slash mean?

Each corner really has two radii, one horizontal and one vertical. Without a slash, they're equal and the corner is a quarter circle. With a slash, the values before it set the horizontal radii and the values after it set the vertical ones, using the same clockwise order. Then each corner becomes a quarter ellipse.

Percentages make this matter even when you don't write a slash. A horizontal radius in percent is measured against the box's width, and a vertical one against its height. On a 260 × 180 px box, `border-radius: 10%` gives corners 26px wide and 18px tall. On a square, `50%` makes a circle. On a rectangle, it makes an ellipse.

## Why does 9999px make a perfect pill?

The specification has a rule for radii that are too big. If the two radii along one side add up to more than that side's length, the browser scales all the radii down by the same factor until they fit. So a huge value like 9999px shrinks to exactly half the shorter side. The ends become perfect semicircles and the long sides stay straight, whatever the element's width. That's why the Pill preset uses 9999px instead of 50%. On a wide button, `50%` would give an oval rather than a pill.

## How do I use the generator?

The preview shows a gradient box with white handles on its edges. Drag a handle along the edge to change that corner. You can also Tab to a handle and use the arrow keys, holding Shift for steps of 10. On the left, you'll find a slider and a number box for each radius. The slider goes up to 300 px or 100%, and the number box accepts up to 9999 in px.

**Link all corners** is on by default, so one slider controls all four. Untick it to set each corner on its own. **Elliptical corners (separate horizontal and vertical radii)** adds a second set of controls and a second handle on each corner, so you can set the slash part. **Unit** switches between px and %. **Preview shape** offers Landscape (260 × 180), Square (220 × 220) and Portrait (180 × 250). The presets are Rounded, Pill, Circle, Blob, Leaf, Drop, Egg and Ticket tab, and **Reset** returns to 24px corners on the landscape box.

When you switch units, the generator converts the values so the shape stays about the same. Horizontal radii are converted against the box width. Starting from the default 24px on the landscape box, switching to % gives `border-radius: 9%;`, since 24 ÷ 260 is about 9%. The corners now come out 23.4px wide but only 16.2px tall, because the vertical radius is measured against the 180px height.

## Worked example: a blob and an egg

Click **Blob**. The tool switches to % and turns on elliptical corners. Then it writes:

```css
border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
```

Read it corner by corner. The top-left is 30% wide and 30% tall, a small round corner. The top-right is 70% wide but only 30% tall, a long, flat curve. The bottom-right is 70% by 70%, and the bottom-left is 30% wide and 70% tall. Along the top edge, 30% + 70% adds up to exactly 100%, so the two curves meet and leave no straight line. The result is an irregular, organic shape. Drag any handle and the blob reshapes live.

Now click **Egg**. All horizontal radii are 50%, while the vertical ones are 60% at the top and 40% at the bottom:

```css
border-radius: 50% / 60% 60% 40% 40%;
```

The horizontal part collapses to a single value because all four corners match. The vertical part keeps all four, because the bottom-left (40%) differs from the top-right (60%). The taller top curves give the egg its narrow end. If both halves of the slash come out identical, the tool leaves out the slash entirely.

## Where else do rounded corners matter?

The radius also shapes `box-shadow`, outlines in current browsers, and the area where backgrounds are painted. It doesn't change the layout box, and content that overflows still sticks out unless you set `overflow: hidden`. For shapes a radius can't make, such as stars, arrows or hexagons, use the [clip-path generator](/online-tool/developer-tools/clip-path-generator). To give a rounded card some depth, pair it with the [box shadow generator](/online-tool/developer-tools/box-shadow-generator).

## FAQ

### Why did my four values turn into two?

Because they matched in pairs. If the top-left equals the bottom-right and the top-right equals the bottom-left, two values say the same thing.

### Should I use px or %?

Use px when you want the same corner size on every element, as with cards and buttons. Use % when the curve should scale with the box, as with circles and blobs.

### Can a radius be negative?

No. Negative values are invalid, and the generator's controls start at 0.

Shape your own corners in the [border radius generator](/online-tool/developer-tools/border-radius-generator).
