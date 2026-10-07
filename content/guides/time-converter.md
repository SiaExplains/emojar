---
slug: why-a-month-is-30-44-days-time-unit-conversion
tool: time-converter
title: Why a Month Is 30.44 Days in Time Conversions
description: "Seconds, hours and weeks convert exactly, but months and years don't. Here's how average month and year lengths work, and when to use a date tool instead."
tags: [Time, Units, Explainer]
---

Seconds, minutes, hours, days and weeks convert exactly: a day is always 86,400 seconds and a week is always 168 hours. Months and years are different, because real months run from 28 to 31 days and years have 365 or 366. A time converter therefore uses **averages**: a year of **365.2425 days** (the average Gregorian year) and a month of one twelfth of that, **30.436875 days**.

That is the right choice for converting durations, and the wrong one for counting calendar dates. Here is how it works and when it matters.

## The fixed conversions

These hold every time, with no averaging:

| Unit     | Equals                               |
| -------- | ------------------------------------ |
| 1 second | 1,000 milliseconds                   |
| 1 minute | 60 seconds                           |
| 1 hour   | 60 minutes = 3,600 seconds           |
| 1 day    | 24 hours = 86,400 seconds            |
| 1 week   | 7 days = 168 hours = 604,800 seconds |

(Leap seconds are occasionally added to clock time to keep it aligned with Earth's rotation. They don't change these unit definitions.)

## Where does 365.2425 come from?

The Gregorian calendar, used in most of the world, adds leap days with three rules:

1. Every year divisible by 4 is a leap year (+1/4 day per year on average),
2. except years divisible by 100 (−1/100),
3. except years divisible by 400, which are leap years after all (+1/400).

Add it up: 365 + 0.25 − 0.01 + 0.0025 = **365.2425 days**. The calendar repeats exactly every 400 years, and that is its average length. It is very close to the solar year, which is why the seasons stay put.

Divide by 12 and you get the average month: **30.436875 days**, or about **4.35 weeks**.

## What does this mean in practice?

When you convert months or years, you get a statistically fair answer, not a calendar-exact one.

- 1 year = **52.1775 weeks**, not exactly 52. That is why some years contain 53 paydays for people paid weekly.
- 1 year = **8,765.82 hours**.
- 3 months = **91.31 days**. An actual quarter can be 90, 91 or 92 days.
- 18 months = exactly **1.5 years**, since both use the same average.

For questions like "how long is a 3-month notice period starting March 1?", use a calendar tool instead. The [Date Calculator](/online-tool/calculators/date-calculator) adds real months to a real date.

## Fun conversions that put numbers in perspective

- **One million seconds** is about **11.57 days**.
- **One billion seconds** is about **31.69 years**.
- **10,000 hours**, the often-quoted practice target, is about **1.14 years** of round-the-clock time. At 40 hours a week, it is 250 weeks, or nearly five years.

## Everyday conversions

- **Decimal hours to minutes:** 2.75 h = **165 minutes** = 2 h 45 min. Useful for reading timesheets and invoices.
- **Minutes to hours:** 90 minutes = **1.5 hours**.
- **Hours to days:** a 40-hour work week is **1.67 days** of continuous time.
- **Milliseconds:** 500 ms = **0.5 s**, a common figure in web performance budgets and video timing.

## How to use the Time Converter

The [Time Converter](/online-tool/unit-converters/time-converter) works with eight units:

1. Enter a number in **Value**. Decimals are fine.
2. Choose **From** and **To**: milliseconds, seconds, minutes, hours, days, weeks, months (average) or years (365.2425 days). The ⇄ button swaps them.
3. Read the result, or scan the table that shows the same duration in every unit at once.

Results show up to 10 significant digits, and very large or very small numbers switch to scientific notation.

## When to use a different tool

- **Clock times and shift lengths:** for the time between 09:00 and 17:30, use the [Time Duration Calculator](/online-tool/calculators/time-duration-calculator), which also handles breaks and overnight shifts.
- **Specific dates:** for the exact number of days between two dates, use a date tool, since real months vary in length.
- **Timestamps:** Unix timestamps count seconds since January 1, 1970. Converting one to a readable date needs the [Unix Timestamp Converter](/online-tool/date-time-tools/unix-timestamp-converter), not a unit conversion.

## FAQ

### Why doesn't 1 month equal 4 weeks?

Four weeks is 28 days, but the average month is 30.44 days, so a month is about 4.35 weeks. Only February in a common year is exactly four weeks.

### Is a year 365 or 365.25 days in this converter?

Neither: it's 365.2425 days, the Gregorian average. 365.25 is the Julian year, which astronomers sometimes use.

### How many seconds are in a year?

Using the average Gregorian year, 31,556,952 seconds. A common 365-day year has exactly 31,536,000.

Convert any duration from milliseconds to years with the [Time Converter](/online-tool/unit-converters/time-converter).
