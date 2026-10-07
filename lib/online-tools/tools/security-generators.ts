import type { ToolDefinition } from '../types';

export const SECURITY_TOOLS: ToolDefinition[] = [
  {
    slug: 'password-generator',
    category: 'security-generators',
    name: 'Password Generator',
    icon: '🔑',
    shortDescription: 'Generate strong, random passwords.',
    description:
      'Generate strong, random passwords with your choice of length and character types. Passwords are created with your browser’s cryptographically secure random generator and never leave your device.',
    title: 'Password Generator – Strong Random Passwords, Generated Locally',
    metaDescription:
      'Generate strong, random passwords in your browser with a cryptographically secure generator. Choose length and characters. Nothing is sent or stored.',
    keywords: [
      'password generator',
      'strong password',
      'random password',
      'secure password generator',
    ],
    relatedTools: [
      'passphrase-generator',
      'random-string-generator',
      'hash-generator',
      'uuid-generator',
      'qr-code-generator',
    ],
    component: 'password-generator',
    popular: true,
    howTo: [
      'Choose the length (16+ characters recommended).',
      'Select uppercase, lowercase, numbers and symbols; optionally exclude look-alike characters.',
      'Click Generate and copy the password into your password manager.',
    ],
    about: [
      'Password strength is measured in bits of entropy: length × log2(number of possible characters). A 16-character password using all four character types has about 104 bits — far beyond what can be brute-forced.',
      'The generator uses crypto.getRandomValues with unbiased sampling, and every password is guaranteed to contain at least one character of each type you selected.',
    ],
    faqs: [
      {
        q: 'Are generated passwords stored or sent anywhere?',
        a: 'No. They exist only in this page until you close or refresh it.',
      },
      {
        q: 'How long should a password be?',
        a: 'At least 12 characters; 16 or more for important accounts. Use a unique password for every site.',
      },
    ],
  },
  {
    slug: 'passphrase-generator',
    category: 'security-generators',
    name: 'Passphrase Generator',
    icon: '🗝️',
    shortDescription: 'Generate memorable multi-word passphrases.',
    description:
      'Generate memorable passphrases made of random words — like “otter-maple-zinc-violin” — that are easy to type and hard to guess. Entropy is calculated for you.',
    title: 'Passphrase Generator – Memorable, Secure Word Passwords',
    metaDescription:
      'Generate secure, memorable passphrases from random words in your browser. Choose word count and separators; see entropy. Private.',
    keywords: [
      'passphrase generator',
      'diceware',
      'memorable password',
      'random words password',
    ],
    relatedTools: [
      'password-generator',
      'random-string-generator',
      'hash-generator',
    ],
    component: 'passphrase-generator',
    howTo: [
      'Choose how many words (5 or more recommended).',
      'Pick a separator and whether to capitalise or add a number.',
      'Generate and copy.',
    ],
    about: [
      'Passphrases follow the Diceware idea: each randomly chosen word adds log2(list size) bits of entropy. Because words are chosen randomly — not by you — the result is strong even though it is easy to remember.',
    ],
    faqs: [
      {
        q: 'Are passphrases as secure as random passwords?',
        a: 'Yes, at equal entropy. Six random words from this list give roughly 60 bits; add a seventh word for more.',
      },
    ],
  },
  {
    slug: 'random-number-generator',
    category: 'security-generators',
    name: 'Random Number Generator',
    icon: '🎲',
    shortDescription: 'Pick random numbers in any range.',
    description:
      'Generate one or many random numbers in any range — integers or decimals, with or without repeats. Perfect for raffles, games and sampling.',
    title: 'Random Number Generator – Pick Random Numbers in a Range',
    metaDescription:
      'Generate random numbers between any min and max. Integers or decimals, unique or with repeats, using a secure generator. Free.',
    keywords: [
      'random number generator',
      'rng',
      'random number picker',
      'number generator',
    ],
    relatedTools: [
      'random-string-generator',
      'password-generator',
      'sort-lines',
      'average-calculator',
    ],
    component: 'random-number',
    howTo: [
      'Enter the minimum and maximum.',
      'Choose how many numbers, decimals, and whether repeats are allowed.',
      'Click Generate.',
    ],
    about: [
      'Numbers come from crypto.getRandomValues with rejection sampling, so every value in the range is equally likely — fair enough for draws and giveaways.',
    ],
    faqs: [
      {
        q: 'Are both min and max included?',
        a: 'Yes, the range is inclusive.',
      },
    ],
  },
  {
    slug: 'random-string-generator',
    category: 'security-generators',
    name: 'Random String Generator',
    icon: '🔣',
    shortDescription: 'Generate random strings, tokens and IDs.',
    description:
      'Generate random strings from letters, digits, hex or a custom character set — for API keys, tokens, coupon codes and test data.',
    title: 'Random String Generator – Tokens, Keys & Codes',
    metaDescription:
      'Generate random strings, tokens and codes with custom length and character sets. Cryptographically secure, generated in your browser.',
    keywords: [
      'random string generator',
      'random token',
      'api key generator',
      'random code generator',
    ],
    relatedTools: [
      'password-generator',
      'uuid-generator',
      'random-number-generator',
      'hash-generator',
    ],
    component: 'random-string',
    howTo: [
      'Set the length and how many strings.',
      'Choose character sets or type a custom one.',
      'Generate, then copy or download.',
    ],
    about: [
      'Each character is chosen independently and uniformly from the set, so entropy = length × log2(set size). A 32-character hex string has 128 bits.',
    ],
    faqs: [
      {
        q: 'Can I generate coupon codes without confusing characters?',
        a: 'Yes — use a custom set like ABCDEFGHJKLMNPQRSTUVWXYZ23456789.',
      },
    ],
  },
  {
    slug: 'sha256-generator',
    category: 'security-generators',
    name: 'SHA-256 Generator',
    icon: '#️⃣',
    shortDescription: 'Generate SHA-256 hashes of text or files.',
    description:
      'Calculate the SHA-256 hash of text or a file — for checksums, integrity checks and API signatures. Optionally compute an HMAC-SHA256 with a secret key.',
    title: 'SHA-256 Hash Generator – Text & File Checksums Online',
    metaDescription:
      'Generate SHA-256 hashes and HMAC-SHA256 of text or files online. Verify downloads with checksums. Private, in your browser.',
    keywords: [
      'sha256 generator',
      'sha256 hash',
      'sha-256 checksum',
      'hmac sha256',
    ],
    relatedTools: [
      'sha512-generator',
      'hash-generator',
      'base64-encoder',
      'jwt-decoder',
    ],
    component: 'hash-generator',
    config: { algorithm: 'SHA-256' },
    howTo: [
      'Type text or choose a file.',
      'Copy the 64-character SHA-256 hash.',
      'Paste a published checksum to compare automatically.',
    ],
    about: [
      'SHA-256 produces a 256-bit (64 hex character) digest. It is used in TLS certificates, Git, Bitcoin and software download checksums.',
    ],
    faqs: [
      {
        q: 'Can a SHA-256 hash be reversed?',
        a: 'No. Hashes are one-way; short or common inputs can only be found by guessing.',
      },
    ],
  },
  {
    slug: 'sha512-generator',
    category: 'security-generators',
    name: 'SHA-512 Generator',
    icon: '#️⃣',
    shortDescription: 'Generate SHA-512 hashes of text or files.',
    description:
      'Calculate the SHA-512 hash of text or a file, or an HMAC-SHA512 with a secret key. Everything is computed locally with the Web Crypto API.',
    title: 'SHA-512 Hash Generator – Text & File Hashes Online',
    metaDescription:
      'Generate SHA-512 hashes and HMAC-SHA512 of text or files online. Fast, free and computed in your browser.',
    keywords: [
      'sha512 generator',
      'sha512 hash',
      'sha-512 checksum',
      'hmac sha512',
    ],
    relatedTools: ['sha256-generator', 'hash-generator', 'password-generator'],
    component: 'hash-generator',
    config: { algorithm: 'SHA-512' },
    howTo: [
      'Type text or choose a file.',
      'Copy the 128-character SHA-512 hash.',
      'Optionally enter a key to get an HMAC.',
    ],
    about: [
      'SHA-512 produces a 512-bit digest. On 64-bit processors it is often faster than SHA-256 for large inputs.',
    ],
    faqs: [
      {
        q: 'Is SHA-512 more secure than SHA-256?',
        a: 'Both are considered secure. SHA-512 has a larger margin, but SHA-256 is more widely used.',
      },
    ],
  },
  {
    slug: 'qr-code-generator',
    category: 'security-generators',
    name: 'QR Code Generator',
    icon: '🔳',
    shortDescription: 'Create QR codes for links, Wi-Fi and text.',
    description:
      'Create QR codes for URLs, text, Wi-Fi networks, email and phone numbers. Customise colors and size, then download as PNG or SVG — free, with no tracking redirects.',
    title: 'QR Code Generator – Free, No Tracking, PNG & SVG Download',
    metaDescription:
      'Create free QR codes for links, Wi-Fi, text, email and phone. Custom colors, PNG and SVG download. Generated in your browser — no tracking.',
    keywords: [
      'qr code generator',
      'create qr code',
      'wifi qr code',
      'free qr code',
      'qr code svg',
    ],
    relatedTools: [
      'qr-code-scanner',
      'barcode-generator',
      'url-encoder',
      'password-generator',
    ],
    component: 'qr-generator',
    popular: true,
    howTo: [
      'Choose the type: link, text, Wi-Fi, email or phone.',
      'Fill in the details; the QR code updates live.',
      'Adjust colors, size and error correction, then download PNG or SVG.',
    ],
    about: [
      'Many “free” QR generators encode a short link to their own server so they can track scans — or switch the code off later. Codes made here contain your data directly, so they work forever and nothing is tracked.',
      'Higher error correction (Q or H) lets the code survive damage or a logo overlay, at the cost of a denser pattern.',
    ],
    faqs: [
      {
        q: 'Do these QR codes expire?',
        a: 'No. They are static codes with your content embedded directly.',
      },
      {
        q: 'What is the best format for print?',
        a: 'SVG — it is a vector format and stays sharp at any size.',
      },
    ],
  },
  {
    slug: 'qr-code-scanner',
    category: 'security-generators',
    name: 'QR Code Scanner',
    icon: '📷',
    shortDescription: 'Scan QR codes from your camera or an image.',
    description:
      'Scan a QR code with your camera or from an image or screenshot and read its content — without installing an app. Images are decoded locally.',
    title: 'QR Code Scanner – Scan QR from Camera or Image Online',
    metaDescription:
      'Scan QR codes online with your camera or from an image file. Decoded in your browser — images and camera frames are never uploaded.',
    keywords: [
      'qr code scanner',
      'scan qr code online',
      'qr reader',
      'read qr from image',
    ],
    relatedTools: ['qr-code-generator', 'barcode-generator', 'url-decoder'],
    component: 'qr-scanner',
    handlesFiles: true,
    howTo: [
      'Click “Start camera” and point it at a QR code, or upload an image/screenshot.',
      'The decoded content appears as soon as the code is found.',
      'Copy it, or open it if it is a link (check the address first!).',
    ],
    about: [
      'The scanner uses the browser’s built-in BarcodeDetector where available and a JavaScript decoder (jsQR) elsewhere. Camera frames are processed in memory and never recorded or sent.',
    ],
    faqs: [
      {
        q: 'Is it safe to open links from QR codes?',
        a: 'Always check the full address first. QR codes are a common way to disguise phishing links (“quishing”).',
      },
    ],
  },
  {
    slug: 'barcode-generator',
    category: 'security-generators',
    name: 'Barcode Generator',
    icon: '▥',
    shortDescription: 'Create Code 128, EAN-13, UPC and more.',
    description:
      'Generate barcodes in Code 128, EAN-13, EAN-8, UPC-A, Code 39, ITF-14 and more, and download them as SVG or PNG.',
    title: 'Barcode Generator – Code 128, EAN-13, UPC Online',
    metaDescription:
      'Generate barcodes online: Code 128, EAN-13, EAN-8, UPC-A, Code 39, ITF-14. Download SVG or PNG. Free, generated in your browser.',
    keywords: [
      'barcode generator',
      'ean 13 generator',
      'upc barcode',
      'code 128 generator',
      'create barcode',
    ],
    relatedTools: [
      'qr-code-generator',
      'qr-code-scanner',
      'random-number-generator',
    ],
    component: 'barcode-generator',
    howTo: [
      'Choose the barcode format.',
      'Enter the value (check digits are added automatically for EAN/UPC).',
      'Adjust size and download SVG or PNG.',
    ],
    about: [
      'EAN-13 and UPC-A are used on retail products and need numbers issued by GS1 for real products. Code 128 encodes any text and is common in logistics.',
    ],
    faqs: [
      {
        q: 'Can I make a real product barcode here?',
        a: 'You can generate the image, but retail EAN/UPC numbers must be licensed from GS1 to be unique.',
      },
    ],
  },

  {
    slug: 'wheel-spinner',
    category: 'security-generators',
    name: 'Wheel Spinner',
    icon: '🎡',
    shortDescription: 'Spin a wheel to pick a random name.',
    description:
      'Add names or options, spin the wheel and let it pick a winner fairly. Remove winners between spins, shuffle the order, and run giveaways, classroom picks or team decisions. Every spin uses a cryptographically secure random number.',
    title: 'Wheel Spinner – Random Name Picker Wheel, Free',
    metaDescription:
      'Spin a wheel to pick a random name or option. Add entries, remove winners, run giveaways and classroom draws. Fair, secure randomness, no sign-up.',
    keywords: [
      'wheel spinner',
      'random name picker',
      'spin the wheel',
      'name wheel',
      'random picker wheel',
    ],
    relatedTools: [
      'random-number-generator',
      'dice-roller',
      'coin-flip',
      'sort-lines',
      'random-string-generator',
    ],
    component: 'wheel-spinner',
    popular: true,
    howTo: [
      'Type one entry per line (names, prizes, choices).',
      'Click Spin or press the space bar.',
      'Remove the winner for the next spin, or spin again.',
    ],
    about: [
      'The winner is chosen with crypto.getRandomValues before the wheel starts turning; the animation simply lands on that segment. Every entry has exactly the same chance, regardless of its position or text length.',
      'Your list is remembered in this browser only, so you can come back to the same wheel later.',
    ],
    faqs: [
      {
        q: 'Can I give an entry more chances?',
        a: 'Yes — add it more than once. Each line is one segment.',
      },
      {
        q: 'Is the wheel really random?',
        a: 'Yes. The result comes from your browser’s cryptographic random generator with unbiased sampling; nothing is predetermined.',
      },
    ],
  },
  {
    slug: 'dice-roller',
    category: 'security-generators',
    name: 'Dice Roller',
    icon: '🎲',
    shortDescription: 'Roll d4–d100 dice or notation like 2d6+3.',
    description:
      'Roll virtual dice for board games and tabletop RPGs: one or many d4, d6, d8, d10, d12, d20 or d100, or type notation like 2d6+3 or 4d6kh3. Every roll is fair and shows the individual dice.',
    title: 'Dice Roller – Roll D20, D6 & Custom Dice Online',
    metaDescription:
      'Roll virtual dice online: d4, d6, d8, d10, d12, d20, d100 or RPG notation like 2d6+3 and 4d6kh3. Fair, secure randomness with roll history.',
    keywords: [
      'dice roller',
      'roll a dice',
      'd20 roller',
      'virtual dice',
      'rpg dice roller',
    ],
    relatedTools: ['coin-flip', 'wheel-spinner', 'random-number-generator'],
    component: 'dice-roller',
    howTo: [
      'Tap a die to roll it, or type notation such as 3d6 or 2d20+5 to roll several at once.',
      'Or type dice notation such as 3d8+2 or 4d6kh3 (roll four, keep the highest three).',
      'See every die, the total and your recent rolls.',
    ],
    about: [
      'Dice notation writes a roll as NdS±M: N dice with S sides plus a modifier M. “kh” keeps the highest dice and “kl” the lowest, which is how ability scores (4d6kh3) and advantage/disadvantage (2d20kh1 / 2d20kl1) work.',
      'Each die face is drawn with unbiased sampling from your browser’s cryptographic random generator, so every face is equally likely.',
    ],
    faqs: [
      {
        q: 'What is the average of 2d6?',
        a: '7 — it is also the most likely total (1 in 6 chance).',
      },
    ],
  },
  {
    slug: 'coin-flip',
    category: 'security-generators',
    name: 'Coin Flip',
    icon: '🪙',
    shortDescription: 'Flip a fair coin — heads or tails.',
    description:
      'Flip a virtual coin to settle a decision: heads or tails, with a running tally and the option to flip many coins at once. Fair 50/50 odds every time.',
    title: 'Coin Flip – Heads or Tails Online, Fair 50/50',
    metaDescription:
      'Flip a coin online — heads or tails with a fair 50/50 result. Keep a tally, flip many coins at once and see the streaks. Free coin toss.',
    keywords: [
      'coin flip',
      'flip a coin',
      'heads or tails',
      'coin toss',
      'virtual coin',
    ],
    relatedTools: ['dice-roller', 'wheel-spinner', 'random-number-generator'],
    component: 'coin-flip',
    howTo: [
      'Click Flip (or press the space bar).',
      'Optionally flip 10 or 100 coins at once.',
      'Watch the tally of heads and tails.',
    ],
    about: [
      'Each flip is independent: after five heads in a row, the next flip is still exactly 50/50. Streaks are far more common than most people expect — in 100 flips a run of six or more is likely.',
      'Results come from your browser’s cryptographic random generator rather than a physics simulation, so there is no hidden bias.',
    ],
    faqs: [
      {
        q: 'Is a real coin fair?',
        a: 'Nearly. Studies of human flips found a slight bias (about 51%) towards the side that started facing up; a virtual coin has no such bias.',
      },
    ],
  },
];
