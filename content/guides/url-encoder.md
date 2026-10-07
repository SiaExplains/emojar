---
slug: encodeuri-vs-encodeuricomponent-which-to-use
tool: url-encoder
title: 'encodeURI vs encodeURIComponent: Which One Should You Use?'
description: 'One encodes a whole URL, the other a single value. Side-by-side output, a decision table, and the bugs you get when you pick the wrong one.'
tags: [URLs, JavaScript, Encoding]
---

Use `encodeURIComponent` for **a piece** of a URL: a query value, a path segment, a fragment. Use `encodeURI` only for **a complete URL** that's already correctly structured and just contains characters like spaces or accents. The difference is which characters each leaves alone. `encodeURI` keeps `: / ? & = #` intact because they give a URL its structure. `encodeURIComponent` encodes them, because inside a value they would _break_ that structure.

## The same input, both ways

Here's a search URL built by pasting user input straight in:

```
https://shop.example/search?q=red shoes & socks&page=2#top
```

**encodeURIComponent** (the tool's "Encode everything" mode):

```
https%3A%2F%2Fshop.example%2Fsearch%3Fq%3Dred%20shoes%20%26%20socks%26page%3D2%23top
```

Everything that isn't a letter, a digit or one of `- _ . ! ~ * ' ( )` is percent-encoded. The result is no longer a usable URL, but it's a perfectly safe _value_, for example to pass as a `?redirect=` parameter.

**encodeURI** ("Keep URL structure"):

```
https://shop.example/search?q=red%20shoes%20&%20socks&page=2#top
```

The spaces are fixed, but look at the `&` in "red shoes & socks". `encodeURI` left it alone, so the server sees `q=red shoes ` and then a stray parameter called ` socks`. **This is the most common URL-encoding bug**: running `encodeURI` over a URL you assembled from raw user input.

## Which characters does each one leave unencoded?

| Character(s)                    | encodeURIComponent     | encodeURI   |
| ------------------------------- | ---------------------- | ----------- |
| `A–Z a–z 0–9 - _ . ! ~ * ' ( )` | kept                   | kept        |
| `; , / ? : @ & = + $`           | **encoded**            | kept        |
| `#`                             | **encoded**            | kept        |
| Space                           | `%20`                  | `%20`       |
| `é`                             | `%C3%A9` (UTF-8 bytes) | `%C3%A9`    |
| `☕`                            | `%E2%98%95`            | `%E2%98%95` |

Non-ASCII characters are first converted to UTF-8 bytes, and then each byte is written as `%XX`. That's why one accented letter becomes two escapes and an emoji becomes four.

## A decision table

| You are encoding…                                               | Use                           |
| --------------------------------------------------------------- | ----------------------------- |
| A query parameter value (`?q=…`)                                | encodeURIComponent            |
| A query parameter **name**                                      | encodeURIComponent            |
| A single path segment (`/users/{name}`)                         | encodeURIComponent            |
| A URL passed as a parameter (`?next=https://…`)                 | encodeURIComponent            |
| A full URL with stray spaces/Unicode, structure already correct | encodeURI                     |
| A `mailto:` subject or body                                     | encodeURIComponent            |
| Form data for `application/x-www-form-urlencoded`               | `URLSearchParams` (see below) |

The rule of thumb: **encode the parts, then assemble the URL.** Don't assemble first and encode afterwards.

```js
const url = `https://shop.example/search?q=${encodeURIComponent(query)}&page=${page}`;
```

Even better in modern JavaScript, let `URL` and `URLSearchParams` handle it:

```js
const u = new URL('https://shop.example/search');
u.searchParams.set('q', 'red shoes & socks');
u.toString(); // https://shop.example/search?q=red+shoes+%26+socks
```

Notice `+` for spaces there. `URLSearchParams` follows the HTML form encoding rules, while `encodeURIComponent` produces `%20`. Both are decoded correctly by servers in query strings, but only `%20` means a space in a _path_.

## How to use the URL Encoder

1. Open the [URL Encoder](/online-tool/developer-tools/url-encoder) and paste your text into **Text or URL to encode**. **Load sample** gives you a URL with accents, an ampersand and an emoji.
2. Pick a **Mode**: **Encode everything (encodeURIComponent)** for values, or **Keep URL structure (encodeURI)** for whole URLs.
3. Copy the **Encoded output**. It updates as you type.

The tool calls the browser's own `encodeURIComponent` and `encodeURI`, so the output matches what your JavaScript would produce byte for byte. It runs locally, which is useful when the URLs contain tokens or signed parameters.

## Gotchas worth knowing

- **Don't encode twice.** Encoding `%20` again gives `%2520`. If you see `%25` in a URL, something was encoded twice. The [URL Decoder](/online-tool/developer-tools/url-decoder) can help you unwind it.
- **`+` is not a space in a path.** `/files/a+b.txt` really means `a+b`. In a query string, many servers decode `+` as a space, so encode a literal plus as `%2B` (`encodeURIComponent` does this, `encodeURI` doesn't).
- **`encodeURIComponent` leaves `' ( ) * !` alone.** That's a problem in rare contexts, such as some OAuth 1.0 signature schemes, that need strict RFC 3986 encoding. Those characters need extra replacement there.
- **Base64 in URLs.** Standard Base64 contains `+`, `/` and `=`. Either percent-encode it or use Base64URL from the [Base64 Encoder](/online-tool/developer-tools/base64-encoder).

## FAQ

### What about `escape()`?

It's deprecated. It doesn't use UTF-8 for non-ASCII characters (`é` becomes `%E9`, and an emoji becomes `%uD83D%uDE00`), which modern servers won't decode correctly. Use `encodeURIComponent`.

### Should I encode the whole URL before putting it in an `href`?

Only if it contains characters that aren't allowed in URLs, like spaces or raw Unicode. In that case `encodeURI` is the right tool. If you built the URL from encoded parts, it's already valid.

### Why are letters and digits never encoded?

They're "unreserved" characters in RFC 3986, safe in every part of a URL, so encoding them would only make the URL longer without changing its meaning.

Encode your next query value correctly with the [URL Encoder](/online-tool/developer-tools/url-encoder).
