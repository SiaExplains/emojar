---
slug: how-to-write-a-pub-quiz-flags-codes-sound-round
title: 'How to Write a Pub Quiz: Flags, Number Codes and a Sound Round'
description: 'Write a four-round pub quiz with flags, menu words in element numbers, backwards capitals and sound clips, then check how far pure guessing gets a team.'
tags: [Quiz, Party Games, Reference, How-to]
---

To write a pub quiz, plan four rounds of ten questions, keep an answer sheet as you go, and work out what a team could score by guessing. On Emojar you can build a picture round with the [Flag Explorer](/online-tool/reference-tools/flag-explorer), a number code with the [Interactive Periodic Table](/online-tool/reference-tools/periodic-table), a wordplay round with [Reverse Text](/online-tool/text-tools/reverse-text) and a sound round with the [Audio Converter](/online-tool/audio-video-tools/audio-converter). The [Probability Calculator](/online-tool/calculators/probability-calculator) handles the guessing. All five run in your browser, and your sound clips are not uploaded.

The example is a Thursday quiz for eight teams in a pub, 40 questions in all, with one point each.

## How do you build a flag round?

Give the round a theme, or half of it may end up being small islands. In Flag Explorer, set **Continent** to South America. The list drops to 14 flags, from Argentina to Venezuela, and includes two territories, the Falkland Islands and French Guiana. Leave those two out and you have 12 countries to choose ten from.

Click **☰ Compact list** to see the capital, both ISO codes, the calling code and the continent next to each flag. That table is your answer sheet. To put a flag on the printed picture sheet, click the country and use the **Flag emoji** copy button, then paste it into your document at a large font size.

Prepare the sheet on a Mac, a phone or a Linux machine. Windows shows a two-letter country code in place of a flag emoji, so "BR" would appear where Brazil's flag should be.

To judge how hard the round is, ask a friend who isn't playing to press **🎯 Quiz me**. The button uses your continent filter and asks 10 multiple-choice questions with four countries each. If they get all ten right, try another continent or ask for the capitals instead.

## How do you turn the pub menu into a number code?

Many words can be spelled from chemical symbols. Beryllium is Be and erbium is Er, so "BeEr" becomes 4-68 when you replace each symbol with its atomic number. Teams get the numbers and have to name something on the menu. Here are ten that work:

| Question | Answer | Symbols |
| --- | --- | --- |
| 4-68 | Beer | Be Er |
| 74-53-10 | Wine | W I Ne |
| 74-1-53-16-19-39 | Whisky | W H I S K Y |
| 94-7-6-1 | Punch | Pu N C H |
| 6-1-53-15-16 | Chips | C H I P S |
| 56-27-7 | Bacon | Ba Co N |
| 8-28-8-7 | Onion | O Ni O N |
| 73-91-16 | Tapas | Ta Pa S |
| 56-11-11 | Banana | Ba Na Na |
| 16-7-89-19-16 | Snacks | S N Ac K S |

To make your own, type a symbol such as `Ta` into the periodic table's search box. An exact symbol or atomic number matches, but so does any name containing those letters: `Ta` outlines tantalum along with potassium, titanium and three others. Click a tile to open its details and read **Atomic number**.

The round needs a periodic table on every team's table, so hand out a printed one. If you would rather ask plain chemistry questions, the filters give short answer lists. **State at 20 °C** set to Liquid leaves two elements, bromine and mercury. **Category** set to Noble gas leaves seven. The **☰ List view** button shows only the matches, which is easier to copy from than the full table.

## How do you write a backwards capitals round?

Type ten capitals into Reverse Text in lower case, one per line. Capital letters would mark the start of each word. Under **Reverse**, pick **Letters in each word**:

| Typed | Result |
| --- | --- |
| canberra | arrebnac |
| ottawa | awatto |
| nairobi | iborian |
| reykjavik | kivajkyer |
| montevideo | oedivetnom |
| kuala lumpur | alauk rupmul |

That option keeps the lines and words in place, so question 1 stays question 1. The default, **Every character (backwards text)**, reverses the whole input including the line order. It would put Kuala Lumpur first, as `rupmul alauk`, and your answer sheet would be in the wrong order.

Add the question numbers afterwards. If you paste `1. canberra`, the tool reverses the number too and you get `.1 arrebnac`. For an easier last question, switch to **Word order in each line** and reverse a proverb: "Too many cooks spoil the broth" comes out as "broth the spoil cooks many Too".

## How do you prepare clips for the sound round?

Record ten short sounds yourself, such as a kettle, a zip or a cash drawer. Your phone may save them in a format the pub's laptop can't play. The Audio Converter takes any audio or video file your browser can play and saves it as MP3, WAV, M4A or OGG. It does one file at a time, so convert the ten in turn.

Rename each file first. The converter keeps the name and changes only the extension, so `kettle.m4a` becomes `kettle.mp3` and gives the answer away on the screen. `sound-01.m4a` becomes `sound-01.mp3`.

Set **Convert to** to **MP3** and **Bitrate** to **128 kbps**, then click **Convert**. Listen to the result in the player before you click the download button. A 20-second clip at 128 kbps is 128,000 × 20 ÷ 8 = 320,000 bytes, so all ten come to about 3.2 MB. The same ten as **WAV (16-bit, lossless)** in stereo at 48,000 Hz would be 38.4 MB.

The converter doesn't cut audio. If a clip has ten seconds of fumbling at the start, trim it first in the [Audio Trimmer](/online-tool/audio-video-tools/audio-trimmer), which exports MP3 or WAV.

## Can a team win by guessing?

They can pick up points if you print options next to each flag. Open the Probability Calculator and set **Calculate** to **Exactly / at most / at least k successes**. With four options per question, enter 25 for **Chance of success in each try**, 10 for **Number of tries (n)** and 5 for **Successes / items chosen (k)**:

- **Exactly 5 of 10**: 5.83992 %
- **At most 5**: 98.027229 %
- **At least 5**: 7.8126907 %
- **Mean**: 2.5

A team that guesses every flag averages 2.5 points and reaches half marks about one time in thirteen. Change the chance to 50, as in a true-or-false round, and **At least 5** rises to 62.304687 % with a mean of 5. To leave less to luck, show the flags without options and have teams write the country.

Below the results is a table with every score from 0 to 10, so you can read off other thresholds without retyping. The sums assume each guess is independent and has the same chance. A team that can rule out one option is doing better than 25 %.

## FAQ

### How many flags does Flag Explorer have?

It covers 250 countries and territories. You can filter by continent and region, or search by country, capital or ISO code.

### Why is the Quiz me button greyed out?

Your system shows flag emoji as two letters, as Windows does. The quiz is turned off there because the letters would give the answers away.

### Which format should I use for quiz sound clips?

Use MP3 for a laptop you haven't tested, since it plays everywhere. M4A and OGG sound better at the same bitrate, but not every browser can create them.

### Does Reverse Text work with accented capitals?

Yes. It reverses whole visible characters, so an accented letter such as é stays in one piece.

There are more look-up tools in [Reference & Learning](/online-tool/reference-tools), more wordplay in [Text Tools](/online-tool/text-tools) and more clip editing in [Audio & Video Tools](/online-tool/audio-video-tools).
