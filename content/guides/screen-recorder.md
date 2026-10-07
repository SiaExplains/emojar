---
slug: screen-recording-problems-no-sound-black-screen-fixes
tool: screen-recorder
title: 'Screen Recording Problems: No Sound, Black Video and Other Fixes'
description: Why a browser screen recording has no audio, shows a black window or won't play in some apps, and how to fix each problem before you record your next take.
tags: [Video, Recording, Troubleshooting]
---

Most screen recording problems in a browser come from the share dialog, not the recorder: no sound usually means the audio checkbox in that dialog wasn't ticked or isn't offered for what you chose to share, and a black video usually means the operating system or the content itself blocked capture. Both are quick to fix once you know which one you're dealing with.

## How does browser screen recording work?

When you click **● Choose screen and record**, the page calls the browser's screen-capture API (`getDisplayMedia`). The **browser** then shows its own dialog where you pick an entire screen, a window or a tab, and decide whether to share audio. The page can't skip that dialog or choose for you, which is why a website can never record your screen silently.

After you choose, a 3-second countdown runs, then the browser's MediaRecorder encodes the video (requested at 30 frames per second) and any audio into a file held in the tab's memory. When you stop, the recording appears in a preview player with a download button.

## Problem: the recording has no sound

Work through these in order:

1. **Was "Record system / tab audio (when offered)" ticked in the tool?** It's on by default. If you unticked it, the browser isn't asked for audio at all.
2. **Did you tick the audio option in the browser's dialog?** Chrome and Edge show a switch or checkbox to also share tab audio (or system audio). It's easy to miss.
3. **What did you share?** Audio availability depends on the source:

| You shared       | Audio in Chrome and Edge                            |
| ---------------- | --------------------------------------------------- |
| A browser tab    | Yes, on all desktop systems                         |
| An entire screen | Yes on Windows and ChromeOS; generally not on macOS |
| A single window  | Usually no audio                                    |

4. **Which browser are you using?** Firefox and Safari record the screen but don't currently offer audio through this API. For a demo with sound on a Mac, share a **tab** in Chrome or Edge, or narrate with your microphone.
5. **Need your voice?** Tick **Add my microphone** before you start. The browser asks for microphone permission after you pick the screen, and the tool mixes your mic and the shared audio into one track. If mic access is blocked, you'll see a message and the recording continues without it.

## Problem: the video is black or a window is missing

- **macOS permission.** On a Mac, your browser needs Screen Recording permission in System Settings under Privacy & Security. Without it, you may get a black frame or only the wallpaper. After granting it, quit and reopen the browser.
- **Protected video.** Streaming services that use DRM often show as a black rectangle in recordings. That's intentional and can't be worked around.
- **One app records black.** If a particular app records black when shared as a window, share the entire screen instead.

## Problem: the button is missing or nothing happens on a phone

If you see a notice that screen recording isn't available, the browser doesn't support `getDisplayMedia`. That's the case on most phones and tablets: mobile browsers generally don't let web pages capture the screen. Use your phone's built-in screen recorder (in Control Center on iPhone, or Quick Settings on most Android phones) instead. On desktop, update Chrome, Edge, Firefox or Safari.

If you click **Cancel** in the share dialog, the tool simply returns to its starting state; click the button again.

## Problem: the file won't open in my editor or phone

The recording's format depends on your browser: usually **WebM** in Chrome, Edge and Firefox, and **MP4** in Safari. The download button shows the actual format and size, for example "Download (WEBM, 84.2 MB)".

WebM plays in browsers and in VLC, but some editors, phones and messaging apps reject it. WebM files written by a live recorder may also lack the duration information some players expect, so the seek bar can look odd. The fix for both: run the recording through the [Video Compressor](/online-tool/audio-video-tools/video-compressor) with **MP4 (H.264 + AAC)** selected. That re-encodes it into a standard MP4 and usually makes it much smaller too.

## Problem: long recordings slow down or fail

Everything is kept in memory until you download it. As a rough estimate, a screen recording runs at a few megabits per second, so an hour can take around 1–3 GB depending on resolution and how much changes on screen. On a laptop with limited RAM:

- Record shorter segments and download each.
- Share a single tab or window rather than a large high-resolution screen.

## How to record, step by step

1. Open the [Screen Recorder](/online-tool/audio-video-tools/screen-recorder) in a desktop browser.
2. Choose **Record system / tab audio (when offered)** and, if you want narration, **Add my microphone**.
3. Click **● Choose screen and record**, pick a screen, window or tab, and tick the audio option in the dialog if you want sound.
4. Wait for the 3-second countdown. Use **Pause** and **Resume** as needed.
5. Click **■ Stop**, or the browser's own "Stop sharing" button, which also ends the recording cleanly.
6. Check the preview, then click the download button.

## FAQ

### Does the page see my screen before I choose what to share?

No. Nothing is captured until you pick a source in the browser's own dialog, and the recording stays on your device until you download it.

### Can I record just one browser tab?

Yes, and it's often the best choice: it hides your other windows and notifications and, in Chrome and Edge, captures that tab's sound on any desktop system.

### How do I make a GIF from part of the recording?

Download it, then open it in [Video to GIF](/online-tool/audio-video-tools/video-to-gif) and choose the start time and length of the clip.

Next time you need a quick demo or bug report, open the [Screen Recorder](/online-tool/audio-video-tools/screen-recorder) and share a tab with audio ticked.
