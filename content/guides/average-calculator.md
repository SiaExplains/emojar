---
slug: mean-vs-median-vs-mode-which-average-to-use
tool: average-calculator
title: 'Mean vs Median vs Mode: Which Average Should You Use?'
description: 'The mean, median and mode can tell very different stories about the same numbers. Learn when to use each, plus range and standard deviation, with examples.'
tags: [Math, Statistics, Calculators]
---

Use the **mean** when your numbers are fairly evenly spread with no extreme values, the **median** when a few very large or very small values could distort the picture (salaries, house prices, response times), and the **mode** when you want the most common value, such as the most popular shoe size. All three are "averages", and on skewed data they can disagree by a wide margin.

## What is the difference between mean, median and mode?

- **Mean:** add everything up and divide by how many values there are.
- **Median:** sort the values and take the middle one. With an even count, take the mean of the two middle values.
- **Mode:** the value that appears most often. There can be several modes, or none if no value repeats.

Take the list **12, 7, 3, 7, 21, 9**:

- Sum 59, count 6, so the mean is 59 ÷ 6 = **9.83**.
- Sorted: 3, 7, 7, 9, 12, 21. The two middle values are 7 and 9, so the median is **8**.
- 7 appears twice, so the mode is **7**.

## When does the mean mislead?

When the data is skewed. Imagine five people at a small company with salaries of 42,000, 45,000, 47,000, 51,000 and 380,000 (the owner).

| Measure | Value             |
| ------- | ----------------- |
| Mean    | 113,000           |
| Median  | 47,000            |
| Mode    | none (no repeats) |

A job ad promising an "average salary of 113,000" would be technically true and completely misleading: four out of five people earn less than half of that. The median, 47,000, describes the typical employee far better. That is why official statistics on income and house prices usually report medians.

## Decision guide: which average to use

| Your situation                              | Best choice                | Why                               |
| ------------------------------------------- | -------------------------- | --------------------------------- |
| Test scores in a class, no outliers         | Mean                       | Uses every value, easy to compare |
| Salaries, house prices, wealth              | Median                     | Not pulled by a few huge values   |
| Website load times, delivery times          | Median (and check the max) | A few slow cases skew the mean    |
| Most common size, rating or answer          | Mode                       | You want the most frequent value  |
| Values you will add up later, like a budget | Mean                       | Mean × count gives the total      |

When in doubt, calculate both mean and median. If they are close, the data is roughly symmetrical. If they are far apart, look for outliers.

## What do range and standard deviation add?

An average describes the center, not the spread. Two classes can both average 70 on a test, one with everyone between 65 and 75, the other with scores from 30 to 100.

- **Range** is the maximum minus the minimum. Quick, but based on only two values.
- **Standard deviation** measures how far values typically sit from the mean, using all of them.

For **2, 4, 4, 4, 5, 5, 7, 9**, the mean is 5. The squared distances from 5 add up to 32. Divide by the count (8) and take the square root: the **population standard deviation is 2**. Divide by count − 1 (7) instead and you get the **sample standard deviation, about 2.138**.

Use the population figure when your list is the whole group you care about, such as every employee at the company. Use the sample figure when your numbers are a sample of a bigger group, such as 50 surveyed customers out of thousands.

## How to use the Average Calculator

The [Average Calculator](/online-tool/calculators/average-calculator) takes a list and returns all of the above:

1. Type or paste numbers into the **Numbers** box, separated by commas, spaces, semicolons or new lines. A column copied from a spreadsheet works directly.
2. Read the **Average (mean)**, **Median** and **Mode** (or "No repeated values"), followed by **Count**, **Sum**, **Minimum / maximum**, **Range** and **Standard deviation (population / sample)**.

If several values tie for most frequent, all of them are listed as modes.

## Pitfalls when pasting data

- **Thousands separators.** Commas count as separators, so "1,000" is read as two numbers, 1 and 0. Paste numbers without thousands separators.
- **Units and symbols.** Entries like "12kg" or "$40" are not valid numbers and are skipped. Strip units first, and compare the **Count** with the number of values you expected.
- **Blank cells as zeros.** Empty lines are ignored, but if your spreadsheet filled gaps with 0, those zeros are included and will drag the mean down.

For quick percentage questions about your results, such as what share of the total one value represents, try the [Percentage Calculator](/online-tool/calculators/percentage-calculator). To eyeball a long list in order before pasting it in, [Sort Lines](/online-tool/text-tools/sort-lines) can put one value per line into natural number order.

## FAQ

### Can the median be a number that isn't in my list?

Yes. With an even number of values, the median is halfway between the two middle ones. The median of 4, 8, 15, 16, 23, 42 is 15.5.

### What if every number appears once?

Then there is no mode, and the calculator reports "No repeated values". The mean and median still work normally.

### Is the mean the same as the "average" in spreadsheets?

Yes. The AVERAGE function in spreadsheet software calculates the arithmetic mean, which matches the calculator's main result.

Paste your numbers and compare all three averages at once with the [Average Calculator](/online-tool/calculators/average-calculator).
