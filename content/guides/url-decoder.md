---
slug: fix-double-encoded-urls-plus-signs-and-decode-errors
tool: url-decoder
title: 'URL Decoding Problems: %25, Plus Signs and Malformed Input'
description: "Why decoded URLs show %20 twice over, why C++ turns into C, and what 'malformed URI' really means. A troubleshooting guide to percent-decoding."
tags: [URLs, Troubleshooting, Encoding]
---

URL decoding turns each `%XX` sequence back into the byte it stands for, then reads those bytes as UTF-8 text, so `%20` becomes a space and `%C3%A9` becomes `é`. When decoding goes wrong, there are usually three causes: the string was encoded **twice**, a `+` was supposed to be a plus but got decoded as a space (or the other way round), or the input contains a `%` that isn't a valid escape. Each one has a recognizable symptom.

## Symptom 1: You see `%25` or text that's still encoded after decoding

```
caf%25C3%25A9
```

Decode it once and you get `caf%C3%A9`, which still looks encoded. Decode again and you get `café`.

`%25` is the encoding of `%` itself. When it appears in front of two hex digits (`%2520`, `%253A`), something encoded a string that was **already encoded**. It's very common in redirect chains, where each hop encodes the `?next=` URL once more, and in code that calls `encodeURIComponent` on a value that a framework encodes again later.

**Fix:** decode repeatedly until no `%XX` sequences are left. In the tool, copy the output back into the input. Then fix the source: find the second encoding step and remove it. Decoding twice on the receiving side is a workaround, not a fix, because it will mangle a legitimate `%` in user data.

## Symptom 2: Plus signs turn into spaces (or don't)

There are two conventions:

- In **query strings using HTML form encoding** (`application/x-www-form-urlencoded`), `+` means space. `q=red+shoes` is "red shoes".
- **Everywhere else** (paths, fragments, and percent-encoding in general), `+` is a literal plus. A space is always `%20`.

The [URL Decoder](/online-tool/developer-tools/url-decoder) has a **Treat "+" as space** checkbox, on by default because most encoded strings people paste come from query strings. See what it changes:

| Input                       | "+" as space ON       | OFF                   |
| --------------------------- | --------------------- | --------------------- |
| `q=red+shoes%20%26%20socks` | `q=red shoes & socks` | `q=red+shoes & socks` |
| `C%2B%2B`                   | `C++`                 | `C++`                 |
| `C++`                       | `C  ` (two spaces)    | `C++`                 |

The last row is the classic bug. A search for "C++" sent with a raw `+` arrives as "C" plus two spaces. The sender should have encoded the plus as `%2B`. When you're decoding a path or a value you know wasn't form-encoded, turn the option off.

## Symptom 3: "Invalid URL encoding"

The decoder reports `Invalid URL encoding: a "%" is not followed by two hex digits.` in two situations:

**A bare percent sign.** `discount=100%` or `50%off` contains a `%` that isn't followed by two hex digits. The sender should have encoded it as `%25`. To recover, replace the bare `%` with `%25` and decode again.

**A truncated UTF-8 sequence.** `%E2%9C` is the first two of the three bytes for `✓` (`%E2%9C%93`). Each `%XX` is valid on its own, but together they aren't a complete character, so the browser's decoder rejects the whole string. This usually means the URL was cut off: by a log line limit, a length limit on a column, or a copy-paste that missed the end.

## Symptom 4: Decoding a full URL broke it

If you decode an entire URL in one go, the escapes that _protected_ its structure get decoded too:

```
https%3A%2F%2Femojar.com%2Fsearch%3Fq%3Dcaf%C3%A9%20%26%20cr%C3%A8me
```

decodes to

```
https://emojar.com/search?q=café & crème
```

That's fine for reading, but if you paste it into code as a URL, `& crème` now looks like a separate parameter. The decoder uses `decodeURIComponent`, which decodes everything, including `%26` (`&`), `%3D` (`=`) and `%2F` (`/`). To use the URL programmatically, parse it first and decode each parameter value on its own:

```js
const u = new URL(rawUrl);
u.searchParams.get('q'); // already decoded, + treated as space
```

## A quick troubleshooting checklist

1. Paste the string into **Encoded text or URL**. The output appears as you type.
2. Is there still `%XX` in the output? Decode again, and fix the double encoding at its source.
3. Are spaces showing up where plus signs should be? Turn off **Treat "+" as space**.
4. Getting the error message? Look for a bare `%` or a cut-off string.
5. Is the result going back into code? Decode values separately, not the whole URL.

Decoding happens in your browser. That's worth knowing, since URLs often carry session IDs, signed tokens or email addresses in their parameters.

## FAQ

### Why do some decoded characters look garbled, like `cafÃ©`?

The text was encoded from one character set and read as another. `Ã©` is what UTF-8 `é` looks like when read as Latin-1. This decoder always reads UTF-8, which is the web standard. If you see `Ã` sequences in the _output_, the original text was already garbled before it was encoded, and you need to fix that upstream.

### Can I decode only the query string?

Yes. Paste just the part after `?`. The output keeps `&` and `=` visible, so you can read each pair. Just remember that decoded values containing `&` or `=` will look like extra pairs.

### Is URL decoding the same as HTML entity decoding?

No. `%26` is URL encoding, and `&amp;` is an HTML entity. They show up in different places and need different decoders. If you see `&amp;` in a URL, it was copied from HTML source.

Untangle your next URL with the [URL Decoder](/online-tool/developer-tools/url-decoder). If you need to build a URL properly instead, use the [URL Encoder](/online-tool/developer-tools/url-encoder).
