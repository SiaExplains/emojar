---
slug: email-signature-broken-in-gmail-or-outlook-fixes
tool: email-signature-generator
title: Email Signature Broken in Gmail or Outlook? Common Fixes
description: Missing photo, lost formatting, a dead phone link or a vanished email address? Here is why email signatures break and how to fix each problem quickly.
tags: [Email, Signatures, Troubleshooting]
---

Most broken email signatures come down to three causes: the image isn't hosted at a public web address, the signature was pasted as plain code instead of formatted content, or a field contains something the email client (or the generator) won't turn into a link. Fix those and a signature built from tables and inline styles will look the same in Gmail, Outlook, Apple Mail and on phones. Below are the most common symptoms, what causes each one, and how to fix it.

## Why doesn't my photo or logo show up?

Signatures don't embed images. They point to them. The Emojar generator writes an `<img>` tag that loads your picture from the address in "Photo or logo URL (https://…)", so the image must live somewhere anyone on the internet can reach.

Common causes:

- **You used a file on your computer.** A path like `C:\Users\me\logo.png` only exists on your machine. Upload the image to your website, a public cloud folder with a direct link, or your company's asset storage, and use that https link.
- **The link points to a web page, not the image.** Open the URL in a private browser window. You should see only the picture, and the address usually ends in .png or .jpg.
- **The recipient blocks images.** Many clients hide remote images until the reader clicks "show images". That is on their side and nothing in the signature can override it.
- **The template has no image slot.** "Compact (text only)" never shows a photo. Switch to "Photo + colour bar" or "Classic (photo on top)".

The signature displays the image at 80 × 80 pixels with rounded corners and crops it to fill the square. Upload a square image of about 160 × 160 pixels so it stays sharp on high-resolution screens without bloating every email. If you need to resize one first, the [image resizer](/online-tool/image-tools/image-resizer) does it in the browser.

## Why did my formatting disappear when I pasted it?

Email signature boxes in Gmail, Outlook and Apple Mail are rich-text editors. They expect formatted content, not HTML source. If you click "Copy HTML" and paste into Gmail, you will see a wall of angle brackets.

- For Gmail, Outlook and Apple Mail, click **"Copy signature"**. It puts formatted content on the clipboard, much like copying from a web page.
- If your browser doesn't support rich copying, the tool says so. In that case, select the preview with your mouse, copy it, and paste.
- In **Apple Mail**, untick "Always match my default message font" before pasting, or Mail restyles your text.
- **Thunderbird** works the other way round: tick "Use HTML" in Account Settings and paste the code from "Copy HTML" into the Signature text box.

The "How to add it" list under the preview gives the exact menu path for each client.

## Why is my email address or website missing?

The generator only turns values into links when they look valid, which protects the signature from broken or unsafe links:

| Field                        | What's accepted                                                        | What gets dropped                            |
| ---------------------------- | ---------------------------------------------------------------------- | -------------------------------------------- |
| Email                        | Text with no spaces and one @, like alex@example.com                   | Values with spaces or no @                   |
| Website, LinkedIn, X, GitHub | Web addresses. "example.com" automatically becomes https://example.com | Anything that isn't an http or https address |
| Photo URL                    | Same rule as websites                                                  | Local file paths, unsupported schemes        |

So if a field silently disappears from the preview, check it for a typo or a missing @. The website text is shown without "https://" and without a trailing slash, so "https://www.example.com/" displays as www.example.com. Social profiles appear as small text links labeled LinkedIn, X and GitHub.

## Why does tapping my phone number dial the wrong digits?

The phone line stays exactly as you typed it, but the tap-to-call link keeps only digits and the plus sign. "+1 555 010 0199" becomes `tel:+15550100199`. An extension at the end, written as "ext. 12", "x12" or "#12", is shown in the signature but left out of the link, because phones can't dial extensions from a `tel:` link reliably; the caller asks for the extension once connected.

Use the international format with a leading + and country code. Recipients abroad, and phones roaming outside your country, can then dial it without guessing a prefix.

## How do I rebuild a signature quickly?

1. Open the [email signature generator](/online-tool/security-generators/email-signature-generator) and fill in "Full name", "Job title", "Company", "Phone", "Email" and "Website".
2. Add "Address (optional)", a photo URL and any social profile URLs.
3. Choose a "Template" and a "Brand colour". The colour is used for your title line, links and the accent bar.
4. Check the preview, then click "Copy signature" (or "Copy HTML" for Thunderbird).
5. Paste it into your client's signature settings and send yourself a test email, ideally opened on both a laptop and a phone.

Everything is generated in your browser, and all text is escaped, so a stray `<` or `&` in your company name can't break the layout.

## FAQ

### Can I add a QR code to my signature?

Yes, if you host it. Make one with the [QR code generator](/online-tool/security-generators/qr-code-generator), upload the PNG to a public location, and use its https link as the photo URL.

### Why does the signature look different in replies?

Some clients restyle quoted messages or strip images in long threads. That affects the history below a reply, not the signature you send in new messages.

### Should I use web fonts in my signature?

No. Many email clients ignore custom fonts, so the generator sticks to Arial and Helvetica, which render the same almost everywhere.

Fix it once and stop worrying: [build your email signature here](/online-tool/security-generators/email-signature-generator).
