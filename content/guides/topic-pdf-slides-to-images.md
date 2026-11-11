---
slug: turn-pdf-slides-into-images-for-a-blog-post
title: Turn PDF Slides Into Sharp Images for a Blog or Newsletter
description: Export chosen slides from a PDF deck as PNG or JPG, check the 16:9 ratio, resize them to 1200 px, redo a chart from SVG and pull the slide text for captions.
tags: [PDF, Images, Presentations, How-to]
---

To turn a slide deck into images for a blog post or newsletter, export it as a PDF, convert only the slides you want with [PDF to PNG](/online-tool/pdf-tools/pdf-to-png) at 150 DPI, and resize the results to the width your page uses with the [Image Resizer](/online-tool/image-tools/image-resizer). A photo slide goes through [PDF to JPG](/online-tool/pdf-tools/pdf-to-jpg) instead. The [Aspect Ratio Calculator](/online-tool/calculators/aspect-ratio-calculator) gives you the height in advance, [SVG to PNG](/online-tool/image-tools/svg-to-png) redoes a chart from its vector file, and [PDF to Text](/online-tool/pdf-tools/pdf-to-text) copies the slide text for captions and alt text.

The example in this post is a 12-slide talk you gave at a local meetup. Your slide app exported it as `meetup-talk.pdf`, with 16:9 pages that measure 960 × 540 points (13.33 × 7.5 inches). Your blog recap has a 1200-pixel content column, and you want slides 1 to 3, the chart on slide 7, the summary on slide 12 and the full-bleed photo of the room on slide 4.

## Should slides be PNG or JPG?

Use PNG for most slides. The FAQ on the PDF to PNG page recommends PNG for text, charts and slides, and JPG for photos and scanned pages where file size matters. PNG compression is lossless, so thin lines and small type stay crisp, while JPG trades some sharpness for smaller files, which shows more around letters than in a photo.

So slides 1 to 3, 7 and 12 go through PDF to PNG, and the photo on slide 4 goes through PDF to JPG.

## How do you convert only some slides to PNG?

Open PDF to PNG and drop `meetup-talk.pdf` on it. The tool shows the file name and "12 pages". In the **Pages** box, replace `all` with `1-3, 7, 12`. You can type single pages, ranges like `1-3`, and open ranges like `8-` that run to the last page, separated by commas. A page number past the end gives an error that says how many pages the PDF has.

Leave **Resolution** on **150 DPI (recommended)**. The other choices are 72 DPI, 96 DPI and 300 DPI (print). The tool scales each page by the DPI divided by 72, because PDF sizes are measured in points and a point is 1/72 of an inch. A 960 × 540 point slide therefore comes out at:

| Resolution | Image size |
| --- | --- |
| 72 DPI | 960 × 540 px |
| 96 DPI | 1280 × 720 px |
| 150 DPI | 2000 × 1125 px |
| 300 DPI | 4000 × 2250 px |

150 DPI is a good choice here because 2000 pixels is wider than your 1200-pixel column, so the next step only ever shrinks the images. Click **Convert to PNG**. A progress bar counts the pages as they render, and then a list headed "5 files ready" appears. Each file is named after the PDF with the page number added, such as `meetup-talk-page-7.png`, and shows its size as `2000×1125`. Use **🗜️ Download ZIP** to get all five in one archive, or **⬇ Download each**.

For the photo, open PDF to JPG, type `4` in **Pages**, keep 150 DPI and look at the **JPG quality** slider. It runs from 30% to 100% and starts at 90%. JPG has no transparency, so each page is drawn on a white background first and any transparent area comes out white. Click **Convert to JPG** and you get `meetup-talk-page-4.jpg`.

Both converters run in your browser. The PDF is read on your device and isn't uploaded, which helps when the deck has internal numbers or names you haven't cleared for the blog yet.

## What height will a 1200-pixel slide be?

