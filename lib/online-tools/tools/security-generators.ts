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
      'password-strength-checker',
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
      'random-team-generator',
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
  {
    slug: 'random-team-generator',
    category: 'security-generators',
    name: 'Random Team Generator',
    icon: '👥',
    shortDescription: 'Split a list of names into fair random teams.',
    description:
      'Paste a list of names and split them into random teams — by number of teams or people per team — as evenly as possible. Optionally put one captain in each team, then reshuffle until you’re happy and copy the result.',
    title: 'Random Team Generator – Split Names into Fair Teams',
    metaDescription:
      'Free random team generator: paste names and split them into even random teams by count or team size, with optional captains. Reshuffle and copy in one click.',
    keywords: [
      'random team generator',
      'team generator',
      'random group generator',
      'split into teams',
      'team picker',
    ],
    relatedTools: [
      'wheel-spinner',
      'random-number-generator',
      'dice-roller',
      'coin-flip',
      'username-generator',
    ],
    component: 'team-generator',
    popular: true,
    howTo: [
      'Paste or type the names, one per line or separated by commas.',
      'Choose the number of teams or the number of people per team, and optionally list captains.',
      'Click “Make teams”, reshuffle if you like, and copy the teams.',
    ],
    about: [
      'Names are shuffled with your browser’s cryptographically secure random generator and dealt so team sizes differ by at most one — 10 people into 3 teams gives 4, 3 and 3. Captains are placed first, one per team, so each team gets a leader before the rest are shuffled in.',
      'Useful for classrooms, sports, workshops, hackathons and game nights. Nothing is stored or sent, so it’s fine for pupils’ or colleagues’ names.',
    ],
    faqs: [
      {
        q: 'Is the split really random?',
        a: 'Yes. Every arrangement is equally likely; ties for the smallest team are broken randomly too, so team 1 isn’t favoured.',
      },
      {
        q: 'Can I balance teams by skill?',
        a: 'List your strongest players as captains — they’ll be spread one per team — and the rest are shuffled in.',
      },
    ],
  },
  {
    slug: 'username-generator',
    category: 'security-generators',
    name: 'Username Generator',
    icon: '🪪',
    shortDescription: 'Ideas for usernames, gamer tags and handles.',
    description:
      'Generate 20 username ideas at a time in different styles — adjective + animal, two words, gamer tags, cute or professional (from your name) — with optional numbers, separators, a word to include and a maximum length.',
    title: 'Username Generator – Cool, Gamer & Professional Name Ideas',
    metaDescription:
      'Free username generator: get 20 ideas at once — adjective + animal, gamer tags, cute or professional handles — with numbers, separators and a length limit.',
    keywords: [
      'username generator',
      'gamer tag generator',
      'random username',
      'username ideas',
      'nickname generator',
    ],
    relatedTools: [
      'password-generator',
      'passphrase-generator',
      'random-string-generator',
      'fancy-text-generator',
      'random-team-generator',
    ],
    component: 'username-generator',
    howTo: [
      'Pick a style — or “Professional” and enter your name.',
      'Set a separator, a maximum length and whether to add numbers or include a word.',
      'Click “Generate more” until you like one, then copy it.',
    ],
    about: [
      'Good usernames are easy to say, spell and remember, and don’t reveal personal information like your birth year or full name — which matters if you use the same handle on many sites. Short handles (under 15 characters) also fit everywhere, including X’s 15-character limit.',
      'Words are picked with your browser’s secure random generator. The tool can’t check whether a name is free on a given site, so have a couple of favourites ready.',
    ],
    faqs: [
      {
        q: 'Should my username and password be related?',
        a: 'No. Usernames are often public; your password must be completely separate — use the Password Generator for that.',
      },
    ],
  },
  {
    slug: 'fake-data-generator',
    category: 'security-generators',
    alsoIn: ['developer-tools'],
    name: 'Fake Test Data Generator',
    icon: '🧪',
    shortDescription: 'Mock names, emails, addresses as CSV, JSON or SQL.',
    description:
      'Generate realistic fake test data — names, emails, phone numbers, addresses, companies, dates, prices, UUIDs, IPs and more — up to 1,000 rows as CSV, JSON or SQL INSERT statements. Use a seed to get the same data every time.',
    title: 'Fake Test Data Generator – Mock Data as CSV, JSON & SQL',
    metaDescription:
      'Generate fake test data: names, emails, phones, addresses, dates, UUIDs and more, up to 1,000 rows as CSV, JSON or SQL. Safe example.com emails, seedable.',
    keywords: [
      'fake data generator',
      'test data generator',
      'mock data generator',
      'dummy data',
      'random data generator',
    ],
    relatedTools: [
      'json-formatter',
      'csv-to-json',
      'uuid-generator',
      'sql-formatter',
      'lorem-ipsum-generator',
    ],
    component: 'fake-data',
    howTo: [
      'Tick the fields you need — they appear in the order you choose them.',
      'Set the number of rows, the format (CSV, JSON or SQL) and, optionally, a seed.',
      'Copy or download the data into your app, spreadsheet or database.',
    ],
    about: [
      'Test data should look real but never belong to a real person. Emails use the reserved example.com, example.org and example.net domains (RFC 2606), phone numbers use the 555-0100–0199 range set aside for fiction, and IP addresses come from the documentation ranges (RFC 5737), so nothing generated here can reach a real inbox, phone or server.',
      'With a seed, the same settings always produce the same rows — handy for reproducible tests and demos. CSV values are quoted when needed and SQL strings are escaped, so the output imports cleanly.',
    ],
    faqs: [
      {
        q: 'Can I use this data in production?',
        a: 'No — it’s for development, testing and demos only. Names and addresses are invented combinations.',
      },
      {
        q: 'Why are all emails @example.com?',
        a: 'Those domains are reserved and can never be registered, so test emails can’t accidentally be delivered to someone.',
      },
    ],
  },
  {
    slug: 'random-color-generator',
    category: 'security-generators',
    alsoIn: ['color-tools'],
    name: 'Random Color Generator',
    icon: '🎲',
    shortDescription: 'Random pastel, vivid or dark colours with HEX codes.',
    description:
      'Generate random colours — any, pastel, vivid, dark, light or around one hue — in sets of up to 10. Lock the ones you like and regenerate the rest (press Space), and copy HEX, RGB or HSL values.',
    title: 'Random Color Generator – Random HEX, Pastel & Vivid Colours',
    metaDescription:
      'Generate random colours with HEX, RGB and HSL codes: any, pastel, vivid, dark, light or one hue. Lock favourites, press Space to regenerate. Free and instant.',
    keywords: [
      'random color generator',
      'random hex color',
      'random colour',
      'pastel color generator',
      'color randomizer',
    ],
    relatedTools: [
      'color-palette-generator',
      'color-picker',
      'gradient-generator',
      'contrast-checker',
      'color-converter',
    ],
    component: 'random-color',
    howTo: [
      'Choose the kind of colour and how many you want.',
      'Press Space or click Generate; lock the swatches you want to keep.',
      'Copy a colour’s HEX code, or all codes at once.',
    ],
    about: [
      'Colours are generated in HSL — hue, saturation and lightness — which makes moods easy to control: pastels are light and moderately saturated, vivid colours are fully saturated at medium lightness, and “around one hue” keeps all colours within ±15° of the hue you choose.',
      'Each swatch shows whether black or white text is more readable on it, based on WCAG relative luminance. For a full accessibility check of a text and background pair, use the Contrast Checker.',
    ],
    faqs: [
      {
        q: 'How many hex colours are there?',
        a: '16,777,216 — 256 levels each of red, green and blue.',
      },
    ],
  },
  {
    slug: 'invoice-generator',
    category: 'security-generators',
    name: 'Invoice Generator (PDF)',
    icon: '🧾',
    shortDescription: 'Create a professional PDF invoice for free.',
    description:
      'Create a clean PDF invoice in minutes: your details and logo, the client, line items, tax or VAT, discount, currency, due date and payment notes. Totals update as you type, and you can keep the draft in your browser for next time.',
    title: 'Free Invoice Generator – Create & Download a PDF Invoice',
    metaDescription:
      'Free invoice generator: add your logo, client, items, tax/VAT and discount, choose the currency and download a professional PDF. No sign-up, nothing uploaded.',
    keywords: [
      'invoice generator',
      'free invoice maker',
      'invoice template',
      'create invoice pdf',
      'freelance invoice',
    ],
    relatedTools: [
      'time-card-calculator',
      'vat-calculator',
      'profit-margin-calculator',
      'email-signature-generator',
      'printable-calendar',
    ],
    component: 'invoice-generator',
    popular: true,
    howTo: [
      'Fill in the invoice number, dates, your details and the client’s.',
      'Add line items with quantity and unit price, then set tax, discount and currency.',
      'Add a logo and notes if you like, then click “Download PDF invoice”.',
    ],
    about: [
      'An invoice usually needs a unique number, issue and due dates, both parties’ names and addresses, a description of each item with quantity and price, the tax rate and amount, and the total. Many countries also require tax or VAT IDs and, for some businesses, specific wording — add those to the details or notes fields.',
      'The PDF is created in your browser, so client details stay on your device. Ticking “Remember this draft” saves it in this browser only. The built-in PDF font supports Latin letters including accents and €, £ and ¥ signs.',
    ],
    faqs: [
      {
        q: 'Is the invoice legally valid?',
        a: 'The format is standard, but legal requirements depend on your country and business. Check that you include every detail your tax authority asks for.',
      },
      {
        q: 'Can I number invoices automatically?',
        a: 'Tick “Remember this draft” and change the number each time — the rest of your details stay filled in.',
      },
    ],
  },
  {
    slug: 'email-signature-generator',
    category: 'security-generators',
    name: 'Email Signature Generator',
    icon: '✉️',
    shortDescription: 'Professional HTML email signatures for Gmail & Outlook.',
    description:
      'Create a professional email signature with your name, title, company, phone, website, photo or logo and social links. Pick a template and colour, then copy it straight into Gmail, Outlook or Apple Mail — or copy the HTML.',
    title:
      'Email Signature Generator – Free HTML Signature for Gmail & Outlook',
    metaDescription:
      'Free email signature generator: name, title, phone, photo, social links and brand colour in 3 templates. Copy into Gmail, Outlook or Apple Mail, or copy the HTML.',
    keywords: [
      'email signature generator',
      'email signature',
      'gmail signature',
      'outlook signature',
      'html email signature',
    ],
    relatedTools: [
      'invoice-generator',
      'qr-code-generator',
      'meta-tag-generator',
      'html-entity-encoder',
      'username-generator',
    ],
    component: 'email-signature',
    howTo: [
      'Fill in your details and pick a template and brand colour.',
      'Check the preview, then click “Copy signature”.',
      'Paste it into your email client’s signature settings (instructions below the preview).',
    ],
    about: [
      'Email clients ignore most modern CSS, so the signature is built the old-fashioned way: an HTML table with inline styles and web-safe fonts. That renders consistently in Gmail, Outlook, Apple Mail and on phones. Links are limited to http(s), tel: and mailto:, and every value is escaped.',
      'Photos and logos are loaded from a public URL rather than attached, which keeps emails small and avoids your logo appearing as an attachment. Keep the image square and around 160 × 160 pixels so it stays sharp on high-resolution screens.',
    ],
    faqs: [
      {
        q: 'Why doesn’t my photo show?',
        a: 'Use a public https image URL — not a file on your computer. Some clients hide images until the reader allows them.',
      },
      {
        q: 'Can I edit the signature later?',
        a: 'Change the fields here and copy it again, or edit the HTML directly in clients that support it.',
      },
    ],
  },
  {
    slug: 'password-strength-checker',
    category: 'security-generators',
    name: 'Password Strength Checker',
    icon: '🛡️',
    shortDescription: 'How strong is your password? Checked locally.',
    description:
      'Check how strong a password really is: estimated entropy, how long it would take to crack in different attack scenarios, and the patterns that weaken it — common passwords, dictionary words, keyboard runs, repeats and dates. Optionally check known breaches without revealing the password.',
    title: 'Password Strength Checker – How Long to Crack Your Password?',
    metaDescription:
      'Test your password strength locally: entropy, crack time, and weak patterns like common words, keyboard runs and dates. Optional private breach check (k-anonymity).',
    keywords: [
      'password strength checker',
      'password checker',
      'how secure is my password',
      'password strength test',
      'is my password strong',
    ],
    relatedTools: [
      'password-generator',
      'passphrase-generator',
      'bcrypt-generator',
      'totp-generator',
      'sha256-generator',
    ],
    component: 'password-strength',
    popular: true,
    howTo: [
      'Type a password — it is checked as you type and never leaves the page.',
      'Read the rating, crack-time estimates and the patterns that make it weaker.',
      'Optionally click “Check known breaches” to see if it appeared in leaked password lists.',
    ],
    about: [
      'Attackers don’t guess randomly: they try leaked passwords, dictionary words with common substitutions (P@ssw0rd), keyboard runs (qwerty), names and dates first. So the checker starts from the character-pool entropy and lowers it for every predictable pattern it finds, then estimates crack times for a rate-limited online attack, an offline attack on a slow hash like bcrypt, and an offline attack on a fast hash.',
      'The breach check is opt-in and uses Have I Been Pwned’s k-anonymity range API: your browser computes the SHA-1 hash, sends only its first 5 characters, receives every leaked hash starting with them, and compares the rest locally. Neither the password nor its full hash is sent. For the best protection use a long random password or passphrase per site in a password manager, plus two-factor authentication.',
    ],
    faqs: [
      {
        q: 'Is it safe to type my real password here?',
        a: 'The check runs in your browser and nothing is sent unless you click the breach check, which sends only a 5-character hash prefix. Still, the safest habit is to test a similar password, not your real one.',
      },
      {
        q: 'How long should a password be?',
        a: 'At least 12 characters, ideally 16+ or a passphrase of four or more random words. Length beats complexity.',
      },
    ],
  },
];
