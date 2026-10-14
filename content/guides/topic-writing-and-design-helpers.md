---
slug: polish-text-and-colors-for-a-website-or-document
title: Polish Website Text and Colors With Free Browser Tools
description: Compare drafts, clean up lists, check readability, proofread by ear, then choose colors, test contrast and color blindness, and make a soft gradient.
tags: [Writing, Design, Accessibility]
---

Before a page or document goes out, two jobs remain: make the text clean and easy to read, then make the colors look good and stay readable for everyone. You can do both with free browser tools. Compare drafts, fix repeated mistakes in one pass, check reading level, listen to the text, then pick a palette and test it for contrast and color blindness. Everything below runs in your browser, with one exception for text to speech that's explained in that section.

The examples follow a small business updating its website: a new "About" page, a cleaned-up services list, and a refreshed set of brand colors. The same steps work for a report, a newsletter or a slide deck.

## What changed between two drafts?

When a colleague sends back "a few small edits," find out exactly what they touched before you accept it. Paste the old version into **Original text** and the new one into **Changed text** in the [text diff checker](/online-tool/text-tools/text-diff). Additions show in green and removals in red. **Compare by** has two settings: Lines, for lists and structured text, and Words, for prose where one changed word in a long paragraph would otherwise flag the whole line. **⇄ Swap** flips the two sides if you pasted them the wrong way around.

The comparison runs in the browser, so it's fine to paste a contract clause or an unreleased announcement.

## How do you fix the same mistake everywhere at once?

Style slips repeat. Maybe half the page says "e-mail" and half says "email." In the [find and replace tool](/online-tool/text-tools/find-and-replace), search for `e-mail`, replace it with `email`, and tick **Whole words only** so "e-mailing" is left alone. The tool shows how many replacements it made.

Watch the case setting. With **Case sensitive** off, "E-mail" at the start of a sentence also becomes lowercase "email." If capitals matter, tick **Case sensitive** and run two passes: one for `e-mail` and one for `E-mail` → `Email`.

For structural fixes, turn on **Regular expression**. A team list written as "Smith, Jane" and "Lee, Ana" can be flipped by finding `(\w+), (\w+)` and replacing with `$2 $1`. The result is "Jane Smith" and "Ana Lee", with 2 replacements.

## How do you clean up a pasted list?

Lists copied from several sources end up with duplicates. The [duplicate line remover](/online-tool/text-tools/remove-duplicate-lines) keeps the first occurrence of each line in its original order. It has two checkboxes, both on by default: **Case sensitive** and **Ignore leading/trailing spaces**.

Take a menu list with five lines: "Pricing", "About", "pricing", " About " and "Contact". With the defaults you get four lines, because the padded "About" matches but lowercase "pricing" counts as different. Untick **Case sensitive** and you get the three lines you want: Pricing, About, Contact.

Then fix the headings. Paste one title per line into the [Title Case converter](/online-tool/text-tools/title-case-converter). "a guide to the tools we use for our new website" becomes "A Guide to the Tools We Use for Our New Website". Short articles, conjunctions and prepositions stay lowercase unless they're first or last. Style guides disagree on a few words, so check yours if you follow one strictly.

## Is the text easy enough to read?

Here is the first draft of the About page's opening paragraph: two long sentences, 64 words, full of phrases like "following extensive consultation with stakeholders." In the [readability score checker](/online-tool/text-tools/readability-score), it scores a Flesch Reading Ease of **28.9**, labeled "Very difficult," with an average grade level of 18.4. The tool lists the longest sentence first (48 words), which tells you where to start.

The rewrite splits it into four short sentences, 43 words in total: "We have worked on the new customer portal for months. After talking to teams across the company, we decided to move the launch…" It scores **89.7**, labeled "Easy," at an average grade of 4.7. Most web copy aims for 60 or above.

These formulas only measure sentence and word length. They can't tell whether a sentence makes sense. The tool also has German, Spanish and French options that use formulas built for those languages.

## Why proofread by listening?

Your eyes skip over a missing "the" or a repeated "to"; your ears usually don't. Paste the text into the [text to speech reader](/online-tool/text-tools/text-to-speech), pick a voice, and adjust **Speed** and **Pitch**. Where the voice supports it, each word is highlighted as it's read, so you can follow along.

