---
slug: cron-expression-mistakes-and-how-to-avoid-them
tool: cron-expression-generator
title: 7 Cron Expression Mistakes That Run Jobs at the Wrong Time
description: 'Day-of-month OR day-of-week, uneven */7 steps, UTC vs local time, six-field formats. The cron mistakes that silently misfire, with next-run examples.'
tags: [Cron, DevOps, Scheduling]
---

Most cron bugs don't fail loudly. The job runs, just at the wrong time. The usual causes: restricting both day fields (cron treats them as OR, not AND), step values that don't divide evenly into an hour, and schedulers that run in UTC while you're thinking in local time. The quickest protection is to read the plain-English description of an expression and check its next few run times _before_ you deploy it.

Cron's standard format has five fields:

```
┌ minute (0–59)
│ ┌ hour (0–23)
│ │ ┌ day of month (1–31)
│ │ │ ┌ month (1–12 or JAN–DEC)
│ │ │ │ ┌ day of week (0–6, Sun–Sat, or SUN–SAT)
* * * * *
```

Each of the mistakes below has an example you can paste into the [Cron Expression Generator](/online-tool/developer-tools/cron-expression-generator) to see the description and next runs for yourself.

## 1. Expecting "the 1st and 15th, if it's a Friday"

```
0 0 1,15 * 5
```

You might read that as "midnight on the 1st and 15th, but only on Fridays." Standard cron reads it as **either**: when _both_ day-of-month and day-of-week are restricted, the job runs when either one matches. The generator describes it as _"At 00:00, on day-of-month 1 and 15 or on Friday."_ Starting from October 7, 2026, the next five runs are Oct 9 (Fri), Oct 15, Oct 16 (Fri), Oct 23 (Fri) and Oct 30 (Fri), far more often than intended.

**Fix:** cron can't express "and" across those two fields. Schedule on one field and check the other inside the job, for example run `0 0 1,15 * *` and exit early unless it's Friday.

## 2. Assuming `*/7` means "every 7 minutes, forever"

```
*/7 * * * *
```

Steps are counted from the start of each field's range, so `*/7` in the minute field means minutes 0, 7, 14, 21, 28, 35, 42, 49 and 56, and then the count **restarts** at the next hour. From 10:50 the next runs are 10:56, **11:00**, 11:07, 11:14. That's a 4-minute gap at every hour boundary.

**Fix:** use a step that divides 60 (1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30). The same goes for hours: `*/5` in the hour field gives 0, 5, 10, 15 and 20, then a 4-hour gap to midnight.

## 3. Forgetting what time zone the scheduler uses

`0 9 * * 1-5` means "09:00 on weekdays" in the **scheduler's** time zone. GitHub Actions schedules always run in UTC. Kubernetes CronJobs use the controller's time zone unless you set `spec.timeZone`. Most cloud schedulers default to UTC. A job that should run at 9 a.m. in New York runs at 5 a.m. local time in summer and 4 a.m. in winter.

**Fix:** in the generator, tick **Show in UTC** under **Next 5 runs** to see the runs the way a UTC scheduler would. Then convert your intended local time to UTC with the [Time Zone Converter](/online-tool/date-time-tools/timezone-converter). Keep daylight saving time in mind: a fixed UTC schedule moves by an hour in local time twice a year.

## 4. Pasting a six-field expression

```
0 0 9 * * *
```

Quartz, Spring and some Node libraries put a **seconds** field first. Standard crontab, Kubernetes and GitHub Actions don't, so a six-field expression shifts every field by one: "hour 9" becomes "day of month 9". The generator only accepts the standard five fields and says so: _A cron expression needs exactly 5 fields._

**Fix:** check which format your platform expects, and drop the seconds field for standard cron.

## 5. Using syntax your cron doesn't support

`L` (last day), `W` (nearest weekday), `#` (nth weekday) and `?` are Quartz extensions, not standard cron. `0 9 * * 1L` is rejected as an _Invalid day of week field_.

**What is portable:** numbers, `*`, ranges (`1-5`), lists (`1,3,5`), steps (`*/15`, `0-30/10`), month and weekday names (`JAN`, `MON-FRI`), `7` as an alias for Sunday, and macros like `@daily`, `@hourly` and `@weekly`, which the generator expands and explains.

## 6. Off-by-one on ranges

Hours run 0–23, so `0 24 * * *` is invalid: _The hour must be between 0 and 23._ Midnight is `0 0 * * *`. Days of the week start at 0 for Sunday, so `1-5` is Monday to Friday, and a weekend is `0,6` or `SAT,SUN`. Months start at 1. Writing names instead of numbers removes most of this guesswork.

## 7. Scheduling everything at minute 0

When dozens of jobs, or thousands of servers sharing one crontab, all run at `0 * * * *`, you get a load spike at the top of every hour. Give each job its own offset, like `17 * * * *`.

## A safe workflow for writing cron schedules

1. Start from a preset (**Every 5 minutes**, **Weekdays at 9:00**, **First day of the month**, **Every quarter** and others), or type into the **Cron expression** field.
2. Adjust individual fields in the **Minute**, **Hour**, **Day of month**, **Month** and **Day of week** boxes. Each one shows its valid range.
3. Read the green description out loud. If it doesn't say what you mean, the expression is wrong.
4. Check **Next 5 runs** in local time and in UTC.
5. Copy the expression and add a comment next to it in your config describing the schedule in words.

Everything is evaluated in your browser.

## FAQ

### What's the difference between `0 0 * * 0` and `@weekly`?

Nothing. `@weekly` expands to `0 0 * * 0`, midnight on Sunday. Not every platform accepts macros, so the five-field form is more portable.

### How do I run a job every 90 minutes?

One expression can't do it, because 90 minutes doesn't fit into a single cron field. Use two entries: `0 0-21/3 * * *` and `30 1-22/3 * * *`.

Check your next schedule's real run times with the [Cron Expression Generator](/online-tool/developer-tools/cron-expression-generator).
