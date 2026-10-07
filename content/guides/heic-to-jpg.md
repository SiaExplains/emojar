---
slug: heic-to-jpg-png-or-webp-which-format-to-choose
tool: heic-to-jpg
title: HEIC to JPG, PNG or WebP? Choosing the Right Format
description: Converting iPhone HEIC photos? When JPG is the right call, when PNG or WebP makes sense, and which quality setting keeps your photos looking the same.
tags: [Images, iPhone, Formats, Guide]
---

For almost everyone, the right answer is **JPG at 90% quality or higher**. It opens on Windows, Android, every website and every email client, and at that setting the converted photo looks the same as the HEIC original. Choose **PNG** only when a tool specifically demands lossless files, and **WebP** when the photo is going on a website you control and you want a smaller file.

Here's why, and how to pick settings for each case.

## Why do iPhones save HEIC in the first place?

HEIC (High Efficiency Image Container) has been the default camera format on iPhones since iOS 11. It stores photos at roughly half the size of an equivalent JPG, which is a real win when your phone holds thousands of pictures.

The catch is compatibility. Windows needs an extra codec from the Microsoft Store to open HEIC, many Android apps can't read it, and plenty of upload forms reject it outright. Converting gives you a copy that works everywhere while the HEIC original stays on your phone.

## JPG, PNG or WebP: which should you pick?

| Output   | Compression       | Best for                                               | Watch out for                                             |
| -------- | ----------------- | ------------------------------------------------------ | --------------------------------------------------------- |
| **JPG**  | Lossy, adjustable | Sharing, email, upload forms, printing services        | Re-encoding at low quality adds blur and blocky artifacts |
| **PNG**  | Lossless          | Workflows that require lossless input, further editing | Photo PNGs are very large                                 |
| **WebP** | Lossy, adjustable | Your own website or blog                               | Older software and some forms still don't accept it       |

### Why is a PNG of a photo so big?

A typical 12-megapixel iPhone photo is 4032 × 3024 pixels, or about 12.2 million pixels. Stored raw at 3 bytes per pixel, that's roughly 36.6 MB of image data. PNG compresses losslessly, which works brilliantly on flat graphics and screenshots but poorly on photos full of fine noise and texture. So a PNG of a photo usually ends up many times larger than the HEIC or JPG, with no visible benefit. Unless something specifically asks for PNG, skip it for camera photos.

### When does WebP make sense?

WebP generally produces smaller files than JPG at similar visual quality, which makes it a good choice for images on your own site. It's a poor choice for anything you send to other people or upload to a form, because support outside browsers is still patchy. If you're unsure where a photo will end up, JPG is the safe default.

## Which quality setting should you use?

The converter's **Quality** slider runs from 50% to 100% and starts at 92%. It applies to JPG and WebP; PNG has no quality setting because it's lossless.

- **90–95%**: visually identical to the original for nearly all photos. The default of 92% sits here.
- **80–89%**: noticeably smaller files; differences only show if you zoom in on fine detail like hair or foliage.
- **Below 80%**: fine for thumbnails or previews, but artifacts start showing around edges and in smooth skies.

Converting is a re-encode, so it can't add quality the HEIC didn't have. Going from 92% to 100% mostly makes files bigger.

If you need a specific file size rather than a quality level, say for a form that caps uploads at 100 KB, convert to JPG first and then use [Compress Image to Exact Size](/online-tool/image-tools/compress-image-to-size).

## How to convert HEIC photos step by step

1. Open the [HEIC to JPG converter](/online-tool/image-tools/heic-to-jpg) and drop your `.heic` or `.heif` files onto the box, or click to choose them. You can add as many as you like, and remove individual files from the list.
2. Under **Convert to**, choose **JPG — works everywhere**, **PNG — lossless** or **WebP — smallest**.
3. For JPG or WebP, set the **Quality** slider.
4. Click **Convert**. A progress bar counts through the batch.
5. Download photos one by one, or use **Download all**.

Each file keeps its name with the new extension, so `IMG_4821.heic` becomes `IMG_4821.jpg`. Safari decodes HEIC natively; other browsers load a small HEIC decoder on demand. Either way, the photos are converted on your device and never uploaded.

## What happens to location data and orientation?

Two things change during conversion that are worth knowing about:

- **Metadata isn't copied.** The browser re-encodes the pixels, so EXIF data such as GPS location, camera model and capture time doesn't carry over to the new file. That's useful before posting photos publicly, but if you rely on capture dates to sort an archive, keep the originals. You can check what a file contains with the [Image EXIF Viewer](/online-tool/image-tools/image-exif-viewer).
- **Rotation is baked in.** iPhones often store photos sideways with an orientation flag. The converter applies that flag before saving, so the output is upright in every app, even ones that ignore orientation tags.

## FAQ

### Why did some of my files fail to convert?

The tool names any files it couldn't read. Usually they aren't really HEIC (for example, a different file renamed to `.heic`) or they're damaged. Try exporting the photo again from your phone, or open it on the iPhone and share it as a file.

### Why does WebP fail in Safari?

Creating WebP files depends on the browser's built-in image encoder, and not every browser can produce WebP this way. If you see an error, pick JPG, or use Chrome, Edge or Firefox for WebP output.

### Should I convert my whole photo library?

Not necessarily. HEIC is a good storage format. Convert copies when you need to share or upload, and keep the originals as your master files.

Ready to switch formats? Convert your photos with the [HEIC to JPG converter](/online-tool/image-tools/heic-to-jpg).
