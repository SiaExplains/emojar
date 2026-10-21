---
slug: edit-audio-and-video-in-the-browser-before-sharing
title: 'Record, Trim and Shrink a Video in Your Browser'
description: Record your screen or voice, cut the clip, compress it, make a GIF or MP3 and a thumbnail, all in the browser with nothing uploaded to a server.
tags: [Video, Audio, How-to]
---

To get a recording ready to share without installing an editor, work in this order: record it (or start from a file you have), trim it to the part people need, compress it to fit an email or chat limit, then make extras such as a GIF, an MP3 or a thumbnail. Every step runs in your browser tab, and the file never leaves your device.

The running example: a 12-minute walkthrough of a new feature, of which only 90 seconds are worth sending to a client, in a file far too big to attach.

## How do I record the screen and my voice?

Open the [screen recorder](/online-tool/audio-video-tools/screen-recorder) in a desktop browser. Tick **Record system / tab audio (when offered)** if the demo has sound, and **Add my microphone** if you want to narrate. Click **Choose screen and record**, pick a screen, a window or a single tab, and a 3-second countdown runs before recording starts. You can pause and resume, or stop from the browser's own sharing bar.

Two limits. Most phones don't let web pages capture the screen, so use the phone's built-in recorder there. And sound depends on what you share: a single tab includes its audio in Chrome and Edge, but macOS doesn't give browsers system audio, so on a Mac share a tab, not the whole screen. The file is WebM in Chrome, Edge and Firefox and MP4 in Safari.

For narration alone, such as a voice-over to send with screenshots, use the [voice recorder](/online-tool/audio-video-tools/voice-recorder). It has a level meter, pause and resume, and noise suppression. Download the original (WebM or M4A, depending on the browser), or use **Save as MP3** or **Save as WAV**. The recording exists only in that tab until you download it.

## How do I cut out just the useful part?

Drop the file into the [video trimmer](/online-tool/audio-video-tools/video-trimmer). Set **Start** and **End** with the sliders, type exact times, or play the video and use the current-frame buttons. Then choose a **Cut mode**:

- **Fast — no quality loss (cuts at keyframes)** copies the video without re-encoding. It's quick, but the clip can begin before your start time.
- **Precise — exact frames (re-encodes)** lands on the frame you chose, but takes longer and changes quality slightly.

Browser screen recordings often have few keyframes, so a fast cut of the walkthrough may start several seconds early. The tool warns you when that happens; switch to Precise and trim again. MP4 stays MP4 and WebM stays WebM. The trimmer needs WebCodecs (on iPhone, Safari 17 or later), and some HEVC, AVI or WMV files can't be read.

## How do I make the file small enough to send?

Put the trimmed clip into the [video compressor](/online-tool/audio-video-tools/video-compressor). The defaults are **Balanced** quality and a **720p** cap. The cap applies to the shorter side, so a portrait phone video becomes 720 × 1280. Pick **MP4 (H.264 + AAC)** when you don't know what the viewer uses; it also turns a WebM recording into an MP4. Tick **Remove audio** for a silent demo. Afterwards you see both sizes and can play the two versions side by side.

If the file didn't shrink, it was already well compressed; try **Smallest file** or 480p. Encoding needs a recent Chrome or Edge, Safari 16.4+ or Firefox 130+.

## Can I turn a few seconds into a GIF?

For a preview that plays inline in a chat or an issue tracker, use [video to GIF](/online-tool/audio-video-tools/video-to-gif). It defaults to a 4-second clip at 10 fps and 480 px wide, enough for one click-and-result moment. You can go up to 30 fps and 1,280 px, but the tool caps a GIF at 400 frames and each frame has only 256 colours. If it's too heavy, lower the frame rate first.

## What if someone only needs the audio?

A recorded talk is often more useful as audio. [MP4 to MP3](/online-tool/audio-video-tools/mp4-to-mp3) takes an MP4, MOV or WebM file and lets you pick 96 to 320 kbps, optional start and end times, and mono. For a spoken recording, 128 kbps mono is plenty.

To tidy it, open the [audio trimmer](/online-tool/audio-video-tools/audio-trimmer), drag the start and end on the waveform, and add a half-second **Fade in** and **Fade out** so the cuts don't click. Save as MP3 (192 kbps) or lossless WAV.

If an editor wants a specific format, the [audio converter](/online-tool/audio-video-tools/audio-converter) outputs MP3, WAV, M4A (AAC) or OGG (Opus). MP3 and WAV work in every browser; M4A and OGG rely on encoders some browsers lack.

## How do I make a thumbnail?

Pause the video on a clear frame and take a screenshot. Then open the [social media image resizer](/online-tool/image-tools/social-media-image-resizer) and pick **YouTube → Video thumbnail** (1280 × 720) or **LinkedIn → Post / link image** (1200 × 627). Crop to fill, or fit the whole frame on a blurred background. If it's still heavy, run it through the [image compressor](/online-tool/image-tools/image-compressor) and choose WebP or JPG at about 75% quality.

## Common mistakes

- **Compressing before trimming.** Cut first, then compress once.
- **Recording the whole screen on a Mac and expecting sound.** Share a tab instead, or narrate with the microphone.
- **Forgetting memory.** The browser holds the whole file in memory, and an hour of screen recording can take 1 to 3 GB.
- **Raising the bitrate to "improve" audio.** Converting can't restore lost detail.

## Quick checklist

1. Record a tab (for sound) or use the voice recorder for narration.
2. Trim with Precise mode if the start must be exact.
3. Compress to 720p MP4 and check the size.
4. Make a short GIF or an MP3 only if someone needs it.
5. Screenshot a frame, resize it to 1280 × 720 and compress it.

More tools for cutting, converting and recording live in [audio and video tools](/online-tool/audio-video-tools).
