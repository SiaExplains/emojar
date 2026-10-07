---
slug: common-probability-myths-debunked
tool: probability-calculator
title: Six Probability Myths and the Math That Breaks Them
description: 'Does a 1-in-100 chance happen within 100 tries? Do two 50% chances make a sure thing? Six common beliefs about odds, checked with real numbers.'
tags: [Math, Probability, Myth-busting]
---

Most probability mistakes come from treating chances as if they add up or balance out. They don't: repeated independent chances combine by multiplication, which is why ten tries at 10% gives you about a 65% chance of success rather than 100%, and why a fair coin can run "unfairly" for a while without owing you anything.

Below are six reasonable-sounding beliefs, each settled with a mode of the [Probability Calculator](/online-tool/calculators/probability-calculator).

## Myth 1: "A 10% chance, ten times, is a sure thing"

It feels like 10% × 10 = 100%. But the right question is "what is the chance it never happens?" Each failure has a 90% chance, and ten failures in a row is 0.9 multiplied by itself ten times.

In the calculator, choose **At least once in several tries**, set **Chance of success in each try** to 10 and **Number of tries (n)** to 10. The result:

- **At least once**: 65.132156 %
- **Never**: 34.867844 %
- **Expected number of successes**: 1

So you expect one success on average, yet roughly one time in three you get none. To get past 95%, you need 29 tries (95.289871 %); 28 tries still falls just short at 94.766524 %.

## Myth 2: "A 1-in-100 chance will happen within 100 tries"

Same trap, smaller numbers. Set the probability to 1 and the tries to 100, and **At least once** comes out at 63.396766 %. More than a third of the time, a 1% event doesn't show up at all in 100 attempts. That is why rare events feel either cursed or impossible depending on who you ask.

## Myth 3: "Two 50% chances add up to 100%"

If there is a 50% chance of rain on Saturday and 50% on Sunday, is rain this weekend certain? Choose **Two independent events (A and B, A or B…)** and enter 50 for both.

| Outcome | Probability |
| --- | --- |
| A and B (both days) | 25 % |
| A or B (at least one) | 75 % |
| Exactly one of them | 50 % |
| Neither | 25 % |

There is still a one-in-four chance of a dry weekend. The formula subtracts the overlap so the "both" case isn't counted twice. Real weather on consecutive days isn't fully independent, so treat this as the textbook case.

## Myth 4: "After five tails, heads is due"

Before you start, six tails in a row is unlikely. In the **Exactly / at most / at least k successes** mode with a 50% chance, n = 6 and k = 6, the result is **1.5625 %**. But once five tails have already happened, they are history. The sixth flip is a single event with one favourable outcome out of two: 50 %, exactly as before.

The low number answers "how likely is this whole streak?", not "how likely is the next flip?" Mixing those two questions is the root of the gambler's fallacy. You can watch streaks appear naturally with the [Coin Flip](/online-tool/security-generators/coin-flip) tool.

## Myth 5: "100 fair flips should give 50 heads"

Fifty is the single most likely count, but it is far from typical. Set n = 100, k = 50 and a 50% chance: **Exactly 50 of 100** is only 7.9589237 %. The **Standard deviation** is 5, which tells you that counts anywhere from about 45 to 55 are routine.

Even with ten flips, exactly five heads is 24.609375 %. Expand the **Probability of each number of successes** table under the results to see the full spread, from 0.09765625 % for zero heads up to the peak at five and back down again. The table appears for up to 200 tries.

## Myth 6: "Odds and probability are the same thing"

They describe the same chance in different ways. Rolling a six on a die is one favourable outcome out of six. Choose **Chance of one event**, enter 1 favourable and 6 total, and you get:

- **Probability**: 16.666667 % (as a fraction, 1/6)
- **Odds for**: 1 : 5

Probability compares wins to all outcomes; odds compare wins to losses. On a double-zero roulette wheel, betting on two numbers gives 2 favourable outcomes out of 38: a probability of 5.2631579 % (1/19) and odds of 2 : 36. Confusing the two makes any bet look better than it is. Try it with real rolls on the [Dice Roller](/online-tool/security-generators/dice-roller).

## A bonus: order changes everything

How many ways are there to pick 6 numbers from 49? Switch to **Combinations and permutations (nCr, nPr)** with n = 49 and k = 6. There are **13,983,816** combinations, which is what a lottery counts, because the order of the draw doesn't matter. If order did matter, there would be 10,068,347,520 permutations. For a smaller case, choosing 3 people from 10 gives 120 groups but 720 ordered podiums.

## How to avoid these traps

Ask whether the events are independent, since every mode except combinations assumes they are. For "at least once" questions, work out the chance of "never" first. And enter probabilities as percentages from 0 to 100; anything outside that range is rejected.

## FAQ

### Why is "at least 5" not the same as "more than 5"?

"At least 5" includes exactly 5. For ten fair flips, both **At most 5** and **At least 5** are about 62.3 %, because each one includes the 24.6 % chance of exactly five.

### Can I enter a probability like 1/6 directly?

The probability fields take a percentage, so type 16.6667 for one in six. For a simple "favourable out of total" question, the **Chance of one event** mode lets you enter the counts instead.

### What happens with very large combinations?

They are calculated exactly but shortened for display. C(100, 50) shows its leading digits, then the total number of digits (30) and an approximate value of about 1.008913e+29.

Test your own intuitions with the [Probability Calculator](/online-tool/calculators/probability-calculator).
