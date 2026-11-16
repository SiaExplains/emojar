---
slug: write-a-family-loan-agreement-with-a-repayment-plan
title: Write a Family Loan Agreement With a Repayment Plan
description: Lending money to family? Work out the monthly payment, write the amounts in words, set the final due date and draft a one-page agreement to sign.
tags: [Personal Finance, Calculators, Writing, How-to]
---

To write a simple loan agreement for a family member, settle the numbers first: the amount, the interest rate (zero is allowed), how many months, and the date of the first payment. The [EMI Calculator](/online-tool/calculators/emi-calculator) turns those into a fixed monthly payment and a full schedule. [Number to Words](/online-tool/unit-converters/number-to-words) spells the amounts out the way contracts and cheques write them, and the [date calculator](/online-tool/date-time-tools/date-add-subtract) finds the date of the last payment. You then put it all on one page in the [Markdown Previewer](/online-tool/text-tools/markdown-previewer) and sign it together. All of these run in your browser and don't need an account.

The example: you're lending your sibling 6,000 pounds toward a car. You've agreed on 18 monthly payments starting on 1 December 2026, and you're deciding between 4% interest and none at all. The calculators have no currency setting, so the same steps work in dollars, euros or anything else.

The tools handle arithmetic and formatting and know nothing about the law where you live. For a large sum or anything unusual, ask a solicitor or lawyer to look the agreement over.

## How much is each monthly payment?

Open the EMI Calculator and fill in three fields: **Principal amount** 6000, **Interest rate (per year)** 4 and **Tenure** 18 months. The result is an **EMI (monthly instalment)** of 343.99. Below it you get a **Total interest payable** of 191.79, a **Total payment (principal + interest)** of 6,191.79, and an **Interest share of total** of 3.09751%.

The tool uses EMI = P × r × (1 + r)^n ÷ ((1 + r)^n − 1), where r is the yearly rate divided by 12 and n is the number of months. The payment stays the same every month while the split between loan and interest shifts. Scroll to the **Monthly schedule** and the first row shows 323.99 going to the loan and 20.00 to interest, leaving a balance of 5,676.01. By month 18 only 1.14 of the payment is interest.

If you'd rather not charge interest, set the rate to 0. The tool accepts it and divides the loan evenly: 333.33 a month, with nothing in the interest column.

## What if the payment doesn't divide evenly?

At 0%, 18 payments of 333.33 add up to 5,999.94, which is 6 pence short of the loan. At 4%, 18 payments of 343.99 come to 6,191.82, three pence more than the total the calculator shows, because the displayed payment is rounded. The gaps are small, but write down how you'll handle them. A common fix is to let the last payment absorb the difference, so in the interest-free version the eighteenth payment would be 333.39.

If 343.99 a month is too much for your sibling, change **Tenure** to 24. The payment drops to 260.55 and total interest rises to 253.19. The calculator's FAQ puts the trade-off plainly: a longer tenure lowers the EMI but raises the total interest.

## When is the last payment due?

With the first payment on 1 December 2026, the eighteenth falls 17 months later. In the date calculator, set **Start date** to 2026-12-01, keep **Operation** on **Add (+)**, enter 17 as the **Amount** and pick **Months** as the **Unit**. The **Result** reads Monday, May 1, 2028, and **Calendar days from start** shows 517.

When you add months, a date late in the month is moved back to the last day of a shorter month, so a schedule that starts on the 31st will land on the 30th or the 28th some months. Starting on the 1st avoids that. If you'd like payments to fall on a working day, the **Business days (Mon–Fri)** unit skips weekends, but it doesn't know about public holidays.

## How do you write the amount in words?

Agreements usually give the amount in figures and in words, because words are harder to change after signing. In Number to Words, type 6000 and set **Write as** to **Cheque / check amount**. Change **Currency (plural)** to pounds and **Sub-unit (plural)** to pence. The result is "Six thousand pounds and 00/100 (0 pence)". Clear the sub-unit field if you only want "Six thousand pounds and 00/100".

Do the same for the monthly payment. Type 343.99 and tick **British style (“one hundred and five”)** to get "Three hundred and forty-three pounds and 99/100 (99 pence)". Without the tick you get the American form, which leaves out the "and".

For the clause about the final instalment, switch **Write as** to **Ordinal (one hundred fifth)** and type 18. With **Capitalisation** on **Sentence case**, it reads "Eighteenth". Every result has a **Copy** button.

## How do you lay out the agreement?

Paste a draft into the Markdown Previewer. The left side is the Markdown and the right side shows the formatted page as you type. A short outline is enough:

```markdown
## Loan agreement

**Lender:** (your name) · **Borrower:** (sibling's name)

Amount: £6,000 (Six thousand pounds and 00/100)

| Payment | Due date   | Amount |
| ------- | ---------- | ------ |
| 1       | 2026-12-01 | 343.99 |
| 18      | 2028-05-01 | 343.99 |
```

The previewer supports GitHub Flavored Markdown, so tables and task lists work. Copy the first and last rows of the monthly schedule into the table, or write out all 18 if you'd like a full payment record. Add a line about what happens if a payment is late, whether paying early is fine, and space for both signatures and the date.

When the text is right, use **Copy HTML** to paste the formatted version into an email or a word processor, or click **⬇ .md** to save the Markdown file. Save before you close the tab. The previewer keeps your text only in that browser tab, and it's gone once the tab closes.

## Should any part be in capitals?

Contracts often put the heading and the key terms in capitals so they stand out. Paste a line into the [Uppercase Converter](/online-tool/text-tools/uppercase-converter) and the capital-letter version appears as you type, ready to copy. It follows Unicode rules, so a surname with the German ß, such as Strauß, comes out as STRAUSS. Keep it to short lines like "LOAN AGREEMENT" or the repayment terms. The tool's own FAQ notes that long passages in capitals are harder to read.

## FAQ

### Can I set the interest rate to zero?

Yes. The EMI Calculator accepts a rate of 0 and splits the principal evenly over the tenure, so 6,000 over 18 months is 333.33 a month with no interest in the schedule.

### What is the longest loan the EMI Calculator handles?

600 months, which is 50 years. A longer tenure shows the message "Please enter a tenure of 600 months or less."

### Does Number to Words work for currencies other than dollars?

Yes. In cheque mode, type any plural currency name, such as pounds, euros or rupees, and any sub-unit, such as pence or cents. Leave the sub-unit empty to drop the bracketed part.

### Is my agreement saved anywhere?

No. The Markdown Previewer keeps the text in your browser tab only. Copy it or download the .md file before you close the tab.

More money tools are in [Calculators](/online-tool/calculators), and the writing tools are in [Text Tools](/online-tool/text-tools).
