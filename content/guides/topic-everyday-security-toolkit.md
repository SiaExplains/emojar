---
slug: everyday-security-toolkit-for-small-teams
title: 'An Everyday Security Toolkit for You and a Small Team'
description: Make unique passwords and passphrases, test old ones, set up 2FA safely, share Wi-Fi by QR and verify files with free tools that run in your browser.
tags: [Security, Passwords, Two-Factor Authentication, Small Business]
---

Most account break-ins at home or in a small office come through three gaps: reused passwords, no second factor, and links or files nobody checked. You can narrow all three in an afternoon. Keep a unique generated password or passphrase per account in a password manager, test old ones against known breaches, use an authenticator app instead of SMS codes, and verify downloads by checksum. The tools below run in your browser, and only the optional breach check contacts another server. None of them makes anyone fully secure; they make the common attacks much harder.

## The situation

A four-person design studio shares one email login for invoices, plus a social account, a cloud drive and an office Wi-Fi password unchanged since 2021. One person uses their dog's name and birth year almost everywhere. Here's a cleanup order that gets the biggest wins first.

## Step 1: A password manager, then generated passwords

Nobody remembers 40 unique strong passwords, so pick a password manager the whole team can use, ideally with shared vaults so the invoice login lives there instead of on a sticky note.

Replace passwords starting with email, because email can reset everything else. The [password generator](/online-tool/security-generators/password-generator) makes passwords from 6 to 128 characters using the browser's secure random generator. Go for 16 or more. If a site rejects symbols, untick them and add a few characters; length does more than variety. **Exclude look-alikes** helps when someone has to read a password off one screen and type it into another device.

Current guidance such as NIST SP 800-63B favours length and screening against breached passwords over forced composition rules and scheduled changes. Those rules mostly produce `Summer2026!` followed by `Autumn2026!`.

## Step 2: Passphrases for what you type by hand

The master password and laptop logins get typed daily, so make them passphrases with the [passphrase generator](/online-tool/security-generators/passphrase-generator). Its list has 1,163 words, about 10 bits each, so six words such as `lantern-oyster-walnut-mint-falcon-velvet` reach roughly 61 bits. What matters is that the generator picks the words. A phrase you invent, like a song line, is far easier to guess.

## Step 3: Test what you already have

The [password strength checker](/online-tool/security-generators/password-strength-checker) rates a password, estimates crack times for an online attack and for offline attacks on slow and fast hashes, and names what weakens it: common passwords, dictionary words, `@`-for-`a` swaps, keyboard runs, repeats and dates. "Rex1987!" trips several at once.

That analysis never leaves the page. The **Check known breaches** button is opt-in: your browser computes the password's SHA-1 hash and sends only the first five hex characters to Have I Been Pwned's range API, which returns every leaked hash with that prefix. The match happens on your device, so neither the password nor its full hash is sent. Anything found there should be retired everywhere. The safest habit is still to test a similar password, not the live one.

## Step 4: Two-factor, done properly

Turn on two-factor authentication for email, the cloud drive, banking and social accounts. Authenticator-app codes (TOTP) beat SMS, which can be hijacked through SIM swaps; passkeys or hardware keys are stronger still where offered.

Enabling TOTP shows a QR code that holds a secret. Store the setup key and backup codes somewhere safe and separate from the account they protect. Never send the secret over email or chat, and never read a code to someone who calls you; real support staff don't ask for it.

If you need to check a backup, the [QR code scanner](/online-tool/security-generators/qr-code-scanner) reads the code from a camera or screenshot and shows the `otpauth://` link inside. Paste that link or the Base32 secret into the [TOTP generator](/online-tool/developer-tools/totp-generator) and confirm it shows the same six digits as your app. A mismatch usually means a wrong device clock. Delete any screenshot of a 2FA QR once the backup is safe.

## Step 5: Guest Wi-Fi and separate handles

Give visitors their own network. The [random string generator](/online-tool/security-generators/random-string-generator) with the custom set `ABCDEFGHJKLMNPQRSTUVWXYZ23456789` and length 20 gives about 100 bits without look-alike characters. Turn it into a sign with the [QR code generator](/online-tool/security-generators/qr-code-generator): choose Wi-Fi, enter the network name and pick WPA. The code is static, so reprint it whenever the password changes.

The same handle everywhere makes your accounts easy to link. For forums, shops and trials, the [username generator](/online-tool/security-generators/username-generator) suggests handles without your name or birth year. It can't check availability, so keep a spare.

## Step 6: Files, and the developer on the team

Before installing downloaded software, hash it in the [SHA-256 generator](/online-tool/security-generators/sha256-generator) and paste the publisher's checksum into the compare field. Some projects publish SHA-512, which the [SHA-512 generator](/online-tool/security-generators/sha512-generator) covers. Take the checksum from the publisher's own site, not the mirror that served the file.

If someone builds the studio's client login, fast hashes like these are wrong for storing passwords. Use a slow, salted password hash such as bcrypt or Argon2id. The [bcrypt generator](/online-tool/developer-tools/bcrypt-generator) shows how it works, with cost factors from 4 to 15, a new salt per hash and a verify mode for testing. Real hashing belongs in server code.

## Common mistakes

- One strong password reused everywhere. Unique beats clever.
- 2FA backup codes saved in the email account they protect.
- Opening a link from a QR sticker without reading the address first.
- Reading "not found in breaches" as "strong". It only means it isn't in known leaks.

## FAQ

### Does the strength checker send my password anywhere?

No. Only the optional breach check sends anything: five characters of a SHA-1 hash.

### Should TOTP secrets go in my password manager?

Many people do, and it beats losing them. A separate authenticator app keeps the two factors apart, which is the point of 2FA.

### Is SHA-256 fine for storing passwords?

No. Use bcrypt, Argon2id or scrypt, which are slow and salted by design.

See every generator in [security generators](/online-tool/security-generators).
