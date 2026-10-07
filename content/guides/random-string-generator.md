---
slug: how-to-generate-secure-tokens-and-coupon-codes
tool: random-string-generator
title: How to Generate Secure Tokens, API Keys and Coupon Codes
description: A practical checklist for random strings - picking the right alphabet and length, avoiding confusing characters, and keeping codes unique and unguessable.
tags: [Security, Developers, Checklist]
---

To generate a secure token or code, pick an alphabet that suits where it will be used, then choose a length that gives enough entropy: about 128 bits for secrets like API keys, and far less for short human-typed codes like coupons. Entropy is simply length × log2(alphabet size), so a 32-character hex string has 128 bits and an 8-character code from a 32-symbol alphabet has 40 bits.

Use this checklist whenever you need random strings for keys, invite links, test data or promo codes.

## 1. Decide who will read the string

This one choice drives everything else.

- **Machines only** (API keys, session tokens, webhook secrets): use a large alphabet and a long length. Readability doesn't matter.
- **Humans will type it** (coupon codes, invite codes, Wi-Fi guest passwords): use uppercase letters and digits, remove look-alike characters, and keep it short enough to read off a receipt.
- **It goes in a URL or filename**: avoid symbols such as `/`, `?`, `#`, `&` and `%`, which have special meanings. Letters and digits are always safe.

## 2. Pick the alphabet

The Emojar [Random String Generator](/online-tool/security-generators/random-string-generator) offers these building blocks:

| Option                    | Characters        | Bits per character |
| ------------------------- | ----------------- | ------------------ |
| A–Z                       | 26                | 4.70               |
| a–z                       | 26                | 4.70               |
| 0–9                       | 10                | 3.32               |
| A–Z + a–z + 0–9 (default) | 62                | 5.95               |
| Add Symbols               | 89                | 6.48               |
| Hex only (0–9a–f)         | 16                | 4.00               |
| Custom                    | whatever you type | log2(unique count) |

The **Custom characters** field overrides the checkboxes. Duplicate characters are removed automatically, so typing `AAB` gives a two-character alphabet, not a weighted one.

## 3. Remove characters people confuse

For codes that people read and type, drop `0/O`, `1/I/L` and sometimes `5/S` and `8/B`. A popular safe alphabet is:

```
ABCDEFGHJKLMNPQRSTUVWXYZ23456789
```

That's 32 characters, so each one carries exactly 5 bits. It's also case-insensitive by design, so customers can type it in lowercase if your system uppercases input.

## 4. Choose the length from the entropy you need

Work backward from how the string can be attacked:

| Use                                         | Target           | Example setting                   | Entropy   |
| ------------------------------------------- | ---------------- | --------------------------------- | --------- |
| API key, session token, password-reset link | 128 bits or more | 32 characters, Hex only           | 128 bits  |
| Same, more compact                          | 128 bits or more | 22 characters, A–Z a–z 0–9        | ~131 bits |
| Invite or referral code (rate-limited)      | 40–60 bits       | 10 characters, custom 32-char set | 50 bits   |
| Retail coupon code                          | 35–45 bits       | 8 characters, custom 32-char set  | 40 bits   |

The tool shows the number of possible characters and the approximate entropy of each string under the output, so you can adjust length until it hits your target.

Why do coupons get away with 40 bits? Because your server only accepts a guess if it matches a code you issued, and you can rate-limit guesses. A token that protects an account or API has no such safety net if it leaks into logs or is attacked offline, so give it the full 128.

## 5. Check the collision risk for bulk batches

Each string is generated independently, so two in the same batch _could_ match. The birthday approximation tells you how likely that is: with _n_ codes drawn from _N_ possibilities, the chance of any duplicate is roughly n² ÷ (2N).

Example: 10,000 coupon codes at 40 bits (N ≈ 1.1 trillion) gives about 100,000,000 ÷ 2,200,000,000,000 ≈ 0.005%. Very small, but in a database, still enforce a unique constraint and regenerate on conflict. At 128 bits, a collision is not a practical concern.

## 6. Use a cryptographically secure source

A token's strength depends on its unpredictability, not just its length. Strings built with `Math.random()` can sometimes be predicted from previous outputs. This generator draws every character with `crypto.getRandomValues` and uses rejection sampling to avoid _modulo bias_, so every character in your alphabet is exactly equally likely. Strings are generated locally in your browser and not sent anywhere.

## How to generate a batch

1. Open the Random String Generator.
2. Set **Length** (up to 4,096) and **How many** (up to 1,000). Defaults are 32 characters × 5 strings.
3. Tick the character sets you want, choose **Hex only (0–9a–f)**, or type your own alphabet into **Custom characters**.
4. Click **Generate**, then copy the output or download it as `random-strings.txt`, one string per line, ready to import into a spreadsheet or database.

## What a random string is not

- **Not a password replacement for humans.** For logins, the [Password Generator](/online-tool/security-generators/password-generator) guarantees each character type a site requires.
- **Not a UUID.** If a system expects the standard 8-4-4-4-12 format, use the [UUID Generator](/online-tool/developer-tools/uuid-generator).
- **Not secret once logged.** Treat production API keys like passwords: store them in a secrets manager, never in source control.

## FAQ

### Should I make coupon codes case-sensitive?

Usually not. Case-sensitive codes cause support tickets when customers type lowercase. Use an uppercase-only alphabet and add a character or two of length instead.

### Is hex or Base62 better for tokens?

Neither is more secure at equal entropy. Hex is easier to debug and case-insensitive; Base62 is shorter (22 characters vs 32 for about 128 bits).

### Can I add a prefix like "SAVE-" to codes?

Yes, add it after generating, for example in your spreadsheet. A fixed prefix adds no entropy, so keep the random part at full length.

Need a fresh batch of keys or codes? [Generate random strings now](/online-tool/security-generators/random-string-generator).
