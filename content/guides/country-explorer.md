---
slug: iso-country-codes-explained-alpha-2-alpha-3-numeric
tool: country-explorer
title: ISO Country Codes Explained, From Alpha-2 to Numeric
description: What the two-letter, three-letter and numeric country codes in ISO 3166-1 mean, how they relate to currency codes, domains and calling codes, and where they differ.
tags: [Geography, Standards, Reference]
---

Every country and many territories have three codes under the ISO 3166-1 standard: a two-letter alpha-2 code like CH, a three-letter alpha-3 code like CHE, and a three-digit numeric code like 756. All three point to the same place. Alpha-2 is the one software, domains and payment systems use most; alpha-3 is easier to read in tables and statistics; and the numeric code doesn't depend on the Latin alphabet at all.

Those codes then feed into other systems, such as currency codes, internet domains and flag emoji. That's useful to know, because the systems don't always agree.

## What does ISO 3166-1 actually define?

ISO 3166 is maintained by the International Organization for Standardization. Part 1 covers countries and territories, and its maintenance agency assigns and retires codes when borders or names change. Each entry gets:

- **Alpha-2**: two letters, such as DE, JP or BR. This is the code behind most country-code domains, passport machine-readable zones, the Unicode flag emoji and language tags like `en-GB`.
- **Alpha-3**: three letters, such as DEU, JPN or BRA. It's closer to the full name, so it's popular in statistics and data exports.
- **Numeric**: three digits, such as 276, 392 or 076. These match the United Nations M49 area codes and stay stable even when a country's name, and so its letter codes, change.

Codes don't always look like the English name. Germany is DE, from Deutschland. Switzerland is CH, from Confoederatio Helvetica, the Latin name used to avoid picking one of its national languages.

## How do currency codes relate to country codes?

Currency codes come from a different standard, ISO 4217. In most cases the first two letters are the country's alpha-2 code and the third is the currency's initial: JPY is Japan's yen, CHF is the Swiss franc, and GBP is the British pound. Shared currencies break the pattern. EUR doesn't belong to any one country, and 36 entries in the explorer's data use it, from Austria and Finland to territories such as Réunion.

## Where do domains and calling codes differ?

The internet's country-code domains mostly copy alpha-2, with a few historical exceptions. The best known is the United Kingdom: its ISO code is GB, but its domain is `.uk`. The explorer shows both, so the card for the UK lists GB and GBR next to `.uk`.

Calling codes come from a third body. The ITU's E.164 plan assigns them by region, and one code can cover many countries. Canada and the United States share +1 under the North American Numbering Plan, and so do many Caribbean islands, which add a three-digit area code, such as +1 876 for Jamaica. Some places also share a code with a larger neighbor. Guernsey, Jersey and the Isle of Man use +44 followed by a local prefix.

Some codes sit outside the official list. Kosovo appears in the data as XK and XKX, codes that are widely used in practice but not assigned in ISO 3166-1, and it has no numeric code or country domain there. The tool's names and entries follow the GeoNames dataset and don't take a position on disputed borders or sovereignty.

## A worked example: finding every country that uses the Swiss franc

Open the [Country Explorer](/online-tool/reference-tools/country-explorer) and type `CHF` into **Search countries**. Currency codes have to match exactly, and two cards remain: **Liechtenstein** and **Switzerland**. The Switzerland card reads `CH · Bern · CHF · +41`.

Click it, and the details open:

| Field                 | Value                            |
| --------------------- | -------------------------------- |
| ISO alpha-2 / alpha-3 | CH / CHE                         |
| ISO 3166-1 numeric    | 756                              |
| Capital               | Bern                             |
| Continent / region    | Europe / Western Europe          |
| Currency              | Swiss Franc (CHF)                |
| Languages             | German, French, Italian, Romansh |
| Calling code          | +41                              |
| Internet TLD          | .ch                              |
| Drives on the         | right side                       |
| Population (approx.)  | 8,516,543                        |
| Area                  | 41,290 km²                       |
| Coordinates (centre)  | 46.72° N, 7.46° E                |
| Time zone             | Europe/Zurich                    |

Along the top are copy buttons for **ISO alpha-2**, **ISO alpha-3**, **Calling code**, **Currency code**, **Internet TLD** and **Flag emoji**. One click puts the value on your clipboard, which is handy when you're filling in a form field or a config file.

## What can you search for?

The search box accepts several kinds of input at once:

- **Part of a name or capital**, such as "land" or "Paris."
- **An exact ISO code**, either alpha-2 (`DE`) or alpha-3 (`DEU`).
- **A currency code** (`EUR`) or part of a currency name ("dollar").
- **A domain**, with or without the dot (`.jp` or `jp`).
- **A calling code**, with or without the plus sign. The digits must match the whole stored code, so `+1` finds Canada, the United States and the US Minor Outlying Islands, while `+1 876` finds Jamaica.

Five drop-downs narrow the list further: **Continent**, **Region**, **Currency**, **Language** and **Driving side**. Regions follow the UN-style groupings used by Natural Earth, such as "Northern Europe" or "South-Eastern Asia." If nothing matches, you'll see "No country matches these filters," and **Reset filters** clears everything.

A quick experiment: set **Driving side** to **Left** and you get 76 entries, from the United Kingdom and Japan to India, Australia and many Caribbean islands.

## How reliable is the data?

The facts come from GeoNames (CC BY 4.0), with regions and center points from Natural Earth and time zones from the IANA database. A few things to keep in mind:

- **Population figures are estimates** and can lag by several years. Use them for scale, not for official statistics.
- **Some territories have no permanent population**, such as Bouvet Island, so the card says "Uninhabited or unknown."
- **Large countries list many time zones.** The United States has 29 IANA zones in the data and Russia 26, because the database keeps a separate entry wherever local clock history differs. The card shows the first six and counts the rest.

All 250 entries are part of the page, so searching and filtering run in your browser without any lookups.

## FAQ

### Why does the UK use GB in ISO 3166-1?

GB stands for Great Britain. It was the code assigned when the standard was created, and it stuck, even though the country's full name is the United Kingdom of Great Britain and Northern Ireland. The `.uk` domain predates the policy of matching domains to ISO codes.

### Is a country's alpha-3 code ever reused?

ISO avoids reassigning retired codes for a period of years, so old data stays unambiguous. That's one reason long-lived databases also store the numeric code.

### Can I see what time it is in a country?

The card lists its IANA time zones. To see the current local time and day or night, use the [World Time Zone Map](/online-tool/date-time-tools/world-time-zone-map), or the [Time Zone Converter](/online-tool/date-time-tools/timezone-converter) for a specific date. The [Flag Explorer](/online-tool/reference-tools/flag-explorer) shares the same data with a flag grid and a quiz.

Look up any code in seconds with the [Country Explorer](/online-tool/reference-tools/country-explorer).
