---
slug: new-monitor-checklist-dead-vs-stuck-pixels
tool: dead-pixel-test
title: 'New Monitor Checklist: How to Tell Dead Pixels From Stuck Ones'
description: Just unboxed a monitor, laptop or TV? Check it for dead and stuck pixels before the return window closes, and learn what each color actually reveals.
tags: [Devices, Displays, Checklist]
---

The best time to check a screen for faulty pixels is in the first few days, while you can still return it. Show the panel a series of solid full-screen colors and look for dots that don't match: a dot that stays black on every color is a dead pixel, while a dot that glows red, green, blue or white where it shouldn't is a stuck pixel. The difference matters, because stuck pixels sometimes recover and dead ones usually don't.

## What's the difference between a dead and a stuck pixel?

Every pixel on an LCD or OLED screen is made of three sub-pixels: red, green and blue. All three at full strength make white; all off makes black.

- **Dead pixel:** none of the sub-pixels light up. It's dark on every color, most obvious on white.
- **Stuck pixel:** one or more sub-pixels are permanently on. It shows as a colored or white dot, most obvious on black.
- **Partly dead pixel:** one sub-pixel never lights, so the pixel looks off-color on white and dark on that sub-pixel's own color.

That's why one color isn't enough: each background switches specific sub-pixels on or off, so each fault shows up on different colors.

## What does each test color reveal?

The [Dead Pixel Test](/online-tool/device-tests/dead-pixel-test) cycles through nine colors, each with a short note on what it finds:

| Color     | What to look for                                          |
| --------- | --------------------------------------------------------- |
| Black     | Stuck or "hot" pixels show as bright dots                 |
| White     | Dead pixels show as black dots; also check for dust       |
| Red       | Pixels with a dead red sub-pixel look dark                |
| Green     | Pixels with a dead green sub-pixel look dark              |
| Blue      | Pixels with a dead blue sub-pixel look dark               |
| Cyan      | A stuck red sub-pixel stands out                          |
| Magenta   | A stuck green sub-pixel stands out                        |
| Yellow    | A stuck blue sub-pixel stands out                         |
| Gray 50 % | Uneven backlight, clouding and banding are easiest to see |

## Worked example: diagnosing one suspicious dot

Say you spot a single bright dot. Step through the colors and note how it behaves:

- On **black** it's a red dot.
- On **white** and **red** it disappears.
- On **green** it looks yellow (green plus red), and on **blue** it looks magenta.
- On **cyan** it's a whitish dot, because cyan already has green and blue on.

Conclusion: the red sub-pixel is stuck on, and the green and blue ones work. That's a stuck pixel and a candidate for the fixer below. A dot that was black on white, red, green and blue alike would be a dead pixel.

## The new-screen checklist

1. **Clean the screen first.** Use a dry microfiber cloth. Dust usually looks blurry and moves when you wipe; a faulty pixel is a sharp dot that stays put.
2. **Use the native resolution.** The [Screen Resolution Checker](/online-tool/device-tests/screen-resolution-checker) shows the physical pixel count, which should match the panel's spec.
3. **Dim the room.** Reflections hide dark dots and glare hides bright ones.
4. **Click "Start full-screen test".** Or click any color in the list to jump straight to it.
5. **Scan each color twice.** Once from normal viewing distance, then up close in sections. On high-resolution panels a magnifying glass or your phone's camera zoom helps.
6. **Use the controls.** Click, or press Space, Enter, → or ↓, for the next color; ←, ↑ or Backspace goes back. Tick "Change colour automatically every 3 s" if you'd rather keep your hands free. Press Esc or the **Exit** button to leave.
7. **Note what you find.** Write down the position and the colors where each dot appears. A retailer or warranty claim will ask for it.

The hint and cursor fade after about two seconds without movement. On phones and TVs, open the page in the device's browser; if full screen isn't supported, the color still fills the visible page.

## Can a stuck pixel be fixed?

Sometimes. Flashing rapidly changing colors over a stuck pixel for 10 to 20 minutes can nudge it back into working, which is what the optional **Stuck pixel fixer** does. It's not guaranteed, and a dead pixel usually can't be revived this way, because it's a hardware fault.

**Photosensitivity warning:** the fixer flashes colors rapidly, about ten changes per second. Do not use it, or look at it, if you or anyone nearby has photosensitive epilepsy or is sensitive to flashing light. For context, the [WCAG guideline on flashing content](https://www.w3.org/WAI/WCAG22/Understanding/three-flashes-or-below-threshold.html) treats more than three flashes a second as a seizure risk, and the fixer exceeds that by design.

If that's safe for you:

1. Read the warning and tick "I understand — show the flashing fixer".
2. Set the **Square size** slider (20 to 300 px) so the square covers the stuck pixel with some margin.
3. Click **Start fixer**. The screen goes black with a square flashing red, green, blue, white and black.
4. Drag the flashing square over the stuck pixel and look away while it runs.

The hint at the bottom shows how long the fixer has been running, but it doesn't stop on its own. If you'd rather walk away, set an [Online Timer](/online-tool/date-time-tools/online-timer) for 15 minutes and press Esc when it rings. Then rerun the color test. If the dot is still there after a couple of attempts, it's time to contact the seller.

## FAQ

### How many dead pixels are acceptable?

It depends on the manufacturer. Many publish a pixel policy, often based on ISO 9241-307 classes, and only replace a screen above a set number or pattern of faulty pixels. Check it before you buy, and test within the return window.

### Can a dead pixel appear later?

Yes. Pixels can fail at any point in a screen's life, so rerun the test after a drop, a knock or pressure on the panel.

Got a new screen on your desk? Run the [Dead Pixel Test](/online-tool/device-tests/dead-pixel-test) before the box goes in the recycling.
