---
slug: css-pixels-vs-physical-pixels-display-scaling-explained
tool: screen-resolution-checker
title: 'CSS Pixels vs Physical Pixels: Why a 4K Screen Says 2560'
description: Your 4K monitor reports 2560 × 1440 and your phone claims 390 pixels wide. Learn how display scaling and pixel ratio work, with a worked example.
tags: [Devices, Displays, Web Design]
---

If a resolution checker shows a smaller number than the one printed on your monitor's box, nothing is broken. Browsers measure the screen in CSS pixels, a unit that has already been divided by your operating system's display scaling. Multiply that number by the device pixel ratio and you get back to the physical pixels the panel actually has.

## What is the difference between a CSS pixel and a physical pixel?

A **physical pixel** is one of the light-emitting dots on the panel. A 4K monitor always has 3,840 across and 2,160 down.

A **CSS pixel** is a layout unit that keeps a 16-pixel font roughly the same size on a basic office monitor and on a dense phone screen. When the operating system scales the display, the browser draws each CSS pixel with more than one physical pixel. The ratio between the two is the **device pixel ratio**, often shortened to DPR:

> physical pixels = CSS pixels × device pixel ratio

That's why a phone with a panel over 1,000 pixels wide can report only a few hundred: its pixel ratio is around 3.

## Worked example: a 4K panel at 150 % scaling

Take a 27-inch monitor with a native resolution of 3840 × 2160, set to 150 % scaling so text is readable:

| Step                            | Width | Height |
| ------------------------------- | ----- | ------ |
| Physical panel                  | 3,840 | 2,160  |
| Reported to the browser (÷ 1.5) | 2,560 | 1,440  |
| Device pixel ratio              | 1.5   |        |
| Back to physical: 2,560 × 1.5   | 3,840 | 2,160  |

In the Screen Resolution Checker, that monitor shows **2,560 × 1,440** as the big number, with the line "≈ 3,840 × 2,160 physical pixels at 1.5× scaling" underneath. The table lists "Device pixel ratio" as 1.5 and "Aspect ratio" as 16:9.

Other common setups follow the same math:

| Panel                                    | Scaling | Reported (CSS pixels) | Pixel ratio |
| ---------------------------------------- | ------- | --------------------- | ----------- |
| 1920 × 1080 laptop                       | 125 %   | 1,536 × 864           | 1.25        |
| 3840 × 2160 laptop                       | 200 %   | 1,920 × 1,080         | 2           |
| 2880 × 1800 laptop, default "looks like" | 200 %   | 1,440 × 900           | 2           |

The 1,440 × 900 case shows as "8:5 (≈ 16:10)": the exact ratio, plus the familiar name when the shape is close to one.

## Why is it called an estimate?

The physical figure is calculated, not read from the hardware, and two things can push it off:

- **Browser zoom.** Zooming a page to 110 % or 125 % also changes the device pixel ratio, which is why the tool notes that the ratio "includes browser zoom." Press Ctrl + 0 (⌘ + 0 on a Mac) before you read the numbers.
- **Scaled "more space" modes.** Some laptops render these at a higher internal resolution and shrink it to fit the panel, so the multiplication gives that internal size instead. That is why the tool says the result is _usually_ the native resolution.

A browser can't tell you the screen's size in inches at all; pages only see pixel counts.

## Screen, available area or viewport: which number do you need?

The checker shows three sizes for different questions:

- **Screen resolution** is the whole display in CSS pixels. Quote it, with the physical figure, when support asks for your resolution.
- **Available screen area** is the screen minus the taskbar or dock, i.e. the largest a maximized window can get.
- **Browser window (viewport)** is the part of the window that shows the page. Responsive CSS breakpoints react to this number, and it updates live as you resize or rotate, so you can find the exact width where a layout breaks.

## How to check your own screen, step by step

1. Open the [Screen Resolution Checker](/online-tool/device-tests/screen-resolution-checker). Your resolution appears at the top; everything is read in your browser and nothing is sent anywhere.
2. Reset browser zoom with Ctrl + 0 or ⌘ + 0.
3. Compare "Physical pixels (estimate)" with the native resolution in your monitor's specs. If they match, scaling is the only reason the main number is lower.
4. For the refresh rate, keep the tab in front and the laptop plugged in. The page measures it on load from 120 animation frames and rounds to the nearest common rate, so a measurement of 143.2 fps shows as 144 Hz. Use "Measure refresh rate again" after changing a setting.
5. Click "Copy all details" to paste the full list, notes included, into a bug report or support chat.

To scale a resolution while keeping its shape, use the [aspect ratio calculator](/online-tool/calculators/aspect-ratio-calculator).

## FAQ

### Should I set scaling to 100 % so websites see more pixels?

Only if you want smaller text. Lower scaling gives pages more CSS pixels of room, but text and images use every physical pixel either way, so higher scaling just looks sharper at a comfortable size.

### Why does my 3440 × 1440 ultrawide show "43:18" instead of 21:9?

Because 3,440 ÷ 1,440 reduces exactly to 43:18, and 2,560 × 1,080 reduces to 64:27. "21:9" is a marketing label for several slightly different ultrawide shapes, all between about 2.33:1 and 2.40:1. The tool reports the exact ratio first and then adds "≈ 21:9 ultrawide", so 3440 × 1440 shows as "43:18 (≈ 21:9 ultrawide)".

### Do the HDR and "Colour gamut" rows mean my screen is calibrated?

No. They show what the browser reports through media queries: whether it sees an HDR-capable display and whether it can address sRGB, Display P3 or Rec. 2020 colors. They say nothing about how accurately the panel shows those colors.

Want to see your own numbers? Open the [Screen Resolution Checker](/online-tool/device-tests/screen-resolution-checker) and compare the CSS and physical rows.
