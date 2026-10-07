// Site-wide FAQ, grouped by category. Rendered at /faq with FAQPage JSON-LD.
// Answers are plain text; `links` render as "Related:" links under the answer.

export type FaqItem = {
  q: string;
  a: string;
  links?: { href: string; label: string }[];
};
export type FaqGroup = {
  id: string;
  title: string;
  icon: string;
  items: FaqItem[];
};

export const FAQ_GROUPS: FaqGroup[] = [
  {
    id: 'general',
    title: 'General',
    icon: '💡',
    items: [
      {
        q: 'What is Emojar?',
        a: 'Emojar is a collection of free online tools that run in your web browser — image and PDF converters, developer utilities, text tools, calculators, unit converters, generators, timers and more — plus a searchable library of 3,790 emojis and emoji games.',
        links: [
          { href: '/online-tool', label: 'All online tools' },
          { href: '/emoji', label: 'Emoji search' },
        ],
      },
      {
        q: 'Is Emojar free?',
        a: 'Yes. Every tool, guide, emoji and game is free to use, with no usage limits, no watermarks and no premium tier.',
      },
      {
        q: 'Do I need an account?',
        a: 'No. There is no sign-up or login anywhere on Emojar. Open a tool and use it straight away.',
      },
      {
        q: 'Does Emojar work on my phone?',
        a: 'Yes. All tools work in modern mobile browsers on iPhone and Android, as well as on tablets and desktop computers. File tools accept photos straight from your camera roll.',
      },
      {
        q: 'Can I use the tools offline?',
        a: 'Mostly. Once a tool page has loaded, the processing itself does not need an internet connection because nothing is sent to a server. A few tools download an engine the first time you use them (for example OCR); after that they work offline too.',
      },
      {
        q: 'Which browsers are supported?',
        a: 'Current versions of Chrome, Edge, Firefox and Safari. A few features depend on the browser — for example the screen eyedropper in the Color Picker is only available in Chrome and Edge.',
      },
      {
        q: 'Can I suggest a new tool?',
        a: 'Please do. Send your idea through the contact page; tools that many people ask for are added first.',
        links: [{ href: '/contact', label: 'Contact' }],
      },
    ],
  },
  {
    id: 'privacy',
    title: 'Privacy & security',
    icon: '🔒',
    items: [
      {
        q: 'Are my files uploaded to a server?',
        a: 'No. Emojar tools process files and text inside your browser using built-in technologies such as the File API, Canvas, Web Workers, WebAssembly and the Web Crypto API. Your files never leave your device and nothing is stored.',
      },
      {
        q: 'Do any tools download something?',
        a: 'Yes, a few download a processing engine — never your data. Image to Text downloads the open-source Tesseract OCR engine and a language model the first time you use it. Text to Speech can use “online” voices from your browser vendor; those send the text to the vendor’s speech service, and they are labelled so you can choose an on-device voice instead.',
        links: [
          {
            href: '/online-tool/image-tools/image-to-text',
            label: 'Image to Text',
          },
          {
            href: '/online-tool/text-tools/text-to-speech',
            label: 'Text to Speech',
          },
        ],
      },
      {
        q: 'Is the text I type sent to analytics?',
        a: 'No. Analytics only records anonymous page views. What you type into a tool and the files you open are never included.',
      },
      {
        q: 'Are the passwords and keys I generate stored?',
        a: 'No. Passwords, passphrases, UUIDs and random strings are created on your device with the browser’s cryptographically secure random number generator and disappear when you close the page.',
        links: [
          {
            href: '/online-tool/security-generators/password-generator',
            label: 'Password Generator',
          },
        ],
      },
      {
        q: 'Is it safe to use Emojar with confidential documents?',
        a: 'That is exactly what it is designed for: because processing happens locally, contracts, IDs, bank statements and API tokens are never sent anywhere. As with any website, make sure you are on https://emojar.com.',
      },
      {
        q: 'Does Emojar use cookies?',
        a: 'Emojar itself only stores small preferences in your browser (for example your World Clock cities). Advertising and analytics partners may set cookies as described in the privacy policy.',
        links: [{ href: '/privacy', label: 'Privacy policy' }],
      },
    ],
  },
  {
    id: 'images',
    title: 'Image tools',
    icon: '🖼️',
    items: [
      {
        q: 'Which image formats are supported?',
        a: 'You can open JPG, PNG, WebP, GIF, BMP, SVG, AVIF (where your browser supports it), HEIC from iPhones, and PDF pages. Output formats are JPG, PNG, WebP and PDF.',
        links: [
          {
            href: '/online-tool/image-tools/image-converter',
            label: 'Image Converter',
          },
        ],
      },
      {
        q: 'How do I open iPhone HEIC photos on Windows?',
        a: 'Convert them to JPG with the HEIC to JPG tool. It converts many photos at once, keeps the quality you choose and removes location metadata in the process.',
        links: [
          {
            href: '/online-tool/image-tools/heic-to-jpg',
            label: 'HEIC to JPG',
          },
        ],
      },
      {
        q: 'How do I reduce a photo to 20 KB or 50 KB for an online form?',
        a: 'Use Compress Image to Exact Size: pick a preset such as 20, 50 or 100 KB (or type any limit) and the tool finds the highest quality that fits, reducing dimensions only if it must. The result is never larger than your limit.',
        links: [
          {
            href: '/online-tool/image-tools/compress-image-to-size',
            label: 'Compress Image to Exact Size',
          },
        ],
      },
      {
        q: 'How do I make a passport photo at home?',
        a: 'Take a front-facing photo against a plain light wall, then use the Passport Photo Maker: choose your country (for example 2 × 2 in for the US or 35 × 45 mm for the UK and EU), line the face up with the head guide and download a 300 DPI photo or a 4 × 6 in / A4 print sheet. Always check your government’s current photo rules.',
        links: [
          {
            href: '/online-tool/image-tools/passport-photo-maker',
            label: 'Passport Photo Maker',
          },
        ],
      },
      {
        q: 'Can a blurred or pixelated face be recovered?',
        a: 'Not from an image exported by the Blur & Pixelate tool — the original pixels in the hidden area are replaced. For short text such as account numbers, use the solid box option, because light pixelation of a few characters can sometimes be guessed.',
        links: [
          {
            href: '/online-tool/image-tools/blur-image',
            label: 'Blur & Pixelate Image',
          },
        ],
      },
      {
        q: 'In what order do I post an Instagram grid?',
        a: 'Instagram shows the newest post at the top left, so post the bottom-right tile first and the top-left tile last. The Image Grid Splitter numbers every tile in that posting order.',
        links: [
          {
            href: '/online-tool/image-tools/image-grid-splitter',
            label: 'Image Grid Splitter',
          },
        ],
      },
      {
        q: 'Which favicon files does a website need?',
        a: 'A favicon.ico (with 16, 32 and 48 px sizes inside), a 180 × 180 apple-touch-icon.png for iPhones and 192 and 512 px PNG icons referenced in a site.webmanifest. The Favicon Generator creates all of them plus the HTML from any image.',
        links: [
          {
            href: '/online-tool/image-tools/favicon-generator',
            label: 'Favicon Generator',
          },
        ],
      },
      {
        q: 'Is there a file size limit?',
        a: 'There is no fixed limit; the practical limit is your device’s memory. Phones handle photos of 50+ megapixels; extremely large images may fail on older devices.',
      },
      {
        q: 'Do image tools remove EXIF metadata?',
        a: 'Re-encoding an image in the browser drops EXIF data such as GPS location and camera details. To inspect or strip metadata deliberately, use the EXIF Viewer.',
        links: [
          {
            href: '/online-tool/image-tools/image-exif-viewer',
            label: 'EXIF Viewer',
          },
        ],
      },
    ],
  },
  {
    id: 'pdf',
    title: 'PDF tools',
    icon: '📄',
    items: [
      {
        q: 'Can I edit the existing text in a PDF?',
        a: 'Not directly — PDFs store text as positioned characters, not editable paragraphs. With Edit PDF you cover the old words with a white-out box and type new text on top, and you can add images and highlights. The covered text is hidden but still in the file.',
        links: [{ href: '/online-tool/pdf-tools/edit-pdf', label: 'Edit PDF' }],
      },
      {
        q: 'How do I fill in a PDF form without Adobe Acrobat?',
        a: 'Open it in Fill PDF Form: every fillable field — text boxes, checkboxes, radio buttons and drop-downs — appears as a normal web form. Type your answers, optionally flatten the form so they can’t be changed, and download the completed PDF.',
        links: [
          {
            href: '/online-tool/pdf-tools/fill-pdf-form',
            label: 'Fill PDF Form',
          },
        ],
      },
      {
        q: 'What is the difference between cropping and deleting PDF pages?',
        a: 'Deleting removes whole pages from the document. Cropping keeps every page but hides its edges — useful for trimming margins or scanner borders. Cropped-off content stays inside the file, so don’t use cropping to remove confidential information.',
        links: [
          {
            href: '/online-tool/pdf-tools/delete-pdf-pages',
            label: 'Delete PDF Pages',
          },
          { href: '/online-tool/pdf-tools/crop-pdf', label: 'Crop PDF' },
        ],
      },
      {
        q: 'How accurate is the Word to PDF converter?',
        a: 'Text, headings, lists, tables, links and images convert well. Complex Word layouts — text boxes, columns, headers and footers, exact fonts — are simplified. For the closest match, use “Print / Save as PDF”, which uses your browser’s own layout engine.',
        links: [
          { href: '/online-tool/pdf-tools/word-to-pdf', label: 'Word to PDF' },
        ],
      },
      {
        q: 'Can I edit password-protected PDFs?',
        a: 'Only after unlocking them with the password. Unlock PDF removes the password from a document you are allowed to open; it does not crack or guess passwords.',
        links: [
          { href: '/online-tool/pdf-tools/unlock-pdf', label: 'Unlock PDF' },
        ],
      },
      {
        q: 'Is a signature added with Sign PDF legally binding?',
        a: 'Sign PDF adds a visible electronic signature (a drawn or typed signature image). That is accepted for many everyday documents, but some contracts require an advanced or qualified, certificate-based signature. If in doubt, ask the party requesting your signature.',
        links: [{ href: '/online-tool/pdf-tools/sign-pdf', label: 'Sign PDF' }],
      },
      {
        q: 'Why won’t my PDF get much smaller?',
        a: 'Lossless compression only rewrites the file structure. Most of a PDF’s size usually comes from images, which can only shrink by re-rendering pages at lower quality — that is what Compress PDF’s “Strong” mode does, at the cost of selectable text.',
        links: [
          {
            href: '/online-tool/pdf-tools/compress-pdf',
            label: 'Compress PDF',
          },
        ],
      },
      {
        q: 'How strong is Protect PDF’s encryption?',
        a: 'It uses AES-256, the strongest encryption in the PDF standard, applied by qpdf running in your browser. The protection is only as strong as your password, so use 12+ characters or a passphrase.',
        links: [
          { href: '/online-tool/pdf-tools/protect-pdf', label: 'Protect PDF' },
        ],
      },
      {
        q: 'Can I extract text from a scanned PDF?',
        a: 'PDF to Text reads the text layer, which scanned PDFs don’t have. Convert the page to an image with PDF to PNG, then use Image to Text (OCR).',
        links: [
          {
            href: '/online-tool/image-tools/image-to-text',
            label: 'Image to Text',
          },
        ],
      },
    ],
  },
  {
    id: 'developer',
    title: 'Developer tools',
    icon: '🧑‍💻',
    items: [
      {
        q: 'Is it safe to paste API responses or JWTs?',
        a: 'Yes. Formatters, encoders and decoders run entirely in your browser, so tokens, keys and payloads are never transmitted. Still, avoid pasting production secrets into any website you don’t trust.',
        links: [
          {
            href: '/online-tool/developer-tools/jwt-decoder',
            label: 'JWT Decoder',
          },
        ],
      },
      {
        q: 'Which SQL dialects does the SQL Formatter support?',
        a: 'Standard SQL, PostgreSQL, MySQL, MariaDB, SQLite, SQL Server (T-SQL), Oracle PL/SQL, BigQuery, Snowflake and Redshift.',
        links: [
          {
            href: '/online-tool/developer-tools/sql-formatter',
            label: 'SQL Formatter',
          },
        ],
      },
      {
        q: 'Why does the JSON Formatter say my JSON is invalid?',
        a: 'The most common causes are trailing commas, single quotes, unquoted keys and comments, none of which standard JSON allows. The error message shows the line and column where parsing stopped.',
        links: [
          {
            href: '/online-tool/developer-tools/json-validator',
            label: 'JSON Validator',
          },
        ],
      },
      {
        q: 'Does the Regex Tester use the same engine as my code?',
        a: 'It uses your browser’s JavaScript regular-expression engine, so results match JavaScript and Node.js. Other languages (Python, PCRE) differ in some features.',
        links: [
          {
            href: '/online-tool/developer-tools/regex-tester',
            label: 'Regex Tester',
          },
        ],
      },
      {
        q: 'What bcrypt cost factor should I use?',
        a: 'Pick the highest cost that keeps hashing around 100–300 ms on your server — usually 10 to 12 today. Each step doubles the time, which also doubles the work for anyone guessing passwords from a stolen database.',
        links: [
          {
            href: '/online-tool/developer-tools/bcrypt-generator',
            label: 'Bcrypt Hash Generator',
          },
        ],
      },
      {
        q: 'Is it safe to enter a 2FA secret in the TOTP generator?',
        a: 'The page calculates codes in your browser with Web Crypto and stores nothing, so the secret never leaves the tab. Still, the secret is as sensitive as a password: use the tool for testing and backup recovery, and a dedicated authenticator app for everyday logins.',
        links: [
          {
            href: '/online-tool/developer-tools/totp-generator',
            label: 'TOTP / 2FA Code Generator',
          },
        ],
      },
      {
        q: 'What is the difference between CIDR notation and a subnet mask?',
        a: 'They describe the same thing. /24 means the first 24 bits are the network, which written as a mask is 255.255.255.0. CIDR is shorter and also works for IPv6.',
        links: [
          {
            href: '/online-tool/developer-tools/subnet-calculator',
            label: 'Subnet Calculator',
          },
        ],
      },
      {
        q: 'Why use JSON Diff instead of Text Diff for JSON?',
        a: 'Text Diff compares lines, so reformatting or reordering keys shows up as changes. JSON Diff parses both documents and reports only real value changes, each with its path such as $.user.email.',
        links: [
          {
            href: '/online-tool/developer-tools/json-diff',
            label: 'JSON Diff',
          },
        ],
      },
    ],
  },
  {
    id: 'text',
    title: 'Text tools',
    icon: '📝',
    items: [
      {
        q: 'How does the Word Counter count words?',
        a: 'A word is any run of letters or numbers, including contractions and hyphenated words, which matches Microsoft Word and Google Docs for typical text.',
        links: [
          {
            href: '/online-tool/text-tools/word-counter',
            label: 'Word Counter',
          },
        ],
      },
      {
        q: 'Why do fancy fonts look like boxes on some devices?',
        a: 'Fancy text uses special Unicode characters rather than real fonts. If a device lacks a font containing a symbol, it shows a box. Bold, italic and script styles are the most widely supported.',
        links: [
          {
            href: '/online-tool/text-tools/fancy-text-generator',
            label: 'Fancy Text Generator',
          },
        ],
      },
      {
        q: 'What is an invisible character and why do apps accept it?',
        a: 'It is a real Unicode character that draws nothing, such as Hangul Filler (U+3164) or Braille Pattern Blank (U+2800). Apps that reject an empty name or message usually accept it because it is not an ordinary space. The same page can also find hidden zero-width characters in text you paste.',
        links: [
          {
            href: '/online-tool/text-tools/invisible-character',
            label: 'Invisible Character',
          },
        ],
      },
      {
        q: 'What is a good readability score?',
        a: 'For general web content, aim for a Flesch Reading Ease of 60–70, roughly US grade 8–9. Shorter sentences and shorter everyday words raise the score; the formulas are designed for English.',
        links: [
          {
            href: '/online-tool/text-tools/readability-score',
            label: 'Readability Score Checker',
          },
        ],
      },
      {
        q: 'Does strikethrough or underlined text work on every platform?',
        a: 'It works in most modern apps because the line is a Unicode combining mark added after each letter, not formatting. Some fonts draw it slightly off, some sites strip it, and each mark counts towards character limits.',
        links: [
          {
            href: '/online-tool/text-tools/strikethrough-text',
            label: 'Strikethrough Text Generator',
          },
        ],
      },
      {
        q: 'Can I download Text to Speech audio as MP3?',
        a: 'No — browsers play synthesized speech but do not let web pages record it. You can listen, pause and change voices freely.',
      },
    ],
  },
  {
    id: 'calculators',
    title: 'Calculators & converters',
    icon: '🧮',
    items: [
      {
        q: 'What is the difference between profit margin and markup?',
        a: 'Margin is profit as a share of the selling price; markup is profit as a share of the cost. Buying at 60 and selling at 100 is a 40 % margin but a 66.7 % markup.',
        links: [
          {
            href: '/online-tool/calculators/profit-margin-calculator',
            label: 'Profit Margin Calculator',
          },
        ],
      },
      {
        q: 'Does the mortgage calculator include taxes, insurance and PMI?',
        a: 'Yes. It adds property tax, home insurance, HOA fees and PMI (charged until you owe 80 % of the home price) to principal and interest, and shows how extra payments shorten the loan. Use your own local rates for an accurate estimate.',
        links: [
          {
            href: '/online-tool/calculators/mortgage-calculator',
            label: 'Mortgage Calculator',
          },
        ],
      },
      {
        q: 'What is the 4 % rule for retirement?',
        a: 'A rule of thumb that withdrawing about 4 % of your savings in the first year of retirement, then adjusting for inflation, is likely to last around 30 years. The retirement calculator lets you change the rate and checks how long your desired income lasts — an estimate, not financial advice.',
        links: [
          {
            href: '/online-tool/calculators/retirement-calculator',
            label: 'Retirement Calculator',
          },
        ],
      },
      {
        q: 'How accurate is a tape-measure body fat estimate?',
        a: 'The U.S. Navy method is usually within about 3–4 percentage points of lab methods like DEXA, as long as you measure carefully. It is less accurate for very muscular or very lean people and is not medical advice.',
        links: [
          {
            href: '/online-tool/calculators/body-fat-calculator',
            label: 'Body Fat Calculator',
          },
        ],
      },
      {
        q: 'How accurate are the calculators?',
        a: 'They use standard published formulas (for example the Mifflin-St Jeor equation for calories and standard amortization for loans) and full floating-point precision. Results are rounded only for display.',
      },
      {
        q: 'Are health and finance results professional advice?',
        a: 'No. BMI, calorie, pregnancy, ovulation, loan and interest results are estimates for planning. Talk to a doctor or financial adviser before making decisions.',
      },
      {
        q: 'Does 1 KB mean 1,000 or 1,024 bytes?',
        a: 'In the Data Storage Converter, KB/MB/GB are decimal (1,000) and KiB/MiB/GiB are binary (1,024). The image “compress to KB” tool uses 1 KB = 1,024 bytes, as most upload forms do.',
        links: [
          {
            href: '/online-tool/unit-converters/data-storage-converter',
            label: 'Data Storage Converter',
          },
        ],
      },
      {
        q: 'How do I write a number in words for a cheque?',
        a: 'Use Number to Words in cheque mode: it writes the whole amount in words and the cents as a fraction, e.g. “One thousand two hundred fifty dollars and 50/100”.',
        links: [
          {
            href: '/online-tool/unit-converters/number-to-words',
            label: 'Number to Words',
          },
        ],
      },
      {
        q: 'How many grams are in a cup?',
        a: 'It depends on the ingredient, because a cup measures volume: about 120 g of all-purpose flour, 198 g of sugar, 227 g of butter and 237 g of water per US cup. The Cooking Measurement Converter uses a density for each ingredient.',
        links: [
          {
            href: '/online-tool/unit-converters/cooking-measurement-converter',
            label: 'Cooking Measurement Converter',
          },
        ],
      },
      {
        q: 'Why are UK and US miles per gallon different?',
        a: 'A UK (imperial) gallon is 4.546 liters and a US gallon 3.785 liters, so the same car scores about 20 % more mpg in the UK. Converting to L/100 km avoids the confusion.',
        links: [
          {
            href: '/online-tool/unit-converters/fuel-economy-converter',
            label: 'Fuel Economy Converter',
          },
        ],
      },
      {
        q: 'Are shoe and clothing size conversions exact?',
        a: 'No — the charts are the standard conversions, but brands cut differently. Measure your foot or body and use the measurement lookup, then check the brand’s own chart when buying.',
        links: [
          {
            href: '/online-tool/unit-converters/shoe-size-converter',
            label: 'Shoe Size Converter',
          },
          {
            href: '/online-tool/unit-converters/clothing-size-converter',
            label: 'Clothing Size Converter',
          },
        ],
      },
    ],
  },
  {
    id: 'generators',
    title: 'Generators, timers & randomness',
    icon: '🎲',
    items: [
      {
        q: 'Are the wheel spinner, dice and coin flip really random?',
        a: 'Yes. Results come from the browser’s cryptographically secure random number generator with unbiased sampling, so every option has exactly the same chance.',
        links: [
          {
            href: '/online-tool/security-generators/wheel-spinner',
            label: 'Wheel Spinner',
          },
        ],
      },
      {
        q: 'Do QR codes made on Emojar expire?',
        a: 'No. They are static QR codes with your content encoded directly — there is no redirect through our servers, so they work forever and nothing is tracked.',
        links: [
          {
            href: '/online-tool/security-generators/qr-code-generator',
            label: 'QR Code Generator',
          },
        ],
      },
      {
        q: 'Does the timer keep running if I switch tabs?',
        a: 'Yes. Timers count down to a fixed end time, so they stay accurate in background tabs. Allow notifications to get an alert when the tab is hidden.',
        links: [
          {
            href: '/online-tool/date-time-tools/online-timer',
            label: 'Online Timer',
          },
        ],
      },
      {
        q: 'Does the Password Strength Checker send my password anywhere?',
        a: 'No. The rating is calculated in your browser. The optional breach check sends only the first 5 characters of the password’s SHA-1 hash to Have I Been Pwned and compares the rest on your device (k-anonymity).',
        links: [
          {
            href: '/online-tool/security-generators/password-strength-checker',
            label: 'Password Strength Checker',
          },
        ],
      },
    ],
  },
  {
    id: 'media',
    title: 'Audio, video & device tests',
    icon: '🎬',
    items: [
      {
        q: 'Which video formats can be converted to MP3 or GIF?',
        a: 'Any format your browser can play: MP4 (H.264/AAC) and WebM everywhere, and MOV in Safari. Keep GIF clips short and narrow — GIFs grow large quickly.',
        links: [
          {
            href: '/online-tool/audio-video-tools/mp4-to-mp3',
            label: 'MP4 to MP3',
          },
          {
            href: '/online-tool/audio-video-tools/video-to-gif',
            label: 'Video to GIF',
          },
        ],
      },
      {
        q: 'Is my webcam or microphone recorded?',
        a: 'No. The tests show the live stream on the page only. The optional 5-second microphone clip is kept in your browser’s memory for playback and is never uploaded.',
        links: [
          {
            href: '/online-tool/device-tests/webcam-test',
            label: 'Webcam Test',
          },
          {
            href: '/online-tool/device-tests/microphone-test',
            label: 'Microphone Test',
          },
        ],
      },
      {
        q: 'My camera shows a black picture — what can I do?',
        a: 'Another app (Zoom, Teams, OBS) may be using it, or camera access may be blocked in your browser or operating system privacy settings. Close other apps, allow access via the icon in the address bar, and reload.',
      },
      {
        q: 'What is the difference between a dead pixel and a stuck pixel?',
        a: 'A dead pixel never lights up and shows as a black dot on bright colours. A stuck pixel is stuck on one colour (red, green, blue or white) and shows on black. Stuck pixels sometimes recover with a flashing fixer; dead pixels usually need a warranty repair.',
        links: [
          {
            href: '/online-tool/device-tests/dead-pixel-test',
            label: 'Dead Pixel Test',
          },
        ],
      },
      {
        q: 'Why doesn’t the keyboard tester detect the Fn key?',
        a: 'Fn is handled inside the keyboard and never reaches the computer, and the operating system keeps some shortcuts (such as Win + L or ⌘ + Tab) for itself. Those keys can work fine even though no website can see them.',
        links: [
          {
            href: '/online-tool/device-tests/keyboard-tester',
            label: 'Keyboard Tester',
          },
        ],
      },
      {
        q: 'Why does my screen resolution look lower than my monitor’s?',
        a: 'Browsers report CSS pixels, which are scaled by display scaling and browser zoom. A 4K screen at 200 % scaling reports 1920 × 1080; multiply by the device pixel ratio to get the physical pixels.',
        links: [
          {
            href: '/online-tool/device-tests/screen-resolution-checker',
            label: 'Screen Resolution Checker',
          },
        ],
      },
      {
        q: 'Will the online alarm clock ring in a background tab?',
        a: 'Yes, as long as the tab stays open and the device is awake. Browsers can’t ring from a closed tab, and phones may pause pages when the screen locks — use your phone’s alarm for anything critical.',
        links: [
          {
            href: '/online-tool/date-time-tools/alarm-clock',
            label: 'Online Alarm Clock',
          },
        ],
      },
      {
        q: 'Which browsers can compress videos?',
        a: 'The Video Compressor uses the WebCodecs API, available in recent Chrome, Edge, Safari (16.4+) and Firefox (130+). The video is re-encoded on your device and never uploaded.',
        links: [
          {
            href: '/online-tool/audio-video-tools/video-compressor',
            label: 'Video Compressor',
          },
        ],
      },
      {
        q: 'Can I record my screen on a phone?',
        a: 'Mostly no — phone browsers don’t allow screen capture from a web page. Use the built-in screen recording of iOS or Android; on desktop the Screen Recorder works in all major browsers.',
        links: [
          {
            href: '/online-tool/audio-video-tools/screen-recorder',
            label: 'Screen Recorder',
          },
        ],
      },
    ],
  },
  {
    id: 'emoji',
    title: 'Emoji & games',
    icon: '😀',
    items: [
      {
        q: 'Where is the emoji search?',
        a: 'Emoji search and copy now lives at /emoji. All 3,790 emojis, categories, holiday collections, emoji tools and games are still available.',
        links: [
          { href: '/emoji', label: 'Emoji search' },
          { href: '/games', label: 'Emoji games' },
        ],
      },
      {
        q: 'How do I copy an emoji?',
        a: 'Click or tap any emoji and it is copied to your clipboard, ready to paste into a message, document or social post.',
      },
      {
        q: 'Are game scores saved?',
        a: 'Scores and high scores are saved in your own browser (local storage) only. Clearing your browser data resets them.',
      },
    ],
  },
  {
    id: 'support',
    title: 'Ads, support & contact',
    icon: '💬',
    items: [
      {
        q: 'How is Emojar funded?',
        a: 'Emojar is funded by advertising, which keeps every tool free. Tools never ask for payment.',
      },
      {
        q: 'I found a bug — how do I report it?',
        a: 'Use the contact page and mention the tool, your browser and what happened. Screenshots help.',
        links: [{ href: '/contact', label: 'Contact' }],
      },
      {
        q: 'Who makes Emojar?',
        a: 'Emojar is built and maintained by Siavash Ghanbari in Berlin.',
        links: [{ href: '/about', label: 'About Emojar' }],
      },
    ],
  },
];

export function allFaqItems(): FaqItem[] {
  return FAQ_GROUPS.flatMap((g) => g.items);
}
