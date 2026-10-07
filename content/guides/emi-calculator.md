---
slug: how-emi-is-calculated-month-by-month
tool: emi-calculator
title: How EMI Is Calculated, Month by Month
description: 'Your EMI stays the same every month, but the interest inside it keeps shrinking. A step-by-step look at how loan instalments work, with real numbers.'
tags: [Finance, Loans, Explainer]
---

An EMI (equated monthly instalment) is a fixed monthly payment that repays a loan's principal and interest over a set number of months. It is calculated as **EMI = P × r × (1 + r)^n ÷ ((1 + r)^n − 1)**, where P is the loan amount, r is the monthly interest rate and n is the number of months. For a 500,000 loan at 9% a year over 24 months, the EMI is **22,842.37**.

The total stays constant, but the split between interest and principal changes every single month. Understanding that split explains why prepaying early saves so much and why longer tenures cost more. The examples below are for understanding how instalments work, not financial advice; your lender's offer is what counts.

## Step 1: Turn the annual rate into a monthly rate

Interest is quoted per year but charged monthly. Divide by 12:

9% ÷ 12 = 0.75% a month, or **r = 0.0075**.

## Step 2: Plug into the EMI formula

With P = 500,000, r = 0.0075 and n = 24:

- (1 + r)^n = 1.0075^24 ≈ 1.19641
- EMI = 500,000 × 0.0075 × 1.19641 ÷ (1.19641 − 1) ≈ **22,842.37**

You pay that amount every month for 24 months, a total of **548,216.91**. The difference, **48,216.91**, is the total interest.

## Step 3: See how each payment is split

Each month, interest is charged on whatever balance is still outstanding. The rest of the EMI reduces the balance.

| Month | EMI       | Interest | Principal | Balance after |
| ----- | --------- | -------- | --------- | ------------- |
| 1     | 22,842.37 | 3,750.00 | 19,092.37 | 480,907.63    |
| 2     | 22,842.37 | 3,606.81 | 19,235.56 | 461,672.06    |
| 3     | 22,842.37 | 3,462.54 | 19,379.83 | 442,292.23    |
| 24    | 22,842.37 | 170.04   | 22,672.33 | 0.00          |

Month 1 interest is simply 500,000 × 0.0075 = 3,750. In month 2, the balance is lower, so interest is lower too (480,907.63 × 0.0075 = 3,606.81), and a little more of the same EMI goes to principal. By the last month, interest is down to 170.04.

This is called a **reducing-balance** loan, and it is how the calculator works.

## Why does a longer tenure cost so much more?

Because the balance shrinks more slowly, so interest is charged on a larger amount for longer. Same 500,000 at 9%:

| Tenure    | EMI       | Total interest | Interest share of total |
| --------- | --------- | -------------- | ----------------------- |
| 24 months | 22,842.37 | 48,216.91      | 8.8%                    |
| 36 months | 15,899.87 | 72,395.19      | 12.6%                   |
| 60 months | 10,379.18 | 122,750.66     | 19.7%                   |

Stretching from 24 to 60 months cuts the EMI by more than half but multiplies the interest by about 2.5.

## Watch out for flat-rate quotes

Some lenders, especially for personal and vehicle loans, quote a **flat rate**: interest calculated on the full original amount for the whole term, even as you repay it. A "9% flat" on 500,000 for 2 years means 500,000 × 9% × 2 = 90,000 interest, and an EMI of 590,000 ÷ 24 = **24,583.33**. That is about 1,741 more per month than the reducing-balance EMI at the same headline rate.

If a quote looks cheap, ask whether the rate is flat or reducing. This calculator uses the reducing-balance method, so a flat-rate offer will not match its result.

## How to use the EMI Calculator

The [EMI Calculator](/online-tool/calculators/emi-calculator) works in three steps:

1. Enter the **Principal amount**, the **Interest rate (per year)** in percent, and the **Tenure** in months (up to 600).
2. Read the **EMI (monthly instalment)**, **Total interest payable**, **Total payment (principal + interest)** and **Interest share of total**.
3. Open the **Monthly schedule** to see the EMI, principal, interest and remaining balance for every month.

The schedule is useful when you are considering a part-prepayment: find the month you plan to prepay, look at the remaining balance, and you can see how much principal is still accruing interest. If you think in years rather than months, the [Loan Calculator](/online-tool/calculators/loan-calculator) takes the term in years and summarizes the schedule by year.

## Ways to lower your EMI or total interest

- **Bigger down payment:** lowers both the EMI and total interest.
- **Lower rate:** compare lenders, and check whether your credit profile qualifies for a better offer.
- **Longer tenure:** lowers the EMI, but raises total interest, as the table shows.
- **Prepayments:** reduce the balance early, when interest is highest. Check for prepayment charges.

## FAQ

### Does the EMI include processing fees or insurance?

No. It covers principal and interest only. Fees, insurance and taxes are added separately by the lender.

### What happens if the interest rate changes during the loan?

On a floating-rate loan, the lender recalculates either the EMI or the tenure from the outstanding balance. You can model that by entering the remaining balance, the new rate and the remaining months.

### Can I enter a 0% rate?

Yes. At 0% the EMI is just the principal divided by the number of months, and total interest is zero.

Work out your instalment and full schedule with the [EMI Calculator](/online-tool/calculators/emi-calculator).
