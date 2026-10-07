---
slug: how-to-remove-utm-parameters-and-edit-query-strings
tool: url-parser
title: How to Remove UTM Tags and Edit a URL's Query String
description: A walkthrough of cleaning a tracked link, decoding a nested redirect URL and adding a parameter safely, with the exact output you should expect.
tags: [URLs, Marketing, Developers, How-to]
---

To remove UTM tags from a link, split the URL into its parts, delete every parameter whose name starts with `utm_` (plus click IDs like `gclid` and `fbclid`), and rebuild the query string so the remaining parameters stay correctly encoded. The page you land on doesn't change, because those parameters only feed analytics. Doing it by hand in a text editor works for short links, but it's easy to leave a stray `&` or break a value that contains its own `?` or `=`.

Below are three real situations: cleaning a link, reading a redirect hidden inside another URL, and adding a parameter with awkward characters.

## What are the parts of a URL, exactly?

Take this link, which is the sample the tool loads when you click **Load sample**:

`https://shop.example.com:8443/search/results?q=red+shoes&size=42&sort=price_asc&utm_source=newsletter&utm_medium=email#reviews`

Parsed with the browser's standard URL parser, it breaks down like this:

| Part | Value |
| --- | --- |
| Protocol | `https:` |
| Host name | `shop.example.com` |
| Port | `8443` |
| Origin | `https://shop.example.com:8443` |
| Path | `/search/results` |
| Query string | `?q=red+shoes&size=42&sort=price_asc&utm_source=newsletter&utm_medium=email` |
| Fragment (hash) | `#reviews` |

The origin (protocol + host + port) is what browsers use for security decisions like CORS. When a URL has no explicit port, the tool shows `443 (default)` for https and `80 (default)` for http. The fragment never reaches the server at all; it's only used by the browser to jump to a section or by a single-page app for routing.

In the query string, each `key=value` pair is separated by `&`, and values are decoded for display, so `q=red+shoes` shows up as `red shoes`.

## Scenario 1: Cleaning a tracked link before you share it

Say a colleague sends you `https://example.com/blog/post?id=7&utm_campaign=fall&gclid=abc123&ref=home`. You want to post it in a team doc without dragging along campaign data.

1. Open the [URL Parser & Query String Builder](/online-tool/developer-tools/url-parser) and paste the full link, including `https://`.
2. Below the parts table you'll see **Query parameters (4)** with one row per pair: `id`, `utm_campaign`, `gclid`, `ref`.
3. Because tracking keys are present, a **Remove tracking (utm\_, gclid, fbclid)** button appears. Click it.
4. The **Built URL** updates to `https://example.com/blog/post?id=7&ref=home`. Click the copy button next to it.

Notice what stayed: `id=7` is what tells the site which post to show, and `ref=home` might matter to the site too. The button only removes keys that start with `utm_` or are exactly `gclid` or `fbclid`. Other tracking-style parameters (for example `mc_eid` or `ref`) are left alone, so delete those manually with the ✕ button on their row if you're sure they aren't needed.

## Scenario 2: Reading a URL hidden inside another URL

Login pages and link shorteners often carry a destination inside a parameter:

`https://login.example.com/signin?next=https%3A%2F%2Fapp.example.com%2Fdash%3Ftab%3D2&lang=en`

That `next` value is percent-encoded so its own `?`, `/` and `=` don't get confused with the outer URL's structure. Paste it into the parser and the `next` row shows the readable value: `https://app.example.com/dash?tab=2`. That's the quickest way to check where a redirect actually sends you before you click it, which is a useful habit with links in emails.

If you edit that value (say, change `tab=2` to `tab=3`), the tool re-encodes it for you. You type plain text; the built URL gets `%3A%2F%2F` and friends automatically.

## Scenario 3: Adding a parameter with awkward characters

Click **+ Add parameter**, type `note` as the key and `fish & chips` as the value. Starting from the cleaned link in scenario 1, the built URL becomes:

`https://example.com/blog/post?id=7&ref=home&note=fish+%26+chips`

The space became `+` and the ampersand became `%26`. If the `&` had been left raw, any server would read `note=fish ` followed by a second, nameless parameter called ` chips`. This is the most common way hand-edited URLs break, and it's why the tool encodes values for you rather than letting you type into the raw query string.

The ↑ and ↓ buttons reorder rows. Order rarely matters to a server, but some cache keys depend on it.

## What changes when the URL is rebuilt?

Rebuilding uses form encoding (`application/x-www-form-urlencoded`), so a few things can look different even if you didn't touch them:

- `%20` in a query value comes back as `+`. Both mean a space in a query string, so `?q=hello%20world` is rebuilt as `?q=hello+world`.
- Repeated keys are kept as separate rows: `tag=a&tag=b` stays two parameters.
- Rows with an empty key are dropped when the URL is built.
- A non-ASCII domain like `münchen.example` is shown in punycode, `xn--mnchen-3ya.example`, which is what browsers send over the wire.

If a URL has been signed (common with cloud storage download links), any change to the query, including re-encoding, can invalidate the signature. Copy those links exactly as they are.

## Pitfalls to watch for

- **Missing scheme.** `example.com/page` isn't a complete URL to a parser; you'll see a message asking you to include `https://`.
- **Parameters after the hash.** Anything after `#` belongs to the fragment, not the query, so `#section?x=1` won't show `x` as a parameter.
- **Credentials in URLs.** A `user:password@` password is masked in the parts table, and parsing runs in your browser, but avoid sharing such links at all.

For encoding a single value outside a full URL, the [URL Encoder](/online-tool/developer-tools/url-encoder) is the more direct tool.

## FAQ

### Will removing parameters break the link?

Removing `utm_` tags, `gclid` and `fbclid` won't change which page loads. Removing functional parameters like `id`, `page` or a session token can, so only delete keys you recognize as tracking.

### Why doesn't the query string table show my parameters?

Check that they come before any `#`. Parameters placed after the fragment are part of the hash and are never sent to the server.

Clean or inspect your next link with the [URL Parser & Query String Builder](/online-tool/developer-tools/url-parser).
