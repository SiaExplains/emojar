---
slug: pixelate-vs-blur-vs-solid-box-how-photo-redaction-works
tool: blur-image
title: "Pixelate, Blur or Solid Box: How Photo Redaction Really Works"
description: What each effect does to the pixels, why light pixelation of short text can sometimes be guessed, and how to pick a strength that truly hides the detail.
tags: [Images, Privacy, How it works]
---

All three effects replace the original pixels in the file you download, but they keep different amounts of information. A **solid box** keeps nothing. **Pixelate** keeps one average color per block. **Blur** keeps a smeared average of neighboring pixels. For faces and license plates, strong pixelation or blur is plenty. For short text such as card numbers, account numbers or passwords, use a solid box.

Here's what happens to the pixels in each case, with the actual numbers Emojar's Blur & Pixelate Image tool uses.

## How strong is "strength"?

The **Strength** slider runs from 1 to 10 and starts at 5. It's relative to the image rather than a fixed pixel count, so the effect looks the same in the preview as in the full-size download. The working size, in pixels, is:

> amount = longest side × strength ÷ 250 (never less than 2 px)

Two examples:

| Image                         | Strength 1 | Strength 5 | Strength 10 |
| ----------------------------- | ---------- | ---------- | ----------- |
| 4032 × 3024 phone photo       | 16 px      | 81 px      | 161 px      |
| 1170 × 2532 phone screenshot  | 10 px      | 51 px      | 101 px      |

That number is the block size for pixelate and the blur radius for blur.

## What does pixelate actually do?

Pixelate divides the area into square blocks and paints each block with the average color of the pixels inside it. At strength 5 on the phone photo above, every 81 × 81 block, more than 6,500 original pixels, becomes a single color. A license plate about 400 px wide ends up roughly five blocks across. Each character is now a fraction of one block, so the plate cannot be read.

## Why can light pixelation sometimes be guessed?

Trouble starts when the blocks are small compared to what they cover. Take the screenshot at strength 1: blocks are 10 px. If the digits of an account number are 30 px tall, each digit becomes a column of about three blocks, and those blocks still vary in brightness with the shape of the digit underneath.

Text is also a small, predictable set of shapes. Someone who knows the font and roughly where the characters sit can pixelate every possible digit the same way and compare the results. Faces and scenery don't work like that, which is why the tool's own advice is a solid box for sensitive text.

## What does blur do here?

Blur averages each pixel with its neighbors within the radius, so edges and fine detail melt away. The tool runs three passes of a box blur horizontally and vertically, which closely approximates a smooth Gaussian blur.

Before blurring, it also applies a light pixelation at one third of the amount. On the phone photo at strength 5, that means 27 px blocks, then a blur with an 81 px radius. The pre-pixelation destroys fine detail that blur on its own can leave readable. The blur also only samples pixels inside your box, so nothing from outside bleeds in and the hidden content doesn't leak out past the edges.

## What does a solid box do?

It fills the area with one fully opaque color. The **Box colour** is black by default, but you can pick any color, for example to match the background of a document. Nothing of the original survives. The only clue left is the size of the box, so draw it a little wider than the text. Otherwise, a box that exactly fits "4821" tells people the number has four digits.

## Which effect should you choose?

| Effect    | What survives                  | Best for                                | Watch out for                       |
| --------- | ------------------------------ | --------------------------------------- | ----------------------------------- |
| Pixelate  | One color per block            | Faces, plates, house numbers in photos  | Low strength on small text          |
| Blur      | Smeared local averages         | Backgrounds, crowds, a softer look      | Same as pixelate at low strength    |
| Solid box | Nothing but the box's size     | Card and account numbers, names, emails | It's obvious something was hidden   |

The effect applies to every area in the image at once. If you need a box over the numbers and pixelation on the faces, export one effect, then choose that exported file again and apply the second.

## How to hide parts of a photo

1. Open [Blur & Pixelate Image](/online-tool/image-tools/blur-image) and choose your photo or screenshot.
2. Drag on the image to draw a box over each area to hide. Boxes are numbered, and the **Areas** list shows each one's size in pixels with a **Remove** link. **Undo last area** removes the newest box.
3. Choose **Pixelate**, **Blur** or **Solid box**, then set the **Strength** or **Box colour**.
4. Click **Download image**. It becomes available once there's at least one area.

PNG files are saved as PNG; everything else is saved as JPG at 92% quality, with `-pixelated`, `-blurred` or `-redacted` added to the file name. The image is processed in your browser, so the unredacted original is never uploaded anywhere.

## What redaction can't fix

The new file is clean, but the original still exists on your device, and possibly in your cloud backup or chat history. Reflections in glasses or windows can show what you blurred, so check the whole frame. If the sensitive part sits at the edge of the photo, cropping it out with the [Image Cropper](/online-tool/image-tools/image-cropper) removes it completely. The exported image is re-encoded, so it doesn't carry the original's EXIF fields; to check a file you received or plan to send as is, use the [Image EXIF Viewer](/online-tool/image-tools/image-exif-viewer).

## FAQ

### Why didn't a box appear when I clicked on the image?

Boxes need to be dragged. Very small drags, under 1/200 of the image's width or height, are ignored, so a plain click doesn't create an empty area.

### Is pixelate or blur better for faces?

Both work at the default strength or higher. Pixelation looks more obviously "censored"; blur looks softer, which some people prefer for bystanders in otherwise nice photos.

### Can I hide many areas at once?

Yes. Add as many boxes as you need, and they're all processed in the same export.

Hide what shouldn't be shared with [Blur & Pixelate Image](/online-tool/image-tools/blur-image).
