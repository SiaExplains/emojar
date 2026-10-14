---
slug: quick-photo-fixes-in-the-browser-before-you-post
title: Quick Photo Fixes in Your Browser Before You Post
description: Straighten, crop, hide faces, strip GPS data, add a caption, cut a plain background, make a GIF or an Instagram grid, all in the browser with no upload.
tags: [Images, Privacy, Social Media, How-to]
---

Most photos need one or two small fixes before you post or send them. Maybe it's sideways, the framing is off, a stranger's face is in the corner, or the file still carries the GPS spot where you took it. You don't need a photo app for any of this. A handful of single-purpose tools on Emojar handle each fix in the browser, and the photo stays on your device the whole time.

Below, the fixes are grouped by the question you're likely asking, in the order that usually works best.

## Is the photo the right way up?

Start here, because cropping a tilted or sideways photo just means cropping it twice.

Phones often save a photo with an orientation note instead of turning the pixels. Some websites and email apps ignore that note, so a picture that looks fine in your gallery shows up sideways for everyone else. [Rotate the image](/online-tool/image-tools/image-rotator) with **90° left**, **90° right** or a **Custom angle** for a slightly crooked horizon. Quarter turns keep every pixel. A custom angle enlarges the canvas so no corner gets cut off, and the new corners are transparent in PNG and WebP or white in JPG.

Front cameras often save mirrored selfies, so a T-shirt slogan or a street sign reads backwards. [Mirror the photo](/online-tool/image-tools/image-flipper) with **Flip horizontal (mirror)** to make text readable again. Flipping isn't the same as rotating 180°: a vertical flip turns the picture upside down and mirrors it at the same time.

## How do I crop it for the place I'm posting?

Open the [image cropper](/online-tool/image-tools/image-cropper), drag a selection, or type exact **X**, **Y**, **Width** and **Height** values. The presets do the math for common shapes:

- **1:1 (square)** for profile photos and classic feed posts
- **4:5 (portrait post)** for a taller feed post
- **9:16 (story)** for stories and reels covers
- **16:9** for video thumbnails and slides

When a preset is on, the selection keeps that shape while you drag. You can save as PNG, JPG or WebP. Cropping only removes pixels outside the box, though JPG and WebP output is saved again at the quality you choose.

## What does this photo reveal about me?

Two different things can give you away: what's visible in the picture, and what's hidden inside the file.

**Hidden data.** Drop the photo into the [EXIF viewer](/online-tool/image-tools/image-exif-viewer). It groups the metadata by camera, settings, date and location. If the file holds GPS coordinates, a warning shows them, often precise enough to point at your front door. Click **Download without metadata** to get a copy with `-no-metadata` added to the name. PNG and WebP stay in their format, and other photos become JPG at 95% quality. HEIC and TIFF files may not re-encode in every browser, so convert those first. Big social networks usually strip this data on upload. Email attachments, cloud links and "original quality" chat messages often don't.

**Visible details.** Faces of people who didn't agree to be posted, a car's number plate, a house number or an open laptop screen can all be hidden with [Blur & Pixelate Image](/online-tool/image-tools/blur-image). Drag a box over each area. You can add as many as you need. Then choose **Pixelate**, **Blur** or **Solid box**. Strength runs from 1 to 10. Nothing is detected automatically, which means you decide exactly what gets covered. For digits such as a card or account number, a solid box is the safest choice, because a light blur over short text can sometimes be guessed. The hidden areas are baked into the exported pixels, and the export drops the original camera and GPS data too.

## How do I put words on it?

For a caption, a date or a credit line, use [Add Text to Image](/online-tool/image-tools/add-text-to-image). Type your text (a new line starts a second line), pick a font such as Sans-serif, Serif, Impact or Handwriting, and place it in one of nine positions. Size is a percentage of the image width, so the same setting looks right on a phone photo and on a small screenshot. Turn on **Outline** when the background is busy or bright. The fonts come from your device, so the exact look can vary a little between a laptop and a phone.

