---
slug: fit-an-application-essay-into-a-character-limit
title: Fit an Application Essay Into a Character-Limited Form
description: Before pasting an essay into an application form, strip hidden characters, fix doubled words and caps-lock titles, and check sentences and length.
tags: [Text, Writing, Students, How-to]
---

To get an essay into an online application form that has a character limit, clean it before you count it. Text copied from a word processor or a web page can carry invisible characters that the form counts too, a doubled word like "the the" is easy to miss, and a title typed with caps lock on needs fixing. Once those are sorted, check the sentence lengths, then count the characters against the form's limit. Emojar has a small browser tool for each step, and none of them upload your text.

The example in this guide: you're applying for a summer scholarship, and the form's personal statement box takes 1,500 characters. You wrote the answer in a word processor, under a heading you typed in capitals, and pasted in a line from your volunteering notes. One paragraph of it looks like this:

```text
Last summer I volunteered at a seal rescue centre in Cornwall. I spent most of my time cleaning pools, but I also learned to log feeding notes for the the
vets every morning. That job showed me how much careful data matters. I want to study marine biology so I can do that work properly.
```

It looks fine on screen, but it hides a no-break space, a zero-width space and a doubled "the".

## Why check for hidden characters before counting?

The form counts them, and some of them behave oddly. Paste the paragraph into the **Find and remove hidden characters** box of [Invisible Character](/online-tool/text-tools/invisible-character). This paragraph came back with "Found 2 hidden characters": 1× No-Break Space (U+00A0), between "seal" and "rescue", and 1× Zero Width Space (U+200B), right after "learned to". Each one is marked in the text with a short label, NBSP and ZWSP, so you can see exactly where it sits.

A no-break space looks like a normal space. Word processors often insert one to keep two words together, and it usually does no harm, but some forms and search boxes treat it differently. A zero-width space takes up no room at all, which is why you'd never spot it, yet it is still a character. In this paragraph it adds one to the count for nothing.

Under the marked text there's a **Clean text** box with the fixed version ready to copy or download. The option **Turn unusual spaces into normal spaces (instead of deleting them)** is ticked by default, and you want it on here: the no-break space becomes an ordinary space, so "seal rescue" stays two words, and the zero-width space is removed. The detector keeps the joiners inside emoji such as 👩‍💻, so an emoji in your text won't fall apart.

## How do you catch a doubled word like "the the"?

Copy the clean text into the [Duplicate Word Finder](/online-tool/text-tools/duplicate-word-finder). It highlights any word typed twice in a row, ignoring capitals, and it looks across line breaks. That matters in this example, because the first "the" ends one line and the second starts the next, which is exactly where the eye skips over it. A spell checker won't help either, as both words are spelled correctly.

The tool reports "Found 1 repeated word" and lists "the". Use **↑ Previous** and **↓ Next** to step through the matches when there are several, and read each one in context before you change it. Here the fix is obvious, so press **Remove all repeats**, or use **Copy fixed text** to take the corrected version without changing the box.

By default it skips doubles that are often correct in English, such as "had had", "that that" and "very very". "She had had enough" isn't flagged. Tick **Also flag doubles that are often correct** if you want to review those as well. Words split by punctuation, like "Well, well", and repeated numbers are never flagged.

## How do you fix a title typed in caps lock?

The heading reads `WHY I WANT TO STUDY MARINE BIOLOGY`. Paste it into the [Text Case Converter](/online-tool/text-tools/text-case-converter) and pick a style under **Convert to**. The tool starts on **Title Case**, which gives:

```text
Why I Want to Study Marine Biology
```

Short words like "to", "and" and "of" stay lowercase unless they start or end the title.

If the form wants plain sentence-style headings, choose **Sentence case** instead, but read the result. That style lowercases everything first and then capitalises the first letter of each sentence, so you get `Why i want to study marine biology`. The pronoun "I" and any names, like Cornwall, have to be capitalised again by hand. The same applies if you run a whole paragraph through it.

## Are your sentences too long?

Paste the fixed paragraph into the [Sentence Counter](/online-tool/text-tools/sentence-counter). It shows four numbers at the top: Sentences, Paragraphs, Words per sentence and Words. For the example it reads 4 sentences, 1 paragraph, 54 words and 13.5 words per sentence.

The tool's own guidance is an average of 15 to 20 words per sentence for easy reading, so this paragraph is on the short, readable side. If your full statement averages well over 20, split the longest sentences. A sentence ends at a full stop, question mark, exclamation mark or ellipsis followed by a space, or at a blank line, so an abbreviation such as "e.g." can occasionally be counted as an extra break. Below the input you also get reading and speaking time and the most used words, which is a quick way to see if you've leaned on one word too often.

## How do you check the character count against the form's limit?

Last, paste the whole statement into the [Character Counter](/online-tool/text-tools/character-counter). The figures at the top are Characters, Without spaces, Words and Letters. For the example paragraph, the count went from 288 characters before the clean-up to 283 after: one for the zero-width space and four for the "the " that was removed. Without spaces, it went from 234 to 230, and the word count from 55 to 54.

Compare the Characters figure with the limit, and only use **Without spaces** when the form's instructions say spaces don't count. The counter treats line breaks as characters too, and forms don't all count them the same way, so leave yourself a few characters of slack if you're close to the limit.

The **Common limits** panel lists X / Twitter post (280), SMS (160), Meta description (160), Instagram caption (2,200) and LinkedIn post (3,000), and shows any limit you've passed in red with "— over limit". Your form's limit won't be in that list, so keep its number written down and compare it with Characters yourself. If you're over, cut a sentence, check the count again, and run the Duplicate Word Finder once more if you've retyped anything.

## In what order should you run the checks?

Hidden characters first, so every later count is accurate. Then doubled words, then the heading case. Sentence length comes after that, because shortening sentences changes the wording, and the character count goes last, since it's the number the form will hold you to. If the form also asks for a word count, the Character Counter shows Words as well, so you don't need another tool.

## FAQ

### Does the Character Counter count spaces?

Yes. Characters includes spaces and line breaks, and Without spaces leaves them out. Each character is a Unicode code point, so a simple emoji such as 👍 counts as one, while combined emoji like families count as more.

### Will cleaning hidden characters change how my essay looks?

No. With the default option on, unusual spaces become normal spaces and zero-width characters are removed, so the text looks the same and the count is accurate.

### Why does Sentence case leave "i" in lowercase?

Sentence case lowercases the whole text and only capitalises the first letter of each sentence. It doesn't know that "I" or a place name should stay capitalised, so fix those by hand, or use Title Case for a heading.

### Is my essay uploaded anywhere?

No. These text tools work in your browser, and nothing you paste is sent or stored.

For more writing and counting tools, browse [Text Tools](/online-tool/text-tools).
