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
      'text-case-converter',
      'remove-duplicate-lines',
      'lorem-ipsum-generator',
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
      'Characters are counted as user-perceived characters, so an emoji such as 👍 counts as one even though it is stored as two code units. Some platforms (like SMS) count differently for non-Latin text.',
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
    relatedTools: ['remove-duplicate-lines', 'sort-lines', 'find-and-replace'],
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
];
