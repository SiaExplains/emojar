---
slug: how-strong-is-a-random-password-entropy-explained
tool: password-generator
title: How Strong Is a Random Password? Entropy, Explained
description: 'Why a 16-character random password has about 104 bits of entropy, what that means in guessing time, and how a secure generator picks every character.'
tags: [Security, Passwords, Explainer]
---

A random password's strength comes from two numbers: how many characters it has and how many different characters each position could be. Multiply the length by log2 of the pool size and you get its entropy in bits. A 16-character password drawn from uppercase, lowercase, digits and symbols has about 104 bits, which is far beyond what any attacker can brute-force.

## What does "bits of entropy" actually mean?

Entropy measures how many equally likely passwords a generator could have produced. Every extra bit doubles the number of possibilities an attacker must try.

The formula is simple: **entropy = length × log2(pool size)**.

Here is how the pool sizes work out with the character sets used by the Emojar generator:

| Character types               | Pool size | Bits per character |
| ----------------------------- | --------- | ------------------ |
| Lowercase only                | 26        | 4.7                |
| Lowercase + uppercase         | 52        | 5.7                |
| Letters + digits              | 62        | 5.95               |
| Letters + digits + 27 symbols | 89        | 6.48               |

So a password of 16 characters from all four sets is 16 × 6.48 ≈ 104 bits. At the generator's default length of 20 it is about 130 bits. A 12-character lowercase-only password, by comparison, is just 56 bits.

## How long would it take to guess?

Bits become intuitive when you turn them into time. Assume a well-equipped attacker who has stolen a database protected by a fast hash and can test one trillion (10^12) guesses per second. Here is how long it takes to try every possibility:

- **56 bits** (12 lowercase letters): about 9.5×10^16 possibilities, exhausted in about a day.
- **78 bits** (12 characters, all four types): roughly 7,800 years at that rate, and far longer against a slow password hash.
- **104 bits** (16 characters, all four types): around 5×10^11 years, roughly 35 times the age of the universe.

The tool turns this into a strength label so you don't have to do the math: under 28 bits is Very weak, under 36 Weak, under 60 Fair, under 100 Strong, and 100 bits or more Very strong.

## Why does the randomness source matter?

The entropy formula only holds if every character is chosen **uniformly and unpredictably**. Two common shortcuts break that assumption.

**Math.random() is not built for secrets.** It is a fast pseudo-random generator meant for games and animations; its output is not designed to resist prediction. The Emojar generator uses `crypto.getRandomValues`, the browser's cryptographically secure random number generator, which is seeded by the operating system and designed so that past output cannot predict future output.

**Modulo bias skews the odds.** A naive generator takes a random 32-bit number and computes `number % 89` to pick a character. Because 2^32 is not a multiple of 89, a few characters come up slightly more often than others. The generator avoids this with _rejection sampling_: it throws away random values that fall in the uneven tail and draws again, so every character in the pool is exactly equally likely.

**Human choice destroys entropy.** "Summer2026!" uses four character types but follows a pattern attackers try first. The math above only applies to passwords that a machine picks, which is exactly why a generator is worth using.

## Does requiring every character type weaken the password?

Slightly, and it's not worth worrying about. The generator guarantees at least one character from each type you selected (many sites demand this), then shuffles the result so the guaranteed characters don't sit in predictable positions. That rule removes a tiny fraction of the possible passwords, a fraction of a bit at normal lengths. The displayed entropy is calculated with the plain formula, so treat it as a close upper estimate.

## How to generate a strong password

1. Open the [Password Generator](/online-tool/security-generators/password-generator). A 20-character password with all four types is already generated.
2. Drag the **Length** slider (6 to 128 characters). Aim for 16 or more for anything important.
3. Tick or untick **Uppercase**, **Lowercase**, **Numbers** and **Symbols** to match the site's rules.
4. Tick **Exclude look-alikes** if you'll ever read the password aloud or type it from paper. This removes characters like I, l, 1, O and 0, shrinking the pool from 89 to 83. At 20 characters that costs only about 2 bits (from roughly 130 to 128).
5. Need several, for example when setting up multiple accounts? Set **How many passwords** (up to 50) and use **Copy all**.
6. Click **Copy** and paste straight into your password manager. Press **↻ New** for another.

Everything is generated in your browser; the passwords are never sent or stored anywhere.

## When is a generated password the wrong tool?

A 20-character string of symbols is ideal for accounts your password manager fills in. It is a poor fit for the few secrets you must type from memory, such as the password manager's own master password or your computer login. For those, a random multi-word passphrase gives similar strength while staying memorable; the [Passphrase Generator](/online-tool/security-generators/passphrase-generator) shows the entropy the same way.

For API keys, invite codes and other machine-to-machine secrets, the [Random String Generator](/online-tool/security-generators/random-string-generator) lets you choose a custom alphabet such as hex.

## FAQ

### Is a longer password always better than adding symbols?

Usually. Adding symbols raises the bits per character from 5.95 to 6.48, while adding one more character adds a full 6.48 bits. Four extra characters of letters and digits beat switching on symbols. Turn on symbols when a site requires them or allows only short passwords.

### Should I change strong passwords regularly?

Not on a schedule. Current guidance (including NIST's) is to change a password when there's evidence it was exposed, not every 90 days. A unique, random password per site matters far more.

Ready to replace a weak password? [Generate one now with the Password Generator](/online-tool/security-generators/password-generator).
