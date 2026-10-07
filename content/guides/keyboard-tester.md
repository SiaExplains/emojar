---
slug: keyboard-keys-not-working-how-to-test-and-fix
tool: keyboard-tester
title: Keyboard Keys Not Working? How to Test Them and Find the Cause
description: A key that types nothing, two letters at once, or a game that ignores your third key? Test every key, read its code and pin down the real cause.
tags: [Devices, Keyboards, Troubleshooting]
---

When a key stops working, first find out whether the keyboard is at fault or something on the computer is swallowing the press. A browser key test settles that in a minute: if the key lights up, the hardware is fine and the problem lives in an app, shortcut or setting. If it stays dark everywhere, suspect the switch, keycap or connection.

## How do you test a keyboard properly?

Open the [Keyboard Tester](/online-tool/device-tests/keyboard-tester) and click the dashed keyboard area. The hint changes to "Press keys — each one turns green once it works." Then:

1. Press every key once, row by row. A key turns blue while you hold it and green once it has registered at least once.
2. Watch the counter under the keyboard, which reads "Tested _n_ of 104 keys" for the full-size US layout shown on screen.
3. Look at the detail panel after each press: **Key** (the character produced), **Code** (the physical key, such as `KeyA` or `ShiftRight`), **keyCode (legacy)**, **Location** (Standard, Left, Right or Numpad), **Modifiers** and **Auto-repeat**.
4. Hold several keys together to check rollover, then press **Reset** to clear everything and start again.

An optional **Click sound** checkbox beeps on each new press. Key presses are shown on the page only and are never stored or sent anywhere.

## Why won't the counter reach 104?

The drawn layout is a full-size keyboard with function row, navigation block and numeric keypad. Laptops and compact boards don't have all of those keys, so a healthy one will finish well short of 104. Just check that every key you physically have turned green.

Keys that aren't part of the drawn layout still get detected. They show up as "extra (media, ISO/JIS keys, F13+…)" next to the counter and are listed under "Extra keys detected". Common examples:

| Extra code you might see          | Where it comes from                                        |
| --------------------------------- | ---------------------------------------------------------- |
| `IntlBackslash`                   | The extra key next to left Shift on European ISO keyboards |
| `AudioVolumeUp`, `MediaPlayPause` | Media keys, or Fn combined with a top-row key              |
| `F13` and higher                  | Extended function keys on some full-size and Mac keyboards |

## A key does nothing on the test page. Now what?

Work through the causes from cheapest to most expensive:

1. **Is it one of the keys a web page can never see?** The Fn key is handled inside the keyboard and sends nothing to the computer. Shortcuts the operating system reserves, such as Win + L or ⌘ + Tab, never reach the page either, and on some systems Print Screen is captured too. None of those failures mean the key is broken.
2. **Is focus on the test area?** If the border isn't highlighted, the page isn't listening. Click the keyboard area again.
3. **Does it fail in other apps too?** Try a text editor. If the key works there, a remapping tool, game overlay or accessibility setting (like Filter Keys or Sticky Keys) may be intercepting it on the web.
4. **Is there debris under the cap?** Crumbs and dust are the most common cause of a key that needs a hard press or fails intermittently. Unplug it, tip it over and use compressed air, or carefully lift the cap on a mechanical board.
5. **Does it fail on another computer?** If yes, it's the keyboard. If no, look at drivers, the USB port, or the wireless receiver and batteries.

## What if one key types the wrong thing?

Compare the **Key** and **Code** fields: the code is the physical position, the key is the character your layout produced. On a German QWERTZ keyboard, pressing the key in the Y position shows `Code: KeyY` but `Key: z`. That is correct behavior, not a fault. If you get unexpected characters in every app, the fix is your input language or layout setting, not new hardware.

A key that types two characters, or keeps typing after you let go, is a different issue. Hold it briefly and watch **Auto-repeat**: "Yes" while held is normal. If the "Recent key presses" list shows a burst of separate presses from one tap, the switch is "chattering", which is a known hardware wear problem on mechanical keyboards.

## Is my keyboard ghosting in games?

Ghosting means the keyboard drops or invents keys when several are held at once. Hold a typical gaming combination, such as W, A, Left Shift and Space, and watch two fields: **Keys held now** and **Most keys at once**.

Example: you hold W + A + Left Shift + Space and **Keys held now** shows 4. Add D and it stays at 4, and D never turns blue. That combination is being blocked by the keyboard's wiring. Many budget keyboards handle only two or three keys in some combinations, while gaming keyboards often manage six or more, sometimes advertised as 6KRO or NKRO.

Try several combinations, because blocking depends on which keys share a circuit.

## Why does a key stay blue after I let go?

The tester relies on the browser receiving a key-up event. If the operating system grabs the release, for instance when a shortcut fires or a menu opens, the key can look held. Clicking outside the test area clears all held keys, and **Reset** clears everything.

## FAQ

### Can I test a phone's on-screen keyboard?

Yes. Below the panel there's a text box labeled for phone and tablet testing. Type into it to check letters, emoji and autocorrect. Touch keyboards don't light up the drawn layout.

### Should I test a keyboard before buying it secondhand?

It's one of the best uses. Plug it in, press every key until it turns green, test a few rollover combinations, and look for chattering in the recent-presses list. It takes about two minutes.

Checking the rest of your setup? The [Webcam Test](/online-tool/device-tests/webcam-test) and [Microphone Test](/online-tool/device-tests/microphone-test) work the same way.

Ready to check yours? Open the [Keyboard Tester](/online-tool/device-tests/keyboard-tester) and start pressing keys.
