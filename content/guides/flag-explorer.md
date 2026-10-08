---
slug: how-flag-emoji-work-regional-indicator-letters
tool: flag-explorer
title: How Flag Emoji Work, and Why Windows Shows Letters Instead
description: Flag emoji are two hidden letters that spell a country code. How regional indicator symbols work, why Windows shows DE instead of a flag, and how to quiz yourself.
tags: [Flags, Emoji, Unicode, Geography]
---

A flag emoji isn't a picture stored in Unicode. It's a pair of special letters, called regional indicator symbols, that spell a country's two-letter ISO code. When your device sees the pair 🇩 + 🇪, its emoji font swaps in the German flag. If the font has no flag artwork, as on Windows, you see the two letters instead. Nothing is broken; the text is the same either way.

## What are regional indicator symbols?

Unicode includes a block of 26 characters, one for each letter from A to Z, running from U+1F1E6 to U+1F1FF. On their own, they look like boxed capital letters. Unicode's emoji standard (Unicode Technical Standard #51) says that a valid pair of them should be displayed as the flag of the region with that ISO 3166-1 alpha-2 code.

This design solved a political and practical problem. Unicode doesn't have to decide which flags exist or how they look. It just points to the ISO country list, and phone and computer makers draw the artwork. That's also why the same flag can look slightly different from one platform to another: the colors and proportions come from each vendor's font.

## A worked example: building the German and Japanese flags

The [Flag Explorer](/online-tool/reference-tools/flag-explorer) creates each flag the same way an operating system would expect. It takes each letter of the ISO code and shifts it into the regional indicator range. The letter A becomes U+1F1E6, B becomes U+1F1E7, and so on.

| Country | ISO code | Regional indicators | UTF-8 bytes             | JavaScript length |
| ------- | -------- | ------------------- | ----------------------- | ----------------- |
| Germany | DE       | U+1F1E9 U+1F1EA     | F0 9F 87 A9 F0 9F 87 AA | 4                 |
| Japan   | JP       | U+1F1EF U+1F1F5     | F0 9F 87 AF F0 9F 87 B5 | 4                 |

Each regional indicator takes four bytes in UTF-8, so every country flag is eight bytes. In UTF-16, the encoding JavaScript and Windows use internally, each indicator is a surrogate pair. That's why a single flag reports a length of 4 in JavaScript code, and why some apps count one flag as two or four characters toward a character limit.

You can check any of this yourself. Open a country in the explorer, press the **Flag emoji** copy button, and paste the result into the [Unicode Character Explorer](/online-tool/reference-tools/unicode-character-explorer). It shows the two code points and their bytes.

## Why does Windows show letters instead of flags?

Windows ships the Segoe UI Emoji font, which has artwork for smileys, animals, food and most other emoji but not for country flags. When a browser on Windows meets a regional indicator pair, it falls back to drawing the two letters. So Germany appears as "DE" and Japan as "JP," usually as two separate boxed or plain letters.

A few points worth knowing:

- **The emoji is still there.** If you copy a "DE" from a Windows screen and paste it on a phone, it shows as the German flag.
- **Some apps bring their own emoji font.** Firefox, for example, bundles an emoji font on Windows, and many chat apps draw their own emoji images, so flags may appear in those even on Windows.
- **macOS, iOS, Android and most Linux desktops** include flag artwork.

The explorer is built with this in mind. It always prints the ISO code next to each flag, so the page stays useful whatever your font shows.

## What about England, Scotland and Wales?

Those flags use a different mechanism. Regional indicators only cover two-letter codes, and England, Scotland and Wales share the United Kingdom's code, GB. Unicode handles them with tag sequences: a black flag character followed by invisible tag letters that spell a subdivision code such as "gbeng," then an end tag. The Flag Explorer lists countries and territories by their ISO 3166-1 codes, so you'll find the United Kingdom there but not its constituent countries.

## Browsing and filtering the flags

The explorer covers 250 countries and territories:

1. **Search** by country, capital or ISO code. The box suggests "Brazil, Oslo, KR," and typing "Oslo" brings up Norway.
2. **Filter** by **Continent** and **Region**. Picking a continent narrows the region list to match, and it resets the region filter.
3. **Switch views** between **▦ Grid**, which shows large flags with names and codes, and **☰ Compact list**, a table with Flag, Country, Capital, ISO-2, ISO-3, Calling and Continent columns.
4. **Click a flag** to open the country's details: capital, currency, languages, calling code, domain, time zones and more, plus copy buttons.

## How does the quiz work?

Press **🎯 Quiz me** and the explorer picks up to 10 random flags from your current filters. Each question shows a large flag and four country names: the right answer and three others drawn from the same filtered set. After you answer, it tells you "Correct!" or names the right country, and adds the capital as a bonus fact. **Next flag →** moves on, and **See score** ends the round with your total and a **Play again** button.

Because the quiz uses your filters, you can practice one area at a time. Set **Region** to **Australia and New Zealand**, for example, and the pool has five entries: Australia, Christmas Island, Cocos Islands, New Zealand and Norfolk Island. The quiz then has five questions instead of ten, since it never repeats a flag in one round. If your filters leave fewer than four countries, it uses the whole world instead, so there are always enough choices.

For a longer game, there's also Guess the Flag in the games section of the site.

## FAQ

### Can I paste a flag emoji anywhere?

Yes. It's ordinary Unicode text, so it works in messages, documents, file names and code. Whether it displays as a flag depends on the font where you paste it.

### Why do some flags look different on my phone and my laptop?

Unicode only defines which letter pair means which country. Apple, Google, Samsung and others draw their own versions, so proportions and shades can vary.

### Where can I find more facts about a country?

Every flag opens the same details card as the [Country Explorer](/online-tool/reference-tools/country-explorer), which adds filters for currency, language and driving side. To see the time there, open the [World Time Zone Map](/online-tool/date-time-tools/world-time-zone-map).

Start browsing, or test yourself, in the [Flag Explorer](/online-tool/reference-tools/flag-explorer).
