---
slug: set-up-a-gaming-profile-username-password-avatar
title: 'Set Up a New Gaming Profile: Username, Password, Avatar and Bio'
description: 'Pick a gamer tag, test the password before you reuse it, draw a pixel-art avatar and dress up your bio with ASCII art and crossed-out text, all in the browser.'
tags: [Gaming, Security, Pixel Art, How-to]
---

To set up a new gaming or community profile, you need four things: a username you can live with, a password nobody will guess, a square avatar and a short bio. On Emojar the [Username Generator](/online-tool/security-generators/username-generator) gives you handle ideas, the [Password Strength Checker](/online-tool/security-generators/password-strength-checker) tells you whether your password is as safe as you think, the [Pixel Art Editor](/online-tool/image-tools/pixel-art-editor) draws the avatar, and [Image to ASCII Art](/online-tool/image-tools/image-to-ascii-art), the [Strikethrough Text Generator](/online-tool/text-tools/strikethrough-text) and the [Text Repeater](/online-tool/text-tools/text-repeater) take care of the bio. All six run in your browser. Your drawing and your images are not uploaded, and the password is checked on the page.

The example below follows one person through it. Mina is joining a new online game with a friend group that also has a community server, and she wants one handle and one avatar for both. Her first idea for a password is Shadow2009!, the same one she has used since school.

## How do you find a gamer tag that isn't taken everywhere?

Open the Username Generator and set **Style** to **Gamer (ShadowVolt)**. Every click on **Generate more** gives you 20 names. In the gamer style, two words from a list like Shadow, Pixel, Nova, Glitch and Volt are joined and capitalised. With **Add numbers** ticked, you get a short ending such as X, Pro, 99, 007 or 1337, or a random number under 1,000.

Mina likes drawing, so she types "pixel" into **Include a word (optional)**. The word is placed somewhere among the two generated words, giving names along the lines of PixelGhostRift. She leaves **Separator** on **None**, since some sites refuse dots and hyphens, and lowers **Max length** from 20 to 15. The tool's notes point out that X allows 15 characters, so a handle that fits there will fit nearly anywhere. Names longer than the limit are cut off at that length, so read each one before you copy it.

The generator can't check whether a name is free on any site. Copy three or four favourites with the copy buttons and try them in order on the sign-up page. A handle with no birth year or real name in it is also safer to reuse across sites, because it gives nothing away about you.

## Is a password like Shadow2009! good enough?

Type it into the Password Strength Checker. It is checked as you type and never leaves the page. **Show** reveals what you typed if you want to check for typos.

For Shadow2009! the rating is **Very weak**. The checker lists four problems: **Common password** ("shadow" is on its list of the most-used leaked passwords), **Dictionary words**, **Looks like a year or date** (2009) and **Common shape**, meaning a capital letter, a word, digits and an exclamation mark. Under a rate-limited online attack of 100 guesses an hour, the estimate is 4.8 minutes. In the other three scenarios, from 10 guesses a second up to an offline attack on a fast hash, it shows "instantly".

Mina's second thought is to reuse her new tag with numbers, ShadowVolt1337. That scores **Fair**, with an estimate of 4.8 months against a fast offline hash. It still contains dictionary words, and the username is public on the profile, so anyone looking at her page already has half of it.

A random 16-character string with upper and lower case letters, digits and symbols (the tool's FAQ asks for 12 characters at least and 16 or more if possible) comes out **Very strong**, with crack times "longer than the age of the universe" for three of the four scenarios. Get one from a password manager, use it for this account only, and turn on two-factor login if the game offers it.

**Check known breaches** is optional. It works out the SHA-1 hash of the password in your browser and sends only the first 5 characters to Have I Been Pwned, then compares the matches on the page. The FAQ still advises testing a similar password instead of your real one.

## How do you draw a pixel-art avatar?

Open the Pixel Art Editor and set **Grid size** to 32 (the choices are 8, 16, 24, 32, 48 and 64). Turn on **Horizontal mirror (left ↔ right)**, so every pixel you place on one side of a face appears on the other side too, and you only draw half the head.

Draw the outline with **Pencil**, fill large areas like the background or a hood with **Fill**, and use **Eyedropper** to pick a colour you already used. **Undo** goes back a step if a fill spills out. With the canvas focused, the arrow keys move a cursor and Space or Enter uses the current tool, which helps on a laptop trackpad.

Under **Export**, set **Scale** to **8× (256px)** and press **⬇ PNG**. The 32×32 drawing becomes a 256×256 square image with sharp edges, because each pixel is scaled up as an exact block. The PNG keeps a transparent background, so the avatar sits on whatever colour the site uses behind it. If a site wants a bigger upload, 16× gives 512px.

The editor saves the drawing in your browser by itself, so you can come back later and change the colours. Private browsing or clearing site data deletes it, so keep the exported PNG somewhere safe.

## How do you add ASCII art and crossed-out text to a bio?

For a text version of the avatar, drop the exported PNG into Image to ASCII Art. Set **Width** to 32 characters and **Characters** to **Blocks**. Because each character covers a block of the image twice as tall as it is wide, the square avatar comes out as 32 × 16 characters. Transparent pixels count as white, so the background turns into spaces. Tick **Invert (for dark backgrounds)** if the server uses a dark theme, then press **Copy text**. ASCII art only lines up in a monospace font, so paste it inside your chat's code formatting.

For a joke in the bio, Mina types "casual noob" into the Strikethrough Text Generator with the **Strikethrough** style and writes "ranked grinder" after it. The line is a Unicode combining mark added after every character, so it still shows in places that strip bold and italics. It doubles the length, though: "casual noob" is 11 characters, and the struck-through version counts as 22. With **Also mark spaces (one continuous line)** ticked, which is the default, the line runs through the space as well. **Remove these lines (clean text)** gives you the plain words back.

To frame the bio, type ═ into the Text Repeater, set **Repeat (times)** to 16 and **Separate with** to **Nothing**. You get a 16-character divider to put above and below the text. The tool allows 1 to 10,000 repeats.

## FAQ

### Can the Username Generator tell me if a name is available?

No. It only suggests names, and the page says availability isn't checked. Copy a few favourites and try them on the site where you are signing up.

### Is my password sent anywhere when I check it?

The strength check runs on the page. Only if you click "Check known breaches" does the browser send the first 5 characters of the password's SHA-1 hash to Have I Been Pwned. The password and its full hash stay on your device.

### What size should a pixel-art avatar be?

Draw at 32×32 and export the PNG at 8× for a 256px square, or at 16× for 512px. The edges stay sharp at any scale because pixels are enlarged as exact blocks.

### Why does my crossed-out bio go over the character limit?

Every character gets a hidden combining mark after it, so the text counts as about twice as long. "casual noob" (11 characters) becomes 22.

More tools for this are in [Security & Generators](/online-tool/security-generators), [Image Tools](/online-tool/image-tools) and [Text Tools](/online-tool/text-tools).
