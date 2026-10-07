---
slug: how-fancy-text-generators-work-unicode-explained
tool: fancy-text-generator
title: How Fancy Text Generators Work (It's Not Actually a Font)
description: Why 𝐛𝐨𝐥𝐝 and 𝓈𝒸𝓇𝒾𝓅𝓉 text survives copy and paste, why some letters turn into boxes, and how styled characters affect length, search and accessibility.
tags: [Text, Unicode, How it works]
---

A fancy text generator doesn't change your font. It swaps each letter for a _different character_ that happens to look styled. "𝐀" isn't a bold "A": it's a separate Unicode character called Mathematical Bold Capital A (U+1D400). Because the style lives in the characters themselves, it survives copy and paste into bios, usernames and posts that don't let you pick a font. The trade-offs are that some devices can't display every character, and screen readers and search may not treat them as normal words.

Here's what's going on under the hood, with real examples from the generator.

## Where do these "fonts" come from?

Unicode, the standard that assigns a number to every character, includes several sets of styled Latin letters intended for mathematics, where bold **x**, italic _x_ and script 𝓍 can mean different things. Fancy text generators borrow them.

The main sources:

- **Mathematical Alphanumeric Symbols**: bold, italic, bold italic, sans-serif, script, fraktur (gothic), double-struck and monospace alphabets.
- **Enclosed Alphanumerics**: circled letters such as Ⓐ and circled digits such as ①.
- **Halfwidth and Fullwidth Forms**: the wide ｖａｐｏｒｗａｖｅ letters, originally for mixing Latin text with Chinese, Japanese and Korean.
- **Phonetic and other letters**: small caps such as ᴀʙᴄ, and look-alikes used for upside-down text.
- **Combining marks**: a character that draws a line through or under the previous one, used for s̶t̶r̶i̶k̶e̶t̶h̶r̶o̶u̶g̶h̶ and u̲n̲d̲e̲r̲l̲i̲n̲e̲.

## What does "Hello 2026" look like in each style?

Here's real output from the [Fancy Text Generator](/online-tool/text-tools/fancy-text-generator) for a selection of its 21 styles:

| Style                  | Output               |
| ---------------------- | -------------------- |
| Bold                   | 𝐇𝐞𝐥𝐥𝐨 𝟐𝟎𝟐𝟔           |
| Italic                 | 𝐻𝑒𝑙𝑙𝑜 2026           |
| Script                 | ℋℯ𝓁𝓁ℴ 2026           |
| Fraktur (gothic)       | ℌ𝔢𝔩𝔩𝔬 2026           |
| Double-struck          | ℍ𝕖𝕝𝕝𝕠 𝟚𝟘𝟚𝟞           |
| Circled                | Ⓗⓔⓛⓛⓞ ②⓪②⑥           |
| Squared                | 🄷🄴🄻🄻🄾 2026           |
| Full width (vaporwave) | Ｈｅｌｌｏ　２０２６ |
| Small caps             | ʜᴇʟʟᴏ 2026           |
| Upside down            | 9ᄅ0ᄅ ollǝH         |
| Strikethrough          | H̶e̶l̶l̶o̶ 2̶0̶2̶6̶           |

A few things stand out:

- **Digits aren't styled everywhere.** Unicode has bold, sans-serif bold, double-struck and monospace digits, but no italic or script digits, so those styles leave numbers plain.
- **Some letters come from elsewhere.** The script "H", "e" and "o" (ℋ, ℯ, ℴ) were encoded in Unicode's Letterlike Symbols block long before the math alphabets, so the math alphabet leaves gaps that generators fill with these older characters. They can look slightly different from their neighbors.
- **Squared styles are capitals only.** There are no lowercase squared letters, so everything is uppercased.
- **Upside-down text is reversed**, so it reads correctly when the screen is turned around.

## Why does styled text "cost" more characters?

On screen, "𝐇𝐞𝐥𝐥𝐨 𝟐𝟎𝟐𝟔" and "Hello 2026" are both 10 characters. Under the hood they're not the same size:

| Version                    | Visible characters | UTF-16 code units |
| -------------------------- | ------------------ | ----------------- |
| Hello 2026                 | 10                 | 10                |
| 𝐇𝐞𝐥𝐥𝐨 𝟐𝟎𝟐𝟔 (bold)          | 10                 | 19                |
| H̶e̶l̶l̶o̶ 2̶0̶2̶6̶ (strikethrough) | 10                 | 19                |

The math alphabets sit outside Unicode's Basic Multilingual Plane, so each letter takes two UTF-16 code units, which is how JavaScript and many apps count string length. Strikethrough adds a combining mark after every character. Depending on how a platform counts, your 30-character display name might be rejected as too long. Check with the [Character Counter](/online-tool/text-tools/character-counter) before you hit a limit.

## Why do some characters show as boxes?

A character only displays if the viewer's device has a font that contains it. Bold, italic and script are widely supported. Rarer ones, such as squared letters or some upside-down look-alikes, may show as empty boxes (often called "tofu") on older phones or computers. What looks perfect on your screen can break on someone else's.

## What about screen readers and search?

Because these are different characters, software that expects normal letters may struggle:

- **Screen readers** may spell the text out character by character, announce it as "mathematical bold capital H…", or skip it entirely.
- **Search** may not match. Someone searching your profile for "Hello" may not find "𝐇𝐞𝐥𝐥𝐨".

That's why the tool suggests using styled text for short accents, such as a name, a headline or a single emphasized word, while keeping important information in plain text. For an accessible alternative that still stands out, plain capitals from the [Text Case Converter](/online-tool/text-tools/text-case-converter) work everywhere.

## How to use the generator

1. Open the [Fancy Text Generator](/online-tool/text-tools/fancy-text-generator) and type or paste your text in **Your text**.
2. Scroll the list. Every style updates as you type.
3. Click **Copy** next to the style you like and paste it wherever you want.

Characters a style can't convert, such as punctuation in most styles, emoji or non-Latin letters, are left as they are.

## FAQ

### Will fancy text work in usernames?

It depends on the platform. Many allow it in display names and bios, but restrict handles to plain letters and digits.

### Can I mix styles in one line?

Yes. Copy one word from Bold and another from Script, and paste them together. They're all just characters.

### Is it the same as using bold in a word processor?

No. Word processor bold is formatting applied to normal letters. Fancy text replaces the letters themselves, so a spell checker will flag every styled word.

Give your bio a styled accent with the [Fancy Text Generator](/online-tool/text-tools/fancy-text-generator).
