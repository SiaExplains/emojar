---
slug: how-to-build-utm-links-for-campaigns
tool: utm-builder
title: 'How to Build UTM Links That Keep Campaign Reports Clean'
description: What the five UTM parameters mean, how to name them consistently, and a worked example of tagging links for a newsletter and a social post.
tags: [Marketing, Analytics, How-to]
---

A UTM link is an ordinary URL with a few extra query parameters that tell your analytics tool where a visitor came from. Add `utm_source`, `utm_medium` and `utm_campaign` to every link you share outside your site, keep the values lowercase and consistent, and your reports will show exactly which email, ad or post brought people in. The [UTM Link Builder](/online-tool/developer-tools/utm-builder) assembles and encodes the link for you, so you only have to decide on the values.

## What do the five UTM parameters mean?

UTM stands for Urchin Tracking Module, after the analytics company Google bought in 2005. Most analytics tools still read the same five tags:

- **utm_source** is who sent the visitor: `newsletter`, `google`, `linkedin`, `partner_blog`.
- **utm_medium** is the type of channel: `email`, `cpc`, `social`, `qr`.
- **utm_campaign** is the promotion the link belongs to: `spring_sale`, `webinar_oct`.
- **utm_term** is optional and is mostly used for the paid search keyword.
- **utm_content** is optional and separates two links that share everything else, such as a button and a text link in the same email.

The first three are the ones that matter for attribution. In the builder they are marked with an asterisk, and the link isn't produced until all three have a value (or the URL you pasted already contains them).

## Why naming conventions matter more than the tool

Analytics tools treat UTM values as case-sensitive text. `Email`, `email` and `E-mail` show up as three different mediums, and your channel report splits into fragments that someone has to merge by hand. Spaces cause a similar mess, because they're encoded and end up as `+` or `%20` in reports.

Pick a short set of rules and write them down where the whole team can find them:

1. Lowercase everything.
2. Join words with underscores (or dashes, but not both).
3. Use a fixed list of mediums, such as `email`, `social`, `cpc`, `display`, `qr` and `affiliate`.
4. Name campaigns the same way every time, for example `topic_month` like `spring_sale` or `webinar_oct`.

The builder helps you keep to this. If a value contains capital letters, it warns you that "Spring" and "spring" will be counted separately. If a value contains a space, it tells you the space will be encoded as `+` and suggests dashes or underscores instead.

## A worked example: one sale, two channels

Say you're promoting a sale page, `https://example.com/sale`, in this week's newsletter and in a LinkedIn post.

For the newsletter, enter the page in **Website URL**, then fill in:

| Field            | Value         |
| ---------------- | ------------- |
| Campaign source  | `newsletter`  |
| Campaign medium  | `email`       |
| Campaign name    | `spring_sale` |
| Campaign content | `hero_button` |

The result appears under **Your campaign URL**:

```
https://example.com/sale?utm_source=newsletter&utm_medium=email&utm_campaign=spring_sale&utm_content=hero_button
```

For the LinkedIn post, change the source to `linkedin` and the medium to `social`, clear the content field, and copy the new link. Both links share the campaign name, so in your reports you can see the whole sale at once and then split it by source.

Now suppose the page you're linking to already has parameters, like `https://example.com/sale?size=m#reviews`. The builder keeps `size=m` where it is, adds the UTM tags after it, and leaves `#reviews` at the very end, where browsers expect a fragment. If the URL already carries a UTM tag that you fill in again, the old value is replaced rather than duplicated, and an amber notice tells you which tag changed.

## How to use the UTM Link Builder

1. Paste the destination into **Website URL**. If you leave out `https://`, it's added for you.
2. Fill in source, medium and campaign name. Add term and content only if you need them.
3. Read any warnings about capitals or spaces, then press **Copy URL**.
4. Press **Reset** to clear every field before building the next link.

The link is built in your browser. The tool never visits the page or checks that it exists, so double-check the address before a big send.

## Common mistakes

**Tagging internal links.** Never add UTM tags to links between pages on your own site. Analytics tools treat the tag as a new traffic source, so a visitor who arrived from a Google search suddenly gets credited to your own banner, and the original source is lost.

**Inconsistent values.** `fb`, `facebook` and `Facebook.com` in the same month make a report unreadable. A shared naming sheet fixes this.

**Putting personal data in tags.** Email addresses or names in `utm_content` end up in analytics reports and server logs. Keep values generic.

**Very long links in print.** A tagged URL is too long to type from a poster. Turn it into a code with the [QR Code Generator](/online-tool/security-generators/qr-code-generator) and use `qr` as the medium, so offline scans show up as their own channel.

## FAQ

### How can I check what's inside a long tagged link?

Paste it into the [URL Parser](/online-tool/developer-tools/url-parser) to see every parameter on its own line. If a value looks garbled, the [URL Encoder](/online-tool/developer-tools/url-encoder) shows how special characters are being encoded.

### Will the link preview change when I add UTM tags?

The card itself usually stays the same, because platforms read the page's Open Graph tags. You can mock up how the card might look with the [Social Share Preview](/online-tool/developer-tools/social-share-preview) before you post.

Open the [UTM Link Builder](/online-tool/developer-tools/utm-builder) and tag the next link you send out, before the campaign starts rather than after.
