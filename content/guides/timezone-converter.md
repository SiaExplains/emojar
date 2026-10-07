---
slug: how-to-schedule-a-meeting-across-time-zones
tool: timezone-converter
title: How to Schedule a Meeting Across Time Zones Without Mistakes
description: A worked example of planning a call between London, New York, California and India, including the daylight saving weeks that quietly shift everyone's time.
tags: [Time Zones, Remote Work, How-to]
---

To schedule a meeting across time zones, pick the time in one "anchor" city, convert it into every participant's zone for the actual date of the meeting, and check that nobody lands outside working hours or on a different day. The date matters because daylight saving time starts and ends on different dates around the world, so the gap between two cities can change by an hour for a few weeks each year.

Here's a complete worked example with a four-city team, including the trap that catches recurring meetings every spring and autumn.

## The scenario: one call, four cities

A product team has people in **London**, **New York**, **Los Angeles** and **Bengaluru**, India. They want a weekly 30-minute call, and the organizer in London suggests Wednesdays at 16:00 her time.

Here's what that looks like on **Wednesday, 14 October 2026**:

| City              | Local time | UTC offset |
| ----------------- | ---------- | ---------- |
| London            | 16:00      | UTC+01:00  |
| New York          | 11:00      | UTC−04:00  |
| Los Angeles       | 08:00      | UTC−07:00  |
| Bengaluru (India) | 20:30      | UTC+05:30  |

Workable, if slightly early for California and late for India. Notice India's half-hour offset; it's easy to get wrong by mental arithmetic, and it's not the only one (Nepal is UTC+05:45).

## Step by step with the converter

1. Open the [Time Zone Converter](/online-tool/date-time-tools/timezone-converter).
2. Under **Date and time**, enter **2026-10-14 16:00**.
3. Set **In time zone** to **London (Europe/London)**. By default it's your own zone.
4. The list already includes UTC, New York, London and Tokyo. Remove any you don't need with **✕**.
5. Use **Add a time zone** to add **Los Angeles** and **Mumbai / Delhi (Asia/Kolkata)**, which covers all of India, then click **+ Add**.
6. Read each row: the local time, the date, the IANA zone name and the current UTC offset. If a city falls on a different calendar day, it's flagged with **+1 day** or **−1 day**.

Conversions use the time zone database built into your browser, which includes each region's daylight saving rules, so the result is correct for the specific date you entered, not just "today."

## The trap: the weeks when daylight saving doesn't line up

The US and Europe both use daylight saving time, but they switch on different dates. In 2026:

- **US:** clocks go forward on 8 March and back on 1 November.
- **UK and EU:** clocks go forward on 29 March and back on 25 October.

So for about three weeks in March and one week in late October, the London–New York gap is **4 hours** instead of the usual 5.

Now enter **Wednesday, 28 October 2026** in the converter, still at 16:00 London time. London has returned to UTC+00:00, but the US hasn't:

| City        | 14 October | 28 October |
| ----------- | ---------- | ---------- |
| London      | 16:00      | 16:00      |
| New York    | 11:00      | **12:00**  |
| Los Angeles | 08:00      | **09:00**  |
| Bengaluru   | 20:30      | **21:30**  |

Everyone outside London gets a meeting an hour later than usual, which matters if Bengaluru's 21:30 is past someone's limit. Then on 1 November the US switches too, and New York and Los Angeles return to 11:00 and 08:00. India doesn't observe daylight saving at all, so it stays an hour later all winter.

The fix: **check the converter for a date in each "mismatch" window** before committing to a recurring slot, and tell attendees in advance.

## Tips for fair cross-zone scheduling

- **Anchor recurring meetings in UTC or in the zone of the majority.** Calendar apps keep the anchor fixed and move everyone else, so choose deliberately.
- **Use 24-hour times in invitations** ("16:00 London / 11:00 New York") to avoid a.m./p.m. errors.
- **Name the city, not the abbreviation.** "CST" means Central Standard Time in the US and China Standard Time in China; "IST" can mean India, Ireland or Israel. The converter uses IANA names like `America/Chicago` for that reason.
- **Rotate inconvenient slots.** If one region always gets the 7 a.m. or 9 p.m. call, alternate weeks.
- **Watch the date line.** A Thursday morning in Sydney is still Wednesday afternoon in California. The **+1 day** flag catches this.
- **Mind the southern hemisphere.** Sydney and Auckland switch clocks in the opposite season, so their gap to Europe can change by two hours over the year.

To keep an always-on view of your team's local times, the [World Clock](/online-tool/date-time-tools/world-clock) shows the live time in each city with a day/night indicator.

## FAQ

### What is the easiest overlap for the US West Coast and India?

There's rarely a comfortable one: early morning in California is evening or night in India. A common compromise is about 08:00–09:00 Pacific, which is 20:30–22:30 in India depending on the time of year.

### Should I send invitations in UTC?

UTC is unambiguous for technical teams, but most people think in local time. Send the calendar invitation (which converts automatically) and include the two or three main local times in the text.

### Why does the offset show UTC+01:00 for London instead of GMT?

London uses GMT (UTC+00:00) in winter and British Summer Time (UTC+01:00) in summer. The converter shows the actual offset in effect on your chosen date.

Planning your next cross-border call? [Compare times in the Time Zone Converter](/online-tool/date-time-tools/timezone-converter).
