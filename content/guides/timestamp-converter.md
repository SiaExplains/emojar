---
slug: iso-8601-vs-rfc-2822-vs-unix-date-formats-compared
tool: timestamp-converter
title: ISO 8601 vs RFC 2822 vs Unix Time - Date Formats Compared
description: Which date format should you use in an API, a log file, an email header or a spreadsheet? A side-by-side comparison with examples and parsing pitfalls.
tags: [Developers, Time, Comparison]
---

For data exchange, use ISO 8601 with an explicit offset, like `2026-10-07T14:30:00Z`: it's unambiguous, human-readable and sorts correctly as text. Use Unix timestamps when you need compact numbers for storage or arithmetic, RFC 2822 only where a protocol demands it (mainly email headers), and keep locale formats like `10/07/2026` for display to people, never for storage.

Here's how the common formats compare, and the parsing traps that cause off-by-hours and off-by-months bugs.

## The main formats side by side

All of these represent the same instant:

| Format                   | Example                         | Where you'll see it                            |
| ------------------------ | ------------------------------- | ---------------------------------------------- |
| ISO 8601 / RFC 3339      | `2026-10-07T14:30:00Z`          | JSON APIs, logs, databases, HTML `<time>`      |
| ISO 8601 with offset     | `2026-10-07T16:30:00+02:00`     | Calendars, APIs that preserve local time       |
| RFC 2822 / HTTP date     | `Wed, 07 Oct 2026 14:30:00 GMT` | Email headers, HTTP `Date` and `Last-Modified` |
| Unix seconds             | `1791383400`                    | Unix systems, JWT claims, many databases       |
| Unix milliseconds        | `1791383400000`                 | JavaScript, Java, many web APIs                |
| US locale (New York)     | `10/7/2026, 10:30 AM`           | User interfaces in the US                      |
| European locale (Berlin) | `07.10.2026 16:30`              | User interfaces in Germany and nearby          |

## How do they compare?

| Property                    | ISO 8601 (with Z/offset) | RFC 2822                | Unix time              | Locale strings |
| --------------------------- | ------------------------ | ----------------------- | ---------------------- | -------------- |
| Unambiguous                 | Yes                      | Yes                     | Yes                    | No             |
| Human-readable              | Yes                      | Yes                     | No                     | Yes            |
| Sorts correctly as text     | Yes (same offset)        | No                      | Yes (same digit count) | No             |
| Carries the original offset | Yes                      | Yes                     | No                     | Rarely         |
| Compact                     | Medium                   | Long                    | Short                  | Medium         |
| Locale-independent          | Yes                      | English day/month names | Yes                    | No             |

**ISO 8601** wins most comparisons. It orders the parts from largest to smallest (year, month, day, hour…), so alphabetical order equals chronological order, which is why it's the safest choice for filenames like `report-2026-10-07.csv`. The internet profile of ISO 8601, [RFC 3339](https://www.rfc-editor.org/rfc/rfc3339), is what most APIs mean when they say "ISO date."

**RFC 2822** is required in email `Date:` headers, and the closely related HTTP date format appears in web headers. It's readable but uses English names and doesn't sort.

**Unix time** is ideal for arithmetic: the difference between two timestamps is just subtraction. But it loses the original time zone, and `1791383400` means nothing to a human.

**Locale formats** are for display only. `03/04/2026` is 4 March in the US and 3 April in most of Europe; nothing in the string tells you which.

## What does the Z mean, and why does the offset matter?

`Z` stands for UTC (also called Zulu time) and is the same as `+00:00`. An offset like `+02:00` means "this wall-clock time is two hours ahead of UTC." Both identify a single instant.

The danger is a timestamp **without** any offset, like `2026-10-07T14:30:00`. It's a wall-clock time with no zone, so different software will interpret it differently, usually as the local time of whatever machine reads it. A server in UTC and a laptop in California will disagree by seven hours.

## Parsing pitfalls to watch for

**Date-only strings are treated as UTC; date-times without an offset are treated as local.** In JavaScript, and therefore in any browser-based converter, `2026-10-07` means midnight UTC, while `2026-10-07T00:00` means midnight in _your_ zone. Viewed from New York, the first displays as 8 p.m. on 6 October.

**Slashed dates are a guess.** Browsers usually read `10/07/2026` month-first (US style), but that's convention rather than standard. Convert ambiguous dates to ISO before sharing them.

**Fractional seconds vary.** ISO strings can carry milliseconds (`.000`) or none. Both are valid; just be consistent within one system.

**Two-digit years are risky.** `07 Oct 26` could be read as 1926 or 2026 depending on the parser.

## How to convert between formats

1. Open the [Timestamp Converter](/online-tool/date-time-tools/timestamp-converter). It starts with the current time in ISO 8601.
2. Paste a date into **Date, time or timestamp**: an ISO string, an RFC 2822 date from an email header, a Unix timestamp in seconds or milliseconds, or plain text like `October 7, 2026 2:30 PM`.
3. Read every representation at once: **Local time** in your time zone, **UTC**, **ISO 8601**, **Unix seconds**, **Unix milliseconds** and a **Relative** description such as "2 days ago."
4. Copy the format you need. Press **Now** to load the current moment.

If the input can't be understood, the tool says so and suggests ISO 8601 or a Unix timestamp. Everything is parsed locally in your browser.

For a focused epoch workflow, including picking a date and getting its timestamp, use the [Unix Timestamp Converter](/online-tool/date-time-tools/unix-timestamp-converter). To see one moment across several cities, the [Time Zone Converter](/online-tool/date-time-tools/timezone-converter) is the better fit.

## FAQ

### Should I store dates in UTC or local time?

Store instants (when something happened) in UTC, either as ISO 8601 with `Z` or as a Unix timestamp. Store the user's time zone name separately if you need to show local times later.

### Is `2026-10-07 14:30:00` with a space valid ISO 8601?

Strictly, ISO 8601 uses a `T` between date and time; RFC 3339 allows a space. Many parsers accept both, but use `T` for maximum compatibility.

### Why does the ISO output end in .000Z?

The converter outputs the full ISO form with milliseconds and UTC. `2026-10-07T14:30:00.000Z` and `2026-10-07T14:30:00Z` are the same instant.

Got a date in an awkward format? [Convert it with the Timestamp Converter](/online-tool/date-time-tools/timestamp-converter).
