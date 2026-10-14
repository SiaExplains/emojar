---
slug: how-to-preview-open-graph-link-cards
tool: social-share-preview
title: 'How to Preview a Link Card Before You Share It on Social Media'
description: How Open Graph link cards are built, which image size and text lengths work, and a worked example of mocking up a share card before publishing.
tags: [Social Media, Open Graph, Marketing]
---

When you paste a link into Facebook, LinkedIn, X, Slack or a messaging app, the platform builds a card from the page's Open Graph tags: a title, a short description, the site's domain and an image. You can see roughly how that card will look before anything is published by typing those values into the [Social Share Preview](/online-tool/developer-tools/social-share-preview). It's a mockup built from what you type, not a reading of a live page, so it's most useful while you're still choosing the words and the image.

## What goes into a link card?

Most platforms read the same handful of tags from the page's `<head>`:

- **og:title**, the headline of the card.
- **og:description**, one or two lines underneath.
- **og:image**, the picture at the top or side.
- **og:url** or the page address, from which the card shows the domain.

If a tag is missing, platforms guess, often grabbing the page title and the first image they find, which is how cards end up showing a tiny logo. The [Meta Tag Generator](/online-tool/developer-tools/meta-tag-generator) produces the HTML for them.

## Which image size should you use?

The common large card layout is about 1.91:1, and 1200 × 630 pixels is the usual safe recommendation for Facebook and LinkedIn. X's large card is close enough that the same image works with only a slight crop. Some apps, especially messaging apps and narrow layouts, show a square or a small thumbnail instead.

The preview offers both shapes in **Image layout**:

- **Large image — 1.91:1 (1200 × 630 px)**
- **Square — 1:1 (1080 × 1080 px)**

Switching between them shows whether your image survives a square crop. Keep faces, logos and text near the centre.

Under the card, a size hint reports the image's real dimensions and ratio. If the ratio is close to the selected layout, it says the image matches. If not, it tells you the image will be cropped to fill the space. Images narrower than 600 pixels get an extra note, since some platforms fall back to a small thumbnail for them.

## How long can the title and description be?

There's no single limit, because each platform truncates at a different point and the cut depends on screen width. As a working rule, keep titles under about 60 characters and descriptions under about 160. The tool shows a live counter in each label, such as **Title (42/60)**, so you can see where you stand while you write. In the preview card, both the title and the description are clamped to two lines, which is roughly what you'll see in a busy feed.

## A worked example: a product launch post

Say you're announcing a new feature at `https://www.example.com/blog/dark-mode`. Fill in:

- **Title:** Dark mode is here: easier on the eyes at night
- **Description:** Switch themes in one click, or let the app follow your system setting. Here's how it works.
- **Page URL:** `https://www.example.com/blog/dark-mode`

The card shows `EXAMPLE.COM` as the domain. Only the host name is used, and a leading `www.` is dropped.

Next, choose the image. Drop a file from your device onto the upload area, or paste an address into **…or an image URL** and press **Load image**. Say your designer sent a 1600 × 1200 screenshot. The hint reads "Image is 1600 × 1200 px (1.33:1)" and warns that it will be cropped. Before it goes live, crop a 1.91:1 version with the [Image Cropper](/online-tool/image-tools/image-cropper), or resize it to the standard dimensions with the [Social Media Image Resizer](/online-tool/image-tools/social-media-image-resizer), then load the new file and check the hint again.

When you're happy, press **⬇ Download mockup PNG** to save a picture of the card you can drop into a review thread or a design doc.

## Local files versus image URLs

A file you choose from your device never leaves it. It's read by the browser and shown in the preview. The size limit is 15 MB.

Loading an image from a URL is different: the browser asks that site for the image, just as if you'd opened it in a new tab. It works for the on-screen preview, but the downloaded PNG can't include it, because browsers don't allow images from other sites to be drawn into a file you save. If you need the image in the mockup, download it and choose it as a local file.

## Common mistakes

**Trusting the mockup as the final word.** Facebook, LinkedIn, X, Slack and WhatsApp each crop and truncate slightly differently, and the tool doesn't fetch your page's real tags. After publishing, check the live page with each platform's own sharing debugger.

**Forgetting about caching.** Platforms store a card when a link is first shared and may keep showing the old version for days. Get the tags right before the first share, or ask the platform's debugger to refresh it.

**Tracking links in the card.** If you share a campaign link built with the [UTM Link Builder](/online-tool/developer-tools/utm-builder), the card still comes from the page's own tags, so the preview doesn't change.

## FAQ

### Does the preview read my website's tags?

No. It never fetches your page. Everything in the card is what you typed, which is why it works for pages that don't exist yet.

### Why is my image missing from the downloaded PNG?

You probably loaded it from a URL. Choose the file from your device instead and it will be included.

Mock up your next card in the [Social Share Preview](/online-tool/developer-tools/social-share-preview) before the link goes out.
