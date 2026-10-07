---
slug: what-to-include-on-an-invoice-checklist
tool: invoice-generator
title: 'What to Include on an Invoice: A Practical Checklist'
description: A field-by-field invoice checklist with a worked tax and discount example, plus the number-format mistakes that quietly turn a line item into zero.
tags: [Business, Invoices, Checklist]
---

A good invoice tells the client exactly who is charging them, for what, how much, and by when they need to pay. At minimum that means a unique invoice number, issue and due dates, both parties' details, itemized lines with quantities and prices, any tax shown separately, the total, and how to pay. Beyond that, the rules depend on your country and tax status, so treat the checklist below as a starting point and confirm the specifics with your tax authority or accountant.

## Which details does almost every invoice need?

These items are close to universal:

- **A unique invoice number.** Use a sequence you never reuse, such as INV-0001, INV-0002. Many tax systems expect sequential numbering without gaps.
- **Issue date and due date.** The due date turns "pay me sometime" into an agreed deadline. Thirty days is common, but use whatever your contract says.
- **Your details.** Legal or trading name, address and a contact email.
- **The client's details.** The name and billing address of whoever actually pays.
- **Line items.** A clear description, a quantity and a unit price for each product or service.
- **Subtotal, discount, tax and total.** Show each step so the client can check your math.
- **Payment instructions.** Bank details, accepted methods, and any late-payment terms you have agreed on.

## What extra details might your country require?

This is where invoices differ. In VAT and GST countries, such as those in the EU, the UK, Australia or New Zealand, an invoice used for tax purposes generally has to show your VAT or GST registration number, the rate applied and the tax amount, and sometimes the client's tax number for business-to-business sales. Some countries require specific wording, for example when the reverse-charge mechanism applies or when you are exempt from charging VAT. In the US there is no single federal invoice format, but your state's sales tax rules may still apply. None of this is legal advice: requirements change and vary by business type, so check the official guidance where you are registered.

The practical tip: put tax IDs and company registration numbers in the "From (your details)" box, and any required wording in "Notes / payment details". Both appear on the PDF exactly as you type them.

## How are the totals calculated? A worked example

The Emojar invoice generator calculates in a fixed order: line totals, then subtotal, then discount, then tax on the discounted amount. Here is the starting example the tool loads with, plus a 10% discount:

| Step                | Calculation    | Amount    |
| ------------------- | -------------- | --------- |
| Website design      | 1 × 1,200      | €1,200.00 |
| Hosting (12 months) | 12 × 15        | €180.00   |
| Subtotal            | 1,200 + 180    | €1,380.00 |
| Discount (10%)      | 1,380 × 10%    | −€138.00  |
| Taxable amount      | 1,380 − 138    | €1,242.00 |
| VAT (20%)           | 1,242 × 20%    | €248.40   |
| Total               | 1,242 + 248.40 | €1,490.40 |

Because the discount comes off before tax, the client pays tax only on what they are actually charged. If you switch "Discount type" from % to Amount and enter 100, the discount is a flat €100 instead, giving a total of €1,536.00. A fixed discount can never exceed the subtotal, and each line is rounded to cents before it is added up.

## How should you type amounts?

The quantity, price, "Tax %" and "Discount" fields accept numbers the way you normally write them:

- **Thousands separators:** "1,200" and "1 200" are both read as 1200.
- **Decimal commas:** "1,5" is read as 1.5, and European-style "1.200,00" as 1200. When a number has both a period and a comma, the last one is treated as the decimal mark.
- **Percent and currency signs:** "20%" in the "Tax %" box and "€19.99" in a price box both work; the symbols are ignored.

The one case to watch is a single comma followed by three digits, such as "1,500": that's read as fifteen hundred, not one and a half. Glance at the totals panel before downloading to confirm every line is what you meant. Amounts are always shown in US-style formatting, like €1,490.40, and currencies without cents, such as JPY, display as whole numbers.

## How to create the invoice step by step

1. Open the [free invoice generator](/online-tool/security-generators/invoice-generator) and set the "Invoice number", "Issue date" and "Due date".
2. Replace the sample text in "From (your details)" and "Bill to".
3. Edit the line items, using "+ Add item" for more rows and ✕ to remove one.
4. Pick the "Currency", set "Tax name" (VAT, GST, Sales tax) and "Tax %", and add a "Discount" if needed.
5. Choose A4 or Letter under "Paper", pick an accent "Colour", and optionally add a PNG or JPG logo.
6. Add bank details or terms in "Notes / payment details", keeping them concise.
7. Click "Download PDF invoice". The file is named after your invoice number.

The PDF is built in your browser, so client names and amounts never reach a server. One limitation: the built-in PDF font covers Latin letters, including accents, plus the €, £ and ¥ signs. Emoji or non-Latin scripts such as Cyrillic or Chinese trigger an error instead of a broken file.

## FAQ

### How do I reuse my details for the next invoice?

Tick "Remember this draft in this browser". Next time, everything reloads, including the old invoice number and dates, so update those first. The draft lives only in that browser, and "Reset" restores the sample content.

### Should I put tax-exempt wording on a zero-tax invoice?

If you are not charging tax, set "Tax %" to 0 and the tax row disappears. Where your country requires a reason, such as a small-business exemption, add the wording in the notes field.

### What if I need to work out VAT backwards from a gross price?

Use the [VAT calculator](/online-tool/calculators/vat-calculator) to split a gross amount into net and tax, then enter the net figure as the unit price.

Ready to bill a client? [Create your PDF invoice now](/online-tool/security-generators/invoice-generator).
