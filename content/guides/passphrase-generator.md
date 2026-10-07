---
slug: passphrase-vs-password-which-should-you-use
tool: passphrase-generator
title: Passphrase vs Password - Which Should You Use, and When?
description: Random-word passphrases and random-character passwords can be equally strong. Here's how to choose between them and how many words you really need.
tags: [Security, Passwords, Comparison]
---

Use a random passphrase for the handful of secrets you have to remember and type yourself, and a random character password for everything your password manager fills in. At the same entropy they are equally hard to crack; the difference is how easy they are for a human to recall and type. With the word list Emojar uses, six random words give about 61 bits and eight give about 81.

The rest of this guide compares the two side by side and explains how many words are enough for different jobs.

## How does a passphrase get its strength?

A passphrase like `otter-maple-zinc-violin` looks guessable because it's made of real words. Its strength comes from the fact that **you didn't choose the words**; a random generator did, from a known list. An attacker who knows the exact list still has to try every combination.

Each word contributes log2(list size) bits. The Emojar generator draws from a list of 1,163 short, common English words, so each word adds about 10.18 bits:

| Words       | Entropy   | Strength label in the tool |
| ----------- | --------- | -------------------------- |
| 4           | ~41 bits  | Fair                       |
| 5           | ~51 bits  | Fair                       |
| 6 (default) | ~61 bits  | Strong                     |
| 8           | ~81 bits  | Strong                     |
| 10          | ~102 bits | Very strong                |

This is the same idea as Diceware, where you roll dice to choose words. Diceware's large list has 7,776 words (about 12.9 bits each), so it needs fewer words for the same strength. A shorter list of simpler words trades a few extra words for easier typing and spelling.

## Passphrase or password: a side-by-side comparison

|                         | Random passphrase                                | Random character password            |
| ----------------------- | ------------------------------------------------ | ------------------------------------ |
| Example                 | `harbor-quilt-ember-tango-moose-pixel`           | `q7#Vt!2mLx@9Rk$e`                   |
| Entropy                 | ~61 bits (6 words)                               | ~104 bits (16 characters)            |
| Easy to remember        | Yes, with a little practice                      | No                                   |
| Easy to type on a phone | Yes, mostly lowercase letters                    | Awkward symbol switching             |
| Easy to read aloud      | Yes                                              | Error-prone                          |
| Length in characters    | Longer (30–50)                                   | Shorter (16–20)                      |
| Best for                | Master passwords, device logins, disk encryption | Website accounts stored in a manager |

The pattern is clear: **memorability is the only reason to pick a passphrase**. If a password manager types it for you, the shorter character password is simply more entropy per character.

## How many words do you actually need?

It depends on how the secret is attacked.

- **Online logins** (a website that limits attempts): even 4 words are far beyond what can be guessed through a login form, but 5 or 6 is a sensible floor.
- **Your password manager's master password or a computer login**: use at least 6 words. These are usually protected by a deliberately slow hashing function, so each guess is expensive.
- **Disk or file encryption, crypto wallets, anything that could be attacked offline for years**: use 8 words or more. At a trillion guesses per second, trying every 6-word combination (about 2.3×10^18) would take roughly 27 days; 8 words push that past 100,000 years.

## Do capitals, numbers and separators add strength?

Less than you might think, and the tool's entropy readout is honest about it:

- **Capitalize words** capitalizes _every_ word, so it adds no entropy. It only helps with sites that require an uppercase letter.
- **Add a number** appends one random digit (0–9) to one randomly chosen word. With 6 words that's 60 possible placements, adding about 5.9 bits, from roughly 61 to 67.
- **Separator** (hyphen, space, dot, underscore or none) adds nothing, because attackers assume all common separators. Pick whatever is easiest to type. Spaces read naturally but some systems trim or reject them; hyphens are the safe default.

Adding one more word (+10.2 bits) beats all of these combined.

## How to generate a passphrase

1. Open the [Passphrase Generator](/online-tool/security-generators/passphrase-generator). A 6-word phrase is ready immediately.
2. Move the **Number of words** slider (3 to 12) and watch the entropy and strength label update.
3. Choose a **Separator**, and tick **Capitalize words** or **Add a number** if a site's rules demand them.
4. Press **↻ New** until you get a phrase you find easy to picture. Rerolling a few times is fine, but don't hand-edit words, which reintroduces human patterns.
5. Click **Copy**. The phrase is created with your browser's secure random generator and never leaves the page.

A quick memory trick: turn the words into a silly scene ("an otter in a maple tree playing a zinc violin") and type it daily for a week.

## FAQ

### Can I make my own passphrase by picking words I like?

You can, but it won't be as strong as the math suggests. People favor familiar words, song lyrics and grammatical sentences, and attackers model exactly that. Let the generator pick.

### Is a sentence like "MyDogLovesPizzaOnFridays" a passphrase?

It's a memorable password, but not a random passphrase. Its words follow grammar and personal context, so its real entropy is much lower than its length implies.

### What if a site has a maximum password length?

Long passphrases can hit limits of 16 or 20 characters. For those sites, use the [Password Generator](/online-tool/security-generators/password-generator) instead and let your password manager remember it.

Need a strong secret you can actually remember? [Create a passphrase now](/online-tool/security-generators/passphrase-generator).
