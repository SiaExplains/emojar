import { FORMAT_LABEL } from '../image/core';
import type { ToolDefinition, ToolVariant } from '../types';

// SVG → PNG has its own dedicated tool page (svg-to-png), so it is not a
// converter variant — two pages would compete for the same search.
const PAIRS: { from: string; to: string; why: string; keywords: string[] }[] = [
  {
    from: 'jpg',
    to: 'png',
    why: 'PNG is lossless, so the image will not lose more quality when you edit and save it again. It is the better choice for screenshots, graphics and images you plan to edit.',
    keywords: ['jpg to png', 'jpeg to png', 'convert jpg to png'],
  },
  {
    from: 'png',
    to: 'jpg',
    why: 'JPG files are usually much smaller than PNGs for photos, which makes them ideal for email, uploads and websites. Transparent areas are filled with white.',
    keywords: ['png to jpg', 'png to jpeg', 'convert png to jpg'],
  },
  {
    from: 'jpg',
    to: 'webp',
    why: 'WebP typically produces files 25–35% smaller than JPG at similar visual quality, which makes web pages load faster.',
    keywords: ['jpg to webp', 'jpeg to webp', 'convert jpg to webp'],
  },
  {
    from: 'webp',
    to: 'jpg',
    why: 'Some apps and older software still cannot open WebP files. Converting to JPG makes the image work everywhere.',
    keywords: ['webp to jpg', 'webp to jpeg', 'convert webp to jpg'],
  },
  {
    from: 'png',
    to: 'webp',
    why: 'WebP supports transparency like PNG but is usually much smaller, so it is a good replacement for PNG graphics on websites.',
    keywords: ['png to webp', 'convert png to webp'],
  },
  {
    from: 'webp',
    to: 'png',
    why: 'PNG is supported by every image editor and keeps transparency, so it is the safest format for editing a downloaded WebP image.',
    keywords: ['webp to png', 'convert webp to png'],
  },
  {
    from: 'jpg',
    to: 'pdf',
    why: 'A PDF keeps photos and scanned pages together in one document that is easy to print, email and archive. Add several images to get a multi-page PDF.',
    keywords: ['jpg to pdf', 'jpeg to pdf', 'image to pdf'],
  },
  {
    from: 'png',
    to: 'pdf',
    why: 'Turning PNG screenshots or scans into a PDF makes them easy to share as one document. Each image becomes its own page.',
    keywords: ['png to pdf', 'convert png to pdf'],
  },
  {
    from: 'pdf',
    to: 'jpg',
    why: 'Converting PDF pages to JPG lets you post them on social media, insert them into presentations or preview them on any device.',
    keywords: ['pdf to jpg', 'pdf to jpeg', 'pdf to image'],
  },
  {
    from: 'pdf',
    to: 'png',
    why: 'PNG keeps text and line art in PDF pages perfectly sharp, which makes it the best image format for documents, diagrams and slides.',
    keywords: ['pdf to png', 'convert pdf to png'],
  },
  {
    from: 'bmp',
    to: 'jpg',
    why: 'BMP files are uncompressed and very large. Converting to JPG typically shrinks them by 90% or more with no visible difference.',
    keywords: ['bmp to jpg', 'bmp to jpeg', 'convert bmp to jpg'],
  },
];

const converterVariants: ToolVariant[] = PAIRS.map(
  ({ from, to, why, keywords }) => {
    const F = FORMAT_LABEL[from];
    const T = FORMAT_LABEL[to];
    return {
      slug: `${from}-to-${to}-converter`,
      name: `${F} to ${T} Converter`,
      title: `${F} to ${T} Converter – Free & Private, No Upload`,
      metaDescription: `Convert ${F} to ${T} online for free. Batch convert files in your browser — your images are never uploaded to a server.`,
      description: `Convert ${F} files to ${T} in seconds. Drop one or more ${F} files below, and the converted ${T} files are created right in your browser — nothing is uploaded. ${why}`,
      config: { from, to },
      keywords,
    };
  },
);

