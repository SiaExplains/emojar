---
slug: what-is-a-unix-timestamp-epoch-time-explained
tool: unix-timestamp-converter
title: What Is a Unix Timestamp? Epoch Time Explained Simply
description: How Unix time counts seconds from 1970, why some timestamps have 13 digits, what the year 2038 problem is, and how to convert epoch time to a readable date.
tags: [Developers, Time, Explainer]
---

A Unix timestamp is the number of seconds that have passed since midnight UTC on 1 January 1970, a moment known as the Unix epoch. For example, `1767225600` means exactly 2026-01-01 00:00:00 UTC. Because it's a single number with no time zone attached, it's the most common way computers store and exchange points in time.

This explainer covers how the count works, the seconds-versus-milliseconds confusion, and the pitfalls that catch developers most often.

## How does Unix time count?

The rules are deliberately simple:

- Start at **0 = 1970-01-01T00:00:00Z**.
- Add **86,400 for every day** (24 × 60 × 60), with no exceptions.
- Times before 1970 are **negative**: `-86400` is 31 December 1969.

That simplicity has one consequence worth knowing: Unix time **ignores leap seconds**. Every day is treated as exactly 86,400 seconds, so a Unix timestamp isn't a perfect count of physical seconds elapsed. For almost every application, that's an advantage: date math stays simple.

A few reference points:

| Timestamp    | UTC date and time   |
| ------------ | ------------------- |
| `0`          | 1970-01-01 00:00:00 |
| `1000000000` | 2001-09-09 01:46:40 |
| `1767225600` | 2026-01-01 00:00:00 |
| `1800000000` | 2027-01-15 08:00:00 |
| `2147483647` | 2038-01-19 03:14:07 |

## Is a Unix timestamp affected by time zones?

No, and this is its biggest strength. The same instant has the same timestamp everywhere in the world. Time zones only enter the picture when you _display_ that instant to a person. `1767225600` is midnight on New Year's Day in London, 7 p.m. on New Year's Eve in New York and 9 a.m. on 1 January in Tokyo, yet it's one number for all three.

That's why databases, logs and APIs store timestamps and convert to local time at the very last step.

## Why do some timestamps have 13 digits?

Because they count **milliseconds** instead of seconds. JavaScript's `Date.now()`, Java's `System.currentTimeMillis()` and many web APIs use milliseconds; Unix shells (`date +%s`), Python's `time.time()` and most databases use seconds.

| Unit         | Digits today | Example for the same instant |
| ------------ | ------------ | ---------------------------- |
| Seconds      | 10           | `1767225600`                 |
| Milliseconds | 13           | `1767225600000`              |

Mixing them up produces two telltale bugs:

- **Seconds read as milliseconds** lands you in January 1970. `1767225600` milliseconds is only about 20 days after the epoch.
- **Milliseconds read as seconds** lands you tens of thousands of years in the future.

If a date in your app shows 1970 or a five-digit year, check the unit first.

## What is the year 2038 problem?

Older systems store Unix time as a **signed 32-bit integer**, whose largest value is 2,147,483,647. That's reached at **03:14:07 UTC on 19 January 2038**. One second later, the number overflows and wraps around to a large negative value, which reads as December 1901.

Modern operating systems, databases and languages use 64-bit timestamps, which won't overflow for billions of years. The risk lives in old embedded devices, legacy file formats and database columns defined as 32-bit integers. If you design a schema today, use a 64-bit integer or a native timestamp type.

## How to convert a timestamp to a date (and back)

1. Open the [Unix Timestamp Converter](/online-tool/date-time-tools/unix-timestamp-converter). The **Current Unix time** ticks live at the top, with **Copy seconds** and **Copy ms** buttons.
2. Paste a timestamp into the input. The tool shows the **Detected unit**: values with 12 or more digits are treated as milliseconds, shorter ones as seconds. Negative values work too.
3. Read the results: your **Local time** (with your time zone name), **UTC**, **ISO 8601**, the value in **Unix seconds** and **Unix milliseconds**, and a **Relative** description like "in 3 months."
4. To go the other way, use **Date → Unix timestamp**: pick a date and time (in your own time zone) and copy the seconds, milliseconds or ISO 8601 value.

Click **Now** at any point to reset the input to the current time. Conversions run entirely in your browser.

## Pitfalls worth avoiding

- **Building timestamps from local dates without thinking about the zone.** "Midnight on 1 January" is a different timestamp in every time zone. Decide which zone you mean before converting.
- **Storing local time strings instead of timestamps.** A string like `2026-03-29 02:30` may not exist, or may occur twice, in zones that change clocks for daylight saving time.
- **Assuming a timestamp is a date.** A timestamp is an instant. If you need a calendar date such as a birthday, store the date itself.
- **Comparing timestamps of different units.** Normalize to seconds or milliseconds before subtracting.

If you're working with other formats, such as ISO 8601 strings in an API response or RFC 2822 dates in email headers, the [Timestamp Converter](/online-tool/date-time-tools/timestamp-converter) accepts almost any date format. JWT `exp` and `iat` claims are Unix seconds too, which you can inspect with the [JWT Decoder](/online-tool/developer-tools/jwt-decoder).

## FAQ

### How do I get the current Unix timestamp in code?

JavaScript: `Math.floor(Date.now() / 1000)`. Python: `int(time.time())`. Shell: `date +%s`. Each returns seconds.

### Can a Unix timestamp have decimals?

Yes. Some systems use fractional seconds such as `1767225600.25`. The converter accepts decimal values and interprets them as seconds.

### Why does my converted time look an hour off?

Usually daylight saving time: the timestamp is right, but you're comparing it against a clock in a different offset. Check the UTC value to confirm.

Have a number to decode? [Convert it with the Unix Timestamp Converter](/online-tool/date-time-tools/unix-timestamp-converter).
