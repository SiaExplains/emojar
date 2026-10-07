---
slug: ocr-not-reading-text-correctly-causes-and-fixes
tool: image-to-text
title: OCR Getting Your Text Wrong? Causes and Fixes That Work
description: Garbled characters, missing accents, empty results? The most common reasons OCR misreads images and screenshots, and what to change before you try again.
tags: [OCR, Images, Troubleshooting]
---

When OCR returns garbled or empty text, the cause is almost always the image, not the engine: the text is too small in pixels, blurry, skewed, low in contrast, or in a language other than the one you selected. Fix those before re-running and accuracy usually jumps from frustrating to near-perfect. Cropping to just the text and choosing the right language solve most problems on their own.

Below are the symptoms you're likely to see, what causes each, and what to change.

## How does OCR decide what a letter is?

Optical character recognition looks at shapes of dark and light pixels and matches them against patterns it learned for a specific language. The [Image to Text](/online-tool/image-tools/image-to-text) tool uses Tesseract, a widely used open-source OCR engine, running in your browser. Two consequences follow:

1. **Pixels matter more than anything.** The engine can only work with the shapes it's given. Fuzzy, tiny or warped letters become guesses.
2. **The language model matters.** Each language comes with its own character set and word knowledge. Read French with the English model and accented letters get dropped or swapped.

## Symptom: "No text was found"

Likely causes:

- The text occupies a tiny part of a large photo, so the engine treats it as noise.
- Very low contrast, such as light gray text on white or text over a busy background.
- The image is rotated sideways or upside down.

Fixes: crop to the text area with the [Image Cropper](/online-tool/image-tools/image-cropper), rotate the image upright, and retake the photo in better light if the text is faint.

## Symptom: random characters and broken words

This is the classic "too few pixels" problem. Here's the math behind it. Type size is measured in points, where 72 points make an inch:

| Source                  | 10-point text gets about…                      |
| ----------------------- | ---------------------------------------------- |
| Scan at 300 DPI         | 10 ÷ 72 × 300 ≈ **42 pixels** per line of text |
| Scan at 150 DPI         | ≈ 21 pixels                                    |
| Screenshot at 72–96 DPI | ≈ 10–13 pixels                                 |

At 42 pixels, letter shapes are clear. At 10, an "e" and a "c" differ by a pixel or two. That's why scanning at 300 DPI or higher gives the best results.

For screenshots, **zoom in before you capture**. Setting the page or PDF viewer to 200% doubles the pixels per letter and often fixes a bad result instantly.

## Symptom: missing accents or wrong alphabet

You probably have the wrong **Text language** selected. The tool supports English, German, French, Spanish, Italian, Portuguese, Dutch, Turkish, Persian, Arabic, Russian, Chinese (simplified), Japanese and Hindi, and recognizes one language per run.

- German read as English may lose umlauts, so "Größe" can come out without its special letters.
- Persian, Arabic, Russian, Chinese, Japanese and Hindi use scripts the English model doesn't know at all, so the result is mostly junk.

For a document that mixes languages, run it once per language and keep the better passages from each.

## Symptom: lines come out in the wrong order

Multi-column layouts, sidebars and tables confuse reading order. OCR finds blocks of text and may read across columns or jump between table cells. Crop each column or section separately and extract them one at a time. Expect tables to come back as plain lines, not a grid.

## Symptom: handwriting comes out as nonsense

Tesseract is designed for printed text. Neat block capitals sometimes work; cursive handwriting usually doesn't. The same goes for heavily stylized fonts such as script logos or distressed display type.

## Symptom: it won't start at all

The first run downloads the OCR engine and the selected language model, about 5–15 MB, from a public CDN. If you're offline or a network filter blocks it, you'll see an error. Your image is never uploaded; only the engine files are downloaded. Each new language you pick is fetched the first time you use it.

## A quick pre-flight checklist

- Crop to the text and nothing else.
- Make sure the text is upright and roughly straight, not photographed at a steep angle.
- Use even lighting with no glare on glossy paper.
- Aim for dark text on a light background.
- Select the correct language.
- For a PDF, first try [PDF to Text](/online-tool/pdf-tools/pdf-to-text): if the PDF has a real text layer, you don't need OCR at all.

## How to extract text step by step

1. Open [Image to Text](/online-tool/image-tools/image-to-text) and choose an image (JPG, PNG, WebP or BMP), or paste a screenshot with Ctrl/⌘ + V.
2. Pick the **Text language**.
3. Click **Extract text**. A progress bar shows the engine loading and then recognizing text.
4. Review the result under **Extracted text**, then copy it or download it as a `.txt` file.

Check the **Average confidence** figure shown with the result. A low number is a hint that the image needs one of the fixes above.

## FAQ

### Why is the confidence high but a word still wrong?

Confidence is an average across the whole text. A page can score well overall and still contain a misread name, number or code. Always proofread figures, email addresses and anything you'll paste into a form.

### Is OCR reliable for numbers like invoice totals?

Mostly, but digits such as 1/7, 5/6 and 0/8 are easy to confuse in low-resolution images. Compare important numbers against the original.

### Can I OCR a scanned PDF?

The tool reads images. Convert the scanned pages to images first, for example with [PDF to PNG](/online-tool/pdf-tools/pdf-to-png), then extract text from each page.

Fix the image, then try again with [Image to Text](/online-tool/image-tools/image-to-text).
