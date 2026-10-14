---
slug: spaced-repetition-flashcards-the-leitner-system-explained
tool: flashcard-maker
title: 'Spaced Repetition Flashcards: The Leitner System Explained'
description: Why flashcards work, how the five-box Leitner system schedules reviews, how to write cards that stick, and a worked example of a week of study.
tags: [Study, Learning, How-to]
---

Flashcards work because they make you recall an answer before you see it, and spaced repetition makes them efficient by showing cards you know less often. The Leitner system is the simplest way to do both: every card sits in one of five boxes, and the box decides how often it comes back. The [Flashcard Maker](/online-tool/productivity-tools/flashcard-maker) uses exactly this system, with no account needed.

## Why does testing yourself work?

Re-reading notes feels productive, but it mostly builds familiarity, the sense of "I've seen this before". Trying to remember an answer, even when you fail, strengthens the memory far more. Psychologists call this the testing effect or active recall, and it is one of the most consistently replicated findings in learning research.

The second ingredient is spacing. Memories fade on a curve: fast at first, then more slowly. Reviewing a fact just as you are about to forget it resets that curve and makes the next drop slower. Reviewing it while you still remember it perfectly adds very little. Spaced repetition puts the effort where it pays off.

## How the Leitner system works

Sebastian Leitner, a German science journalist, described the method in the 1970s using a cardboard box with compartments. The rules are simple:

1. Every new card starts in **box 1**.
2. When you answer a card correctly, it moves up one box.
3. When you get it wrong, it goes back to box 1, however high it was.
4. Lower boxes are reviewed often, higher boxes rarely.

In the Flashcard Maker, the schedule doubles at each level:

| Box | Reviewed | Meaning |
| --- | --- | --- |
| 1 | Every session | New or recently missed |
| 2 | Every 2nd session | Starting to stick |
| 3 | Every 4th session | Known |
| 4 | Every 8th session | Well known |
| 5 | Every 16th session | Mastered |

During a session, a card you miss comes back at the end of the queue, so every session finishes with each due card answered correctly once. The row of boxes under the card shows how your deck is spread across the five levels.

## A worked example

Say you are learning 30 Spanish words, studying once a day.

- **Day 1:** all 30 cards are in box 1, so all 30 are due. You know 18 on the first try; they move to box 2. The other 12 come back until you get them right, then also move to box 2.
- **Day 2:** box 2 only comes up every second session, so on a fresh deck nothing would be due. When that happens, the tool reviews the lowest box instead of showing an empty session, so you see all 30 again, and the ones you know move on to box 3.
- **Day 3 onward:** box 2 comes up every other day and box 3 every fourth. Within two weeks most cards sit in boxes 3–5, and a session takes a few minutes, mostly spent on the handful of words that keep slipping.

That is the point of the system: your time goes to the hard cards, not to the ones you already know.

## How to write cards that stick

- **One fact per card.** "Capital of Australia → Canberra" is a good card. "Australia → capital, population, currency" is three cards.
- **Ask the way the exam asks.** If you will need to produce the word, put the native-language word on the front.
- **Study both directions for vocabulary.** Tick "Show the back first" in Study, or "Ask with the back" in the quiz.
- **Keep answers short.** Typed answers are checked loosely: case, accents and trailing punctuation are ignored, so "Cafe." matches "café". Long answers are better suited to multiple choice.
- **Add context when words are ambiguous.** "bank (river)" and "bank (money)" avoid guessing.

## Importing an existing set

You don't have to type every card. In the [Flashcard Maker](/online-tool/productivity-tools/flashcard-maker), open **Import many cards at once** and paste one card per line, with a Tab between the two sides. That is the default format of Quizlet's export, and what you get when you copy two columns from a spreadsheet. A CSV file with two columns, front and back, works too. A first row such as "term, definition" is skipped automatically, and lines without both sides are reported rather than imported half-empty.

To move your decks to another device, use **Export JSON** and **Import JSON**; for a spreadsheet, **Export CSV** saves one deck as two columns.

## Making it a habit

Short, daily sessions beat long, occasional ones. Pair them with a timer: a 25-minute block from the [Pomodoro Timer](/online-tool/date-time-tools/pomodoro-timer) is plenty for a study session and a quiz. When a deck is mostly in boxes 4 and 5, take the multiple-choice quiz to confirm you really know it, and review the mistakes it lists at the end.
