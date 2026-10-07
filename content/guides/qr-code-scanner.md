---
slug: why-wont-my-qr-code-scan-and-how-to-fix-it
tool: qr-code-scanner
title: Why Won't My QR Code Scan? Common Causes and Fixes
description: Blurry photos, low contrast, glare, a blocked camera or a code that isn't a QR code at all. How to fix a QR code that won't read, and scan it safely.
tags: [QR Codes, Troubleshooting, Security]
---

Most QR codes that won't scan fail for one of four reasons: the image is blurry or too small, the contrast between the code and its background is too low, part of the code (including its blank border) is cut off, or the camera can't be used at all. Fixing the specific cause, often just by uploading a screenshot instead of using the camera, solves nearly every case.

Below is a troubleshooting guide, ordered from most to least common problem, followed by a quick safety check for the codes that do scan.

## First, try both scanning methods

The Emojar [QR Code Scanner](/online-tool/security-generators/qr-code-scanner) reads codes two ways:

- **Start camera** uses your device's rear camera and stops as soon as it finds a code.
- **Choose an image / screenshot** decodes a PNG, JPG, WebP or other image file.

If one method fails, try the other. A code on your own screen (in an email, PDF or chat) is much easier to read from a screenshot than by pointing a second phone at the display. A code on a poster is usually easier with the live camera, because you can move closer and refocus.

Both methods work entirely in your browser. Camera frames and images are processed in memory and never uploaded.

## Problem 1: The image is blurry or the code is too small

Each small square in a QR code is a "module." The decoder needs to see clear edges between modules. A dense code, such as a long URL or a vCard, has many small modules and needs a sharper image.

**Fixes:**

- Move closer so the code fills about half the camera frame, then hold still for a second to let autofocus settle.
- For screenshots, zoom in on the code _before_ taking the screenshot, or crop the image around the code.
- Don't worry about huge phone photos. The scanner automatically scales images down to about 2,000 pixels on the longest side, which is plenty for detection.

## Problem 2: Low contrast or a busy background

Scanners look for the three large square "finder patterns" in the corners. Designer codes with light gray on white, colored gradients or patterned backgrounds can hide them.

**Fixes:**

- Improve the lighting; it matters more than you'd expect.
- For an image, increase the contrast in your photo editor before uploading.
- **Inverted codes** (light modules on a dark background) are fine here: the scanner tries both normal and inverted readings automatically.

## Problem 3: Part of the code is cut off

A QR code needs all three finder patterns plus a blank margin, called the quiet zone, around it. Screenshots cropped tightly to the edge of the code, codes printed over a fold, and stickers peeling at a corner all cause failures.

**Fixes:**

- Capture a little blank space around all four sides.
- If the code is damaged, it may still read thanks to built-in error correction (up to about 30% damage at the highest level), but only if the damage misses the corner squares.

## Problem 4: Glare, curves and angles

Laminated menus, glossy packaging and codes on bottles reflect light or bend the grid.

**Fixes:**

- Tilt the code (or yourself) slightly to move the reflection off it.
- Scan curved codes straight on, with the code centered in the frame.

## Problem 5: The camera won't start

The tool shows a specific message for each case:

| Message                                     | Cause                             | Fix                                                                              |
| ------------------------------------------- | --------------------------------- | -------------------------------------------------------------------------------- |
| Camera permission was denied                | You or the browser blocked access | Allow camera access for the site in your browser's site settings, then try again |
| No camera was found                         | Desktop without a webcam          | Upload a screenshot or photo instead                                             |
| Your browser does not support camera access | Older or restricted browser       | Use the image upload option                                                      |

## Problem 6: It isn't a QR code

This scanner reads QR codes only. Linear barcodes on retail products (EAN, UPC, Code 128), Data Matrix codes on parcels and app-specific codes such as some social media "scan me" tags use different formats and won't be detected. If the image contains several QR codes, crop it so only the one you want is visible.

## Once it scans: check before you open

The decoded content appears in full, with a **Copy** button. If it's a web address, an **Open link** button appears alongside a warning. Pay attention to it. QR codes are increasingly used for phishing, sometimes called "quishing," because people can't see where a code leads before scanning it. A fake sticker on a parking meter is a classic example.

Before opening a link, check:

1. **The domain.** Read it right to left from the first single slash: in `https://pay.city-parking.example.co/meter`, the real domain is `example.co`, not `city-parking`.
2. **Look-alike spellings**, such as `rnicrosoft` for `microsoft`.
3. **URL shorteners**, which hide the destination entirely. Be extra cautious.
4. **The context.** Does a parking meter really need you to enter card details on a website?

Content that isn't a link, such as a Wi-Fi network string, contact card or plain text, is shown as text, so you can read exactly what it contains. Encoded characters like `%20` can be made readable with the [URL Decoder](/online-tool/developer-tools/url-decoder).

## FAQ

### Can I scan a QR code that's already on my phone screen?

Yes. Take a screenshot, then upload it with the image option on the same phone. No second device is needed.

### Why does a code scan here but not in my camera app?

Different apps use different decoders and handle contrast, inversion and damage differently. This page uses your browser's built-in detector where available and a JavaScript decoder as a fallback, which can succeed where another app fails, and vice versa.

Have a stubborn code? [Try the QR Code Scanner](/online-tool/security-generators/qr-code-scanner).
