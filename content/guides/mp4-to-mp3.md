---
slug: which-mp3-bitrate-to-use-when-extracting-audio-from-video
tool: mp4-to-mp3
title: Which MP3 Bitrate to Use When Extracting Audio From Video
description: 96, 128, 192, 256 or 320 kbps? How to pick an MP3 bitrate for speech, music and podcasts, what each costs in megabytes, and why a higher one can't add quality.
tags: [Audio, Video, MP3, Guide]
---

Use **128 kbps** for speech (lectures, interviews, podcasts), **192 kbps** for most music, and **256–320 kbps** only when the source is high quality and you want to preserve every detail. Never choose a bitrate higher than you need expecting better sound: MP3 conversion can only keep or lose quality from the video's audio track, never add it. The bitrate mainly decides the file size, and the trade-off is easy to calculate.

Here's how to choose, with the numbers.

## What does the bitrate actually control?

An MP3's bitrate is how many kilobits of data describe each second of audio. The encoder uses a constant bitrate, so the file size follows directly:

**size in bytes = seconds × kbps × 1,000 ÷ 8**

That's the same formula the [MP4 to MP3](/online-tool/audio-video-tools/mp4-to-mp3) tool uses for its size estimate. Here's what each option costs:

| Bitrate            | 1 minute | 3-minute song | 1-hour lecture | Good for                        |
| ------------------ | -------- | ------------- | -------------- | ------------------------------- |
| 96 kbps            | ~703 KB  | ~2.1 MB       | ~41 MB         | Speech when size is critical    |
| 128 kbps           | ~938 KB  | ~2.7 MB       | ~55 MB         | Podcasts, lectures, voice memos |
| 192 kbps (default) | ~1.4 MB  | ~4.1 MB       | ~82 MB         | Most music                      |
| 256 kbps           | ~1.8 MB  | ~5.5 MB       | ~110 MB        | High-quality music sources      |
| 320 kbps           | ~2.3 MB  | ~6.9 MB       | ~137 MB        | The maximum MP3 allows          |

Sizes are shown the way the tool displays them, with 1 KB = 1,024 bytes.

## Why can't a higher bitrate improve the audio?

The audio inside an MP4 is already compressed, typically as AAC at somewhere around 128–256 kbps. Converting to MP3 means decoding that audio and compressing it again with a different method. Each lossy step can only discard information.

So:

- **Matching or slightly exceeding the source bitrate** avoids adding new artifacts.
- **Going far above it** produces a bigger file with no audible benefit.
- **Going below it** saves space at a cost that may or may not be audible, depending on the content.

If you don't know the source bitrate, 192 kbps is a safe middle ground for music, and 128 kbps for anything that's mostly talking.

## Speech or music: why does it matter?

Speech is a narrow, predictable signal. Voices sit mostly in the midrange, so even 96–128 kbps sounds clean. Music, especially with cymbals, applause or dense mixes, has much more high-frequency detail. Low bitrates make that detail swirly or "underwater," which is why music needs more.

## What does the Mono option do?

**Mono** mixes the audio down to a single channel. With a constant bitrate, the file size is set by the bitrate, not the channel count, so a mono file at 128 kbps is about the same size as a stereo one at 128 kbps. What changes is how the data is spent: all of it goes into one channel instead of being shared between two.

That makes mono a good match for speech recorded with a single microphone, where stereo adds nothing. To actually make a file smaller, **lower the bitrate**. For a lecture, mono at 96 kbps is a sensible, compact combination. For music, keep stereo.

## How do you extract just part of the audio?

Use the **Start at (seconds)** and **End at (seconds)** fields. The End field shows the video's length as its maximum. For example, to keep a song that runs from 1:15 to 4:40 in a video:

- Start at: 1:15 = **75** seconds
- End at: 4:40 = **280** seconds
- Length: 205 seconds; at 192 kbps that's 205 × 192,000 ÷ 8 = 4,920,000 bytes, about 4.7 MB

Trimming before converting is faster and smaller than converting the whole video and cutting later.

## How to convert MP4 to MP3 step by step

1. Open [MP4 to MP3](/online-tool/audio-video-tools/mp4-to-mp3) and choose a video (MP4, MOV or WebM). Audio files such as M4A, WAV and OGG work too.
2. Preview it in the player to find your start and end points.
3. Choose a **Bitrate**, set the trim times if needed, and tick **Mono** if it suits the content.
4. Check the estimated size, then click **Convert to MP3**. You'll see "Decoding audio…" and then an encoding progress bar.
5. Listen to the result in the built-in player and download it.

The audio is decoded by your browser and encoded with a LAME-based MP3 encoder in a background worker, so the video never leaves your device.

## Common problems

- **"No audio track could be decoded."** The video may have no sound, or use a codec your browser can't play. MOV and HEVC files often work in Safari or Chrome but not in other browsers.
- **The page struggles with very long videos.** The whole audio track is decoded into memory before encoding, so multi-hour files need a lot of RAM. Trim to the part you need, or try on a computer rather than a phone.
- **"The selected part is too short."** Your start and end times are less than a tenth of a second apart, or the start is past the end of the video.

## FAQ

### What happens if I leave End at empty?

The audio is converted from your start time to the end of the video. Leave both fields at their defaults to convert the whole track.

### Is MP3 the best format for audio?

It's the most compatible. Newer formats such as AAC and Opus sound better at the same bitrate, but MP3 plays on virtually every device and app.

### Will the MP3 include the video's metadata, like title or artist?

No. The output contains audio only, so add tags in your music player if you need them.

Pick your bitrate and convert with [MP4 to MP3](/online-tool/audio-video-tools/mp4-to-mp3).
