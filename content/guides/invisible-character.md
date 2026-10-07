---
slug: invisible-character-not-working-how-to-fix
tool: invisible-character
title: Invisible Character Not Working? Fixes for Names and Hidden Bugs
description: Why apps reject blank names, why a pasted password suddenly fails, and how to find and remove zero-width spaces and other hidden characters.
tags: [Unicode, Troubleshooting, Text]
---

If an invisible character doesn't work, the app is almost always trimming or blocking that specific character, so the fix is to try a different one: Hangul Filler (U+3164) first, then Braille Pattern Blank (U+2800), then Halfwidth Hangul Filler (U+FFA0). The opposite problem, text that contains characters you can't see, is fixed by pasting it into a detector that names each hidden character and gives you a clean copy.

## Why does the app say my name or message is empty?

Most sign-up forms and chat apps run the text through a "trim" step before checking whether it's empty. Trimming removes anything the system treats as whitespace, and Unicode has a long list of those. In JavaScript, for example, the built-in trim removes the No-Break Space (U+00A0), the Em Space (U+2003) and the Ideographic Space (U+3000) just like a normal space. Paste one of those as a "blank" name and the app sees nothing at all.

The characters that survive are the ones that aren't classified as spaces:

| Character | Code point | Why it often gets through |
| --- | --- | --- |
| Hangul Filler | U+3164 | Classified as a letter, not a space |
| Braille Pattern Blank | U+2800 | A symbol (an empty Braille cell), not trimmed |
| Halfwidth Hangul Filler | U+FFA0 | A narrower letter-class filler |
| Zero Width Space | U+200B | Not whitespace, but many apps strip it on purpose |

So start with Hangul Filler, switch to Braille Pattern Blank for messages and bios, and keep Halfwidth Hangul Filler as the fallback.

## Why does the blank name work in one place but not another?

Each app and game sets its own rules. Some block known blank characters, some require at least one visible letter, and some clean names on the server after you save, so a name that looked fine can be rejected later. If a game's terms forbid blank names, no character will reliably get around that, so check the policy first.

## Why won't my password or code match, even though it looks identical?

Both strings look the same on screen, which makes this the most frustrating hidden-character bug. Text copied from web pages, PDFs, chat apps and word processors often carries extra characters along:

- **Zero Width Space (U+200B)** inside a word or token, often from a website that inserts it so long words can wrap.
- **No-Break Space (U+00A0)** instead of a normal space, very common in text copied from documents and HTML.
- **Zero Width No-Break Space, or BOM (U+FEFF)** at the very start of a file, which can break a first line of code or the first column header in a CSV.
- **Word Joiner (U+2060)** or **Soft Hyphen (U+00AD)**, both invisible in most places.

Here is a worked example. Suppose a password was copied as "pass", a Zero Width Space, "word123" and a trailing No-Break Space. It looks like `password123` but is 13 characters long instead of 11, so it never matches. Pasting it into the detector reports **Found 2 hidden characters**, listed as one Zero Width Space and one No-Break Space. With the space option on, the clean copy is "password123" plus a normal trailing space; with it off, you get exactly `password123`.

A quick second check: paste the suspicious text into the [Character Counter](/online-tool/text-tools/character-counter). If the count is higher than the characters you can see, something invisible is in there.

## Why is my text displayed in the wrong order?

Bidirectional control characters change how text is drawn without changing what's stored. A Right-to-Left Override (U+202E) makes everything after it display backwards, which has been used to disguise file names. Left-to-Right and Right-to-Left Marks (U+200E, U+200F) are legitimate in mixed Arabic, Hebrew and English text but cause odd cursor jumps elsewhere. The detector recognizes all the common marks, embeddings, overrides and isolates.

## How to fix it with the tool

The [Invisible Character tool](/online-tool/text-tools/invisible-character) has three sections, and each one solves a different problem.

1. **Copy an invisible character.** Eight useful characters are listed with their code point and a note, including Hangul Filler, Braille Pattern Blank, Zero Width Space, Word Joiner, No-Break Space, Em Space and Ideographic Space. Press **Copy** next to the one you want.
2. **Blank text generator.** Pick a **Character** from the same list and set **How many** (1 to 1,000), then press the copy button. Use this when an app needs a longer blank, or for spacing in a bio. The [Blank Text Generator](/online-tool/text-tools/invisible-character/blank-text-generator) page opens with Braille Pattern Blank already selected.
3. **Find and remove hidden characters.** Paste into **Paste text to check**. The tool lists each hidden character with a count, shows your text with every one marked by a short label such as ZWSP or NBSP (hover for the full name), and fills **Clean text** below.

The checkbox **Turn unusual spaces into normal spaces (instead of deleting them)** is on by default. Keep it on for prose, so "this", a No-Break Space and "text" becomes "this text" rather than "thistext". Turn it off for passwords, IDs and code, where any stray space is a bug. Zero-width characters and fillers are always removed.

The check runs in your browser, so a pasted password or private message isn't sent anywhere.

## Will cleaning break my emoji?

No. Many emoji are built from several characters glued together with a Zero Width Joiner (U+200D). The woman technologist, for example, is a woman, a joiner and a laptop. The detector skips a joiner when it sits between two emoji, so it isn't reported and stays in the clean copy. A joiner between ordinary letters is still flagged.

## FAQ

### Is a Hangul Filler the same as a space?

No. It's a letter-class character from the Korean Hangul block that happens to draw nothing. That's why it survives trimming, and also why a search for spaces won't find it.

### Why does a blank character show up as a box?

A box means the device's font has no drawing for that character. It's more likely with the less common fillers. Try Braille Pattern Blank or a different filler, and check how it looks on the other person's device if appearance matters.

### Can I remove only one kind of hidden character?

The detector removes all of them at once. To target a single character, use [Find and Replace](/online-tool/text-tools/find-and-replace), tick **Regular expression**, search for an escape such as `\u200B` and leave the replacement empty.

Try the fixes above with the [Invisible Character tool](/online-tool/text-tools/invisible-character).
