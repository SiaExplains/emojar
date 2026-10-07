---
slug: how-to-make-a-video-file-smaller-best-settings
tool: video-compressor
title: How to Make a Video File Smaller – Which Settings Actually Matter
description: Resolution, quality or format? A practical guide to shrinking a video for email or chat, with worked bitrate maths and the settings that save the most space.
tags: [Video, Compression, Guide]
---

To make a video file smaller, lower its **resolution** first, then its **quality (bitrate)**, and drop the audio if you don't need it. File size is almost exactly bitrate multiplied by duration, so a one-minute phone clip recorded at a high bitrate can often go from over 100 MB to around 10 MB by re-encoding it at 720p with a balanced bitrate. The format you pick (MP4 or WebM) matters less than those two settings.

## Why are phone videos so large?

Phones record at generous bitrates so that every frame looks sharp, even in fast motion, and so the footage survives editing. A 1080p clip at 16 Mbps (megabits per second) is not unusual, and 4K footage often runs several times higher. The maths is simple:

- 16 Mbps × 60 seconds = 960 megabits
- 960 ÷ 8 = 120 megabytes for one minute

Email and messaging apps cap attachments well below that, so compressing means re-encoding at a lower bitrate and usually a lower resolution.

## Which setting saves the most space?

The Video Compressor offers four controls. Here is what each one does, ranked by how much it usually shrinks the file.

| Setting        | Options                                | Effect on size                                      |
| -------------- | -------------------------------------- | --------------------------------------------------- |
| Max resolution | Keep original, 1080p, 720p, 480p, 360p | Biggest lever; fewer pixels need fewer bits         |
| Quality        | High (larger), Balanced, Smallest file | Large; trades sharpness for size                    |
| Remove audio   | On or off                              | Small but free if the clip is silent anyway         |
| Format         | MP4 (H.264 + AAC), WebM (VP9 + Opus)   | Moderate; VP9 is more efficient but less compatible |

### Resolution: the biggest lever

The tool's bitrate targets scale with the number of pixels. Going from 1080p (about 2.1 million pixels per frame) to 720p (about 0.9 million) cuts the pixel count by more than half, and the target bitrate drops with it. "Max resolution" is a ceiling: a video that is already smaller than the limit is never upscaled.

One detail worth knowing: the limit applies to the video's **shorter side**, the way "720p" is normally meant. A landscape 1920×1080 clip set to 720p becomes 1280×720, and a vertical 1080×1920 phone video becomes 720×1280, so portrait clips stay sharp too.

### Quality: how many bits per pixel

The three quality levels map to encoder presets rather than a fixed number you type. When the encoder works in bitrate mode, the approximate targets for H.264 are:

| Output size | Smallest file | Balanced  | High (larger) |
| ----------- | ------------- | --------- | ------------- |
| 1080p       | ~1.7 Mbps     | ~3.2 Mbps | ~6.1 Mbps     |
| 720p        | ~0.8 Mbps     | ~1.5 Mbps | ~2.8 Mbps     |
| 480p        | ~0.4 Mbps     | ~0.7 Mbps | ~1.3 Mbps     |

These are estimates. Where the browser's encoder supports a constant-quality mode, it may use that instead, so a simple screen recording can end up smaller than the table suggests and a busy, shaky clip larger. Audio adds about 128 kbps for AAC in MP4 or about 70 kbps for Opus in WebM.

### Format: MP4 or WebM?

- **MP4 (H.264 + AAC)** plays on virtually every phone, computer, TV and messaging app. Choose it when you don't know what the recipient uses.
- **WebM (VP9 + Opus)** targets roughly 40 % less bitrate for similar quality, but some apps and older devices won't open it. It's a good fit for uploading to a website or keeping a smaller archive.

## A worked example

Take a 60-second, 1080p clip at 16 Mbps: about 120 MB. Compress it with **Max resolution: 720p**, **Quality: Balanced**, **Format: MP4**:

- Video: ~1.5 Mbps, plus audio: ~0.13 Mbps, for a total of ~1.6 Mbps
- 1.6 Mbps × 60 s ÷ 8 ≈ 12 MB

That's about 90 % smaller, and on a phone screen or a laptop window most people won't notice the difference. Switching to Smallest file would roughly halve it again, at the cost of visible softness in fine detail like text or foliage.

## How to compress a video step by step

1. Open the [Video Compressor](/online-tool/audio-video-tools/video-compressor) and drop your video (MP4, MOV, WebM, MKV and other formats your browser can decode).
2. Pick **Quality**, **Max resolution** and **Format**. The defaults, Balanced and 720p, suit most sharing.
3. Tick **Remove audio** if the clip doesn't need sound.
4. Click **Compress video**. A progress bar shows the percentage, and **Cancel** stops it.
5. Compare the original and compressed players side by side. The summary line shows both sizes and the percentage saved.
6. Click **Download compressed video** to save a file named after the original with `-compressed` added.

The video is decoded and re-encoded on your device using the browser's WebCodecs API, so nothing is uploaded. Speed depends on your device: a short 1080p clip is quick, while a long 4K file takes a while and needs plenty of free memory.

## When not to compress

- **Before editing.** Compress the final export, not the raw footage; each lossy re-encode loses a little detail.
- **Already-small files.** If the summary says "not smaller", the original was efficiently encoded already. Lower the resolution or quality, or leave it as is.

## FAQ

### Which browsers can run the compressor?

It needs WebCodecs video encoding, which recent Chrome and Edge, Safari 16.4 or later and Firefox 130 or later provide. If H.264 encoding isn't available in your browser, the tool tells you and you can try the WebM option instead.

### Will compressing fix a video that won't play?

Sometimes. Re-encoding an unusual file (for example, an MKV) to MP4 with H.264 often makes it playable on phones and TVs, as long as your browser can decode the original in the first place.

### Can I turn a short clip into a GIF instead?

Yes, but GIFs are usually larger than a compressed MP4 of the same clip. Use [Video to GIF](/online-tool/audio-video-tools/video-to-gif) only when the destination doesn't accept video.

Ready to shrink a clip? Open the [Video Compressor](/online-tool/audio-video-tools/video-compressor) and try 720p Balanced first.
