---
slug: how-safe-fake-test-data-works-reserved-emails-and-seeds
tool: fake-data-generator
title: 'Safe Fake Test Data: Reserved Emails, 555 Numbers and Seeds'
description: Why good mock data uses example.com emails, 555-01xx phone numbers and documentation IPs, and how a seed gives you the exact same rows on every run.
tags: [Developer, Testing, Data, Privacy]
---

Safe fake test data looks realistic but is built from values that can never belong to a real person or machine: emails on the reserved example.com, example.org and example.net domains, phone numbers in the 555-0100 to 555-0199 range set aside for fiction, and IP addresses from the blocks reserved for documentation. Add a seed and the same settings produce the same rows every time, which makes tests and demos reproducible.

## Why not just make up random emails?

Because random emails are often real. A string like `john.smith42@gmail.com` almost certainly belongs to someone. If that value sits in a staging database and a background job sends a password-reset or a marketing email, a stranger gets it. Real-looking phone numbers create the same problem with SMS tests, and random IPs can point a health check or webhook at someone else's server.

The fix is to use values that are reserved by standard and can't be registered or routed:

| Field      | Reserved range used                        | Why it's safe                                                                                            |
| ---------- | ------------------------------------------ | -------------------------------------------------------------------------------------------------------- |
| Email      | `@example.com`, `.org`, `.net`             | Reserved for documentation by [RFC 2606](https://www.rfc-editor.org/rfc/rfc2606), never assignable       |
| Phone      | `+1-XXX-555-0100` to `0199`                | North American block reserved for fictional use                                                          |
| IP address | `192.0.2.x`, `198.51.100.x`, `203.0.113.x` | Documentation blocks from [RFC 5737](https://www.rfc-editor.org/rfc/rfc5737), not routed on the internet |
| URL        | `https://example.com/...`                  | Same reserved domains as email                                                                           |

Names, streets, companies and cities are invented combinations, not real records.

## What a generated row looks like

Here are three CSV rows from the default field set (ID, Full name, Email, Phone, City, Country, Date) with the seed `demo-1`:

```
id,fullName,email,phone,city,country,date
1,Zoe Taylor,zoe.taylor89@example.com,+1-332-555-0107,Lakewood,Canada,2026-06-15
2,Alan Garcia,alan.garcia6@example.net,+1-604-555-0185,Kingsport,United States,2026-05-01
3,Laura Rossi,laura.rossi91@example.org,+1-578-555-0123,Oakridge,Canada,2025-10-01
```

A few details make the data behave like the real thing:

- **Fields agree within a row.** The email is built from the same first and last name as Full name, and the city and country are picked as a pair, so Lakewood is always in Canada, never in Australia.
- **Header names are field keys.** Columns are named `fullName`, `firstName`, `zip` and so on, which map neatly onto code and database columns.
- **Types are preserved.** ID, Number and Price are numbers in JSON and unquoted in SQL; Boolean becomes `true`/`false` in JSON and `TRUE`/`FALSE` in SQL. Postal codes stay strings, so `04932` keeps its leading zero.
- **Escaping is handled.** CSV values that contain commas, quotes or line breaks are quoted, and SQL strings have any single quotes doubled, so the output imports cleanly.

The same seed in SQL INSERT format with the table name `users` gives lines like:

```
INSERT INTO users (id, fullName, price, boolean, zip) VALUES (1, 'Zoe Taylor', 740.89, FALSE, '04932');
```

## How does the seed work?

Without a seed, values come from your browser's cryptographic random generator, so every regeneration is different. With a seed, the tool uses a small deterministic generator (mulberry32) started from your seed text. Same seed in, same sequence of random numbers out, and therefore the same rows.

That has one consequence people don't expect: **the seed reproduces the data only if the field list and order stay the same too.** Each field consumes random numbers as it's generated. Add a UUID column to the example above and row 1 still starts as Zoe Taylor, but row 2 becomes a completely different person, because the UUID used up numbers that previously went into row 2. Changing only the output format is safe, though: CSV, JSON and SQL with the same seed and fields contain identical values.

A practical rule: store the seed, the row count and the exact field order next to your test, for example in a comment, and you can regenerate the fixture at any time.

## Step by step

1. Open the [Fake Test Data Generator](/online-tool/security-generators/fake-data-generator).
2. Under "Fields (in this order)", click the field chips you need. They're added in the order you click, so click ID first if you want it as the first column. Click a chip again to remove it.
3. Set "Rows (max 1000)".
4. Pick a "Format": CSV, JSON or SQL INSERT. For SQL, a "Table name" box appears (default `users`); characters other than letters, digits and underscores are replaced with underscores.
5. Optionally type a value into "Seed (optional, same seed = same data)". While a seed is set, the "Regenerate" button is disabled, because regenerating would give the same output anyway.
6. Copy the output or download it as `test-data.csv`, `.json` or `.sql`.

Generation happens in your browser, so nothing about your schema or test plans leaves your machine.

## When fake data isn't the right tool

- **Testing real-world edge cases.** The built-in name list is short, plain ASCII names. If you need to test accented characters, right-to-left text or very long names, add those cases by hand.
- **Load testing at scale.** The limit is 1,000 rows per run. For millions of rows, use a script in your test suite.
- **Format validation of real phone or postal systems.** Postal codes are random five-digit strings and area codes are random numbers from 200 to 999, so they won't pass a strict country-specific validator.

To inspect or reshape the output, pair it with the [JSON Formatter](/online-tool/developer-tools/json-formatter) or turn a CSV into JSON with [CSV to JSON](/online-tool/developer-tools/csv-to-json).

## FAQ

### Will the same seed give the same data on a colleague's computer?

Yes. The seeded generator doesn't depend on the browser or device, so the same seed, rows, fields and order give identical output anywhere.

### Why does my spreadsheet drop the leading zero from postal codes?

The CSV keeps it, but spreadsheet apps often guess that `04932` is a number. Import the column as text, or use JSON or SQL output where the value is explicitly a string.

### Are the UUIDs valid?

They follow the version 4 layout, with the `4` version digit and a correct variant character, so they pass standard UUID format checks.

Generate your next fixture with the [Fake Test Data Generator](/online-tool/security-generators/fake-data-generator).
