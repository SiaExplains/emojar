export type BlogPostMeta = {
  title: string;
  description: string;
  date: string;
};

const BLOG_POSTS_DATA: Record<string, BlogPostMeta> = {
  'emoji-games-batch-2': {
    title: '8 New Emoji Games: Wordle, 2048, Whack-a-Mole & More',
    description:
      'Play Emoji Wordle, 2048, Whack-a-Mole, Speed Sort, Timeline, Pictionary, Missing Piece, and Story Builder — all free in your browser.',
    date: '2026-06-24',
  },
  'emoji-tools-collection-2026': {
    title:
      '6 New Free Emoji Tools — Favicon, Palette, Watermark, Card, Inspector & Kitchen',
    description:
      'Six new browser-based emoji tools just launched on Emojar: generate favicons, extract color palettes, add watermarks to photos, build social cards, inspect Unicode, and combine emojis with Emoji Kitchen.',
    date: '2026-06-24',
  },
  'homepage-redesign-june-2026': {
    title: 'Emojar Homepage Redesign — Everything in One Place',
    description:
      'The Emojar homepage now shows all 18 games, all 10 colour-coded categories, emoji tools, holiday collections, and the latest blog posts — in one clean layout.',
    date: '2026-06-20',
  },
  'emoji-to-png-download': {
    title: 'Download Any Emoji as a PNG Image — Free, Instant, No Sign-up',
    description:
      'The Emojar Emoji to PNG tool lets you convert any of the 3,790 emojis to a high-quality image. Choose your size, background, and padding — then download in one click.',
    date: '2026-06-19',
  },
  'find-your-emoji-personality': {
    title:
      'Find Your Emoji Personality — A Character Quiz Backed by Psychology',
    description:
      'Answer 12 personality-science questions and discover which 5 emojis match your character. Then download or share your personalised emoji card.',
    date: '2026-05-25',
  },
  'seo-indexation-recovery': {
    title: 'How We Recovered Emojar From a Google Indexation Drop',
    description:
      'Emojar lost most of its indexed pages in early 2026. Here is exactly what caused it — server errors, a www redirect conflict, dead sitemap URLs — and how we fixed everything.',
    date: '2026-05-14',
  },
  'emoji-events-collection': {
    title: 'Emoji Collections for Every Holiday & Event',
    description:
      "Curated emoji packs for 15 major holidays — New Year, Valentine's Day, Halloween, Christmas, Diwali, and more. Copy a single emoji or the whole set.",
    date: '2026-05-14',
  },
  'odd-one-out-game': {
    title: "Odd One Out — Spot the Emoji That Doesn't Belong",
    description:
      "Five emojis, four share a theme — one doesn't fit. A new emoji logic game with 50+ curated rounds across food, animals, sports, nature, and more.",
    date: '2026-05-14',
  },
  'guess-the-animal-game': {
    title: 'Guess the Animal — Name the Emoji, Learn a Fact',
    description:
      'A new emoji quiz covering all 130 animal emojis — mammals, birds, reptiles, marine life, and more. Every round ends with a fun animal fact.',
    date: '2026-05-13',
  },
  'older-or-newer-game': {
    title: 'Older or Newer — How Well Do You Know Emoji History?',
    description:
      'A new emoji quiz game: two emojis side by side — guess which one was added to Unicode first. 3,700+ emojis spanning 16 versions from 2010 to 2024.',
    date: '2026-05-13',
  },
  'emoji-puzzle-game': {
    title: 'Emoji Puzzle — Test Your Memory with Emoji Cards',
    description:
      'Flip emoji cards and find every matching pair. Our new memory match game has three difficulty levels — Easy (4x4), Medium (6x6), and Hard (8x8).',
    date: '2026-05-13',
  },
  'emojar-may-2026-updates': {
    title: "What's New on Emojar — May 2026 Updates",
    description:
      'A roundup of recent improvements: emoji games, category breadcrumbs, a refreshed homepage, an improved About page, and more.',
    date: '2026-05-13',
  },
  'emojar-games-launched': {
    title: 'Emojar Games Is Live — Play Emoji Mini-Games Now!',
    description:
      'We just launched the Emojar Games page. Play five emoji-themed mini-games: XO, Snake, Minesweeper, Hangman, and Bubble Shooter — all free, right in your browser.',
    date: '2026-05-13',
  },
  'emoji-xo-game-guide': {
    title: 'How to Play Emoji XO (Tic-Tac-Toe) on Emojar',
    description:
      'Rules, board size options, custom emoji pieces, AI opponent strategy, and tips for winning the Emoji XO game.',
    date: '2026-05-13',
  },
  'emoji-snake-game-guide': {
    title: 'How to Play Emoji Snake on Emojar',
    description:
      'Controls, survival tips, and high-score strategy for the Emoji Snake game on Emojar.',
    date: '2026-05-13',
  },
  'emoji-minesweeper-game-guide': {
    title: 'How to Play Emoji Minesweeper on Emojar',
    description:
      'Number logic, flagging strategy, and pattern-reading tips for clearing the emoji mine field on Emojar.',
    date: '2026-05-13',
  },
  'emoji-hangman-game-guide': {
    title: 'How to Play Emoji Hangman on Emojar',
    description:
      'Rules, best-first-letter strategy, and tips for guessing emoji Unicode names in the Emojar Hangman game.',
    date: '2026-05-13',
  },
  'emoji-bubble-shooter-game-guide': {
    title: 'How to Play Emoji Bubble Shooter on Emojar',
    description:
      'Aiming, wall bounces, chain reactions, and score-maximising tips for the Emoji Bubble Shooter game.',
    date: '2026-05-13',
  },
};

export default BLOG_POSTS_DATA;
