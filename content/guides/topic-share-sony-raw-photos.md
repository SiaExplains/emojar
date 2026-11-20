---
slug: share-sony-raw-photos-online
title: 'Share Sony RAW Photos Online: ARW to JPG, Blur, Collage and Grid'
description: Got a card full of Sony ARW files? Convert them to JPG, blur faces and number plates, build a 4:5 collage and split a wide shot into an Instagram grid.
tags: [Photography, Images, Instagram, How-to]
---

To share photos from a Sony camera that shoots RAW, convert the .ARW files to JPG in the [ARW Converter](/online-tool/image-tools/arw-converter), hide any faces or number plates with [Blur & Pixelate Image](/online-tool/image-tools/blur-image), combine the best shots into one post with the [Photo Collage Maker](/online-tool/image-tools/photo-collage-maker), and cut a wide landscape into a row of profile tiles with the [Image Grid Splitter](/online-tool/image-tools/image-grid-splitter). All four read and process your photos in the browser tab, so nothing from the memory card is uploaded anywhere.

Say you spent a Saturday walking a coastal path with a 24-megapixel Sony Alpha set to RAW. The card now holds a few dozen files like `DSC01234.ARW`, each 6000 × 4000 pixels. You want one Instagram post with four of the best shots, a three-tile panorama across your profile, and a couple of single photos for a group chat. One of those has strangers' faces in it and another shows a parked car's number plate.

## How do you turn Sony ARW files into JPGs you can share?

An ARW file holds what the sensor recorded: one brightness value per pixel behind a red, green or blue filter. A RAW converter builds the colour image from that. The ARW Converter does this with LibRaw compiled to WebAssembly, running on your device. It also accepts .SR2 and .SRF files from older Sony bodies.

Drop the files into the box (you can add the whole batch at once). Then set the options:

- **Convert to**: **JPG — small, works everywhere** or **PNG — lossless, large files**. Pick JPG for sharing.
- **JPG quality**: from 60% to 100%, starting at 92%. At 92%, a 24 MP photo typically comes out at 6 to 10 MB.
- **White balance**: **As shot (camera setting)** uses what the camera recorded. **Auto (calculated from the photo)** works it out from the image, which can help if the camera guessed wrong under mixed light.
- **Brightness**: 0.5× to 2×, in steps of 0.1.

Click the button (it reads like **Convert 12 photos to JPG**) and a progress bar counts through the files. Each result keeps the original name with a new extension, so `DSC01234.ARW` becomes `DSC01234.jpg`. Next to each one you'll see the camera, ISO, shutter speed, aperture and focal length read from the file. Download them one by one or click **🗜️ Download ZIP** to get the whole set.

The first conversion loads the decoder, which is about 1.5 MB. The page has no ads, because the decoder runs on several CPU threads and browsers only allow that on pages isolated from other websites.

Colours follow LibRaw's neutral defaults, so the JPGs usually look a little flatter than the camera's own (more on that in the FAQ).

## Should you turn on Half size?

Full-resolution decoding needs a lot of memory: several hundred MB for a 24 MP file and over 1 GB for a 61 MP one. On a laptop that's usually fine. On a phone, tick **Half size (4× fewer pixels, faster and lighter on phones)**.

Half size halves each side. Our 6000 × 4000 photos come out at 3000 × 2000, which is 6 MP instead of 24 MP. That's plenty for Instagram or a group chat. Keep it off for the panorama, though, because the grid splitter cuts tiles from the original pixels and a bigger source gives sharper tiles.

If a file can't be decoded, for instance because it comes from a camera newer than the decoder, the tool uses the JPEG preview the camera stored inside the ARW and labels that result **embedded camera preview**.

## How do you hide faces and number plates before posting?

Open the photo with the strangers in Blur & Pixelate Image. Drag a box over each face. Every box is numbered on the preview and listed under **Areas** with its size in pixels, and you can remove any of them or use **Undo last area**. The tool doesn't find faces for you, so you won't lose one to a detector that missed someone in the background.

