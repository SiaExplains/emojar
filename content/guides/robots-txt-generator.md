---
slug: robots-txt-mistakes-that-block-the-wrong-pages
tool: robots-txt-generator
title: 7 Robots.txt Mistakes That Block (or Expose) the Wrong Pages
description: A Googlebot group that silently drops your * rules, prefix matches, case and query strings. Seven robots.txt mistakes and how to test each one.
tags: [SEO, robots.txt, Troubleshooting]
---

Most robots.txt problems come from a handful of matching rules that behave differently from how they read: a crawler-specific group replaces the general one, paths match as prefixes, matching is case-sensitive, and the longest rule wins. The fastest way to catch them is to test real paths against the exact file before you upload it. Below are seven common mistakes, each with the result a tester gives.

## 1. Why does Googlebot ignore my `User-agent: *` rules?

Because a crawler obeys only the most specific group that names it. Take this file:

```text
User-agent: *
Disallow: /admin/

User-agent: Googlebot
Disallow: /search
```

Testing `Googlebot` against `/admin/settings` returns **Allowed**: no rule matches inside the Googlebot group, and the `*` group no longer applies to Google at all. Bingbot, which falls back to `*`, is blocked. The fix is to repeat every shared rule inside each named group.

## 2. Is `Disallow: /admin` the same as `Disallow: /admin/`?

No. Rules are prefixes, so `Disallow: /admin` also blocks `/administrator-guide` and `/admin-tips.html`. Add the trailing slash when you mean the folder only.

## 3. Why is `/Admin/` still crawlable?

Paths are case-sensitive. `Disallow: /admin` blocks `/admin` but not `/Admin`. If your server treats both spellings as the same page, list both, or better, redirect one to the other.

## 4. Why doesn't my `.pdf$` rule block every PDF?

`$` anchors the end of the URL, and the query string is part of what's matched. With `Disallow: /*.pdf$`, the path `/files/guide.pdf` is blocked, but `/files/guide.pdf?v=2` is allowed because it doesn't end in `.pdf`. Drop the `$` (`Disallow: /*.pdf`) if versioned links exist.

## 5. Why does my Allow exception open more than I meant?

Within a group the longest matching rule wins, and Allow wins a tie. With `Allow: /private/open` and `Disallow: /private/`, the page `/private/open` is crawlable as intended, but so is `/private/open-house` because it shares that prefix. `/private/report` stays blocked. Make exceptions as specific as the URLs allow: end them with `$` or with a full file name.

This logic is also why the WordPress pattern works: `Allow: /wp-admin/admin-ajax.php` is longer than `Disallow: /wp-admin/`, so that one script stays reachable while the rest of the admin area is blocked.

## 6. What's the difference between `Disallow:` and `Disallow: /`?

One character, and the opposite meaning. An empty `Disallow:` blocks nothing. `Disallow: /` blocks the whole site. A staging robots.txt with `Disallow: /` that gets copied to production is one of the most common ways sites vanish from search. Check which one you have before every launch.

## 7. Why is a blocked page still in Google?

robots.txt controls crawling, not indexing. A blocked URL can still be indexed from links on other sites, usually shown without a description. Worse, if you add a `noindex` tag to a page and also block it in robots.txt, crawlers never fetch the page, so they never see the tag. To remove a page from results, allow crawling and use `noindex`. To keep it private, use a password.

## How do the matching rules work in the tester?

The test box applies Google's interpretation of the standard, written up as [RFC 9309](https://www.rfc-editor.org/rfc/rfc9309):

- **Group choice:** the crawler name you type is compared with each group's user agents (case doesn't matter), and the longest matching token wins. You can paste a full user-agent string such as `Mozilla/5.0 (compatible; GPTBot/1.2; +https://openai.com/gptbot)` and it still lands in the GPTBot group. With no named match, `*` applies.
- **Rule choice:** `*` matches any characters, `$` anchors the end, the longest matching rule decides, and Allow wins ties.
- **No match:** the path is allowed.

The result line shows the decision, the rule that matched and the group that was used, which makes mistake 1 obvious at a glance.

## How do you build and test a file with the generator?

1. In the [Robots.txt Generator](/online-tool/developer-tools/robots-txt-generator), pick a preset under **Start from**: Allow everything, Block everything, Block AI crawlers, WordPress, or Hide admin & private pages.
2. Edit each **Rule group**. Put crawler names in **User agent(s)**, separated by commas. Write one path per line in **Disallow (one path per line)** and add exceptions in **Allow (exceptions)**. Use **+ Add rule group** for crawler-specific groups.
3. Add your **Sitemap URL(s), one per line**.
4. Under **Test a URL against these rules**, enter a **Crawler (user agent)** and a **Path**. Try one page you want blocked and one you want crawled for every group.
5. Download `robots.txt` and upload it to the root of your domain, for example `https://example.com/robots.txt`. A file in a subfolder is ignored.

The **Block AI crawlers** preset keeps `*` fully allowed and adds a second group that disallows `/` for 14 tokens, including GPTBot, ChatGPT-User, ClaudeBot, Google-Extended, Applebot-Extended, CCBot, PerplexityBot and Bytespider. Googlebot is unaffected. Google-Extended and Applebot-Extended aren't separate crawlers. They are tokens that control whether already-crawled content is used for AI models.

If you're cleaning up after a migration, check which status codes the blocked or moved URLs return with the [HTTP status code lookup](/online-tool/developer-tools/http-status-codes).

## FAQ

### Do comments or blank lines inside a group break it?

Comments starting with `#` are ignored. Keep each group's `User-agent` lines together at the top, though. A new `User-agent` line after rules starts a new group.

### Does every crawler obey robots.txt?

No. Major search engines and the best-known AI crawlers say they honor it, but it's a request, not a lock. Scrapers that don't follow it need blocking at the server or firewall.

### Can I have several sitemap lines?

Yes. Each URL you enter becomes its own `Sitemap:` line at the end of the file, outside any group.

Build your file and test the paths you care about in the [Robots.txt Generator](/online-tool/developer-tools/robots-txt-generator).
