---
slug: read-and-edit-svg-path-d-commands
tool: svg-path-editor
title: 'Reading SVG Path Data: M, L, C, Q, A and Z Commands Decoded'
description: What each letter in an SVG path d attribute means, how relative and shorthand commands expand, and how to edit a pasted path visually.
tags: [SVG, Vector Graphics, Web Development]
---

An SVG path's `d` attribute is a compact list of drawing commands: a letter, then numbers. `M` moves the pen, `L` draws a straight line, `Q` and `C` draw Bézier curves, `A` draws an elliptical arc and `Z` closes the shape. Uppercase letters use absolute coordinates, lowercase letters are relative to the current pen position, and `H`, `V`, `S` and `T` are shorthands. Once you can read those letters, you can fix an icon by hand.

The [SVG path editor](/online-tool/developer-tools/svg-path-editor) turns any `d` string into draggable points and writes it back as clean absolute commands. Here's how the format works and what the editor does with it.

## What does each path command mean?

The path syntax is defined in the SVG specification (SVG 1.1 and SVG 2, "Paths" chapter). Every command takes a fixed number of numbers:

| Command | Name                  | Numbers | Meaning                                                   |
| ------- | --------------------- | ------- | --------------------------------------------------------- |
| M       | move to               | 2       | Lift the pen and start a new subpath at x, y              |
| L       | line to               | 2       | Straight line to x, y                                     |
| H / V   | horizontal / vertical | 1       | Line that changes only x or only y                        |
| Q       | quadratic Bézier      | 4       | One control point, then the end point                     |
| T       | smooth quadratic      | 2       | Like Q, with the control point mirrored from the last one |
| C       | cubic Bézier          | 6       | Two control points, then the end point                    |
| S       | smooth cubic          | 4       | Like C, with the first control point mirrored             |
| A       | elliptical arc        | 7       | rx, ry, rotation, large-arc flag, sweep flag, x, y        |
| Z       | close path            | 0       | Straight line back to the subpath's start                 |

Commas and spaces are interchangeable. A command letter can also be followed by several sets of numbers. Extra pairs after `M` count as implicit line-tos, so `M 0 0 10 10` draws a line.

## Why convert relative and shorthand commands?

Relative commands and shorthands make paths shorter, but they're hard to edit. Moving one point in a relative path shifts everything after it, and an `S` curve's first handle isn't written anywhere. The editor expands every segment so each point has explicit coordinates you can drag:

- `H`, `V` and `L` all become `L`.
- `S` becomes `C`, with the missing control point computed by reflecting the previous curve's second handle through the current point.
- `T` becomes `Q` the same way.
- Arcs stay `A`, with editable **rx**, **ry**, **Rotate**, **Large arc** and **Sweep** fields when you select one.
- Lowercase commands are converted to absolute positions.

The SVG preview looks the same. Only the code changes.

## Worked example: expanding a smooth curve

The paste box's placeholder is a good test: `M 10 80 C 40 10, 65 10, 95 80 S 150 150, 180 80`. Paste it into **Paste path data (d attribute)** and press **Load path**. With **Decimals in output** set to 1, the **Path data (d)** panel shows:

`M 10 80 C 40 10 65 10 95 80 C 125 150 150 150 180 80`

Where did 125 150 come from? The first curve's second control point is (65, 10), and it ends at (95, 80). The smooth `S` command mirrors that handle through (95, 80): x = 2 × 95 − 65 = 125, and y = 2 × 80 − 10 = 150. Now the hidden handle is a diamond you can drag.

A relative example works the same way. `m10 10 h20 v20 z` becomes `M 10 10 L 30 10 L 30 30 Z`: start at (10, 10), go 20 right, then 20 down, then close. Arc flags written without spaces are handled too, so `M 10 10 a5 5 0 01 10 0` loads as `M 10 10 A 5 5 0 0 1 20 10`.

## How do I edit points and segments?

Circles on the canvas are end points and diamonds are Bézier control points. You can:

- **Drag** any point. With **Snap to grid** on (the default, 10-unit grid), points land on grid lines.
- **Tab** to a point and use the arrow keys. Each press moves one grid step when snapping is on, or 1 unit when it's off. Shift moves ten times as far. Delete removes that point's segment.
- **Type** exact x and y values in the side panel for the selected point.
- Zoom with the **＋** and **−** buttons, Ctrl/⌘ plus the scroll wheel, or a trackpad pinch. Drag empty space to pan, and press **Fit view** to get back.

To change the shape, pick a **New segment type** (Line, Quadratic, Cubic, Arc or Move) and press **Add at end** or **Insert after selected**. A new cubic arrives with its handles offset sideways so the bend is visible. **Delete selected** removes a segment, and **Close path (Z)** adds or removes the final `Z`. The segment list under these buttons shows each segment as code, so you can click a row to select it.

## Setting up the canvas for an icon

The editor starts with a 200 × 200 viewBox and a heart example. You can switch to the wave or star from **Reset to example**, or press **Clear** to start empty. For a 24 × 24 icon, set **viewBox width** and **viewBox height** to 24 (the range is 10 to 2,000), pick a **Grid size** of 1 unit, and leave snapping on so every point lands on a whole pixel.

The style fields set stroke color, fill (or **No fill**), stroke width, line cap and line join. The **SVG markup** panel uses these, and it leaves out the cap and join attributes when they're the SVG defaults (`butt` and `miter`). **Download SVG** saves the file as `path.svg`. If you're tidying an icon set, run the result through the [SVG optimizer](/online-tool/developer-tools/svg-optimizer). To see how a single curve's control points shape it, try the [Bézier curve visualizer](/online-tool/reference-tools/bezier-curve-visualizer).

## What do the error messages mean?

When a path can't be read, the editor tells you why instead of guessing:

- **"Path data must start with M (move to)."** Every path begins with a move.
- **"L needs 2 numbers but got 1 before the end."** A command is missing numbers.
- **"Unexpected “X” at position 9."** A character that isn't a command or number.
- **"Arc flags must be 0 or 1"** for an arc flag with any other value.

## FAQ

### Will rounding change my shape?

Only slightly. Output is rounded to 0–3 decimals. One decimal is plenty for a 200-unit canvas, while tiny icons drawn off-grid may need two.

### Can I edit a path with several subpaths?

Yes. Each `M` starts a new subpath, and you can add one with the Move segment type. Shapes with holes, like the letter O, use this.

### Does it handle transforms or other SVG elements?

No. It edits one path's `d` data. Transforms, groups and shapes like `<rect>` aren't read.

Paste a path from your own SVG into the [SVG path editor](/online-tool/developer-tools/svg-path-editor) and see each command as a point you can move.