For the classic look of bold white capitals with a black outline at the top and bottom, the [meme generator](/online-tool/image-tools/meme-generator) is quicker. Type the top and bottom lines, add extra captions if you need them, and drag each one anywhere. The download is a PNG with no watermark. Very large images are scaled down to 2,000 pixels on the longest side.

## Can I cut out the background?

Yes, if it's plain. The [background remover](/online-tool/image-tools/image-background-remover) is built for product shots on a white sheet, logos, signatures on paper and screenshots. It isn't for lifting a person out of a busy street scene, which needs a large AI model this tool deliberately doesn't load.

Click the background to pick its colour, then adjust two sliders. **Tolerance** starts at 12% (range 0 to 60%), and higher values remove more shades close to the picked colour. **Edge softness** starts at 4% and smooths the outline. Under **Remove**, **Connected background only** clears background that touches the edges, so a white label on a white mug survives. **All matching pixels** removes that colour everywhere, which helps with the holes in letters like "o" and "a" in a logo. The result is a transparent PNG.

## How do I split one photo into an Instagram grid?

The [image grid splitter](/online-tool/image-tools/image-grid-splitter) cuts one picture into tiles that line up on your profile. Here's a worked example with a typical portrait phone photo of 3024 × 4032 pixels:

1. Choose **3 rows × 3 (9 posts)**.
2. Under **Tile shape**, pick **Portrait tiles (3:4 — Instagram profile grid)**. A 3 × 3 grid of 3:4 tiles has exactly the same proportions as the photo, so nothing is trimmed.
3. Click **Split image**. You get nine tiles of 1008 × 1344 pixels each.

Each tile shows its posting number. Tile 1 is the bottom-right piece and goes up first. The top-left piece goes up last, because Instagram puts the newest post at the top left. Files are named in that order, such as `beach-post-01-r3c3.jpg`. Photos are saved as JPG at 95% quality, and PNG, WebP and GIF uploads become lossless PNG tiles. You can download everything as a ZIP.

If you'd rather have square tiles from a wide 4032 × 3024 shot, choose **1 row × 3 (panorama, 3 posts)** and **Square tiles (1:1)**. The tool takes a 4032 × 1344 strip from the middle and cuts three 1344 × 1344 squares.

## Can I turn a few photos into a GIF?

The [GIF maker](/online-tool/image-tools/gif-maker) turns two or more images into an animation. Put the frames in order with the arrows, set the **Time per frame**, and pick a width from 320 px (small file) to 1080 px (large file). If the images have different shapes, choose between **Fit whole image (bars)** and **Fill frame (crop)**. Leave **Loop forever** on for a looping clip.

For a quick before-and-after or a short slideshow, 0.5 to 2 seconds per frame reads well. For smooth motion, try 50 to 100 ms. Keep in mind that a GIF holds at most 256 colours per frame, so skies and skin tones can show banding. A smaller width helps the file stay light enough for a chat.

## How do I make a clean profile picture?

The [profile picture maker](/online-tool/image-tools/profile-picture-maker) crops your photo into a **Circle**, **Rounded square** or **Square**. Drag and zoom until your face fills roughly two thirds of the frame. Add **No border**, a **Solid colour** ring or a **Gradient ring** such as Sunset or Ocean, and download at 400, 800 or 1024 pixels. 800 × 800 is the safe choice for most platforms. A small preview shows how it looks at the size people will actually see. Keep **Transparent background (PNG)** on for invisible corners, or turn it off for a JPG on a solid colour.

## Does any of this leave my device?

No. Every tool in this post reads and edits the image in your browser, and nothing is uploaded or stored on a server.

## FAQ

### What order should I do the fixes in?

Rotate first, then crop, then hide private details, then add text. Check the final file in the EXIF viewer before you send it.

### Why is my photo still sideways after I upload it?

The site probably ignores the orientation tag. Rotating it here turns the actual pixels, so it shows correctly everywhere.

### Can the background remover cut out a person?

Only if they're standing in front of a fairly even, plain backdrop. For busy scenes, it won't give a clean result.

### Does blurring a face also remove the location data?

Yes. The blurred export is saved again in your browser, which drops the camera and GPS fields.

Find more editing, converting and resizing tools in [image tools](/online-tool/image-tools).
