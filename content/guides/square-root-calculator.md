---
slug: how-simplifying-square-roots-works
tool: square-root-calculator
title: How Simplifying Square Roots Works, With Worked Examples
description: Why does √48 become 4√3? Learn what perfect squares, irrational roots and simplified radicals really are, with worked examples you can check.
tags: [Math, Calculators, Explainer]
---

A square root is the number that, multiplied by itself, gives the number you started with: √144 = 12 because 12 × 12 = 144. Most numbers are not perfect squares, so their roots are endless decimals. Simplifying a radical is a way to write those roots exactly by pulling every perfect-square factor outside the root sign, so √48 becomes 4√3.

This guide explains what is going on under the hood, so the output of the [Square Root Calculator](/online-tool/calculators/square-root-calculator) makes sense rather than looking like magic.

## What makes a number a perfect square?

A perfect square is a whole number whose square root is also a whole number: 1, 4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144 and so on. Enter 144 and the calculator answers **12**, with **Perfect square?** showing "Yes — 12² = 144".

Enter 150 and you get 12.2474487139 and "No". There is no whole number between 12 and 13, so √150 can't be one.

What about 2.25? Its root is exactly 1.5, but the calculator still says **No**, because the term "perfect square" is reserved for whole-number roots. The decimal answer is exact, it just isn't an integer.

## Why do roots have so many decimals?

The square root of any whole number that isn't a perfect square is irrational: its decimal expansion never ends and never repeats. √2 is 1.4142135624 as displayed, but the digits go on forever. The calculator shows up to 14 significant digits and adds a **Check** line, such as "1.414213562² ≈ 2", so you can see that squaring the rounded answer lands back on your number.

That is exactly why simplified radicals exist. Writing 4√3 instead of 6.9282032303 keeps the value exact.

## How does simplifying a radical work?

The rule behind it is that the root of a product equals the product of the roots: √(a × b) = √a × √b. So if you can split the number into a perfect square times something else, the perfect square comes out as a whole number.

Take 48:

1. Find the largest perfect square that divides it. 48 = 16 × 3.
2. Take the root of that square: √16 = 4.
3. Leave the rest inside: √48 = **4√3**.

The calculator does this by testing every candidate factor and dividing it out as many times as it fits, which means it always finds the largest one. A few more results it produces:

| Number | Root | Simplified radical |
| --- | --- | --- |
| 18 | 4.2426406871 | 3√2 |
| 50 | 7.0710678119 | 5√2 |
| 128 | 11.313708499 | 8√2 |
| 150 | 12.2474487139 | 5√6 |
| 200 | 14.1421356237 | 10√2 |

A common slip is stopping too early. 200 = 4 × 50 gives 2√50, which is correct but not finished, since 50 still contains 25. Dividing out every square gives 10√2.

## Why simplified radicals are useful

Simplified forms let you combine roots the way you combine like terms in algebra. √18 + √50 looks messy, but it is 3√2 + 5√2, which is 8√2. The table above confirms it: 4.2426406871 + 7.0710678119 matches the 11.313708499 shown for √128, and √128 simplifies to 8√2.

Teachers ask for simplified radicals for the same reason they ask for fractions in lowest terms: there is exactly one simplest form, so answers can be compared at a glance.

## Cube roots and higher roots

The same idea works for any root, using perfect cubes (8, 27, 64, 125…) or higher powers instead of squares. Choose **Cube root (∛)** or **nth root** in the **Root** menu, then set **n** for the latter (any whole number from 2 to 100).

- ∛1,000 = **10**, a perfect cube.
- ∜80 = 2.9906975624, simplified to **2∜5** because 80 = 16 × 5 and 16 is 2⁴.
- ⁵√32 = **2**, a perfect 5th power.

## What about negative numbers?

Here even and odd roots behave differently:

- **Odd roots of negatives are real.** ∛−54 = −3.7797631497, simplified to **−3∛2**. A negative number multiplied by itself three times stays negative.
- **Even roots of negatives are not real numbers.** For a square root, the calculator gives the imaginary answer instead: √−50 = **7.0710678119i**, with a note that i² = −1. For a 4th, 6th or other even root, it reports "No real root".

## How to use the calculator

1. Type your value in the **Number** field.
2. Pick **Square root (√)**, **Cube root (∛)** or **nth root** from the **Root** menu, and set **n** if needed.
3. Read the root, the perfect-power answer, the simplified radical when one exists, and the check line. The results update as you type.

Simplified radicals are only shown for whole numbers up to one trillion, and only when there is something to pull out. √2 or √0.5 (0.7071067812) have no simpler form, so that line is skipped. To go the other way and raise a number to a power, use the [Exponent Calculator](/online-tool/calculators/exponent-calculator).

## FAQ

### Is √48 the same as 48 to the power of 0.5?

Yes. A square root is the exponent 1/2 (and a cube root is 1/3). √48 and 48^0.5 both come out as 6.9282032303, but only the root calculator also gives you the simplified radical 4√3.

### Why does a square root have two answers?

Both 12 and −12 square to 144. By convention, the √ symbol means the positive one, called the principal root, which is what the calculator shows. When solving an equation like x² = 144, remember to write x = ±12.

### Can I simplify a radical that has a coefficient already, like 3√12?

Simplify the root first, then multiply. √12 simplifies to 2√3, so 3√12 is 3 × 2√3 = 6√3.

Try any number in the [Square Root Calculator](/online-tool/calculators/square-root-calculator).
