---
slug: how-password-strength-checkers-estimate-crack-time
tool: password-strength-checker
title: How Password Strength Checkers Estimate Crack Time
description: See how a strength checker turns a password into bits and crack times, why P@ssw0rd! scores as very weak, and how a breach check works without sending it.
tags: [Security, Passwords, Explainer]
---

A password strength checker estimates how many guesses an attacker would need, then converts that number into time at different guessing speeds. A good one doesn't just count character types. It looks for the shortcuts attackers actually use, like leaked passwords, dictionary words, keyboard runs and years, and lowers the score when it finds them. The result is an informed estimate, not a guarantee, and this post shows exactly how the Emojar checker gets there.

## Step 1: How big is the character pool?

The starting point is the classic brute-force estimate. The checker adds up the character groups your password uses:

- lowercase letters: 26
- uppercase letters: 26
- digits: 10
- symbols: 33
- a space: 1
- any non-ASCII character, such as é or ü: 100 more

The raw estimate is **length × log2(pool)**. For example, "k9#Vq2!mZ7xL" uses all four main groups, a pool of 95, so 12 × log2(95) ≈ 78.8 bits. If nothing predictable is found, that number stands.

## Step 2: Which patterns make it weaker?

Real attackers start with leaked passwords and common words, then try predictable variations. The checker mirrors that by looking for:

- **Common passwords.** It compares the password against a built-in list of frequently leaked passwords. It also strips digits and symbols from both ends and reverses look-alike swaps, so "P@ssw0rd!" becomes "password". A match caps the estimate at 10 bits.
- **Dictionary words.** Each word found from its list of about 1,160 common English words counts as one pick from that list (about 10 bits), instead of several random letters.
- **Predictable substitutions,** like 0 for o or @ for a, when they hide a word.
- **Keyboard or alphabet runs** of four or more characters, such as "qwer", "asdf", "1234" or "abcd".
- **Repeated characters** like "aaa".
- **Years and dates** from 1950 to 2039, or formats like 12/05/1990.
- **The common shape** of a capital letter, a word, digits and an optional "!".

Here is what that does to some real inputs, run through the checker:

| Password                  | Rating      | Estimate  | What it flags                              |
| ------------------------- | ----------- | --------- | ------------------------------------------ |
| qwerty123                 | Very weak   | 0 bits    | Common password, keyboard run              |
| Summer2024!               | Very weak   | 4 bits    | Common password, words, year, common shape |
| P@ssw0rd!                 | Very weak   | 10 bits   | Common password                            |
| aaaaaa1                   | Very weak   | 15.5 bits | Repeated characters                        |
| ilovemydog                | Fair        | 38.4 bits | Dictionary word "love"                     |
| k9#Vq2!mZ7xL              | Strong      | 78.8 bits | Nothing                                    |
| tulip-garage-ember-violin | Very strong | 83.5 bits | Dictionary words, priced as word picks     |

The rating bands are: under 28 bits Very weak, 28 to 36 Weak, 36 to 60 Fair, 60 to 80 Strong, and 80 or more Very strong.

## Step 3: How do bits become crack times?

On average an attacker finds the password after searching half the possibilities, so the checker assumes 2^(bits − 1) guesses. It divides that by four speeds:

- Online attack (100 guesses/hour, rate-limited), like a login page with lockouts
- Online attack (10 guesses/second), a poorly protected login
- Offline, slow hash like bcrypt (10,000 guesses/second), after a database leak from a careful site
- Offline, fast hash (10 billion guesses/second), after a leak from a site using fast, unsalted hashes

The fourth row matters most: you can't control how a site stores your password. "P@ssw0rd!" falls instantly in both offline scenarios. "k9#Vq2!mZ7xL" holds out for about 8,300 centuries even against the fast hash.

## Where does the estimate fall short?

A checker only knows the patterns it's built to find. "Melbourne1987" rates only Fair at 45 bits: city names aren't in its word list, but it spots the year and the capital-word-digits shape and caps the score for it. A password like "Tr0ub4dor&3" can still rate Strong, because "troubador" isn't in the list either. Attackers' lists include places, names and teams, so read the "What makes it weaker" list, not just the rating. Any warning there means a real attacker has a shortcut.

## How does the breach check work without revealing the password?

The optional "Check known breaches" button uses Have I Been Pwned's [k-anonymity range API](https://haveibeenpwned.com/API/v3#PwnedPasswords). Your browser computes the SHA-1 hash of the password. For "password" that's 5BAA61E4C9B93F3F0682250B6CF8331B7EE68FD8. Only the first five characters, 5BAA6, are sent. The service replies with every leaked hash suffix that starts with that prefix, along with how many times each one was seen. Your browser then looks for the remaining 35 characters in that list.

There are about one million possible five-character prefixes, and each one is shared by many unrelated passwords, so the service can't tell which one you checked. The request is sent without cookies or a referrer. The result reports how many times the password appeared in breaches, or that it wasn't found. "Not found" only means it isn't in known leaks. It doesn't mean the password is strong.

## How to test a password

1. Open the [password strength checker](/online-tool/security-generators/password-strength-checker) and type in "Password to check". Use "Show" to see what you typed.
2. Read the rating, the bits estimate and the four crack times.
3. Check "What makes it weaker" and the "Tips" list.
4. Optionally click "Check known breaches".

The strength analysis runs entirely in your browser. Even so, testing a password with the same structure is a safer habit than typing your real one.

## FAQ

### Why does adding "!" barely help?

The checker strips symbols and digits from the ends before matching, just as cracking tools try common endings early. A trailing "!" or "123" adds almost nothing.

### Is a passphrase better than a complex password?

Often, yes. Four or more random words are long and easy to type. Use the [passphrase generator](/online-tool/security-generators/passphrase-generator) so the words are truly random, not chosen by you.

### Does a Very strong rating mean I'm safe?

It means guessing is impractical. Reuse, phishing and malware bypass strength entirely, so use a unique password per site and turn on two-factor authentication.

Curious how yours holds up? [Check your password strength now](/online-tool/security-generators/password-strength-checker).
