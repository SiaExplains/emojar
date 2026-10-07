---
slug: how-to-count-business-days-excluding-holidays
tool: working-days-calculator
title: How to Count Business Days Between Dates, Excluding Holidays
description: A checklist for accurate working-day counts - inclusive dates, the right weekend, observed holidays and holidays that fall on weekends - with 2026 examples.
tags: [Dates, Business, Checklist]
---

To count business days between two dates, count every calendar day in the range (including both ends), subtract the weekend days, then subtract the public holidays that fall on remaining weekdays. For all of 2026, that's 365 days minus 104 weekend days, or 261 Monday-to-Friday working days, and 250 once the eleven US federal holidays are removed.

Getting there reliably means making a handful of decisions correctly. Here's a checklist, with worked examples you can reproduce.

## 1. Confirm whether both dates count

Business-day counts are almost always **inclusive**: a project running Monday 2 November to Friday 6 November is 5 working days, not 4. The Emojar [Working Days Calculator](/online-tool/date-time-tools/working-days-calculator) includes both the start and end date, and shows the inclusive **Calendar days** total so you can sanity-check the range.

If your rule says "within 10 business days _after_" an event, the event day itself usually doesn't count. In that case, set the start date to the following day.

## 2. Choose the right weekend

Not every country rests on Saturday and Sunday. The calculator's **Weekend days** setting offers:

| Option            | Common in                              | 2026 working days (no holidays) |
| ----------------- | -------------------------------------- | ------------------------------- |
| Saturday & Sunday | Most of the world                      | 261                             |
| Friday & Saturday | Several Middle Eastern countries       | 261                             |
| Sunday only       | Six-day working weeks                  | 313                             |
| None              | Every day counts, e.g. 24/7 operations | 365                             |

The first two happen to match in 2026, but over a short range, such as a single week or month, the choice of weekend can change the answer by a day or two.

## 3. List the holidays for the right place

The calculator doesn't assume any country's holidays, because they differ by country, state, industry and even employer. Paste them into **Public holidays to exclude (optional)**, one date per line in `YYYY-MM-DD` format. Commas, spaces or semicolons also work as separators.

Here are the 2026 US federal holidays, ready to paste:

```
2026-01-01
2026-01-19
2026-02-16
2026-05-25
2026-06-19
2026-07-03
2026-09-07
2026-10-12
2026-11-11
2026-11-26
2026-12-25
```

With Saturday & Sunday weekends and these dates, 1 January to 31 December 2026 comes out at **250 working days**.

If a date is typed wrongly, such as `11/26/2026` or `2026-02-30`, the calculator lists the invalid entries instead of silently ignoring them.

## 4. Use the observed date, not the calendar date

When a holiday falls on a weekend, many countries give employees a weekday off instead. In 2026, US Independence Day (4 July) falls on a Saturday, so the federal holiday is **observed on Friday, 3 July**, which is why the list above uses 3 July. Always paste the day people actually take off.

## 5. Don't subtract weekend holidays twice

A holiday on a Saturday or Sunday doesn't reduce working days, since nobody was working anyway. The calculator handles this automatically.

**Example: December 2026** for an office that closes on Christmas Eve (Thursday 24), Christmas Day (Friday 25) and Boxing Day (Saturday 26):

| Result                    | Value |
| ------------------------- | ----- |
| Working days              | 21    |
| Calendar days (inclusive) | 31    |
| Weekend days              | 8     |
| Holidays on working days  | 2     |
| Working hours (8 h/day)   | 168   |

Three holidays were entered, but only two reduce the count, because Boxing Day is a Saturday. (In the real UK calendar, the substitute day for Boxing Day 2026 is Monday 28 December, which illustrates point 4.)

## 6. Check the hours assumption

**Working hours (8 h/day)** multiplies working days by eight. For a 7.5-hour day or a 4-day week, use the working-day figure and do your own multiplication: 21 days × 7.5 hours = 157.5 hours.

## 7. Account for part-time, half days and leave separately

Half-day holidays (such as a company closing at noon on Christmas Eve), individual vacation days and part-time schedules aren't modeled. Subtract them from the result by hand, or list a full day off as a holiday if it applies to everyone.

## How to run the calculation

1. Open the Working Days Calculator. It starts with 1 January to 31 December of the current year.
2. Enter your **Start date** and **End date**.
3. Choose your **Weekend days**.
4. Paste your holiday dates, if any.
5. Read **Working days** and the supporting figures underneath.

All the counting happens in your browser. If you need a deadline rather than a count, for example "15 business days from today," use [Add or Subtract Days from a Date](/online-tool/date-time-tools/date-add-subtract), and remember to add a day for each holiday in that span.

## FAQ

### Does the order of the dates matter?

No. If the end date is earlier than the start date, the calculator swaps them and counts the same inclusive range.

### Where do I find official holiday dates?

Use your government's official calendar or your employer's HR holiday list. Regional holidays, such as US state holidays or German state holidays, vary within a country, so make sure the list matches where the work happens.

### Can I count working days for a payroll period?

Yes. Enter the first and last day of the pay period and your company's paid holidays. It's a calendar count only, so payroll rules about part-time hours or overtime still apply separately.

Ready to count? [Open the Working Days Calculator](/online-tool/date-time-tools/working-days-calculator).
