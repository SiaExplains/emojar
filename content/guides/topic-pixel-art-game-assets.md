---
slug: turn-a-pixel-art-sprite-into-game-and-website-assets
title: Turn One Pixel-Art Sprite Into Game, Web and README Assets
description: Draw a 16×16 sprite, animate a walk cycle, export a sprite sheet and GIF, then reuse it as a favicon, a Base64 CSS icon and ASCII art for a README.
tags: [Pixel Art, Game Development, Images, How-to]
---

If you're making a small game, one 16×16 sprite can cover most of the art you need around it. Draw and animate it in the [Pixel Art Editor](/online-tool/image-tools/pixel-art-editor), export a sprite sheet for the game engine and an animated GIF for the game's page, and then use the same drawing three more times: as a favicon from the [Favicon Generator](/online-tool/image-tools/favicon-generator), as a tiny icon inlined in CSS with [Image to Base64](/online-tool/image-tools/image-to-base64), and as text art for the README with [Image to ASCII Art](/online-tool/image-tools/image-to-ascii-art). All four are free and need no account.

The example here is a weekend game jam. The game stars a small orange fox, and by Sunday evening you need a playable build, a web page for it and a repository someone else can open. There's no time to draw something new for each of those, so everything starts from the fox.

## What grid size should a game sprite use?

The editor offers square grids from 8 × 8 to 64 × 64 and opens at 16 × 16. Many retro-style sprites use 16×16, 24×24 or 32×32, and favicons are usually 16×16 or 32×32, so drawing at 16 × 16 means the favicon later is the same size as the sprite.

Pick an orange from the colour picker or the palette. Colours you've used show up under **Recent colours**. Sketch the outline with **Pencil**, fill the body with **Fill**, and switch to **Eyedropper** to grab a colour that's already on the canvas. Each tool has a keyboard shortcut (P, E, F and I), and undo goes back up to 100 steps. A fox seen from the front is symmetrical, so **Horizontal mirror (left ↔ right)** copies each pixel onto the other side as you draw. For a side view, which a walking fox needs, turn the mirror off again.

## How do you animate a walk cycle?

You can do a simple walk in four frames. Once the first pose looks right, click **Duplicate** in the Frames panel. That copies the frame, so you only move the legs. With **Onion skin (show previous frame)** on, the frame before shows faintly underneath while you redraw. After three rounds of this you have four frames. One animation can have up to 64 frames.

When there's more than one frame, the panel shows a preview. Set **Frames per second** (1 to 24) to 8 and press **▶ Play preview**. At 8 fps each frame shows for 125 ms, and a four-frame cycle repeats twice per second. The editor saves the drawing, its frames and your recent colours in this browser's local storage, so closing the tab won't lose it, but clearing site data or a private window will.

## Which export should go into the game?

Every export uses the **Scale** you pick, from 1× to 32×. On a 16 × 16 grid the menu runs from **1× (16px)** to **32× (512px)**. The editor scales up in whole blocks, so the edges stay sharp at every size.

- **⬇ Sprite sheet** puts every frame side by side, up to 8 per row. At 4×, the four fox frames are 64 px each, giving a 256 × 64 PNG with the file name `pixel-art-sheet-4x64px.png`. Tell your engine the frames are 64 × 64 and it can slice the strip.
- **⬇ PNG** and **⬇ SVG** save only the current frame. The SVG merges same-coloured pixels in each row into a single rectangle, so the file stays small and scales to any size.
- **⬇ Animated GIF** saves all the frames at the frame rate you set, looping, for the game's page. At 8× the GIF is 128 × 128, saved as `pixel-art-4f.gif`.

The PNG, SVG and GIF exports keep a transparent background, so the fox sits on whatever background colour your page or level uses.

## How do you make a favicon from the sprite?

Export the first frame with **⬇ PNG** at **32× (512px)**. The Favicon Generator recommends a square image of 512 px or larger, and 512 divides evenly by 16, so each pixel of the sprite lines up with one pixel of the 16 px icon. Load that file in the Favicon Generator and leave **Fit** on **Show the whole image** and **Padding** at 0%. Padding would only make the fox smaller in the tab. Keep **Transparent background** ticked, but still choose a **Background** colour. iOS fills transparent parts of touch icons with black, so the 180 px Apple icon always uses that colour.

Type the game's name into **Site name (for the web app manifest)** and check the 16 px preview and the mock browser tab. Then click **⬇ Download favicon package (ZIP)**. Inside you get `favicon.ico` (with 16, 32 and 48 px sizes in one file), the 16 and 32 px PNGs, `apple-touch-icon.png`, the 192 and 512 px Android icons, `site.webmanifest` and `favicon-html.txt`. That last file holds the tags for the page's `<head>`. There's also a **⬇ favicon.ico only** button.

## Can you put a small sprite straight into CSS?

Yes, and it suits a loading indicator or a cursor-sized icon on the game page. Export the fox at **1× (16px)** and drop that PNG into Image to Base64. The tool shows the file size next to the Base64 size, then gives four outputs to copy: **Data URI**, **Base64 only**, **HTML `<img>`** and **CSS background**. The CSS one is ready to paste as `background-image: url("data:image/png;base64,…");`. The icon then arrives with the stylesheet, with no separate request.

Base64 adds about 33% to a file's size, and an inlined image can't be cached on its own. That doesn't matter for a 16 × 16 sprite, and the tool warns you when an image is over 100 KB.

## How do you turn the sprite into ASCII art for a README?

Code blocks in a GitHub README use a monospace font, and so does a terminal, so ASCII art of the fox works in either. Load the 512 px PNG into Image to ASCII Art and set **Width** to 32 characters (the slider runs from 20 to 240). Characters are about twice as tall as they are wide, so each one samples a block 16 px wide and 32 px tall here, and the result is 32 × 16 characters. Each sprite pixel becomes two characters side by side, and each row of the sprite becomes one line of text, so the fox keeps its proportions.

The **Standard** character set runs from `@` for dark areas to a space for light ones. Transparent pixels count as white, so the background around the fox turns into spaces. **Blocks** uses shaded block characters and **Two-tone** uses only `#` and spaces. Leave **Invert (for dark backgrounds)** off for a transparent sprite, because it flips that white background into the densest character. Then use **Copy text** or **⬇ .txt** and paste the result inside a fenced code block, or it won't line up. **Colour** gives a coloured preview and PNG, but a .txt file can't store colour.

These four tools run in your browser. The sprite and the files you make from it are processed on your own device and not uploaded.

## FAQ

### Can I draw pixel art on a phone?

Yes. Touch drawing works on phones and tablets. You can also draw without a mouse: focus the canvas, move with the arrow keys and press Space or Enter to use the current tool.

### Does the animated GIF keep a transparent background?

Yes. The GIF uses an exact palette of your colours with true transparency, and each frame is cleared before the next one is drawn, so empty areas don't show the previous frame.

### Which favicon sizes do I need for a game page?

A `favicon.ico` with 16, 32 and 48 px inside, a 180 × 180 Apple touch icon, and 192 and 512 px PNGs for Android and installed web apps. The Favicon Generator's ZIP includes all of them and the HTML to link them.

### Why does my ASCII art look stretched when I paste it?

It needs a monospace font, where every character is the same width. Paste it into a code block, a plain-text editor or a chat's code formatting.

More drawing, icon and conversion tools are in [Image Tools](/online-tool/image-tools).
