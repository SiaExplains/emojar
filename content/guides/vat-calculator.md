---
slug: how-to-remove-vat-from-a-price-correctly
tool: vat-calculator
title: Why Subtracting 20% Doesn't Remove 20% VAT
description: "Taking 20% off a VAT-inclusive price gives the wrong net amount. Here's why, how to remove VAT correctly and how to fix other common VAT mistakes."
tags: [Finance, Tax, Calculators]
---

To remove VAT from a gross price, **divide** by (1 + rate ÷ 100); don't subtract the rate. A price of 240 including 20% VAT has a net amount of 240 ÷ 1.20 = **200** and VAT of **40**. Subtracting 20% instead gives 192, which is off by 8, because the 20% was originally calculated on the net price, not on the gross.

This is the most common VAT error, but not the only one. Below are the usual problems and how to fix each. The calculations are for everyday pricing and bookkeeping checks, not tax advice; rules on which rate applies vary by country and product.

## Problem 1: The net amount comes out too low

**Symptom:** you take a VAT-inclusive price, subtract the VAT percentage, and the numbers don't reconcile with the invoice.

**Why:** VAT is added as a percentage of the net price. Net 200 plus 20% (40) makes 240. When you start from 240, 20% of it is 48, a bigger amount, because 240 is a bigger base.

**Fix:** divide the gross by 1 plus the rate as a decimal.

| Rate | Divide gross by | Example gross | Net    | VAT   |
| ---- | --------------- | ------------- | ------ | ----- |
| 19%  | 1.19            | 119.00        | 100.00 | 19.00 |
| 20%  | 1.20            | 240.00        | 200.00 | 40.00 |
| 7%   | 1.07            | 107.00        | 100.00 | 7.00  |

A shortcut for the VAT share: at 20%, VAT is one sixth of the gross (20 ÷ 120); at 19%, it is 19/119 of the gross.

## Problem 2: Adding VAT twice

**Symptom:** a quote looks much higher than expected.

**Why:** a supplier's price list already included VAT, and VAT was added again at the invoice stage.

**Fix:** always check whether a price is labeled "net" (excluding VAT) or "gross" (including VAT) before calculating. Business-to-business prices are often shown net; consumer prices in Europe are normally shown gross.

## Problem 3: One-cent differences on invoices

**Symptom:** the VAT on an invoice differs by a cent from your own calculation.

**Why:** rounding. Take a 49.99 gross price at 19%: the exact net is 42.0084…, which rounds to **42.01**, and the VAT rounds to **7.98**. Accounting software that rounds each line separately, then totals the lines, can end up a cent or two away from software that totals first and rounds once.

**Fix:** follow whichever rounding method your accounting system or tax authority expects, and don't chase single-cent differences between methods.

## Problem 4: Using the wrong rate

**Symptom:** numbers are consistently off by a few percent.

**Why:** many countries have more than one rate. Germany's standard rate is 19% and its reduced rate 7%; the UK and France use 20% as standard, with reduced rates for some goods.

**Fix:** check the rate for the specific product and country. The calculator accepts any rate, including decimals.

## Problem 5: Applying a discount after VAT

**Symptom:** the final price doesn't match the shop's total.

**Why:** a percentage discount gives the same result whether applied before or after VAT, since both are multiplications. But a fixed amount off, such as a 10 voucher, does not: taking 10 off the net price saves 11.90 at 19%, while taking it off the gross saves exactly 10.

**Fix:** check whether the voucher applies to the net or the gross price. For percentage discounts and stacked offers, the [Discount Calculator](/online-tool/calculators/discount-calculator) gives the sale price before you add tax.

## How to use the VAT Calculator

The [VAT Calculator](/online-tool/calculators/vat-calculator) handles both directions:

1. Choose **Add VAT to a net amount** or **Remove VAT from a gross amount** in the **Calculation** menu.
2. Enter the **Amount** and the **VAT rate** in percent.
3. Read the main result (the gross or net amount, depending on the mode), followed by the **VAT amount** and both the **Net** and **Gross** figures, so you can copy whichever your invoice or spreadsheet needs.

For example, adding 20% VAT to 1,250 gives a gross of **1,500.00** and VAT of **250.00**. The calculation runs entirely in your browser.

## Does it work for US sales tax?

Yes, for the arithmetic. Sales tax is added on top of a pre-tax price just like VAT, so "Add VAT" with your combined state and local rate gives the checkout total. To recover the pre-tax price from a receipt total, use "Remove VAT". The difference is legal, not mathematical: VAT is collected at each stage of the supply chain, while sales tax is usually charged only at the final sale.

## FAQ

### How do I find the VAT rate from a net and gross price?

Divide the gross by the net, subtract 1, and multiply by 100. For net 100 and gross 119: 119 ÷ 100 − 1 = 0.19, so 19%. The [Percentage Calculator](/online-tool/calculators/percentage-calculator) in percentage-change mode gives the same answer.

### Can I enter a VAT rate of 0%?

Yes. The net and gross amounts are then identical, which is useful for zero-rated goods.

### Is VAT calculated on shipping?

In many countries, yes, at the same rate as the goods it relates to, but rules vary. Check with your local tax authority.

Add or remove VAT in one step with the [VAT Calculator](/online-tool/calculators/vat-calculator).
