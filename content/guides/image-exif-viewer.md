---
slug: what-photo-metadata-reveals-privacy-checklist
tool: image-exif-viewer
title: What Your Photo's Metadata Reveals – A Pre-Sharing Checklist
description: Photos can carry your GPS location, the exact time, your camera and even your name. Here's what to check before sharing an original file, and how to clean it.
tags: [Privacy, Images, Metadata, Checklist]
---

A photo straight from a phone or camera can contain hidden EXIF metadata: the GPS coordinates where it was taken, the date and time to the second, the device make and model, lens and exposure settings, editing software, and sometimes the owner's name or a copyright line. Before you send an original file to someone you don't know well, check it with an EXIF viewer and, if needed, download a copy with the metadata removed.

Use the checklist below to know what to look for and why it matters.

## Why does this matter if social networks strip metadata?

Many large platforms do remove EXIF on upload. The leaks happen elsewhere: email attachments, cloud-storage share links, marketplace listings, forum uploads, and messaging apps when you choose to send the "original" or "file" version instead of a compressed photo. In those cases the recipient gets exactly the file on your phone, metadata and all.

## The pre-sharing checklist

Work through these in order. The Emojar EXIF Viewer groups the fields the same way.

### 1. Location (the big one)

Look for **latitude and longitude**. If they're present, the viewer shows a yellow warning with the coordinates and a link to view them on a map.

How precise is that? The viewer shows six decimal places. One degree of latitude is about 111 km, so the sixth decimal place, 0.000001°, is about **11 centimeters**. In practice phone GPS is accurate to a few meters, which is still enough to identify a specific house. A photo of a couch you're selling, taken in your living room, can effectively publish your home address.

### 2. Date and time

The **Date** group shows `DateTimeOriginal` (when the shutter fired), `CreateDate`, `ModifyDate` and often `OffsetTimeOriginal`, which is your time zone offset. Together these reveal your routine: a series of photos from the same location every weekday at 7:40 is a pattern.

### 3. Camera and software

The **Camera** group lists the device **Make**, **Model**, **Lens** and the **Software** used, such as a phone OS version or a photo editor. Usually harmless, but it can tie anonymous photos back to one device, and the software field can reveal that an image was edited.

### 4. Author and copyright

The **Author** group shows **Artist**, **Copyright**, **ImageDescription** and **OwnerName** when present. Many cameras let you set an owner name once and then stamp it into every photo, which is easy to forget years later.

### 5. Everything else

Open **All tags** for the complete list. Depending on the device, you may find a camera body serial number, XMP data from editing apps or IPTC captions and keywords.

## A quick example

Imagine a listing photo with these tags:

| Field                | Value                 | What it tells a stranger   |
| -------------------- | --------------------- | -------------------------- |
| Make / Model         | A popular phone model | Which phone you own        |
| DateTimeOriginal     | Saturday, 9:14 AM     | When you're home           |
| Latitude / Longitude | 6-decimal coordinates | Which building you live in |
| Software             | An editing app        | The photo was edited       |

None of these is dramatic alone. Together they're far more than you meant to share about a used couch.

## How to check and clean a photo

1. Open the [EXIF Viewer](/online-tool/image-tools/image-exif-viewer) and choose a JPG, HEIC, PNG, WebP or TIFF file.
2. Read the summary line (file size, type and pixel dimensions), then review the groups: Camera, Settings, Date, Image and Author.
3. If you see the location warning, decide whether you want that location in the file you're sharing.
4. Click **Download without metadata**. The image is re-encoded by your browser, which keeps the picture but drops EXIF, XMP and GPS fields. JPGs are saved at high quality (95%); PNG and WebP stay in their formats.
5. Optionally, load the cleaned copy back into the viewer. You should see "No EXIF metadata found — this image is already clean."

The file is read locally and never uploaded, which matters for a tool whose whole purpose is protecting your location.

**Note on HEIC and TIFF:** the viewer can read their metadata, but not every browser can re-encode those formats. If the clean download fails, convert the photo to JPG first with the [Image Converter](/online-tool/image-tools/image-converter) (in a browser that can open it), which also strips the metadata.

## Other ways metadata disappears

Several tools on this site re-encode images and therefore remove EXIF as a side effect, including the [Image Compressor](/online-tool/image-tools/image-compressor) and the resizer. If you're already shrinking a photo for upload, the metadata goes with it.

## FAQ

### Does removing metadata change how the photo looks?

No visible change for most photos. The pixels are redrawn and saved again; for JPGs that's one extra save at a high quality setting. Orientation is applied to the pixels first, so the photo stays upright.

### Can I remove only the location and keep the camera details?

Not with this tool. "Download without metadata" removes all of it at once. That's the safer default when you're unsure who will see the file.

### Is the photo's capture date gone too?

Yes. The file's own "date created" on your computer will become the download time, and the EXIF capture date is removed with the rest.

Before you share your next original photo, run it through the [EXIF Viewer](/online-tool/image-tools/image-exif-viewer) and see what it says about you.
