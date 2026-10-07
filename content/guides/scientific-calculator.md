---
slug: why-calculators-disagree-order-of-operations-explained
tool: scientific-calculator
title: 'Why Calculators Disagree: Order of Operations Explained'
description: 'Is 2^3^2 equal to 64 or 512? Why is -2^2 negative? Learn the precedence rules a scientific calculator follows and how to type expressions it reads correctly.'
tags: [Math, Calculators, Explainer]
---

Two calculators can show different answers for the same keystrokes because they apply different rules about which operation comes first. A scientific calculator that reads a whole expression follows standard precedence: parentheses, then powers, then multiplication and division, then addition and subtraction. Once you know the few places where those rules surprise people, you can type any expression and trust the result.

## What order does a scientific calculator use?

The [Scientific Calculator](/online-tool/calculators/scientific-calculator) evaluates expressions with these levels, from strongest to weakest:

| Level | Operations                                                      | Groups        |
| ----- | --------------------------------------------------------------- | ------------- |
| 1     | Parentheses and functions such as `sin( )`, `log( )`, `sqrt( )` | inside out    |
| 2     | Powers `^`                                                      | right to left |
| 3     | A leading minus sign (negation)                                 |               |
| 4     | `×`, `÷` and `mod`                                              | left to right |
| 5     | `+` and `−`                                                     | left to right |

The postfix operators `!` (factorial) and `%` apply directly to the number in front of them before anything else touches it.

## Five expressions that trip people up

**1. Stacked powers: `2^3^2` = 512, not 64.** Powers group from the right, so this means 2^(3^2) = 2^9 = 512. If you want 64, write `(2^3)^2`. This matches the convention in mathematics, where a tower of exponents is read from the top down.

**2. Negative squares: `-2^2` = −4.** The power is applied first, then the minus sign: −(2²). To square negative two, type `(-2)^2`, which gives 4. This one matters in physics and statistics formulas where a squared term is supposed to stay positive.

**3. Implicit multiplication: `6/2(1+2)` = 9.** The calculator inserts a multiplication sign between a number and a parenthesis, so `2π` and `3(4+1)` work as you would write them on paper. That makes `6/2(1+2)` the same as 6 ÷ 2 × 3, which is evaluated left to right: 3 × 3 = 9. Some textbooks treat implied multiplication as binding tighter and would get 1. The safe habit is to add parentheses so nobody has to guess: `6/(2(1+2))`.

**4. Percent: `200*15%` = 30, but `200+15%` = 200.15.** Here `%` simply divides the number before it by 100, so 15% is 0.15. Multiplying works as expected. Adding does not do the "plus 15 percent" shortcut that some pocket calculators have. For a price increase, type `200*(1+15%)` or `200*1.15`, both of which give 230. For everyday percentage questions, the [Percentage Calculator](/online-tool/calculators/percentage-calculator) labels each case for you.

**5. Chained division: `8/2/2` = 2.** Division groups from the left: (8 ÷ 2) ÷ 2. It is not 8 ÷ (2 ÷ 2) = 8.

## Degrees or radians?

Trigonometry depends on the angle unit, and this is the single most common source of "wrong" answers. In DEG mode, `sin(30)` is 0.5. Switch to RAD and the same keystrokes return −0.98803162409286, because 30 radians is a very different angle. The toggle sits in the top-left corner of the display.

Use degrees for geometry, construction and navigation. Use radians for calculus, physics formulas and anything involving `π` directly, such as `sin(pi/6)`, which is 0.5 in RAD mode. If you need to convert an angle on its own, the [Angle Converter](/online-tool/unit-converters/angle-converter) does it.

The inverse functions `sin⁻¹`, `cos⁻¹` and `tan⁻¹` answer in the current unit too: `asin(0.5)` returns 30 in DEG mode.

## Why some inputs show an error

The calculator reports an error instead of printing a misleading number:

- `tan(90)` in degrees: tangent is undefined there, because cos(90°) is zero.
- `sqrt(-4)`: there is no real square root of a negative number. `cbrt(-8)` works and gives −2.
- `log(0)` or `ln(-1)`: logarithms need a positive input.
- `1/0`: division by zero.
- `sin 30`: functions need parentheses, so type `sin(30)`.

Very large results switch to scientific notation. `170!` is shown as 7.2574156153e+306, and `171!` exceeds what the number format can hold, so it shows ∞.

## Small details that save time

- `log` is base 10 and `ln` is base e: `log(1000)` = 3 and `ln(e)` = 1. There is also `log2( )` if you type it: `log2(1024)` = 10.
- Results are rounded to 14 significant digits, so `0.1+0.2` shows a clean 0.3 instead of floating-point noise.
- `mod` gives a non-negative remainder for a positive divisor: `17 mod 5` = 2 and `-7 mod 3` = 2.
- Extra functions you can type include `abs`, `exp`, `floor`, `ceil`, `round`, `min`, `max`, `nroot(x, n)`, and the constants `tau` and `phi`.

## How to use the calculator step by step

1. Type an expression in the display, such as `sqrt(3^2+4^2)`, or tap the buttons. A live preview of the result appears as you type.
2. Check DEG or RAD before any trigonometry.
3. Press `=` or Enter. The result moves into **Ans**, and the expression and result are added to the **History** panel.
4. Reuse a result by tapping **Ans**, or click any line in the history to insert that value. Escape clears the current line; `⌫` deletes one character; **AC** clears everything.

For example, compound growth of 1,000 at 5% for 10 years is `1000*(1+0.05)^10`, which returns 1628.8946267774. Expressions are parsed by the page itself rather than executed as code, and nothing you type is sent anywhere.

## FAQ

### Why does my phone calculator give a different answer?

Basic calculators often apply each operation the moment you press it, without precedence. Typing 2 + 3 × 4 on one of those can give 20 instead of 14. A scientific calculator that sees the whole expression gives 14.

### How do I enter a root other than square root?

Use `nroot(x, n)`, for example `nroot(27, 3)` = 3, or raise to a fractional power: `27^(1/3)`.

### Does the history survive a page reload?

No. The history and Ans value live in the open page only and reset when you reload it.

Try the examples above in the [Scientific Calculator](/online-tool/calculators/scientific-calculator).
