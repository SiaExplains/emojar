---
slug: reading-a-live-day-and-night-time-zone-map
tool: world-time-zone-map
title: Why Is It Night There? How to Read a Live Day and Night Map
description: How the shaded night side of a world map is calculated from the sun's position, what the 15° stripes mean, and how to compare UTC offsets and daylight saving.
tags: [Time Zones, Maps, Astronomy, Explainer]
---

A live day and night map shades the half of the Earth facing away from the sun right now. The edge of that shadow is called the terminator, and its shape comes from two facts: where the sun is directly overhead, and how far north or south of the equator that point sits in the current season. Clock time is a separate layer on top. A city's time zone decides what its clocks say, but only the sun decides whether it's actually dark there.

## Where is the sun overhead right now?

At every moment there is one spot on Earth where the sun is straight overhead, called the subsolar point. The [World Time Zone Map](/online-tool/date-time-tools/world-time-zone-map) marks it with a small ☀ symbol and calculates it from the current minute using standard formulas for the sun's position.

Two numbers define that point:

- **Latitude** follows the seasons. It swings between about 23.4° north at the June solstice and 23.4° south at the December solstice, and crosses the equator at the March and September equinoxes. This angle is the sun's declination.
- **Longitude** follows the clock. The Earth turns 15° every hour, so the sun moves west across the map at that speed. At 12:00 UTC it sits near the Greenwich meridian, but not exactly on it.

That "not exactly" is the equation of time. Because the Earth's orbit is an ellipse and its axis is tilted, solar noon drifts up to about 16 minutes earlier or later than clock noon over the year. The map's calculation includes it.

## Why does the night shadow change shape?

If the sun sat exactly over the equator, the terminator would be two straight north-south lines and every place would get 12 hours of daylight. Once the sun moves north or south, the boundary bends into a wave. In June the shadow pulls away from the North Pole, so the Arctic stays lit all day. In December the same thing happens in the far south.

The tool draws this boundary with a geometric formula and moves it once a minute. It marks the line where the center of the sun meets the horizon. Twilight isn't drawn, so the sky near the edge of the shadow is still fairly bright in real life.

## What do the vertical stripes mean?

The background has alternating stripes, each 15° of longitude wide and centred on a multiple of 15°, so the "UTC" band runs from 7.5°W to 7.5°E. Labels from −11 to +11 run along the bottom edge, and the half-width bands at the far left and right edges are UTC−12 and UTC+12. They show the textbook idea of time zones: 360° divided by 24 hours gives 15° per hour.

Real zones don't follow those stripes. Governments pick offsets that suit their borders, trade partners and daylight habits. Spain, for example, sits mostly west of Greenwich but uses Central European Time, so its clocks run well ahead of the sun. The stripes are a reference grid, not a map of legal zones. The caption under the map makes the same point.

## A worked example: one moment, six places

Say your device is set to Berlin and you look at the map at **12:00 UTC on Thursday, 8 October 2026**. London, New York City and Tokyo are already in the table by default. You type "Kathmandu" and "Sydney" into **Add a city or time zone** and click each result. The table then reads:

| Location                  | Local time | UTC       | Daylight saving      | vs. you |
| ------------------------- | ---------- | --------- | -------------------- | ------- |
| Your time (Europe/Berlin) | 14:00:00   | UTC+02:00 | Active (summer time) | —       |
| London GB                 | 13:00:00   | UTC+01:00 | Active (summer time) | −1 h    |
| New York City US          | 08:00:00   | UTC−04:00 | Active (summer time) | −6 h    |
| Tokyo JP                  | 21:00:00   | UTC+09:00 | Not observed         | +7 h    |
| Kathmandu NP              | 17:45:00   | UTC+05:45 | Not observed         | +3.75 h |
| Sydney AU                 | 23:00:00   | UTC+11:00 | Active (summer time) | +9 h    |

Every row shows the date "Thu, 8 Oct 2026". On the map, the ☀ sits at about 6° south and 3° west, over the Atlantic just south of the Gulf of Guinea. The sun is south of the equator because the September equinox has passed. With the equation of time at roughly +12 minutes that day, solar noon at Greenwich came at about 11:48 UTC.

Notice Sydney. It's spring in the southern hemisphere, and New South Wales moved its clocks forward on Sunday, 4 October. So it says "Active (summer time)" in October, while Berlin will switch back in late October.

## How does the table decide daylight saving status?

For each zone, the tool compares the UTC offset on 1 January and 1 July of the current year:

- If the two offsets match, the zone doesn't change its clocks, and the column says **Not observed**. Tokyo, Kathmandu and Mumbai are examples.
- If they differ and the current offset equals the larger one, the column says **Active (summer time)**.
- If they differ and the zone is on the smaller offset, it says **Not active**.

The offsets themselves come from the IANA time zone database built into your browser, the same data your operating system uses. Nothing is fetched from a server.

## Why does the sun icon in the table disagree with the map?

Each row starts with a ☀️ or 🌙 icon. That icon only looks at the local clock: a sun from 06:00 to 17:59, a moon otherwise. It's a quick hint, not an astronomy result. The map shading is the real calculation. In Reykjavik in December, the table can show a sun at 10:00 while the map still has the city in darkness, because sunrise there comes after 11:00 in midwinter.

## Getting more out of the map

- **Blue dots** mark 60 capital cities. Hover to see the city and its local time, and click to add it to the table.
- **Added places** get a darker dot with a label showing their time. The last one you added or clicked in the table turns red.
- **Search** matches about 500 city names, IANA zone names such as `Asia/Kolkata`, and two-letter country codes. A zone you add by name has no coordinates, so it appears in the table but not on the map.
- **Copy comparison** puts each row's name, time and offset on the clipboard as tab-separated text, ready to paste into a spreadsheet or chat.
- **Reset cities** returns to London, New York City and Tokyo. Your list is saved in this browser only.

If you need a future time rather than "now," use the [Time Zone Converter](/online-tool/date-time-tools/timezone-converter). For a plain list of clocks without the map, the [World Clock](/online-tool/date-time-tools/world-clock) is lighter. To look up a country's full list of IANA zones, try the [Country Explorer](/online-tool/reference-tools/country-explorer).

## FAQ

### Is the night shading exact?

It's accurate to within a fraction of a degree, which is far finer than the map's resolution. It doesn't show twilight, so places just past the edge may still be fairly bright.

### Why does "vs. you" show decimals like +3.75 h?

The difference is shown in hours. Kathmandu is 3 hours 45 minutes ahead of Berlin in summer, which is 3.75 hours.

### Does the map work offline?

Once the page has loaded, yes. The sun's position, the land outline, the city list and the offsets are all calculated in your browser.

See who's in daylight right now on the [World Time Zone Map](/online-tool/date-time-tools/world-time-zone-map).
