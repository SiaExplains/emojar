---
slug: how-to-verify-a-download-with-a-sha256-checksum
tool: sha256-generator
title: How to Verify a Downloaded File with a SHA-256 Checksum
description: A step-by-step walkthrough for checking that an installer or ISO is exactly what the publisher released, plus what a mismatch means and what it can't prove.
tags: [Security, Checksums, How-to]
---

To verify a download, calculate the SHA-256 hash of the file you received and compare it with the checksum the publisher lists on its website. If the two 64-character strings match exactly, the file is bit-for-bit identical to what the publisher hashed. If even one character differs, the file is corrupted or has been changed, and you shouldn't run it.

Here's the whole process using a real-world example, along with the mistakes that cause false alarms.

## Why do software sites publish SHA-256 checksums?

A hash function turns any input, from a 5-byte word to a 4 GB disk image, into a fixed-size fingerprint. SHA-256 always produces 256 bits, written as 64 hexadecimal characters. Two properties make it useful for downloads:

- **Any change flips the result completely.** Change a single bit of the file and roughly half the bits of the hash change. There's no such thing as "almost matching."
- **It's infeasible to fake.** Nobody knows how to craft a different file with the same SHA-256 hash, so an attacker can't tamper with an installer and keep the checksum intact.

A quick demonstration with text:

| Input   | SHA-256                                                            |
| ------- | ------------------------------------------------------------------ |
| `hello` | `2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824` |
| `Hello` | `185f8db32271fe25f561a6fc938b2e264306ec304eda518007d1764826381969` |

One capital letter, and the two hashes have nothing in common.

## Walkthrough: checking a Linux ISO before installing

Say you've downloaded `distro-24.04-desktop-amd64.iso` and the project's download page lists a SHA-256 value next to it, often in a file called `SHA256SUMS`.

1. **Copy the published checksum** from the official site. Open the checksum file and copy only the 64-character string for your exact file name.
2. **Open the [SHA-256 Generator](/online-tool/security-generators/sha256-generator)** and switch to the **File** tab.
3. **Drop the ISO onto the drop zone** or click to choose it. The file is read locally by your browser; nothing is uploaded, which matters when you're hashing large or private files. A "Calculating…" status appears while it works.
4. **Paste the published value into "Compare with a known hash."** The tool trims spaces and ignores upper or lower case.
5. **Read the verdict.** A green "Match" means the file is intact. "No match with any calculated hash" means stop and investigate.

Files up to 1 GB are supported. Because the browser loads the whole file into memory, very large ISOs may fail on low-memory devices; in that case, use the command line instead (see below).

## What does a mismatch actually mean?

Don't panic; work through the likely causes in order:

1. **You copied the wrong line.** Checksum files list many files. Make sure you took the hash for the exact version and architecture you downloaded.
2. **The download was incomplete.** Compare the file size with the one listed on the site. Interrupted downloads are the most common cause.
3. **You're comparing different algorithms.** A 40-character value is SHA-1, 32 characters is MD5, and 128 characters is SHA-512. A SHA-256 hash is always 64 characters.
4. **The file was modified.** If the size is right, the algorithm is right and you downloaded it twice with the same mismatch, assume tampering, delete the file and report it to the publisher.

## The trailing-newline trap when hashing text

When you hash _text_ rather than a file, invisible characters count. Many command-line examples use `echo "hello" | sha256sum`, but `echo` adds a newline, so the result is the hash of `hello\n`:

`5891b5b522d5df086d0ff0b110fbd9d21bb4fc7163af34d08286a2e846f6be03`

That doesn't match the tool's result for `hello`, and neither one is wrong. Use `printf` (or `echo -n`) on the command line, and check for stray spaces or line breaks when pasting into the **Text** tab. The tool hashes text as UTF-8.

## What a checksum can't tell you

A matching hash proves the file equals whatever the publisher hashed. It does **not** prove the publisher's page is genuine. If an attacker controls the download server, they can replace both the file and the checksum. That's why serious projects also sign their checksum files with GPG or use code-signing certificates, and why you should always copy checksums from the official HTTPS site rather than a mirror or forum post.

## Doing the same check on the command line

If you prefer a terminal:

- **macOS / Linux:** `shasum -a 256 file.iso` or `sha256sum file.iso`
- **Windows PowerShell:** `Get-FileHash file.iso -Algorithm SHA256`

PowerShell prints uppercase hex; that's the same hash, which is why the tool's comparison ignores case.

## Where else SHA-256 shows up

SHA-256 is specified in the NIST [FIPS 180-4](https://csrc.nist.gov/pubs/fips/180-4/upd1/final) standard and is everywhere: TLS certificates, Git's newer object format, Bitcoin, and API request signing. For signing, the tool's **HMAC secret key** field (in the Text tab) computes HMAC-SHA256, which mixes in a secret so only someone holding the key can produce the same value. If you need a longer digest, the [SHA-512 Generator](/online-tool/security-generators/sha512-generator) works the same way.

## FAQ

### Is SHA-256 safe to use for passwords?

Not on its own. It's designed to be fast, which helps attackers guess billions of passwords per second. Password storage needs a slow, salted algorithm such as Argon2, bcrypt or scrypt.

### Can two different files have the same SHA-256 hash?

In theory yes, since infinitely many inputs map to 2^256 outputs. In practice no collision has ever been found, and finding one deliberately is far beyond current computing power.

### Why use SHA-256 instead of MD5 for checksums?

MD5 collisions can be produced on an ordinary laptop, so an attacker can craft two files with the same MD5. It still catches accidental corruption, but SHA-256 also protects against deliberate tampering.

Got a download to check? [Verify it with the SHA-256 Generator](/online-tool/security-generators/sha256-generator).
