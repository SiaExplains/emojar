---
slug: audio-format-conversion-myths-mp3-wav-m4a-ogg
tool: audio-converter
title: 6 Audio Conversion Myths About MP3, WAV, M4A and OGG
description: Converting an MP3 to WAV won't make it sound better, and 320 kbps isn't always best. Six common audio format myths, corrected with real file-size numbers.
tags: [Audio, Formats, Myths]
---

Converting audio between formats never adds quality; it can only keep what's there or lose some of it. Pick a format based on where the file is going (MP3 for compatibility, WAV for editing, M4A or OGG for smaller files at similar quality) and a bitrate that matches the content and the source. Most bad conversions come from a handful of persistent myths, so here they are, one by one.

## Myth 1: Converting MP3 to WAV improves the sound

WAV is lossless, but only in the sense that it doesn't throw anything away _from now on_. The detail an MP3 encoder discarded when the file was first made is gone for good. Converting it to WAV stores that already-reduced audio uncompressed, so it sounds identical and takes up far more space.

The numbers: WAV stores every sample as 16 bits per channel. One minute of stereo at 44,100 Hz is 44,100 × 60 × 2 channels × 2 bytes ≈ 10.6 million bytes, about 10 MB. The same minute as a 192 kbps MP3 is roughly 1.4 MB.

**When WAV is the right choice:** when the file is headed into an editor or a DAW, or when software (some phone systems and older hardware samplers, for example) insists on it. Converting to WAV before editing also prevents a second round of lossy encoding when you export.

## Myth 2: Higher bitrate is always better

A bitrate higher than the source's can't recover detail. Converting a 128 kbps MP3 to a 320 kbps MP3 gives you a file 2.5 times larger that sounds the same, or very slightly worse, because it went through a lossy encoder twice.

Match the bitrate to the content:

| Content                                 | Sensible choice  |
| --------------------------------------- | ---------------- |
| Voice notes, lectures, audiobooks       | 64–96 kbps, mono |
| Podcasts with music beds                | 128 kbps         |
| Music for everyday listening            | 192 kbps         |
| Music from a lossless source, for keeps | 256–320 kbps     |

## Myth 3: MP3 is the best lossy format

MP3 is the most _compatible_ lossy format, which is different. Newer codecs do more with each bit:

- **M4A (AAC)** is standard on Apple devices and sounds better than MP3 at the same bitrate, especially at 128 kbps and below.
- **OGG (Opus)** is the most efficient of the four, excellent for speech at 64 kbps and good for music at 96–128 kbps. Browsers and Android play it; some car stereos and older players don't.

If you know the destination supports AAC or Opus, you can usually go one bitrate step lower than you would with MP3 without hearing a difference.

## Myth 4: Mono saves half the space, so always use it

For a 128 kbps MP3, mono and stereo files are the same size, because the bitrate is fixed: in mono, all those bits go to one channel. Where mono helps is quality per bit for speech: a 64 kbps mono voice recording sounds cleaner than a 64 kbps stereo one. For WAV, which has no bitrate setting, mono really does halve the file.

Use **Mono** for a single voice. Keep stereo for music, where it carries the width of the mix.

## Myth 5: You need to resample to 44,100 Hz for compatibility

Almost every modern device plays 48,000 Hz audio without complaint. Resampling only makes sense when a specific destination demands a rate, such as burning an audio CD (44,100 Hz). Dropping to 22,050 Hz shrinks WAV files by half but audibly dulls music, since it removes everything above about 11 kHz; for a plain voice memo it's usually acceptable.

A technical detail worth knowing: browsers decode audio at your sound device's output rate, often 48,000 Hz. The converter's info line shows that rate, and **Keep original** keeps it. If a destination needs exactly 44,100 Hz, choose it explicitly.

## Myth 6: An online converter has to upload your file

Not this one. The [Audio Converter](/online-tool/audio-video-tools/audio-converter) decodes the file with your browser's own audio engine. MP3 is encoded by a LAME-based encoder running in a background thread, WAV is written directly, and M4A and OGG use the browser's WebCodecs encoders. The file never leaves your device.

## How to convert a file, step by step

1. Drop an audio or video file. Anything your browser can play works, including FLAC in most browsers and the soundtrack of MP4 or WebM videos. The tool then shows the name, size, duration, mono or stereo and sample rate.
2. Under **Convert to**, choose **MP3**, **WAV (16-bit, lossless)**, **M4A (AAC)** or **OGG (Opus)**.
3. For MP3, M4A and OGG, pick a **Bitrate** from 64 to 320 kbps. For MP3 and WAV you can also set **Sample rate** and tick **Mono**.
4. Click **Convert**, listen with the built-in player, check the size shown next to the download button and click it to save the file under its new extension.

M4A and OGG depend on your browser's built-in encoders, and support for them varies by browser and operating system. The tool checks first and asks you to choose MP3 or WAV if the encoder isn't available.

## FAQ

### Which format should I send to someone if I'm not sure what they use?

MP3 at 128–192 kbps. Every phone, computer, car stereo and messaging app plays it.

### Why is my converted file bigger than the original?

You probably converted a compressed file to WAV, or chose a higher bitrate than the source. Pick a bitrate at or below the original's for lossy-to-lossy conversions.

### Can I cut the file while converting it?

Not in the converter. Use the [Audio Trimmer](/online-tool/audio-video-tools/audio-trimmer) to select a part, which exports MP3 or WAV.

Convert your next file with the [Audio Converter](/online-tool/audio-video-tools/audio-converter), choosing the format for where it's going rather than the biggest number.
