---
slug: schedule-and-check-nightly-database-backups
title: Schedule a Nightly Database Backup and Check That It Restores
description: Write the cron line for a nightly database dump, check the file with SHA-256, run a tidy restore query and keep backup dates in ISO format, all in the browser.
tags: [Developer, Databases, Linux, How-to]
---

A nightly database backup needs four things to be trustworthy: a cron schedule that runs when you think it does, a checksum so you know the file you copied is the file the server wrote, a restore test with a query that proves the data is really there, and dates written one way so the files sort in order. The [Cron Expression Generator](/online-tool/developer-tools/cron-expression-generator), the [SHA-256 Generator](/online-tool/security-generators/sha256-generator), the [SQL Formatter](/online-tool/developer-tools/sql-formatter) and the [Date Format Converter](/online-tool/date-time-tools/date-format-converter) cover one step each. They all run in your browser, so the schedule, the queries and the backup file itself stay on your machine.

The example is a small online shop on a rented Linux server with PostgreSQL. The database is called `shop`, it has `customers`, `orders` and `order_items` tables, and the server clock is set to UTC. You want a dump every night when nobody is buying, a weekly copy to your laptop, and a restore test on the first of each month.

## What cron expression runs a backup every night?

Open the Cron Expression Generator. It has one **Cron expression** field, five smaller boxes for **Minute**, **Hour**, **Day of month**, **Month** and **Day of week**, and preset buttons such as **Every day at midnight** and **Every Sunday at 3:30**.

Many jobs pile up at midnight, which is when `@daily` runs, so pick a quieter time. Put `30` in **Minute** and `2` in **Hour** and leave the rest as `*`. The expression reads `30 2 * * *`, and the green box says "At 02:30." Under it, **Next 5 runs** lists the coming dates. Tick **Show in UTC** to see them in the server's time. Starting from 20 November 2026, the first is Sat, 21 Nov 2026 02:30:00 GMT, then the same time each day after that.

Cron uses the server's clock, while the list without the tick uses yours. If you live in New York and read the unticked list as server time, a job you meant for 2:30 at night ends up running at 9:30 in the evening.

The full crontab line for the dump looks like this:

```
30 2 * * * pg_dump shop | gzip > /backups/shop-$(date +\%F).sql.gz && sha256sum /backups/shop-$(date +\%F).sql.gz > /backups/shop-$(date +\%F).sql.gz.sha256
```

The `%` signs are escaped as `\%` because crontab treats a bare `%` as a newline. `date +%F` prints the date as `2026-11-21`, which comes back later.

## How do you schedule the weekly copy and the monthly test?

The weekly copy to your laptop goes on Sunday, after the dump has finished. Type `0 4 * * 0` and the tool reads it as "At 04:00, on Sunday." The next runs are Sundays 22 November, 29 November, 6 December and so on. In the **Day of week** box, 0 is Sunday and 6 is Saturday, and the tool also accepts `SUN` to `SAT`.

The restore test runs once a month: `0 6 1 * *`, "At 06:00, on day-of-month 1."

If you try to combine the two, you might write `30 2 1 * 0` meaning "the first of the month, if it's a Sunday". In standard cron, when both day fields are set, the job runs when either one matches, and the tool spells it out: "At 02:30, on day-of-month 1 or on Sunday." The next runs are 22 November, 29 November, 1 December (a Tuesday), 6 December and 13 December. If you need "first Sunday", schedule every Sunday and check the date inside the script.

The tool uses the standard five-field format with no seconds field. Shortcuts such as `@daily` work and expand to `0 0 * * *`.

## How do you check the backup file wasn't damaged in transit?

The crontab line already writes a `.sha256` file next to each dump. When the weekly job copies both to your laptop, open the SHA-256 Generator, switch to the **File** tab and drop in the `.sql.gz` file. The file is read locally and hashed with the Web Crypto API, up to 1 GB per file. You get a 64-character hex hash.

