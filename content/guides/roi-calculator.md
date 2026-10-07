---
slug: why-your-roi-looks-wrong-common-mistakes-and-fixes
tool: roi-calculator
title: Why Your ROI Number Looks Wrong, and How to Fix It
description: A 45% return can mean 13% a year or 6% a year. Seven common ROI mistakes, from ignoring time and fees to short holding periods, with worked fixes.
tags: [Finance, Investing, Troubleshooting]
---

Most ROI figures look wrong for one of three reasons: the time period has been ignored, costs have been left out, or the investment changed size along the way. Return on investment is simply (final value − amount invested) ÷ amount invested, so turning 10,000 into 14,500 is a 45% ROI. Whether 45% is impressive depends entirely on how long it took, which is why the annualized figure matters more.

Below are seven common problems, each with a fix you can check in the ROI Calculator. The results are estimates for comparing outcomes, not financial advice, and past returns say nothing certain about future ones.

## Problem 1: The ROI ignores how long you held the investment

The same 45% gain means very different things over different periods. Here is 10,000 growing to 14,500, annualized:

| Period  | ROI | Annualized ROI (CAGR) |
| ------- | --- | --------------------- |
| 1 year  | 45% | 45%                   |
| 3 years | 45% | 13.1851%              |
| 6 years | 45% | 6.3885%               |

**Fix:** always compare annualized returns when holding periods differ. Choose **Number of years** or **Start and end date** under **Investment period**, rather than **Don't annualize**.

## Problem 2: You divided the total by the number of years

A 45% gain over three years is not 15% a year. Dividing ignores compounding: growing 15% a year for three years would turn 10,000 into 15,208.75, a gain of about 52%. The calculator uses the compound annual growth rate, (final ÷ invested)^(1 ÷ years) − 1, which gives 13.1851%.

**Fix:** use CAGR whenever you want an "average per year" figure that you can compare with a savings rate or an index.

## Problem 3: Fees, commissions and taxes were left out

Suppose 400 of that gain went on trading fees and fund charges. The real final value is 14,100, not 14,500, and the results change to an ROI of 41% and a CAGR of 12.1346%. A one-percentage-point drop per year adds up over a long holding period.

**Fix:** enter the final value after costs in **Amount returned (final value)**. Do the same with income: dividends, interest or rent received should be added to the final value, or the ROI understates the return.

## Problem 4: Rounded years distort the annual figure

If you bought on January 15, 2023 and sold on July 15, 2026, typing "3 years" is tempting. Using the actual dates instead gives a period of 3.496 years and a CAGR of 11.2128%, about two points lower than the rounded version suggested.

**Fix:** pick **Start and end date** when you know them. The calculator measures the gap using 365.25-day years, so leap years are handled.

## Problem 5: A short holding period looks spectacular

An 8% gain in six months annualizes to 16.64%. That number assumes you could repeat the same result every half-year, which rarely happens. Short-term figures are also more affected by timing luck.

**Fix:** treat annualized returns on periods under a year with caution, and compare them with the plain ROI as well.

## Problem 6: Losses and recoveries don't add up

A drop from 10,000 to 8,000 over two years is a −20% ROI and a −10.5573% annualized return. Getting back to 10,000 from 8,000 then needs a 25% gain, not 20%, because the percentage is measured from a smaller starting point. If the investment is wiped out completely, the calculator shows an ROI of −100%.

**Fix:** when judging a recovery, run it as a separate calculation starting from the lower value.

## Problem 7: You added money along the way

The calculator models one amount invested at the start and one final value. If you made monthly contributions, putting the total into **Amount invested** overstates how long that money was working, so the annualized figure comes out too low. Money added late had less time to grow.

**Fix:** for regular saving, the [Compound Interest Calculator](/online-tool/calculators/compound-interest-calculator) handles contributions month by month. Use the ROI tool for single lump sums or for checking a business project with one upfront cost.

## How to use the ROI Calculator

The [ROI Calculator](/online-tool/calculators/roi-calculator) needs only two numbers:

1. Enter the **Amount invested** (above 0) and the **Amount returned (final value)**.
2. Under **Investment period**, choose **Don't annualize**, **Number of years**, or **Start and end date**, then fill in the years or the two dates.
3. Read the **ROI**, the **Gain** or **Loss**, the **Multiple** (14,500 on 10,000 is 1.45×) and, if annualizing, the **Annualized ROI (CAGR)** and **Period**.

If something is off, the error message points to it: an end date before the start date, a period of 0, or an invested amount of 0. The math runs in your browser, so your figures are not sent anywhere.

For pricing decisions rather than investments, the [Profit Margin Calculator](/online-tool/calculators/profit-margin-calculator) measures profit against the selling price instead.

## FAQ

### Is CAGR the same as an average annual return?

Not quite. An arithmetic average of yearly returns ignores compounding and tends to overstate growth when returns swing up and down. CAGR is the single steady rate that would turn the start value into the end value.

### Can I use ROI for a marketing campaign or a new machine?

Yes. Enter the total cost as the amount invested and the value it produced as the final value. Be consistent about which costs and benefits you count, and annualize if the payback took longer than a year.

### Why does the Multiple matter if I already have ROI?

It reads more naturally for large gains. A 1.45× multiple and a 45% ROI are the same thing, but "3× my money" is easier to picture than "200% ROI."

Check your next return, annualized and after costs, with the [ROI Calculator](/online-tool/calculators/roi-calculator).
