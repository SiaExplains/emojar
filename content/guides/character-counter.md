---
slug: why-character-counts-differ-between-apps
tool: character-counter
title: Why Your Character Count Doesn't Match the Platform
description: Your counter says 158 but the app says you're over the limit? Here's why emoji, links, line breaks and SMS encoding change character counts.
tags: [Writing, Social Media, Troubleshooting]
---

Character counts differ between apps because "a character" isn't defined the same way everywhere. Some tools count every code point, some count what you see on screen, and platforms like X and SMS apply their own weighting rules. If a count looks wrong, the cause is almost always emoji, links, line breaks or non-Latin letters.

Below are the most common mismatches, what causes them, and how to leave yourself enough margin.

## How does this counter define a character?

The [Emojar Character Counter](/online-tool/text-tools/character-counter) counts Unicode code points. Every letter, digit, space, punctuation mark and line break is one character, and so is a simple emoji like 👍. You get four numbers at the top:

- **Characters**: everything, including spaces and line breaks
- **Without spaces**: the same total minus all whitespace
- **Words**: runs of letters and numbers
- **Letters**: alphabetic characters only, in any script

Under **Common limits**, your total is compared against five targets: X / Twitter post (280), SMS (1 message, GSM) (160), Meta description (160), Instagram caption (2,200) and LinkedIn post (3,000). A limit turns red with "over limit" as soon as you pass it.

## Problem 1: Emoji count more than you expect

A plain emoji is one code point, but many emoji are built from several:

| You see             | Counted here as |
| ------------------- | --------------- |
| 👍                  | 1               |
| 👍🏽 (with skin tone) | 2               |
| 👨‍👩‍👧 (family)         | 5               |
| 🇺🇸 (flag)           | 2               |

The family emoji is three people joined by two invisible "zero-width joiner" characters. Other apps may count the same emoji as 1, 2, or even 8 (if they count UTF-16 units). **Fix:** if you're near a hard limit, count each complex emoji as several characters and keep a buffer.

## Problem 2: X says something different

X doesn't use a raw count. Links are shortened to a fixed length no matter how long the URL is, and emoji and many East Asian characters are weighted more heavily than Latin letters. A tweet with a long URL can look over 280 here and still fit; a tweet full of emoji can look fine here and be rejected. **Fix:** use the counter to draft, then trust the platform's own counter for the final check.

## Problem 3: Your SMS splits into two messages

The 160-character SMS limit only applies when every character fits the basic GSM alphabet. Add one emoji or certain accented letters, and most phones switch to a different encoding where a single message holds just 70 characters. A 120-character text with one 😊 can arrive as two messages. **Fix:** for bulk or paid SMS, avoid emoji and curly quotes, or plan for 70 characters per segment.

## Problem 4: Line breaks and spaces

Every line break counts as one character, and so does each space. A five-line Instagram caption with a blank line between each paragraph includes at least eight break characters. That's why **Without spaces** exists: some school assignments and translation quotes are priced on characters excluding spaces. **Fix:** read the number your requirement actually asks for.

## Problem 5: The meta description still gets cut off

Google trims search snippets by pixel width, not by a strict character count. A 155-character description full of wide letters like "W" and "M" can be truncated sooner than one with narrow letters. **Fix:** treat 160 as a ceiling, put the important words in the first 120 characters, and don't rely on the ending being seen.

## A worked example

Take this draft post:

> Launch day 🚀 Our new app is live — try it free at example.com/launch

The counter shows 68 characters and 55 without spaces. It's comfortably under 280 for X and 160 for a single GSM SMS by length, but the rocket emoji and the long dash mean an SMS gateway would likely use the 70-character encoding, leaving only two characters of room.

## How to check a character count

1. Paste your text into **Your text**, or type directly.
2. Read **Characters** and **Without spaces** in the top tiles.
3. Scroll to **Common limits** and look for any line in red.
4. Edit in place; the numbers update instantly. Press **Clear** to reset.

The counting happens in your browser, so unpublished posts and private messages aren't sent anywhere.

If your limit is in words instead, use the [Word Counter](/online-tool/text-tools/word-counter).

## FAQ

### Does a space after a period count?

Yes. Every space is a character, including double spaces after periods and trailing spaces at the end of a line.

### Why is my count one higher than in my text editor?

The most likely culprit is a trailing line break that got copied along with your text. Click at the end of the box and press Backspace once to check.

### Do accented letters count as one character?

Usually yes. Occasionally text copied from a PDF stores "é" as an "e" plus a separate accent mark, which counts as two.

Check your next post or message in the [Character Counter](/online-tool/text-tools/character-counter) before you hit send.
