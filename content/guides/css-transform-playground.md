---
slug: css-transform-order-origin-and-matrix
tool: css-transform-playground
title: Does CSS Transform Order Matter? Rotate, Scale and matrix()
description: How translate, rotate, scale and skew combine, why their order changes the result, what transform-origin does, and how a list becomes one matrix().
tags: [CSS, Front End, Animation]
---

Yes, the order matters. CSS applies transform functions from left to right, and each one works in the coordinate system the previous one left behind. `translate(50px) rotate(45deg)` moves the element 50 pixels right and then turns it in place. `rotate(45deg) translate(50px)` turns it first and then moves it 50 pixels along the tilted axis, so it ends up down and to the right. However long the list, the browser reduces it to a single matrix.

This guide explains the four 2D functions, the origin and the matrix behind them. Then it decodes a real result from the [CSS transform playground](/online-tool/developer-tools/css-transform-playground).

## What do the four functions do?

The 2D functions are defined in the W3C's CSS Transforms Module Level 1, and the 3D ones in Level 2.

- `translate(x, y)` moves the element. Positive values go right and down.
- `rotate(angle)` turns it clockwise for positive angles.
- `scale(sx, sy)` resizes it. A value of 1 keeps the size, 2 doubles it, and −1 mirrors it.
- `skew(ax, ay)` slants it. `skewX(20deg)` tilts the vertical edges by 20°.

A transform changes how the element is painted, not where the layout puts it. Neighboring elements don't move, and the space the element took up stays reserved. This is also why transforms are the usual choice for animation. Browsers can often move a transformed layer without recalculating the page layout, while changing `top` or `left` triggers layout work on every frame.

## What does transform-origin change?

Rotation, scaling and skewing all happen around a fixed point, the transform origin. It defaults to the center of the element, `50% 50%`. Set `transform-origin: left top` and a rotation swings the element around its top-left corner like a door on a hinge. Translation is the one function the origin doesn't affect, because moving is the same from any point.

## How does a transform list become a matrix?

Every 2D transform can be written as `matrix(a, b, c, d, e, f)`. The first four numbers describe the rotation, scale and skew together. The last two are the translation in pixels. A point (x, y) on the element is moved to (a·x + c·y + e, b·x + d·y + f), measured from the transform origin.

For a plain rotation by θ, the matrix is (cos θ, sin θ, −sin θ, cos θ, 0, 0). Scaling multiplies those first four numbers by the scale factor. A skew of α along X sets c to tan α. The browser multiplies the matrices of all the functions in order and draws the element with the result. 3D transforms do the same with a 4 × 4 matrix, written as `matrix3d()` with 16 numbers.

## How do I use the playground?

The preview shows a gradient **Box** over a grid. The dashed outline marks where the box would be without any transform, and the red dot marks the transform origin. You can work with the mouse, the keyboard or the sliders:

- Drag the box to translate it, or Tab to it and use the arrow keys. Each press moves 1px, or 10px with Shift.
- Drag the **↻** handle above the box to rotate it. Focused, it turns 1° per arrow key, or 15° with Shift.
- Use the **Move** sliders for **Translate X** and **Translate Y**, which go from −240 to 240 px.
- Under **Rotate & scale**, set **Rotate** from −180° to 180°. With **Same scale for X and Y** ticked, one **Scale** slider runs from 0.1 to 3. Untick it to get separate **Scale X** and **Scale Y** sliders from −3 to 3, which allow mirroring.
- Set **Skew X** and **Skew Y** from −60° to 60°.
- Pick a **Transform origin** from the 3 × 3 grid, or type **X %** and **Y %** values from −100 to 200.
- Tick **3D rotation (adds perspective)** to get **Perspective** (100 to 2000 px), **Rotate X** and **Rotate Y**.

The CSS only lists the functions you changed, in a fixed order: `perspective()`, translate, `rotateX()`, `rotateY()`, `rotate()`, scale, then skew. It uses the shortest names it can, such as `translateX()` when only X moved, or `scale(1.5)` when both axes match. A `transform-origin` line appears only when you move the origin away from the center, written as keywords like `left top` where possible. **🎲 Randomize** creates an example to study, and **Reset** clears everything.

## Worked example: decoding a matrix

Set **Translate X** to 40, **Translate Y** to 20, **Rotate** to 30 and **Scale** to 1.5. The **Generated CSS** panel shows:

```css
transform: translate(40px, 20px) rotate(30deg) scale(1.5);

/* Same as one matrix: */
transform: matrix(1.299038, 0.75, -0.75, 1.299038, 40, 20);
```

Check it against the formula. The cosine of 30° is about 0.866025, and its sine is 0.5. Scaling by 1.5 gives a = d = 1.5 × 0.866025 = 1.299038, b = 1.5 × 0.5 = 0.75, and c = −0.75. The translation came first in the list, so it isn't rotated or scaled and shows up unchanged as e = 40 and f = 20. Matrix values are rounded to six decimals.

Now set everything back with **Reset** and try **Skew X** at 20°. The matrix becomes `matrix(1, 0, 0.36397, 1, 0, 0)`, because tan 20° ≈ 0.36397. Only the c value changes. That's the horizontal shift each point gets per pixel of height.

## Why does my 3D rotation look flat?

Without perspective, the browser projects a 3D rotation straight onto the screen. A box turned 45° around its Y axis just looks narrower. Perspective adds depth: things further away appear smaller. The playground puts `perspective()` at the start of the list whenever **Rotate X** or **Rotate Y** isn't zero. With **Perspective** at 600 and **Rotate Y** at 45, it writes `transform: perspective(600px) rotateY(45deg);`. The matrix line then switches to `matrix3d()`, since the result no longer fits in six numbers. A smaller perspective value means a stronger, closer-looking effect.

Transforms pair well with shape tools. Cut the box into a star with the [clip-path generator](/online-tool/developer-tools/clip-path-generator), or add depth with the [box shadow generator](/online-tool/developer-tools/box-shadow-generator).

## FAQ

### Why is rotate before translate different?

Because the rotation turns the axes that the translation then moves along. `rotate(90deg) translateX(50px)` moves the element 50px down, not right.

### Does transform affect layout?

No. The element keeps its original space, and other elements don't move. Only the painted result changes.

### Why does the tool always use the same order?

So the output is predictable: move, then rotate, then scale and skew. If you need a different order, edit the copied CSS by hand.

Experiment with your own transforms in the [CSS transform playground](/online-tool/developer-tools/css-transform-playground).
