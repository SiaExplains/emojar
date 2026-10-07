import type { CategoryDefinition } from './types';

export const CATEGORIES: CategoryDefinition[] = [
  {
    slug: 'image-tools',
    name: 'Image Tools',
    shortName: 'Image',
    icon: '🖼️',
    title: 'Free Online Image Tools – Convert, Compress & Resize',
    metaDescription:
      'Convert, compress, resize and edit images online: passport photos, collages, watermarks, blur, favicons, GIFs and more. Processed in your browser, never uploaded.',
    intro:
      'Convert, compress, resize and edit images directly in your browser — from passport photos, collages and social media sizes to watermarks, blurring, favicons and GIFs. Every image tool on this page works locally: your photos are never uploaded to a server.',
    accent: 'bg-indigo-50 border-indigo-100 text-indigo-900',
  },
  {
    slug: 'pdf-tools',
    name: 'PDF Tools',
    shortName: 'PDF',
    icon: '📄',
    title: 'Free Online PDF Tools – Merge, Split & Convert PDF',
    metaDescription:
      'Merge, split, rotate, reorder, compress and convert PDF files online for free. Your PDFs are processed in your browser and never leave your device.',
    intro:
      'Merge, split, rotate and convert PDF files without uploading them anywhere. These PDF tools run entirely in your browser, so confidential documents stay on your device.',
    accent: 'bg-rose-50 border-rose-100 text-rose-900',
  },
  {
    slug: 'developer-tools',
    name: 'Developer Tools',
    shortName: 'Developer',
    icon: '🧑‍💻',
    title: 'Free Online Developer Tools – JSON, Base64, JWT & More',
    metaDescription:
      'Format JSON, decode JWTs, encode Base64 and URLs, test regular expressions, generate UUIDs and convert JSON, YAML and CSV — all in your browser.',
    intro:
      'Everyday developer utilities: formatters, encoders, decoders and converters. Input is processed locally in your browser, so API keys, tokens and payloads are never sent to a server.',
    accent: 'bg-slate-50 border-slate-200 text-slate-900',
  },
  {
    slug: 'text-tools',
    name: 'Text Tools',
    shortName: 'Text',
    icon: '📝',
    title: 'Free Online Text Tools – Word Counter, Case Converter & More',
    metaDescription:
      'Count words and characters, change text case, remove duplicate lines, compare text and find and replace — free online text tools that run in your browser.',
    intro:
      'Count, clean, compare and transform text instantly. Paste your text and get the result as you type — nothing is stored or uploaded.',
    accent: 'bg-amber-50 border-amber-100 text-amber-900',
  },
  {
    slug: 'color-tools',
    name: 'Color Tools',
    shortName: 'Color',
    icon: '🎨',
    title: 'Free Online Color Tools – HEX, RGB, HSL, Palettes & Contrast',
    metaDescription:
      'Convert HEX, RGB and HSL colors, pick colors, generate palettes and CSS gradients, and check WCAG contrast ratios with free online color tools.',
    intro:
      'Convert color codes, build palettes and gradients, and check accessibility contrast. Every result comes with ready-to-copy CSS values.',
    accent: 'bg-pink-50 border-pink-100 text-pink-900',
  },
  {
    slug: 'calculators',
    name: 'Calculators',
    shortName: 'Calculators',
    icon: '🧮',
    title: 'Free Online Calculators – Percentage, Age, Loan, BMI & More',
    metaDescription:
      'Free online calculators for percentages, age, dates, BMI, BMR, loans, EMI, tips, discounts, VAT, compound interest and averages. Instant results, no sign-up.',
    intro:
      'Quick, accurate calculators for everyday maths, money and health questions. Results update as you type and every formula is explained on the page.',
    accent: 'bg-emerald-50 border-emerald-100 text-emerald-900',
  },
  {
    slug: 'unit-converters',
    name: 'Unit Converters',
    shortName: 'Units',
    icon: '📏',
    title: 'Free Online Unit Converters – Length, Weight, Temperature & More',
    metaDescription:
      'Convert length, weight, temperature, area, volume, speed, time, data storage, energy, pressure, frequency and angle units instantly and accurately.',
    intro:
      'Convert between metric, imperial and scientific units. Type a value, pick the units, and see the result together with a full conversion table.',
    accent: 'bg-cyan-50 border-cyan-100 text-cyan-900',
  },
  {
    slug: 'security-generators',
    name: 'Security & Generators',
    shortName: 'Generators',
    icon: '🔐',
    title: 'Free Password, QR Code & Random Generators – Secure & Private',
    metaDescription:
      'Generate strong passwords, passphrases, UUIDs, random numbers, hashes, QR codes and barcodes. Uses your browser’s cryptographic random generator — nothing is sent anywhere.',
    intro:
      'Generate passwords, random values, hashes, QR codes and barcodes using your browser’s cryptographically secure random number generator. Generated values never leave your device.',
    accent: 'bg-violet-50 border-violet-100 text-violet-900',
  },
  {
    slug: 'date-time-tools',
    name: 'Date & Time Tools',
    shortName: 'Date & Time',
    icon: '🕒',
    title: 'Free Date & Time Tools – Timestamps, Time Zones & Date Math',
    metaDescription:
      'Convert Unix timestamps and time zones, calculate date differences and working days, find week numbers, and create countdowns — free online date and time tools.',
    intro:
      'Convert timestamps and time zones, add and subtract dates, and count working days. Calculations use your browser’s built-in time zone database.',
    accent: 'bg-sky-50 border-sky-100 text-sky-900',
  },
  {
    slug: 'audio-video-tools',
    name: 'Audio & Video Tools',
    shortName: 'Audio & Video',
    icon: '🎬',
    title: 'Free Online Audio & Video Tools – MP4 to MP3, Video to GIF',
    metaDescription:
      'Extract MP3 audio from MP4 videos and turn video clips into GIFs online. Everything is processed in your browser — your videos are never uploaded.',
    intro:
      'Convert videos to MP3 audio and animated GIFs without installing software. Your video files are processed on your own device and never uploaded.',
    accent: 'bg-orange-50 border-orange-100 text-orange-900',
  },
  {
    slug: 'device-tests',
    name: 'Device Tests',
    shortName: 'Device Tests',
    icon: '🎥',
    title: 'Online Webcam & Microphone Test – Check Your Devices',
    metaDescription:
      'Test your webcam and microphone online before a video call. See resolution, frame rate and input level instantly — nothing is recorded or sent.',
    intro:
      'Check that your camera and microphone work before an important call. The tests run locally in your browser; nothing is recorded or uploaded.',
    accent: 'bg-teal-50 border-teal-100 text-teal-900',
  },
];
