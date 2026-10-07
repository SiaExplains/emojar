---
slug: pdf-password-protection-checklist-before-you-send
tool: protect-pdf
title: PDF Password Protection Checklist Before You Hit Send
description: Encrypting a PDF only helps if the password is strong and shared safely. A practical checklist for protecting tax forms, payslips and contracts with AES-256.
tags: [PDF, Security, Passwords, Checklist]
---

To protect a PDF properly, encrypt it with a long password, send that password through a different channel than the file, and keep an unencrypted original somewhere safe, because a forgotten password can't be recovered. The encryption itself (AES-256, the strongest standard in the PDF specification) is not the weak point. The password and how you handle it are.

Use this checklist whenever you send something sensitive, such as a tax return, payslip, medical letter or signed contract.

## Before you encrypt

### 1. Finish every other edit first

An encrypted PDF has to be unlocked before other tools can change it. So do the editing first: sign it, add page numbers or a watermark, merge attachments, compress it. Make encryption the **last** step.

### 2. Keep an unprotected original

There's no "forgot password" link for a PDF. If the password is lost, the content is effectively gone. Keep the original in a place you trust, such as your own encrypted drive, rather than relying on remembering the password.

## Choosing the password

### 3. Make it long, not clever

Length beats complexity. Compare how many combinations an attacker would have to try:

| Password type                         | Possible combinations |
| ------------------------------------- | --------------------- |
| 8 lowercase letters                   | about 2.1 × 10¹¹      |
| 8 characters, letters and digits      | about 2.2 × 10¹⁴      |
| 4 random words from a 7,776-word list | about 3.7 × 10¹⁵      |
| 5 random words from a 7,776-word list | about 2.8 × 10¹⁹      |
| 12 random printable characters        | about 4.8 × 10²³      |

Once someone has your file, they can run password-guessing software against it offline, with no lockout after failed attempts. The tool requires at least 4 characters but warns that 12 or more is much safer. Aim for 12+ random characters or a 4–5 word passphrase. The [Passphrase Generator](/online-tool/security-generators/passphrase-generator) creates memorable ones you can read out over the phone.

### 4. Don't reuse a password

Never use your email or banking password. If the PDF password leaks, it should unlock this one document and nothing else.

### 5. Store it in a password manager

Save it together with a note of what it opens. Future you will be grateful.

## Setting the options

### 6. Understand what "Allow printing" and "Allow copying text" do

Unticking these sets permission flags that mainstream PDF readers respect: printing is disabled, or text can't be selected and copied. But they're **not encryption**. Some tools ignore them.

There's another subtlety. In this tool, the same password both opens the file and controls those permissions. Anyone you give the password to can, with the right software, also lift the restrictions. Treat them as a polite request, not a barrier. The open password is what actually protects the content.

### 7. Check the "already encrypted" notice

If the file is already password-protected, the tool says so and won't encrypt it again. To change a password, unlock the file with [Unlock PDF](/online-tool/pdf-tools/unlock-pdf) and then protect it with the new one.

## Sending the file

### 8. Use a separate channel for the password

If the PDF goes by email, send the password by text message or say it on a call. Putting both in the same email means anyone who gets into that inbox gets both.

### 9. Test before you send

Open the protected copy in a PDF reader. Confirm the password prompt appears, that your password works, and that printing or copying behaves as you intended. Any reasonably current PDF reader supports AES-256; very old software may not open the file at all.

## How to password-protect a PDF step by step

1. Open [Protect PDF](/online-tool/pdf-tools/protect-pdf) and choose a file.
2. Type the password in **New password** and again in **Repeat password**. Tick **Show password** to check for typos.
3. Leave **Allow printing** and **Allow copying text** ticked, or untick them.
4. Click **Protect PDF** and download the file, which ends in `-protected.pdf`.

Encryption runs in your browser using qpdf compiled to WebAssembly. Neither the file nor the password is sent anywhere, which matters when the whole point is keeping a document private.

## FAQ

### Does encryption hide the file name?

The file name is not part of the encryption, so don't put sensitive details like a client's name in it. The page contents and text are encrypted.

### Will the recipient need special software?

No. Standard PDF readers on Windows, macOS, iOS and Android ask for the password when the file is opened.

### Is a password-protected PDF safe to put on a shared drive?

It's much better than an unprotected one, provided the password is strong and isn't stored next to the file, for example in a "passwords.txt" in the same folder.

Work through the checklist, then encrypt your file with [Protect PDF](/online-tool/pdf-tools/protect-pdf).
