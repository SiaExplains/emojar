---
slug: browser-toolbox-for-debugging-an-api-and-shipping-ui
title: A Browser Toolbox for Debugging an API and Shipping UI
description: Inspect JSON and JWTs, test a regex, turn a request into cURL or fetch, check URLs, cron, hashes and UUIDs, then polish shadows and CSS specificity.
tags: [Developer Tools, API, CSS, Debugging]
---

When an API call fails halfway through a feature, you usually need five small tools at once: something to read the JSON, decode the token, check the URL, rebuild the request and confirm a regex or a schedule. Emojar's developer tools cover each of those in a browser tab, and they all run locally, so pasting a staging token or a customer record doesn't send it anywhere. This post follows one bug from the failing response to the finished UI and shows where each tool fits.

## The situation

You're building a checkout page. `POST /v1/orders` worked yesterday and now returns `401`, and when it does work, the response doesn't quite match what the frontend expects. On top of that, a nightly cleanup job seems to run at odd times, and the design review flagged a muddy card shadow and a button style that won't apply. Let's take them in order.

## Step 1: Read the response properly

Paste the raw body into the [JSON viewer and tree explorer](/online-tool/developer-tools/json-viewer). Instead of a wall of text, you get a collapsible tree where every object shows its key count, every array its length and every value its type. Type a key or a value into **Search** and use **Next** and **Prev** to jump between matches. When you find the field you need, select it and copy its path, such as `orders[0].items[1].sku`. Tick **Start paths with $ (JSONPath)** if you want `$.orders[0].items[1].sku` for a Postman test. If the JSON won't parse, the viewer reports the line and column where it stopped, which usually points at a trailing comma or a single-quoted string.

To see what changed since yesterday, paste the old response on the left and the new one on the right of [JSON Diff](/online-tool/developer-tools/json-diff). It compares values, not lines, so reordered keys or different indentation don't show up as noise. Each difference gets a path, and the copied report looks like this:

```text
~ $.order.status: "pending" → "paid"
- $.order.coupon: "FALL10"
+ $.order.discount: 5
```

If an array is really a set, such as a list of tags, tick **Ignore the order of items in arrays** so one inserted item doesn't shift every later position into a "change".

Once the shape is clear, paste a representative sample into [JSON to TypeScript](/online-tool/developer-tools/json-to-typescript) and set the root name. This sample:

```json
{
  "id": 42,
  "email": "ana@example.com",
  "roles": ["admin"],
  "orders": [
    { "sku": "A-1", "qty": 2 },
    { "sku": "B-7", "qty": 1, "note": "gift" }
  ],
  "manager": null
}
```

with the root name `User` produces:

```ts
export interface User {
  id: number;
  email: string;
  roles: string[];
  orders: Order[];
  manager: null;
}

export interface Order {
  sku: string;
  qty: number;
  note?: string;
}
```

The array called `orders` became an `Order` interface, and `note` is optional because only one item had it. `manager: null` is a reminder that types are only as good as the sample, so fix that line by hand to something like `Manager | null`.

## Step 2: Check the token behind the 401

Copy the `Authorization` header and paste it into the [JWT decoder](/online-tool/developer-tools/jwt-decoder). The `Bearer ` prefix is removed for you. Say the payload contains `"iat": 1791817200` and `"exp": 1791820800`. The decoder turns those into readable times, 15:00 and 16:00 UTC on October 12, 2026, which is a one-hour token. A notice tells you whether it has expired and how long ago. If it has, the bug is in the refresh logic, not the endpoint.

While you're there, check `aud` and `iss` against what the server expects. Decoding doesn't verify the signature, which needs the secret or public key on your server. It only shows what the token claims.

## Step 3: Check the URL and rebuild the request

A surprising number of 401s and 404s come from the URL itself. Paste it into the [URL parser](/online-tool/developer-tools/url-parser) to see the protocol, host, port, path, query parameters and fragment in a table. It uses the browser's own URL parser, so the default port 443 for https and percent-decoding behave exactly as they do in your app. Edit, add or remove parameters, and the URL is rebuilt with correct encoding. Spaces in values become `+`, and `&`, `=` and `#` are escaped so they can't break the query.

Next, rebuild the call outside your app in the [HTTP Request Builder](/online-tool/developer-tools/http-request-builder). Choose `POST`, paste the URL, pick the **JSON** body type and add the Bearer token. The cURL tab gives you:

