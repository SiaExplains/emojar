---
slug: how-compound-interest-works-with-examples
tool: compound-interest-calculator
title: 'How Compound Interest Works, With Real Numbers'
description: 'Interest on interest, the rule of 72, compounding frequency and why starting early beats saving more later, all explained with worked examples.'
tags: [Finance, Savings, Explainer]
---

Compound interest means you earn interest not only on the money you put in, but also on the interest it has already earned. Over long periods that snowball effect dominates: 10,000 invested at 6% a year, plus 200 a month for 20 years, grows to about **125,510**, of which only 58,000 is money you contributed. The other 67,510 is interest.

This guide shows how the snowball builds, how much compounding frequency really matters, and why time is the most powerful input. The figures are illustrations for learning, not financial advice; real returns vary and are not guaranteed.

## Simple vs compound interest

With **simple interest**, you earn the same amount every year, calculated on the original sum. 10,000 at 6% earns 600 a year, so after 10 years you have 16,000.

With **compound interest**, each year's interest is added to the balance and earns interest itself. Compounded once a year, 10,000 at 6% becomes:

- After year 1: 10,600
- After year 2: 11,236 (6% of 10,600 is 636)
- After 10 years: **17,908.48**

The extra 1,908.48 over simple interest is interest earned on interest. The formula without regular contributions is **A = P × (1 + r/n)^(n × t)**, where P is the starting amount, r the annual rate, n the number of compounding periods per year and t the number of years.

## The rule of 72

To estimate how long it takes money to double, divide 72 by the annual interest rate in percent. At 6%, that is 72 ÷ 6 = **12 years**.

Check it: 10,000 compounded yearly at 6% for 12 years gives **20,121.96**, just over double. The rule is an approximation that works best for rates between about 4% and 12%.

## Does compounding frequency matter?

Less than most people expect. Here is 10,000 at 6% for 10 years with no contributions:

| Compounding | Final balance |
| ----------- | ------------- |
| Yearly      | 17,908.48     |
| Monthly     | 18,193.97     |
| Daily       | 18,220.29     |

Going from yearly to monthly adds about 285. Going from monthly to daily adds only about 26 more. The rate itself and the number of years matter far more.

## Why starting early beats saving more

Compare two savers, both earning 6% compounded monthly:

- **Saver A** puts in 200 a month for **30 years**: total contributions 72,000, final balance **200,903.01**.
- **Saver B** puts in 400 a month for **20 years**: total contributions 96,000, final balance **184,816.36**.

Saver B contributes 24,000 more and still ends up with less, because Saver A's early deposits had an extra decade to compound. Time is the one input you can't make up later.

## How to use the Compound Interest Calculator

The [Compound Interest Calculator](/online-tool/calculators/compound-interest-calculator) models a lump sum plus regular monthly saving:

1. Enter the **Initial investment** and the **Monthly contribution** (use 0 for a lump sum only).
2. Enter the **Annual interest rate** and the number of **Years** (1 to 200).
3. Choose how often interest is credited under **Compounding**: Yearly, Quarterly, Monthly or Daily.
4. Read the **Future value**, **Total contributions** and **Total interest earned**, then open **Growth by year** to see the contributed amount, interest and balance at the end of every year.

Under the hood, the calculator steps through every month: it applies the monthly equivalent of your chosen compounding rate and adds the contribution at the end of the month. With the default inputs, the balance passes 13,083.89 after the first year and 50,969.84 after ten, before reaching 125,510.22 at year 20. The year-by-year table makes the snowball visible: interest earned in the final years is far larger than in the early ones.

## What the calculation leaves out

- **Inflation.** 125,510 in 20 years will buy less than 125,510 today. For a rough "real" figure, subtract expected inflation from the interest rate before you calculate.
- **Taxes and fees.** Fund charges and taxes on gains reduce the effective rate. A 1% annual fee on a 6% return leaves 5%.
- **Variable returns.** Investments such as stock funds don't earn a steady rate each year. A fixed rate is a simplification of an uneven path.

If you want to see how a percentage change compares over a single period, the [Percentage Increase Calculator](/online-tool/calculators/percentage-increase-calculator) is quicker. For borrowing, where compounding works against you, the [Loan Calculator](/online-tool/calculators/loan-calculator) shows total interest on a fixed-rate loan.

## FAQ

### What is the difference between APR and APY?

APR is the nominal annual rate. APY (or AER) includes the effect of compounding within the year. 6% compounded monthly is an APY of about 6.17%. Enter the nominal rate here and pick the matching compounding frequency.

### Are contributions added at the start or end of each month?

At the end of each month, after that month's interest is applied. Depositing at the start of the month would give a slightly higher result.

### Can I model a one-off investment with no monthly saving?

Yes. Set the monthly contribution to 0 and the calculator becomes a straightforward lump-sum growth calculation.

Watch your savings snowball year by year with the [Compound Interest Calculator](/online-tool/calculators/compound-interest-calculator).
