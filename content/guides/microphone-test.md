---
slug: how-to-read-a-mic-level-meter-and-fix-quiet-audio
tool: microphone-test
title: How to Read a Mic Level Meter and Fix Quiet Audio
description: What dBFS, RMS and peak mean on a microphone meter, where normal speech should land, and practical fixes when people say you sound too quiet or distorted.
tags: [Devices, Audio, Explainer]
---

A microphone level meter shows how loud your input is compared with the maximum the system can record. For normal speech, you want it moving in the middle of the scale: clearly above the quiet zone, but well short of the far right end where audio starts to distort (clip). If people often tell you that you're too quiet or crackly, a quick test with a meter and a short playback shows which way to adjust.

## What the meter is actually measuring

Digital audio is measured in **dBFS**, decibels relative to full scale. 0 dBFS is the loudest value a recording can hold. Everything else is a negative number: −6 dBFS is about half the maximum signal, and −60 dBFS is very faint.

The bar in the [Microphone Test](/online-tool/device-tests/microphone-test) maps that range onto the meter:

- The left edge is **−60 dBFS** or quieter.
- The right edge is **0 dBFS**, the maximum.
- Each tenth of the bar is 6 dB.

The bar shows the **RMS** level, a kind of average loudness over a very short window, which matches how loud speech sounds to us. A thin dark line marks recent **peaks**, the sharpest instant readings such as hard consonants or a laugh, and slowly falls back. Use the bar and its label to judge your level; the line just shows that loud moments are being picked up.

## What do the zone labels mean?

Above the bar, a label describes your current level:

| Label               | Bar position | Roughly                   |
| ------------------- | ------------ | ------------------------- |
| Silent / very quiet | Below 15%    | Quieter than −51 dBFS     |
| Quiet               | 15–45%       | −51 to −33 dBFS           |
| Good level          | 45–92%       | −33 to about −5 dBFS      |
| Too loud (clipping) | Above 92%    | Louder than about −5 dBFS |

While talking normally, aim for "Good level" most of the time. Brief jumps into the top zone on loud words are fine. Living there means distortion. Sitting in "Quiet" while you speak means people will strain to hear you, or their app will boost your signal along with the background noise.

## Why does my level look fine but I still sound quiet?

Probably because of **automatic gain control**. Like most video-call apps, the test starts with your browser's voice processing on: echo cancellation, noise suppression and automatic gain. Automatic gain quietly turns up a weak microphone, so the meter looks healthy even when the raw signal is poor.

Untick **Echo cancellation & noise suppression (like video calls)** to hear and measure the raw microphone. If the level drops sharply, your input volume is set too low. The fixes below will improve every app, not just this test.

## Fixes for a quiet microphone

Work through these in order:

1. **Check you're testing the right mic.** If more than one is connected, a **Microphone** drop-down appears. The current device's name is shown under the controls. Laptops often default to the built-in mic even with a headset plugged in.
2. **Raise the input volume in your operating system.** On Windows, it's under Settings › System › Sound › Input. On macOS, it's System Settings › Sound › Input.
3. **Move closer.** Distance matters more than most people expect: each time you double your distance from the mic, the level drops by about 6 dB, a full tenth of the meter. A headset mic a few centimeters from your mouth beats a laptop mic at arm's length.
4. **Point it the right way.** Many USB microphones pick up from the front or the top, not the side. Check the manual or the markings on the mic.
5. **Check hardware mutes.** Headsets and USB mics often have a mute switch or button on the cable or body.

## Fixes for distortion or clipping

- **Lower the input volume** a step or two in system settings.
- **Back off a little,** or speak slightly across the mic instead of straight into it. This also reduces popping on "p" and "b" sounds.
- **Turn off any extra boost** in the mic's own software if it has one.

## Use the recording, not just the meter

The meter tells you about level. Your ears tell you about everything else: echo, hiss, a muffled tone, keyboard noise. Click **Record 5 seconds**, talk the way you would in a meeting, then play back the clip.

Listen for:

- **Room echo.** Hard, empty rooms sound hollow. Soft furnishings, curtains and a closed door help.
- **Constant background hum** from fans, air conditioning or a laptop cooling fan.
- **Muffled sound,** which often means a Bluetooth headset has switched to its lower-quality call mode. Many headsets do this whenever their microphone is in use.

The recording plays back from this page and stays on your device. Nothing is uploaded.

## Running the test step by step

1. Click **Start test** and allow microphone access.
2. Speak normally and watch the bar and the zone label.
3. Choose another device from **Microphone** if you have several.
4. Click **Record 5 seconds** and play the recording back.
5. Toggle the echo cancellation and noise suppression box to compare processed and raw sound.
6. Click **Stop** when you're done, which releases the microphone for other apps.

## FAQ

### The meter doesn't move at all. What's wrong?

Usually a permission or device issue: check that the browser and operating system both allow microphone access, the right device is selected, and no hardware mute is on.

### Should I turn noise suppression off for calls?

Leave it on for most calls. Turn it off for music, singing or when it makes your voice sound watery or cut off.

### Does a louder level mean better quality?

No. Once you're comfortably in the good zone, extra level just risks clipping. Mic position and room sound matter more.

Check your camera as well with the [Webcam Test](/online-tool/device-tests/webcam-test), and test your input level with the [Microphone Test](/online-tool/device-tests/microphone-test).
