---
slug: how-to-make-a-wifi-qr-code-for-guests
tool: qr-code-generator
title: How to Make a Wi-Fi QR Code Guests Can Scan to Connect
description: Let visitors join your Wi-Fi by pointing a phone camera at a sign. How the Wi-Fi QR format works, how to print it so it scans, and what to keep in mind.
tags: [QR Codes, Wi-Fi, How-to]
---

A Wi-Fi QR code stores your network name, password and security type in a standard text format that phone cameras recognize. Guests scan it and tap "Join," with no typing and no spelling out a 16-character password. You can make one in under a minute, print it on a card or sign, and it keeps working for as long as your network name and password stay the same.

This walkthrough covers a real setup, a café guest network, from creating the code to printing it so it scans reliably.

## What's actually inside a Wi-Fi QR code?

Unlike a link, a Wi-Fi QR code doesn't point anywhere online. It contains a short piece of text in a format that iOS and Android cameras understand:

```
WIFI:T:WPA;S:CafeGuest;P:espresso-2026;;
```

- `T` is the security type (`WPA`, `WEP`, or `nopass` for an open network).
- `S` is the network name (SSID).
- `P` is the password.
- An optional `H:true;` marks a hidden network.

Some characters have special meaning in this format: backslash, semicolon, comma, colon and double quote. If your network is called `Bistro;Guest`, it must be written as `S:Bistro\;Guest`. The Emojar generator adds those escapes automatically, which is one of the most common reasons hand-made Wi-Fi codes fail.

## Step by step: creating the code

1. Open the [QR Code Generator](/online-tool/security-generators/qr-code-generator) and set **Content type** to **Wi-Fi network**.
2. Enter the **Network name (SSID)** exactly as it appears in your phone's Wi-Fi list. It's case-sensitive and spaces count.
3. Enter the **Password**.
4. Choose **Security**: **WPA/WPA2/WPA3** for virtually all modern routers, **WEP** only for very old equipment, or **None (open)** for networks without a password.
5. Tick **Hidden network** only if your router doesn't broadcast its name.
6. The code updates live in the preview. **Test it now** with your own phone before printing anything: open the camera, point it at the screen and confirm it offers to join the right network.

The code is generated entirely in your browser, so your Wi-Fi password isn't sent to a server, and there's no redirect link that could stop working later.

## How do you print it so it scans every time?

Open **Design & size** to adjust the output. Here's what each setting does for print.

**Download SVG for print.** SVG is a vector format, so it stays perfectly sharp on a table tent or an A3 poster. Use PNG for screens, slides and messaging apps. **Size** (128–1024 px) sets the PNG resolution; for print, the SVG's size doesn't matter.

**Pick the physical size by scanning distance.** A common rule of thumb is that a code can be scanned from about ten times its width. A 3 cm (about 1.2 in) code on a table card works from arm's length; a sign by the door that people scan from 2 meters away needs to be about 20 cm (8 in) wide.

**Keep the quiet zone.** The blank border around the code helps the scanner find it. The **Quiet zone (margin)** slider runs from 0 to 8 modules (a module is one small square). The QR specification calls for 4, so increase it from the default of 2 if the code will sit close to other graphics, text or a busy background.

**Choose error correction for the environment.** QR codes contain redundant data so they can be read even when partly damaged:

| Level            | Recovers up to | Use when                                 |
| ---------------- | -------------- | ---------------------------------------- |
| Low              | ~7%            | Clean screens, tiny codes                |
| Medium (default) | ~15%           | Most printed signs                       |
| Quartile         | ~25%           | Laminated cards, outdoor use             |
| High             | ~30%           | Codes with a logo on top, rough handling |

Higher levels make the pattern denser, so print a little larger if you choose Quartile or High.

**Keep contrast high.** You can set any **Foreground** and **Background** color, but a dark code on a light background scans most reliably. Pale-on-pale combinations, such as light gray on white, cause most "it won't scan" complaints.

## A few practical considerations

- **The password is readable to anyone who scans it.** That's the point for guests, but don't put your main home network's code on a public window. Many routers support a separate guest network; use that.
- **Changing the password breaks the code.** Because the details are embedded directly, you'll need to make and print a new one. Static codes never expire on their own.
- **Add a fallback line of text** under the code, such as "Network: CafeGuest / Password: espresso-2026", for guests with older phones.
- **Need a strong but typeable guest password?** A random word phrase from the [Passphrase Generator](/online-tool/security-generators/passphrase-generator) is much easier to read off a sign than a jumble of symbols.

The same tool also makes codes for links, plain text, email, phone calls and SMS. If someone hands you a code and you want to see what's in it before acting on it, the [QR Code Scanner](/online-tool/security-generators/qr-code-scanner) reads it from a photo or screenshot.

## FAQ

### Do iPhones and Android phones both support Wi-Fi QR codes?

Yes. The built-in camera app on current iPhones and most Android phones recognizes the `WIFI:` format and offers to join the network.

### Why does my phone see the network but fail to connect?

Usually the password or security type is wrong. Recheck capitalization, and make sure you didn't pick WEP for a WPA network. Regenerate and test again before reprinting.

### Can I put my logo in the middle?

The generator doesn't add logos, but if you overlay one in a design tool, set error correction to **High** and keep the logo small, then test with several phones.

Ready to make your guest sign? [Create a Wi-Fi QR code now](/online-tool/security-generators/qr-code-generator).
