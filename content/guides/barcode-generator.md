---
slug: which-barcode-format-should-you-use
tool: barcode-generator
title: 'Which Barcode Format Should You Use? Code 128, EAN-13, UPC'
description: Code 128 for internal labels, EAN-13 or UPC-A for retail, ITF-14 for cartons. A plain-English guide to choosing a barcode type, with check digit examples.
tags: [Barcodes, Retail, Comparison]
---

Choose the barcode format by where it will be scanned. For products sold in stores, use EAN-13 (most of the world) or UPC-A (US and Canada) with a number licensed from GS1. For shipping cartons, use ITF-14. For anything internal, such as asset tags, library cards, bin locations or order numbers, use Code 128, which can encode letters, digits and punctuation compactly.

The comparison below covers every format in the Emojar generator, followed by how check digits work and how to get a printable result.

## The formats at a glance

| Format          | What it encodes                     | Typical use                                   | Needs GS1 number? |
| --------------- | ----------------------------------- | --------------------------------------------- | ----------------- |
| **Code 128**    | Any text (letters, digits, symbols) | Shipping labels, asset tags, internal IDs     | No                |
| **EAN-13**      | 12 digits + 1 check digit           | Retail products worldwide, books (ISBN)       | Yes, for retail   |
| **EAN-8**       | 7 digits + 1 check digit            | Very small retail packages                    | Yes, for retail   |
| **UPC-A**       | 11 digits + 1 check digit           | Retail products in the US and Canada          | Yes, for retail   |
| **Code 39**     | A–Z, 0–9, space and `- . $ / + %`   | Older industrial and government systems       | No                |
| **ITF-14**      | 13 digits + 1 check digit           | Outer cartons and cases                       | Yes               |
| **MSI Plessey** | Digits                              | Shelf labels and inventory in some warehouses | No                |
| **Pharmacode**  | A number from 3 to 131,070          | Pharmaceutical packaging control              | No                |

## When should you use Code 128?

Code 128 is the best default whenever you control both the label and the scanner. It encodes the full ASCII character set, so `EMOJAR-2026`, `BIN-A14` or `INV-000381` all work, and it's denser than Code 39, producing a shorter barcode for the same data. Practically every handheld scanner and phone barcode app reads it.

Use **Code 39** only when an existing system requires it. It supports uppercase letters only (the generator converts lowercase input to uppercase) and produces noticeably wider barcodes.

## When do you need EAN-13 or UPC-A?

Only for products sold through retailers or marketplaces that scan at checkout. These numbers must be **globally unique**, which is why they're issued by GS1, the non-profit that manages the system. The first digits identify your company; you assign the rest to products.

You _can_ type any 12 digits into the generator and get a perfectly scannable EAN-13 image, but a retailer's system will either reject it or, worse, match it to someone else's product. Buy a GS1 company prefix for real retail use. For internal stock that never leaves your shop, Code 128 avoids the issue entirely.

EAN-13 and UPC-A are closely related: a UPC-A number is the same as an EAN-13 with a leading zero, so scanners worldwide read both.

## How do check digits work?

The last digit of an EAN, UPC or ITF-14 code is calculated from the others, so a scanner can detect a misread. The generator adds it automatically when you enter one digit fewer than the full length. Here's the EAN-13 calculation for `400638133393`:

1. Multiply the digits alternately by 1 and 3, starting from the left:
   4×1 + 0×3 + 0×1 + 6×3 + 3×1 + 8×3 + 1×1 + 3×3 + 3×1 + 3×3 + 9×1 + 3×3 = **89**
2. Find the amount needed to reach the next multiple of 10: 90 − 89 = **1**.
3. The full barcode number is **4006381333931**.

If you enter all 13 digits and the last one doesn't match this calculation, the generator flags the value as invalid. That's a useful way to catch a typo in a number someone sent you.

UPC-A works the same way with the weights reversed (3 for odd positions, 1 for even). The sample `03600029145` gets a check digit of 2, giving `036000291452`.

## How to create a barcode

1. Open the [Barcode Generator](/online-tool/security-generators/barcode-generator).
2. Choose a **Format**. A valid sample value appears so you can see what the format expects.
3. Type your data into **Value**. If it doesn't fit the format, for example letters in an EAN-13, an error explains why and downloads are disabled until it's fixed.
4. Adjust **Height** (30–200 px) and **Bar width** (1–4 px), and tick or untick **Show text below the barcode**.
5. Download **SVG** or **PNG**. The barcode is drawn entirely in your browser.

## Tips for printing barcodes that scan

- **Use SVG for print.** Barcodes rely on precise bar widths; a vector file keeps edges crisp at any size. The PNG export is rendered at three times the on-screen size on a white background, which is fine for documents and labels.
- **Don't squash it.** Resize proportionally. Stretching only the height is fine; narrowing the width can merge bars.
- **Respect minimum sizes for retail.** The reference size for an EAN-13 is about 37.3 × 25.9 mm. Retailers set their own limits on how far you can shrink it, so check their requirements.
- **Keep it dark on light.** Black bars on a white background are safest. Red bars are invisible to many laser scanners.
- **Leave white space on both sides.** The blank margins tell the scanner where the code starts and ends.
- **Test with a real scanner or phone** before printing a batch.

If you need to hold more data, such as a URL or contact details, a 2D code is a better fit; the [QR Code Generator](/online-tool/security-generators/qr-code-generator) handles that.

## FAQ

### Can a barcode store a web link?

Code 128 can technically encode a short URL, but phone cameras won't open it as a link. Use a QR code for anything people should scan with a phone.

### Why does my EAN-13 show as invalid?

Either it contains a non-digit, it has the wrong number of digits (EAN-13 needs 12 or 13), or the 13th digit isn't the correct check digit.

Need a label? [Generate a barcode now](/online-tool/security-generators/barcode-generator).
