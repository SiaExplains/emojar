---
slug: webcam-not-working-checklist-before-a-video-call
tool: webcam-test
title: Webcam Not Working? A Checklist Before Your Next Call
description: Black screen, blocked access, wrong camera or a choppy picture? Work through the usual causes in order and check your real resolution and frame rate.
tags: [Devices, Troubleshooting, Video Calls]
---

If your webcam isn't working, the cause is usually permissions, another app holding the camera, or the wrong device being selected, in roughly that order. Hardware failure is much rarer. Testing the camera in a browser before a call tells you within seconds which of these you're dealing with, and it shows what resolution and frame rate the camera is really delivering.

## Start with a 20-second test

Open the [Webcam Test](/online-tool/device-tests/webcam-test), click **Start camera**, and allow access when the browser asks. One of three things happens:

| What you see                                     | What it means                            | Go to                |
| ------------------------------------------------ | ---------------------------------------- | -------------------- |
| A live picture                                   | Camera and permissions work              | Quality checks below |
| A message that access was blocked                | Browser or system permission is off      | Fix 1                |
| A message that the camera is in use or not found | Another app has it, or it isn't detected | Fix 2 or 3           |

The messages come straight from your browser's response, so they're a reliable guide.

## Fix 1: Camera access was blocked

There are two layers of permission, and both must allow the camera.

**In the browser.** Click the camera or lock icon in the address bar, set Camera to Allow, then reload the page. If you once clicked Block, the browser remembers that choice for the site until you change it.

**In the operating system.**

- **Windows:** Settings › Privacy & security › Camera. Turn on camera access, and make sure your browser is allowed (desktop apps have a separate switch).
- **macOS:** System Settings › Privacy & Security › Camera. Enable your browser, then quit and reopen it.

Also check the page address. Browsers only allow camera access on secure (HTTPS) pages.

## Fix 2: The camera is in use by another app

On many systems, only one app can use the camera at a time. Zoom, Teams, OBS, a virtual background tool, or another browser tab may still be holding it, even if its window is closed. Fully quit those apps, including any icon in the system tray or menu bar, then click **Start camera** again.

## Fix 3: No camera found

- **External webcams:** unplug it and plug it into a different USB port, ideally directly into the computer rather than a hub.
- **Laptops:** look for a physical privacy shutter or a camera key on the keyboard (often marked with a camera icon). Some laptops cut power to the camera entirely when it's switched off.
- **Several cameras:** if you have more than one, a **Camera** drop-down appears once the camera has started. Pick the right one. External webcams and virtual cameras often show up as separate entries.

## Quality checks once the picture appears

When the camera starts, the test shows four readings below the picture.

**Resolution.** The test asks for up to 1920 × 1080 and shows what the camera actually provides. Common results:

| Resolution  | Name           | Aspect ratio shown |
| ----------- | -------------- | ------------------ |
| 1920 × 1080 | 1080p Full HD  | 1.78               |
| 1280 × 720  | 720p HD        | 1.78               |
| 640 × 480   | VGA, older 4:3 | 1.33               |

If a "1080p" webcam reports 640 × 480, check the USB connection or cable. Some cameras fall back to lower modes on slower ports.

**Frame rate (measured).** This is counted from frames the page actually receives, not just the number the camera advertises. Around 30 fps looks smooth. If the measurement drops below 15 fps, the test shows a warning. The usual cause is **dim light**: many webcams slow down their frame rate to gather more light per frame. Turning on a lamp in front of you often fixes it immediately.

**Camera name.** It confirms which device you're testing, which is useful when a laptop has both a built-in and an external camera.

**Aspect ratio.** 1.78 is widescreen (16:9). 1.33 is the older 4:3 shape, which will show black bars in most call apps.

## Why does my preview look backwards?

**Mirror view** is on by default, because seeing yourself as in a mirror feels natural. Other people on a call usually see the unmirrored picture, so text on your shirt or a whiteboard behind you reads correctly for them even though it's reversed in your preview. Untick **Mirror view** to see what they see.

## Frame yourself before the call

With the picture live, run through a quick checklist:

- **Eye level.** Raise a laptop on a few books so the camera is level with your eyes, not looking up at your chin.
- **Light in front, not behind.** A bright window behind you turns your face into a silhouette.
- **Background.** Check what's visible over your shoulders.
- **Distance.** Head and shoulders, with a little space above your head.

Click **Take snapshot** to capture a still. You can save it with **Download snapshot**, which is handy for comparing lighting setups or as a quick profile photo. The snapshot follows the mirror setting.

The video stays on this page. Nothing is recorded or uploaded, and **Stop camera** releases the camera so your call app can use it.

## FAQ

### Why does the camera light stay on after the test?

Click **Stop camera** or close the tab. The light turns off once the browser releases the camera.

### My picture works here but not in Zoom or Teams. Why?

That app is probably set to a different camera, or it lacks the operating-system permission. Check its video settings and the privacy settings in Fix 1.

### Can I test my phone's camera?

Yes. Open the page in your phone's browser. If the phone has front and back cameras, you can switch between them using the **Camera** drop-down.

Check your audio too with the [Microphone Test](/online-tool/device-tests/microphone-test), then run the [Webcam Test](/online-tool/device-tests/webcam-test) before your next call.
