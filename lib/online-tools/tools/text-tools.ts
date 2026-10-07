import type { ToolDefinition } from '../types';

export const TEXT_TOOLS: ToolDefinition[] = [
  {
    slug: 'word-counter',
    category: 'text-tools',
    name: 'Word Counter',
    icon: '🔢',
    shortDescription: 'Count words and characters instantly.',
    description:
      'Count words, characters, sentences and paragraphs as you type, and see your estimated reading and speaking time. Your text stays in your browser — nothing is saved or uploaded.',
    title: 'Word Counter – Count Words & Characters Online',
    metaDescription:
      'Count words, characters and sentences instantly with this free online word counter.',
    keywords: [
      'word counter',
      'word count',
      'character counter',
      'count words',
      'essay word count',
    ],
    relatedTools: [
      'character-counter',
      'sentence-counter',
      'readability-score',
      'text-case-converter',
      'remove-duplicate-lines',
    ],
    component: 'text-stats',
    config: { focus: 'words' },
    popular: true,
    howTo: [
      'Type or paste your text into the box.',
      'Word, character, sentence and paragraph counts update as you type.',
      'Check reading time and your most-used words below the counts.',
    ],
    about: [
      'A word is counted as any run of letters or numbers, including contractions (don’t) and hyphenated words (well-known). This matches how most word processors count, so results line up with Microsoft Word and Google Docs for typical text.',
      'Reading time assumes 238 words per minute (the average for adults reading silently); speaking time assumes 150 words per minute.',
    ],
    faqs: [
      {
        q: 'How many words is a 5-minute speech?',
        a: 'About 650–750 words at a typical speaking pace of 130–150 words per minute.',
      },
      {
        q: 'Are numbers counted as words?',
        a: 'Yes. “2026” counts as one word, as it does in most word processors.',
      },
    ],
  },
  {
    slug: 'character-counter',
    category: 'text-tools',
    name: 'Character Counter',
    icon: '🔤',
    shortDescription: 'Count characters with and without spaces.',
    description:
      'Count characters with and without spaces, plus letters, words and lines. Check your text against common limits for posts, SMS and meta descriptions.',
    title: 'Character Counter – Count Characters With & Without Spaces',
    metaDescription:
      'Count characters online with and without spaces. Check limits for X/Twitter, SMS, Instagram and meta descriptions. Free and instant.',
    keywords: [
      'character counter',
      'character count',
      'letter counter',
      'count characters',
      'twitter character count',
    ],
    relatedTools: ['word-counter', 'sentence-counter', 'text-case-converter'],
    component: 'text-stats',
    config: { focus: 'characters' },
    howTo: [
      'Type or paste text.',
      'See characters with and without spaces as you type.',
      'Compare against the common limits shown below.',
    ],
    about: [
      'Characters are counted as Unicode code points, so a simple emoji such as 👍 counts as one even though it is stored as two UTF-16 code units. Emoji with skin tones or combined emoji (like families) consist of several code points and count as more than one. Some platforms (like SMS) count differently again.',
    ],
    faqs: [
      {
        q: 'What is the character limit for a meta description?',
        a: 'Google typically shows about 150–160 characters on desktop before truncating.',
      },
    ],
  },
  {
    slug: 'sentence-counter',
    category: 'text-tools',
    name: 'Sentence Counter',
    icon: '📏',
    shortDescription: 'Count sentences and average sentence length.',
    description:
      'Count sentences and paragraphs and see the average sentence length — a quick readability check for essays, articles and emails.',
    title: 'Sentence Counter – Count Sentences & Average Length Online',
    metaDescription:
      'Count sentences and paragraphs online and check average words per sentence for readability. Free and private.',
    keywords: [
      'sentence counter',
      'count sentences',
      'paragraph counter',
      'average sentence length',
    ],
    relatedTools: ['word-counter', 'character-counter', 'text-case-converter'],
    component: 'text-stats',
    config: { focus: 'sentences' },
    howTo: [
      'Paste your text.',
      'Read the sentence and paragraph count.',
      'Aim for an average of 15–20 words per sentence for easy reading.',
    ],
    about: [
      'A sentence ends with a period, question mark, exclamation mark or ellipsis followed by a space, or with a blank line. Abbreviations like “e.g.” can occasionally be counted as a sentence break.',
    ],
    faqs: [
      {
        q: 'What is a good average sentence length?',
        a: 'For web and business writing, 15–20 words. Readability scores drop noticeably above 25.',
      },
    ],
  },
  {
    slug: 'text-case-converter',
    category: 'text-tools',
    name: 'Text Case Converter',
    icon: '🔠',
    shortDescription: 'Change text to upper, lower, title, camel and more.',
    description:
      'Convert text between UPPERCASE, lowercase, Title Case, Sentence case, camelCase, snake_case, kebab-case and more with one click. Copy the result instantly.',
    title: 'Case Converter – Change Text Case Online (Upper, Lower, Title)',
    metaDescription:
      'Convert text case online: UPPERCASE, lowercase, Title Case, Sentence case, camelCase, snake_case, kebab-case and more. Free.',
    keywords: [
      'case converter',
      'text case converter',
      'change case',
      'title case',
      'camelcase converter',
    ],
    relatedTools: [
      'uppercase-converter',
      'lowercase-converter',
      'title-case-converter',
      'word-counter',
      'find-and-replace',
    ],
    component: 'text-case',
    popular: true,
    howTo: [
      'Type or paste your text.',
      'Click the case style you want.',
      'Copy the converted text.',
    ],
    about: [
      'Programming cases (camelCase, PascalCase, snake_case, kebab-case, CONSTANT_CASE) split your text into words at spaces, punctuation and existing case changes, then join them in the chosen style — so “user ID number” becomes userIdNumber.',
      'Title Case follows common style-guide rules and keeps short words like “and”, “of” and “the” lowercase unless they start or end the title.',
    ],
    faqs: [
      {
        q: 'Does it work with accented and non-Latin letters?',
        a: 'Yes. Conversion uses Unicode-aware case rules, so é, ß, Ω and similar letters are handled.',
      },
    ],
  },
  {
    slug: 'uppercase-converter',
    category: 'text-tools',
    name: 'Uppercase Converter',
    icon: '🅰️',
    shortDescription: 'Convert text to UPPERCASE.',
    description:
      'Convert any text to UPPERCASE (capital letters) instantly. Paste your text and copy the result.',
    title: 'Uppercase Converter – Convert Text to Capital Letters',
    metaDescription:
      'Convert text to uppercase online. Turn any text into CAPITAL LETTERS instantly, with Unicode support. Free and private.',
    keywords: [
      'uppercase converter',
      'convert to uppercase',
      'capital letters',
      'all caps',
    ],
    relatedTools: [
      'lowercase-converter',
      'title-case-converter',
      'text-case-converter',
    ],
    component: 'text-transform',
    config: { transform: 'uppercase' },
    howTo: [
      'Type or paste text.',
      'The uppercase version appears as you type.',
      'Copy it.',
    ],
    about: [
      'Uppercase conversion follows Unicode rules, so special cases like the German ß become SS.',
    ],
    faqs: [
      {
        q: 'Is ALL CAPS bad for readability?',
        a: 'Long passages in capitals are harder to read and can feel like shouting. Use it for short labels and acronyms.',
      },
    ],
  },
  {
    slug: 'lowercase-converter',
    category: 'text-tools',
    name: 'Lowercase Converter',
    icon: '🔡',
    shortDescription: 'Convert text to lowercase.',
    description:
      'Convert any text to lowercase instantly — perfect for fixing text typed with Caps Lock on.',
    title: 'Lowercase Converter – Convert Text to Small Letters',
    metaDescription:
      'Convert text to lowercase online instantly. Fix caps-lock text and normalise data. Free and private.',
    keywords: [
      'lowercase converter',
      'convert to lowercase',
      'small letters',
      'caps lock fix',
    ],
    relatedTools: [
      'uppercase-converter',
      'title-case-converter',
      'text-case-converter',
    ],
    component: 'text-transform',
    config: { transform: 'lowercase' },
    howTo: [
      'Type or paste text.',
      'The lowercase version appears as you type.',
      'Copy it.',
    ],
    about: [
      'Lowercasing is common when normalising email addresses, tags and identifiers before comparing them.',
    ],
    faqs: [
      {
        q: 'Does lowercase affect numbers or symbols?',
        a: 'No — only letters change.',
      },
    ],
  },
  {
    slug: 'title-case-converter',
    category: 'text-tools',
    name: 'Title Case Converter',
    icon: '📰',
    shortDescription: 'Capitalize headlines properly.',
    description:
      'Convert headlines to Title Case, capitalising important words and keeping short words like “and”, “of” and “the” lowercase.',
    title: 'Title Case Converter – Capitalize Titles & Headlines Online',
    metaDescription:
      'Convert text to Title Case online. Capitalize headlines with style-guide rules for small words. Free and instant.',
    keywords: [
      'title case converter',
      'title capitalization',
      'headline capitalization',
      'capitalize title',
    ],
    relatedTools: [
      'text-case-converter',
      'uppercase-converter',
      'word-counter',
    ],
    component: 'text-transform',
    config: { transform: 'title-case' },
    howTo: [
      'Paste one title per line.',
      'The Title Case version appears instantly.',
      'Copy it.',
    ],
    about: [
      'Articles, short conjunctions and short prepositions stay lowercase unless they are the first or last word — a rule shared by AP, Chicago and APA styles.',
    ],
    faqs: [
      {
        q: 'Which style guide does it follow?',
        a: 'A common subset of AP and Chicago rules. Style guides disagree on some words (like “with”), so check your guide for edge cases.',
      },
    ],
  },
  {
    slug: 'remove-duplicate-lines',
    category: 'text-tools',
    name: 'Remove Duplicate Lines',
    icon: '🧹',
    shortDescription: 'Delete repeated lines from a list.',
    description:
      'Remove duplicate lines from lists and text while keeping the first occurrence and the original order. Choose case-sensitive or case-insensitive matching.',
    title: 'Remove Duplicate Lines – Dedupe Lists Online',
    metaDescription:
      'Remove duplicate lines from text or lists online. Keeps the original order; case-sensitive or not. Free and private.',
    keywords: [
      'remove duplicate lines',
      'dedupe list',
      'unique lines',
      'remove duplicates',
    ],
    relatedTools: [
      'sort-lines',
      'remove-empty-lines',
      'find-and-replace',
      'text-diff',
    ],
    component: 'text-transform',
    config: { transform: 'remove-duplicate-lines' },
    howTo: [
      'Paste your list, one item per line.',
      'Choose matching options.',
      'Copy the unique lines.',
    ],
    about: [
      'Only the first occurrence of each line is kept, so the order of your list does not change.',
    ],
    faqs: [
      {
        q: 'How do I also sort the list?',
        a: 'Run the result through the Sort Lines tool.',
      },
    ],
  },
  {
    slug: 'remove-empty-lines',
    category: 'text-tools',
    name: 'Remove Empty Lines',
    icon: '🧽',
    shortDescription: 'Delete blank lines from text.',
    description:
      'Remove blank lines — and optionally lines containing only spaces — from any text in one step.',
    title: 'Remove Empty Lines – Delete Blank Lines from Text Online',
    metaDescription:
      'Remove empty and whitespace-only lines from text online. Clean up copied text instantly. Free and private.',
    keywords: [
      'remove empty lines',
      'remove blank lines',
      'delete empty lines',
    ],
    relatedTools: [
      'remove-line-breaks',
      'remove-duplicate-lines',
      'sort-lines',
      'find-and-replace',
    ],
    component: 'text-transform',
    config: { transform: 'remove-empty-lines' },
    howTo: [
      'Paste your text.',
      'Choose whether whitespace-only lines count as empty.',
      'Copy the cleaned text.',
    ],
    about: [
      'Text copied from PDFs and web pages often contains extra blank lines. Removing them makes lists and code easier to work with.',
    ],
    faqs: [
      {
        q: 'Will it join paragraphs together?',
        a: 'Paragraphs stay on separate lines, but the blank line between them is removed.',
      },
    ],
  },
  {
    slug: 'sort-lines',
    category: 'text-tools',
    name: 'Sort Lines',
    icon: '🔀',
    shortDescription: 'Sort lines alphabetically, naturally or by length.',
    description:
      'Sort lines A–Z, Z–A, in natural order (item 2 before item 10), by length, reversed or shuffled.',
    title: 'Sort Lines – Sort Text Alphabetically Online',
    metaDescription:
      'Sort lines of text online: alphabetical, reverse, natural number order, by length, or shuffle. Free and instant.',
    keywords: [
      'sort lines',
      'sort alphabetically',
      'alphabetize list',
      'sort text',
      'shuffle lines',
    ],
    relatedTools: [
      'remove-duplicate-lines',
      'remove-empty-lines',
      'random-number-generator',
    ],
    component: 'text-transform',
    config: { transform: 'sort-lines' },
    howTo: [
      'Paste your list.',
      'Choose the sort order.',
      'Copy the sorted lines.',
    ],
    about: [
      'Alphabetical sorting is locale-aware, so accented letters sort next to their base letters. Natural order compares numbers by value instead of digit by digit.',
    ],
    faqs: [
      {
        q: 'Is shuffle truly random?',
        a: 'It uses an unbiased Fisher–Yates shuffle with the browser’s random number generator.',
      },
    ],
  },
  {
    slug: 'text-diff',
    category: 'text-tools',
    name: 'Text Diff',
    icon: '🆚',
    shortDescription: 'Compare two texts and highlight differences.',
    description:
      'Compare two versions of a text and see exactly what was added and removed, line by line or word by word.',
    title: 'Text Diff – Compare Two Texts & Highlight Differences Online',
    metaDescription:
      'Compare two texts online and highlight added and removed lines or words. Private diff checker that runs in your browser.',
    keywords: [
      'text diff',
      'diff checker',
      'compare text',
      'text compare',
      'difference checker',
    ],
    relatedTools: [
      'find-and-replace',
      'remove-duplicate-lines',
      'json-formatter',
    ],
    component: 'text-diff',
    howTo: [
      'Paste the original text on the left and the changed text on the right.',
      'Choose line or word comparison.',
      'Review the highlighted additions (green) and removals (red).',
    ],
    about: [
      'The diff uses a longest-common-subsequence algorithm — the same idea behind git diff — to find the smallest set of changes between the two texts.',
    ],
    faqs: [
      {
        q: 'Is my text uploaded?',
        a: 'No. The comparison runs entirely in your browser, which makes it safe for contracts and code.',
      },
    ],
  },
  {
    slug: 'find-and-replace',
    category: 'text-tools',
    name: 'Find and Replace',
    icon: '🔍',
    shortDescription: 'Find and replace text, with regex support.',
    description:
      'Find and replace words or patterns in any text, with options for case sensitivity, whole words and regular expressions. See how many replacements were made.',
    title: 'Find and Replace Text Online – With Regex Support',
    metaDescription:
      'Find and replace text online with case-sensitive, whole-word and regex options. See match counts instantly. Free and private.',
    keywords: [
      'find and replace',
      'replace text online',
      'search and replace',
      'regex replace',
    ],
    relatedTools: [
      'regex-tester',
      'text-diff',
      'remove-duplicate-lines',
      'text-case-converter',
    ],
    component: 'find-replace',
    howTo: [
      'Paste your text.',
      'Enter what to find and what to replace it with.',
      'Adjust options, then copy the result.',
    ],
    about: [
      'In regex mode you can use capture groups in the replacement ($1, $2 or $<name>) to rearrange matched text.',
    ],
    faqs: [
      {
        q: 'How do I replace line breaks?',
        a: 'Enable regex mode and search for \\n.',
      },
    ],
  },
  {
    slug: 'lorem-ipsum-generator',
    category: 'text-tools',
    name: 'Lorem Ipsum Generator',
    icon: '📜',
    shortDescription: 'Generate placeholder text.',
    description:
      'Generate Lorem Ipsum placeholder text by paragraphs, sentences or words for mock-ups, layouts and prototypes.',
    title: 'Lorem Ipsum Generator – Placeholder Text Online',
    metaDescription:
      'Generate Lorem Ipsum placeholder text by paragraphs, sentences or words. Copy as plain text or HTML. Free.',
    keywords: [
      'lorem ipsum generator',
      'placeholder text',
      'dummy text',
      'filler text',
    ],
    relatedTools: [
      'word-counter',
      'markdown-previewer',
      'random-string-generator',
    ],
    component: 'lorem-ipsum',
    howTo: [
      'Choose how many paragraphs, sentences or words you need.',
      'Decide whether to start with “Lorem ipsum dolor sit amet”.',
      'Copy the text or the HTML version.',
    ],
    about: [
      'Lorem Ipsum is scrambled Latin derived from Cicero’s “De finibus bonorum et malorum” (45 BC). Designers use it because it looks like real text without distracting readers with meaning.',
    ],
    faqs: [
      {
        q: 'Should I use Lorem Ipsum in a live site?',
        a: 'No — replace it before publishing. Search engines treat it as low-quality content.',
      },
    ],
  },
  {
    slug: 'markdown-previewer',
    category: 'text-tools',
    name: 'Markdown Previewer',
    icon: '👁️',
    shortDescription: 'Write Markdown with a live preview.',
    description:
      'Write Markdown on the left and see the formatted result on the right as you type, with GitHub Flavored Markdown support.',
    title: 'Markdown Previewer – Live Markdown Editor Online',
    metaDescription:
      'Write Markdown with a live side-by-side preview. GitHub Flavored Markdown with tables and task lists. Free, private, no sign-up.',
    keywords: [
      'markdown previewer',
      'markdown editor',
      'markdown preview',
      'md viewer',
    ],
    relatedTools: ['markdown-to-html', 'html-to-markdown', 'word-counter'],
    component: 'markdown-previewer',
    howTo: [
      'Type or paste Markdown in the editor.',
      'Watch the preview update live.',
      'Copy the Markdown or the rendered HTML.',
    ],
    about: [
      'The preview is sanitised before display, so pasted Markdown containing scripts cannot run on the page.',
    ],
    faqs: [
      {
        q: 'Is my text saved?',
        a: 'Only in this browser tab. Close the tab and it is gone — copy your work first.',
      },
    ],
  },
  {
    slug: 'morse-code-converter',
    category: 'text-tools',
    name: 'Morse Code Converter',
    icon: '📡',
    shortDescription: 'Translate text to Morse code and back.',
    description:
      'Translate text to International Morse code and decode Morse back into text. The direction is detected automatically.',
    title: 'Morse Code Translator – Text to Morse & Morse to Text',
    metaDescription:
      'Translate text to Morse code and Morse code to text online. Automatic direction detection. Free.',
    keywords: [
      'morse code translator',
      'morse code converter',
      'text to morse',
      'morse to text',
    ],
    relatedTools: ['text-case-converter', 'base64-encoder', 'url-encoder'],
    component: 'text-transform',
    config: { transform: 'morse' },
    howTo: [
      'Type text or paste Morse code (dots and dashes).',
      'The translation appears instantly.',
      'Copy it.',
    ],
    about: [
      'Letters are separated by spaces and words by a slash (/). Morse code covers A–Z, digits and common punctuation.',
    ],
    faqs: [
      {
        q: 'What does SOS look like in Morse?',
        a: '... --- ... — three short, three long, three short.',
      },
    ],
  },

  {
    slug: 'fancy-text-generator',
    category: 'text-tools',
    name: 'Fancy Text Generator',
    icon: '✨',
    shortDescription: 'Turn text into 𝐛𝐨𝐥𝐝, 𝓈𝒸𝓇𝒾𝓅𝓉, ⓒⓘⓡⓒⓛⓔⓓ and more.',
    description:
      'Type once and get your text in 20+ Unicode “fonts” — 𝐛𝐨𝐥𝐝, 𝘪𝘵𝘢𝘭𝘪𝘤, 𝓈𝒸𝓇𝒾𝓅𝓉, 𝔤𝔬𝔱𝔥𝔦𝔠, ⓒⓘⓡⓒⓛⓔⓓ, ｖａｐｏｒｗａｖｅ, upside-down and more — ready to copy into Instagram bios, TikTok, Discord and X.',
    title: 'Fancy Text Generator – Cool Fonts to Copy and Paste',
    metaDescription:
      'Generate fancy text in 20+ Unicode fonts: bold, italic, script, gothic, circled, bubble, upside-down and more. Copy and paste into Instagram, TikTok and Discord.',
    keywords: [
      'fancy text generator',
      'cool fonts',
      'font generator copy and paste',
      'instagram fonts',
      'bold text generator',
    ],
    relatedTools: [
      'upside-down-text',
      'strikethrough-text',
      'special-characters',
      'text-case-converter',
      'character-counter',
    ],
    component: 'fancy-text',
    popular: true,
    howTo: [
      'Type or paste your text.',
      'Scroll through the styles — every one updates as you type.',
      'Click Copy next to the style you like and paste it anywhere.',
    ],
    about: [
      'These are not real fonts: each letter is swapped for a different Unicode character that looks styled, such as “𝐀” (Mathematical Bold Capital A, U+1D400). That is why the style survives copy and paste into apps that don’t let you choose a font.',
      'Screen readers may read these characters letter by letter or skip them, and some platforms don’t support every symbol. Use them for short accents like names and headlines, not for whole paragraphs.',
    ],
    faqs: [
      {
        q: 'Why do some characters show as boxes?',
        a: 'The device viewing the text lacks a font with that symbol. Bold, italic and script styles are the most widely supported.',
      },
      {
        q: 'Do fancy fonts hurt accessibility?',
        a: 'They can — screen readers may not read them as normal words. Keep important information in plain text.',
      },
    ],
  },
  {
    slug: 'text-to-speech',
    category: 'text-tools',
    name: 'Text to Speech',
    icon: '🗣️',
    shortDescription: 'Read text aloud with natural voices.',
    description:
      'Paste text and listen to it read aloud. Choose a voice and language, adjust speed and pitch, and follow along as each word is highlighted (where the voice supports it). Uses your device’s built-in speech voices.',
    title: 'Text to Speech Online – Read Text Aloud Free, No Sign-Up',
    metaDescription:
      'Free text to speech online: paste text and hear it read aloud. Choose voices and languages, change speed and pitch. Uses your device’s built-in voices.',
    keywords: [
      'text to speech',
      'tts online',
      'read text aloud',
      'text to voice',
      'speech synthesis',
    ],
    relatedTools: [
      'word-counter',
      'pdf-to-text',
      'image-to-text',
      'markdown-previewer',
      'morse-code-converter',
    ],
    component: 'text-to-speech',
    popular: true,
    limitation:
      'Voices come from your browser and operating system, so the selection differs between devices. Voices marked “online” are provided by your browser vendor and send the text to their service; on-device voices work fully offline.',
    howTo: [
      'Paste or type your text.',
      'Choose a voice and adjust speed and pitch.',
      'Press Play; use Pause, Resume and Stop as needed.',
    ],
    about: [
      'The tool uses the Web Speech API built into modern browsers. Most systems include several on-device voices; Chrome and Edge also offer higher-quality online voices.',
      'Listening is a good way to proofread: hearing a sentence makes missing words and awkward phrasing much easier to notice.',
    ],
    faqs: [
      {
        q: 'Can I download the audio as an MP3?',
        a: 'Browsers do not expose the synthesized audio to web pages, so it can be played but not saved as a file.',
      },
      {
        q: 'Why are there no voices?',
        a: 'Some browsers load voices a moment after the page opens, and some Linux systems ship without any. Reload the page or install a speech engine.',
      },
    ],
  },
  {
    slug: 'upside-down-text',
    category: 'text-tools',
    name: 'Upside Down Text Generator',
    icon: '🙃',
    shortDescription: 'Flip text upside down: ʇxǝʇ uʍop ǝpısdn.',
    description:
      'Type anything and get it upside down (uʍop ǝpısdn) or mirrored, ready to copy and paste into Instagram, TikTok, Discord, WhatsApp or a text message. Paste flipped text back in to turn it the right way up again.',
    title: 'Upside Down Text Generator – Flip Text ʇxǝʇ uʍop ǝpısdn',
    metaDescription:
      'Flip text upside down or mirror it with Unicode characters you can copy and paste anywhere — Instagram, Discord, TikTok, texts. Paste flipped text to flip it back.',
    keywords: [
      'upside down text',
      'flip text',
      'upside down text generator',
      'rotate text',
      'turn text upside down',
    ],
    relatedTools: [
      'fancy-text-generator',
      'reverse-text',
      'strikethrough-text',
      'special-characters',
      'text-case-converter',
    ],
    component: 'text-transform',
    config: { transform: 'flip-text' },
    howTo: [
      'Type or paste your text into the box.',
      'Choose Upside down, Mirror or Upside-down letters with normal order.',
      'Click Copy and paste the flipped text anywhere.',
    ],
    about: [
      'There is no “upside-down font” — each letter is swapped for a different Unicode character that looks like it has been turned over, such as ɐ for a, ǝ for e and ¡ for !. For a true 180° rotation the order is reversed too, so the text reads correctly when you turn your phone around.',
      'Because the result is ordinary text, it survives copy and paste into apps that don’t let you choose a font. Letters and digits that already look the same upside down (l, o, s, x, z, H, I, N, O, S, X, Z, 0, 8) stay as they are, and characters with no upside-down twin — most accented letters, emoji and non-Latin scripts — are kept unchanged.',
    ],
    faqs: [
      {
        q: 'How do I turn upside-down text back to normal?',
        a: 'Paste it into the box with Upside down selected. The mapping works in both directions, so flipping it again restores the original letters.',
      },
      {
        q: 'Why do some flipped letters look slightly off?',
        a: 'Unicode has no perfect upside-down twin for every letter, so the closest look-alike is used — for example ꓭ for B. How it looks also depends on the fonts on the reader’s device.',
      },
      {
        q: 'Can screen readers read upside-down text?',
        a: 'Not well — they read the look-alike characters by their real names. Use it for fun accents, not for information people need.',
      },
    ],
    variants: [
      {
        slug: 'mirror-text',
        name: 'Mirror Text Generator',
        title: 'Mirror Text Generator – Reverse & Flip Text Backwards',
        metaDescription:
          'Make mirror text that reads right to left like a reflection (ɘvilɒ). Flip each line left to right with Unicode look-alikes and copy and paste it anywhere.',
        description:
          'Type text and get its mirror image — each line flipped left to right, the way it would look in a mirror (ɿoɿɿim). Copy and paste it into messages, bios and posts.',
        config: { transform: 'flip-text', init_mode: 'mirror' },
        keywords: [
          'mirror text',
          'mirror text generator',
          'reflected text',
          'flip text horizontally',
        ],
      },
    ],
  },
  {
    slug: 'strikethrough-text',
    category: 'text-tools',
    name: 'Strikethrough Text Generator',
    icon: '🚫',
    shortDescription: 'Cross out text: s̶t̶r̶i̶k̶e̶t̶h̶r̶o̶u̶g̶h̶ to copy and paste.',
    description:
      'Turn any text into s̶t̶r̶i̶k̶e̶t̶h̶r̶o̶u̶g̶h̶, u̲n̲d̲e̲r̲l̲i̲n̲e̲d̲, slashed or overlined text you can paste where there is no formatting button — Instagram, Facebook, X, YouTube comments and dating bios.',
    title: 'Strikethrough Text Generator – Cross Out Text to Copy & Paste',
    metaDescription:
      'Create s̶t̶r̶i̶k̶e̶t̶h̶r̶o̶u̶g̶h̶, underline, slash and overline text with Unicode combining marks. Copy and paste into Instagram, X, Facebook and more — no formatting needed.',
    keywords: [
      'strikethrough text',
      'strikethrough text generator',
      'cross out text',
      'line through text',
      'strike text copy paste',
    ],
    relatedTools: [
      'fancy-text-generator',
      'upside-down-text',
      'invisible-character',
      'character-counter',
      'special-characters',
    ],
    component: 'text-transform',
    config: { transform: 'combining-style' },
    howTo: [
      'Type or paste your text.',
      'Pick a style — strikethrough, short stroke, slash, underline, double underline, overline or cross.',
      'Copy the result and paste it into your post, comment or message.',
    ],
    about: [
      'The line is not formatting. After every character the tool adds a Unicode combining mark — U+0336 COMBINING LONG STROKE OVERLAY for strikethrough, U+0332 COMBINING LOW LINE for underline — which your device draws on top of the letter before it. That is why it keeps working in apps that strip bold, italics and other formatting.',
      'Each character now carries an extra hidden character, so the text counts as roughly twice as long towards character limits, and search and screen readers may not recognise the words. To get plain text back, choose “Remove these lines”.',
    ],
    faqs: [
      {
        q: 'Does strikethrough text work everywhere?',
        a: 'Most modern apps on iPhone, Android, Windows and macOS display it. A few fonts draw the marks slightly off-centre, and some sites strip combining characters — check a preview before posting.',
      },
      {
        q: 'Why did my post go over the character limit?',
        a: 'Every letter is followed by a combining mark, so “hello” struck through is 10 characters, not 5.',
      },
      {
        q: 'How do I strike through text in WhatsApp, Discord or Slack?',
        a: 'Those apps have built-in formatting: ~text~ in WhatsApp and Slack, ~~text~~ in Discord. This generator is for places without such shortcuts.',
      },
    ],
    variants: [
      {
        slug: 'underline-text',
        name: 'Underline Text Generator',
        title: 'Underline Text Generator – U̲n̲d̲e̲r̲l̲i̲n̲e̲ Text to Copy & Paste',
        metaDescription:
          'Underline text anywhere with Unicode: single u̲n̲d̲e̲r̲l̲i̲n̲e̲, double underline or overline. Copy and paste into Instagram, X and Facebook where there is no underline button.',
        description:
          'Type text and get it u̲n̲d̲e̲r̲l̲i̲n̲e̲d̲ with Unicode combining marks — single, double or overline — ready to paste into bios, posts and comments that don’t support formatting.',
        config: { transform: 'combining-style', init_style: 'underline' },
        keywords: [
          'underline text',
          'underline text generator',
          'underlined text copy paste',
          'double underline text',
        ],
      },
    ],
  },
  {
    slug: 'reverse-text',
    category: 'text-tools',
    name: 'Reverse Text',
    icon: '🔁',
    shortDescription: 'Write text backwards, reverse words or lines.',
    description:
      'Reverse text instantly: spell it backwards (olleh), flip the order of words, reverse the letters inside each word, or turn a list upside down by reversing the line order. Emoji and accented letters stay intact.',
    title: 'Reverse Text Generator – Write Backwards, Reverse Words & Lines',
    metaDescription:
      'Reverse text online: write backwards, reverse word order, reverse each word or flip the order of lines. Emoji-safe, instant and private — runs in your browser.',
    keywords: [
      'reverse text',
      'backwards text',
      'reverse text generator',
      'reverse words',
      'write backwards',
    ],
    relatedTools: [
      'upside-down-text',
      'sort-lines',
      'text-case-converter',
      'find-and-replace',
      'remove-duplicate-lines',
    ],
    component: 'text-transform',
    config: { transform: 'reverse-text' },
    howTo: [
      'Type or paste your text.',
      'Choose what to reverse: every character, the word order, the letters in each word, or the line order.',
      'Copy the reversed text.',
    ],
    about: [
      'Reversing text one code unit at a time breaks emoji and accented letters — a flag or a family emoji turns into broken pieces. This tool reverses whole “grapheme clusters” (what you see as one character), so 👩‍💻 and é stay in one piece.',
      'Reversing the word order keeps the spacing between words, and reversing lines is a quick way to flip a list — for example to put a log or a chat history in oldest-first order.',
    ],
    faqs: [
      {
        q: 'Is a palindrome checker included?',
        a: 'Reverse a word or sentence with “Every character” and compare it with the original — if it reads the same (ignoring spaces and punctuation), it is a palindrome.',
      },
      {
        q: 'What is the difference between backwards and mirror text?',
        a: 'Backwards text only reverses the order (olleh). Mirror text also swaps each letter for a mirrored look-alike, which you can make with the Mirror Text Generator.',
      },
    ],
  },
  {
    slug: 'text-repeater',
    category: 'text-tools',
    name: 'Text Repeater',
    icon: '🔂',
    shortDescription: 'Repeat a word, emoji or sentence many times.',
    description:
      'Repeat any text, word or emoji up to 10,000 times, separated by new lines, spaces, commas or your own separator, then copy it in one click. Useful for test data, filling forms, and messages like “Happy birthday! 🎉” × 100.',
    title: 'Text Repeater – Repeat Text or Emoji Up to 10,000 Times',
    metaDescription:
      'Repeat text, words or emoji up to 10,000 times with new lines, spaces, commas or a custom separator. Copy the result instantly — free text repeater, no sign-up.',
    keywords: [
      'text repeater',
      'repeat text',
      'emoji repeater',
      'word repeater',
      'repeat text generator',
    ],
    relatedTools: [
      'lorem-ipsum-generator',
      'add-prefix-suffix-to-lines',
      'character-counter',
      'invisible-character',
      'fancy-text-generator',
    ],
    component: 'text-transform',
    config: { transform: 'repeat-text' },
    howTo: [
      'Type the text or emoji you want to repeat.',
      'Enter how many times (1 to 10,000) and choose a separator.',
      'Copy or download the repeated text.',
    ],
    about: [
      'The text is repeated exactly as typed, including spaces and line breaks, and joined with the separator you choose. Pick “Custom…” to use your own separator, such as “ | ” or a full stop.',
      'To keep your browser responsive, the result is limited to 2 million characters — far more than most apps accept in one message.',
    ],
    faqs: [
      {
        q: 'Can I send repeated text on WhatsApp?',
        a: 'Yes, but WhatsApp limits a message to about 65,000 characters, and spamming people can get your account restricted. Keep it friendly.',
      },
      {
        q: 'How do I number each copy?',
        a: 'Repeat with the New line separator, then run the result through Add Prefix / Suffix to Lines with the prefix “{n}. ”.',
      },
    ],
  },
  {
    slug: 'remove-line-breaks',
    category: 'text-tools',
    name: 'Remove Line Breaks',
    icon: '↩️',
    shortDescription: 'Join broken lines from PDFs and emails.',
    description:
      'Remove line breaks from text copied out of PDFs, emails and websites. Join the lines into clean paragraphs (keeping the gaps between them), or remove every break, and fix words that were hyphenated across two lines.',
    title: 'Remove Line Breaks – Join Lines & Fix Text Copied from PDFs',
    metaDescription:
      'Remove line breaks online: join broken lines from PDFs and emails into clean paragraphs, keep or remove paragraph gaps, and fix hyphenated words. Free and private.',
    keywords: [
      'remove line breaks',
      'remove line breaks from text',
      'join lines',
      'remove paragraph breaks',
      'pdf line break remover',
    ],
    relatedTools: [
      'remove-empty-lines',
      'find-and-replace',
      'pdf-to-text',
      'word-counter',
      'text-case-converter',
    ],
    component: 'text-transform',
    config: { transform: 'remove-line-breaks' },
    howTo: [
      'Paste the text with unwanted line breaks.',
      'Choose “Remove, keep paragraphs” to keep the gaps between paragraphs, or remove every break.',
      'Copy the cleaned text.',
    ],
    about: [
      'PDFs store text line by line, so copying from one adds a hard line break at the end of every line. Pasted into an email or form, that leaves ragged, broken sentences. Joining the lines with a space restores normal paragraphs.',
      '“Remove, keep paragraphs” treats a blank line as the end of a paragraph and keeps it, while joining the lines inside each paragraph. “Join words hyphenated across lines” turns “infor-” + “mation” back into “information” when the next line starts with a lowercase letter. When it starts with a capital or a digit, as in “Jean-” + “Luc”, the hyphen is kept and the words are joined as “Jean-Luc”. A real compound split at its hyphen, such as “well-” + “known”, becomes “wellknown”, so give the result a quick read.',
    ],
    faqs: [
      {
        q: 'Does it handle Windows line breaks?',
        a: 'Yes. Windows (CRLF), Mac and Unix (LF) line breaks and Unicode line separators are all handled.',
      },
      {
        q: 'How do I remove only the blank lines?',
        a: 'Use Remove Empty Lines — it deletes blank lines but keeps every other line break.',
      },
    ],
  },
  {
    slug: 'add-prefix-suffix-to-lines',
    category: 'text-tools',
    name: 'Add Prefix / Suffix to Lines',
    icon: '➕',
    shortDescription: 'Add text to the start or end of every line.',
    description:
      'Add a prefix, a suffix or both to every line of a list: bullet points, quotes, commas, HTML tags or line numbers with {n}. Skip empty lines and trim spaces, then copy the result.',
    title: 'Add Prefix and Suffix to Lines – Add Text to Each Line Online',
    metaDescription:
      'Add text to the start or end of every line: bullets, quotes, commas, HTML tags or {n} line numbers. Skip empty lines, trim spaces — free, instant and private.',
    keywords: [
      'add prefix to each line',
      'add suffix to each line',
      'add text to beginning of each line',
      'add comma to end of each line',
      'number lines',
    ],
    relatedTools: [
      'remove-line-breaks',
      'sort-lines',
      'remove-duplicate-lines',
      'find-and-replace',
      'text-repeater',
    ],
    component: 'text-transform',
    config: { transform: 'prefix-suffix' },
    howTo: [
      'Paste your list, one item per line.',
      'Type a prefix and/or suffix. Use {n} for the line number.',
      'Choose whether to skip empty lines and trim spaces, then copy the result.',
    ],
    about: [
      'Common recipes: prefix “- ” for a Markdown list, prefix and suffix “"” and “",” to turn a list into quoted, comma-separated values for code or SQL, “<li>” and “</li>” for HTML, or “{n}. ” for a numbered list.',
      '{n} counts only the lines that receive the prefix, so with “Skip empty lines” on, the numbering stays continuous across blank lines.',
    ],
    faqs: [
      {
        q: 'How do I add a comma to the end of each line?',
        a: 'Leave the prefix empty and type “,” as the suffix. To quote each item too, use “"” as the prefix and “",” as the suffix.',
      },
      {
        q: 'Can I start numbering at 0 or add a dot?',
        a: 'The {n} token starts at 1. Write the format you want around it, such as “{n}) ” or “Step {n}: ”.',
      },
    ],
  },
  {
    slug: 'readability-score',
    category: 'text-tools',
    name: 'Readability Score Checker',
    icon: '📖',
    shortDescription: 'Flesch reading ease and grade level for any text.',
    description:
      'Paste your text to get its Flesch Reading Ease score, Flesch–Kincaid grade level, Gunning Fog, SMOG, Coleman–Liau and ARI scores, plus the longest sentences to shorten first. Everything is calculated in your browser.',
    title: 'Readability Score Checker – Flesch Reading Ease & Grade Level',
    metaDescription:
      'Check readability online: Flesch Reading Ease, Flesch–Kincaid grade, Gunning Fog, SMOG, Coleman–Liau and ARI, with the longest sentences highlighted. Free and private.',
    keywords: [
      'readability score',
      'readability checker',
      'flesch reading ease',
      'flesch kincaid grade level',
      'gunning fog index',
    ],
    relatedTools: [
      'word-counter',
      'sentence-counter',
      'text-case-converter',
      'text-to-speech',
      'remove-line-breaks',
    ],
    component: 'readability',
    howTo: [
      'Paste your text — a few paragraphs give the most reliable result.',
      'Read the Flesch Reading Ease score and the average grade level.',
      'Shorten the longest sentences listed below the scores and check again.',
    ],
    about: [
      'Readability formulas estimate how hard a text is from sentence length and word length. Flesch Reading Ease (0–100, higher is easier) uses words per sentence and syllables per word; most web content aims for 60 or above. The grade-level formulas — Flesch–Kincaid, Gunning Fog, SMOG, Coleman–Liau and ARI — translate the same signals into a US school grade.',
      'The formulas were built for English. Syllables are estimated from vowel groups, as in most checkers, so scores can differ by a point or so from other tools. They measure structure, not clarity: a short sentence can still be confusing, so read your text aloud too.',
    ],
    faqs: [
      {
        q: 'What is a good readability score?',
        a: 'For general web content, a Flesch Reading Ease of 60–70 (about grade 8–9) is a common target. Children’s material aims higher; academic and legal writing usually scores lower.',
      },
      {
        q: 'How do I improve my readability score?',
        a: 'Split long sentences, prefer short everyday words over long ones, and use lists for steps. The tool lists your longest sentences so you know where to start.',
      },
      {
        q: 'Does it work for languages other than English?',
        a: 'The formulas and syllable counting are tuned for English, so results for other languages are not meaningful.',
      },
    ],
  },
  {
    slug: 'invisible-character',
    category: 'text-tools',
    name: 'Invisible Character',
    icon: '👻',
    shortDescription: 'Copy blank text, or find hidden characters.',
    description:
      'Copy an invisible character for blank names, empty messages and spacing, generate any number of blank characters, or paste text to find and remove hidden zero-width characters and strange spaces.',
    title: 'Invisible Character – Copy Blank Text & Find Hidden Characters',
    metaDescription:
      'Copy and paste an invisible character for blank names and empty messages, generate blank text, or detect and remove hidden zero-width characters. Free, runs in your browser.',
    keywords: [
      'invisible character',
      'invisible text',
      'blank character',
      'empty character copy paste',
      'zero width space',
    ],
    relatedTools: [
      'special-characters',
      'text-repeater',
      'find-and-replace',
      'character-counter',
      'strikethrough-text',
    ],
    component: 'invisible-text',
    howTo: [
      'To copy one, click Copy next to the character you need — Hangul Filler works for most blank names.',
      'To make blank text, choose a character and how many, then copy.',
      'To check text, paste it into the detector: hidden characters are marked and a clean copy is ready to copy.',
    ],
    about: [
      'An invisible character is a real Unicode character that draws nothing. Apps that reject an empty name or message usually accept one, because it is not a normal space. Hangul Filler (U+3164) and Braille Pattern Blank (U+2800) are the most widely accepted; zero-width characters such as U+200B take up no space at all.',
      'Hidden characters also cause real bugs: a zero-width space in a password, a no-break space in code, or right-to-left override characters that change how text is displayed. The detector names every hidden character it finds and can strip them out, while keeping the joiners that hold emoji like 👩‍💻 together.',
    ],
    faqs: [
      {
        q: 'Why doesn’t the invisible character work in my app?',
        a: 'Some apps and games strip or block specific blank characters. Try another one from the list — Hangul Filler, Braille Blank and Halfwidth Hangul Filler are good alternatives.',
      },
      {
        q: 'Can I use an invisible name in games?',
        a: 'Many games accept Hangul Filler as a name, but rules change and some ban blank names. Check the game’s policy first.',
      },
      {
        q: 'Is the text I check uploaded?',
        a: 'No. Detection and cleaning happen in your browser and nothing is sent anywhere.',
      },
    ],
    variants: [
      {
        slug: 'blank-text-generator',
        name: 'Blank Text Generator',
        title: 'Blank Text Generator – Copy Empty Text & Blank Messages',
        metaDescription:
          'Generate blank text to copy and paste: send an empty message on WhatsApp or Discord, or use a blank name. Choose the character and how many, then copy.',
        description:
          'Generate blank text — one or a thousand invisible characters — to send an empty message, leave a bio blank or add spacing. Copy it with one click.',
        config: { init_char: 0x2800 },
        keywords: [
          'blank text',
          'blank text generator',
          'empty text',
          'send blank message',
        ],
      },
    ],
  },
  {
    slug: 'special-characters',
    category: 'text-tools',
    name: 'Special Characters & Symbols',
    icon: '※',
    shortDescription: 'Copy arrows, check marks, stars and 500+ symbols.',
    description:
      'Find and copy special characters and text symbols with one click: arrows → ✓ check marks, ★ stars, ♥ hearts, € currency, ± math, ½ fractions, ² superscripts, © legal signs, Greek letters, accented letters and more. Search by name and collect several symbols at once.',
    title: 'Special Characters & Symbols – Copy and Paste Text Symbols',
    metaDescription:
      'Copy and paste 500+ special characters and symbols: arrows, check marks, stars, hearts, currency, math, fractions, superscripts, Greek and accented letters. Search by name.',
    keywords: [
      'special characters',
      'text symbols',
      'symbols copy and paste',
      'special characters copy paste',
      'unicode symbols',
    ],
    relatedTools: [
      'fancy-text-generator',
      'invisible-character',
      'upside-down-text',
      'html-formatter',
      'character-counter',
    ],
    component: 'symbol-picker',
    popular: true,
    howTo: [
      'Pick a group or type a name such as “arrow”, “degree” or “euro”.',
      'Click a symbol to copy it — it is also added to the tray at the top.',
      'Collect several symbols in the tray and press Copy all.',
    ],
    about: [
      'Every symbol here is a standard Unicode character, so it pastes as text into documents, emails, social media and code — no font or image needed. Click a symbol to see its code point (for example U+2713), its HTML entity (&#x2713;) and its CSS escape (\\2713).',
      'Symbols that show as an empty box on someone else’s screen are missing from their fonts. The arrows, check marks, currency signs and math symbols in this list are supported almost everywhere; emoji-style symbols can look different on each platform.',
    ],
    faqs: [
      {
        q: 'How do I type special characters without copying?',
        a: 'On Windows press Win + . (period) for the emoji and symbol panel; on a Mac press Ctrl + Cmd + Space. Copying from this page is often faster for symbols you rarely use.',
      },
      {
        q: 'How do I use a symbol in HTML?',
        a: 'Paste the character directly into a UTF-8 page, or use its HTML entity, shown when you click the symbol — for example &#x2713; for ✓.',
      },
      {
        q: 'Where are the emoji?',
        a: 'Full-colour emoji live in the Emojar emoji search, with every emoji, its meaning and copy buttons.',
      },
    ],
    variants: [
      {
        slug: 'arrow-symbols',
        name: 'Arrow Symbols',
        title: 'Arrow Symbols – Copy and Paste Arrows → ← ↑ ↓ ⇒',
        metaDescription:
          'Copy and paste arrow symbols: → ← ↑ ↓ ↔ ⇒ ⇐ ➜ ➤ ↩ ↻, double, curved and heavy arrows, plus arrowheads. Click to copy and see each arrow’s Unicode code and HTML entity.',
        description:
          'Click to copy arrow symbols — → ← ↑ ↓ ↔, double arrows ⇒ ⇔, curved ↩ ↻ and heavy arrows ➜ ➤ — for documents, social posts and code.',
        config: { init_group: 'arrows' },
        keywords: ['arrow symbols', 'arrow symbol copy paste', 'text arrows'],
      },
      {
        slug: 'check-mark-symbols',
        name: 'Check Mark Symbols',
        title: 'Check Mark Symbol – Copy and Paste ✓ ✔ ☑ ✗ ✘',
        metaDescription:
          'Copy and paste check mark and tick symbols ✓ ✔ ☑ ✅ and cross marks ✗ ✘ ☒ ❌ for lists, documents and messages. Click to copy any symbol.',
        description:
          'Click to copy a check mark ✓ ✔ ☑ ✅ or a cross ✗ ✘ ☒ ❌ — for to-do lists, checklists, documents and messages.',
        config: { init_group: 'check-marks' },
        keywords: [
          'check mark symbol',
          'tick symbol',
          'checkmark copy paste',
          'cross mark symbol',
        ],
      },
      {
        slug: 'currency-symbols',
        name: 'Currency Symbols',
        title: 'Currency Symbols – Copy and Paste € £ ¥ ₹ ₿ $',
        metaDescription:
          'Copy and paste currency symbols: € £ ¥ ₹ ₽ ₩ ₺ ₦ ₱ ₿ $ ¢ and more. Click any currency sign to copy it, with its Unicode code and HTML entity.',
        description:
          'Click to copy currency symbols — € euro, £ pound, ¥ yen, ₹ rupee, ₩ won, ₺ lira, ₿ bitcoin and 20+ more.',
        config: { init_group: 'currency' },
        keywords: [
          'currency symbols',
          'euro symbol',
          'pound symbol',
          'rupee symbol',
        ],
      },
    ],
  },
  {
    slug: 'slug-generator',
    category: 'text-tools',
    alsoIn: ['developer-tools'],
    name: 'Slug Generator',
    icon: '🔗',
    shortDescription: 'Turn titles into clean URL slugs.',
    description:
      'Turn a title into a clean, SEO-friendly URL slug: “Crème Brûlée & Straße!” becomes creme-brulee-strasse. Accents are converted, punctuation removed, and you can choose hyphens or underscores, drop stop words and set a maximum length. One slug per line.',
    title: 'Slug Generator – Convert Titles to SEO-Friendly URL Slugs',
    metaDescription:
      'Convert titles to clean URL slugs: lowercase, hyphens or underscores, accents removed (é → e, ß → ss), optional stop-word removal and max length. Bulk, one per line.',
    keywords: [
      'slug generator',
      'url slug generator',
      'slugify',
      'seo friendly url',
      'permalink generator',
    ],
    relatedTools: [
      'url-encoder',
      'text-case-converter',
      'remove-duplicate-lines',
      'character-counter',
      'find-and-replace',
    ],
    component: 'text-transform',
    config: { transform: 'slug' },
    howTo: [
      'Paste one or more titles, one per line.',
      'Choose a separator and, if you like, remove stop words or set a maximum length.',
      'Copy the slugs.',
    ],
    about: [
      'A slug is the readable part of a URL that identifies a page, such as /blog/how-to-make-bread. Good slugs are short, lowercase, use hyphens between words (Google treats hyphens, not underscores, as word separators) and contain only plain letters and numbers.',
      'Accented letters are reduced to their base letter (é → e, ñ → n), and letters such as ß, æ, ø and ł are spelled out (ss, ae, o, l). Apostrophes are dropped so “don’t” becomes “dont”, not “don-t”. Letters from other scripts, such as Cyrillic or Chinese, are kept as they are. The max length cuts at a word boundary where it can; a single word longer than the limit is shortened.',
    ],
    faqs: [
      {
        q: 'Should I remove stop words from slugs?',
        a: 'Shorter slugs are easier to read and share, so dropping words like “the” and “and” often helps — but keep them when they change the meaning, as in “to-be-or-not-to-be”.',
      },
      {
        q: 'Hyphens or underscores?',
        a: 'Use hyphens for web pages. Underscores are common for file names, database keys and code identifiers.',
      },
      {
        q: 'Should I change the slug of a published page?',
        a: 'Only with a 301 redirect from the old URL, or you lose links and search rankings that point to it.',
      },
    ],
  },
];
