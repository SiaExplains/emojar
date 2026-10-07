---
slug: which-http-status-code-should-you-return
tool: http-status-codes
title: Which HTTP Status Code Should You Return? A Decision Guide
description: 301 or 308? 404 or 410? 401, 403 or 422? A practical guide to picking the right HTTP status code for redirects, errors, logins and maintenance.
tags: [HTTP, APIs, SEO]
---

Pick the status code by answering one question first: who has to act next? If the client should go somewhere else, use a 3xx. If the request itself was wrong or not allowed, use a 4xx. If your server failed, use a 5xx. Inside each class, a few distinctions (permanent or temporary, gone or missing, unknown user or forbidden user) decide the exact number. The sections below walk through the choices developers argue about most.

## Which redirect should you use: 301, 302, 303, 307 or 308?

Two questions settle it: is the move permanent, and must the HTTP method survive the redirect?

| Code | Permanent? | Keeps POST as POST? | Typical use |
| --- | --- | --- | --- |
| 301 Moved Permanently | Yes | Not guaranteed | Page moved, domain change, HTTP to HTTPS |
| 308 Permanent Redirect | Yes | Yes | Permanently moved API endpoints |
| 302 Found | No | Not guaranteed | Short campaigns, A/B tests |
| 307 Temporary Redirect | No | Yes | Temporarily rerouted API calls |
| 303 See Other | No | Always becomes GET | After a form POST, send the user to a result page |

For search engines, 301 and 308 both pass ranking signals to the new URL, and 302 and 307 are treated as temporary, so the old URL usually stays indexed. The classic SEO mistake is a 302 for a permanent site move. For ordinary page moves, 301 is still the most widely understood choice.

303 is the one people forget. After a checkout or contact form posts successfully, answer with `303 See Other` pointing at a confirmation page. A browser refresh then reloads the confirmation instead of resubmitting the form.

## Is the page missing or gone: 404 or 410?

Both remove the URL from search results over time. `410 Gone` says the removal was deliberate and permanent, and it's dropped slightly faster. Use 410 for discontinued products or content you have taken down on purpose. Use 404 when you simply have nothing at that address.

Whatever you choose, don't answer a missing page with a `200 OK` "Sorry, not found" page. A 200 tells crawlers the page is real content, which wastes crawl budget and leaves junk URLs in the index.

## Unknown user or forbidden user: 401 or 403?

- **401 Unauthorized** means "I don't know who you are." Authentication is missing or failed, and the response should include a `WWW-Authenticate` header. The name is misleading: it really means unauthenticated.
- **403 Forbidden** means "I know who you are, and the answer is still no."

A useful rule: if logging in might fix it, return 401. If it wouldn't, return 403. Some APIs return 404 instead of 403 so they don't reveal that a private resource exists. That's a legitimate choice, as long as it's consistent.

For SEO, neither is indexed. A burst of 403s on public pages often means a firewall or bot filter is blocking crawlers by mistake.

## Bad input: 400, 409, 415 or 422?

| The problem | Code |
| --- | --- |
| The request can't be parsed (broken JSON, malformed syntax) | 400 Bad Request |
| Wrong `Content-Type`, e.g. form data sent to a JSON API | 415 Unsupported Media Type |
| Parses fine, but the values fail validation (email missing, date in the past) | 422 Unprocessable Content |
| Valid, but clashes with current state (duplicate username, edit conflict) | 409 Conflict |
| An `If-Match` check failed (optimistic locking) | 412 Precondition Failed |

Precise codes let clients branch without parsing error messages.

## Your fault or theirs: 500, 502, 503, 504 or 429?

- **500 Internal Server Error:** your application threw an unhandled exception or is misconfigured.
- **502 Bad Gateway:** a proxy or load balancer got an invalid response from your app, often because the app crashed or isn't running.
- **504 Gateway Timeout:** the proxy waited and the upstream never answered.
- **503 Service Unavailable:** you're overloaded or in maintenance on purpose. Add a `Retry-After` header.
- **429 Too Many Requests:** the client exceeded a rate limit. `Retry-After` works here too.

503 is the right answer for planned maintenance. Crawlers come back later instead of dropping pages, but only for a short window. Days of 503s start to look like a dead site. Persistent 500s and 502s eventually push pages out of the index, and persistent 429s make crawlers slow down.

## How do you look a code up quickly?

The [HTTP status code lookup](/online-tool/developer-tools/http-status-codes) lists 62 codes from 100 to 511. Each one shows its name, a plain-English meaning, the defining RFC and, for the codes that matter to search engines, an **SEO** note.

1. Type into **Search by code or name**. Numbers match from the start, so `40` lists 400 to 409. Words match names and descriptions: `timeout` finds 408 and 504, and `rate limit` finds 429.
2. Use the class buttons to narrow the list: **All**, **1xx Informational**, **2xx Success**, **3xx Redirection**, **4xx Client error** or **5xx Server error**.
3. Read the meaning, then the SEO line if there is one.

Searching `redirect` returns only 307 and 308, because those are the only entries with "Redirect" in their names. To compare every redirect side by side, click **3xx Redirection** instead.

Most of the definitions come from [RFC 9110](https://www.rfc-editor.org/rfc/rfc9110), which consolidated the HTTP semantics specs in 2022.

When you're blocking or moving URLs, it also helps to check your crawl rules with the [Robots.txt Generator](/online-tool/developer-tools/robots-txt-generator).

## FAQ

### Should an API return 200 with an error field in the body?

It works, but it hides failures from monitoring, caches, retries and client libraries that branch on the status. Return the matching 4xx or 5xx and put the details in the body.

### Is 204 better than 200 for a successful DELETE?

Use 204 No Content when there's nothing useful to send back. Return 200 with a body if the client needs the deleted record or a summary.

Look up any code you're unsure about in the [HTTP status code lookup](/online-tool/developer-tools/http-status-codes).
