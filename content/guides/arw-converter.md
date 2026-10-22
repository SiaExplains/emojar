---
slug: sony-arw-to-jpg-or-png-what-a-raw-converter-does
tool: arw-converter
title: 'Sony ARW to JPG or PNG: What a RAW Converter Actually Does'
description: What is inside a Sony ARW file, how it becomes a photo, when to pick JPG or PNG, and how to convert a whole shoot in your browser without uploading it.
tags: [Images, Photography, RAW, Guide]
---

A Sony ARW file isn't a picture yet. It is a record of what the camera's sensor measured, and something has to turn those measurements into pixels before Windows Photos, a website or a print shop can use them. The [ARW Converter](/online-tool/image-tools/arw-converter) does that in your browser and saves the result as JPG or PNG, without uploading your photos anywhere.

## What is inside an ARW file

ARW stands for Sony Alpha Raw. Every Sony Alpha, RX and ZV camera can record it, and older models used the related SR2 and SRF formats. Under the hood an ARW is a TIFF container with three kinds of content:

- **The sensor data.** Each photosite sits behind a red, green or blue filter, so the file holds one brightness value per pixel, usually with 12 or 14 bits of precision. A normal JPG has 8 bits per colour channel.
- **Metadata.** Camera model, lens, ISO, shutter speed, aperture, white balance setting and the time of the shot.
- **Embedded previews.** One or more ready-made JPEGs that the camera uses for its own screen and that file browsers show as thumbnails.

Those extra bits are why photographers shoot RAW: there is room to recover a blown sky or lift a dark corner that a JPG would have clipped for good. They are also why ARW files are large, typically 25 to 60 MB each, and why most apps outside a photo editor can't open them.

## How a RAW file becomes a photo

Converting RAW is a chain of decisions, not a simple format swap. The converter has to:

1. **Demosaic** the sensor data, estimating the two missing colours at every pixel from its neighbours.
2. **Apply white balance**, so that grey looks grey under tungsten light or shade.
3. **Convert the colours** from the camera's own colour response to a standard space such as sRGB.
4. **Apply a tone curve and gamma**, so the linear sensor values look natural on a screen.
5. **Write** the result as an 8-bit JPG or PNG.

Emojar's converter does this with LibRaw, a widely used open-source RAW library, compiled to WebAssembly so it runs on your device. It uses the white balance your camera recorded, the AHD demosaicing algorithm and sRGB output. You can switch white balance to automatic, raise or lower brightness, and choose half size when a phone runs short of memory.

## JPG or PNG?

Both formats store 8 bits per channel, so neither keeps the extra range of the RAW file. The difference is compression:

| | JPG | PNG |
| --- | --- | --- |
| Compression | Lossy, adjustable quality | Lossless |
| Typical size, 24 MP photo | about 6–10 MB at 92% | about 50–60 MB |
| Opens in | everything | everything |
| Best for | sharing, uploading, email, printing | editing further, archiving one finished version |

For almost every use JPG is the right answer: at 90% quality or above the difference from the original is invisible, and the file is a fraction of the size. Pick PNG when you plan to edit the photo again and don't want each save to lose a little quality. If you just need smaller files afterwards, run them through the [Image Compressor](/online-tool/image-tools/image-compressor) or scale them down with the [Image Resizer](/online-tool/image-tools/image-resizer).

## A worked example

Say you come back from a weekend with 80 ARW files from a 24 MP camera, about 2 GB in total, and a friend wants the best 20 for a shared album.

1. Open the [ARW to JPG converter](/online-tool/image-tools/arw-converter/arw-to-jpg) and drop the 20 files in.
2. Leave white balance on "As shot" and quality at 92%.
3. Click Convert. Each photo is decoded one after another; a laptop typically takes a few seconds per file.
4. Download all of them as a single ZIP.

The result is roughly 150 MB of JPGs at full resolution, 6000 × 4000 pixels each, small enough for any cloud album. If you need lossless copies instead, the [ARW to PNG converter](/online-tool/image-tools/arw-converter/arw-to-png) does the same with PNG output.

## Why it looks different from the camera's JPG

If you shoot RAW+JPEG and compare, the converted file will often look a little flatter. The camera's own JPG applies Sony's creative look: extra contrast and saturation, sharpening, noise reduction, and corrections for the lens's distortion and vignetting. A neutral RAW conversion leaves those out, which is exactly what makes a RAW file a good starting point for editing. Raise brightness slightly in the converter, or open the PNG in an editor to add contrast.

## Limits worth knowing

- **Memory.** A 24 MP photo needs several hundred MB while decoding, and 61 MP files need over a gigabyte. On phones and tablets, tick "Half size": it halves the width and height, which is still plenty for social media.
- **Very new cameras.** LibRaw adds support for new bodies over time. If a file can't be decoded, the tool falls back to the JPEG preview stored inside the ARW and labels the result, so you always get something usable.
- **Metadata.** Camera, ISO, shutter speed and aperture are shown next to each result, but the new file contains only pixels. To read the full EXIF of a JPG first, use the [EXIF Viewer](/online-tool/image-tools/image-exif-viewer).
- **No ads on this page.** The decoder uses several CPU threads, which browsers only allow on pages isolated from other websites, so this tool runs without advertising.

Shooting on an iPhone instead? Its photos have a different problem, and the [HEIC to JPG converter](/online-tool/image-tools/heic-to-jpg) solves it the same private way.