Open the matching `.sha256` file in a text editor and copy the first 64 characters (the rest of the line is the file name). Paste them into **Compare with a known hash (optional)**. If the file arrived intact you'll see "✓ Match — identical SHA-256 hash." If a single byte changed on the way, you'll see "✗ No match with any calculated hash." The capitals don't matter, because the tool lowercases what you paste before comparing.

It helps to recognise one hash on sight: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855` is the SHA-256 of zero bytes. If your backup's checksum starts with `e3b0c442`, the dump wrote nothing, and the job has probably been failing quietly.

## What query proves the restore actually worked?

A file that matches its checksum can still hold a broken or half-finished dump. The monthly test restores it into a scratch database, `shop_restore_test`, and counts rows. At the terminal it usually gets typed as one line:

```
select 'customers' as tbl, count(*) from customers union all select 'orders', count(*) from orders union all select 'order_items', count(*) from order_items;
```

Paste it into the SQL Formatter, set **Dialect** to **PostgreSQL**, **Keywords** to **UPPERCASE** and **Indent** to **2 spaces**, then click **Format SQL**. Each `SELECT`, `FROM` and `UNION ALL` lands on its own line, with the column list indented under it. Save that version in your runbook, where anyone can see that three tables are checked.

Add a second query that checks the newest data in the dump:

```
SELECT
  count(*) AS orders,
  max(created_at) AS newest
FROM
  orders
WHERE
  created_at >= current_date - interval '1 day';
```

That's the formatter's output for the same query typed in one line. If `newest` is from yesterday evening, the dump was made from a live database and not from an old copy. Formatting changes only whitespace and keyword case. Table names and string literals stay as you wrote them, and the query is never sent to a server.

## Why write backup dates as YYYY-MM-DD?

File names like `shop-2026-11-21.sql.gz` sort by date in any file list, because ISO 8601 goes from the biggest unit to the smallest. Notes written by people are less tidy. Say a colleague kept a log of past restore tests in a text file:

```
03/11/2026
17/11/2026
2026-11-18
31/11/2026
19.11.2026
```

Paste it into the Date Format Converter with **Input format** on **Detect (asks when ambiguous)** and **Output format** on **ISO 8601 (YYYY-MM-DD)**. Three lines convert: `2026-11-17`, `2026-11-18` and `2026-11-19`. The first line is flagged with a `#`, because `03/11/2026` could be 3 November 2026 or 11 March 2026. The fourth is flagged as not a real date, "November has 30 days", which points to a typo.

Your colleague is in London, so choose **DD/MM/YYYY (UK, Europe, most of the world)** as the input format and `03/11/2026` becomes `2026-11-03`. With a fixed format, lines written another way are flagged as not matching it, so fix the stray `2026-11-18` and `19.11.2026` by hand. The converter works with calendar dates only, so a date never slips to the day before because of your time zone.

## FAQ

### Does the cron tool use my time zone or the server's?

The **Next 5 runs** list uses your browser's time zone unless you tick **Show in UTC**. Cron itself always uses the server's clock, so tick the box if your server runs on UTC.

### Can I hash a backup bigger than 1 GB?

Not in the SHA-256 Generator, which stops at 1 GB per file because the whole file has to fit in the browser's memory. For bigger dumps, run `sha256sum` on both machines and paste one result into the compare field to check the other.

### Which SQL dialects does the formatter support?

Standard SQL, PostgreSQL, MySQL, MariaDB, SQLite, SQL Server (T-SQL), Oracle PL/SQL, BigQuery, Snowflake and Redshift. If a query won't format, switch to the dialect it was written for.

### Why does the date converter refuse to guess 03/11/2026?

Both the day and the month are 12 or less, so the date reads differently in the UK and the US. The tool shows both readings and lets you pick the format, and every line is then read the same way.

More helpers for scripts and servers are in [Developer Tools](/online-tool/developer-tools), with hashing in [Security & Generators](/online-tool/security-generators) and date tools in [Date & Time Tools](/online-tool/date-time-tools).
