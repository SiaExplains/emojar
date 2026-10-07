---
slug: upside-down-vs-mirror-vs-backwards-text
tool: upside-down-text
title: "Upside Down, Mirror or Backwards Text: Which One Do You Need?"
description: Three ways to flip text look alike but behave differently. See real examples of each, which one survives a phone rotation, and when to skip them entirely.
tags: [Text, Unicode, Social media]
---

If you want text that reads correctly when someone turns their phone around, you need upside-down text: every letter swapped for a turned-over look-alike _and_ the order reversed. If you want text that looks like its reflection in a mirror, you need mirror text, which flips each line left to right. If you only want the letters written in reverse order with no special characters, that's plain backwards text, and it's a different tool altogether.

## What do the three options actually produce?

The [Upside Down Text Generator](/online-tool/text-tools/upside-down-text) has a **Flip** menu with three choices. Here's what each one does to the tool's own sample sentence, "Hello world! Can you read this?":

| Flip option                       | Output                            |
| --------------------------------- | --------------------------------- |
| Upside down (rotate 180°)         | ¿sᴉɥʇ pɐǝɹ noʎ uɐƆ ¡plɹoʍ ollǝH   |
| Mirror (left ↔ right)             | ⸮ꙅiʜƚ bɒɘɿ uoʏ nɒƆ !blɿow ollɘH   |
| Upside-down letters, normal order | Hǝllo ʍoɹlp¡ Ɔɐu ʎon ɹǝɐp ʇɥᴉs¿   |

And for comparison, plain backwards text (from Reverse Text) would be ".siht daer uoy naC !dlrow olleH": same letters, just in reverse order.

## Which option should you choose?

Work backward from what the reader will do:

- **They'll rotate the screen, or you want the "someone turned this over" effect:** choose **Upside down (rotate 180°)**. Because the order is reversed, the last letter comes first. Turn the result 180° and "Hello world!" reads normally.
- **You want a reflection, like writing on a shop window seen from inside:** choose **Mirror (left ↔ right)**. Each line is reversed and letters are swapped for mirrored forms such as ɘ for e and Ɔ for C. Lines stay in their original top-to-bottom order.
- **You want the flipped look but still want people to read left to right:** choose **Upside-down letters, normal order**. It's easier to puzzle out at a glance, handy for a short caption.
- **You just want letters in reverse order:** use [Reverse Text](/online-tool/text-tools/reverse-text) instead. It keeps ordinary letters and has extra modes for reversing word order or line order.

## How does multi-line text behave?

This is where Upside down and Mirror differ most. Take two lines:

```
line one
line two
```

**Upside down** treats the whole block as one object and rotates it, so the last line ends up on top:

```
oʍʇ ǝuᴉl
ǝuo ǝuᴉl
```

**Mirror** flips each line on its own and keeps the lines in place:

```
ɘno ɘnil
owƚ ɘnil
```

For a short poem or list, decide whether readers start at the top (mirror) or after rotating the screen (upside down).

## Why do some letters look unchanged?

There's no upside-down font. Each character is replaced by a different Unicode character that resembles the flipped shape: ɐ for a, ǝ for e, ɥ for h, ¡ for !. When no good twin exists, or the letter already looks the same when rotated, it passes through as is.

In upside-down mode, letters such as o, s, x, z, l and capitals like H, I, N, O, S, X and Z stay the same, as do 0 and 8, because they look fine rotated. Some swaps are pairs: d and p, b and q, n and u, 6 and 9, M and W. That's why "Mom" becomes "ɯoW": the m turns into ɯ and the capital M becomes W.

Accented letters, emoji and non-Latin scripts are kept unchanged. "café 😀 Ålesund" flips to "punsǝlÅ 😀 éɟɐɔ": the plain letters flip, the order reverses, but é, Å and the emoji stay upright. If your text is full of accents, the result will look patchy.

Mirror mode has its own, smaller set of look-alikes. Symmetrical letters like o, v, w, x, A, H, M, O, T and V are already their own reflection, so they don't need replacing.

## Can you flip it back?

Yes. The character map works both ways, so pasting flipped text into the box with the same option selected restores the original. "¿sᴉɥʇ pɐǝɹ noʎ uɐƆ ¡plɹoʍ ollǝH" run through Upside down again gives back "Hello world! Can you read this?".

## When should you not flip text at all?

- **Anything people need to understand.** Screen readers announce the look-alike characters by their real names, so ʇ reads as "turned t", not part of a word. Keep flipped text for decoration, not for dates, prices or instructions.
- **Usernames you need people to find.** Search treats ɐ and a as different characters, so a flipped handle is hard to look up.

## How do you flip text step by step?

1. Open the tool and type or paste your text into **Your text** (or click **Load sample** to try it).
2. Pick an option from the **Flip** menu. The **Flipped text** box updates as you type.
3. Click **Copy** and paste it into your post, bio or message. You can also download it as a .txt file.

Everything runs in your browser, so the text you type isn't sent anywhere. If you want the mirror option preselected, the [Mirror Text Generator](/online-tool/text-tools/upside-down-text/mirror-text) opens with it already chosen.

## FAQ

### Will upside-down text look the same on every phone?

Mostly, but not exactly. The characters come from several Unicode blocks, and each device draws them with its own fonts. A few rarer ones, such as ꓭ for an upside-down B, can look slightly off or show up as boxes on older systems.

### Does flipped text count as more characters?

Usually not. Each letter is swapped for one other character, so "Hello" flipped is still five characters. That's different from strikethrough or underline text, which adds a hidden mark after every letter and roughly doubles the count.

### Can I flip text inside an image?

No, this tool works on text characters only. To flip a photo or screenshot, use the [Image Flipper](/online-tool/image-tools/image-flipper) instead.

Ready to try it? Open the [Upside Down Text Generator](/online-tool/text-tools/upside-down-text) and paste in your text.
