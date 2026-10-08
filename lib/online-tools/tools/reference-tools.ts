import type { ToolDefinition } from '../types';

export const REFERENCE_TOOLS: ToolDefinition[] = [
  {
    slug: 'periodic-table',
    category: 'reference-tools',
    name: 'Interactive Periodic Table',
    icon: '⚛️',
    shortDescription: 'Explore all 118 chemical elements and their properties.',
    description:
      'An interactive periodic table of all 118 elements. Click any element for its atomic mass, electron configuration, electronegativity, melting and boiling points, density, state, discovery year and discoverer — and filter by period, group, block, category or state.',
    title: 'Interactive Periodic Table – All 118 Elements & Properties',
    metaDescription:
      'Free interactive periodic table: click any of the 118 chemical elements for atomic mass, electron configuration, melting point, density and discovery. Search and filter.',
    keywords: [
      'periodic table',
      'interactive periodic table',
      'chemical elements',
      'chemistry',
      'atomic number',
      'atomic mass',
      'elements chart',
      'electron configuration',
    ],
    relatedTools: [
      'molar-mass-calculator',
      'number-base-converter',
      'temperature-converter',
      'weight-converter',
      'math-symbols',
    ],
    component: 'periodic-table',
    popular: true,
    howTo: [
      'Click or tap an element (or Tab to it and press Enter) to open its details.',
      'Search by name, symbol or atomic number — matches are outlined and the rest fade.',
      'Filter by period, group, block, category or state at room temperature, or click a category in the legend.',
      'On a phone, scroll the table sideways or switch to the list view.',
    ],
    about: [
      'The periodic table arranges the elements by atomic number (the number of protons) into 7 periods (rows) and 18 groups (columns). Elements in the same group have the same number of outer electrons, so they behave alike: the alkali metals in group 1 all react with water, the noble gases in group 18 hardly react at all. The two rows below the table — the lanthanides and actinides — are the f-block, pulled out so the table stays a readable width.',
      'Atomic masses are IUPAC standard atomic weights. Radioactive elements without a stable isotope have no standard weight, so the table shows the mass number of the longest-lived isotope in brackets, such as [97] for technetium-97 or [294] for oganesson. Melting and boiling points are in kelvin and degrees Celsius; values for the heaviest elements are predictions or unknown because only a few atoms have ever been made.',
      'All data is built into the page from the PubChem periodic table (a public-domain US government source), so it works offline and nothing is looked up as you browse.',
    ],
    faqs: [
      {
        q: 'How many elements are there?',
        a: '118, from hydrogen (1) to oganesson (118). The last four — nihonium, moscovium, tennessine and oganesson — were named in 2016.',
      },
      {
        q: 'Why are some atomic masses in brackets?',
        a: 'Elements such as technetium, promethium and everything after bismuth (except thorium, protactinium and uranium) have no stable isotopes, so there is no standard atomic weight. The bracketed number is the mass number of the longest-lived isotope.',
      },
      {
        q: 'Which elements are liquid at room temperature?',
        a: 'Only mercury and bromine. Caesium, gallium and francium melt just above room temperature, so they can turn liquid on a hot day or in your hand (gallium).',
      },
      {
        q: 'What are the s, p, d and f blocks?',
        a: 'They name the electron subshell being filled: s-block (groups 1–2 plus helium), p-block (groups 13–18), d-block (transition metals, groups 3–12) and f-block (lanthanides and actinides).',
      },
    ],
  },
  {
    slug: 'country-explorer',
    category: 'reference-tools',
    name: 'Country Explorer',
    icon: '🌍',
    shortDescription:
      'Capitals, ISO codes, currencies, calling codes and more for every country.',
    description:
      'Look up any of 250 countries and territories: capital, continent and region, ISO 3166 alpha-2 and alpha-3 codes, currency, languages, calling code, internet domain, time zones, driving side, population, area and coordinates. Search by name, capital, code or currency.',
    title: 'Country Explorer – Capitals, ISO Codes, Currencies & Calling Codes',
    metaDescription:
      'Search every country: capital, ISO alpha-2/alpha-3 codes, currency, languages, calling code, TLD, time zones, driving side, population and area. Copy codes in one click.',
    keywords: [
      'country codes',
      'iso country codes',
      'list of countries',
      'country capitals',
      'calling codes',
      'country currency',
      'country tld',
      'iso 3166',
    ],
    relatedTools: [
      'flag-explorer',
      'world-time-zone-map',
      'timezone-converter',
      'length-converter',
      'world-clock',
    ],
    component: 'country-explorer',
    howTo: [
      'Search by country name, capital, ISO code (DE, DEU), currency (EUR) or calling code (+44).',
      'Narrow the list with the continent, region, currency, language and driving-side filters.',
      'Click a country card for the full details.',
      'Use the copy buttons for the ISO codes, calling code, currency code or domain.',
    ],
    about: [
      'ISO 3166-1 defines the country codes used almost everywhere: alpha-2 codes such as DE and JP appear in domain names, passports and payment systems, and alpha-3 codes such as DEU and JPN in statistics and sports. Currency codes (ISO 4217) like EUR and JPY are what banks and price feeds use.',
      'Country facts come from GeoNames (CC BY 4.0) with regions and centre coordinates from Natural Earth and time zones from the IANA time-zone database. Population figures are approximate and change every year; a few territories have no permanent population. Names follow GeoNames and don’t take a position on disputed borders.',
    ],
    faqs: [
      {
        q: 'What is the difference between ISO alpha-2 and alpha-3?',
        a: 'Both identify the same country. Alpha-2 is two letters (FR) and is used for internet domains and most software; alpha-3 is three letters (FRA) and is easier to recognise at a glance, so it is common in statistics and the Olympics.',
      },
      {
        q: 'Which countries drive on the left?',
        a: 'About 75, including the UK, Ireland, Japan, India, Australia, New Zealand, South Africa, Thailand and many Caribbean islands. Filter by “Driving side: Left” to see them all.',
      },
      {
        q: 'Is the data looked up online?',
        a: 'No. The full dataset is part of the page, so searching and filtering happen in your browser.',
      },
    ],
  },
  {
    slug: 'flag-explorer',
    category: 'reference-tools',
    name: 'Flag Explorer',
    icon: '🏳️',
    shortDescription:
      'Browse and search the flags of the world, then quiz yourself.',
    description:
      'Browse the flags of 250 countries and territories in a grid or compact list, filter by continent and region, search by country, capital or ISO code, and click any flag for country details. A quick multiple-choice quiz tests what you’ve learned.',
    title: 'Flag Explorer – Flags of the World with Names & Codes',
    metaDescription:
      'All the world’s flags in one place: search by country, capital or ISO code, filter by continent and region, see country details and test yourself with a flag quiz.',
    keywords: [
      'flags of the world',
      'country flags',
      'world flags',
      'flag quiz',
      'flag emoji',
      'flags list',
    ],
    relatedTools: [
      'country-explorer',
      'world-time-zone-map',
      'world-clock',
      'unicode-character-explorer',
    ],
    component: 'flag-explorer',
    howTo: [
      'Scroll the grid or switch to the compact list with capitals and codes.',
      'Filter by continent and region, or search for a country, capital or ISO code.',
      'Click a flag for the country’s details and copy buttons.',
      'Press “Quiz me” for 10 multiple-choice questions from the flags you’ve filtered.',
    ],
    about: [
      'Flags are shown as emoji, which are built from two “regional indicator” letters matching the country’s ISO code — 🇩🇪 is D + E. That keeps the page light and lets you copy a flag straight into a message. Windows doesn’t draw flag emoji and shows the two letters instead, which is why the ISO code is always printed next to each flag.',
      'Filtering by continent or region also limits the quiz, so you can practise one part of the world at a time. For a longer game, try Guess the Flag in the games section.',
    ],
    faqs: [
      {
        q: 'Why do I see letters instead of flags?',
        a: 'Windows has no flag emoji, so it shows the two regional-indicator letters (for example DE). macOS, iOS, Android and Linux show the flags.',
      },
      {
        q: 'Can I copy a flag emoji?',
        a: 'Yes — open a country and use the “Flag emoji” copy button.',
      },
    ],
  },
  {
    slug: 'keyboard-shortcuts',
    category: 'reference-tools',
    name: 'Keyboard Shortcut Reference',
    icon: '⌨️',
    shortDescription:
      'Search shortcuts for Windows, macOS, Linux and every major browser.',
    description:
      'Find the keyboard shortcut for anything — copy, screenshots, reopening a closed tab, private windows, developer tools — on Windows, macOS or Linux, and in Chrome, Firefox, Edge and Safari. Switch platform to see the matching keys.',
    title: 'Keyboard Shortcuts – Windows, Mac, Linux & Browser Shortcuts',
    metaDescription:
      'Searchable keyboard shortcut list for Windows, macOS and Linux plus Chrome, Firefox, Edge and Safari: copy, paste, screenshots, tabs, incognito, dev tools and more.',
    keywords: [
      'keyboard shortcuts',
      'shortcut keys',
      'mac keyboard shortcuts',
      'windows shortcuts',
      'chrome shortcuts',
      'screenshot shortcut',
      'hotkeys',
    ],
    relatedTools: [
      'keyboard-tester',
      'what-is-my-browser',
      'special-characters',
    ],
    component: 'keyboard-shortcuts',
    howTo: [
      'Pick your platform — it’s detected automatically, but you can switch.',
      'Choose an app (or “Everything”) and optionally a category.',
      'Search for what you want to do, like “screenshot” or “reopen tab”.',
      'Click a shortcut to copy its key combination.',
    ],
    about: [
      'On a Mac, Command (⌘) does most of what Ctrl does on Windows and Linux, and Option (⌥) plays the part of Alt. Browser shortcuts are mostly shared by Chrome and Edge, which are built on the same engine; Firefox and Safari differ in places, such as Ctrl + Shift + P for a private window in Firefox.',
      'The list covers Windows 11, recent macOS versions and the GNOME desktop used by Ubuntu and Fedora. Some laptops need Fn for the F-keys, and shortcuts can be changed in system settings, so if one doesn’t work it may have been reassigned.',
    ],
    faqs: [
      {
        q: 'How do I take a screenshot of part of the screen?',
        a: 'Windows: Win + Shift + S. macOS: Cmd + Shift + 4. Ubuntu/GNOME: Print Screen opens the screenshot tool.',
      },
      {
        q: 'How do I reopen a tab I closed by mistake?',
        a: 'Ctrl + Shift + T on Windows and Linux, Cmd + Shift + T on a Mac — in Chrome, Firefox, Edge and Safari alike.',
      },
      {
        q: 'Does this page record my key presses?',
        a: 'No. It is a static reference; to check that your keys work, use the Keyboard Tester.',
      },
    ],
  },
  {
    slug: 'unicode-character-explorer',
    category: 'reference-tools',
    alsoIn: ['developer-tools', 'text-tools'],
    name: 'Unicode Character Explorer',
    icon: '🔣',
    shortDescription:
      'Search and inspect any Unicode character, block or code point.',
    description:
      'Search every Unicode 18 character by name, code point, block or by pasting it, and see its official name, block, general category, UTF-8 bytes, UTF-16 code units and HTML, CSS and JavaScript escapes — each with a copy button. Browse all 353 blocks as a character grid.',
    title: 'Unicode Character Explorer – Search Characters & Code Points',
    metaDescription:
      'Look up any Unicode character: official name, code point, block, category, UTF-8 and UTF-16 bytes and HTML entity. Search by name or paste a character. Copy in one click.',
    keywords: [
      'unicode lookup',
      'unicode character search',
      'unicode table',
      'code point',
      'utf-8 bytes',
      'unicode name',
      'character map',
    ],
    relatedTools: [
      'html-entity-reference',
      'math-symbols',
      'ascii-table',
      'special-characters',
      'invisible-character',
    ],
    component: 'unicode-explorer',
    howTo: [
      'Paste a character, type words from its name (“snowman”), or a code point like U+2603.',
      'Or pick a Unicode block from the list and browse its characters.',
      'Click a character to see its name, category, encodings and escapes.',
      'Copy the character, code point, HTML entity or UTF-8 bytes with one click.',
    ],
    about: [
      'Unicode gives every character a number called a code point, written U+ followed by hex digits: “é” is U+00E9 and “😀” is U+1F600. Encodings turn that number into bytes — UTF-8 uses 1 to 4 bytes and is what the web runs on; UTF-16, used inside JavaScript and Windows, uses one or two 16-bit units (a “surrogate pair” for anything above U+FFFF).',
      'Characters are grouped into blocks such as Latin-1 Supplement, Arrows or Mathematical Operators, and each has a general category (letter, number, punctuation, symbol, mark …). Names come from the official Unicode Character Database; the list of names (about 170 KB compressed) is downloaded from this site when the page opens, so searching by name never sends what you type anywhere.',
    ],
    faqs: [
      {
        q: 'How do I type a Unicode character?',
        a: 'Copy it here and paste it. On Windows you can also hold Alt and type the decimal code on the numeric keypad in some apps; on macOS enable the Unicode Hex Input keyboard and hold Option while typing the hex code.',
      },
      {
        q: 'Why do some characters show as boxes?',
        a: 'Your device has no font containing that character — common for new emoji and rare scripts. The code point and name are still correct.',
      },
      {
        q: 'What’s the difference between a code point and UTF-8?',
        a: 'The code point is the character’s number; UTF-8 is how that number is stored as bytes. U+00E9 (é) is stored as the two bytes C3 A9 in UTF-8.',
      },
    ],
  },
  {
    slug: 'math-symbols',
    category: 'reference-tools',
    alsoIn: ['text-tools'],
    name: 'Math Symbols Reference',
    icon: '∑',
    shortDescription: 'Copy math symbols with their names, Unicode and LaTeX.',
    description:
      'A searchable library of over 300 mathematical symbols — arithmetic, algebra, calculus, geometry, logic, set theory, probability, Greek letters, relations, operators and arrows — with each symbol’s name, Unicode code point, LaTeX command and HTML entity, ready to copy.',
    title: 'Math Symbols – Copy & Paste with LaTeX & Unicode',
    metaDescription:
      'Copy and paste math symbols like ∑ ∫ √ ≠ ≤ ∈ ∞ π with their names, Unicode code points, LaTeX commands and HTML entities. Search by name or LaTeX.',
    keywords: [
      'math symbols',
      'mathematical symbols',
      'latex symbols',
      'copy paste math symbols',
      'greek letters',
      'set theory symbols',
      'logic symbols',
      'unicode math symbols',
    ],
    relatedTools: [
      'special-characters',
      'unicode-character-explorer',
      'html-entity-reference',
      'scientific-calculator',
      'fraction-calculator',
    ],
    component: 'math-symbols',
    howTo: [
      'Pick a category such as Calculus or Greek letters, or search by name (“integral”), LaTeX (\\leq) or the symbol itself.',
      'Click a symbol to copy it.',
      'Use the small buttons to copy its Unicode code point, LaTeX command or HTML entity.',
    ],
    about: [
      'Pasting the symbol itself works in documents, chats and code comments. In LaTeX, use the command — \\sum, \\int, \\in — inside a maths environment; some need the amssymb package (such as \\mathbb{R} for ℝ). In HTML, the entity or numeric reference keeps the source readable.',
      'Several symbols look alike but mean different things: the Greek capital Σ is a letter while ∑ is the summation operator, and ∆ (increment) is not the same character as Δ. Choose the one whose name matches what you mean so screen readers and search engines read it correctly.',
    ],
    faqs: [
      {
        q: 'How do I type the not-equal sign?',
        a: 'Copy ≠ here. In LaTeX write \\neq; in HTML &ne;. On a Mac keyboard, Option + = types it.',
      },
      {
        q: 'Why is there no LaTeX for some symbols?',
        a: 'A few symbols have no command in standard LaTeX plus amsmath/amssymb. They can still be pasted directly if your LaTeX setup uses a Unicode engine such as XeLaTeX or LuaLaTeX.',
      },
    ],
    variants: [
      {
        slug: 'greek-letters',
        name: 'Greek Letters',
        title: 'Greek Alphabet – Copy Greek Letters α β γ Δ Ω with LaTeX',
        metaDescription:
          'Copy and paste all Greek letters used in maths and science — α β γ δ ε θ λ μ π σ φ ω and capitals — with names, Unicode and LaTeX commands.',
        description:
          'Every Greek letter used in maths, physics and engineering — lowercase, capitals and variant forms like ϵ and ϕ — with its name, Unicode code point and LaTeX command. Click a letter to copy it.',
        config: { init_category: 'greek' },
        keywords: [
          'greek letters',
          'greek alphabet',
          'alpha beta gamma',
          'greek symbols latex',
        ],
      },
    ],
  },
  {
    slug: 'measurement-reference',
    category: 'reference-tools',
    name: 'Measurement Reference',
    icon: '📐',
    shortDescription:
      'Paper sizes, aspect ratios, resolutions, type units and social image sizes.',
    description:
      'A visual cheat sheet for the dimensions you look up again and again: A0–A6, Letter, Legal and Tabloid paper drawn to scale in mm, inches, points and pixels; screen aspect ratios; common resolutions from VGA to 8K; px, pt, em and rem; and social media image sizes.',
    title: 'Measurement Reference – Paper Sizes, Aspect Ratios & Resolutions',
    metaDescription:
      'Visual reference for A4, Letter and other paper sizes in mm, inches and pixels, plus 16:9 and other aspect ratios, screen resolutions, px/pt/rem and social image sizes.',
    keywords: [
      'paper sizes',
      'a4 size',
      'a4 dimensions',
      'letter size',
      'aspect ratios',
      'screen resolutions',
      'px to pt',
      'social media image sizes',
    ],
    relatedTools: [
      'aspect-ratio-calculator',
      'css-unit-visualizer',
      'social-media-image-resizer',
      'image-resizer',
      'length-converter',
    ],
    component: 'measurement-reference',
    howTo: [
      'Choose a section: paper sizes, aspect ratios, screen and image sizes, typography units or social media.',
      'Click a paper size to see it highlighted to scale with its measurements.',
      'Click any value to copy it.',
    ],
    about: [
      'ISO 216 A sizes all share the ratio 1 : √2 (about 1 : 1.414): cut an A4 sheet in half and you get two A5 sheets of exactly the same shape. A0 has an area of one square metre. North America uses Letter (8.5 × 11 in), Legal (8.5 × 14 in) and Tabloid (11 × 17 in) instead, which have different ratios.',
      'For print, multiply inches by the resolution: A4 at 300 dpi is 2480 × 3508 pixels. Screens and video are described by aspect ratio — 16:9 for HD and 4K, 9:16 for phone-shaped stories — and by pixel count. In CSS, 1 inch is defined as 96 px and 72 pt regardless of the physical screen.',
    ],
    faqs: [
      {
        q: 'What size is A4 in inches and pixels?',
        a: '210 × 297 mm is 8.27 × 11.69 inches — 2480 × 3508 px at 300 dpi or 794 × 1123 px at 96 dpi.',
      },
      {
        q: 'Is Letter the same as A4?',
        a: 'No. Letter (216 × 279 mm) is about 6 mm wider and 18 mm shorter than A4 (210 × 297 mm), so documents can shift when printed on the other size.',
      },
      {
        q: 'How many pixels is 1 pt?',
        a: 'In CSS and most design tools, 1 pt = 1.333 px (because 1 in = 72 pt = 96 px). 12 pt text is 16 px.',
      },
    ],
    variants: [
      {
        slug: 'a4-paper-size',
        name: 'A4 Paper Size',
        title: 'A4 Paper Size – Dimensions in mm, cm, Inches & Pixels',
        metaDescription:
          'A4 is 210 × 297 mm (8.27 × 11.69 in). See A4 in cm, inches, points and pixels at 300 and 96 dpi, drawn to scale next to A3, A5 and US Letter.',
        description:
          'A4 paper measures 210 × 297 mm — 21 × 29.7 cm or 8.27 × 11.69 inches. Below it is drawn to scale with the other A sizes and US Letter, with its size in points and in pixels at 300 and 96 dpi.',
        config: { init_section: 'paper', init_paper: 'A4' },
        keywords: [
          'a4 size',
          'a4 dimensions',
          'a4 in inches',
          'a4 in pixels',
          'a4 paper size cm',
        ],
      },
    ],
  },
];
