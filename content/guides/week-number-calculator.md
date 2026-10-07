---
slug: iso-week-numbers-explained-why-some-years-have-53-weeks
tool: week-number-calculator
title: 'ISO Week Numbers Explained: Why Some Years Have 53 Weeks'
description: How ISO 8601 week numbers work, why 1 January can be in week 53, how 2026 ends up with 53 weeks, and why your US calendar may show a different number.
tags: [Dates, Calendars, Explainer]
---

ISO week numbers follow two rules: weeks run from Monday to Sunday, and week 1 is the week that contains the year's first Thursday. Everything else follows from that. It's why 1 January can belong to the previous year's week 52 or 53, and why some years, including 2026, have 53 weeks instead of 52. Wednesday, 7 October 2026, for example, is in ISO week 41, which runs from Monday 5 to Sunday 11 October.

Here's how the system works, where it surprises people, and how it differs from the week numbers on many US calendars.

## The two rules behind ISO weeks

The ISO 8601 standard defines week numbering like this:

1. **A week starts on Monday** and ends on Sunday.
2. **Week 1 is the week containing the first Thursday of the year.** Equivalently, it's the week that contains 4 January.

Why Thursday? Because it's the middle of a Monday-to-Sunday week. If a week has its Thursday in the new year, then at least four of its seven days are in the new year, so the whole week is assigned to it. Every week therefore belongs entirely to one "ISO year," with no split weeks.

## Why can 1 January be in week 52 or 53?

Because the first few days of January may fall in a week whose Thursday is still in December. Those days belong to the last week of the previous ISO year.

The year 2027 is a good example. 1 January 2027 is a Friday. The Thursday of that week is 31 December 2026, so the week belongs to 2026:

| Date            | ISO week | ISO week-year |
| --------------- | -------- | ------------- |
| Thu 31 Dec 2026 | 53       | 2026          |
| Fri 1 Jan 2027  | 53       | **2026**      |
| Sun 3 Jan 2027  | 53       | **2026**      |
| Mon 4 Jan 2027  | 1        | 2027          |

The reverse happens too. Monday, 30 December 2024 is in **week 1 of 2025**, because that week's Thursday was 2 January 2025.

This is why the calculator shows an **ISO week-year** next to the week number. For dates near New Year, it can differ from the calendar year, and reports or filenames that combine the calendar year with the ISO week (like "2027-W53") are a classic bug.

## Which years have 53 weeks?

A year has 53 ISO weeks when it **starts on a Thursday**, or when it's a **leap year that starts on a Wednesday**. Otherwise it has 52.

2026 starts on Thursday, 1 January, so it has 53 weeks. Between 2020 and 2039, the 53-week years are **2020, 2026, 2032 and 2037**. That's roughly one year in every five to six.

For payroll, retail reporting and sprint planning, the extra week matters. A "52-week" annual plan in 2026 leaves a week unaccounted for, and year-over-year comparisons of "week 53" have nothing to compare against.

## Why does my calendar show a different week number?

Because there's more than one system. Many US calendars and spreadsheet defaults:

- start weeks on **Sunday**, and
- call the week containing **1 January** week 1, however few days of it fall in January.

The two systems agree for much of the year but differ around New Year and on Sundays:

| Date            | ISO 8601          | Common US style |
| --------------- | ----------------- | --------------- |
| Fri 1 Jan 2027  | Week 53 (of 2026) | Week 1          |
| Sun 11 Oct 2026 | Week 41           | Week 42         |
| Wed 7 Oct 2026  | Week 41           | Week 41         |

Europe, most of Asia and international businesses use ISO weeks. In Germany, the "KW" (Kalenderwoche) in meeting invites is the ISO number. If you're coordinating across regions, say "ISO week" explicitly.

In spreadsheets, `ISOWEEKNUM()` gives the ISO number, while `WEEKNUM()` uses the US-style system by default. In code, Python's `date.isocalendar()` and the `%V` format code return ISO weeks.

## How to find the week number of any date

1. Open the [Week Number Calculator](/online-tool/date-time-tools/week-number-calculator). It shows today's week immediately.
2. Pick any **Date**.
3. Read the results:
   - **ISO week number**, e.g. "Week 41"
   - **ISO week-year**, which matters around New Year
   - **Week runs**, the Monday and Sunday dates of that week
   - **Day of the year**: 7 October 2026 is day 280
   - **Weeks in this ISO year**: 52 or 53

The calculation uses dates only, with no time zone, so it gives the same answer wherever you are.

## Practical uses

- **Sprint and release planning.** "Ship in W48" is compact and unambiguous across languages, as long as everyone uses ISO weeks.
- **Retail and production reporting.** Weekly figures line up neatly because every ISO week has exactly seven days in one year.
- **Booking and logistics.** Many European suppliers quote delivery by calendar week.

If you then need to count days to that week, the [Date Difference Calculator](/online-tool/date-time-tools/date-difference-calculator) works with any pair of dates.

## FAQ

### How do I write an ISO week as text?

The standard format is `2026-W41`, or `2026-W41-3` for a specific day (3 = Wednesday). Always use the ISO week-year, not the calendar year.

### Is there ever a week 0?

Not in ISO 8601. Some other systems number the partial week before the first full week as week 0, which is another reason to state which system you're using.

### Does every month have the same number of ISO weeks?

No. ISO weeks don't align with months at all; a week can start in one month and end in the next. They're best used for planning by week, not for grouping by month.

Want to know which week a date falls in? [Look it up with the Week Number Calculator](/online-tool/date-time-tools/week-number-calculator).
