---
slug: fill-in-a-weekly-time-card-with-overtime
tool: time-card-calculator
title: 'Filling In a Weekly Time Card: Three Real Weeks, Worked Through'
description: An office week, a run of night shifts and a four-day 10-hour schedule, each totaled with breaks and overtime so you can check your own pay.
tags: [Time Card, Overtime, Payroll]
---

To fill in a weekly time card, enter each day's start time, end time and unpaid break, add the hours up, then split anything over the overtime threshold (usually 40 hours a week in the US) from your regular hours. Multiply regular hours by your rate and overtime hours by your rate times 1.5. The tricky parts are overnight shifts, breaks and minutes.

Below are three typical weeks worked through with the [time card calculator](/online-tool/date-time-tools/time-card-calculator), with exact inputs and outputs, so you can see how each rule plays out.

## How is the time card laid out?

The table has one row per day, **Monday** to **Sunday**, with **Start**, **End** and **Break (min)** columns. The **Hours** column fills in as you type, as hours and minutes followed by decimal hours, for example `8:00 (8.00)`. Below the table are four settings:

- **Hourly rate (optional)**: leave it empty if you only need hours.
- **Overtime after (hours/week)**: 40 by default.
- **…or after (hours/day)**: empty by default, for daily overtime rules.
- **Overtime multiplier**: 1.5 by default.

The results show **Total hours**, **Regular hours**, **Overtime hours** and **Gross pay**. **Copy as CSV** and **Download CSV** export the week for a spreadsheet.

## Week 1: an office job with a short Saturday

Jordan works mostly nine-to-five with a half-hour unpaid lunch and earns $20 an hour:

| Day       | Start | End   | Break | Hours       |
| --------- | ----- | ----- | ----- | ----------- |
| Monday    | 9:00  | 17:30 | 30    | 8:00 (8.00) |
| Tuesday   | 8:45  | 17:15 | 30    | 8:00 (8.00) |
| Wednesday | 9:00  | 18:30 | 45    | 8:45 (8.75) |
| Thursday  | 9:15  | 17:00 | 30    | 7:15 (7.25) |
| Friday    | 9:00  | 16:00 | 30    | 6:30 (6.50) |
| Saturday  | 10:00 | 14:20 | 0     | 4:20 (4.33) |

**Total hours** reads 42:50 (42.83 h). With the default 40-hour weekly threshold, that's 40.00 regular and 2.83 overtime hours. Gross pay is 40 × $20 = $800 plus 2 h 50 min of overtime at $30 = $85, for **$885.00**.

Notice that 4 hours 20 minutes is 4.33 hours, not 4.20. Minutes are divided by 60, the most common slip on hand-written timesheets.

Without the Saturday, this is the tool's **Load sample week**: 38:30 total, no overtime, $770.00 at $20.

## Week 2: night shifts that cross midnight

Sam works nights in a warehouse at $18 an hour. Each shift starts in the evening and ends the next morning:

- Monday: 10pm to 6:30am, 30-minute break → 8:00
- Tuesday to Thursday: 22:00 to 7:00, 30-minute break → 8:30 each
- Friday: 22:00 to 8:00, 30-minute break → 9:30

When the end time is earlier than the start, the calculator treats it as an overnight shift and adds 24 hours, so 22:00 to 7:00 counts as 9 hours before the break. Enter each shift on the row of the day it **started**, so Monday night's shift goes on Monday even though it ends on Tuesday morning.

The week totals 43:00 (43.00 h): 40.00 regular, 3.00 overtime, and **$801.00** gross (40 × $18 + 3 × $27). You can mix formats freely: `10pm`, `10:00 pm`, `22:00` and `2200` all mean the same time.

## Week 3: four 10-hour days, where daily overtime matters

Alex works a compressed schedule at $22 an hour: Monday to Thursday, 6:00 to 16:30 with a 30-minute break, which is 10:00 hours a day and 40:00 for the week.

| Overtime setting          | Regular | Overtime | Gross pay |
| ------------------------- | ------- | -------- | --------- |
| 40 hours/week only        | 40.00   | 0.00     | $880.00   |
| 40/week plus 8 hours/day  | 32.00   | 8.00     | $968.00   |
| 40/week plus 10 hours/day | 40.00   | 0.00     | $880.00   |

Under a pure weekly rule, like the US federal standard, a 4×10 week earns no overtime. Under a daily rule, every hour past the eighth each day is overtime, which adds $88 here. When you set both thresholds, the calculator counts daily overtime first and then applies the weekly threshold to the remaining hours, so no hour is paid as overtime twice. Which rule applies to you depends on your state, country and contract. The pay figure is an estimate before tax, not payroll or legal advice.

## Why does a row say "check times"?

A red "check times" in the Hours column means one of the times couldn't be read, and that day is left out of the totals until you fix it. Common causes:

- **A dot instead of a colon.** `9.30` isn't accepted. Type `9:30` or `930`.
- **Only one time filled in.** A start without an end can't be totaled.
- **Impossible times**, such as `13pm` or `9:75`.

Two more things to know: a start and end that are the same (9:00 to 9:00) count as 0 hours, not a 24-hour shift, and setting **Overtime after (hours/week)** to 0 turns weekly overtime off entirely.

## When should you use a different tool?

For a single shift length or a quick "how long between these two times," the [time duration calculator](/online-tool/calculators/time-duration-calculator) is faster. If you're comparing a salaried offer with hourly work, the [salary to hourly calculator](/online-tool/calculators/salary-to-hourly-calculator) converts between the two.

## FAQ

### Should I enter paid breaks?

No. Only enter breaks you aren't paid for, because the Break (min) value is subtracted from that day. If your 15-minute rest breaks are paid, leave them out.

### Is my time card saved?

No. Entries stay on the page while it's open and are calculated in your browser. Download the CSV before closing the tab if you want a record.

### Can I use it for a two-week pay period?

Fill in one week at a time. Overtime is normally calculated per workweek, so two separate weekly cards give the correct overtime split, and you can add the two gross pay figures together.

Enter your own week in the [time card calculator](/online-tool/date-time-tools/time-card-calculator) and check it against your pay stub.
