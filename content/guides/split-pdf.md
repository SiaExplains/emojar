---
slug: practical-ways-to-split-a-pdf
tool: split-pdf
title: 6 Practical Ways to Split a PDF (With the Exact Settings)
description: From one file per receipt to separate chapters and odd/even pages for manual duplex printing, here are six real uses for splitting a PDF and what to type.
tags: [PDF, Split, Productivity]
---

Splitting a PDF turns one document into several smaller, independent PDFs. You can split it into equal chunks ("every N pages", where N = 1 gives one file per page) or by custom ranges such as `1-12; 13-30; 31-`, where each range becomes its own file. The original stays untouched, and every split file keeps the pages exactly as they were.

The interesting part is what you can _do_ with that. Here are six practical uses, each with the exact settings.

## 1. One file per receipt, invoice or form

You scanned a stack of 14 receipts into a single PDF, one per page, but your expense system wants each receipt uploaded separately.

- **Split:** Every N pages
- **Pages per file:** 1

Result: 14 files named `receipts-page-1.pdf` through `receipts-page-14.pdf`, in page order.

## 2. Equal chunks from a batch scan

A document feeder scanned 20 two-page application forms into one 40-page PDF. Each applicant's form needs to be its own file.

- **Split:** Every N pages
- **Pages per file:** 2

Result: 20 files (`pages-1-2`, `pages-3-4` and so on). If the page count doesn't divide evenly, the last file simply contains the remainder. A 23-page PDF split every 5 pages gives 1–5, 6–10, 11–15, 16–20 and 21–23.

## 3. Chapters or sections of a report

A 64-page annual report has an introduction (pages 1–4), financials (5–40) and appendices (41 to the end), and different colleagues need different parts.

- **Split:** By custom ranges
- **Ranges:** `1-4; 5-40; 41-`

The open-ended `41-` means "page 41 to the last page," so you don't need to know the exact count. Each range separated by a semicolon becomes a separate file named after its page span, for example `report-pages-5-40.pdf`.

## 4. Odd and even pages for manual double-sided printing

Your printer can't print double-sided automatically. Print the odd pages, flip the stack, then print the even pages.

- **Split:** By custom ranges
- **Ranges:** `odd; even`

You get two files: one with pages 1, 3, 5…, one with pages 2, 4, 6…. Print the first, reload the paper, print the second. Do one test sheet first, because how you reload the stack depends on your printer.

## 5. Getting under an email attachment limit

A 60-page scanned contract is too large to email. Splitting it into halves or thirds, then sending them in separate messages, is often the fastest fix.

- **Split:** Every N pages
- **Pages per file:** 20

Splitting doesn't shrink the total, it just divides it. If the recipient needs it as one file, [Compress PDF](/online-tool/pdf-tools/compress-pdf) is the better route, and they can later recombine the parts with [Merge PDF](/online-tool/pdf-tools/merge-pdf).

## 6. Sending only what's relevant

Your lawyer needs pages 3–5 of a lease, and your landlord needs page 12. Rather than sending the whole thing to both:

- **Split:** By custom ranges
- **Ranges:** `3-5; 12`

Two files, each containing only what that person needs. (If you only need _one_ new file, Extract PDF Pages is the more direct tool; Split is for when you want several outputs at once.)

## Range syntax at a glance

| You type       | Files you get                                          |
| -------------- | ------------------------------------------------------ |
| `1-3; 4-6; 7-` | Pages 1–3, 4–6, and 7 to the end                       |
| `1; 2; 3`      | Three single-page files                                |
| `odd; even`    | Odd pages, even pages                                  |
| `1-10; 5-15`   | Two files that share pages 5–10 (overlaps are allowed) |

Separate files with semicolons. Commas combine pages within one file, so `1-3, 5` makes a single file with pages 1–3 and 5, while `1-3; 5` makes two files.

## How to split a PDF step by step

1. Open [Split PDF](/online-tool/pdf-tools/split-pdf) and choose your file. The page count appears next to the file name.
2. In **Split**, choose **Every N pages** or **By custom ranges**.
3. Enter **Pages per file**, or type your ranges.
4. Click **Split PDF**, then download each part or use "Download all".

The splitting is done in your browser, so the document isn't uploaded. Text, images and links on each page are copied exactly, with no re-rendering.

## FAQ

### What happens if I type a page that doesn't exist?

You'll get a clear message such as "Page 30 does not exist — this PDF has 24 pages," and nothing is created until the ranges are valid.

### Can I split a password-protected PDF?

No. Remove the password first by opening the file with it and saving an unprotected copy.

### Does splitting reduce quality?

No. Pages are copied, not converted, so the split files look exactly like the original.

Pick the scenario that matches yours and try those settings in [Split PDF](/online-tool/pdf-tools/split-pdf).
