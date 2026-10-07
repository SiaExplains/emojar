---
slug: user-agent-parser-uses-logs-bots-and-bug-reports
tool: user-agent-parser
title: 6 Practical Ways to Use a User Agent Parser on Real Traffic
description: From sorting bots out of server logs to reproducing a bug report on the right device, here are six concrete jobs a user agent parser does well.
tags: [Developers, Logs, Bots, Analytics]
---

A user agent parser turns a long, cryptic string like `Mozilla/5.0 (Linux; Android 14; SM-S918B) ...` into a readable answer: Samsung Internet 26.0, Blink engine, Android 14, mobile phone. Below are six practical jobs it handles, each with a real example string and the result you'll get.

## 1. Triage a bug report that only says "it's broken"

Support tickets often include a user-agent string copied from a diagnostics page, but few people can read one at a glance. Paste it in and you get four fields: **Browser**, **Engine**, **Operating system** and **Device type**.

Example input:

`Mozilla/5.0 (Linux; Android 14; Pixel 8 Build/AP2A; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/130.0.6723.86 Mobile Safari/537.36`

Result: Android WebView 130.0.6723.86, Blink, Android 14, Mobile.

That `; wv)` token is the important part. The user isn't in Chrome at all; they're inside another app's embedded browser (an in-app link from a social or email app, for example). WebViews can lack features such as some login popups and file downloads, so "works in Chrome, broken for this user" suddenly makes sense. Test inside the same app rather than in a regular browser.

## 2. Separate bots from people in a log sample

Pull 50 lines of user agents from an access log and paste them in, one per line. The tool parses up to 50 at a time and flags each bot with its name and kind:

| User agent (shortened) | Flag |
| --- | --- |
| `Mozilla/5.0 (compatible; Googlebot/2.1; ...)` | Googlebot · Search engine |
| `... compatible; GPTBot/1.2; +https://openai.com/gptbot)` | OpenAI crawler · AI crawler |
| `facebookexternalhit/1.1 (...)` | Facebook / Meta · Link preview |
| `Mozilla/5.0 (compatible; AhrefsBot/7.0; ...)` | SEO crawler · SEO tool |
| `curl/8.4.0` | curl · Command-line client |
| `python-requests/2.32.3` | Python HTTP client · Script |

A sample like this tells you fast whether a traffic spike is real visitors, an SEO tool doing a site audit, or someone's scraper. Anything flagged gets a **Device type** of Bot, so bots don't inflate your mobile or desktop counts.

## 3. Spot automation that looks like a real browser

Some automated traffic uses a full browser engine. This string looks like Chrome on Windows at first glance:

`Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/130.0.0.0 Safari/537.36`

The parser still reports Chrome 130.0.0.0 on Windows, but it also flags it as **Headless browser · Automation**, because of the `HeadlessChrome` token. Careful automation tools remove this token, so its absence proves nothing, but its presence is a reliable tell.

## 4. Decide which AI crawlers to allow in robots.txt

If you're deciding whether to block AI crawlers, start by checking which ones actually visit. The parser recognizes the major ones by name, including GPTBot and ChatGPT-User (OpenAI), ClaudeBot (Anthropic), PerplexityBot, CCBot (Common Crawl) and Bytespider (ByteDance). Once you know who's crawling, the [Robots.txt Generator](/online-tool/developer-tools/robots-txt-generator) can write the matching rules.

Remember that robots.txt is a request, not a lock.

## 5. Check whether "Googlebot" is really Google

Anyone can put `Googlebot` in a user-agent header, and scrapers do it on purpose because many sites wave Googlebot through. The tool's bot notice says this directly: verify real search-engine bots with a reverse DNS lookup. The process:

1. Take the IP address from the same log line.
2. Run a reverse DNS lookup on it. Genuine Google crawlers resolve to host names ending in `googlebot.com`, `google.com` or `googleusercontent.com`.
3. Run a forward lookup on that host name and confirm it returns the original IP.

If either step fails, the visitor is pretending. The user-agent string alone can never settle this, because it's just text the client chose to send.

## 6. Export a breakdown to a spreadsheet

After parsing a batch, click **Copy as CSV**. You get one row per string with the columns `user_agent, browser, version, engine, os, os_version, device, bot`, ready to paste into a spreadsheet for a pivot table: share of iOS versus Android, how many visits came from WebViews, or which bots hit you most often.

Two columns behave in ways worth knowing before you build charts on them:

- **Engine** is always WebKit on iPhone and iPad. Apple requires every iOS browser to use WebKit, so Chrome on iPhone (identified by its `CriOS` token) reports Chrome 130.0.6723.90 with the WebKit engine.
- **Device** is inferred from tokens. An Android string without the word "Mobile" counts as a tablet, and an iPad in desktop mode sends a Mac user agent, so it reports as macOS Desktop.

## How do you run it?

1. Open the [User Agent Parser](/online-tool/developer-tools/user-agent-parser). Your own browser's string is already filled in; click **Use mine** to restore it later.
2. Replace it with the strings you want to check, one per line, or click an example such as **Googlebot**, **iPhone Safari** or **curl**.
3. Read the result card for each line, then use **Copy as CSV** if you need the batch elsewhere.

Parsing happens in your browser, so log lines with internal details aren't uploaded anywhere. For a live report on the device you're holding, including Client Hints, the [What Is My Browser](/online-tool/device-tests/what-is-my-browser) tool reads the browser directly instead of a string.

## FAQ

### What if a string isn't recognized as a bot but clearly is one?

The last rule catches generic words like "bot", "crawler" and "spider" and labels the result "Unknown bot". A client that uses a normal browser string with none of those words will look like a regular visitor; that's a limit of the string itself.

### Can I parse more than 50 lines?

Only the first 50 non-empty lines are parsed at once. Split a longer log sample into batches of 50 and combine the CSV exports.

Paste your next log sample into the [User Agent Parser](/online-tool/developer-tools/user-agent-parser).
