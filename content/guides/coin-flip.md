---
slug: coin-flip-myths-streaks-and-the-gamblers-fallacy
tool: coin-flip
title: "Coin Flip Myths: Streaks, Luck and the Gambler's Fallacy"
description: After five heads, is tails due? Is 50 out of 100 the normal result? Five coin-flip myths tested with real probabilities, plus how to make a flip actually fair.
tags: [Random, Probability, Myths]
---

A fair coin has no memory. Every flip is a fresh 50/50 chance, whatever came before, and long streaks are a normal part of randomness rather than a sign that something is wrong. Most intuitions about coin flips go wrong in one of two ways: expecting results to "even out" quickly, and underestimating how streaky random sequences really are.

Here are five common myths, checked against the math.

## Myth 1: "After five heads, tails is due"

This is the gambler's fallacy. Getting five heads in a row is unusual before it happens: the chance is 1 in 32, about 3%. But once those five heads are done, they don't affect the coin. The sixth flip is still exactly 50% heads.

The confusion comes from mixing up two different questions:

- "What's the chance of _six heads in a row_, starting now?" 1 in 64.
- "Given five heads have _already_ happened, what's the chance the next is heads?" 1 in 2.

Casinos benefit from this myth every day at roulette tables, where players bet on a color because it "hasn't come up in a while".

## Myth 2: "Long streaks mean the coin isn't fair"

Random sequences are streakier than people expect. Here's the chance of seeing at least one run of the same side, of a given length or longer, somewhere in a sequence of fair flips:

| Flips | Run of at least… | Chance |
| ----- | ---------------- | ------ |
| 10    | 4                | 47%    |
| 100   | 5                | 97%    |
| 100   | 6                | 81%    |
| 100   | 7                | 54%    |
| 100   | 8                | 32%    |

So in 100 flips, a streak of six or more is more likely than not. A classic classroom demonstration uses exactly this: when students _invent_ a "random" sequence of 100 flips, they rarely include a streak longer than four, which makes their fakes easy to spot.

## Myth 3: "Flip 100 times and you'll get 50 heads"

Fifty is the single most likely result, but it's still unlikely: exactly 50 heads happens only about 8% of the time. What you can count on is a range:

- Between 45 and 55 heads: about 73% of the time.
- Between 40 and 60 heads: about 96% of the time.

The _percentage_ settles toward 50% as you flip more. The _gap_ between heads and tails, counted in flips, usually grows. After 10,000 flips, a difference of 100 either way is completely normal, even though that's only 1%.

## Myth 4: "Real coins are perfectly fair"

Close, but not quite. A large study of hand-flipped coins found that a coin lands on the same side it started on slightly more often, roughly 51% of the time, because of a small wobble in how people flip. Spinning a coin on a table is worse: some coins favor one side noticeably because of uneven weight.

A virtual coin doesn't have these physical quirks. The [Coin Flip](/online-tool/security-generators/coin-flip) draws each result from your browser's cryptographic random number generator, with an unbiased method, so heads and tails each have exactly a 1-in-2 chance.

## Myth 5: "Best of three is fairer than one flip"

It isn't more fair. A single flip already gives each side 50%. Best of three still gives each side 50%. What best-of-three changes is how it _feels_: it takes longer, and a single lucky flip doesn't decide it, which can make the loser more willing to accept the result. If that helps a group agree, it's worth it. Just decide on the format _before_ the first flip.

## How to make a decision flip actually fair

- **Agree on who calls and what each side means before flipping.** Most arguments after a coin toss are about the rules, not the coin.
- **Don't re-flip because you don't like the answer.** If you do, notice it: the disappointment tells you what you really wanted, which is a useful result in itself.
- **For more than two options,** a coin gets awkward. Use a [Dice Roller](/online-tool/security-generators/dice-roller) for up to six equal options or a [Wheel Spinner](/online-tool/security-generators/wheel-spinner) for named choices.

## Testing the myths yourself

The tool makes it easy to see these patterns in action:

1. Click **Flip (space)**, or press the space bar, for a single animated flip.
2. Click **Flip 10** or **Flip 100** to flip many coins at once. A summary such as "100 flips: 52 heads (52%) · 48 tails" appears.
3. Watch the running tally: **Heads** and **Tails** with their percentages, and **Longest streak** across everything you've flipped.
4. Click **Reset tally** to start a new experiment.

Try **Flip 100** ten times and note the longest streak each time (reset between runs). You'll usually see streaks of six, seven or more, and heads percentages that wander a few points either side of 50.

## FAQ

### Can I predict the next flip from the history?

No. Each result is generated independently, so the tally shows what has happened, not what will.

### Is heads more likely if I always call heads?

No. What you call has no effect on a fair coin, real or virtual.

### What's the chance of 10 heads in a row?

1 in 1,024, just under 0.1% for a given set of ten flips. Over thousands of flips, though, a run of ten becomes quite likely to show up somewhere.

Settle your next decision, or test a myth, with the [Coin Flip](/online-tool/security-generators/coin-flip).