export const IMAGE_TOOLS: ToolDefinition[] = [
  {
    slug: 'image-converter',
    category: 'image-tools',
    name: 'Image Converter',
    icon: '🔄',
    shortDescription: 'Convert images between JPG, PNG, WebP and PDF.',
    description:
      'This free image converter changes images between JPG, PNG, WebP and PDF — and converts PDF pages, SVG and BMP files to images. Conversion happens entirely in your browser, so your files are never uploaded.',
    title: 'Image Converter – Convert JPG, PNG, WebP & PDF Online',
    metaDescription:
      'Free online image converter: JPG to PNG, PNG to JPG, WebP, SVG, BMP and PDF. Batch convert in your browser — your images never leave your device.',
    keywords: [
      'image converter',
      'convert image',
      'jpg to png',
      'png to jpg',
      'webp converter',
      'image to pdf',
    ],
    relatedTools: [
      'image-compressor',
      'image-resizer',
      'svg-to-png',
      'pdf-to-jpg',
      'image-to-base64',
      'merge-pdf',
    ],
    component: 'image-converter',
    config: { from: 'any', to: 'png' },
    handlesFiles: true,
    popular: true,
    howTo: [
      'Drop your images (or PDFs) into the box, or click it to choose files.',
      'Pick the output format: PNG, JPG, WebP or PDF. For JPG and WebP you can set the quality.',
      'Click “Convert” and download each file, or download all at once.',
    ],
    about: [
      'An image converter re-encodes a picture in a different file format. The pixels stay the same, but the format decides file size, quality and features: JPG is small and great for photos, PNG is lossless and supports transparency, WebP is a modern format that is smaller than both, and PDF wraps images into a printable document.',
      'Most online converters upload your files to a server. This one uses your browser’s built-in image decoder and a background worker, so conversion is fast, works offline once the page has loaded, and keeps private photos on your device.',
    ],
    faqs: [
      {
        q: 'Which formats can I convert?',
        a: 'Input: JPG, PNG, WebP, GIF (first frame), BMP, AVIF (where your browser supports it), SVG and PDF. Output: PNG, JPG, WebP and PDF.',
      },
      {
        q: 'Can I convert several images at once?',
        a: 'Yes. Drop as many files as you like — each one is converted separately, and converting to PDF combines them into one multi-page document.',
      },
      {
        q: 'Does converting to PNG improve quality?',
        a: 'No. Converting a JPG to PNG stops further quality loss, but it cannot restore detail that JPG compression already removed.',
      },
    ],
    variants: converterVariants,
  },
  {
    slug: 'image-compressor',
    category: 'image-tools',
    name: 'Image Compressor',
    icon: '🗜️',
    shortDescription: 'Reduce image file size without uploading your files.',
    description:
      'Compress JPG, PNG and WebP images to a smaller file size directly in your browser. Choose a quality level, compare the before and after sizes, and download — your images are never uploaded.',
    title: 'Image Compressor – Reduce JPG, PNG & WebP File Size Online',
    metaDescription:
      'Compress images online without uploading them. Shrink JPG, PNG and WebP files with adjustable quality and optional resizing — free and private.',
    keywords: [
      'image compressor',
      'compress image',
      'reduce image size',
      'compress jpg',
      'compress png',
    ],
    relatedTools: [
      'image-resizer',
      'image-converter',
      'compress-pdf',
      'image-cropper',
      'image-exif-viewer',
    ],
    component: 'image-compressor',
    handlesFiles: true,
    popular: true,
    howTo: [
      'Add one or more images.',
      'Choose the output format and quality. Lower quality means a smaller file. Optionally limit the maximum width.',
      'Compare the original and compressed sizes, then download the results.',
    ],
    about: [
      'Image compression reduces file size by re-encoding an image with lossy compression (JPG or WebP) and optionally reducing its dimensions. For most photos, a quality setting of 70–80% saves 50–80% of the file size with no visible difference.',
      'PNG is a lossless format, so “compressing” a PNG usually means converting it to WebP or JPG, or reducing its size. The tool shows the exact savings for each file so you can choose the best trade-off.',
    ],
    faqs: [
      {
        q: 'How much smaller will my image get?',
        a: 'It depends on the image. Large photos from phones typically shrink by 60–90%; images that are already optimised may only shrink a little. If the result would be larger, the tool tells you and keeps the original.',
      },
      {
        q: 'Does compression remove EXIF data?',
        a: 'Yes. Re-encoding through the browser strips EXIF metadata such as GPS location and camera details, which is good for privacy.',
      },
    ],
  },
  {
    slug: 'image-resizer',
    category: 'image-tools',
    name: 'Image Resizer',
    icon: '📐',
    shortDescription: 'Resize images directly in your browser.',
    description:
      'Resize images to exact pixel dimensions or by percentage, with the aspect ratio locked or unlocked. Works with JPG, PNG, WebP and more — processed locally in your browser.',
    title: 'Image Resizer – Resize Images by Pixels or Percent Online',
    metaDescription:
      'Resize JPG, PNG and WebP images online by pixels or percentage. Keep the aspect ratio, batch resize, and download — your images never leave your device.',
    keywords: [
      'image resizer',
      'resize image',
      'resize photo',
      'change image size',
      'resize jpg',
    ],
    relatedTools: [
      'image-compressor',
      'image-cropper',
      'image-converter',
      'image-rotator',
      'svg-to-png',
    ],
    component: 'image-resizer',
    handlesFiles: true,
    popular: true,
    howTo: [
      'Add one or more images.',
      'Choose “By pixels” and enter a width and/or height, or choose “By percentage”.',
      'Keep “Lock aspect ratio” on to avoid stretching, then click Resize and download.',
    ],
    about: [
      'Resizing changes the number of pixels in an image. Making an image smaller reduces its file size and is often required for profile pictures, online forms and marketplaces. Making it larger adds pixels by interpolation, which cannot add real detail.',
      'With the aspect ratio locked, entering only a width calculates the matching height automatically (and vice versa). Entering both fits the image inside that box.',
    ],
    faqs: [
      {
        q: 'Will resizing reduce quality?',
        a: 'Shrinking an image keeps it sharp. Enlarging it beyond its original size will look softer, because the browser has to invent the new pixels.',
      },
      {
        q: 'Can I resize many images to the same size?',
        a: 'Yes — add multiple files and the same settings are applied to each one.',
      },
    ],
  },
  {
    slug: 'image-cropper',
    category: 'image-tools',
    name: 'Image Cropper',
    icon: '✂️',
    shortDescription: 'Crop images to any size or aspect ratio.',
    description:
      'Crop an image by dragging a selection or entering exact pixel values. Use presets such as 1:1, 4:3 and 16:9 for social media. Cropping happens in your browser — nothing is uploaded.',
    title: 'Image Cropper – Crop Images Online to Any Aspect Ratio',
    metaDescription:
      'Crop JPG, PNG and WebP images online. Drag to select or enter exact pixels, use 1:1, 4:3 or 16:9 presets, and download instantly. Free and private.',
    keywords: [
      'image cropper',
      'crop image',
      'crop photo online',
      'crop to square',
      'aspect ratio crop',
    ],
    relatedTools: [
      'image-resizer',
      'image-rotator',
      'image-flipper',
      'image-compressor',
      'image-converter',
    ],
    component: 'image-cropper',
    handlesFiles: true,
    howTo: [
      'Choose an image.',
      'Drag on the preview to draw the crop area, or type exact X, Y, width and height values. Pick an aspect ratio preset if you need one.',
      'Click “Crop image” and download the result.',
    ],
    about: [
      'Cropping removes the outer parts of an image to improve framing, remove distractions or match a required aspect ratio, such as 1:1 for profile pictures or 16:9 for video thumbnails.',
      'The numeric fields make precise, keyboard-accessible cropping possible, and the output keeps the original format unless you choose another.',
    ],
    faqs: [
      {
        q: 'Does cropping reduce image quality?',
        a: 'No — cropping only removes pixels outside the selection. The remaining pixels are unchanged, though JPG and WebP output is re-encoded at the quality you choose.',
      },
      {
        q: 'How do I crop to a perfect square?',
        a: 'Choose the 1:1 preset; the selection is then locked to a square while you drag.',
      },
    ],
  },
  {
    slug: 'image-rotator',
    category: 'image-tools',
    name: 'Image Rotator',
    icon: '🔃',
    shortDescription: 'Rotate images by 90°, 180° or any angle.',
    description:
      'Rotate images by 90°, 180°, 270° or any custom angle and download the result. Fix sideways phone photos in seconds — processing happens in your browser.',
    title: 'Rotate Image Online – Rotate JPG, PNG & WebP by Any Angle',
    metaDescription:
      'Rotate images online by 90, 180 or any angle. Fix sideways photos, batch rotate JPG, PNG and WebP files in your browser — no upload required.',
    keywords: [
      'rotate image',
      'image rotator',
      'rotate photo',
      'rotate jpg',
      'rotate picture 90 degrees',
    ],
    relatedTools: [
      'image-flipper',
      'image-cropper',
      'image-resizer',
      'rotate-pdf',
      'image-converter',
    ],
    component: 'image-transform',
    config: { mode: 'rotate' },
    handlesFiles: true,
    howTo: [
      'Add one or more images.',
      'Choose 90° left, 90° right, 180°, or enter a custom angle.',
      'Download the rotated images.',
    ],
    about: [
      'Rotating an image turns it around its centre. Quarter turns (90°, 180°, 270°) are lossless in terms of pixels; other angles enlarge the canvas so no corner is cut off, filling the new area with transparency (PNG/WebP) or white (JPG).',
    ],
    faqs: [
      {
        q: 'Why does my photo look sideways on some sites?',
        a: 'Phones often store orientation as EXIF metadata instead of rotating the pixels. Some apps ignore that tag. Rotating here bakes the orientation into the pixels so it displays correctly everywhere.',
      },
    ],
  },
  {
    slug: 'image-flipper',
    category: 'image-tools',
    name: 'Image Flipper',
    icon: '🪞',
    shortDescription: 'Flip images horizontally or vertically (mirror).',
    description:
      'Mirror an image horizontally or flip it vertically with one click. Useful for selfies, product photos and design mock-ups. Your image is processed locally in your browser.',
    title: 'Flip Image Online – Mirror Images Horizontally or Vertically',
    metaDescription:
      'Flip or mirror images online. Flip JPG, PNG and WebP horizontally or vertically in your browser and download instantly — free, no upload.',
    keywords: [
      'flip image',
      'mirror image',
      'flip photo',
      'mirror selfie',
      'flip horizontally',
    ],
    relatedTools: [
      'image-rotator',
      'image-cropper',
      'image-resizer',
      'image-converter',
    ],
    component: 'image-transform',
    config: { mode: 'flip' },
    handlesFiles: true,
    howTo: [
      'Add one or more images.',
      'Choose “Flip horizontal” (mirror) and/or “Flip vertical”.',
      'Download the flipped images.',
    ],
    about: [
      'Flipping horizontally mirrors an image left-to-right — the same effect as looking in a mirror. Front-camera selfies are often mirrored; flipping them makes text in the picture readable again. Flipping vertically mirrors it top-to-bottom, like a reflection in water.',
    ],
    faqs: [
      {
        q: 'Is flipping the same as rotating 180°?',
        a: 'No. Rotating 180° turns the image upside down; flipping vertically also turns it upside down but mirrors it at the same time.',
      },
    ],
  },
  {
    slug: 'image-background-remover',
    category: 'image-tools',
    name: 'Background Remover',
    icon: '🪄',
    shortDescription: 'Remove plain or solid-colour backgrounds from images.',
    description:
      'Remove a plain or solid-colour background from an image and download a transparent PNG. Click the background to pick its colour, adjust the tolerance, and preview the result — all in your browser.',
    title: 'Background Remover – Remove Solid Backgrounds, Transparent PNG',
    metaDescription:
      'Remove white or solid-colour backgrounds from images online and download a transparent PNG. Runs in your browser — your photos are never uploaded.',
    keywords: [
      'background remover',
      'remove background',
      'transparent png',
      'remove white background',
      'make background transparent',
    ],
    relatedTools: [
      'image-converter',
      'image-cropper',
      'image-resizer',
      'color-picker',
    ],
    component: 'background-remover',
    handlesFiles: true,
    limitation:
      'This tool removes plain and solid-colour backgrounds (product shots, logos, scans, screenshots). Cutting a person out of a busy photo needs an AI segmentation model of 40+ MB, which we do not load to keep the page fast and private.',
    howTo: [
      'Choose an image with a plain background.',
      'Click the background in the preview to pick its colour (the border colour is detected automatically).',
      'Adjust tolerance and edge softness until the background disappears, then download the transparent PNG.',
    ],
    about: [
      'The remover compares every pixel with the background colour. In “connected area” mode it only removes background pixels connected to the edges of the image, so similar colours inside the subject stay intact. In “all matching pixels” mode it removes that colour everywhere, which is useful for logos with holes.',
    ],
    faqs: [
      {
        q: 'Which images work best?',
        a: 'Product photos on white, logos, signatures, scanned drawings and screenshots — anything with a fairly even background colour.',
      },
      {
        q: 'Why is the output a PNG?',
        a: 'JPG does not support transparency. PNG and WebP do; PNG is the most widely supported.',
      },
    ],
  },
  {
    slug: 'image-exif-viewer',
    category: 'image-tools',
    name: 'EXIF Viewer',
    icon: '🔎',
    shortDescription:
      'View and remove photo metadata like GPS and camera info.',
    description:
      'See the hidden EXIF metadata in a photo — camera model, lens, exposure, date taken and GPS location — and download a clean copy without metadata. The file is read locally and never uploaded.',
    title: 'EXIF Viewer – View & Remove Photo Metadata Online',
    metaDescription:
      'View EXIF data online: camera, lens, settings, date and GPS location. Remove metadata before sharing photos. Runs in your browser — no upload.',
    keywords: [
      'exif viewer',
      'exif data',
      'photo metadata',
      'remove exif',
      'gps location photo',
    ],
    relatedTools: [
      'image-compressor',
      'image-converter',
      'pdf-metadata-viewer',
      'image-resizer',
    ],
    component: 'exif-viewer',
    handlesFiles: true,
    howTo: [
      'Choose a JPG, HEIC, PNG, WebP or TIFF photo.',
      'Review the metadata grouped by camera, settings, date and location.',
      'Click “Download without metadata” to get a clean copy.',
    ],
    about: [
      'EXIF (Exchangeable Image File Format) metadata is stored inside photos by cameras and phones. It often includes the exact GPS coordinates where a photo was taken, which can reveal your home address when you share pictures online.',
      'Removing metadata here re-encodes the image through your browser, which keeps the picture but drops all EXIF, XMP and GPS fields.',
    ],
    faqs: [
      {
        q: 'Do social networks remove EXIF data?',
        a: 'Most large platforms strip it on upload, but email attachments, cloud links, forums and messaging apps that send “original quality” files often keep it.',
      },
      {
        q: 'Why does my image show no EXIF data?',
        a: 'Screenshots, edited images and files downloaded from social media usually have their metadata removed already.',
      },
    ],
  },
  {
    slug: 'image-to-base64',
    category: 'image-tools',
    name: 'Image to Base64',
    icon: '🔡',
    shortDescription: 'Encode an image as a Base64 data URI.',
    description:
      'Convert an image to a Base64 string or data URI that you can embed directly in HTML, CSS or JSON. Ready-to-copy snippets are generated for img tags and CSS backgrounds.',
    title: 'Image to Base64 Converter – Data URI for HTML & CSS',
    metaDescription:
      'Convert images to Base64 online. Get a data URI plus ready-made HTML img and CSS background snippets. Runs locally — your image is never uploaded.',
    keywords: [
      'image to base64',
      'base64 image',
      'data uri',
      'png to base64',
      'base64 encoder image',
    ],
    relatedTools: [
      'base64-to-image',
      'base64-encoder',
      'image-compressor',
      'svg-to-png',
    ],
    component: 'image-to-base64',
    handlesFiles: true,
    howTo: [
      'Choose an image.',
      'Copy the Base64 string, the full data URI, or a ready-made HTML/CSS snippet.',
    ],
    about: [
      'Base64 encodes binary data as text. A data URI (data:image/png;base64,…) lets you embed small images directly in code, saving an HTTP request. Base64 is about 33% larger than the original file, so it is best for small icons and images.',
    ],
    faqs: [
      {
        q: 'Should I inline large images as Base64?',
        a: 'Usually not. Inlining makes HTML and CSS larger and prevents the browser from caching the image separately. Use it for small icons (a few KB).',
      },
    ],
  },
  {
    slug: 'base64-to-image',
    category: 'image-tools',
    name: 'Base64 to Image',
    icon: '🖼️',
    shortDescription: 'Decode a Base64 string back into an image.',
    description:
      'Paste a Base64 string or data URI to preview the image it contains and download it as a file. The format is detected automatically.',
    title: 'Base64 to Image Converter – Decode & Download Online',
    metaDescription:
      'Decode Base64 to an image online. Paste a Base64 string or data URI, preview the PNG, JPG, GIF, WebP or SVG, and download it. Runs in your browser.',
    keywords: [
      'base64 to image',
      'decode base64 image',
      'data uri to image',
      'base64 to png',
      'base64 to jpg',
    ],
    relatedTools: ['image-to-base64', 'base64-decoder', 'image-converter'],
    component: 'base64-to-image',
    howTo: [
      'Paste the Base64 text or data URI.',
      'Check the preview and detected format.',
      'Download the image.',
    ],
    about: [
      'The tool reads the first bytes of the decoded data to detect PNG, JPG, GIF, WebP, BMP, ICO or SVG, so it works even when the data URI prefix is missing.',
    ],
    faqs: [
      {
        q: 'Why does it say the data is not an image?',
        a: 'The decoded bytes do not match any known image signature. Check that the string is complete and was not cut off when copying.',
      },
    ],
  },
  {
    slug: 'svg-to-png',
    category: 'image-tools',
    name: 'SVG to PNG',
    icon: '✒️',
    shortDescription: 'Convert SVG vector graphics to PNG at any size.',
    description:
      'Convert SVG files to PNG at the exact width you need — from small icons to high-resolution exports. Transparency is preserved, and conversion happens in your browser.',
    title: 'SVG to PNG Converter – Export SVG at Any Size Online',
    metaDescription:
      'Convert SVG to PNG online at any resolution with transparency preserved. Batch convert vector files in your browser — free, fast and private.',
    keywords: [
      'svg to png',
      'convert svg',
      'svg converter',
      'svg to image',
      'export svg png',
    ],
    relatedTools: [
      'image-converter',
      'image-resizer',
      'image-to-base64',
      'image-compressor',
    ],
    component: 'image-converter',
    config: { from: 'svg', to: 'png', svgWidth: true },
    handlesFiles: true,
    howTo: [
      'Add one or more SVG files.',
      'Set the output width in pixels — height follows the SVG’s proportions.',
      'Convert and download the PNGs.',
    ],
    about: [
      'SVG is a vector format, so it can be rendered at any size without losing sharpness. PNG is a raster format accepted almost everywhere. Choose a width two or three times larger than the display size for crisp results on high-density screens.',
    ],
    faqs: [
      {
        q: 'Why are some fonts or images missing in the PNG?',
        a: 'For security, browsers do not load external fonts or images referenced by an SVG when rasterizing it. Convert text to outlines or embed images in the SVG first.',
      },
    ],
  },
];
