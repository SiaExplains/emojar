---
slug: degrees-vs-radians-when-to-use-each-angle-unit
tool: angle-converter
title: 'Degrees vs Radians (and Gradians): When to Use Each'
description: 'Why does sin(90) give 0.894 in code? Learn when to use degrees, radians, gradians and arcminutes, how to convert between them and the mistakes to avoid.'
tags: [Math, Units, Programming]
---

Use **degrees** for everyday angles, maps and construction, and **radians** for math, physics and almost all programming languages. The link between them is that a full circle is **360° = 2π radians**, so to convert degrees to radians you multiply by π/180, and 90° = π/2 ≈ **1.5708 rad**. One radian is about **57.2958°**.

The other units, gradians, arcminutes, arcseconds and turns, each have a niche. Here is when to use which, and the bugs that come from picking the wrong one.

## How do the angle units compare?

| Unit          | Full circle | Right angle  | Where you'll see it                    |
| ------------- | ----------- | ------------ | -------------------------------------- |
| Degree (°)    | 360         | 90           | Everyday use, navigation, construction |
| Radian (rad)  | 2π ≈ 6.2832 | π/2 ≈ 1.5708 | Math, physics, programming             |
| Gradian (gon) | 400         | 100          | Surveying in some countries            |
| Arcminute (′) | 21,600      | 5,400        | Coordinates, optics, shooting          |
| Arcsecond (″) | 1,296,000   | 324,000      | Astronomy, precision surveying         |
| Turn          | 1           | 0.25         | Rotation counts, animation             |

## Why do radians exist?

A radian is the angle at which the arc length equals the radius. That makes formulas clean: the length of an arc is simply radius × angle, and the derivative of sin(x) is cos(x) only when x is in radians. That's why calculus, physics and programming libraries use them.

Handy values to remember:

| Degrees | Radians      |
| ------- | ------------ |
| 30°     | π/6 ≈ 0.5236 |
| 45°     | π/4 ≈ 0.7854 |
| 90°     | π/2 ≈ 1.5708 |
| 180°    | π ≈ 3.1416   |
| 360°    | 2π ≈ 6.2832  |

## Pitfall 1: Passing degrees to a trig function

In JavaScript, Python, C, Java and most other languages, `sin`, `cos` and `tan` expect radians. Ask for `sin(90)` and you get about **0.894**, the sine of 90 _radians_, not 1. Convert first: `sin(90 * π / 180)` returns 1.

The reverse bug happens with functions like `atan2`, which return radians. Multiply by 180/π before showing the result to users: an output of 1.5 rad is **85.94°**.

## Pitfall 2: Calculator in the wrong mode

Scientific calculators have DEG, RAD and often GRAD modes. A student who gets a strange answer for cos(60) (it should be 0.5) is usually in radian mode. A quick sanity check: sin(30°) = 0.5 exactly.

## Pitfall 3: Mixing up gradians and degrees

Gradians (also called gons) divide a right angle into 100 parts, so 100 grad = **90°** and 3° = **3.33 grad**. They are mainly used in surveying in some European countries. If a surveying instrument's numbers look about 11% too big, it is probably set to gradians.

## Arcminutes and arcseconds in practice

A degree splits into 60 arcminutes, and an arcminute into 60 arcseconds, so 1° = 60′ = **3,600″**. Small as they are, these units matter:

- **Navigation:** one arcminute of latitude is about one nautical mile, which is how the nautical mile was originally defined.
- **Shooting and optics:** "minute of angle" (MOA) is one arcminute, about 0.000291 rad. At 100 yards, 1 MOA covers about **1.047 inches**, which is why scope adjustments are often described as "about an inch at 100 yards".
- **Astronomy:** the full Moon spans roughly 30 arcminutes, or half a degree.

Converting 2.5′ to degrees gives **0.0417°**. GPS coordinates written as degrees, minutes and seconds can be converted to decimal degrees the same way: add minutes ÷ 60 and seconds ÷ 3,600.

## Turns

A turn is one full rotation: 1 turn = 360° = 2π rad. It is convenient for describing spins and animation: 2 radians is about **0.318 turns**, and 15° is exactly 1/24 of a turn (**0.0417**), the angle Earth rotates in one hour.

## How to use the Angle Converter

The [Angle Converter](/online-tool/unit-converters/angle-converter) handles all six units:

1. Enter the angle in **Value**. Decimals and negative angles are fine.
2. Pick **From** and **To**: degree, radian, gradian, arcminute, arcsecond or turn. Press ⇄ to swap.
3. Read the result, or check the table that shows the angle in every unit, handy when you need both degrees and radians for the same value.

Results show up to 10 significant digits, so 90° appears as 1.570796327 rad. The copy button gives a plain number to paste into code.

## What it doesn't do

The converter doesn't handle **slope percentages** (rise over run × 100), which are a ratio rather than an angle unit: a 100% slope is 45°, not 100°. It also doesn't rotate images; for that, use the [Image Rotator](/online-tool/image-tools/image-rotator).

## FAQ

### Is π radians exactly 180 degrees?

Yes, by definition. Any decimal value of π is a rounding of that exact relationship.

### Why does 57.2958° convert to 1.000000358 rad?

Because 57.2958 is itself rounded. One radian is 57.29577951…°, and the converter shows the small difference that rounding introduces.

### How do I convert degrees-minutes-seconds to decimal degrees?

Convert the minutes and seconds to degrees separately and add them. 40° 30′ 36″ = 40 + 0.5 + 0.01 = 40.51°.

Convert between degrees, radians, gradians and more with the [Angle Converter](/online-tool/unit-converters/angle-converter).
