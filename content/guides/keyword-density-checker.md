---
slug: keyword-density-explained-word-and-phrase-frequency
tool: keyword-density-checker
title: 'Keyword Density Explained: How to Check Word and Phrase Frequency'
description: What keyword density means, how it is calculated for single words and phrases, and how to use a frequency check to spot over-used terms in your writing.
tags: [SEO, Writing, Explainer]
---

Keyword density is the percentage of a text taken up by one word or phrase: the number of times it appears, times the number of words in it, divided by the total word count, times 100. If "cold brew" appears 9 times in a 1,200-word article, it covers 18 of those words, a density of 1.5%. The [Keyword Density Checker](/online-tool/text-tools/keyword-density-checker) works this out for every word or phrase in your text at once, so you can see what your page is really about at a glance.

## The formula, with examples

**Density = occurrences × words in the phrase ÷ total words × 100.**

Multiplying by the phrase length matters: a two-word phrase uses two words each time it appears. A few examples:

| Term | Appears | Words in term | Total words | Density |
| --- | --- | --- | --- | --- |
| coffee | 18 | 1 | 1,200 | 1.50% |
| cold brew | 9 | 2 | 1,200 | 1.50% |
| grinder | 30 | 1 | 1,200 | 2.50% |
| french press coffee | 4 | 3 | 800 | 1.50% |

The total word count always includes every word in the text, common words such as "the" and "of" too, even when you choose to hide them from the results table. That keeps the percentages comparable to what other tools report.

## Is there an ideal keyword density?

No. Search engines don't reward a target percentage, and repeating a phrase until it hits some number makes writing clunky. Readers notice before algorithms do.

A frequency check is still useful, just for different questions:

- **Does the page mention its topic clearly?** If your guide to sourdough starters never uses the word "starter" in its top ten, the focus may be off.
- **Is one phrase doing too much work?** A term far ahead of everything else is often a sign of copy-and-paste habits or a sentence pattern you keep reusing.
- **Are related terms present?** Words like "flour", "hydration" and "feeding" showing up alongside "sourdough" suggest the text covers the subject properly.

This is an analysis of the text you paste, nothing more: it has no search volume, competition or ranking data.

## How to check your text step by step

1. Paste your article, page copy or draft into the box.
2. Choose what to count: **Single words**, or **2-word**, **3-word** or **4-word phrases**.
3. Set the **Minimum word length**. The default of 3 hides short words such as "to" and "an". Every word in a phrase must meet it.
4. Leave **Ignore common words** ticked to skip about 190 English function words, such as articles, pronouns and prepositions. Untick it to see everything.
5. Type a term into **Check a specific keyword or phrase** to get its count and density in a highlighted tile.
6. Read the table of up to 50 top terms, then use **Copy CSV** or the download button to keep the results.

The stats row also shows total and unique words.

## How phrases are counted

Two rules make the phrase results more trustworthy than a simple sliding window.

**Phrases never cross a sentence break.** Full stops, question marks, exclamation marks, semicolons, colons and blank lines all end a run. Take this short text: "We sell coffee. Beans are roasted daily. Fresh coffee beans taste better, and coffee beans keep." The 2-word table shows "coffee beans" twice, for a density of 2 × 2 ÷ 16 = 25%. The "coffee. Beans" at the start isn't counted, because those words belong to different sentences.

**Common words are trimmed from the edges.** With **Ignore common words** on, a phrase that starts or ends with a stop word is dropped, but one with a stop word in the middle is kept. So "cup of coffee" survives, while "the coffee" and "coffee is" don't. Phrase tables also only list phrases that appear more than once, so you aren't scrolling through hundreds of one-offs.

The target keyword box is simpler: it matches whole words without caring about capitals or punctuation, so in the example above it would find "coffee beans" three times. If the box and the table disagree by one or two, a sentence break is usually why.

## What to do with the results

If a word is far above everything else, read the sentences where it appears and vary a few of them with pronouns or synonyms. For accidental repeats like "the the", the [Duplicate Word Finder](/online-tool/text-tools/duplicate-word-finder) is faster than scanning the table. To check that your main topic also appears where it counts most, write your page title and description with the [Meta Tag Generator](/online-tool/developer-tools/meta-tag-generator). And if the copy feels repetitive because the sentences are hard going, run it through the [Readability Score](/online-tool/text-tools/readability-score) tool. For a plain total, use the [Word Counter](/online-tool/text-tools/word-counter).

## FAQ

### Why does my keyword show a lower count than I expected?

Check the settings. A minimum word length greater than the length of one of your words, or a stop word at the start or end of the phrase, will filter it out of the table. The target keyword box isn't affected by those filters.

### Does capitalisation matter?

No. "Coffee", "COFFEE" and "coffee" are counted as the same word, and curly and straight apostrophes are treated alike.

### Is my text uploaded anywhere?

No. The analysis runs in your browser and nothing is stored.

Paste a draft into the [Keyword Density Checker](/online-tool/text-tools/keyword-density-checker) and see which words it leans on.
