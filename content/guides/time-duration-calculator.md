---
slug: timesheet-hours-decimal-checklist
tool: time-duration-calculator
title: 'Timesheet Hours Checklist: Breaks, Night Shifts, Decimals'
description: 'Why 7 hours 45 minutes is 7.75 hours, not 7.45. A practical checklist for calculating shift lengths, unpaid breaks and overnight hours on timesheets.'
tags: [Time, Work, Calculators]
---

To calculate hours worked, subtract the start time from the end time, take off any unpaid break, and convert leftover minutes to a fraction of an hour by dividing by 60. A shift from 08:45 to 17:10 with a 40-minute break is 7 hours 45 minutes, which is **7.75 decimal hours**, not 7.45. Most timesheet errors come from that last step, or from shifts that cross midnight.

Use this checklist whenever you fill in or check a timesheet.

## 1. Use the 24-hour clock

Writing times as 08:45 and 17:10 removes any doubt about a.m. and p.m. A shift written as "8:45 to 5:10" looks like it runs backward, which is how negative or wildly wrong totals creep into spreadsheets.

## 2. Subtract the break, and only the unpaid part

Paid breaks count as working time; unpaid ones don't. Check your contract or company policy, then subtract only the unpaid minutes.

A standard day of 09:00 to 17:30 with a 30-minute unpaid lunch is 8 hours 30 minutes on the clock, minus 30 minutes: **8 h 0 min**, or 8.00 decimal hours (480 minutes).

## 3. Convert minutes to decimals correctly

Payroll systems usually want hours as a decimal number. Divide the minutes by 60:

| Minutes | Decimal hours |
| ------- | ------------- |
| 15      | 0.25          |
| 20      | 0.33          |
| 30      | 0.50          |
| 40      | 0.67          |
| 45      | 0.75          |
| 50      | 0.83          |

So 7 h 45 min is 7 + 45/60 = **7.75**. The classic mistake is to write it as 7.45, treating the minutes as if they were hundredths of an hour.

That mistake costs real money. At a rate of 22.00 an hour, 7.75 hours pays **170.50**, while 7.45 hours pays 163.90, a shortfall of 6.60 for a single shift.

## 4. Handle night shifts that cross midnight

A shift from 22:00 to 06:15 has an end time that is "earlier" than its start. Treat the end as the next day:

- 22:00 to 24:00 is 2 h
- 00:00 to 06:15 is 6 h 15 min
- Total on the clock: 8 h 15 min
- Minus a 45-minute break: **7 h 30 min**, or 7.50 decimal hours

A good calculator does this automatically and tells you it has assumed the next day, so you can confirm it was intentional.

## 5. Add up the week in minutes, not decimals

Rounding each day to two decimals and then adding can drift by a few hundredths. It is safer to total the minutes and convert once. Five shifts of 465 minutes are 2,325 minutes; 2,325 ÷ 60 = **38.75 hours**.

## 6. Know your rounding rules

Some employers round clock-in times to the nearest 5, 6 or 15 minutes; others pay to the exact minute. Apply the employer's rounding to the start and end times first, then calculate the duration. Decimal hours with recurring fractions, such as 20 minutes (0.333…), are normally rounded to two decimal places.

## How to use the Time Duration Calculator

The [Time Duration Calculator](/online-tool/calculators/time-duration-calculator) applies the checklist for you:

1. Enter the **Start time** and **End time**.
2. Enter the **Break** in minutes (leave it at 0 if there was none).
3. Read the **Duration** in hours and minutes, the **Decimal hours** (two decimal places), and the **Total minutes**.

If the end time is earlier than the start time, the calculator treats it as the next day and shows a note saying so. If the break is longer than the time span, you get an error instead of a negative result. Everything is calculated in your browser.

## What it doesn't cover

- **Shifts of 24 hours or more.** The calculator works on times of day, so a start and end at the same time gives 0, not 24 hours. Split very long shifts at midnight and add the parts.
- **Daylight-saving changes.** On the night the clocks change, a shift that crosses the switch is really an hour longer or shorter than the clock times suggest. Adjust by hand for that one night.
- **Multi-day spans.** For gaps measured in days rather than hours, use the [Date Difference Calculator](/online-tool/date-time-tools/date-difference-calculator).

To convert a total into other units, such as minutes into hours or hours into days, the [Time Converter](/online-tool/unit-converters/time-converter) does it instantly.

## FAQ

### How do I convert decimal hours back to minutes?

Multiply the decimal part by 60. 6.4 hours is 6 hours plus 0.4 × 60 = 24 minutes, so 6 h 24 min.

### Should I include travel time between job sites?

That depends on your employment law and contract, not on the arithmetic. If it counts as work, include it in the span or enter it as a separate calculation.

### Why does my spreadsheet show a different total?

Spreadsheets store times as fractions of a day. Multiply a time difference by 24 to get decimal hours, and wrap overnight differences with a "+1 day" adjustment, or you may get a negative number.

Check any shift in seconds with the [Time Duration Calculator](/online-tool/calculators/time-duration-calculator).
