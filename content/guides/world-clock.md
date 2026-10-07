---
slug: time-zone-myths-a-world-clock-will-correct
tool: world-clock
title: 7 Time Zone Myths That a World Clock Quietly Corrects
description: Not every zone is a whole hour, not every country changes its clocks, and the gap between two cities isn't fixed. Common time zone myths, with real examples.
tags: [Time Zones, Remote Work, Myths]
---

A world clock shows the current local time in several cities side by side, each with its UTC offset, so you can see at a glance whether it's a good moment to call someone. It's also the quickest way to catch the assumptions about time zones that cause missed meetings: zones aren't all whole hours apart, many countries never change their clocks, and the gap between two cities can change during the year.

Here are seven common myths, each with a real example you can check on a live clock.

## Myth 1: "Time zones are always whole hours apart"

Several large regions use half-hour or even 45-minute offsets:

| Place                        | Offset (October 2026)                        |
| ---------------------------- | -------------------------------------------- |
| India                        | UTC+05:30                                    |
| Iran                         | UTC+03:30                                    |
| Nepal                        | UTC+05:45                                    |
| Adelaide, Australia          | UTC+10:30 (UTC+09:30 in the southern winter) |
| Newfoundland, Canada         | UTC−02:30 (UTC−03:30 in winter)              |
| Chatham Islands, New Zealand | UTC+13:45                                    |

When it's 12:00 UTC, it's 17:30 in Mumbai and 17:45 in Kathmandu. Mental arithmetic that rounds to whole hours goes wrong here; a world clock that shows each zone's offset doesn't.

## Myth 2: "Everyone changes their clocks for daylight saving"

Most of the world doesn't. India, China, Japan, most of Africa and much of South America keep the same time all year. Even within the US, most of Arizona stays on UTC−07:00 year-round, while neighboring states shift. In the southern hemisphere, places like Sydney and Auckland move their clocks forward in _our_ autumn.

## Myth 3: "The difference between two cities never changes"

Because countries that do observe daylight saving switch on different dates, the gap between them changes for a few weeks each year. In 2026, New York and London are normally 5 hours apart, but only 4 hours apart from 8 to 28 March and from 25 October to 1 November. Sydney and London can be 9, 10 or 11 hours apart depending on the month.

A live world clock always shows the _current_ offset, which is why it's worth glancing at it rather than relying on a number you memorized last year.

## Myth 4: "One country, one time zone"

Some countries span many zones: the contiguous US uses four, Russia eleven, and Australia several, including half-hour ones. Others do the opposite. China spans roughly five zones' worth of longitude but uses a single official time, UTC+08:00. In far-western China, that means the sun can rise around 10:00 a.m. by the clock.

Always pick the specific city, not just the country.

## Myth 5: "London time is the same as GMT"

Only in winter. London uses GMT (UTC+00:00) from late October to late March and British Summer Time (UTC+01:00) the rest of the year. If someone says "3 p.m. GMT" in July, they almost certainly mean London time, which is 3 p.m. BST, or 14:00 UTC. Using city names or explicit UTC offsets removes the guesswork.

## Myth 6: "It's the same day everywhere, give or take"

The total spread of time zones is 26 hours, from UTC−12:00 to UTC+14:00. At 12:00 UTC on Wednesday, 7 October 2026, it's 02:00 on **Thursday** in Kiritimati (UTC+14:00) and 01:00 on **Wednesday** in American Samoa (UTC−11:00): almost the same clock time, but different dates. Teams spanning the Pacific regularly have "my Monday is your Sunday" moments.

## Myth 7: "If it's daytime there, they're probably at work"

The world clock's sun and moon icons are a quick visual cue, showing a sun between 06:00 and 18:59 local time and a moon otherwise. But daytime isn't the same as working hours. Weekends also differ: in several Middle Eastern countries the weekend falls on Friday and Saturday. Check the weekday shown under each city, not just the time.

## How to set up your own world clock

1. Open the [World Clock](/online-tool/date-time-tools/world-clock). Your own time zone appears first, highlighted and labeled **(your time)**.
2. Eight cities are shown by default: Los Angeles, New York, London, Berlin, Dubai, Mumbai/Delhi, Tokyo and Sydney. Each card shows the live time (24-hour, with seconds), the weekday and date, and the current UTC offset.
3. Remove cities you don't need with **✕**.
4. Use **Add a city or time zone** and **+ Add** to include others. The list starts with major cities, followed by every IANA time zone your browser knows.
5. Click **Reset** to return to the default set.

Your selection is saved in this browser only, so it's there next time you visit on the same device; it isn't synced to other devices and isn't sent anywhere.

The clocks run on your device's clock and the time zone rules built into your browser, so daylight saving changes are applied automatically on the right dates. To check a _future_ time across cities, for a meeting next month for example, use the [Time Zone Converter](/online-tool/date-time-tools/timezone-converter), which converts any date and time you choose.

## FAQ

### Can I see the time in a small town that isn't listed?

Pick the IANA zone for its region, usually named after the largest city in the same zone. A town in Bavaria uses `Europe/Berlin`, and one in Ohio uses `America/New_York`.

### Why did my saved cities disappear?

They're stored in your browser's local storage. Clearing site data, using a private window or switching browsers starts you with the default list again.

### Is the world clock accurate to the second?

It's as accurate as your device's clock. Devices that set their time automatically are typically within a fraction of a second.

Want to see your team's local times at a glance? [Open the World Clock](/online-tool/date-time-tools/world-clock).
