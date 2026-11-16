---
slug: organise-a-five-a-side-football-game
title: 'Organise a Weekly Five-a-Side Game: Sign-Ups, Teams and Timer'
description: Turn messy group-chat sign-ups into a clean player list, split fair teams with captains, toss a coin for kick-off and time both halves in your browser.
tags: [Sports, Teams, How-to]
---

To run a weekly five-a-side game without arguments, clean the sign-up list first, then split the players into two teams at random with your strongest players as captains, settle kick-off with a coin toss and run a countdown for each half. You can do all of it on a phone at the side of the pitch with five free tools. Each one runs in your browser, and the names you paste are not uploaded anywhere.

The example below is a Thursday-night game where people sign up in a group chat by replying with their name.

## How do I turn group-chat replies into a clean player list?

Copied into a note, the replies look like this (14 lines):

```
Tom
Priya
Sam
Jonas
Aisha
Leo
sam
Marta
Dev
Priya 
Kofi
Ella
Ravi
Nina
```

Sam replied twice, once in lower case, and Priya's second reply has a space at the end. Paste the list into [Remove Duplicate Lines](/online-tool/text-tools/remove-duplicate-lines). It keeps the first time each line appears and leaves the order alone. Two options matter here:

- **Case sensitive** is ticked by default, so "Sam" and "sam" count as different people. Untick it.
- **Ignore leading/trailing spaces** is ticked by default, which catches "Priya " with the stray space.

With those settings the tool drops line 7 and line 10, and you have 12 names. If you skip the first step, the team generator will happily put Sam on both teams, because it doesn't remove repeated names itself.

## How do I sort the names so the list is easy to check?

Paste the 12 names into [Sort Lines](/online-tool/text-tools/sort-lines) and leave **Order** on **A → Z**. You get:

Aisha, Dev, Ella, Jonas, Kofi, Leo, Marta, Nina, Priya, Ravi, Sam, Tom

An alphabetical list is quicker to read out when you take subs money or check who has actually turned up. Sorting is locale-aware, so a name like "Émile" sorts next to "Emile". The **Case sensitive** box is off by default here, which is what you want for names.

Sort Lines can also shuffle. Pick **Shuffle randomly** on one team's names and you have a fair order for who goes in goal first, or who sits out first when you rotate subs.

## How do I split 12 players into two fair teams?

Paste the sorted list into the [Random Team Generator](/online-tool/security-generators/random-team-generator). It accepts one name per line or names separated by commas, and the label shows the count, so you can check that it says 12.

Set **Split by** to **Number of teams** and **Teams** to 2. Click **Make teams** and you get two teams of 6: five on the pitch and one rolling sub each. If only 11 turn up, the same settings give you 6 and 5, because team sizes never differ by more than one.

The other mode catches people out. With **People per team** set to 5, the tool works out how many teams it needs by rounding up, and 12 ÷ 5 rounds up to 3. You'd get three teams of 4, which suits a three-team rotation but not a single game of five against five.

To stop the two best players landing on the same side, type them into **Captains (optional, comma-separated)**, for example `Kofi, Marta`. Captains are placed one per team before everyone else is shuffled in, and each one is marked with a star. A captain's name has to match the list exactly, including capital letters; a name that isn't on the list is ignored. You can't have more captains than teams.

If the split looks lopsided, click **Shuffle again**. When you're happy, **Copy teams** gives you text like `Team 1: Kofi, …` to paste straight back into the group chat.

## Who kicks off?

Open the [Coin Flip](/online-tool/security-generators/coin-flip), let one captain call it, and press **Flip** (or the space bar). The winner picks an end or takes kick-off, and the other team starts the second half.

The result comes from your browser's cryptographic random generator, so neither side can complain about a weighted coin or a bad toss. The page also keeps a running tally and your longest streak. You can use the same toss for smaller questions, like which team wears the bibs.

## How do I time both halves?

On the [Online Timer](/online-tool/date-time-tools/online-timer), tap the **20 min** preset, or type hours, minutes and seconds for any other length. Press **Start** at kick-off. When time is up an alarm beeps and the display flashes until you press **Dismiss**.

A few buttons help on match night:

- **+1 min** appears while the timer is running and adds stoppage time without resetting the clock.
- **Pause** stops it for an injury, and the button then reads **Resume**.
- **⛶ Full screen** makes the countdown big enough to read from the pitch if you prop the phone against a bag.

For half-time, press **Dismiss**, tap the **5 min** preset and start again. Then do the same with **20 min** for the second half.

The timer counts down to a fixed end time, so it stays accurate if your phone moves the tab to the background. Browsers only play sound after you've interacted with the page, and pressing Start counts, but check the phone isn't on silent.

## What does a whole match night look like?

1. Copy the group-chat replies and run them through Remove Duplicate Lines with **Case sensitive** unticked.
2. Sort the result A → Z and check the count against who turned up.
3. Make 2 teams in the Random Team Generator with your two strongest players as captains, then copy the teams into the chat.
4. Flip the coin for kick-off.
5. Run 20 minutes, 5 minutes for half-time, then 20 minutes again on the timer.

## FAQ

### Can the team generator balance teams by skill?

Only through captains. List your strongest players as captains and they are spread one per team; everyone else is shuffled in at random. It doesn't rate players.

### What happens if someone is on the list twice?

The Random Team Generator treats each line as a separate player, so a repeated name can end up on both teams. Run the list through Remove Duplicate Lines first, with **Case sensitive** unticked if people typed their names differently.

### Is a virtual coin flip fair?

Yes. Each flip is independent and has 50/50 odds, taken from the browser's cryptographic random generator. Five heads in a row doesn't make tails more likely next time.

### Will the timer keep going if I lock my phone or switch apps?

The countdown is tied to a fixed end time, so the time stays correct when you come back. Allow notifications to get an alert while the page is hidden, and keep the phone off silent so you hear the alarm.

More tools like these are in the [Text Tools](/online-tool/text-tools), [Security & Generators](/online-tool/security-generators) and [Date & Time Tools](/online-tool/date-time-tools) categories.
