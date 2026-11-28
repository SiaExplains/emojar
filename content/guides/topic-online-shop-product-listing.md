---
slug: write-an-online-shop-product-listing
title: 'Write an Online Shop Product Listing: Title, Photo, Video, Card'
description: Capitalise a product title, check a description for overused keywords, cut a product photo out of its background, trim a short clip and mock up a share card.
tags: [Small Business, Text, Images, How-to]
---

A product listing in an online shop needs a title in proper title case, a description that names the product without repeating it in every sentence, a photo on a clean background, a short video clip, and a link card that looks right when someone shares the page. You can do each of those in an Emojar tool: the [Title Case Converter](/online-tool/text-tools/title-case-converter), the [Keyword Density Checker](/online-tool/text-tools/keyword-density-checker), the [Background Remover](/online-tool/image-tools/image-background-remover), the [Video Trimmer](/online-tool/audio-video-tools/video-trimmer) and the [Social Share Card Preview](/online-tool/developer-tools/social-share-preview). The photo, video and image tools run in your browser, so your files aren't uploaded.

The example is a small pottery studio listing a handmade ceramic mug with a speckled blue glaze that holds 350 ml. The studio has a phone photo of the mug on a sheet of white paper, a 40-second clip of someone filling it with coffee, and a first draft of the description.

## How do you capitalise a product title?

Paste the title into the Title Case Converter, one title per line, and the result appears as you type. The draft title was:

```text
handmade ceramic mug with speckled blue glaze, 350 ml
```

and the converter returns:

```text
Handmade Ceramic Mug With Speckled Blue Glaze, 350 Ml
```

"With" is capitalised because the tool keeps only a short list of small words lowercase, such as "a", "and", "in", "of", "on", "the" and "to". Style guides disagree about "with", so lowercase it by hand if your shop does. "Ml" is the bigger problem. The converter lowercases the whole line before capitalising, so units and abbreviations like "ml", "UK" or "USB" come out as "Ml", "Uk" and "Usb", and so does a title you paste in capitals. Fix those after converting. In a hyphenated word only the first letter is capitalised, so "hand-thrown" becomes "Hand-thrown".

## How do you check that a description doesn't repeat the same keyword?

Here is the first draft of the description:

> This handmade ceramic mug is thrown on the wheel in our studio. Each ceramic mug holds 350 ml and has a speckled blue glaze over a stoneware body. The ceramic mug is safe in the dishwasher and the microwave. Because every ceramic mug is glazed by hand, the speckles land differently on each one.
>
> The handle fits three fingers, and the base is left unglazed so the ceramic mug sits flat on the table.

Paste it into the Keyword Density Checker and set **Count** to **2-word phrases**. With **Ignore common words (the, and, of, to…)** ticked, the table lists one phrase: "ceramic mug", 5 times in 74 words. Density counts every word of the phrase, so that's 5 × 2 ÷ 74 × 100 = 13.51%. Typing `ceramic mug` into **Check a specific keyword or phrase** gives the same figure.

The tool doesn't name a good density, and there isn't one, but here every sentence of the draft uses the phrase. The rewrite swaps most of the repeats for "it" or "every piece" and adds "coffee mug" once, since shoppers may search for that too:

> This handmade ceramic mug is thrown on the wheel in our studio. It holds 350 ml and has a speckled blue glaze over a stoneware body, which makes it a good size for a coffee mug or a large tea. It is safe in the dishwasher and the microwave. Because every piece is glazed by hand, the speckles land differently on each one.
>
> The handle fits three fingers, and the base is left unglazed so the mug sits flat on the table.

The new text has 82 words. "ceramic mug" and "coffee mug" each appear once, at 2.44%, and the single word "mug" appears 3 times. The 2-word table is now empty because it only lists phrases found more than once. Phrases never cross a sentence break, so the last word of one sentence and the first of the next don't count as a pair. **Copy CSV** saves the results.

The checker only looks at the text you paste. It has no data on search volume or rankings, so it can't tell you which phrase shoppers type.

## How do you put a product photo on a clean background?

Drop the photo into the Background Remover. It reads the colour at the border of the image, here the white paper, and treats it as the background. If it picks the wrong colour, click a background area in the preview.

**Tolerance** starts at 12% and sets how far a pixel's colour can be from the background colour and still be removed. Paper photographed on a phone is rarely pure white, so a shadow near the base may need a higher value. **Edge softness** starts at 4% and smooths the outline.

Leave **Remove** on **Connected background only**, which removes only background pixels connected to the edges of the image, so pale speckles in the glaze stay. **All matching pixels** removes that colour everywhere. That suits a logo with holes, but here it could take out the pale speckles too. When it looks right, press **Create transparent PNG**. The file name gets `-no-bg` added.

The tool works on plain, solid backgrounds such as paper or a backdrop, and can't cut the mug out of a busy kitchen counter. Images over 16 megapixels need resizing first.

## How do you cut a short product clip from a longer video?

Open the 40-second clip in the Video Trimmer, which accepts MP4, WebM, MOV and MKV. Set the start and end with the sliders, type times such as `0:12.5` and `0:20.0`, or play the video and press **Start = current frame** and **End = current frame**. The line under the controls confirms the clip length, here 7.5 seconds.

**Cut mode** has two options. **Fast — no quality loss (cuts at keyframes)** copies the video without re-encoding, so it's quick and the quality stays the same, but the clip starts at the keyframe before your start time. If that's more than half a second early, the tool says by how much. **Precise — exact frames (re-encodes)** cuts on the exact frame and takes longer. Press **✂️ Trim video**, watch the preview, then **⬇ Download clip**. MP4 stays MP4, WebM stays WebM, and MOV comes out as MP4.

## How will the product link look when someone shares it?

Before the page goes live, type the title and description you plan to use in its Open Graph tags into the Social Share Card Preview. The fields count characters against 60 for the title and 160 for the description. Enter the product URL (only the domain is shown) and choose the share image from your device.

Pick **Large image — 1.91:1 (1200 × 630 px)** or **Square — 1:1 (1080 × 1080 px)**. Under the preview, the tool shows the image's size and ratio and warns you if it will be cropped. A 3024 × 4032 px phone photo is portrait, so the large layout cuts off its top and bottom. Crop the photo or place it on a 1200 × 630 canvas first so the mug stays in frame. **⬇ Download mockup PNG** saves the card for whoever runs the shop page.

The preview uses only what you type and doesn't read the live page. Each platform also crops and shortens cards a little differently.

## FAQ

### Why does the Title Case Converter change "ml" to "Ml"?

It lowercases the whole line, then capitalises each word that isn't on its list of small words. Abbreviations and units lose their capitals, so fix them by hand afterwards.

### What keyword density should a product description have?

The Keyword Density Checker doesn't set a target, and no number guarantees a better ranking. Use it to find a phrase you repeat far more than anything else, then rewrite until the text reads naturally.

### Can the Background Remover cut out a product shot on a busy background?

No. It removes plain or solid-colour backgrounds. Cutting a subject out of a busy scene needs a large AI model that the tool doesn't load, so photograph the product on paper or a plain backdrop.

### Why does my trimmed clip start a little before the time I set?

Fast mode starts the clip at the nearest keyframe before your start time so it doesn't have to re-encode. Choose Precise and trim again for an exact start.

More writing helpers are in [Text Tools](/online-tool/text-tools), and the photo and video tools are in [Image Tools](/online-tool/image-tools) and [Audio & Video Tools](/online-tool/audio-video-tools).