The effect can be **Pixelate** (the default) or **Blur**, each with a **Strength** slider from 1 to 10, or a **Solid box** filled with a **Box colour** you pick.

Use **Solid box** for the number plate, since short text like a plate or a few digits can sometimes be guessed from light pixelation. For the faces I'd pixelate at a high strength, which looks less harsh than a box and still hides them.

Click **⬇ Download image**. The effect replaces the original pixels in the downloaded file, so the hidden parts can't be recovered from it. A JPG comes back as a JPG named after the original, such as `DSC01240-pixelated.jpg` or `DSC01251-redacted.jpg` for a solid box.

Location data is handled too. The ARW Converter's JPGs contain only pixels, without the camera's EXIF data, so any GPS location stored in the RAW file is gone before you share. The blur tool re-encodes the image as well, which also drops metadata.

## How do you fit four shots into one Instagram post?

Load four of the converted JPGs into the Photo Collage Maker (it takes 2 to 9 photos). For a day out with one standout view, the **1 large + 3 (4 photos)** layout works well: the big cell holds the main shot and three smaller cells hold the details.

Set **Shape** to **Portrait 4:5 (Instagram)**. Click a cell to choose which photo goes in it, drag inside the cell to move the photo, and use **Zoom** (100% to 400%) to crop in closer. Each photo fills its cell and is cropped to fit, so dragging decides what stays visible. **Spacing** runs from 0% to 8% and **Rounded corners** from 0% to 10%; pick a **Background** colour for the gaps.

Under **Export width**, choose **1080 px (social media)**. With a 4:5 shape the height is 1080 × 5 ÷ 4 = 1,350 px, and **⬇ Download collage** saves `collage-4l-1080x1350.jpg`, a JPG at 92% quality with no watermark. For a print, export again at **4096 px (print)**.

## How do you split a wide shot into a row of profile tiles?

Take the full-size JPG of the best landscape into the Image Grid Splitter. Set **Grid** to **1 row × 3 (panorama, 3 posts)** and **Tile shape** to **Square tiles (1:1)**.

Three square tiles side by side make a 3:1 strip, and the source photo is 3:2, so the tool keeps the full width and crops from the centre: a 6000 × 2000 band from y = 1000 to y = 3000. That's split into three tiles of 2000 × 2000 pixels each. If you'd rather match the 3:4 previews Instagram now shows on profile pages, pick **Portrait tiles (3:4 — Instagram profile grid)**; the band becomes 6000 × 2667 and each tile 2000 × 2667.

Click **Split image**. With **Show posting order on preview** ticked, each tile shows a number. Tile 1 is the right-hand piece and tile 3 the left-hand one. Instagram puts the newest post at the top left, so you post tile 1 first and tile 3 last, and the panorama lines up. No resizing happens: each tile is cut from the original pixels and saved as a JPG at 95% quality, with names like `DSC01250-post-01-r1c3.jpg`. Download tiles one at a time or use **⬇ Download all (ZIP)**.

## FAQ

### Can I convert ARW files on my phone?

Yes, but tick **Half size** first. Full-size decoding needs several hundred MB of memory for a 24 MP photo, which can be too much for a phone browser.

### Why do my converted photos look flatter than the camera's JPGs?

The camera applies Sony's own picture profile with extra contrast, saturation and sharpening. The ARW Converter uses neutral LibRaw settings, so raise **Brightness** a little or edit the PNG in a photo editor.

### Does the converted JPG still contain my location?

No. The JPG holds only the pixels, so the camera settings and any GPS data in the RAW file are left out. The tool still shows camera, ISO, shutter speed and aperture next to each result.

### Which tile do I post first for a three-photo panorama?

Tile 1, the right-hand piece. Post the highest number last, and it ends up at the top left of your profile.

More converters, editors and resizers are in [image tools](/online-tool/image-tools).
