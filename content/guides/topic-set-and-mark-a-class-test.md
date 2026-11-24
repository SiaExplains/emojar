---
slug: set-and-mark-a-class-test-paper-seating-class-average
title: 'Set and Mark a Class Test: Paper, Seating Plan and Class Average'
description: 'Turn a Word test paper into a numbered PDF, draw a random seating order, then work out the class average and what one student needs on the final exam.'
tags: [Teaching, PDF, Calculators, How-to]
---

Setting and marking a class test comes down to five small jobs: turn the paper into a PDF, number its pages, seat the class at random, summarise the marks, and tell individual students where they stand. On Emojar the tools for those are [Word to PDF](/online-tool/pdf-tools/word-to-pdf), [Add Page Numbers to PDF](/online-tool/pdf-tools/add-page-numbers-to-pdf), the [Random Number Generator](/online-tool/security-generators/random-number-generator), the [Average Calculator](/online-tool/calculators/average-calculator) and the [Grade Calculator](/online-tool/calculators/grade-calculator). All five run in your browser. The test paper and the marks stay on your device and are not uploaded.

The example is a geography teacher with a class of 24. The Unit 4 test is a Word file, `unit-4-test.docx`, marked out of 40 and worth 20% of the course grade.

## How do you turn the Word test paper into a PDF?

Drop `unit-4-test.docx` into Word to PDF. Pick **A4 (210 × 297 mm)** or **US Letter (8.5 × 11 in)** under **Page size**, and one of three settings under **Margins**: Normal (2.54 cm / 1 in), Narrow (1.27 cm / 0.5 in) or Wide (3.81 cm / 1.5 in). Narrow leaves more room for answer lines. Click **Convert to PDF** and you get `unit-4-test.pdf` with the note "A4 · selectable text".

Read the **Preview of the document content** box before you print 24 copies. The converter keeps the structure of the document and drops most of its styling. Headings, paragraphs, bold and italic text, lists, tables and PNG or JPEG images come through. Word fonts, sizes, colours, alignment, manual page breaks, multiple columns, headers and footers do not, and the text is set in Roboto. On a test paper that causes two problems:

- If "Name: **\_\_**" sits in the Word header, it will be missing from the PDF. Move it into the first line of the body.
- If you used a page break to start Section B on a new sheet, the sections will run together. Count the pages in the result.

If the layout has to match, click **🖨 Print / Save as PDF** and choose "Save as PDF" as the printer. The same content then goes through your browser's print engine with your system fonts. The tool reads .docx only, so an old .doc file has to be saved as .docx in Word, LibreOffice or Google Docs first.

## How do you number the pages so no sheet goes missing?

A "Page 2 of 4" footer lets each student check that no sheet is missing before they start. Load `unit-4-test.pdf` into Add Page Numbers to PDF. The tool shows its page count, here 4 pages.

**Position** has six options, the left, centre or right of the top or the bottom edge. **Format** is 1, Page 1, 1 of 10, or Page 1 of 10. **Start at** is the first number to print, and the **Font size** slider runs from 7 to 24 pt and starts at 11 pt.

With **Page 1 of 10**, **Bottom centre** and **Start at** 1, the four sheets read "Page 1 of 4" through "Page 4 of 4". Click **Add page numbers** and download `unit-4-test-numbered.pdf`. The numbers are drawn as text in Helvetica.

If you later add an instructions sheet at the front, the file has 5 pages. Tick **Skip the first page (cover)** and the cover gets no number, while the question pages still read "Page 1 of 4" through "Page 4 of 4".

## How do you seat the class at random?

You can seat the class by register number, so no names go into the tool. In the Random Number Generator set **Minimum** to 1, **Maximum** to 24 and **How many** to 24. Leave **Decimal places** at 0 and keep **No repeats** ticked, then click **🎲 Generate**.

Every number from 1 to 24 has to appear once, so the result is the whole register in a random order. With more than 20 results the tool lists them one per line, so the first line is the register number for desk 1, the second for desk 2, and so on. Press **Copy** and paste the list next to your desk plan. Leave **Sort results** unticked, or the numbers go back into register order.

The same tool picks scripts for a second marker. Change **How many** to 5, tick **Sort results**, and you get five different register numbers in order, such as 3, 9, 14, 17, 22. Both ends of the range are included. Ask for 25 with **No repeats** on and you get the message "Only 24 unique numbers exist in this range."

## How do you work out the class average and spread?

After marking, the 24 scores out of 40 are:

```text
31, 27, 36, 22, 29, 34, 18, 29, 25, 38, 29, 33,
21, 30, 26, 35, 12, 28, 32, 24, 29, 37, 27, 30
```

Paste them into the Average Calculator. Commas, spaces and new lines all work as separators, so a column copied from a spreadsheet goes in as it is. The results appear as you type:

- **Average (mean)**: 28.41666667
- **Median**: 29
- **Mode**: 29
- **Count**: 24
- **Sum**: 682
- **Minimum / maximum**: 12 / 38
- **Range**: 26
- **Standard deviation (population / sample)**: 5.98551 / 6.11425

Check **Count** first. If it says 23, a mark is missing from the paste. The mean of 28.42 out of 40 is about 71%. The median is a little higher at 29, because the single score of 12 pulls the mean down more than it moves the middle value. Take that score out and the mean of the other 23 rises to 29.13043478 while the median stays at 29.

These 24 students are the whole group you are describing, so quote the population standard deviation, 5.98551.

## How do you tell one student where they stand?

A student with 29 out of 40 asks what they need on the final exam to finish with a B. 29 ÷ 40 is 72.5%. Open the Grade Calculator and overwrite its three example rows with this student's results:

| Assignment / category | Score % | Weight % |
| --------------------- | ------- | -------- |
| Homework              | 85      | 20       |
| Unit 3 test           | 70      | 10       |
| Unit 4 test           | 72.5    | 20       |

**Current grade** shows 77.0% with "C+ · based on 50% of the course" underneath. That is (85 × 20 + 70 × 10 + 72.5 × 20) ÷ 50. Set **Final exam weight** to 50 and **Target final grade** to 83, where the calculator's letter scale puts the start of a B. **Needed on the final** reads 89.0%, from (83 − 77 × 0.5) ÷ 0.5.

A B- at 80 needs 83.0% on the final. An A- at 90 needs 103.0%, and the tool adds "Above 100% — the target is out of reach without extra credit." The letters come from a fixed scale that runs from A+ at 97 down to F below 60. If your school draws its boundaries elsewhere, go by the percentage.

## FAQ

### Will the PDF look exactly like my Word test paper?

Simple documents come out very close. **Convert to PDF** keeps headings, lists, tables and images but replaces Word fonts with Roboto and drops headers, footers, columns and manual page breaks. For the closest match use **🖨 Print / Save as PDF**, or export to PDF from Word itself.

### Can I number only some pages of the test?

You can skip the first page with **Skip the first page (cover)**. To number just one section, extract those pages, number them and merge the PDF back together.

### Should I report the mean or the median for a class test?

The calculator shows both, so you can give both. The median is less affected by outliers than the mean, which makes it the safer one to quote when one or two marks sit far from the rest.

### What if the weights I enter don't add up to 100%?

The current grade is calculated from the weights entered so far, like a running grade in a gradebook. If your items plus the final exam weight don't total 100%, a note under the results tells you what they add up to.

There are more document tools in [PDF Tools](/online-tool/pdf-tools), more maths in [Calculators](/online-tool/calculators) and more pickers in [Security & Generators](/online-tool/security-generators).
