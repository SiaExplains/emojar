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
    accent: 'bg-brand-50 border-brand-100 text-brand-900',
  },
  {
    slug: 'pdf-tools',
    name: 'PDF Tools',
    shortName: 'PDF',
    icon: '📄',
    title: 'Free Online PDF Tools – Merge, Split & Convert PDF',
    metaDescription:
      'Merge, split, edit, sign, fill, crop, compress and convert PDF files online for free — including Word to PDF. Processed in your browser, never uploaded.',
    intro:
      'Merge, split, edit, fill, crop and convert PDF files — and turn Word documents into PDFs — without uploading them anywhere. These PDF tools run entirely in your browser, so confidential documents stay on your device.',
    accent: 'bg-rose-50 border-rose-100 text-rose-900',
  },
  {
    slug: 'developer-tools',
    name: 'Developer Tools',
    shortName: 'Developer',
    icon: '🧑‍💻',
    title: 'Free Online Developer Tools – JSON, Base64, JWT & More',
    metaDescription:
      'Format and diff JSON, decode JWTs, convert number bases, calculate subnets and chmod, generate bcrypt hashes, meta tags and robots.txt — all in your browser.',
    intro:
      'Everyday developer utilities: formatters, encoders, decoders and converters, JSON diff, subnet and chmod calculators, bcrypt and TOTP, meta tags and robots.txt, and pretty code screenshots — plus visual Flexbox and CSS Grid playgrounds, a CSS unit visualizer, and ASCII, HTML entity and HTTP status references. Input is processed locally in your browser, so API keys, tokens, secrets and payloads are never sent to a server.',
    accent: 'bg-slate-50 border-slate-200 text-slate-900',
  },
  {
    slug: 'text-tools',
    name: 'Text Tools',
    shortName: 'Text',
    icon: '📝',
    title: 'Free Online Text Tools – Word Counter, Case Converter & More',
    metaDescription:
      'Count words, check readability, change case, remove line breaks, make slugs, flip or strike through text and copy symbols — free text tools that run in your browser.',
    intro:
      'Count, clean, compare and transform text instantly: word counts and readability scores, line-break and duplicate removal, slugs, upside-down and strikethrough text, invisible characters and symbols to copy, and Morse code and braille translators. Results appear as you type — nothing is stored or uploaded.',
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
      'Convert color codes, build palettes and gradients, check accessibility contrast, and find the name of any colour among 1,000+ CSS and common colour names. Every result comes with ready-to-copy CSS values.',
    accent: 'bg-pink-50 border-pink-100 text-pink-900',
  },
  {
    slug: 'calculators',
    name: 'Calculators',
    shortName: 'Calculators',
    icon: '🧮',
    title: 'Free Online Calculators – Percentage, Age, Loan, BMI & More',
    metaDescription:
      'Free online calculators: mortgage, loan, salary, ROI, margin, retirement, fractions, ratios, probability, BMI, body fat, percentages and more. No sign-up.',
    intro:
      'Quick, accurate calculators for everyday maths, money and health questions — from mortgages, salaries and retirement savings to fractions, probability, body fat and the molar mass of chemical formulas. Results update as you type and every formula is explained on the page.',
    accent: 'bg-emerald-50 border-emerald-100 text-emerald-900',
  },
  {
    slug: 'unit-converters',
    name: 'Unit Converters',
    shortName: 'Units',
    icon: '📏',
    title: 'Free Online Unit Converters – Length, Weight, Temperature & More',
    metaDescription:
      'Convert length, weight, temperature, volume, speed, power, torque, fuel economy, cooking measures, shoe and clothing sizes and more — instantly and accurately.',
    intro:
      'Convert between metric, imperial and scientific units — plus everyday conversions such as cups to grams, mpg to L/100 km and international shoe and clothing sizes. Type a value, pick the units, and see the result together with a full conversion table.',
    accent: 'bg-cyan-50 border-cyan-100 text-cyan-900',
  },
  {
    slug: 'security-generators',
    name: 'Security & Generators',
    shortName: 'Generators',
    icon: '🔐',
    title: 'Free Password, QR Code & Random Generators – Secure & Private',
    metaDescription:
      'Generate and check passwords, make random teams, usernames, colours and test data, create invoices and email signatures, QR codes and more — all in your browser.',
    intro:
      'Passwords and a strength checker, random numbers, teams, usernames, colours and fake test data, invoices, email signatures, QR codes and barcodes. Random values come from your browser’s cryptographic generator and never leave your device.',
    accent: 'bg-violet-50 border-violet-100 text-violet-900',
  },
  {
    slug: 'date-time-tools',
    name: 'Date & Time Tools',
    shortName: 'Date & Time',
    icon: '🕒',
    title: 'Free Date & Time Tools – Timestamps, Time Zones & Date Math',
    metaDescription:
      'Convert timestamps and time zones, count days, find the day of the week, add up time cards, make printable calendars and set alarms, timers and Pomodoros — free, in your browser.',
    intro:
      'Everyday date and time tools: timestamps, time zones and a live world time-zone map, date maths, day of the week, week numbers, time cards, printable calendars, plus an alarm clock, timers, a stopwatch and a Pomodoro timer. Everything runs in your browser.',
    accent: 'bg-sky-50 border-sky-100 text-sky-900',
  },
  {
    slug: 'audio-video-tools',
    name: 'Audio & Video Tools',
    shortName: 'Audio & Video',
    icon: '🎬',
    title: 'Free Online Audio & Video Tools – Compress, Convert, Trim & Record',
    metaDescription:
      'Compress videos, convert and trim audio, record your voice or screen, extract MP3 from MP4 and make GIFs — free, in your browser, with nothing uploaded.',
    intro:
      'Compress videos, convert and cut audio, record your voice or screen, extract MP3 from video and make GIFs — without installing software. Files and recordings are processed on your own device and never uploaded.',
    accent: 'bg-orange-50 border-orange-100 text-orange-900',
  },
  {
    slug: 'device-tests',
    name: 'Device Tests',
    shortName: 'Device Tests',
    icon: '🎥',
    title: 'Online Device Tests – Keyboard, Screen, Webcam & Mic Tests',
    metaDescription:
      'Test your keyboard, screen, webcam and microphone online: find dead pixels, check screen resolution and refresh rate, see your browser version. Nothing is recorded.',
    intro:
      'Check that your keyboard, screen, camera and microphone work, find dead pixels, and see exactly which browser, resolution and refresh rate you have. The tests run locally in your browser; nothing is recorded or uploaded.',
    accent: 'bg-teal-50 border-teal-100 text-teal-900',
  },
  {
    slug: 'reference-tools',
    name: 'Reference & Learning',
    shortName: 'Reference',
    icon: '📚',
    title: 'Free Online Reference Tools – Periodic Table, Unicode & More',
    metaDescription:
      'Interactive references: periodic table, country and flag explorers, Unicode, HTML entities, ASCII, math symbols, keyboard shortcuts, paper sizes and more.',
    intro:
      'Quick, searchable references for the things you look up again and again: an interactive periodic table, country codes and flags, Unicode characters, HTML entities and ASCII codes, math symbols with LaTeX, keyboard shortcuts for every platform, and paper sizes and aspect ratios. All the data is built into the pages, so lookups are instant and private.',
    accent: 'bg-lime-50 border-lime-100 text-lime-900',
  },
  {
    slug: 'productivity-tools',
    name: 'Productivity',
    shortName: 'Productivity',
    icon: '📋',
    title: 'Free Productivity Tools – Kanban, Eisenhower Matrix & More',
    metaDescription:
      'Private planning tools that run in your browser: Kanban board, Eisenhower matrix, decision matrix, timeline maker, Pomodoro timer and more. No sign-up, saved on your device.',
    intro:
      'Plan, prioritise and decide without signing up: a Kanban board, an Eisenhower matrix for sorting tasks by urgency and importance, a weighted decision matrix, a timeline maker, and timers and calendars for getting through the day. Everything you type is saved only in this browser — nothing is sent to a server — and you can export it as JSON, CSV or an image.',
    accent: 'bg-orange-50 border-orange-100 text-orange-900',
  },
];
