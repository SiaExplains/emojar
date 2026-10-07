---
slug: how-pdf-editing-works-layers-white-out-and-fonts
tool: edit-pdf
title: "How Editing a PDF Works: Layers, White-Out and Fonts"
description: Why a browser PDF editor adds a layer instead of rewriting text, what white-out really hides, and how to fix a typo so the change looks natural.
tags: [PDF, Editing, Explainer]
---

Editing a PDF in Emojar means adding new things on top of each page: text, images, white-out boxes and highlights. The original content underneath is never rewritten, so you can't retype an existing sentence directly. To change wording, you cover the old words with a white box and type the replacement over it. That covers most everyday fixes, as long as you know what the layer can and can't do.

## Why can't you just click into the text and retype it?

A Word document stores paragraphs: text that flows, wraps and reflows when you insert a word. A PDF stores the finished result instead. Each line is a set of instructions such as "draw these glyphs, in this font, starting at this exact point". There's no paragraph to reflow, and the font inside the file often contains only the characters the document actually uses.

Desktop editors work around this by guessing where paragraphs are and rebuilding them, which can shift spacing or swap fonts. Drawing changes over an untouched page is safer: nothing you didn't touch can break.

## What happens to each kind of edit when you save?

The toolbar has five modes plus an image button, and each one becomes a specific kind of page content:

| Tool | What it adds to the PDF | Defaults |
| --- | --- | --- |
| **Add text** | Real text in Helvetica, Times or Courier | "Text", 12 pt Helvetica, black |
| **White-out** | A filled rectangle | White, 100% opacity |
| **Highlight** | A filled rectangle | Yellow, 35% opacity |
| **Box** | A filled rectangle | Black, 100% opacity |
| **Add image** | An embedded picture | 30% of the page width |

Three details are worth knowing:

- **Later items sit on top.** Everything is saved in the order you added it, exactly as the preview shows. Draw the white-out patch first and type the new text afterwards; if you type first, the patch will cover your new words too.
- **Images keep their proportions.** Dragging the corner handle scales a picture without stretching it. PNG and JPG files are embedded as they are; other formats, such as WebP or GIF, are converted to PNG first.
- **Positions are stored as fractions of the page.** An image placed at 30% width on a US Letter page (612 points wide) comes out about 184 points, roughly 2.5 inches, no matter how large your screen preview is.

## Worked example: fixing a wrong date on a letter

Say a signed cover letter says "March 3, 2026" but should say "March 13, 2026". Here's how to change it in [Edit PDF](/online-tool/pdf-tools/edit-pdf):

1. Choose the PDF and use the page selector above the preview to find the right page.
2. Pick **White-out** and drag a rectangle over the old date. Make it slightly larger than the words.
3. Pick **Add text** and click where the new date should start. A "Text" placeholder appears and is selected.
4. In the side panel, replace the placeholder in **Text** with "March 13, 2026". Choose a **Font** close to the original (Times for most serif letters, Helvetica for sans-serif ones) and set **Size (pt)** to match. Body text is usually 10–12 pt.
5. Switch to **Select** and drag the text until its baseline lines up with the surrounding line.
6. Click **Save PDF**. The download ends in `-edited.pdf`, and your original file isn't changed.

The text box doesn't wrap automatically. For a second line, press Enter in the **Text** field; lines are spaced at 1.2 times the font size.

## Is white-out the same as redaction?

No, and this is the most important limit to understand. A white-out box hides text visually, but the original characters stay in the file underneath. Anyone can select them, copy them, or pull them out with a text extractor. A black **Box** behaves the same way, which is why a black bar over a name isn't safe redaction either.

If the hidden content must be gone for good, flatten the edited file: convert it with [PDF to JPG](/online-tool/pdf-tools/pdf-to-jpg), then combine the images back into one PDF with the [Image Converter](/online-tool/image-tools/image-converter). Each page becomes a picture, so the covered text no longer exists as text. The trade-off: no text in the document will be selectable or searchable after that.

## What can't the font layer handle?

New text uses the three standard PDF fonts, in regular or bold. They cover English and other Latin-alphabet languages, including accents like é, ü and ñ, plus curly quotes, dashes and the euro sign. They don't include Cyrillic, Greek, Arabic, Asian scripts or emoji. If you type any of those, saving stops with a message asking you to use Latin letters.

Two more limits: a password-protected PDF has to be unlocked with [Unlock PDF](/online-tool/pdf-tools/unlock-pdf) before it can be opened here, and if the document has fillable fields, [Fill PDF Form](/online-tool/pdf-tools/fill-pdf-form) is a better fit than typing on top of them. Everything is processed in your browser, so the file isn't uploaded.

## FAQ

### Can I reopen an edited PDF and move my changes later?

Not as separate items. Once saved, your text and boxes become ordinary page content, so reloading the file shows them as part of the page. Keep the original PDF if you might want to redo the edits.

### Will the edited file be much larger?

Text and boxes add very little, because the standard fonts are built into PDF readers and aren't embedded. Images add roughly their own file size, so shrink a large photo or logo before adding it.

### How do I get rid of an item I placed by mistake?

Click it in **Select** mode, then click **Delete item** in the side panel. Clicking without dragging in a box mode doesn't add an empty rectangle, so stray clicks leave nothing behind.

Need to fix a PDF now? Open [Edit PDF](/online-tool/pdf-tools/edit-pdf) and start with the page you need to change.
