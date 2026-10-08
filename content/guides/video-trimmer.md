---
slug: how-to-trim-a-video-without-losing-quality
tool: video-trimmer
title: How to Trim a Video Without Losing Quality (Fast vs Precise Cuts)
description: Why a lossless video cut can start a moment early, how keyframes and GOPs work, and when to choose fast stream copy or a frame-exact re-encode.
tags: [Video, How-to, Codecs]
---

You can trim a video without losing any quality by copying the encoded stream instead of re-compressing it. The catch is that a copied clip can only begin on a keyframe, so it may start a second or two before the point you chose. If you need the cut to land on an exact frame, the video has to be decoded and re-encoded, which takes longer and changes the picture slightly. The [Video Trimmer](/online-tool/audio-video-tools/video-trimmer) offers both, as Fast and Precise, and runs entirely in your browser.

## What is a keyframe, and why does it matter for cutting?

Modern codecs such as H.264, H.265, VP9 and AV1 don't store every frame as a full picture. That would make files enormous. Instead they store a complete picture now and then, called a keyframe or I-frame, and save the frames in between as differences. A P-frame says "take the previous frame and move these blocks a little." A B-frame can borrow from frames both before and after it.

The run of frames from one keyframe up to the next is called a group of pictures, or GOP. Phones and cameras often place a keyframe every one to two seconds. Streaming and screen-recording software may use longer gaps, and some files have a keyframe only every ten seconds or so.

This structure is the whole reason trimming is tricky. A frame in the middle of a GOP is not a picture on its own. It is a set of instructions that only makes sense if the decoder has already seen the keyframe before it. If you chop the file at that frame and throw away everything earlier, the player has nothing to apply the instructions to. You get a gray smear, a frozen image, or a player that refuses to start.

## How fast mode cuts without re-encoding

Fast mode works like a careful copy and paste of the compressed data. It never decodes the picture. To keep the clip playable, it extends your selection backward to the nearest keyframe at or before your start time and copies from there. Under the hood the tool uses the mediabunny library with a copy policy that expands the boundary rather than dropping frames.

What this means for you:

- **No quality loss.** The video and audio bytes are the same ones the camera wrote. Nothing is compressed a second time.
- **Speed.** Copying is much quicker than encoding, so even long files usually finish quickly.
- **A slightly early start.** The tool warns you right under the mode picker: the clip may begin a little before your start time, at the previous keyframe — often under two seconds, but more for videos recorded in a browser, which can have very few keyframes. After trimming, the result shows the clip's real length and warns you if the cut started noticeably early. The end point is far less of a problem, because playback can simply stop.

Fast mode is the right default for most jobs: sharing a highlight, removing a long intro, or splitting a recording into parts.

## How precise mode gets a frame-exact cut

Precise mode decodes the frames in your range and encodes them again with your browser's built-in encoder through the WebCodecs API. Because it rebuilds the stream, the first frame of your clip becomes a brand-new keyframe exactly where you asked.

The trade-off is the opposite of fast mode. It takes longer, since every frame passes through a decoder and an encoder, and the result is a new compression of the original. That causes a small quality change and a file size that may differ from the source. Choose Precise when the timing really matters, such as a clip that must start on a spoken word or a cut that lines up with music.

## Worked example: a 35.5-second highlight

Say you have a five-minute phone video, `match.mp4`, and you want the goal that happens between 0:12 and 0:47.5.

1. Drop the file onto the dropzone. The player loads it and the Start and End sliders appear, covering the whole video.
2. Type `0:12` in the **Start** box and `0:47.5` in the **End** box, then click out of each box. The boxes accept `0:12`, `12` or `0:12.0`; they all mean the same thing.
3. The summary line under the buttons now reads **Clip: 0:12.0 → 0:47.5 (35.5 s of 5:00.0)**.
4. Leave **Cut mode** on **Fast — no quality loss (cuts at keyframes)** and press **Trim video**. A progress bar shows the percentage, and a **Cancel** button lets you stop.
5. A green box appears with the file size and **MP4**, a preview player, and a **Download clip** button. The file is saved as `match-trimmed.mp4`.

Play the preview. If the phone placed a keyframe at, say, 0:11.2, the clip opens on that frame, a fraction of a second before the goal build-up you picked. If that extra moment bothers you, switch to **Precise — exact frames (re-encodes)** and trim again. The new clip starts at exactly 0:12.0.

You can also set the points while watching. Play or scrub the video to the moment you want, then press **Start = current frame** or **End = current frame**. The sliders move in steps of 0.1 seconds, and the tool always keeps the end at least 0.1 seconds after the start.

## Which format do you get back?

The output container follows a simple rule. A WebM file stays WebM. Everything else, including MP4, MOV, M4V and MKV, is saved as MP4. In fast mode the codec inside is unchanged, so an H.264 MOV from an iPhone becomes an H.264 MP4 with the same picture.

If your browser can't decode a format, the tool can't work with it. That can happen with some HEVC files, and the player shows a message saying it can't play the video. In that case, try Chrome or Edge, or convert the file to MP4 (H.264) or WebM first.

## Which browsers can trim video?

Trimming relies on WebCodecs, the browser API for working with audio and video codecs directly. Recent Chrome, Edge and Safari 17 or later support it, as does Firefox 130 and later. On an older browser the tool shows a notice and the Trim button stays disabled.

There is no upload and no server limit. The whole video is held in your device's memory while it works, so a laptop handles files of a few hundred megabytes comfortably, while an older phone may struggle with very large ones.

## FAQ

### Why does my trimmed clip start earlier than I set?

You used Fast mode, which copies from the keyframe before your start time so it doesn't have to re-encode. Switch to Precise for an exact first frame.

### Does fast mode reduce quality at all?

No. It copies the existing compressed video and audio without decoding them, so the frames you keep are identical to the original.

### Can I make the clip smaller as well as shorter?

Trimming only removes time. To shrink the file further, run the clip through the [Video Compressor](/online-tool/audio-video-tools/video-compressor). To turn a short moment into a looping animation, try [Video to GIF](/online-tool/audio-video-tools/video-to-gif), and for sound-only cuts use the [Audio Trimmer](/online-tool/audio-video-tools/audio-trimmer).

### Is my video uploaded anywhere?

No. The file is read and processed inside your browser tab and never leaves your device.

Ready to cut your clip? Open the [Video Trimmer](/online-tool/audio-video-tools/video-trimmer) and drop in your video.
