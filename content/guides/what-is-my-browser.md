---
slug: user-agent-myths-ua-reduction-and-client-hints
tool: what-is-my-browser
title: 'User Agent Myths: What Your Browser Really Tells Websites'
description: Why does Chrome say Windows 10 on Windows 11, and why is Safari stuck on macOS 10.15.7? Six user agent myths, plus how Client Hints fill the gaps.
tags: [Browsers, Privacy, Developers]
---

Your user agent string is a rough label, not an accurate ID card. Modern browsers deliberately freeze or simplify parts of it, so it can report the wrong Windows version, an old macOS version or a version number ending in ".0.0.0". Browsers built on Chromium can give the precise details through a newer mechanism called User-Agent Client Hints, while Firefox and Safari leave you with the simplified string.

Here are the myths behind most confused support tickets, checked against real browser reports.

## Myth 1: "The user agent tells you exactly which browser version I have"

It used to. Chrome, Edge and Opera now send a reduced string where only the major version is real. A typical Chrome on Windows sends:

```
Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36
```

Parsed on its own, that gives "Chrome 129.0.0.0". The browser also exposes a list of brands through Client Hints. For the same browser, that list might read "Google Chrome 129.0.6668.90", "Not=A?Brand 8.0.0.0" and "Chromium 129.0.6668.90". The [What Is My Browser](/online-tool/device-tests/what-is-my-browser) tool asks for that full version list, skips the deliberately fake "Not A Brand" entry and the generic Chromium entry, and shows "Chrome 129.0.6668.90". That's the build number to give support.

## Myth 2: "It says Windows 10, so I must be on Windows 10"

Both Windows 10 and Windows 11 send "Windows NT 10.0", and the string has no way to tell them apart. From the string alone the tool can only say "Windows 10 or 11".

Client Hints solve this with a separate platform version number. The tool converts it like this:

| Platform version from Client Hints | Shown as            |
| ---------------------------------- | ------------------- |
| 13.0.0 or higher (e.g. 15.0.0)     | Windows 11          |
| 1.0.0 to 12.x (e.g. 10.0.0)        | Windows 10          |
| 0.x (e.g. 0.3.0)                   | Windows 7, 8 or 8.1 |

Chrome, Edge and Opera provide this value, so they show the real answer. Firefox doesn't support Client Hints, which is why Firefox users see "10 or 11".

## Myth 3: "Safari is reporting my Mac's version"

Every Safari on a Mac reports "Intel Mac OS X 10_15_7", whatever your macOS version is and even on Apple silicon. The version was frozen to make fingerprinting harder. Safari has no Client Hints either, so the tool shows "macOS 10.15.7" and can't do better. Chrome and Edge on a Mac send the same frozen string, but their Client Hints report the real platform version, which the tool uses instead.

A related surprise: Safari on an iPad requests desktop websites by default and sends a Mac user agent. The string alone can't tell the two apart, but Macs have no touch screen, so the tool checks for touch points and reports such a device as iPadOS on a tablet. Because the Mac string carries no iPad version, the iPadOS version is left blank in that case; turning off "Request Desktop Website" in Safari's settings sends the real iPad user agent, version included.

## Myth 4: "Chrome on my iPhone uses the Chrome engine"

On iOS and iPadOS, Chrome, Firefox and Edge are shells around Apple's WebKit engine. Their user agents look like Safari's with an extra marker: "CriOS/" for Chrome, "FxiOS/" for Firefox, "EdgiOS/" for Edge. The tool names the browser from that marker but always reports the rendering engine as WebKit on iPhone and iPad, because that's what actually draws the page. So a bug seen "in Chrome" only on an iPhone is usually a WebKit bug.

## Myth 5: "Android 10; K means my phone runs Android 10"

Reduced Chrome on Android sends "Android 10; K" for everyone. The model name was replaced with "K" and the Android version frozen. When Client Hints are available, the tool shows the real Android version and, if the browser shares it, a "Device model" row such as "Pixel 8". Embedded browsers inside apps are recognized separately: a string with "; wv)" is shown as "Android WebView".

## Myth 6: "The 'Mozilla/5.0' part means I'm using Firefox"

Nearly every browser starts with "Mozilla/5.0", and Chromium browsers also mention "AppleWebKit", "like Gecko" and "Safari", leftovers from decades of browsers copying each other to avoid being blocked. Parsers must check markers in order (Edge's "Edg/" before Chrome, Chrome before Safari) rather than trust the first name they find.

## How do I get an accurate report for a support ticket?

1. Open [What Is My Browser](/online-tool/device-tests/what-is-my-browser) in the browser that has the problem, not a different one.
2. Read the "You are using" line, then the cards: Browser, Rendering engine, Operating system, Device type, plus Device model and CPU architecture when Client Hints provide them.
3. Check the note at the bottom. It says whether the details came from Client Hints or only from the user agent string, so you know how far to trust exact versions.
4. Click "Copy full report" to copy everything, including languages, time zone, screen, GPU and the list of supported features. The page reads all of this locally and sends nothing.

If a developer only wants the raw string, the [What Is My User Agent](/online-tool/device-tests/what-is-my-browser/what-is-my-user-agent) page puts it first with a "Copy user agent" button. For display problems, add the output of the [Screen Resolution Checker](/online-tool/device-tests/screen-resolution-checker) as well. The full Client Hints model is described in the [WICG specification](https://wicg.github.io/ua-client-hints/).

## FAQ

### Should I change my user agent to hide my browser?

Usually not. A spoofed string can break sites that serve different code per browser, and it doesn't hide other signals such as screen size, time zone and GPU. Browsers that reduce or randomize those values do more for privacy.

### Why does the GPU row say "Hidden by the browser"?

The tool asks WebGL for the graphics card name. Some browsers return a generic value or nothing to limit fingerprinting, and the tool doesn't guess.

### Is "Device memory" my real RAM?

No. Browsers that report it round it on purpose, which is why the tool labels it "≈ … GB (rounded)", and many browsers don't report it at all.

Check what your own browser shares: open [What Is My Browser](/online-tool/device-tests/what-is-my-browser) and compare the cards with your settings.
