---
slug: how-to-split-a-group-into-fair-random-teams
tool: random-team-generator
title: How to Split a Group Into Fair Random Teams (With Captains)
description: A practical walkthrough for coaches, teachers and game-night hosts on splitting people into even random teams, using captains and avoiding common mix-ups.
tags: [Generators, Teams, Classroom, How-to]
---

To split a group into fair random teams, shuffle everyone with a real random source and deal them out so no team ends up more than one person bigger than another. With 10 people and 3 teams that means 4, 3 and 3. If you want the strongest players spread out, make them captains so each team gets exactly one before everyone else is shuffled in.

Below is a real scenario, plus the settings that actually cause arguments: team count, team size and captains.

## The scenario: 14 players, one pitch, two subs benches

Imagine you run a casual Friday football session. Fourteen people turn up. You want three teams so one team rests while the other two play, rotating every ten minutes. Two of the regulars, Sam and Priya, are clearly stronger than everyone else, and last week's team with both of them won every game.

Picking by hand takes minutes and someone always feels picked last. A shuffle takes seconds.

## Step by step with the team generator

Open the [Random Team Generator](/online-tool/security-generators/random-team-generator) and work through it like this:

1. **Enter the names.** Type or paste them into the box labeled "Names — one per line or separated by commas". Semicolons work as separators too, and blank entries are ignored. The counter in the label shows how many names were recognized. "Load sample" fills in twelve example names if you just want to try it.
2. **Choose how to split.** Under "Split by", pick "Number of teams" or "People per team". For the football session, choose "Number of teams" and enter 3 in the "Teams" field.
3. **Add captains (optional).** In "Captains (optional, comma-separated)", type `Sam, Priya`.
4. **Click "Make teams".** The teams appear as cards with a member count, and captains get a small "★ captain" marker.
5. **Reshuffle or copy.** The button now reads "Shuffle again". When everyone is happy (or has stopped complaining), click "Copy teams" to get plain text such as `Team 1: Sam, Leo, Mia, Omar, Kai` to paste into the group chat.

With 14 players and 3 teams you get sizes 5, 5 and 4. Sam and Priya land in different teams, and which team ends up with only four players is decided at random.

## Number of teams or people per team?

This is the setting people most often get wrong, because "people per team" behaves like a maximum, not an exact size. The tool divides the group by your number, rounds up to get the team count, and then balances.

| Group size | Setting           | Teams created | Sizes   |
| ---------- | ----------------- | ------------- | ------- |
| 10         | 3 teams           | 3             | 4, 3, 3 |
| 10         | 4 people per team | 3             | 4, 3, 3 |
| 12         | 5 people per team | 3             | 4, 4, 4 |
| 14         | 3 teams           | 3             | 5, 5, 4 |

Notice the 12-person row. Asking for 5 per team does not give you 5, 5 and 2. It gives three teams of 4, because a lonely team of 2 is rarely what anyone wants. If you need an exact team count, for example because you have exactly three bib colors, use "Number of teams".

## How do captains actually work?

Captains are placed first, one per team, in random order. Only after that are the remaining names shuffled and dealt into whichever team is currently smallest. Two consequences are worth knowing:

- **You can't have more captains than teams.** Three captains for two teams gives the error "There are more captains than teams".
- **Captains must match a name in the list exactly.** Matching is case-sensitive, so `priya` will not match `Priya`, and a captain who isn't in the names box is quietly skipped rather than flagged. If someone doesn't get the captain marker, check the spelling first.

You don't have to fill every team with a captain. With three teams and two captains, the team without one simply gets a regular player first.

## Is the shuffle really fair?

Names are shuffled using your browser's cryptographic random generator, the same kind of source used for passwords, rather than a predictable pseudo-random formula. When several teams are tied for smallest, the tie is broken randomly too, so Team 1 isn't always the one that gets the extra player. Everything runs in your browser and nothing is saved, which matters if you're entering pupils' names.

Random isn't the same as skill-balanced, though. A shuffle can still put the three fastest runners together, so use captains to spread out your top players.

## Common mistakes and quick fixes

- **"Enter at least two names."** You need two or more names before the button activates.
- **Two people with the same first name.** Add an initial (`Alex P`, `Alex R`). Identical entries are kept, but they're hard to tell apart in the result, and naming one of them as captain only places one copy as captain.
- **Asking for more teams than people.** Eight names can't make ten teams, and the tool tells you so.
- **People per team set larger than the group.** That would leave one team, and the tool needs at least two.

The same approach works for classroom projects, hackathons and quiz nights. For a single winner rather than groups, a [Wheel Spinner](/online-tool/security-generators/wheel-spinner) is the better fit, and a [Coin Flip](/online-tool/security-generators/coin-flip) settles who kicks off.

## FAQ

### Can I keep the same teams for next week?

Click "Copy teams" and save the text somewhere. The tool doesn't store anything between visits, so a new session means a new shuffle.

### Why did my team of 5 per team come out as teams of 4?

Because the tool rounds up the number of teams and then balances them. With 12 people, 5 per team means 3 teams, and three even teams of 4 is the fairest split.

Ready for kick-off? Split your group with the [Random Team Generator](/online-tool/security-generators/random-team-generator).
