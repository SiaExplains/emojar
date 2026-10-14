---
slug: convert-dates-between-dd-mm-yyyy-mm-dd-yyyy-and-iso
tool: date-format-converter
title: 'Convert Dates Between DD/MM/YYYY, MM/DD/YYYY and ISO 8601'
description: Switch dates between day-first, US month-first and ISO formats, one or hundreds at a time, without guessing on ambiguous dates like 03/04/2026.
tags: [Dates, Formats, How-to]
---

To convert a date between DD/MM/YYYY, MM/DD/YYYY and ISO 8601, read it in the format it was written in, then rewrite the same day, month and year in the new order: 14/10/2026 (day first) becomes 10/14/2026 in the US style and 2026-10-14 in ISO 8601. The hard part isn't the rewriting. It's knowing which format the original used, because a date like 03/04/2026 is 3 April in most of the world and March 4 in the United States. A good converter asks you instead of guessing.

## Why date formats cause so much trouble

The same day is written in several ways depending on where you are:

| Style         | Example          | Where you'll see it                    |
| ------------- | ---------------- | -------------------------------------- |
| DD/MM/YYYY    | 14/10/2026       | UK, most of Europe, much of the world  |
| MM/DD/YYYY    | 10/14/2026       | United States                          |
| YYYY-MM-DD    | 2026-10-14       | ISO 8601, software, file names         |
| DD.MM.YYYY    | 14.10.2026       | Germany, Russia and others             |
| YYYY/MM/DD    | 2026/10/14       | East Asia, for example Japan and China |
| D Month YYYY  | 14 October 2026  | Written English (UK style)             |
| Month D, YYYY | October 14, 2026 | Written English (US style)             |

Problems start when data moves between these worlds, such as a US export landing in a European spreadsheet. Any date where both the day and month are 12 or under can be read two ways, and a wrong guess gives a valid but incorrect date, so nothing looks broken.

## Converting a single date

1. Open the [Date Format Converter](/online-tool/date-time-tools/date-format-converter) and type or paste a date, for example `14/10/2026`.
2. Leave **Input format** on **Detect** for now.
3. Pick an **Output format**, such as ISO 8601.

The result appears straight away: `2026-10-14`, with a line confirming how the date was read, here "Wednesday, 14 October 2026 (DD/MM/YYYY)". The weekday is a handy sanity check. Below it, a table shows the date in every supported format, each with a copy button.

Detection works because 14 can't be a month. Likewise, `13/04/2026` is read as 13 April without any question.

## What happens with an ambiguous date

Now type `03/04/2026`. Instead of a result, you'll see a message saying the date is ambiguous and could be 3 April 2026 or 4 March 2026, with two buttons: one to read it as DD/MM/YYYY and one as MM/DD/YYYY. Clicking a button sets the input format, and the conversion runs.

To decide, look at where the data came from, or find another date in the same source with a day above 12. If the same system produced `04/23/2026`, it's month first. Weekdays help too: 3 April 2026 is a Friday and 4 March 2026 a Wednesday, so "Friday 03/04/2026" settles it.

## Converting a whole list

Paste one date per line to switch to batch mode. Blank lines stay blank, and lines that couldn't be read stay in place, starting with `#` and the reason, so the output still lines up with your input in a spreadsheet.

For lists, set the input format explicitly, so `03/04/2026` and `13/04/2026` are read the same way. On Detect, ambiguous lines are marked as errors rather than guessed.

One quirk to know about: dates written with dashes and the day first, like `03-04-2026`, are read as DD-MM-YYYY. There's no month-first option with dashes, so if you have US dates written that way, replace the dashes with slashes and choose MM/DD/YYYY.

## Validation: real dates only

The converter checks that each date actually exists. `31/04/2026` is rejected with a note that April has 30 days, and `29/02/2025` is rejected because 2025 isn't a leap year. Leap years follow the full Gregorian rule: divisible by 4, except century years, which must be divisible by 400. So 2000 had a 29 February, but 1900 didn't and 2100 won't.

## Two-digit years

Short years such as `05/06/49` are only read when you choose DD/MM/YY or MM/DD/YY as the input format; Detect ignores them because something like `01/02/03` could mean almost anything. When you do choose one, 00 to 49 become 2000 to 2049 and 50 to 99 become 1950 to 1999. That makes `05/06/49` 5 June 2049 (day first), but `05/06/50` 5 June 1950. Birth dates before 1950 will come out wrong, so for historical data, work from four-digit years.

## Dates only, no times

The converter handles calendar dates only. If the input contains a time, such as `2026-10-14T09:30`, it says so and stops. That's deliberate: many tools turn a date into midnight in your local time zone, and shifting it to another zone can quietly move it to the previous day. Working with just year, month and day avoids that.

For dates with times, Unix timestamps or time zones, use the [Timestamp Converter](/online-tool/date-time-tools/timestamp-converter) instead.

## Related tools

- Find out which weekday any date falls on with the [Day of the Week Calculator](/online-tool/date-time-tools/day-of-week-calculator).
- Count the days between two converted dates in the [Date Difference Calculator](/online-tool/date-time-tools/date-difference-calculator).
- Need ISO week numbers for planning? The [Week Number Calculator](/online-tool/date-time-tools/week-number-calculator) has them.

## FAQ

### Which format should I use in file names and spreadsheets?

ISO 8601, YYYY-MM-DD. No one misreads it, and it sorts correctly as plain text, so `2026-03-04` always comes before `2026-10-14`.

### Can I paste dates with month names?

Yes. Forms such as `14 October 2026`, `14th October 2026`, `14 Oct 2026`, `October 14, 2026` and `14-Oct-2026` are recognised, in English.

Clean up your next mixed date list with the [Date Format Converter](/online-tool/date-time-tools/date-format-converter).
