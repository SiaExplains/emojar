---
slug: how-to-cut-a-ringtone-or-podcast-clip-from-audio
tool: audio-trimmer
title: How to Cut a Ringtone or Podcast Clip From an Audio File
description: A walkthrough of two real trimming jobs, a 30-second ringtone and a shareable podcast clip, with fade lengths, export sizes and the mistakes that cause clicks.
tags: [Audio, How-to, Ringtones]
---

To cut a ringtone or a short clip from an audio file, load the file into an audio trimmer, drag the start and end points on the waveform, listen to the selection, add a short fade so the cut doesn't click, and export it as MP3 or WAV. The whole job takes a couple of minutes, and the precise start point matters more than anything else. Here are two real examples worked through from start to finish.

## Scenario 1: a 30-second ringtone from a song

Say you have a 3 minute 34 second MP3 and want the chorus that starts at 0:45 as your ringtone.

1. Open the [Audio Trimmer](/online-tool/audio-video-tools/audio-trimmer) and drop the MP3 onto the dropzone. The tool shows "Decoding audio…" briefly, then draws the waveform.
2. Click near the left edge of the waveform and drag right to roughly 0:45. The trimmer moves whichever handle is nearest to where you click, so clicks near the start move the start and clicks near the end move the end.
3. For precision, type the exact values: **Start (s)** `45` and **End (s)** `75`. The line underneath confirms it: "Selection: 0:45.0 → 1:15.0 (30.0 s of 214.0 s)".
4. Click **▶ Play selection**. A red playhead runs across the highlighted part. If the chorus starts a beat late, nudge the start by 0.1 seconds and play again.
5. Set **Fade in (s)** to `0.5` and **Fade out (s)** to `2`. A ringtone that cuts off mid-note sounds broken; a two-second fade-out sounds intentional.
6. Leave **Save as** on **MP3 (192 kbps)** and click **Download trimmed audio**.

**What you get:** a 30-second MP3 at 192 kbps is about 192,000 × 30 ÷ 8 = 720,000 bytes, or roughly 0.7 MB, small enough to message to your own phone.

Keep ringtones under 30 seconds; iPhones cap ringtones at 40 seconds. Android phones generally accept an MP3 directly, while iPhones need an extra step, such as importing the clip into GarageBand and exporting it as a ringtone.

## Scenario 2: a clip from a podcast episode or interview

You recorded an hour-long interview and want to share a 50-second quote on social media.

1. Drop the file. A video works too: the trimmer reads the sound of an MP4 or WebM and ignores the picture.
2. In a long file the waveform is compressed, so find the quote by ear first. Drag a rough selection around it, play it and narrow it down.
3. Look for a silent gap. Speech waveforms show clear dips between sentences. Start the selection in the gap just before the first word, not on the word, or the first consonant gets clipped.
4. Use short fades here: **0.1–0.3 seconds**. Long fades on speech make the first and last words sound muffled.
5. If the clip goes on to an editor for captions or music, choose **WAV (lossless)** so it isn't re-encoded twice. Otherwise, MP3 is fine.

**What you get:** WAV is uncompressed 16-bit audio, so 50 seconds of stereo at 48,000 Hz is 50 × 48,000 × 2 channels × 2 bytes ≈ 9.6 MB. The same clip as MP3 at 192 kbps is about 1.2 MB.

## Why do cuts click, and how do fades fix it?

Audio is a wave that swings above and below zero thousands of times a second. If you cut where the wave sits high, the file starts with a sudden jump from silence to that level, which you hear as a click or pop. A fade multiplies the first samples by a value that rises from 0 to 1, so the sound eases in instead of jumping.

The trimmer applies **linear** fades with sample accuracy. At 48,000 samples per second, a 0.5-second fade-in ramps over 24,000 samples. Even 0.1 seconds is enough to remove a click while being too short to notice as a fade.

| Use                  | Fade in              | Fade out             |
| -------------------- | -------------------- | -------------------- |
| Ringtone or alarm    | 0.5 s                | 1.5–2 s              |
| Speech clip          | 0.1–0.3 s            | 0.2–0.5 s            |
| Music sample or loop | 0 s or a tiny amount | 0 s or a tiny amount |
| Sound effect         | 0 s                  | 0.1 s                |

## Common mistakes

- **Cutting on a word or a beat.** Start in the silence just before it. Waveform dips are your guide.
- **Exporting MP3, editing, and exporting MP3 again.** Each MP3 encode is lossy. Save intermediate versions as WAV.
- **Expecting a better sound from a higher format.** WAV export keeps exactly what was decoded; it can't restore detail an MP3 source has already lost.
- **Very short selections.** The selection must be at least 0.1 seconds long, and very short MP3s can sound odd because MP3 encodes in frames of 1,152 samples.

## FAQ

### Can I trim the sound from a video without converting it first?

Yes. Drop the MP4 or WebM directly and the trimmer decodes just the audio. If you want the full soundtrack rather than a clip, [MP4 to MP3](/online-tool/audio-video-tools/mp4-to-mp3) is quicker.

### Does the trimmer change the volume?

No. Apart from the fades you set, the trimmer doesn't adjust levels or normalize anything. If the clip is too quiet, that comes from the source recording.

### Is the file uploaded anywhere?

No. Decoding, cutting and encoding all happen in your browser, which also means large files are limited by your device's memory rather than an upload cap.

Have a clip in mind? Open the [Audio Trimmer](/online-tool/audio-video-tools/audio-trimmer) and start with a short fade on both ends.
