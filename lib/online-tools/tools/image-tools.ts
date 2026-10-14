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
  {
    from: 'avif',
    to: 'jpg',
    why: 'AVIF is a modern, very efficient format, but many apps, email clients and older devices still can’t open it. JPG opens everywhere.',
    keywords: [
      'avif to jpg',
      'avif to jpeg',
      'convert avif to jpg',
      'open avif file',
    ],
  },
  {
    from: 'gif',
    to: 'png',
    why: 'PNG keeps the sharp edges and flat colours of GIF graphics without the 256-colour limit, and supports smooth transparency. Animated GIFs are converted from their first frame.',
    keywords: ['gif to png', 'convert gif to png', 'gif to png transparent'],
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
      'svg-optimizer',
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

  {
    slug: 'heic-to-jpg',
    category: 'image-tools',
    name: 'HEIC to JPG',
    icon: '📱',
    shortDescription: 'Convert iPhone HEIC photos to JPG, PNG or WebP.',
    description:
      'Convert HEIC and HEIF photos from iPhones and iPads to JPG, PNG or WebP so they open on Windows, Android and any website. Batch convert as many photos as you like — they are converted in your browser and never uploaded.',
    title: 'HEIC to JPG Converter – Convert iPhone Photos Online, No Upload',
    metaDescription:
      'Convert HEIC to JPG or PNG online for free. Batch convert iPhone photos in your browser — your pictures are never uploaded to a server.',
    keywords: [
      'heic to jpg',
      'heic converter',
      'convert heic to jpg',
      'iphone photo to jpg',
      'heif to jpg',
    ],
    relatedTools: [
      'image-converter',
      'image-compressor',
      'image-exif-viewer',
      'image-resizer',
      'compress-image-to-size',
    ],
    component: 'heic-to-jpg',
    handlesFiles: true,
    popular: true,
    howTo: [
      'Drop your .heic or .heif photos into the box (or click to choose them).',
      'Pick JPG, PNG or WebP and, for JPG and WebP, the quality.',
      'Click Convert and download each photo, or all at once.',
    ],
    about: [
      'HEIC (High Efficiency Image Container) is the default photo format on iPhones since iOS 11. It stores photos at roughly half the size of JPG, but Windows, many Android apps and lots of websites still cannot open it.',
      'Safari can decode HEIC natively; in other browsers this tool loads a small HEIC decoder on demand. Either way the decoding happens on your device. Converting to JPG re-encodes the photo; choose 90%+ quality to keep it visually identical.',
    ],
    faqs: [
      {
        q: 'Why can’t I open HEIC files on Windows?',
        a: 'Windows needs an extra codec from the Microsoft Store to read HEIC. Converting to JPG avoids the codec entirely and works in every app.',
      },
      {
        q: 'Does converting HEIC to JPG keep the photo location data?',
        a: 'No. The browser re-encodes the pixels, so EXIF metadata such as GPS location is not copied into the JPG — handy before sharing.',
      },
      {
        q: 'Can I stop my iPhone from saving HEIC?',
        a: 'Yes: Settings → Camera → Formats → “Most Compatible” makes the camera save JPG instead.',
      },
    ],
  },
  {
    slug: 'image-to-text',
    category: 'image-tools',
    name: 'Image to Text (OCR)',
    icon: '🔤',
    shortDescription: 'Extract text from images and screenshots.',
    description:
      'Extract text from photos, screenshots and scanned documents with OCR (optical character recognition). Recognition runs in your browser: the OCR engine is downloaded once, and your image is never uploaded.',
    title: 'Image to Text Converter (OCR) – Extract Text From Images Free',
    metaDescription:
      'Extract text from images, screenshots and scans with free online OCR. Supports 10+ languages and runs in your browser — your image is never uploaded.',
    keywords: [
      'image to text',
      'ocr online',
      'extract text from image',
      'picture to text',
      'screenshot to text',
    ],
    relatedTools: [
      'pdf-to-text',
      'word-counter',
      'find-and-replace',
      'image-cropper',
      'heic-to-jpg',
    ],
    component: 'image-to-text',
    handlesFiles: true,
    popular: true,
    limitation:
      'The first run downloads the open-source Tesseract OCR engine and the selected language model (about 5–15 MB) from a public CDN; your image itself stays on your device. Handwriting and very stylised fonts are recognised poorly.',
    howTo: [
      'Choose an image, screenshot or photo of a document (or paste one with Ctrl/⌘ + V).',
      'Select the language of the text.',
      'Click “Extract text”, then copy or download the result.',
    ],
    about: [
      'OCR turns the pixels of letters into editable text. This tool uses Tesseract, a widely used open-source OCR engine, compiled to WebAssembly so it runs in the browser.',
      'Accuracy depends mostly on the image: sharp, well-lit, straight text at 300 DPI or higher gives the best results. Crop the image to the text area and increase contrast for difficult photos.',
    ],
    faqs: [
      {
        q: 'Which languages are supported?',
        a: 'English, German, French, Spanish, Italian, Portuguese, Dutch, Turkish, Persian, Arabic, Russian, Chinese (simplified), Japanese and Hindi. Each language model is downloaded the first time you use it.',
      },
      {
        q: 'Can it read handwriting?',
        a: 'Only neat block capitals. Tesseract is designed for printed text, so cursive handwriting is usually not recognised.',
      },
    ],
  },
  {
    slug: 'compress-image-to-size',
    category: 'image-tools',
    name: 'Compress Image to Exact Size',
    icon: '🎯',
    shortDescription: 'Shrink a photo to 20 KB, 50 KB, 100 KB or any size.',
    description:
      'Compress an image to an exact file size such as 20 KB, 50 KB or 100 KB — the limit many application forms, exam portals and ID uploads require. The tool finds the best quality that fits under your limit, entirely in your browser.',
    title: 'Compress Image to 20KB, 50KB, 100KB – Exact Size Compressor',
    metaDescription:
      'Compress JPG or PNG images to an exact size like 20 KB, 50 KB or 100 KB for online forms. Best quality under your limit, processed in your browser.',
    keywords: [
      'compress image to 20kb',
      'compress image to 50kb',
      'compress jpeg to 100kb',
      'reduce image size in kb',
      'resize image to kb',
    ],
    relatedTools: [
      'image-compressor',
      'image-resizer',
      'image-cropper',
      'heic-to-jpg',
      'image-converter',
    ],
    component: 'compress-to-size',
    config: { target: 50 },
    handlesFiles: true,
    popular: true,
    howTo: [
      'Choose a photo, signature or document scan.',
      'Pick a preset (20, 30, 50, 100, 200 or 500 KB) or type your own limit.',
      'Click Compress — the result is guaranteed to be at or below the limit — and download it.',
    ],
    about: [
      'Government, university and job portals often reject uploads above a fixed size. This tool searches for the highest JPG quality that fits under your limit and, only if that is not enough, reduces the dimensions step by step.',
      'Sizes use 1 KB = 1,024 bytes, the definition most upload forms use. The output is a JPG (or WebP if you choose it), and photo metadata is removed whenever the image is re-encoded. A JPG or WebP that is already under the limit is returned unchanged.',
    ],
    faqs: [
      {
        q: 'Why is my 20 KB photo so small in pixels?',
        a: 'A 20 KB limit is very tight. When the lowest acceptable quality still does not fit, the tool reduces the width and height until it does. Crop to the face or document first to keep more detail.',
      },
      {
        q: 'Will the result be exactly 20 KB?',
        a: 'It will be at or just below the limit — never above — because forms reject files that are even one byte too large.',
      },
    ],
    variants: [20, 50, 100, 200].map((kb) => ({
      slug: `compress-image-to-${kb}kb`,
      name: `Compress Image to ${kb}KB`,
      title: `Compress Image to ${kb}KB Online – JPG Under ${kb} KB, Free`,
      metaDescription: `Compress any JPG, PNG or WebP photo to under ${kb} KB for online forms and uploads. Best possible quality, processed privately in your browser.`,
      description: `Reduce a photo to ${kb} KB or less in one click. Upload forms for ${kb <= 50 ? 'passport photos, signatures and exam applications' : 'job portals, visas and email attachments'} often set a ${kb} KB limit; this tool finds the best quality that fits — without uploading your image anywhere.`,
      config: { target: kb },
      keywords: [
        `compress image to ${kb}kb`,
        `reduce image size to ${kb}kb`,
        `jpg to ${kb}kb`,
      ],
    })),
  },
  {
    slug: 'meme-generator',
    category: 'image-tools',
    name: 'Meme Generator',
    icon: '😂',
    shortDescription: 'Add classic meme captions to any image.',
    description:
      'Make a meme from your own image: add bold top and bottom captions in the classic outlined style, drag them anywhere, and download a PNG. No watermark, no sign-up, and your image never leaves your device.',
    title: 'Meme Generator – Add Text to Images, No Watermark',
    metaDescription:
      'Create memes online from your own images. Add classic top and bottom text, drag captions anywhere, and download without a watermark. Free and private.',
    keywords: [
      'meme generator',
      'meme maker',
      'add text to image',
      'make a meme',
      'caption image',
    ],
    relatedTools: [
      'image-cropper',
      'image-resizer',
      'image-converter',
      'fancy-text-generator',
      'image-compressor',
    ],
    component: 'meme-generator',
    handlesFiles: true,
    popular: true,
    howTo: [
      'Upload an image (or paste one with Ctrl/⌘ + V).',
      'Type the top and bottom text; add extra captions if you need them and drag them into place.',
      'Adjust font size, colour and outline, then download the PNG.',
    ],
    about: [
      'The classic meme style is white Impact-style capitals with a black outline, so the text stays readable on any background. You can change the colour and size of every caption and drag it anywhere; the ALL CAPS and outline switches apply to all captions.',
      'Use images you have the rights to share. The generator does not include copyrighted meme templates — upload your own photo, screenshot or a template you are allowed to use.',
    ],
    faqs: [
      {
        q: 'Does the meme have a watermark?',
        a: 'No. The downloaded PNG contains only your image and your captions.',
      },
      {
        q: 'What image size should I use?',
        a: 'Anything from 500 to 1,500 pixels wide works well for social media. Larger images are scaled down to 2,000 pixels on the longest side.',
      },
    ],
  },
  {
    slug: 'passport-photo-maker',
    category: 'image-tools',
    name: 'Passport Photo Maker',
    icon: '🛂',
    shortDescription: 'Crop a photo to passport and visa size, ready to print.',
    description:
      'Turn any portrait into a correctly sized passport or visa photo — 2 × 2 inches for the US, 35 × 45 mm for the UK, EU and Schengen, plus Canada, India, China, Australia and Japan. Line the face up with the head guide, then download the photo at 300 DPI or a print-ready 4 × 6 in, A4 or US Letter sheet. Your photo never leaves your device.',
    title: 'Passport Photo Maker – 2x2 & 35x45 mm, Print Sheet, Free',
    metaDescription:
      'Make passport and visa photos online: US 2x2 inch, UK/EU 35x45 mm and more. Head-size guide, 300 DPI, printable 4x6 or A4 sheet. Free and private.',
    keywords: [
      'passport photo maker',
      'passport size photo',
      '2x2 photo',
      '35x45 mm photo',
      'visa photo maker',
      'passport photo online',
    ],
    relatedTools: [
      'compress-image-to-size',
      'image-cropper',
      'profile-picture-maker',
      'image-background-remover',
      'image-resizer',
    ],
    component: 'passport-photo',
    handlesFiles: true,
    popular: true,
    howTo: [
      'Choose the country and document — or enter a custom size in millimetres.',
      'Upload a front-facing photo taken against a plain, light background.',
      'Drag and zoom until the face fills the dashed oval: chin at the bottom, top of the head at the top.',
      'Download the single photo for online applications, or a print sheet to print at 100 % on 4 × 6 in, A4 or US Letter paper.',
    ],
    about: [
      'Passport photos are judged on exact size and on how much of the frame the head fills. A US photo is 2 × 2 inches (600 × 600 px at 300 DPI) with the head 1 to 1⅜ inches tall; UK, EU and Schengen photos are 35 × 45 mm with the head roughly 29–36 mm from chin to crown, depending on the country.',
      'The tool crops and scales your photo to the chosen size at 300 DPI and draws a head-size guide to help you frame it. It does not edit the background, remove shadows or check expression and glasses rules — follow your government’s current photo requirements for those.',
      'For online applications that also limit the file size, run the result through the Compress Image to Exact Size tool.',
    ],
    faqs: [
      {
        q: 'What size is a passport photo?',
        a: 'It depends on the country: 2 × 2 in (51 × 51 mm) for US passports and visas, 35 × 45 mm for the UK, the EU/Schengen area, India, Australia and Japan, 50 × 70 mm for Canada and 33 × 48 mm for China.',
      },
      {
        q: 'How do I print passport photos at home or in a shop?',
        a: 'Download the print sheet (4 × 6 in, A4 or US Letter) and print it at 100 % / “actual size” — not “fit to page”, which changes the size. Most photo kiosks print 4 × 6 in sheets cheaply.',
      },
      {
        q: 'Can the tool make the background white?',
        a: 'No. Take the photo against a plain white or light-grey wall. A plain-coloured background can sometimes be cleaned up with the Background Remover first.',
      },
    ],
  },
  {
    slug: 'profile-picture-maker',
    category: 'image-tools',
    name: 'Profile Picture Maker',
    icon: '👤',
    shortDescription:
      'Circle-crop a photo and add a border for social profiles.',
    description:
      'Create a round profile picture with a coloured or gradient ring in seconds. Drag and zoom your photo inside the circle, pick a border and background, and download a crisp PNG (or a JPG on a solid colour) for LinkedIn, Instagram, X, Discord, Slack or WhatsApp — processed entirely in your browser.',
    title: 'Profile Picture Maker – Circle Crop & Border, PNG, Free',
    metaDescription:
      'Make a profile picture online: crop your photo into a circle, add a solid or gradient border and transparent background. Download PNG. Free, no upload.',
    keywords: [
      'profile picture maker',
      'circle crop image',
      'pfp maker',
      'round profile picture',
      'add border to profile picture',
    ],
    relatedTools: [
      'image-cropper',
      'social-media-image-resizer',
      'passport-photo-maker',
      'image-background-remover',
      'favicon-generator',
    ],
    component: 'profile-picture',
    handlesFiles: true,
    popular: true,
    howTo: [
      'Upload a clear photo of your face.',
      'Drag and zoom to centre your face in the circle.',
      'Choose a circle, rounded square or square, then a border and background.',
      'Download the PNG at 400, 800 or 1024 pixels.',
    ],
    about: [
      'Social networks display profile pictures as small circles, so a tight crop with your face filling about two thirds of the frame reads best. The small preview shows how the picture looks at the size people will actually see.',
      'A transparent PNG keeps the corners outside the circle invisible on any background. Turn transparency off to get a JPG with a solid background colour instead.',
    ],
    faqs: [
      {
        q: 'What size should a profile picture be?',
        a: 'Upload at least 400 × 400 px; 800 × 800 px is a safe choice for every major platform, which then scales it down for display.',
      },
      {
        q: 'Will the platform crop my picture again?',
        a: 'Most platforms crop to a circle themselves, so the area outside the circle is hidden anyway. Keeping your face centred makes sure nothing important is cut off.',
      },
    ],
  },
  {
    slug: 'add-text-to-image',
    category: 'image-tools',
    name: 'Add Text to Image',
    icon: '🔤',
    shortDescription:
      'Write text on a photo with any font, colour and position.',
    description:
      'Add text to a photo online: type your words, choose the font, colour, size and position, and add an outline (or keep the soft shadow) so they stay readable. Rotate the text, make it semi-transparent or repeat it across the image, then download the result — no app, no account and no upload.',
    title: 'Add Text to Image Online – Fonts, Colours & Outline, Free',
    metaDescription:
      'Add text to photos online for free. Choose font, size, colour, position, outline and rotation, then download. Works on JPG, PNG and WebP — no upload.',
    keywords: [
      'add text to image',
      'add text to photo',
      'write on picture',
      'put text on image',
      'text on photo online',
    ],
    relatedTools: [
      'watermark-image',
      'meme-generator',
      'fancy-text-generator',
      'image-resizer',
      'image-compressor',
    ],
    component: 'image-watermark',
    config: { mode: 'text' },
    handlesFiles: true,
    howTo: [
      'Upload an image (or several to add the same text to each).',
      'Type your text — use a new line for a second line.',
      'Pick a font, colour, size and one of nine positions; add an outline for busy photos.',
      'Download the image — PNG and WebP keep their format; other files are saved as high-quality JPG.',
    ],
    about: [
      'Text is drawn onto the image pixels, so it shows up the same everywhere the picture is shared. Size is set as a percentage of the image width, which keeps it proportional on large and small photos alike.',
      'An outline or soft shadow keeps light text readable on bright backgrounds. For bold top-and-bottom captions in the classic meme style, use the Meme Generator.',
    ],
    faqs: [
      {
        q: 'Which fonts can I use?',
        a: 'Sans-serif, serif, monospace, Impact and a handwriting style, using the fonts installed on your device — so the exact look can differ slightly between computers and phones.',
      },
      {
        q: 'Does adding text reduce image quality?',
        a: 'PNG files stay lossless. JPG and WebP files are saved again at high quality (92 %), which is visually indistinguishable for photos.',
      },
    ],
  },
  {
    slug: 'watermark-image',
    category: 'image-tools',
    name: 'Watermark Image',
    icon: '©️',
    shortDescription: 'Add a text or logo watermark to many photos at once.',
    description:
      'Protect your photos with a watermark: add your name, © notice or logo, set the opacity and position — or tile it diagonally across the whole image — and apply it to up to 50 photos in one go. Everything happens in your browser, so your originals are never uploaded.',
    title: 'Watermark Photos Online – Text or Logo, Batch, Free',
    metaDescription:
      'Add a watermark to photos online: text or logo, opacity, position or tiled pattern. Batch-watermark up to 50 images and download a ZIP. Free, no upload.',
    keywords: [
      'watermark image',
      'add watermark to photo',
      'watermark photos online',
      'logo watermark',
      'batch watermark',
    ],
    relatedTools: [
      'add-text-to-image',
      'watermark-pdf',
      'image-compressor',
      'image-resizer',
      'blur-image',
    ],
    component: 'image-watermark',
    config: { mode: 'watermark' },
    handlesFiles: true,
    popular: true,
    howTo: [
      'Upload one photo or a whole batch.',
      'Choose a text watermark or upload your logo (a PNG with transparency works best).',
      'Set size, opacity and position — or switch on “tiled” to cover the whole image.',
      'Download one image, or all of them as a ZIP.',
    ],
    about: [
      'A corner watermark credits your work without distracting from it; a tiled, semi-transparent watermark makes it much harder to crop out and reuse a preview. Around 30–50 % opacity is a common balance between visibility and the photo itself.',
      'No watermark is impossible to remove — determined editors can paint over it — but a visible mark discourages casual copying and keeps your name attached when images are shared.',
    ],
    faqs: [
      {
        q: 'Can I watermark many photos at once?',
        a: 'Yes. Add up to 50 images; the same watermark settings are applied to every one and you download them together as a ZIP.',
      },
      {
        q: 'Where should a watermark go?',
        a: 'A bottom corner is the least intrusive. For previews you sell or send for approval, a tiled diagonal watermark across the whole image protects best.',
      },
    ],
  },
  {
    slug: 'blur-image',
    category: 'image-tools',
    name: 'Blur & Pixelate Image',
    icon: '🫥',
    shortDescription:
      'Hide faces, number plates and private details in a photo.',
    description:
      'Blur or pixelate parts of an image to hide faces, licence plates, addresses or account numbers before you share it. Drag boxes over the areas to hide, choose blur, pixelate or a solid box in any colour, and download — the original pixels are replaced, and the photo never leaves your device.',
    title: 'Blur & Pixelate Image Online – Hide Faces & Plates, Free',
    metaDescription:
      'Blur faces, pixelate licence plates or black out private info in photos and screenshots. Drag boxes, choose the effect, download. Free, no upload.',
    keywords: [
      'blur image',
      'pixelate image',
      'blur face in photo',
      'censor image',
      'blur license plate',
      'redact screenshot',
    ],
    relatedTools: [
      'image-exif-viewer',
      'watermark-image',
      'image-cropper',
      'add-text-to-image',
      'image-compressor',
    ],
    component: 'blur-image',
    handlesFiles: true,
    popular: true,
    howTo: [
      'Upload a photo or screenshot.',
      'Drag a box over each face, plate or detail you want to hide.',
      'Choose pixelate, blur or a solid box and adjust the strength.',
      'Download the image — the hidden areas are permanently replaced.',
    ],
    about: [
      'The effect is baked into the exported pixels, so the hidden detail cannot be recovered from the file you share. A solid box is the safest choice for text such as card or account numbers, because weak blurs on short text can sometimes be guessed.',
      'The exported image is re-encoded in your browser, so camera and GPS metadata from the original is dropped as well. To check what an original photo reveals, open it in the EXIF Viewer.',
    ],
    faqs: [
      {
        q: 'Can a blurred or pixelated area be un-blurred?',
        a: 'Not from this file — the original pixels are replaced. Very light pixelation of short text (like a few digits) can occasionally be guessed, so use strong settings or a solid box for sensitive text.',
      },
      {
        q: 'Does it detect faces automatically?',
        a: 'No. You choose exactly what to hide by dragging boxes, which also avoids missed faces from imperfect automatic detection.',
      },
    ],
  },
  {
    slug: 'photo-collage-maker',
    category: 'image-tools',
    name: 'Photo Collage Maker',
    icon: '🧩',
    shortDescription: 'Combine 2–9 photos into one image with grid layouts.',
    description:
      'Make a photo collage online from 2 to 9 pictures. Choose a grid or a layout with one large photo, pick a square, Instagram portrait, story or landscape shape, adjust spacing and rounded corners, and drag each photo into position. Download a high-resolution JPG — no watermark, no sign-up, no upload.',
    title: 'Photo Collage Maker – Grid Layouts, No Watermark, Free',
    metaDescription:
      'Create a photo collage online from 2–9 photos. Grid and featured layouts, square, 4:5, 9:16 or 16:9, spacing and rounded corners. Free, no watermark.',
    keywords: [
      'photo collage maker',
      'collage maker',
      'picture grid',
      'combine photos',
      'photo grid maker',
    ],
    relatedTools: [
      'image-grid-splitter',
      'social-media-image-resizer',
      'gif-maker',
      'image-compressor',
      'add-text-to-image',
    ],
    component: 'photo-collage',
    handlesFiles: true,
    popular: true,
    howTo: [
      'Upload 2–9 photos.',
      'Pick a layout and the collage shape (square, 4:5, 9:16, 16:9 or 3:2).',
      'Click a cell to choose its photo; drag inside it to reposition and use zoom to crop closer.',
      'Set spacing, rounded corners and background colour, then download.',
    ],
    about: [
      'Each photo fills its cell and is cropped to fit, so you decide which part stays visible by dragging. Layouts with one large cell work well to feature a main photo with supporting shots.',
      'Choose 4:5 for Instagram feed posts, 9:16 for stories and 16:9 for presentations or YouTube. Export at 4096 px for printing.',
    ],
    faqs: [
      {
        q: 'Does the collage have a watermark?',
        a: 'No. The downloaded image contains only your photos and the background colour you choose.',
      },
      {
        q: 'How many photos can I use?',
        a: 'Up to 9. Layouts are available for 2, 3, 4, 5, 6 and 9 photos.',
      },
    ],
  },
  {
    slug: 'image-grid-splitter',
    category: 'image-tools',
    name: 'Image Grid Splitter',
    icon: '🔲',
    shortDescription:
      'Split an image into 3, 6, 9 or 12 tiles for an Instagram grid.',
    description:
      'Split a photo into a 1×3, 2×3, 3×3, 4×3, 1×2 or custom grid of tiles for an Instagram profile puzzle feed or a carousel. Keep the full image or cut square or portrait tiles from its centre, see the posting order on each tile, and download all pieces as a ZIP — in full quality, without uploading the image.',
    title: 'Image Grid Splitter – Instagram Grid 3x3, 3x1, Free',
    metaDescription:
      'Split an image into a 3x3, 2x3 or 1x3 grid for Instagram. Square or portrait tiles, posting order numbers and ZIP download. Free, private, no upload.',
    keywords: [
      'image splitter',
      'instagram grid maker',
      'split image into grid',
      'image grid splitter',
      'split photo for instagram',
    ],
    relatedTools: [
      'photo-collage-maker',
      'social-media-image-resizer',
      'image-cropper',
      'image-resizer',
      'image-compressor',
    ],
    component: 'grid-splitter',
    handlesFiles: true,
    howTo: [
      'Upload an image.',
      'Choose a grid (3, 6, 9 or 12 tiles, or custom rows and columns) and a tile shape.',
      'Click “Split image” and check the numbered tiles.',
      'Post them starting with tile 1 (bottom right) — or download all as a ZIP.',
    ],
    about: [
      'Instagram shows the newest post first, at the top left of your profile. To make the pieces line up, post the bottom-right tile first and the top-left tile last; the numbers on each tile show that order.',
      'Square tiles give the classic grid look. Instagram’s profile grid now shows posts as 3:4 previews, so choose 3:4 tiles if you want the puzzle to line up exactly on the profile page.',
    ],
    faqs: [
      {
        q: 'In what order should I post the tiles?',
        a: 'Post tile 1 first and the highest number last. Tile 1 is the bottom-right piece; the last one is the top-left piece, which ends up at the top of your profile.',
      },
      {
        q: 'Does splitting reduce quality?',
        a: 'No resizing happens — each tile is cut from the original pixels. PNG, WebP and GIF uploads are saved as lossless PNG tiles (keeping transparency); other photos as JPG at 95 % quality.',
      },
    ],
  },
  {
    slug: 'gif-maker',
    category: 'image-tools',
    name: 'GIF Maker',
    icon: '🎞️',
    shortDescription: 'Turn a set of images into an animated GIF.',
    description:
      'Make an animated GIF from photos, screenshots or drawings. Add images, put them in order, set how long each frame shows and the width, choose looping, and download the GIF — created in your browser without uploading anything and without a watermark.',
    title: 'GIF Maker – Make a GIF From Images Online, Free',
    metaDescription:
      'Create animated GIFs from JPG, PNG or WebP images. Reorder frames, set the speed and size, loop forever. Free online GIF maker — no upload, no watermark.',
    keywords: [
      'gif maker',
      'images to gif',
      'make a gif',
      'animated gif maker',
      'photo to gif',
    ],
    relatedTools: [
      'video-to-gif',
      'photo-collage-maker',
      'image-resizer',
      'image-compressor',
      'image-converter',
    ],
    component: 'gif-maker',
    handlesFiles: true,
    howTo: [
      'Add two or more images — each becomes one frame.',
      'Use the arrows to put the frames in order.',
      'Set the time per frame, the width and how different-sized images are fitted.',
      'Click “Create GIF”, preview it and download.',
    ],
    about: [
      'GIFs are limited to 256 colours per frame, so they suit graphics, screenshots and short slideshows better than detailed photos. Smaller widths and fewer frames keep the file light enough for chats and email.',
      'The first image sets the GIF’s proportions. Others are fitted inside it with coloured bars, or cropped to fill the frame if you prefer. GIFs made here are opaque: transparent areas are filled with the bar colour. To turn a video clip into a GIF, use Video to GIF.',
    ],
    faqs: [
      {
        q: 'How many images can a GIF have?',
        a: 'Up to 200 frames here. For smooth animation use 50–100 ms per frame; for a slideshow, 0.5–2 seconds per frame.',
      },
      {
        q: 'Why does my GIF look grainy?',
        a: 'GIF can store only 256 colours per frame, so photos with smooth gradients show banding. Lower the width or use simpler images for the cleanest result.',
      },
    ],
  },
  {
    slug: 'favicon-generator',
    category: 'image-tools',
    name: 'Favicon Generator',
    icon: '⭐',
    shortDescription: 'Create favicon.ico and app icons from any image.',
    description:
      'Generate a complete favicon set from your logo or any image: a multi-size favicon.ico (16, 32 and 48 px), PNG favicons, an Apple touch icon, Android icons and a web app manifest — plus the HTML to paste into your site’s <head>. Downloaded as one ZIP, made entirely in your browser.',
    title: 'Favicon Generator – ICO, PNG & Apple Touch Icon, Free',
    metaDescription:
      'Create a favicon from any image: favicon.ico (16/32/48), PNG icons, apple-touch-icon, Android icons, site.webmanifest and HTML code. Free ZIP, no upload.',
    keywords: [
      'favicon generator',
      'favicon.ico',
      'png to ico',
      'apple touch icon',
      'create favicon',
    ],
    relatedTools: [
      'image-converter',
      'svg-to-png',
      'image-resizer',
      'profile-picture-maker',
      'image-to-base64',
    ],
    component: 'favicon-generator',
    handlesFiles: true,
    popular: true,
    howTo: [
      'Upload your logo (square, 512 px or larger, or an SVG).',
      'Adjust padding, background and rounded corners while watching the 16 px preview.',
      'Download the favicon package (ZIP) and copy the files to your site’s root folder.',
      'Paste the provided HTML into your page’s <head>.',
    ],
    about: [
      'Browsers still look for /favicon.ico, and the ICO format can hold several sizes in one file — this one contains 16, 32 and 48 px versions. Phones use the 180 px Apple touch icon and the 192 and 512 px Android icons referenced in site.webmanifest.',
      'Fine detail disappears at 16 × 16 pixels, so simple logos, a single letter or a bold symbol work best. Check the 16 px preview before you download.',
    ],
    faqs: [
      {
        q: 'Which favicon sizes do I need?',
        a: 'favicon.ico (with 16, 32 and 48 px inside), a 180 × 180 apple-touch-icon.png and 192 and 512 px PNGs for Android and installed web apps. The package includes all of them.',
      },
      {
        q: 'Why is the Apple icon not transparent?',
        a: 'iOS fills transparent areas of touch icons with black, so the Apple icon always uses your background colour.',
      },
    ],
  },
  {
    slug: 'social-media-image-resizer',
    category: 'image-tools',
    name: 'Social Media Image Resizer',
    icon: '📱',
    shortDescription:
      'Resize images for Instagram, Facebook, X, LinkedIn and YouTube.',
    description:
      'Resize a photo to the exact size each social network expects — Instagram posts and stories, Facebook covers, X headers, LinkedIn banners, YouTube thumbnails, Pinterest pins and TikTok. Crop and position the image, or fit it whole on a blurred or solid background, and export one size or every size as a ZIP.',
    title: 'Social Media Image Resizer – All Sizes 2026, Free',
    metaDescription:
      'Resize images for Instagram, Facebook, X, LinkedIn, YouTube, Pinterest and TikTok. Exact 2026 sizes, crop or fit with blurred background. Free, no upload.',
    keywords: [
      'social media image resizer',
      'resize image for instagram',
      'social media image sizes',
      'facebook cover size',
      'youtube thumbnail size',
    ],
    relatedTools: [
      'image-resizer',
      'image-cropper',
      'image-grid-splitter',
      'profile-picture-maker',
      'image-compressor',
    ],
    component: 'social-resizer',
    handlesFiles: true,
    popular: true,
    howTo: [
      'Choose the platform and the size (post, story, cover, banner, thumbnail…).',
      'Upload your image.',
      'Drag to choose the visible area — or fit the whole image on a blurred or solid background.',
      'Download that size, or all sizes for the platform as a ZIP.',
    ],
    about: [
      'Every network crops images that do not match its expected shape, often cutting off faces or text. Resizing to the exact pixel size first means you decide what stays visible.',
      'The fit modes keep the entire picture, adding a blurred copy of it or a solid colour around the edges — useful for wide photos in vertical stories.',
    ],
    faqs: [
      {
        q: 'What is the best image size for Instagram?',
        a: '1080 × 1350 px (4:5 portrait) takes the most space in the feed. Square posts are 1080 × 1080 px and stories and Reels 1080 × 1920 px.',
      },
      {
        q: 'Will the network compress my image anyway?',
        a: 'Yes, all platforms recompress uploads. Uploading at the exact recommended size avoids an extra resize and usually keeps images sharper.',
      },
    ],
    variants: [
      {
        slug: 'instagram-image-resizer',
        name: 'Instagram Image Resizer',
        title: 'Instagram Image Resizer – Post, Story & Reel Sizes',
        metaDescription:
          'Resize photos for Instagram: 1080x1350 portrait, 1080x1080 square, 1080x1920 stories and Reels. Crop or fit with blurred background. Free, private.',
        description:
          'Resize any photo to Instagram’s sizes — 1080 × 1350 portrait posts, 1080 × 1080 squares, 1080 × 566 landscape posts and 1080 × 1920 stories and Reels. Choose what stays in frame or fit the whole image on a blurred background, without uploading it.',
        config: { platform: 'instagram' },
        keywords: [
          'instagram image resizer',
          'instagram post size',
          'instagram story size',
          'resize photo for instagram',
        ],
      },
      {
        slug: 'facebook-image-resizer',
        name: 'Facebook Image Resizer',
        title: 'Facebook Image Resizer – Cover, Post & Event Sizes',
        metaDescription:
          'Resize images for Facebook: 1200x630 posts and link images, 851x315 page covers, 1920x1005 event covers and stories. Free and private.',
        description:
          'Get the right size for every Facebook image — 1200 × 630 feed posts and link previews, 851 × 315 page covers, 1920 × 1005 event covers, stories and profile pictures. Position the crop yourself so nothing important is cut off.',
        config: { platform: 'facebook' },
        keywords: [
          'facebook cover photo size',
          'facebook image resizer',
          'facebook post size',
        ],
      },
      {
        slug: 'twitter-x-image-resizer',
        name: 'X (Twitter) Image Resizer',
        title: 'X (Twitter) Image Resizer – Header & Post Sizes',
        metaDescription:
          'Resize images for X (Twitter): 1500x500 header, 1600x900 post images and 400x400 profile pictures. Crop or fit, free and private.',
        description:
          'Resize images for X (formerly Twitter): a 1500 × 500 header, 1600 × 900 in-feed images that are not cropped in the timeline, square posts and a 400 × 400 profile picture.',
        config: { platform: 'twitter-x' },
        keywords: [
          'twitter header size',
          'x header size',
          'twitter image size',
          'x image resizer',
        ],
      },
      {
        slug: 'linkedin-image-resizer',
        name: 'LinkedIn Image Resizer',
        title: 'LinkedIn Image Resizer – Banner & Post Sizes',
        metaDescription:
          'Resize images for LinkedIn: 1584x396 profile background, 1200x627 posts, 1128x191 company covers and profile photos. Free, no upload.',
        description:
          'Make LinkedIn images that fit: a 1584 × 396 personal banner, 1128 × 191 company page cover, 1200 × 627 post and link images, square posts and a 400 × 400 profile photo.',
        config: { platform: 'linkedin' },
        keywords: [
          'linkedin banner size',
          'linkedin background photo size',
          'linkedin image resizer',
        ],
      },
      {
        slug: 'youtube-thumbnail-resizer',
        name: 'YouTube Thumbnail Resizer',
        title: 'YouTube Thumbnail Resizer – 1280x720 & Banner',
        metaDescription:
          'Resize images to a 1280x720 YouTube thumbnail, 2560x1440 channel banner, channel icon or Shorts cover. Free, private, in your browser.',
        description:
          'Resize a screenshot or photo to a 1280 × 720 YouTube thumbnail (16:9), a 2560 × 1440 channel banner, an 800 × 800 channel icon or a 9:16 Shorts cover — and keep the important part in frame.',
        config: { platform: 'youtube' },
        keywords: [
          'youtube thumbnail size',
          'youtube thumbnail resizer',
          'youtube banner size',
        ],
      },
    ],
  },
  {
    slug: 'image-to-ascii-art',
    category: 'image-tools',
    name: 'Image to ASCII Art',
    icon: '🔣',
    shortDescription: 'Convert a picture into text-based ASCII art.',
    description:
      'Turn any image into ASCII art made of text characters. Choose the width, the character set (classic ASCII, detailed, block characters, two-tone or your own), invert it for dark backgrounds or keep the original colours, then copy the text or download it as a .txt or PNG.',
    title: 'Image to ASCII Art Converter – Text & Colour, Free',
    metaDescription:
      'Convert images to ASCII art online. Adjustable width, classic or block characters, invert and colour modes. Copy text or download TXT/PNG. Free, private.',
    keywords: [
      'image to ascii',
      'ascii art generator',
      'picture to text art',
      'ascii art converter',
      'photo to ascii',
    ],
    relatedTools: [
      'fancy-text-generator',
      'image-to-text',
      'image-to-base64',
      'meme-generator',
      'image-converter',
    ],
    component: 'ascii-art',
    handlesFiles: true,
    howTo: [
      'Upload an image — high-contrast pictures work best.',
      'Set the width in characters and choose a character set.',
      'Toggle invert for dark backgrounds or colour for a coloured version.',
      'Copy the text, or download it as .txt or as a PNG image.',
    ],
    about: [
      'Each character stands for the brightness of a small block of the image: dense characters like @ and # for dark areas, light ones like . and spaces for bright areas. More characters across means more detail but a wider result.',
      'Text characters are taller than they are wide, so each character stands for a block of the image twice as tall as it is wide — that keeps circles round instead of stretched. Paste the result into a code block or a monospace font to see it correctly.',
    ],
    faqs: [
      {
        q: 'Why does my ASCII art look distorted when I paste it?',
        a: 'ASCII art needs a monospace font, where every character has the same width. Paste it into a code block, a plain-text editor or a chat’s code formatting.',
      },
      {
        q: 'Can I keep the colours?',
        a: 'Yes — turn on Colour to see a coloured preview and download a coloured PNG. Plain .txt files cannot store colour.',
      },
    ],
  },
  {
    slug: 'pixel-art-editor',
    category: 'image-tools',
    name: 'Pixel Art Editor',
    icon: '👾',
    shortDescription: 'Draw pixel art & sprites, export PNG, SVG or GIF.',
    description:
      'Draw pixel art on an 8×8 to 64×64 grid with a pencil, eraser, flood fill and eyedropper, mirror drawing and undo. Add animation frames with onion skinning and a live preview, then export a crisp PNG at up to 32×, an SVG, a sprite sheet or an animated GIF — all with transparent backgrounds.',
    title: 'Pixel Art Editor – Draw Sprites, Export PNG & Animated GIF',
    metaDescription:
      'Free online pixel art editor: draw on 8×8 to 64×64 grids with fill, mirror and undo, animate frames, then export PNG, SVG, sprite sheets or animated GIFs.',
    keywords: [
      'pixel art editor',
      'pixel art maker',
      'sprite editor',
      'pixel art online',
      '8 bit art maker',
      'pixel art gif',
      'sprite sheet maker',
    ],
    relatedTools: [
      'gif-maker',
      'favicon-generator',
      'image-to-ascii-art',
      'color-palette-generator',
      'svg-path-editor',
    ],
    component: 'pixel-art',
    howTo: [
      'Pick a grid size and a colour from the picker, the palette or your recent colours.',
      'Draw with the pencil, erase, flood-fill areas or pick a colour with the eyedropper. Turn on mirroring for symmetrical sprites.',
      'For animation, add or duplicate frames, reorder them, turn on onion skin and preview at your chosen frames per second.',
      'Choose an export scale and download a PNG, an SVG, a sprite sheet or an animated GIF. Your drawing is saved in this browser automatically.',
    ],
    about: [
      'Pixel art is drawn one square at a time on a small grid, the style of classic 8- and 16-bit games. Because every pixel is deliberate, it needs tools that never blur: this editor scales images up with exact nearest-neighbour blocks, so a 16×16 sprite exported at 32× stays perfectly sharp at 512×512.',
      'The SVG export merges each row’s same-coloured pixels into single rectangles, so files stay small and scale to any size. Animated GIFs use an exact colour palette with true transparency. Drawings, frames and recent colours are stored only in your browser’s local storage — nothing is uploaded.',
    ],
    faqs: [
      {
        q: 'Can I draw without a mouse?',
        a: 'Yes. Focus the canvas, move the cursor with the arrow keys and press Space or Enter to use the current tool. Touch drawing works on phones and tablets too.',
      },
      {
        q: 'How do I make an animated sprite?',
        a: 'Duplicate the current frame, change it, and repeat. Turn on onion skin to see the previous frame faintly, play the preview, then export an animated GIF or a sprite sheet for game engines.',
      },
      {
        q: 'Will my drawing be lost if I close the page?',
        a: 'No — it is autosaved in this browser’s local storage and restored next time. Private browsing or clearing site data removes it, so export a PNG to keep a copy.',
      },
      {
        q: 'What size should a favicon or game sprite be?',
        a: 'Favicons are usually drawn at 16×16 or 32×32; many retro-style game sprites use 16×16, 24×24 or 32×32. Export at a higher scale for sharp previews and social posts.',
      },
    ],
  },
  {
    slug: 'image-color-picker',
    category: 'image-tools',
    alsoIn: ['color-tools'],
    name: 'Image Color Picker',
    icon: '🎯',
    shortDescription: 'Click any pixel of an image to get its colour.',
    description:
      'Open an image and click or tap any pixel to get its exact HEX, RGB and HSL colour and its x/y coordinates, with a magnifier for precise picking and arrow-key nudging. The image is shown at any size but read at full resolution, and it never leaves your device.',
    title: 'Image Color Picker – Get the Color of Any Pixel',
    metaDescription:
      'Free image color picker: click or tap a pixel to get its HEX, RGB and HSL code and coordinates, with a magnifier and arrow-key nudging. Full resolution, no upload.',
    keywords: [
      'image color picker',
      'color picker from image',
      'pixel color picker',
      'get color from image',
      'eyedropper from image',
      'hex color from image',
    ],
    relatedTools: [
      'image-color-palette-extractor',
      'color-picker',
      'color-converter',
      'contrast-checker',
      'image-exif-viewer',
    ],
    component: 'image-color-picker',
    handlesFiles: true,
    howTo: [
      'Choose or drop an image.',
      'Move over the image — the magnifier shows the pixels around the pointer — and click or tap to pick one.',
      'Copy the HEX, RGB or HSL value. Use the arrow keys (with Shift for 10 pixels) to nudge the selection, and recent picks stay available below.',
    ],
    about: [
      'Pointer positions on a scaled image don’t match the image’s own pixels: an image 4,000 pixels wide shown 800 pixels wide maps five source pixels to every screen pixel. The picker converts the pointer position to the image’s natural size before reading the colour, so the coordinates and values are those of the original pixel — counted from 0,0 in the top-left corner.',
      'Photos from phones often store their rotation in EXIF metadata; the picker applies it first, so coordinates match the image as you see it. Very large images are reduced to 8,192 pixels on the longest side to stay within browser memory limits, and the page says so when that happens. For a whole-image palette instead of single pixels, use the Image Color Palette Extractor.',
    ],
    faqs: [
      {
        q: 'Are the coordinates of the original image?',
        a: 'Yes. Whatever size the image is shown at, x and y are in the image’s own pixels, starting at 0,0 in the top-left corner (unless a very large image had to be reduced, which the tool tells you).',
      },
      {
        q: 'Can I pick a colour from my screen instead?',
        a: 'In Chrome and Edge, the Color Picker tool on this site has a screen eyedropper. This tool works on image files on any browser.',
      },
      {
        q: 'Why is the colour slightly different from the design file?',
        a: 'JPEG compression and colour profiles change pixel values a little. For exact brand colours, check the original design file or a lossless PNG.',
      },
    ],
  },
  {
    slug: 'dpi-calculator',
    category: 'image-tools',
    alsoIn: ['calculators'],
    name: 'DPI & Print Size Calculator',
    icon: '🖨️',
    shortDescription: 'Pixels, DPI and print size — calculate any one.',
    description:
      'Work out how big an image prints at a given DPI, how many pixels you need for a print size, or the effective DPI of an image at a size — in inches, centimetres or millimetres. Includes a quality guide for photo prints and posters.',
    title: 'DPI Calculator – Pixels to Print Size in cm, mm & Inches',
    metaDescription:
      'Free DPI calculator: convert pixels to print size at any DPI, find the pixels needed for a print, or the effective DPI of an image, in inches, cm or mm, with a quality guide.',
    keywords: [
      'dpi calculator',
      'pixels to inches',
      'print size calculator',
      'ppi calculator',
      'pixels to cm',
      'image resolution for print',
    ],
    relatedTools: [
      'image-resizer',
      'aspect-ratio-calculator',
      'measurement-reference',
      'passport-photo-maker',
      'length-converter',
    ],
    component: 'form-calculator',
    config: { calculator: 'dpi' },
    howTo: [
      'Choose what to calculate: print size, the pixels needed, or the DPI of an image at a given size.',
      'Enter the known values and pick inches, centimetres or millimetres.',
      'Read the result, the formula used and the print-quality guide.',
    ],
    about: [
      'DPI (dots per inch) — strictly PPI, pixels per inch, for digital images — links pixel dimensions to physical size: inches = pixels ÷ DPI, and pixels = inches × DPI. A 3000 × 2000 pixel photo printed at 300 DPI is 10 × 6.67 inches (25.4 × 16.9 cm); at 150 DPI it prints twice as large but half as sharp.',
      'The DPI number stored in an image file changes nothing about the image itself — it only tells software what size to print it by default. More pixels mean more detail; a higher DPI setting on the same pixels just makes the print smaller. As a guide, 300 DPI looks sharp in the hand, 150–200 DPI is fine for posters viewed from a metre or more, and large banners viewed from far away can go lower. Upscaling a small image adds pixels but not real detail.',
    ],
    faqs: [
      {
        q: 'What DPI do I need for printing?',
        a: '300 DPI for photos and documents you hold close, 150–200 DPI for posters, and less for large banners seen from a distance. Many print shops ask for 300 DPI at the final size.',
      },
      {
        q: 'How many pixels do I need for an A4 print at 300 DPI?',
        a: 'A4 is 210 × 297 mm (8.27 × 11.69 in), so about 2,481 × 3,508 pixels. Choose “Pixels needed”, enter 210 × 297 mm and 300 DPI to check.',
      },
      {
        q: 'Does changing the DPI make my image sharper?',
        a: 'No. Changing only the DPI value changes the default print size, not the detail. Sharpness depends on the number of pixels and on how large you print them.',
      },
    ],
  },
];
