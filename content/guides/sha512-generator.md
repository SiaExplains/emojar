---
slug: sha-512-myths-hashing-vs-encryption
tool: sha512-generator
title: 'SHA-512 Myths: Hashing vs Encryption, Speed and Security'
description: SHA-512 can't be decrypted, isn't a safe password store on its own and is often faster than SHA-256. Six common myths about hashing, corrected.
tags: [Security, Hashing, Myths]
---

SHA-512 is a one-way hash function, not encryption: it turns any input into a fixed 512-bit fingerprint (128 hex characters) that can't be turned back into the original. It's used to detect changes to data and, combined with a secret key as HMAC, to prove a message came from someone holding that key. It is not, on its own, a way to hide or protect data.

Because hashing and encryption get mixed up so often, here are six myths worth clearing up, with concrete examples you can reproduce.

## Myth 1: "Hashing is a kind of encryption"

Encryption is a two-way process. You lock data with a key and anyone with the right key can unlock it. Hashing has no key and no unlock step. Compare:

|             | Encryption (e.g. AES) | Hashing (e.g. SHA-512)  |
| ----------- | --------------------- | ----------------------- |
| Reversible  | Yes, with the key     | No                      |
| Output size | Grows with the input  | Always 512 bits         |
| Uses a key  | Yes                   | No (HMAC adds one)      |
| Purpose     | Confidentiality       | Integrity, fingerprints |

The SHA-512 hash of the five-letter word `hello` is:

```
9b71d224bd62f3785d96d46ad3ea3d73319bfbc2890caadae2dff72519673ca7
2323c3d99ba5c11d7c7acc6e14b8c5da0c4663475c2e5c3adef46f73bcdec043
```

(Shown on two lines here; it's a single 128-character string.) The hash of a 2 GB video file is exactly the same length. There's simply not enough information in it to rebuild the input.

## Myth 2: "Websites can decrypt SHA-512 hashes"

Sites that claim to "decrypt" hashes are lookup tables. They've hashed billions of common inputs (dictionary words, leaked passwords, short strings) and stored the results. If your hash is in the table, they return the matching input. If it isn't, they've got nothing.

The practical lesson: **hashing short or predictable input doesn't hide it.** The hash of a phone number, a birth date or "password123" can be found by simply trying every candidate. Hashing is not anonymization.

## Myth 3: "SHA-512 is twice as secure as SHA-256, so always use it"

Both are part of the SHA-2 family defined in NIST's FIPS 180-4 standard, and both are considered secure with no practical attacks. SHA-512's longer output gives a larger theoretical margin, about 256 bits of collision resistance versus 128 for SHA-256, but 128 bits is already far beyond what anyone can compute.

Choose by compatibility instead. If a spec, API or download page asks for SHA-256, give it SHA-256. Use SHA-512 when a system specifies it, for example some API signature schemes, package registries, or HMAC-SHA512 tokens.

## Myth 4: "A bigger hash must be slower"

Often the opposite. SHA-512 processes data in 128-byte blocks using 64-bit arithmetic, so on 64-bit processors it frequently hashes large files faster than SHA-256, which uses 32-bit words and 64-byte blocks. The exception is CPUs with dedicated SHA-256 instructions, where SHA-256 can pull ahead. For anything you'd hash in a browser, the difference is rarely noticeable.

## Myth 5: "Storing passwords as SHA-512 hashes is secure"

A plain SHA-512 is designed to be fast, and fast is exactly what a password cracker wants: modern GPUs test billions of SHA-2 hashes per second. Two problems follow:

- Without a unique **salt**, identical passwords produce identical hashes, and precomputed tables work.
- Without deliberate **slowness**, even salted hashes of weak passwords fall quickly.

Use a dedicated password-hashing function such as Argon2, bcrypt or scrypt. (Schemes like Linux's `sha512crypt` do use SHA-512, but with a salt and thousands of rounds, which is very different from a single hash.)

## Myth 6: "To sign a message, just hash the secret plus the message"

`SHA-512(secret + message)` looks like a signature but is vulnerable to a _length-extension attack_, which lets an attacker append data and compute a valid-looking hash without knowing the secret. The correct construction is **HMAC**, which hashes in two nested passes. With the key `secret` and the message `hello`, HMAC-SHA512 begins `db1595ae88a62fd1…`, unrelated to the plain hash above.

## How to generate a SHA-512 hash or HMAC

1. Open the [SHA-512 Generator](/online-tool/security-generators/sha512-generator).
2. Choose the **Text** tab and type into **Text to hash**, or switch to **File** and drop any file up to 1 GB. The hash updates as you type.
3. For a keyed hash, fill in **HMAC secret key (optional)** in the Text tab. The result is labeled HMAC-SHA-512.
4. To check against a value you were given, paste it into **Compare with a known hash** and look for the green match notice.

Everything is computed with your browser's built-in Web Crypto API; your text, files and keys aren't sent anywhere. To get MD5, SHA-1, SHA-256, SHA-384 and SHA-512 side by side, use the [Hash Generator](/online-tool/developer-tools/hash-generator).

## FAQ

### Why doesn't my result match the one from my terminal?

Most often a trailing newline. `echo "hello" | sha512sum` hashes `hello` plus a line break. Use `printf 'hello' | sha512sum` and the results will agree.

### Is SHA-384 the same as truncated SHA-512?

Close: SHA-384 uses the same algorithm with different starting values and outputs 384 bits. Because of the different starting values, it is not simply the first 96 characters of a SHA-512 hash.

### Does the HMAC key need to be long?

Ideally as long as the hash output (64 bytes for SHA-512) and random. A short, guessable key can be brute-forced just like a password.

Want to see the difference for yourself? [Generate a SHA-512 hash now](/online-tool/security-generators/sha512-generator).