To check the shape before resizing, enter 2000 as **Width** and 1125 as **Height** in the Aspect Ratio Calculator. The result is **16:9**, the closest standard is "16:9 (widescreen)", and the orientation is Landscape. The calculator gets there by dividing both numbers by their greatest common divisor, which is 125.

Now type 1200 into **New width (optional)**. The answer line reads "Height for 1200 wide" with 675 px, and the exact value is also 675, so nothing gets rounded. In the table of common widths below it, 1280 × 720 and 1920 × 1080 are exact, while the 854 row says "Rounded" because 854 × 9 ÷ 16 is 480.375. Widths that divide evenly avoid blurry half-pixel scaling.

## How do you resize all the slides at once?

Open the Image Resizer and add the five PNGs and the JPG together. Keep the mode on **By pixels**. The **Width** box already says 1200, which is what you need. Leave **Height** empty and keep **Lock aspect ratio (fit inside width × height)** ticked, so the tool works out the height for you. Under the settings it previews the first file: 2000×1125 → **1200×675** px.

**Output format** starts on **Keep original format**, so PNGs stay PNG and the photo stays JPG. Pick WebP, PNG or JPG to convert them all to one format. Click **Resize 6 images**. Each result is named with its new size, for example `meetup-talk-page-7-1200x675.png`, and the list shows the old file size next to the new one with the percentage saved.

If you fill in both width and height while the lock is on, the image is fitted inside that box without stretching. Turn the lock off and it's stretched to exactly what you typed, which is rarely what you want for slides.

## How do you get a sharper chart than the PDF gives you?

The chart on slide 7 has thin gridlines and small labels. At 1200 pixels it's readable, but on a high-density screen it can look a bit soft. If you still have the chart as an SVG, say `signups-chart.svg` from the tool you made it in, open SVG to PNG. Drop the file in and set **SVG output width** to 2400 px. The height follows the SVG's own proportions. The tool suggests two or three times the display size for high-density screens, and 2400 is twice your column. The field accepts anything from 16 to 8192 px.

Check the text before you export. Browsers don't load external fonts or images that an SVG points to when they turn it into a picture, so labels set in a web font can come out in a fallback font or go missing. Convert the text to outlines, or embed the images, in your design tool before you export the SVG.

## How do you copy the slide text for captions and alt text?

Each image in the post needs alt text, and a short caption helps readers who skim. Open PDF to Text and drop in the same `meetup-talk.pdf`. A PDF exported from a slide app usually has a text layer, so the text is read straight away. The output marks each page with a line like `--- Page 7 ---`, so you can find the slides you used. A green note says how many pages had text. Click **Copy**, or **Download** to save it as `meetup-talk.txt`.

Line breaks follow the layout of the PDF, so text from a slide with two columns or several text boxes may come out in an odd order and need some tidying. If the deck was printed and scanned instead, the pages have no text layer. The tool offers OCR for those pages in 14 languages, reads up to 60 pages per run, and marks those pages "(OCR)" in the output.

## FAQ

### Which DPI should I use when converting slides to images?

150 DPI works for most blogs and newsletters. A 16:9 slide of 960 × 540 points becomes 2000 × 1125 px, which is wide enough to shrink to a 1200-pixel column. Use 300 DPI only when the images will be printed.

### Can I convert slides that aren't next to each other?

Yes. Type them in the **Pages** box separated by commas, for example `1-3, 7, 12`. You get one image per page, named with its page number.

### Why does my resized slide look stretched?

**Lock aspect ratio** was probably off, so the image was forced to the exact width and height you typed. Turn it back on and fill in only the width, and the height is calculated to match.

### Why is the text in my SVG chart missing after converting it to PNG?

The SVG probably uses a font it loads from elsewhere. Browsers won't load external fonts or images when they turn an SVG into a PNG. Convert the text to outlines in your design tool and export the SVG again.

More converters are in [PDF Tools](/online-tool/pdf-tools) and [Image Tools](/online-tool/image-tools), and the ratio maths is in [Calculators](/online-tool/calculators).
