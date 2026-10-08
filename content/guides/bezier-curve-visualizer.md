---
slug: how-bezier-curves-work-de-casteljau-step-by-step
tool: bezier-curve-visualizer
title: How Bézier Curves Work, with B(t) Calculated Step by Step
description: The Bernstein formula and de Casteljau's algorithm explained with real numbers, plus how a cubic Bézier becomes an SVG path or a CSS cubic-bezier().
tags: [Bezier Curves, Geometry, SVG]
---

A Bézier curve is a smooth curve defined by a few control points. It starts at the first point, ends at the last, and is pulled toward the points in between. Any point on it, B(t), is a weighted average of the control points, where t runs from 0 at the start to 1 at the end. You can compute it with the Bernstein formula or by repeatedly splitting lines with de Casteljau's algorithm, and both give the same answer.

Below, we compute one point on the default cubic curve of the [Bézier curve visualizer](/online-tool/reference-tools/bezier-curve-visualizer) by hand, so you can check every number the tool shows.

## What do the control points do?

A curve of degree n has n + 1 points. The tool offers three degrees:

- **Linear (2 points):** a straight line from P₀ to P₁.
- **Quadratic (3 points):** one inner control point, P₁. SVG writes this as `Q`.
- **Cubic (4 points):** two inner control points, P₁ and P₂. This is the curve behind SVG `C`, font outlines, and the pen tool in most design apps.

On the canvas, filled circles are end points and hollow circles are control points. The end points always lie on the curve. The inner points usually don't. They act like magnets: the curve leaves P₀ heading toward P₁ and arrives at the last point coming from the direction of the point before it. That rule explains why lining up the handles on both sides of a joint gives a smooth connection between two curves.

## The Bernstein formula

For a cubic curve, the formula is:

B(t) = (1−t)³·P₀ + 3(1−t)²t·P₁ + 3(1−t)t²·P₂ + t³·P₃

The four coefficients are Bernstein polynomials. Their pattern 1, 3, 3, 1 comes from the binomial coefficients C(3, i), the same numbers as row 3 of Pascal's triangle. For any t between 0 and 1 the four weights are non-negative and add up to exactly 1. That's why the curve always stays inside the convex hull of its control points.

The quadratic version is B(t) = (1−t)²·P₀ + 2(1−t)t·P₁ + t²·P₂, and the linear one is simply (1−t)·P₀ + t·P₁. The tool prints the formula for whichever degree you pick.

## Worked example: B(0.5) on the default cubic

The cubic opens with these points, in SVG units on a 400 × 300 canvas where y grows downward:

| Point | x   | y   |
| ----- | --- | --- |
| P₀    | 40  | 260 |
| P₁    | 110 | 40  |
| P₂    | 300 | 40  |
| P₃    | 360 | 260 |

The t slider starts at 0.5. At t = 0.5, both (1−t) and t equal 0.5, so the weights are:

- (0.5)³ = 0.125
- 3 × (0.5)² × 0.5 = 0.375
- 3 × 0.5 × (0.5)² = 0.375
- (0.5)³ = 0.125

Apply them to each axis separately:

- x = 0.125×40 + 0.375×110 + 0.375×300 + 0.125×360 = 5 + 41.25 + 112.5 + 45 = **203.75**
- y = 0.125×260 + 0.375×40 + 0.375×40 + 0.125×260 = 32.5 + 15 + 15 + 32.5 = **95**

The formula panel shows exactly these lines, for example `x(0.5) = 0.125×40 + 0.375×110 + 0.375×300 + 0.125×360 = 203.75`. The "At t = 0.5" box rounds to one decimal and shows B(t) = (203.8, 95). The copyable code panel keeps two decimals: `B(0.5) = (203.75, 95)`.

Notice that t = 0.5 isn't the horizontal midpoint between 40 and 360, which would be 200. P₂ sits farther right than P₁ sits from P₀, so the curve's middle is pulled to the right.

Move the slider to 0.25 and the weights become 0.422, 0.422, 0.141 and 0.016 (rounded), giving B(0.25) = (111.09, 136.25).

## The same point with de Casteljau's algorithm

de Casteljau's method gets the same point with nothing but "go a fraction t along this line." At t = 0.5, that means taking midpoints:

1. **Level 1:** split the three edges of the control polygon. P₀P₁ gives (75, 150), P₁P₂ gives (205, 40), P₂P₃ gives (330, 150).
2. **Level 2:** split the two new lines. You get (140, 95) and (267.5, 95).
3. **Level 3:** split that last line. You get (203.75, 95), which is B(0.5) again.

The visualizer draws each level in its own color and lists them as "Level 1: 3 points", "Level 2: 2 points" and "Level 3: 1 point — the curve point". The red line at the last level is the tangent. Here both of its ends have y = 95, so the curve is moving perfectly horizontally at t = 0.5, which matches the symmetric y values of the control points.

Press **▶ Play** to sweep t from 0 to 1 over three seconds in a loop, with the traced part of the curve drawn darker. If your system has reduced motion turned on, the point jumps in steps of 0.1 twice a second instead of gliding.

## Getting an SVG path or CSS timing function

The code panel gives you an SVG path for the current points. For the default cubic, that's `<path d="M 40 260 C 110 40 300 40 360 260" />`. Quadratics use `Q` and linear curves use `L`. To keep editing longer shapes made of many segments, move to the [SVG path editor](/online-tool/developer-tools/svg-path-editor).

For cubics, the tool also tries to express the curve as a CSS `cubic-bezier()` timing function. CSS timing curves fix the start at (0, 0) and the end at (1, 1), so the tool rescales your curve to that box and flips the y axis, because screens count y downward while timing graphs go up. That only works when the end points differ in both x and y and both control points sit between them horizontally.

The default curve fails the first test: P₀ and P₃ share y = 260, so the tool shows "No CSS cubic-bezier() equivalent". Change P₃ to (360, 40) and the code panel adds `transition-timing-function: cubic-bezier(0.22, 1, 0.81, 1);`, a strong ease-out that does most of its movement early.

## FAQ

### Why are the points unevenly spaced when I play the animation?

Equal steps in t aren't equal distances along the curve. The point moves faster on long, gently curved stretches and slower where the curve bends tightly.

### Can I place points precisely?

Yes. Type x and y values in the Control points panel, or Tab to a point and use the arrow keys. Shift moves 10 units. Coordinates stay within 0–400 for x and 0–300 for y.

### Does Reset clear every degree?

No. **Reset** restores the default points for the current degree only and sets t back to 0.5.

Open the [Bézier curve visualizer](/online-tool/reference-tools/bezier-curve-visualizer), drag P₁ around, and watch the weights and B(t) update.
