---
slug: how-totp-two-factor-codes-are-calculated
tool: totp-generator
title: How TOTP 2FA Codes Are Calculated, With a Worked Example
description: "A six-digit 2FA code is just a shared secret plus the current time, run through HMAC. Here's the math step by step, checked against the RFC 6238 test vectors."
tags: [Security, 2FA, Developer Tools, Explainer]
---

A TOTP code is calculated from two things only: a secret key that you and the service both stored when you scanned the setup QR code, and the current time divided into 30-second steps. Your authenticator app runs an HMAC over the step number with that secret, cuts the result down to 6 digits, and the server does the same calculation to check it. No network is involved, which is why authenticator apps work offline.

## What goes into a TOTP code?

TOTP (Time-based One-Time Password) is defined in [RFC 6238](https://www.rfc-editor.org/rfc/rfc6238), and it builds on the older counter-based HOTP algorithm. The inputs are:

- **The secret.** Usually 20 random bytes, shown to you as a Base32 string such as `JBSWY3DPEHPK3PXP`. Base32 uses only A–Z and 2–7.
- **The time step.** The current Unix time (seconds since 1 January 1970, UTC) divided by the period, rounded down. With the usual 30-second period, every device on Earth agrees on the same step number at the same moment.
- **The settings.** Hash algorithm (SHA-1 for almost every service), number of digits (normally 6) and period (normally 30 seconds).

## How does the math work, step by step?

1. **Turn the time into a counter.** `step = floor(unixTime / 30)`. At Unix time 59 the step is 1; at 1111111109 it is 37037036.
2. **Write the counter as 8 bytes.** The step number is encoded as a big-endian 64-bit integer, so step 1 becomes `00 00 00 00 00 00 00 01`.
3. **Run HMAC.** Compute HMAC-SHA-1 of those 8 bytes using the decoded secret as the key.
4. **Dynamic truncation.** Take the low 4 bits of the last byte; that number (0–15) is an offset. Read 4 bytes starting at that offset and clear the top bit, giving a 31-bit integer.
5. **Reduce to digits.** Take that integer modulo 10^6 for a 6-digit code (10^8 for 8 digits) and pad with leading zeros.

## A worked example using the RFC test vector

RFC 6238 publishes a test secret so implementations can prove they are correct. It is the ASCII text `12345678901234567890`, which in Base32 is:

`GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ`

Running the steps above with SHA-1 gives these codes. The 8-digit values are the ones printed in the RFC; the 6-digit codes are simply their last six digits, because both come from the same 31-bit number.

| Unix time | Time step | 8-digit code | 6-digit code |
| --- | --- | --- | --- |
| 59 | 1 | 94287082 | 287082 |
| 1111111109 | 37037036 | 07081804 | 081804 |
| 1234567890 | 41152263 | 89005924 | 005924 |
| 2000000000 | 66666666 | 69279037 | 279037 |

Note the leading zeros in `07081804` and `005924`. Codes are strings; a server that strips leading zeros rejects valid codes.

The SHA-256 variant uses a 32-byte version of the same test key; at Unix time 59 it produces `46119246` for 8 digits. The engine behind our generator reproduces these RFC values exactly.

## How do you check a 2FA setup with the generator?

Open the [TOTP generator](/online-tool/developer-tools/totp-generator) and:

1. Paste a Base32 secret into **Secret key (Base32) or otpauth:// link**. Spaces, dashes and lowercase are tolerated. If you have the full `otpauth://totp/...` link (for example from scanning the setup QR code with the [QR code scanner](/online-tool/security-generators/qr-code-scanner)), paste that instead and the issuer, account, algorithm, digits and period are filled in for you.
2. Check **Algorithm** (SHA-1, SHA-256 or SHA-512), **Digits** (6, 7 or 8) and **Period** (30 or 60 seconds) against what the service uses. When unsure, use SHA-1, 6 and 30.
3. Read the current code, the countdown ring, and the previous and next codes underneath.

If you are building 2FA into your own app, click **Generate test secret** to get a fresh random 20-byte secret. Add it to your test database and a phone authenticator app: your server, the phone and this page should agree.

## Why doesn't my code match?

- **Clock drift.** This is the cause most of the time. If your device clock is 30 seconds off, you will see the neighboring code. Turn on automatic time. Many servers accept the code from one step either side to absorb small delays, which is why the previous and next codes are shown.
- **Wrong settings.** An 8-digit or 60-second service never matches the defaults. The `otpauth://` link states its settings explicitly; a bare secret does not.
- **A typo in the secret.** Only A–Z and 2–7 are valid. The tool flags any other character, such as the digit 0 or 8, by name.
- **A counter-based (HOTP) secret.** Links that start with `otpauth://hotp/` use a counter instead of the clock and are not supported.

## Is the secret safe to handle like this?

Treat a TOTP secret exactly like a password: whoever holds it can produce your codes forever, until you reset 2FA on the account. The page calculates codes with your browser's Web Crypto API, keeps the secret only in memory and stores nothing, so closing the tab erases it. That also means it is not a place to keep your only copy. For daily logins, stay with a dedicated authenticator app or password manager, and keep the service's recovery codes somewhere safe offline.

## FAQ

### Is a 6-digit code easy to guess?

Each guess has a one-in-a-million chance, and the code changes every 30 seconds. Services are expected to limit failed attempts, which keeps brute force impractical. A stolen secret is the real risk, not guessing.

### Does TOTP need an internet connection or the correct time zone?

It needs neither. The calculation uses Unix time, which is the same in every time zone, so only the device clock's accuracy matters.

Want to see the codes change live? Paste a test secret into the [TOTP / 2FA code generator](/online-tool/developer-tools/totp-generator) and watch the countdown.