There is one privacy point to know. Voices come from your browser and operating system. Those marked "· online" in the voice list are provided by your browser vendor and **send your text to that vendor's speech service**, and the tool shows a warning when you pick one. If the draft is confidential, choose a voice without "online"; on-device voices work without sending anything. The audio can be played but not saved as a file, because browsers don't expose it to web pages.

## How do you add symbols without hunting for shortcuts?

For a price list or a checklist, the [special characters picker](/online-tool/text-tools/special-characters) lets you search by name, such as "arrow", "degree" or "euro," and copy with one click. Each symbol you click also goes into a tray, so you can collect → ✓ € ½ and press **Copy all**. Clicking a symbol also shows its code point, HTML entity and CSS escape, for example U+2713, `&#x2713;` and `\2713` for ✓. These are ordinary Unicode characters, so they paste as text anywhere. The rest of the [text tools](/online-tool/text-tools) cover counting, case changes and other cleanup jobs.

## How do you choose brand colors that work together?

Start with one color you're sure about. If it already lives in a logo or a screenshot, open the [color picker with eyedropper](/online-tool/color-tools/color-picker), upload the image and click on it, or use **Pick from screen** in Chrome or Edge. It gives you HEX, RGB, HSL, HSV and CMYK codes. The image never leaves your device. Our example brand blue is `#2563eb`, which is `hsl(221, 83%, 53%)`.

Next, build around it in the [color palette generator](/online-tool/color-tools/color-palette-generator). Choose a **Harmony**: Analogous, Complementary, Triadic, Tetradic (square), Split complementary, Monochromatic, or Tints & shades. With **Complementary**, the blue gives five swatches, including a warm amber, `#ebac24`, and a darker brown-gold, `#9a6e0e`. Click a swatch to copy it, or copy the whole set as CSS variables.

## Will people actually be able to read it?

A good-looking palette can still fail people with low vision. The [contrast checker](/online-tool/color-tools/contrast-checker) tests text and background colors against WCAG 2.2. With the example palette:

| Text color | Background | Ratio  | Result                                |
| ---------- | ---------- | ------ | ------------------------------------- |
| `#2563eb`  | white      | 5.17:1 | Passes AA for normal text             |
| `#ebac24`  | white      | 2.01:1 | Fails everything, even large text     |
| `#9a6e0e`  | white      | 4.55:1 | Just passes AA for normal text        |
| `#ebac24`  | `#0f172a`  | 8.89:1 | Passes AAA, fine on a dark background |

So the amber works as a button background with dark navy text, or as an accent on dark sections, but never as text on white. Normal text needs 4.5:1 for AA and 7:1 for AAA. Large text and UI components need 3:1. **Swap colors** flips text and background.

Then check the palette with the [color blindness simulator](/online-tool/color-tools/color-blindness-simulator). Enter your colors in the palette checker, and it flags pairs that become hard to tell apart under protanopia, deuteranopia, tritanopia, achromatopsia or the milder anomalous types. You can also load a screenshot of your page or chart and compare Original and Simulated side by side; the image is processed on your device. It's an approximation from a published model, not a medical test. Red–green types are the most common, so check those first, and never rely on color alone. Add labels or icons as well.

## How do you make a soft background from the palette?

For a hero section or a social banner, the [mesh gradient generator](/online-tool/color-tools/gradient-mesh-generator) blends 3 to 8 colored points. Drag them on the preview and set each one's **Opacity** and **Radius (softness)**. Using the blue and amber with a dark background gives a calm "aurora" look. Copy the result as CSS, which is layered radial gradients that work in every current browser. Or copy it as SVG with a smoothing blur, or download a PNG at sizes such as 1920×1080. If you put text on top, run its color through the contrast checker against the darkest and lightest parts of the gradient.

## FAQ

### Is my text uploaded when I use these tools?

No, with one exception: online voices in text to speech send the text to your browser vendor's speech service. On-device voices and every other tool here work locally in your browser.

### What readability score should a website aim for?

A Flesch Reading Ease of about 60–70 suits most general pages. Shorten the longest sentences the checker lists, then score again.

### Does passing AA contrast make a design accessible?

It's one requirement among several. Readable contrast, not relying on color alone, and clear wording all matter.

Explore more pickers, palettes and checkers in the [color tools](/online-tool/color-tools) collection.
