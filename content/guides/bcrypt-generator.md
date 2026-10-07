---
slug: how-to-choose-a-bcrypt-cost-factor
tool: bcrypt-generator
title: How to Choose a bcrypt Cost Factor (and Read a bcrypt Hash)
description: Cost 10, 12 or 14? How the bcrypt work factor trades login speed for cracking resistance, how to measure it, and what each part of a $2b$ hash means.
tags: [Security, Passwords, Developer Tools]
---

Pick the highest bcrypt cost factor that keeps one hash at roughly 100–300 milliseconds on the server that will actually do the hashing; for most web apps today that lands between 10 and 12. Each step up doubles the work, so cost 12 is four times slower than cost 10 for you and for anyone trying to crack a leaked database. Measure on your production hardware rather than guessing, and plan to raise the number as servers get faster.

## What does the bcrypt cost factor control?

bcrypt runs an expensive key setup 2^cost times. The cost is stored inside the hash itself, so the number you choose is effectively a dial for "how many guesses per second can an attacker make".

| Cost | Iterations (2^cost) | Relative time |
| --- | --- | --- |
| 4 | 16 | 1/64 of cost 10 |
| 8 | 256 | 1/4 of cost 10 |
| 10 | 1,024 | baseline |
| 12 | 4,096 | 4x |
| 14 | 16,384 | 16x |
| 15 | 32,768 | 32x |

To make this concrete: in one test run of bcryptjs (the pure-JavaScript library the generator uses) on a laptop, cost 10 took about 80 ms and cost 12 about 310 ms. Native bcrypt libraries on a server are usually quicker than JavaScript in a browser tab, and phones are usually slower, which is exactly why you should measure where the hashing really happens.

The trade-off is simple. Your users wait once per login. An attacker with a stolen table pays the same cost for every single guess against every single account, so a few hundred milliseconds turns into years of compute for strong passwords. That is why fast hashes like SHA-256, built to run millions of times per second, are the wrong tool for stored passwords.

## How do you read a bcrypt hash?

Every bcrypt hash is 60 characters and carries everything needed to verify it. Here is a real one generated for the password `correct horse battery staple` at cost 10:

`$2b$10$m31p85sfb/zSQSNNiBlpruQXWcAFQk/LQDAerv1q6xv6NYvTKwDJi`

| Part | Value | Meaning |
| --- | --- | --- |
| Version | `$2b$` | The current bcrypt variant (`$2a$` and `$2y$` are older labels you will still meet) |
| Cost | `10` | 2^10 = 1,024 rounds |
| Salt | `m31p85sfb/zSQSNNiBlpru` | 22 characters of random salt |
| Hash | `QXWcAFQk/LQDAerv1q6xv6NYvTKwDJi` | 31-character result |

Because a fresh random salt is created every time, hashing the same password twice gives two different strings, and both verify correctly. Verification reads the version, cost and salt from the stored hash, recomputes, and compares.

## How do you test cost factors with the generator?

Open the [bcrypt hash generator](/online-tool/developer-tools/bcrypt-generator) and:

1. Type a sample password in **Password or text**. Use a throwaway value, not a real password you use anywhere.
2. Move the **Cost factor (rounds)** slider, which goes from 4 to 15 and shows the number of rounds, for example "12 (2^12 = 4,096)".
3. Click **Generate hash**. The result appears with the time it took, such as "took 312 ms", plus a breakdown of version, cost, salt and hash.
4. In **Check a password against a hash**, enter a password and a hash, then click **Verify**. You get either a match or a no-match message. The hash you just generated is filled in for you.

Hashing runs in a background worker, so even cost 15 does not freeze the page, and nothing is sent anywhere. The timing you see reflects your browser, though, so use it to understand the doubling, then repeat the measurement with your server's own bcrypt library before settling on a number.

## A checklist for choosing and changing the cost

- **Benchmark on production-like hardware.** Hash a few hundred passwords at costs 10, 11 and 12 and pick the highest that stays in your latency budget at peak login traffic.
- **Remember concurrency.** If 50 people log in at the same moment, 50 hashes compete for CPU. A cost that feels fine in a single test can queue up under load.
- **Do not go below 10 for new systems.** Lower costs exist for tests and seed data; cost 4 is handy in unit tests so they run fast.
- **Raise it over time without forcing resets.** Because each hash stores its own cost, you can check the cost of a stored hash after a successful login and, if it is below your current setting, rehash the password the user just typed and save the new hash.
- **Mind the 72-byte limit.** bcrypt only uses the first 72 bytes of input; anything after that is ignored. The generator warns when input is longer. Non-Latin characters and emoji take 2–4 bytes each, so the limit arrives sooner than the character count suggests.
- **Limit login attempts anyway.** A slow hash protects a leaked database; rate limiting protects the live login form.
- **Consider Argon2id for new projects.** The [OWASP Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html) lists Argon2id first and bcrypt as a solid option for existing systems.

A strong cost factor cannot rescue a weak password, either. Pair it with long, random credentials from a tool like the [password generator](/online-tool/security-generators/password-generator).

## FAQ

### Can I decrypt a bcrypt hash to get the password back?

No. bcrypt is a one-way function, not encryption. The only way to "reverse" it is to guess passwords and hash each guess, which is exactly what the cost factor makes slow.

### Is it safe to generate production hashes in a browser?

For seeding an admin account or a test fixture, a browser-generated hash works the same as one made on a server. For real user sign-ups, hash on your server so passwords never pass through anything else.

### Do $2a$, $2b$ and $2y$ hashes work with each other?

For typical ASCII passwords they compute the same result, and most modern libraries, including the one behind this tool, verify all three prefixes. The letters mark fixes to old implementation bugs rather than different algorithms.

Ready to see the doubling for yourself? Try a few cost values in the [bcrypt generator and checker](/online-tool/developer-tools/bcrypt-generator).