```bash
curl 'https://api.example.com/v1/orders?dry_run=true' \
  -H 'Authorization: Bearer eyJhbGciOi...' \
  -H 'Content-Type: application/json' \
  --data-raw '{"sku":"A-1","qty":2}'
```

There's no `-X POST`, because `--data-raw` already makes cURL send a POST. Other tabs write the same request for fetch, Axios, Python requests, Node.js, HTTPie and PowerShell, each with its own quoting. The builder never sends the request itself. Browsers block most cross-origin calls, and getting around that would need a proxy that sees your token. You run the code in your own terminal instead. The generated code contains your token, so be careful where you paste it.

## Step 4: Validate the input with a regex

The order form rejects some SKUs on the client. Open the [regex tester](/online-tool/developer-tools/regex-tester), enter a pattern like `^[A-Z]-\d+$` with the `g` and `m` flags, and paste a few test values, one per line. Matches are highlighted as you type. The match table lists each match's start and end index and the value of every group. The breakdown explains each part in plain English, such as the anchor, the character class and the quantifier, which helps a lot when the regex came from someone else. Matching runs in a background worker with a timeout, so a pattern with runaway backtracking can't freeze the tab.

## Step 5: Fix the schedule that runs at odd times

The cleanup job is set to `*/15 9-17 * * 1-5`. Paste it into the [cron expression generator](/online-tool/developer-tools/cron-expression-generator) and the explanation reads: "At minute 0, 15, 30 and 45 past hour 9, 10, 11, 12, 13, 14, 15, 16 and 17, on Monday through Friday." That's the bug. The hour field `9-17` includes the whole 17:00 hour, so the job also runs at 17:15, 17:30 and 17:45. Use `9-16` if it should stop at 17:00, and check the next run times (with **Show in UTC** if your server runs on UTC). The tool uses the standard five-field format, so it has no seconds field and no Quartz syntax.

## Step 6: IDs and signatures for test data

For test orders, the [UUID generator](/online-tool/developer-tools/uuid-generator) makes one or thousands of IDs. **UUID v7 (time-ordered)** sorts by creation time, which keeps database indexes happy, while **UUID v4 (random)** reveals nothing about when it was made.

If the payment provider signs webhooks with HMAC-SHA256, the [hash generator](/online-tool/developer-tools/hash-generator) can check a signature by hand. With the secret `whsec_test` in the HMAC key field and the body `{"event":"order.paid","id":42}` as the text, HMAC-SHA256 gives:

```text
dbd8cdd49e723e4bd625c646bd8d159df9334c23ecceeaa18c565ca66093e0f8
```

Paste the signature from the webhook header into **Compare with a known hash** and you get a match or no match. Hash the exact raw body. A single extra space or reordered key gives a completely different result. HMAC works on text input and isn't offered for MD5.

## Step 7: Polish the UI before you ship

The card shadow looks muddy because it's one dark layer. In the [CSS box shadow generator](/online-tool/developer-tools/box-shadow-generator), use two soft layers instead: a tight one for contact and a wide, faint one for depth. The output keeps opacity in `rgba()` and drops zero values:

```css
box-shadow:
  0 1px 2px rgba(0, 0, 0, 0.08),
  0 8px 24px rgba(0, 0, 0, 0.06);
```

Layer 1 is painted on top. You can switch the preview background to check the shadow on dark or gradient surfaces.

The button that won't change color is a specificity problem. Paste the competing selectors into the [CSS specificity calculator](/online-tool/developer-tools/css-specificity-calculator):

- `.btn.btn-primary` scores (0, 2, 0)
- `button.primary` scores (0, 1, 1)
- `#app .card:hover > button` scores (1, 2, 1)

The ID wins over any number of classes, so the third rule beats your new class. Wrapping a library's defaults in `:where()` gives them (0, 0, 0), so they're easy to override. When scores tie, the rule that comes later in the stylesheet wins.

## FAQ

### Is it safe to paste production tokens and data here?

These tools process everything in your browser and don't send it to a server. Still, treat tokens like passwords and don't leave them in shared screens or snippets.

### Can the request builder test my API directly?

No. It writes code for you to run, because browsers block most cross-origin requests and a proxy would see your data.

### Does the JWT decoder tell me if a token is valid?

It shows the claims and whether the token has expired. Signature checks need your key and belong on the server.

### Which cron format does the generator use?

The standard five fields used by crontab, Kubernetes CronJobs and GitHub Actions.

See every formatter, converter and generator in [developer tools](/online-tool/developer-tools).
