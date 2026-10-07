---
slug: practical-uses-for-md5-sha256-and-hmac-hashes
tool: hash-generator
title: '5 Practical Uses for MD5, SHA-256 and HMAC Hashes'
description: 'Verify downloads, debug webhook signatures, build cache keys, spot duplicates, detect changes. Real uses for hash functions, and which algorithm fits each.'
tags: [Hashing, Security, Checksums]
---

A cryptographic hash turns any input, whether a word or a 1 GB file, into a fixed-length fingerprint. The same input always gives the same hash, and changing a single bit gives a completely different one. That makes hashes useful for everyday developer jobs: proving a download is intact, checking a webhook really came from the sender, naming cache entries, and finding duplicate files. Which algorithm to use depends on whether someone might be _trying_ to fool you.

Here's what the fingerprints look like for the five-letter input `hello`:

```
MD5      5d41402abc4b2a76b9719d911017c592
SHA-1    aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d
SHA-256  2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824
```

Change it to `Hello` and SHA-256 becomes `185f8db32271fe25f561a6fc938b2e264306ec304eda518007d1764826381969`. One capital letter changes the whole hash.

## 1. Verifying a download

Many open-source projects publish a SHA-256 checksum next to each release file. To verify one:

1. Open the [Hash Generator](/online-tool/developer-tools/hash-generator) and switch to the **File** tab.
2. Drop the downloaded file in. It's read locally, and files up to 1 GB are supported.
3. Paste the published checksum into **Compare with a known hash**.

You'll see either _✓ Match — identical SHA-256 hash_ or _✗ No match with any calculated hash_. The comparison ignores case, so uppercase checksums from a `SHA256SUMS` file work as-is. A mismatch means a corrupted or incomplete download, or a file that isn't the one the publisher released. Don't run it.

**Which algorithm:** SHA-256 or SHA-512. The checksum is only as trustworthy as the page you got it from, so get it over HTTPS from the official site, or better, check a signed checksum file.

## 2. Debugging webhook signatures (HMAC)

Stripe, GitHub, Shopify, Slack and most other webhook senders sign each payload with **HMAC-SHA-256**, a hash that mixes in a shared secret. Your server recomputes it and compares. When verification fails and you can't tell why, reproduce it by hand:

1. On the **Text** tab, paste the _exact_ raw request body into **Text to hash**.
2. Enter your webhook secret in **HMAC secret key (optional)**.
3. The results switch to HMAC-SHA-1, HMAC-SHA-256, HMAC-SHA-384 and HMAC-SHA-512.

For example, body `{"event":"paid"}` with key `whsec_test` gives:

```
HMAC-SHA-256  b85236760a6447cd065efe2b7bd10554c3744eff60cc53dfa47a639c5fd1e22c
```

If your hand-computed value matches the sender's header but your code's doesn't, your code is hashing something different. The usual culprit is a **re-serialized body**: the framework parsed the JSON and you're hashing `JSON.stringify(body)` with different spacing or key order. Always verify against the raw bytes. Other things to check: a trailing newline, the wrong encoding of the header value (hex vs Base64), or a timestamp the sender prepends to the payload before signing.

The secret never leaves your browser. Hashing uses the Web Crypto API locally. HMAC isn't offered for MD5.

## 3. Cache keys and content-addressed names

Build tools name files like `app.3f9a1c.js` by hashing their contents, so a new deploy gets a new URL and browsers never serve a stale copy. You can use the same idea for cache keys: hash the inputs that define a result, such as a normalized query string or a request body, and use the hex digest as the key.

**Which algorithm:** anything fast and well-distributed. MD5 or a truncated SHA-256 are both common. Nobody is attacking a cache key, so MD5's weaknesses don't matter here.

## 4. Spotting duplicate files

Two files with the same SHA-256 are, for all practical purposes, identical. Hash a suspicious pair and compare. It's quicker than a byte-by-byte diff and works regardless of filename or timestamps. The same idea powers deduplication in backup tools and Git, which identifies every object by its hash.

## 5. Detecting changes in config or data

Store a hash of a config file, a database export or an API response, and compare it later. A different hash tells you _something_ changed (though not what) without keeping a copy of the original. For finding the actual changes, the [Text Diff](/online-tool/text-tools/text-diff) tool is the next step.

## Which algorithm should you pick?

| Algorithm         | Output           | Use for                                                          | Avoid for                                       |
| ----------------- | ---------------- | ---------------------------------------------------------------- | ----------------------------------------------- |
| MD5               | 128-bit / 32 hex | Legacy checksums, cache keys                                     | Anything an attacker could influence            |
| SHA-1             | 160-bit / 40 hex | Matching legacy systems                                          | New security uses (collisions are demonstrated) |
| SHA-256           | 256-bit / 64 hex | Default choice: downloads, HMAC, signatures                      | —                                               |
| SHA-384 / SHA-512 | 384/512-bit      | Policies that require them; SHA-512 can be faster on 64-bit CPUs | Short identifiers (long output)                 |

## What hashes are not for

- **Storing passwords.** A fast hash like SHA-256 lets attackers try billions of guesses per second. Use Argon2, bcrypt or scrypt, which are deliberately slow and salted.
- **Encrypting data.** You can't "decrypt" a hash. If you need the original back, you need encryption.
- **Hiding short values.** Hashing a phone number or a 6-digit code doesn't protect it, because an attacker can simply hash every possible value and compare.

## FAQ

### Why does my terminal give a different hash for the same text?

Almost always a trailing newline. `echo "hello" | sha256sum` hashes `hello\n`. Use `echo -n` or `printf`. Line endings (`\r\n` vs `\n`) and text encoding cause the rest of the mismatches. The tool hashes text as UTF-8.

### Is the HMAC secret sent anywhere?

No. Both plain hashes and HMACs are computed with your browser's built-in cryptography (plus a small local MD5 implementation, since Web Crypto doesn't include MD5).

### Can I hash a file larger than 1 GB?

Not in the browser tool, since the whole file is loaded into memory. For very large files, use `sha256sum` (Linux), `shasum -a 256` (macOS) or `Get-FileHash` (PowerShell).

Check your next download or signature with the [Hash Generator](/online-tool/developer-tools/hash-generator).
