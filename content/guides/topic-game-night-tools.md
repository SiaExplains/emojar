---
slug: run-a-board-game-and-chess-club-night
title: Run a Board Game and Chess Club Night With Free Browser Tools
description: Split players into fair teams, roll dice, settle arguments about odds, set up a chess puzzle and draw raffle winners with five free browser tools.
tags: [Games, Random, Chess, How-to]
---

A club game night needs five things a laptop or phone can handle: fair teams, spare dice, a quick way to settle arguments about odds, a chess puzzle for the side table, and a raffle draw nobody can call rigged. Emojar has a free tool for each: the random team generator, the dice roller, the probability calculator, the chess board editor and the random number generator. Each one runs in your browser with no sign-up, and the names and numbers you type aren't sent anywhere.

This guide follows one evening. A board game club meets on a Thursday with 14 players, four tables, a chess puzzle corner and a raffle of 40 tickets for three prizes.

## How do you split 14 players into fair teams?

Paste the names into the [random team generator](/online-tool/security-generators/random-team-generator), one per line or separated by commas. The counter next to the label tells you how many it found, which catches a name you forgot. Set **Split by** to "Number of teams" and **Teams** to 4, then press **Make teams**.

Team sizes never differ by more than one, so 14 players come out as two teams of 4 and two of 3. Switching to "People per team" with 4 gives the same split, because 14 ÷ 4 rounds up to four teams.

Four people in the club know the rules of every game on the shelf. Put their names in the **Captains** field, separated by commas. Captains are placed first, one per team, and are marked with a star, so every table gets someone who can explain the rules. A captain's name has to match a name in the main list, and you can't have more captains than teams. If the result puts two old rivals together, press **Shuffle again**. **Copy teams** gives you one line per team ("Team 1: …") to paste into the group chat.

The shuffle uses your browser's cryptographic random generator, so every split is equally likely. When two teams tie for fewest players, the tie is broken at random, so team 1 doesn't always get the extra person.

## What if a table is missing its dice?

When a box turns up without its dice, open the [dice roller](/online-tool/security-generators/dice-roller) on a phone and tap a die, from d4 up to d100, or type notation into the **Dice notation** box and press **Roll**. For most board games that's 2d6: the result shows each die, the total, a possible total of 2–12 and an expected total of 7.

Notation also handles house rules. One table plays a variant where you roll three dice and keep the best two, written 3d6kh2. The range stays 2–12, but the expected total rises to 8.46. For role-playing games, 2d20kh1 is advantage, with an expected total of 13.83. Under **Custom** you can roll up to 100 dice with any number of sides from 2 to 1,000.

When the page has focus and you aren't typing in a field, the space bar rolls again. A running line shows how many rolls this session has had and their average total, and recent rolls are listed below it. **Reset session** clears both, which is handy between games.

## Is a 7 really the most likely roll?

To settle the usual argument about 7s, open the [probability calculator](/online-tool/calculators/probability-calculator), choose "Chance of one event", and enter 6 favourable outcomes out of 36 total. Two dice have 36 combinations and six of them add up to 7 (1+6, 2+5, 3+4 and the reverse). The answer is 16.666667 %, shown as the fraction 1/6, odds of 6 : 30, and 83.333333 % for not rolling it.

Another table plays a game where you flip six coins and need at least four heads. Pick "Exactly / at most / at least k successes", enter a 50 % chance of success in each try, 6 tries and 4 successes. Exactly four heads is 23.4375 %, and at least four is 34.375 %. Below that, a table lists the chance of every result from 0 to 6 heads.

A coin doesn't owe anyone heads after a run of tails. Each flip is independent, so the chance stays 50 %.

## How do you set up a chess puzzle and share it?

The puzzle corner gets a back-rank mate. In the [chess board editor](/online-tool/reference-tools/fen-chessboard-editor), press **Empty board**, pick a piece from the palette and click squares to place it. White gets a king on g1, a rook on e1 and pawns on f2, g2 and h2. Black gets a king on g8 and pawns on f7, g7 and h7. Leave **Side to move** on White.

The **Current FEN** line now reads `6k1/5ppp/8/8/8/8/5PPP/4R1K1 w - - 0 1`. Press **Copy FEN** and paste it into Lichess, Chess.com or a chess app to check the solution (Re8 is mate) or print a diagram. Press **⇅ Flip board** if you want to see it from Black's side.

If you start from **Start position** and delete pieces instead, the castling boxes stay ticked. The editor then shows "This position couldn’t occur in a real game:" with lines such as "Castling White kingside (K) needs the king on e1 and a rook on h1." Untick those rights and the warning goes away. It also flags a missing king and pawns on the first or last rank. It doesn't check whether a move was legal or a king is in check, so test the puzzle in a chess app before you print it.

Going the other way works too: paste a FEN into **Load a FEN**, press **Load**, and the position appears on the board. Keyboard users can move around the board with the arrow keys, pick up and drop pieces with Enter, and remove them with Delete.

## How do you draw raffle winners fairly?

At the end of the night, put the [random number generator](/online-tool/security-generators/random-number-generator) on the big screen. Set **Minimum** to 1, **Maximum** to 40 and **How many** to 3. Keep **No repeats** ticked so one ticket can't win twice, tick **Sort results** if you want the numbers in order, and press **Generate**. Both ends of the range are included, so ticket 40 has the same chance as ticket 1. The numbers come from your browser's `crypto.getRandomValues` with rejection sampling, so no ticket is favoured.

Someone will ask what their chances were. Back in the probability calculator, "Chance of one event" with 3 favourable outcomes out of 40 gives 7.5 %, odds of 3 : 37. If they buy one ticket at each of the next five club nights, "At least once in several tries" with a 7.5 % chance and 5 tries gives 32.281292 %. That assumes the same raffle every week. Switch to "Combinations and permutations (nCr, nPr)" with n = 40 and k = 3 and you'll see there are 9,880 possible sets of three winning tickets.

## FAQ

### Can I keep strong players from ending up on the same team?

Yes. List them as captains in the random team generator. Each captain goes to a different team, and the rest of the players are shuffled in around them.

### Does the dice roller save my rolls?

Only while the page is open. The session count, average total and recent rolls sit below the result, and **Reset session** clears them.

### Will the chess board editor tell me if a position is checkmate?

No. It checks that the position could exist (one king each, no pawns on the back ranks, sensible castling and en-passant settings) but not move legality or check. Copy the FEN into a chess app for that.

### Can the random number generator pick decimals or many numbers at once?

Yes. Set **Decimal places** from 0 to 10 and **How many** up to 10,000. With **No repeats** on, you can't ask for more numbers than the range holds.

More tools for the evening are in [Security & Generators](/online-tool/security-generators), [Calculators](/online-tool/calculators) and [Reference & Learning](/online-tool/reference-tools).
