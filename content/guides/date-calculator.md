---
slug: date-calculator-deadlines-notice-periods-trips
tool: date-calculator
title: Counting Days for Deadlines, Notice Periods and Trips
description: 'Return windows, notice periods, countdowns and month-end deadlines: real scenarios for counting days between dates and adding time, with worked answers.'
tags: [Dates, Calculators, Planning]
---

To count days between two dates, subtract the earlier date from the later one; the answer is the number of nights in between, so October 7 to January 15 is 100 days. To find a deadline, add the period to the start date, adding months and years first and then weeks and days. Both are quick to do with a date calculator, and both have a couple of traps that cause off-by-one errors.

Below are five real situations, walked through with actual dates.

## Scenario 1: How many days until an event?

It is October 7, 2026 and a conference starts on January 15, 2027. How long is left?

Count the days left in each month: 24 in October (after the 7th), 30 in November, 31 in December and 15 in January. That is **100 days**. Expressed in other units, it is **14 weeks and 2 days**, or **3 months and 8 days** (October 7 to January 7 is 3 months, then 8 more days).

Notice the method: the start date itself is not counted, the end date is. That is the same as counting nights in a hotel. A stay from December 20 to December 27 is **7 nights**, even though it touches 8 calendar dates.

## Scenario 2: When does a 90-day window close?

You buy something on October 7, 2026 with a 90-day return policy. Adding 90 days gives **Tuesday, January 5, 2027**.

Check the retailer's wording, though. "Within 90 days" sometimes means the 90th day is the last valid day, and sometimes that day 1 is the purchase date itself. If day 1 is the purchase date, the last day moves one day earlier, to January 4. When money is at stake, assume the earlier date.

## Scenario 3: Adding a month to January 31

Your lease says the first payment is due one month after January 31, 2027. February has no 31st, so what is the due date?

The usual convention, and the one this calculator follows, is to **clamp to the last day of the month**: January 31 + 1 month = **Sunday, February 28, 2027**. In a leap year it would be February 29.

This creates a small surprise worth knowing: "1 month" and "30 days" are not the same. From January 30, 2026:

| Added             | Result                 |
| ----------------- | ---------------------- |
| 30 days           | Sunday, March 1, 2026  |
| 1 month + 30 days | Monday, March 30, 2026 |

When a contract specifies a period in days, add days. When it specifies months, add months.

## Scenario 4: A notice period counted backward

You need to give six weeks' notice before moving out on March 15, 2027. Subtract 6 weeks (42 days) and you get **Monday, February 1, 2027**. That is the last day your notice can arrive. Sending it a few days earlier protects you against postal delays and different interpretations of "six weeks".

## Scenario 5: A project milestone in months and weeks

A project starting on October 7, 2026 has a milestone at "six months and two weeks". Add the months first (April 7, 2027), then the weeks: **Wednesday, April 21, 2027**.

The order matters. Months are added before weeks and days because adding days first could push you across a month boundary and change which day the month arithmetic lands on.

## How to use the Date Calculator

The [Date Calculator](/online-tool/calculators/date-calculator) covers all five scenarios from a single form:

1. Choose a mode in the **Calculation** menu: _Days between two dates_, _Add to a date_ or _Subtract from a date_.
2. For the difference, enter a **Start date** and an **End date**. You get the **Difference** in days, the same span **In years, months, days**, and **In weeks**. If the end date comes before the start, the difference is still shown as a positive number of days.
3. For adding or subtracting, enter the **Start date** and any combination of **Years**, **Months**, **Weeks** and **Days**. The result appears as a long date with the weekday, plus an **ISO date** (YYYY-MM-DD) you can paste into spreadsheets.

Dates are handled as calendar days, so daylight-saving changes never shift a result.

## When you need a different tool

- **Counting both the first and last day**, as with leave requests or event days: use the [Date Difference Calculator](/online-tool/date-time-tools/date-difference-calculator), which can include both ends.
- **Business days only**: weekends and holidays matter for delivery estimates and legal deadlines, so use the [Working Days Calculator](/online-tool/date-time-tools/working-days-calculator).
- **Someone's age**: the Age Calculator adds the next birthday and totals.

## FAQ

### Does the day count include the start date?

No. It counts the days you have to move forward from the start date to reach the end date. Add 1 if you need to count both the first and last day.

### Can I add negative numbers?

Use the _Subtract from a date_ mode instead. The Years, Months, Weeks and Days fields are meant for zero or positive amounts.

### How does it handle leap years?

Automatically. February 29 exists in leap years and is skipped in others, and adding a year to February 29 lands on February 28 in a common year.

Plan your next deadline with the [Date Calculator](/online-tool/calculators/date-calculator).
