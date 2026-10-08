---
slug: dice-notation-explained-2d6-d20-and-4d6kh3
tool: dice-roller
title: 'Dice Notation Explained: 2d6, d20, 3d8+2 and 4d6kh3'
description: What NdS±M means, how keep-highest rolls like 4d6kh3 and advantage work, and the averages and odds behind the most common tabletop dice rolls.
tags: [Games, Random, Explainer]
---

Dice notation describes a roll in a few characters: **NdS** means roll N dice with S sides each, and a **+M** or **−M** on the end adds or subtracts a fixed modifier. So 2d6 is two six-sided dice added together, d20 is one twenty-sided die, and 3d8+2 is three eight-sided dice plus 2. Add **kh** or **kl** and you keep only the highest or lowest dice, which is how ability scores and advantage rolls work.

## Reading the parts of a roll

| Notation | Means                                | Possible range | Average     |
| -------- | ------------------------------------ | -------------- | ----------- |
| d20      | One 20-sided die (the 1 is optional) | 1–20           | 10.5        |
| 2d6      | Two 6-sided dice, added              | 2–12           | 7           |
| 3d8+2    | Three 8-sided dice plus 2            | 5–26           | 15.5        |
| 1d6−1    | One 6-sided die minus 1              | 0–5            | 2.5         |
| d%       | Percentile die, same as d100         | 1–100          | 50.5        |
| 4d6kh3   | Roll four d6, keep the highest three | 3–18           | about 12.24 |
| 2d20kl1  | Roll two d20, keep the lowest        | 1–20           | about 7.18  |

The average of a single die is (1 + S) ÷ 2. For several dice, multiply by N and add the modifier: 3d8+2 averages 3 × 4.5 + 2 = 15.5.

## Why 2d6 isn't like 1d12

Both can produce numbers up to 12, but they behave very differently. On a d12, every result from 1 to 12 is equally likely. With 2d6, there are 36 equally likely combinations, and many more of them add up to middle values:

| Total | 2   | 3   | 4   | 5   | 6   | 7   | 8   | 9   | 10  | 11  | 12  |
| ----- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Ways  | 1   | 2   | 3   | 4   | 5   | 6   | 5   | 4   | 3   | 2   | 1   |

A 7 comes up 6 times in 36 (1 in 6). A 2 or a 12 comes up only once in 36. That's why many board games built on two dice treat 6, 7 and 8 as the common rolls, and why adding more dice to a roll makes the results cluster more tightly around the average.

## How do keep-highest and keep-lowest work?

**kh** keeps the highest dice and drops the rest. **kl** keeps the lowest. The number after it says how many to keep.

**Ability scores (4d6kh3).** Many tabletop RPG groups roll four six-sided dice and drop the lowest. Rolling 5, 2, 6 and 3 keeps 6 + 5 + 3 = 14. Dropping one die raises the average from 10.5 (plain 3d6) to about 12.24, making characters a bit stronger than a straight 3d6 roll.

**Advantage (2d20kh1).** Roll two d20s and keep the better one. The effect is bigger than most players expect:

| Chance to roll at least… | Normal d20 | With advantage |
| ------------------------ | ---------- | -------------- |
| 11                       | 50%        | 75%            |
| 15                       | 30%        | 51%            |

The average rises from 10.5 to about 13.8. **Disadvantage** (2d20kl1) mirrors it, dropping the average to about 7.2.

## Rolling with the Dice Roller

The [Dice Roller](/online-tool/security-generators/dice-roller) has two ways in:

1. **Quick dice:** tap **d4**, **d6**, **d8**, **d10**, **d12**, **d20** or **d100** to roll one of that die immediately.
2. **Dice notation:** type any roll into the box, such as `2d6+3`, `4d6kh3` or `d20`, and press **Roll** (or Enter). The space bar rolls again when you're not typing in the box.

The result shows every die, not just the total. Dropped dice in a keep roll are greyed out and crossed through, so you can see exactly what was kept. Six-sided dice are shown as die faces. Below the total, a line like `4d6kh3: 6 + 5 + 3 = 14` spells out the math, and **Recent rolls** keeps your last few results for reference.

## What the roller accepts

- 1 to 100 dice per roll, each with 2 to 1,000 sides.
- One keep rule (`kh` or `kl`) per roll, keeping at least one die and no more than you rolled.
- One modifier, plus or minus. Spaces are fine: `3d8 + 2` works.
- Upper or lower case: `2D6` and `2d6` are the same.

If you need two different dice in one roll, like a weapon's 1d8 plus 1d6 bonus damage, roll them separately and add the totals.

## Is a virtual die fair?

Each face is drawn from your browser's cryptographic random number generator, using a method that avoids the small bias a naive calculation can introduce. Every face is equally likely and every roll is independent. Physical dice, especially cheap ones with rounded edges or uneven pips, are often slightly less fair than that.

That independence cuts both ways. Three natural 1s in a row don't make a 20 "due". Each roll is a fresh 1-in-20 chance.

## What do the roll stats tell you?

Every roll now comes with a row of five numbers under the total. **Lowest die**, **Highest die** and **Average die** describe the dice you just rolled, counting every die shown, including any a keep rule dropped. **Possible total** is the full range the notation can produce, and **Expected total** is its exact long-run average.

Roll `2d6+3` and the possible total reads 5–15: two 1s plus 3 at the bottom, two 6s plus 3 at the top. The expected total is 10, since each d6 averages 3.5 and 2 × 3.5 + 3 = 10. For keep rolls, the expected value is worked out exactly from the odds of each kept die, so `4d6kh3` shows 3–18 and 12.24.

Below the result, a session line counts your rolls and shows the average total, such as "This session: 12 rolls, average total 9.83". Over many rolls it should drift toward the expected total. **Reset session** clears the count and the recent rolls. Nothing is saved after you close the tab.

For odd dice, use the **Dice** and **Custom sides (2–1000)** fields. Enter 3 and 7, then press **Roll 3d7**.

## FAQ

### What does "d%" mean?

It's a percentile roll, 1 to 100, written the old way for two ten-sided dice read as tens and units. Here it's the same as d100.

### Can I roll a d3 or a d7?

Yes. Any number of sides from 2 to 1,000 works, so `1d3` and `1d7` are fine, even though physical versions are rare.

### Why is my total lower than the sum of all the dice?

You probably used `kh` or `kl`. Only the kept dice count toward the total.

For decisions that don't need dice, try the [Coin Flip](/online-tool/security-generators/coin-flip) or the [Wheel Spinner](/online-tool/security-generators/wheel-spinner). To roll your next check, open the [Dice Roller](/online-tool/security-generators/dice-roller).
