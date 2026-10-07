---
slug: how-exact-age-is-calculated-years-months-days
tool: age-calculator
title: How Exact Age Is Calculated in Years, Months and Days
description: 'Why is age counted in calendar months, and what happens to someone born on January 31 or February 29? A clear look at the method behind exact age.'
tags: [Dates, Calculators, Explainer]
---

Exact age is calculated by counting **whole calendar years** from the date of birth, then **whole calendar months**, then the **remaining days**. Someone born on June 15, 1990 is 36 years, 3 months and 22 days old on October 7, 2026: 36 birthdays have passed, then 3 more monthly "anniversaries" (July 15, August 15, September 15), then 22 days from September 15 to October 7.

That sounds simple, but months have different lengths, and some birthdays don't exist every year. Here is how the counting actually works, and where people's manual calculations usually go wrong.

## Why not just divide the number of days by 365?

Because years are not all 365 days long. The same person in the example above has lived **13,263 days**. Divide that by 365 and you get 36.34 years, which is close but does not tell you the months and days, and the decimal drifts further from reality with every leap year. Dividing by 365.25 is better on average, but still gives fractional years rather than a calendar answer like "3 months and 22 days".

Counting in calendar units avoids all of that. The question becomes "how many times has this date come around?" rather than "how many seconds have passed?".

## How the calendar method works, step by step

Take a date of birth of **June 15, 1990** and an "age on" date of **October 7, 2026**.

1. **Years.** The most recent birthday on or before October 7, 2026 is June 15, 2026. That is 36 birthdays, so 36 years.
2. **Months.** From June 15, 2026, step forward a month at a time while you stay on or before the target date: July 15, August 15, September 15. A fourth step (October 15) would overshoot, so that is 3 months.
3. **Days.** Count from September 15 to October 7: 15 days left in September, plus 7 in October = **22 days**.

The result: **36 years, 3 months, 22 days**. The same span is 435 total months, 1,894 weeks and 5 days, or 13,263 days.

## What about people born on the 31st?

Not every month has a 31st, so the monthly step has to land somewhere. The rule used here is to **clamp to the last day of the month**. A baby born on January 31, 2024 is exactly **1 month, 0 days** old on February 29, 2024, because February's last day stands in for the missing 31st.

This matches how most people think about it: nobody would say that baby turns one month old in March.

## What about February 29 birthdays?

The same clamping rule applies to leap-day birthdays. In a non-leap year, the birthday falls on **February 28**. Someone born on February 29, 2000:

- On February 27, 2025, is **24 years, 11 months, 29 days** old, with the next birthday in 1 day.
- On February 28, 2025, is **25 years, 0 months, 0 days** old, and the calculator shows the birthday as today.
- On February 29, 2028, a leap year, is **28 years** old on their real birthday.

Some countries legally treat March 1 as the birthday in common years. If you need a legal answer for a specific jurisdiction, check the local rule.

## How to use the Age Calculator

The [Age Calculator](/online-tool/calculators/age-calculator) does all of the above for you:

1. Enter the **Date of birth**.
2. Leave **Age on** at today's date, or change it to any other date. This is useful for forms that ask for "age at the start of the school year" or "age on the date of the event".
3. Read the result. You get the age in years, months and days, plus **Total months**, **Total weeks**, **Total days**, the **Next birthday** (with the number of days to go and the date), and the weekday you were **Born on**. June 15, 1990, for instance, was a Friday.

Dates are treated as plain calendar dates, so time zones and daylight-saving changes cannot shift the result by a day. The calculation happens in your browser, and the date of birth is not saved or sent anywhere. If the "age on" date is earlier than the date of birth, the calculator shows an error instead of a negative age.

## Practical uses beyond "how old am I"

- **Eligibility cut-offs.** Sports leagues, school entry and insurance often ask for age on a fixed date, not today.
- **Milestones.** Find out when you will hit 10,000 days, or how many weeks old a baby is for a pediatric check-up.
- **Records and genealogy.** Work out someone's age at a past event by setting "age on" to that date.

If you only need the gap between two arbitrary dates rather than an age, the [Date Calculator](/online-tool/calculators/date-calculator) counts days between dates and can add or subtract time.

## FAQ

### Why does my age in months not equal years × 12 plus the months shown?

It does: total months is years × 12 plus the leftover months. In the example, 36 × 12 + 3 = 435. The leftover days are not included in the total months figure.

### Can I calculate the age of something other than a person?

Yes. Enter any start date as the date of birth, such as a company founding date or a wedding anniversary, and you get the elapsed time in the same format.

### Why do two websites sometimes disagree by a day?

Usually because of how they handle month ends and leap days, or because one counts in local time and crosses midnight differently. This calculator uses the end-of-month rule described above and ignores time zones.

Enter a date of birth and see the full breakdown with the [Age Calculator](/online-tool/calculators/age-calculator).
