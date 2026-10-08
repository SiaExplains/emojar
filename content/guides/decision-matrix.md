---
slug: how-to-make-a-weighted-decision-matrix
tool: decision-matrix
title: How to Make a Weighted Decision Matrix (With a Worked Example)
description: Pick criteria, set weights, score each option and let the arithmetic rank them. A step-by-step weighted scoring example, plus how to read ties and close calls.
tags: [Decision Making, Productivity, Explainer]
---

A weighted decision matrix scores each option against a list of criteria, multiplies every score by how much that criterion matters, and adds the results up. The option with the highest weighted total is the best fit for the priorities you wrote down. It won't make the choice for you, but it shows why one option comes out ahead, and by how much.

## What is a weighted decision matrix?

It's a table. Options run across the top as columns, criteria run down the side as rows, and each cell holds a score. A plain pros-and-cons list treats every point as equal. A matrix makes you say out loud that, for example, quality matters more to you than location.

You'll also see it called a weighted scoring model, a prioritization matrix or a Pugh matrix. Strictly speaking, Stuart Pugh's original concept-selection method compares every design to a baseline using plus, minus and "same" marks. The weighted version, with numeric scores and percentage weights, grew out of that idea and is the one most people mean today. It's the version the [decision matrix tool](/online-tool/productivity-tools/decision-matrix) uses.

## How is the weighted total calculated?

For each option, the tool multiplies each score by that criterion's share of the total weight, then adds the products:

**weighted total = sum of (weight ÷ sum of all weights) × score**

Because each weight is divided by the sum of all weights, the result is a weighted average on your score scale. On the 1 to 10 scale, a total of 7.9 means "7.9 out of 10". It also means the weights don't have to add up to 100. Weights of 3, 4 and 3 give exactly the same totals as 30%, 40% and 30%.

## A worked example: choosing between two apartments

This is the example the tool opens with. Two apartments, three criteria, scored from 1 (poor) to 10 (excellent):

| Criterion | Weight | Option A | Option B |
| --------- | ------ | -------- | -------- |
| Price     | 30%    | 8        | 6        |
| Quality   | 40%    | 7        | 9        |
| Location  | 30%    | 9        | 7        |

Option A: 0.3 × 8 + 0.4 × 7 + 0.3 × 9 = 2.4 + 2.8 + 2.7 = **7.9**

Option B: 0.3 × 6 + 0.4 × 9 + 0.3 × 7 = 1.8 + 3.6 + 2.1 = **7.5**

The Ranking section reads: "Option A wins with 7.9 / 10, 0.4 points (5.3%) ahead of Option B." The percentage is the lead divided by the runner-up's total, so 0.4 ÷ 7.5 is about 5.3%.

Notice that B has the best single score in the table, a 9 for quality, and quality carries the biggest weight. A still wins because it's solid on all three criteria, while B gives up points on both price and location.

## How sensitive is the result to the weights?

Try making quality the dominant criterion: Price 25%, Quality 50%, Location 25%. Now both options land on exactly 7.75, and the tool says "Tie: Option A and Option B score 7.75 / 10." Both get rank 1 and a "Tied best" badge. Options with equal totals share a rank, so a third option would be ranked 3, not 2.

That small experiment is the most useful thing a matrix can teach you. If a modest change in weights flips or ties the result, the decision is genuinely close. Look at the criterion where the options differ most and ask which trade-off you'd regret less. If the winner holds up across sensible weightings, you can be more confident in it.

A good habit: settle the weights before you score anything. Once the scores are in, it's tempting to nudge the weights until your favorite wins, and then the matrix only confirms what you already wanted.

## Setting up your own matrix

1. **Name the decision** in the Decision box, then rename "Option 1" and "Option 2" in the column headers. Use **+ Add option** for more (up to 12) and **+ Add criterion** for more rows (up to 30).
2. **Choose how to enter weights.** "Percentages (total 100)" warns you when the weights don't add to 100 and offers a **Normalise to 100%** button that rescales them. "Points (any numbers)" lets you use any relative values. Either way, the small "=" figure under each weight shows its real share.
3. **Pick the scale.** "1 to 10" or "1 to 5". Switching converts your existing scores so the top of one scale maps to the top of the other, rounded to one decimal.
4. **Score every cell.** An empty cell counts as 0, and the summary tells you how many empty scores were counted that way, so a half-filled column doesn't quietly lose.

### When is lower better?

Some criteria are amounts where less is good: rent, commute time, risk. Tick **Lower is better** on that row and the score is flipped on the scale, using (1 + top of scale − score). On 1 to 10, a 2 counts as 9 and a 9 counts as 2. That way you can type the "raw" rating, such as "the commute is a 9 out of 10 long", without having to invert it in your head.

## Reading, sharing and saving the result

With at least three criteria, **Show radar chart** draws each option as a shape across the criteria, after the lower-is-better flip. It shows the first six options, and it's a quick way to see whether a winner is an all-rounder or a specialist.

**Copy table** puts tab-separated values on your clipboard that paste straight into Excel or Google Sheets. **Download CSV** saves a file with the weights as percentages, every score, the weighted totals and the ranks. Text that begins with =, +, - or @ is prefixed with an apostrophe so a spreadsheet won't run it as a formula. **🖨 Print** prints only the matrix and ranking.

Your matrix is stored only in this browser's localStorage. It isn't uploaded, and it doesn't sync to your other devices. Clearing your site data deletes it, so use **⬇ Export JSON** to keep a backup or move it to another computer, and **⬆ Import JSON** to load it back. An invalid file is rejected and changes nothing.

## When to use something else

A matrix is for choices with several criteria. If you need to sort a to-do list by urgency instead, the [Eisenhower matrix](/online-tool/productivity-tools/eisenhower-matrix) is a better fit. And if two options really are tied and nothing more is at stake, let the [wheel spinner](/online-tool/security-generators/wheel-spinner) settle it.

## FAQ

### How many criteria should I use?

Usually three to seven. With too many, each weight gets so small that minor criteria can add up and drown out the ones you care about. If two criteria measure nearly the same thing, merge them.

### Can a score be a decimal?

Yes. Any number from 1 to the top of your scale is accepted, so 7.5 is fine. Totals are shown rounded to two decimals.

### Is a higher total always the right choice?

It's the best match for the weights and scores you entered. Treat a lead of a few tenths as a near-tie, and check how the ranking changes when you adjust the weights.

Ready to weigh your own options? Open the [decision matrix](/online-tool/productivity-tools/decision-matrix) and replace the apartment example with your own.
