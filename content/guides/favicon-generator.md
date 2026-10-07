---
slug: favicon-not-showing-or-blurry-causes-and-fixes
tool: favicon-generator
title: Favicon Not Showing or Looking Blurry? Causes and Fixes
description: Old icon stuck in the tab, a fuzzy or tiny logo, a black square on iPhone. The usual favicon problems, why they happen and what to change for each one.
tags: [Favicon, Web Design, Troubleshooting]
---

When a favicon doesn't appear, the cause is almost always one of three things: the files aren't where the HTML says they are, the browser is still showing a cached copy of the old icon, or old `<link>` tags are pointing somewhere else. When it appears but looks bad, the source image is usually the problem: too detailed, too wide, or too small for the sizes it has to fill.

Below are the problems people run into most, with the fix for each. The examples use the files produced by the [Favicon Generator](/online-tool/image-tools/favicon-generator).

## What does a complete favicon set contain?

It helps to know what you're debugging. **Download favicon package (ZIP)** gives you eight files:

| File                         | Size              | Used by                                    |
| ---------------------------- | ----------------- | ------------------------------------------ |
| `favicon.ico`                | 16, 32 and 48 px  | Browsers that request `/favicon.ico`       |
| `favicon-16x16.png`          | 16 × 16           | Browser tabs                               |
| `favicon-32x32.png`          | 32 × 32           | Tabs on high-density screens, bookmarks    |
| `apple-touch-icon.png`       | 180 × 180         | iPhone and iPad home screens               |
| `android-chrome-192x192.png` | 192 × 192         | Android home screens, via the manifest     |
| `android-chrome-512x512.png` | 512 × 512         | Installed web apps, via the manifest       |
| `site.webmanifest`           | text              | Lists the Android icons, name and colors   |
| `favicon-html.txt`           | text              | The tags to paste into your page           |

If you only want the ICO file, **favicon.ico only** downloads just that.

## Problem: the favicon doesn't show at all

### The files aren't in the site root

The HTML the tool gives you uses root paths:

```html
<link rel="icon" href="/favicon.ico" sizes="48x48">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<meta name="theme-color" content="#ffffff">
```

The leading slash means "at the top level of the domain". If you put the files in an `/images/` or `/assets/` folder, either move them up to the root or edit every path in the tags and in `site.webmanifest`. A quick check: open `yoursite.com/favicon.ico` directly. If it doesn't load, the browser can't find it either.

### Old tags are still in the page

Themes and site builders often add their own icon tags. If an older `<link rel="icon">` sits earlier in the `<head>`, the browser may use that one instead. Search your template for `rel="icon"` and `apple-touch-icon` and remove the duplicates.

### The browser is showing a cached icon

Browsers keep favicons for a long time, separately from the rest of the page cache. After replacing an icon, check in a private window or a different browser before assuming something is wrong. A normal reload often isn't enough.

## Problem: the icon looks blurry or muddy

At 16 × 16 pixels you have 256 pixels in total, and text, thin lines and small details turn into gray mush. The fixes:

- **Simplify.** Use the logo's symbol, a single letter or a bold shape instead of the full logo with a tagline.
- **Reduce padding.** The **Padding** slider runs from 0% to 25% of the icon size. At 25%, a 16-pixel icon has 4 pixels of empty space on each side, which leaves only 8 × 8 pixels for the logo itself. Keep it at or near 0% for tab icons.
- **Use the previews.** The tool shows 16 px, 32 px, 48 px and Apple 180 versions side by side, plus a mock browser tab, and the small sizes are shown pixelated so you see them honestly.

### A small SVG gets soft at large sizes

SVGs are welcome as input, but they're turned into pixels at their own declared size first. An SVG whose `width` attribute is 24 becomes a 24-pixel image, which is then stretched to 192 and 512 pixels for the Android icons and looks soft. If the SVG declares no size, a 512-pixel default is used. The fix is to open the SVG in a text editor and set `width` and `height` to 512 or more, or export a large PNG first with [SVG to PNG](/online-tool/image-tools/svg-to-png).

## Problem: a wide logo becomes a thin sliver

Favicons are square. With **Fit** set to **Show the whole image**, a 1000 × 250 wordmark is scaled to fit the width, so at 16 pixels it ends up 16 × 4 pixels: technically complete, practically invisible. Either switch to **Crop to fill the square**, which keeps the middle and cuts the sides, or better, make a square version of the logo that uses only its icon or first letter.

## Problem: a black or white square on the iPhone home screen

The Apple touch icon is never transparent. The tool always fills it with the **Background** color (marked "used for the Apple icon" while **Transparent background** is ticked), because iOS fills transparent areas with black. If your iPhone icon looks wrong, pick a background color that suits the logo. The Apple icon also skips the **Rounded corners** setting, since iOS rounds home-screen icons itself.

## Problem: the installed app has the wrong name or color

The name under an Android home-screen icon comes from `site.webmanifest`. Fill in **Site name (for the web app manifest)** before downloading; it's used for both `name` and `short_name`. **Theme colour** goes into the manifest and the `theme-color` meta tag, which some mobile browsers use to tint the address bar.

## Problem: an older program won't open the .ico

Each size inside this ICO file is stored as a PNG. Current browsers and Windows since Vista read that without trouble, but some very old icon editors expect the older bitmap format inside ICO files. For the web, it isn't a concern.

## FAQ

### Do I still need favicon.ico if I have the PNG files?

It's worth keeping. Some browsers and tools request `/favicon.ico` directly without reading your HTML, and one small file covers them all.

### Can I round the corners of the tab icon?

Yes. **Rounded corners** goes from 0% to 50%, where 50% makes a circle. It applies to the ICO, the PNG favicons and the Android icons, but not to the Apple icon.

Everything is generated in your browser. Make or fix your icon set with the [Favicon Generator](/online-tool/image-tools/favicon-generator).
