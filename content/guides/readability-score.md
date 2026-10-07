---
slug: how-readability-formulas-score-your-writing
tool: readability-score
title: How Readability Formulas Score Your Writing, Step by Step
description: What Flesch Reading Ease, Fog and SMOG actually measure, why syllable counts are guesses, and a real rewrite that moved a paragraph from 0.3 to 88.7.
tags: [Writing, Readability, Explainer]
---

Readability formulas score your writing from just two signals: how many words you put in each sentence and how long those words are. Flesch Reading Ease turns them into a 0–100 number where higher is easier, and the grade-level formulas turn the same signals into a US school grade. They don't understand meaning at all, which is exactly why it helps to know what's under the hood before you act on a score.

## What does a readability checker actually count?

Every formula starts from a handful of raw counts. The [Readability Score Checker](/online-tool/text-tools/readability-score) shows all of them under the scores:

- **Words**: runs of letters or digits; "e-mail" and "don't" count as one word each.
- **Sentences**: text ending in . ! ? or … followed by a space, plus breaks at blank lines and at new lines that start with a bullet or number.
- **Syllables**: estimated per word (more on that below).
- **Complex words**: words with three or more estimated syllables.
- **Letters**: letters and digits, without spaces or punctuation.

Two averages drive almost everything: **Words per sentence** and **Syllables per word**.

## How are the six scores calculated?

These are the formulas the checker applies ("WPS" is words per sentence, "SPW" syllables per word).

| Score | Formula | Main signal |
| --- | --- | --- |
| Flesch Reading Ease | 206.835 − 1.015 × WPS − 84.6 × SPW | Syllables, then sentence length |
| Flesch–Kincaid Grade | 0.39 × WPS + 11.8 × SPW − 15.59 | Same inputs, as a grade |
| Gunning Fog | 0.4 × (WPS + 100 × complex words ÷ words) | Share of 3+ syllable words |
| SMOG | 1.043 × √(complex words × 30 ÷ sentences) + 3.1291 | Complex words per 30 sentences |
| Coleman–Liau | 0.0588 × letters per 100 words − 0.296 × sentences per 100 words − 15.8 | Letters, not syllables |
| ARI | 4.71 × letters per word + 0.5 × WPS − 21.43 | Characters per word |

Look at the weights in the Flesch formula. One extra word per sentence costs about one point. One extra syllable per word on average costs 84.6 points. That's why swapping "utilize" for "use" moves the score far more than trimming a clause.

The **Average grade level** card is the mean of the five grade formulas, which smooths out each one's quirks. Coleman–Liau and ARI never look at syllables at all.

## Why are syllable counts only estimates?

Syllables are guessed from spelling. This checker counts groups of vowels (a, e, i, o, u and y), after dropping common silent endings such as a final "e", "es" or "ed". Words of three letters or fewer always count as one syllable.

The rule is usually right, but it does miss:

| Word | Real syllables | Estimated |
| --- | --- | --- |
| table | 2 | 2 |
| documentation | 5 | 5 |
| created | 3 | 1 |
| idea | 3 | 2 |
| recipe | 3 | 2 |
| Wednesday | 2 | 3 |
| queue | 1 | 2 |

Over a few hundred words these errors mostly cancel out, so longer samples give steadier results. It also explains why two checkers can disagree by a point or two on the same text: they guess syllables slightly differently.

## Where can the sentence count mislead you?

A wrong sentence count shifts every score. Two cases are worth knowing:

1. **Abbreviations.** A period followed by a space ends a sentence, so "Dr. Smith arrived at 3 p.m. on Monday." is counted as three sentences: "Dr.", "Smith arrived at 3 p.m." and "on Monday." Text full of abbreviations will look easier than it is.
2. **Lists.** A new line that starts with a dash, bullet or digit is a sentence break, so each list item counts as a short sentence. A page that is mostly bullets will score generously.

SMOG has its own caveat. It was designed for samples of 30 sentences, and the checker labels it "most reliable with 30+ sentences" when your text is shorter.

## A worked example: rewriting a policy paragraph

Here is a typical expense-policy paragraph, 63 words in two sentences:

> In order to facilitate the timely processing of your reimbursement request, it is necessary that all supporting documentation, including original receipts and an itemized summary of expenditures, be submitted to the accounting department no later than thirty days following the conclusion of the business trip. Requests received after this deadline may be subject to additional verification procedures, which could result in considerable delays.

And a rewrite, 51 words in five sentences:

> To get your money back quickly, send us your receipts within 30 days of your trip. Include the original receipts and a list of what you spent. Send them to the accounting team. If your request is late, we may need to check it more closely. That can slow things down.

| Measure | Before | After |
| --- | --- | --- |
| Words per sentence | 31.5 | 10.2 |
| Syllables per word | 2.06 | 1.27 |
| Complex words | 21 | 3 |
| Flesch Reading Ease | 0.3 (Very difficult) | 88.7 (Easy) |
| Flesch–Kincaid Grade | 21 | 3.4 |
| Gunning Fog | 25.9 | 6.4 |
| SMOG | 21.6 | 7.6 |
| Coleman–Liau | 18.4 | 5.4 |
| ARI | 22.5 | 3 |
| Average grade level | 21.9 | 5.2 |

The original's first sentence, at 45 words, shows up under **Longest sentences — simplify these first**, which lists up to five sentences of 20 words or more. Notice that cutting syllables did most of the work: "facilitate", "reimbursement", "documentation" and "expenditures" alone carry 17 estimated syllables.

## How to check your own text

1. Paste a few paragraphs into **Your text (English)**, or press **Load sample**.
2. Read the **Flesch Reading Ease** card first. Its label (for example "Plain English · 8th–9th grade") names your band. Most web content aims for 60 or above.
3. Compare it with **Average grade level** and the five-formula table. If they disagree, check whether Words per sentence or Syllables per word is driving the result.
4. Fix the sentences in the longest-sentences list. Scores update as you type, and the text stays in your browser.

## When should you ignore the score?

Formulas measure structure, not clarity. Short, vague sentences can score "Very easy" and still confuse people, and a precise technical term is sometimes the clearest word available. The formulas are also built for English only. Treat the number as a prompt to reread, then read the text aloud. For a closer look at sentence rhythm, the [Sentence Counter](/online-tool/text-tools/sentence-counter) and [Word Counter](/online-tool/text-tools/word-counter) break the same text down in other ways.

## FAQ

### Can a Flesch score be negative or above 100?

Yes. The formula has no floor or ceiling, so very dense text can drop below zero and a run of tiny one-syllable sentences can top 100. The checker shows the raw number and puts anything under 30 in the "Very difficult" band.

### Why does my score change when I add a heading?

A heading on its own line, separated by a blank line, is counted as a short sentence. That lowers the words-per-sentence average and raises the ease score a little. Paste body text only if you want a stricter reading.

Try it on your next draft with the [Readability Score Checker](/online-tool/text-tools/readability-score).
