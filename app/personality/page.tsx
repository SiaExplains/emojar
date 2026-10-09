'use client';

import { useCallback, useRef, useState } from 'react';
import Link from 'next/link';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface TraitVector {
  J: number; // Joy / Positive Affect
  W: number; // Warmth / Agreeableness
  C: number; // Calm / Emotional Stability
  O: number; // Openness / Creativity
  G: number; // Grit / Conscientiousness
}

interface Question {
  id: number;
  text: string;
  options: { label: string; traits: Partial<TraitVector> }[];
}

interface EmojiPersonality {
  char: string;
  name: string;
  slug: string;
  traits: TraitVector;
  tagline: string;
  explanation: string;
}

// ---------------------------------------------------------------------------
// 12 Psychology-Based Questions  (Big Five / OCEAN model adapted)
// Dimensions: J=Joy, W=Warmth, C=Calm, O=Openness, G=Grit
// ---------------------------------------------------------------------------

const QUESTIONS: Question[] = [
  {
    id: 1,
    text: 'How do you typically prefer to spend your free time?',
    options: [
      {
        label: '🎉 Going out, socialising, meeting people',
        traits: { J: 3, W: 2 },
      },
      {
        label: '🎨 Creating something — art, music, or writing',
        traits: { O: 3, J: 2 },
      },
      {
        label: '✅ Getting things done from my to-do list',
        traits: { G: 3, C: 2 },
      },
      {
        label: '🌿 Quietly reflecting or being out in nature',
        traits: { C: 3, O: 2 },
      },
    ],
  },
  {
    id: 2,
    text: 'A close friend is going through a hard time. What do you do?',
    options: [
      {
        label: '🤗 Drop everything to be physically there for them',
        traits: { W: 4, J: 1 },
      },
      {
        label: '🧠 Listen carefully and offer thoughtful advice',
        traits: { W: 3, C: 2 },
      },
      {
        label: '😂 Send a funny meme or voice note to lift their spirits',
        traits: { J: 3, W: 2 },
      },
      {
        label: '🕊️ Give them space but check in a few days later',
        traits: { C: 3, W: 2 },
      },
    ],
  },
  {
    id: 3,
    text: 'Your workspace or bedroom most closely resembles…',
    options: [
      {
        label: '📋 Organized — everything has its exact place',
        traits: { G: 3, C: 3 },
      },
      {
        label: '🗒️ Covered in sticky notes, sketches, and inspiration',
        traits: { O: 3, J: 2 },
      },
      {
        label: '🛋️ Cozy and warm — comfort matters most',
        traits: { W: 3, C: 2 },
      },
      {
        label: '🪟 Minimal and clean — less is more',
        traits: { C: 3, G: 2 },
      },
    ],
  },
  {
    id: 4,
    text: 'When making an important decision, you usually…',
    options: [
      {
        label: '⚡ Trust your gut and act quickly',
        traits: { J: 2, O: 3 },
      },
      {
        label: '📊 Make a pros-and-cons list and weigh everything',
        traits: { G: 3, C: 2 },
      },
      {
        label: '💬 Ask everyone around you for their perspective',
        traits: { W: 3, J: 2 },
      },
      {
        label: '🌙 Sleep on it for several days before deciding',
        traits: { C: 4, G: 1 },
      },
    ],
  },
  {
    id: 5,
    text: 'Which best describes your sense of humour?',
    options: [
      {
        label: '🤪 Absurd and silly — the more ridiculous the better',
        traits: { J: 4, O: 2 },
      },
      {
        label: '😏 Dry wit and subtle sarcasm',
        traits: { O: 3, C: 2 },
      },
      {
        label: '😊 Warm and self-deprecating',
        traits: { W: 3, J: 2 },
      },
      {
        label: '🌑 Dark, unexpected, with a twist',
        traits: { O: 3, G: 2 },
      },
    ],
  },
  {
    id: 6,
    text: 'When you face a significant setback, your first reaction is to…',
    options: [
      {
        label: '💪 Pick yourself up and try a different angle',
        traits: { G: 4, J: 2 },
      },
      {
        label: '🔍 Reflect deeply and extract every lesson from it',
        traits: { C: 3, O: 3 },
      },
      {
        label: '🫂 Talk to someone you trust about how you feel',
        traits: { W: 3, J: 1 },
      },
      {
        label: '🎭 Channel those feelings into something creative',
        traits: { O: 3, G: 2 },
      },
    ],
  },
  {
    id: 7,
    text: "What's your ideal holiday?",
    options: [
      {
        label: '🎆 A buzzing city or music festival',
        traits: { J: 3, O: 3 },
      },
      {
        label: '🏔️ Solo hiking or camping in wild nature',
        traits: { C: 3, G: 3 },
      },
      {
        label: '🚗 Road trip with your closest friends',
        traits: { W: 3, J: 3 },
      },
      {
        label: '🌍 Immersing in a completely foreign culture',
        traits: { O: 4, C: 2 },
      },
    ],
  },
  {
    id: 8,
    text: 'How do the people closest to you most often describe you?',
    options: [
      {
        label: '😄 Funny, energetic, and hard to ignore',
        traits: { J: 4, W: 2 },
      },
      {
        label: '📌 Reliable, organized, always delivers',
        traits: { G: 4, C: 2 },
      },
      {
        label: '💛 Kind, thoughtful, and genuinely caring',
        traits: { W: 4, C: 2 },
      },
      {
        label: '🔭 Creative, curious, full of ideas',
        traits: { O: 4, J: 2 },
      },
    ],
  },
  {
    id: 9,
    text: "What's your relationship with daily routines?",
    options: [
      {
        label: '🗓️ I thrive on them — structure is freedom',
        traits: { G: 4, C: 3 },
      },
      {
        label: '🌊 I have loose routines but adapt easily',
        traits: { C: 3, G: 2 },
      },
      {
        label: '🎲 Routines feel like cages — I prefer spontaneity',
        traits: { O: 3, J: 3 },
      },
      {
        label: "🌀 I flow with the day — what's a routine?",
        traits: { J: 3, O: 3 },
      },
    ],
  },
  {
    id: 10,
    text: 'In a group project, you naturally fall into the role of…',
    options: [
      {
        label: '🧭 The leader who keeps everyone on track',
        traits: { G: 3, W: 2 },
      },
      {
        label: "💡 The ideas person who sparks the team's creativity",
        traits: { O: 4, J: 2 },
      },
      {
        label: '🤝 The mediator who makes sure everyone feels heard',
        traits: { W: 4, C: 2 },
      },
      {
        label: '🎯 The focused executor who works alone and delivers',
        traits: { G: 3, C: 3 },
      },
    ],
  },
  {
    id: 11,
    text: 'When you feel emotionally overwhelmed, you tend to…',
    options: [
      {
        label: '🎵 Put on music and let the feeling wash over you',
        traits: { O: 3, J: 2 },
      },
      {
        label: '🧘 Breathe, step back, and wait for clarity',
        traits: { C: 4, G: 2 },
      },
      {
        label: '📞 Immediately call or text someone close',
        traits: { W: 4, J: 1 },
      },
      {
        label: '🏃 Move your body — walk, run, or work out',
        traits: { G: 3, C: 3 },
      },
    ],
  },
  {
    id: 12,
    text: 'What do you most want other people to feel when they are around you?',
    options: [
      {
        label: '✨ Inspired, excited, and full of energy',
        traits: { J: 3, O: 3 },
      },
      {
        label: '🏡 Safe, understood, and completely accepted',
        traits: { W: 4, C: 2 },
      },
      {
        label: '🔋 Motivated, focused, and ready to take action',
        traits: { G: 3, W: 2 },
      },
      {
        label: '🎈 Free, light-hearted, and joyful',
        traits: { J: 4, W: 2 },
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Emoji personality pool — 30 entries with trait vectors
// ---------------------------------------------------------------------------

const EMOJI_POOL: EmojiPersonality[] = [
  {
    char: '😂',
    name: 'Face with Tears of Joy',
    slug: 'face-with-tears-of-joy',
    traits: { J: 5, W: 3, C: 1, O: 2, G: 1 },
    tagline: 'The life of the party',
    explanation:
      'You bring laughter wherever you go. Your infectious joy and quick wit make people feel instantly at ease — you are the friend who turns any situation into a story worth telling.',
  },
  {
    char: '❤️',
    name: 'Red Heart',
    slug: 'red-heart',
    traits: { J: 3, W: 5, C: 3, O: 2, G: 2 },
    tagline: 'The heartful connector',
    explanation:
      'Love and warmth define you. You lead with empathy, invest deeply in your relationships, and have an extraordinary ability to make others feel truly seen and valued.',
  },
  {
    char: '🧘',
    name: 'Person in Lotus Position',
    slug: 'person-in-lotus-position',
    traits: { J: 2, W: 2, C: 5, O: 3, G: 4 },
    tagline: 'The calm anchor',
    explanation:
      'Where others see chaos, you find stillness. Your grounded nature and emotional steadiness make you an anchor for those around you — the person everyone turns to when things get stormy.',
  },
  {
    char: '🚀',
    name: 'Rocket',
    slug: 'rocket',
    traits: { J: 3, W: 1, C: 1, O: 5, G: 5 },
    tagline: 'The relentless achiever',
    explanation:
      'You are driven by big visions and bold execution. A fearless explorer who sets ambitious targets and has the grit to reach them — failure is just data on the way to launch.',
  },
  {
    char: '🌈',
    name: 'Rainbow',
    slug: 'rainbow',
    traits: { J: 4, W: 3, C: 3, O: 5, G: 2 },
    tagline: 'The radiant optimist',
    explanation:
      'You see possibility everywhere and bring colour to everyday moments. Your open-mindedness, creativity, and belief in a better future inspire the people lucky enough to know you.',
  },
  {
    char: '🦁',
    name: 'Lion',
    slug: 'lion',
    traits: { J: 2, W: 2, C: 2, O: 3, G: 5 },
    tagline: 'The courageous leader',
    explanation:
      'Strength and resolve run through everything you do. You are not afraid to take charge, face hard truths, or stand alone — your fierce determination earns the respect of everyone around you.',
  },
  {
    char: '🎨',
    name: 'Artist Palette',
    slug: 'artist-palette',
    traits: { J: 3, W: 2, C: 3, O: 5, G: 3 },
    tagline: 'The creative soul',
    explanation:
      'The world is your canvas. You process emotions and ideas through creative expression, finding beauty and meaning in places others walk right past. Your originality is your superpower.',
  },
  {
    char: '🌙',
    name: 'Crescent Moon',
    slug: 'crescent-moon',
    traits: { J: 2, W: 3, C: 5, O: 4, G: 2 },
    tagline: 'The quiet dreamer',
    explanation:
      'Introspective and deeply imaginative, you live richly in your inner world. Your thoughtfulness and unique perspective often surface as quiet wisdom that surprises people when it arrives.',
  },
  {
    char: '⚡',
    name: 'High Voltage',
    slug: 'high-voltage',
    traits: { J: 3, W: 1, C: 1, O: 3, G: 5 },
    tagline: 'The bold risk-taker',
    explanation:
      'Fast, decisive, and electrifying to be around. You move on instinct, thrive under pressure, and your explosive energy has a way of jump-starting the entire room.',
  },
  {
    char: '🌸',
    name: 'Cherry Blossom',
    slug: 'cherry-blossom',
    traits: { J: 4, W: 4, C: 4, O: 3, G: 2 },
    tagline: 'The gentle nurturer',
    explanation:
      'Soft but resilient — like a blossom that survives the cold. You bring beauty to everyday moments, care deeply for the people in your world, and flourish when you feel safe and loved.',
  },
  {
    char: '🦋',
    name: 'Butterfly',
    slug: 'butterfly',
    traits: { J: 4, W: 3, C: 3, O: 5, G: 2 },
    tagline: 'The free spirit',
    explanation:
      'Change does not scare you — it excites you. You are constantly evolving, drawn to new ideas and experiences, and your light touch on the world leaves a trail of wonder wherever you land.',
  },
  {
    char: '🐺',
    name: 'Wolf',
    slug: 'wolf',
    traits: { J: 2, W: 3, C: 2, O: 3, G: 5 },
    tagline: 'The fierce loyalist',
    explanation:
      'Independent yet deeply devoted to your pack. You operate with instinct and conviction, fiercely protecting those you love while pursuing your own path with quiet, unwavering intensity.',
  },
  {
    char: '🌊',
    name: 'Water Wave',
    slug: 'water-wave',
    traits: { J: 3, W: 2, C: 4, O: 4, G: 3 },
    tagline: 'The fluid adapter',
    explanation:
      'Powerful yet adaptable — you move with the currents of life rather than fighting them. Your emotional depth and ability to read the room make you a naturally compelling and trustworthy presence.',
  },
  {
    char: '🎯',
    name: 'Direct Hit',
    slug: 'direct-hit',
    traits: { J: 2, W: 1, C: 3, O: 2, G: 5 },
    tagline: 'The focused strategist',
    explanation:
      'You cut through noise and go straight to what matters. Precise, deliberate, and masterful at prioritizing — when you commit to something, it gets done exceptionally well.',
  },
  {
    char: '🌿',
    name: 'Herb',
    slug: 'herb',
    traits: { J: 3, W: 4, C: 5, O: 3, G: 3 },
    tagline: 'The grounded healer',
    explanation:
      'Rooted, steady, and quietly restorative. People feel genuinely better after spending time with you. Your calm presence and natural wisdom make you the person others seek out when they need to breathe.',
  },
  {
    char: '🦊',
    name: 'Fox',
    slug: 'fox',
    traits: { J: 3, W: 2, C: 2, O: 5, G: 4 },
    tagline: 'The clever innovator',
    explanation:
      'Quick-thinking, adaptable, and delightfully unpredictable. You approach problems from unexpected angles and usually come up with a solution nobody else thought of — then charm everyone into trying it.',
  },
  {
    char: '🎭',
    name: 'Performing Arts',
    slug: 'performing-arts',
    traits: { J: 4, W: 3, C: 2, O: 5, G: 3 },
    tagline: 'The expressive performer',
    explanation:
      'Authentic, vivid, and impossible to ignore. You express your full emotional range without apology, drawing people in with your storytelling and making them feel something real.',
  },
  {
    char: '🔥',
    name: 'Fire',
    slug: 'fire',
    traits: { J: 3, W: 2, C: 1, O: 3, G: 5 },
    tagline: 'The passionate force',
    explanation:
      'Intense, magnetic, and impossible to extinguish. When you care about something, you pour everything into it. Your passion is contagious and has a habit of setting everyone else alight.',
  },
  {
    char: '🦄',
    name: 'Unicorn',
    slug: 'unicorn',
    traits: { J: 5, W: 4, C: 3, O: 5, G: 2 },
    tagline: 'The magical original',
    explanation:
      'One of a kind — and you know it. Wildly creative, joyfully authentic, and utterly unapologetic about your uniqueness. You remind the world that extraordinary things are possible.',
  },
  {
    char: '🧩',
    name: 'Puzzle Piece',
    slug: 'puzzle-piece',
    traits: { J: 3, W: 2, C: 3, O: 5, G: 4 },
    tagline: 'The deep thinker',
    explanation:
      'You love to understand how things fit together. Patient, analytical, and endlessly curious — you are at your best when you have a complex problem to solve and the space to think it through completely.',
  },
  {
    char: '🦅',
    name: 'Eagle',
    slug: 'eagle',
    traits: { J: 2, W: 2, C: 3, O: 4, G: 5 },
    tagline: 'The visionary eagle',
    explanation:
      'You see far beyond where others look. Your combination of wide perspective and laser focus means you spot opportunities and threats before anyone else — then act on them decisively.',
  },
  {
    char: '🌻',
    name: 'Sunflower',
    slug: 'sunflower',
    traits: { J: 5, W: 4, C: 4, O: 3, G: 3 },
    tagline: 'The radiant optimist',
    explanation:
      'Warm, bright, and always turning toward the light. Your consistent positivity is not naïve — it is a choice you make every day, and it quietly transforms the mood of everyone around you.',
  },
  {
    char: '🎵',
    name: 'Musical Note',
    slug: 'musical-note',
    traits: { J: 5, W: 3, C: 3, O: 4, G: 3 },
    tagline: 'The joyful harmoniser',
    explanation:
      'Life, for you, has rhythm. You bring people together, find the melody in the mundane, and have an instinctive sense for when something needs to be lighter, louder, or more in tune.',
  },
  {
    char: '🐬',
    name: 'Dolphin',
    slug: 'dolphin',
    traits: { J: 5, W: 5, C: 3, O: 4, G: 3 },
    tagline: 'The playful empath',
    explanation:
      'Sociable, emotionally intelligent, and genuinely fun to be around. You navigate complex feelings — your own and others — with a grace that makes even difficult conversations feel safe.',
  },
  {
    char: '💎',
    name: 'Gem Stone',
    slug: 'gem-stone',
    traits: { J: 2, W: 2, C: 4, O: 3, G: 5 },
    tagline: 'The resilient perfectionist',
    explanation:
      'Formed under pressure — and all the better for it. You hold yourself to extraordinarily high standards, produce work of lasting quality, and your steadfast character inspires deep admiration.',
  },
  {
    char: '🌍',
    name: 'Globe Showing Europe-Africa',
    slug: 'globe-showing-europe-africa',
    traits: { J: 3, W: 4, C: 3, O: 5, G: 4 },
    tagline: 'The world-builder',
    explanation:
      'Big picture, bigger heart. You think globally, care about collective well-being, and are motivated by building things — ideas, communities, solutions — that outlast any individual moment.',
  },
  {
    char: '🍀',
    name: 'Four Leaf Clover',
    slug: 'four-leaf-clover',
    traits: { J: 4, W: 3, C: 4, O: 2, G: 3 },
    tagline: 'The lucky optimist',
    explanation:
      'Cheerful, balanced, and quietly fortunate — luck tends to find you because you stay open to it. Your easygoing nature and genuine goodwill create the kind of atmosphere where good things just happen.',
  },
  {
    char: '🏔️',
    name: 'Snow-Capped Mountain',
    slug: 'snow-capped-mountain',
    traits: { J: 2, W: 2, C: 5, O: 4, G: 5 },
    tagline: 'The stoic explorer',
    explanation:
      'Towering, enduring, and awe-inspiring in your steadiness. You embrace solitude, face enormous challenges without flinching, and your quiet strength is the kind that others build their confidence against.',
  },
  {
    char: '🐝',
    name: 'Honeybee',
    slug: 'honeybee',
    traits: { J: 3, W: 3, C: 3, O: 3, G: 5 },
    tagline: 'The tireless contributor',
    explanation:
      'Purposeful, community-minded, and endlessly productive. You show up every day, do your part with quiet dedication, and understand that the sweetest results come from consistent, careful effort over time.',
  },
  {
    char: '🌺',
    name: 'Hibiscus',
    slug: 'hibiscus',
    traits: { J: 4, W: 4, C: 3, O: 4, G: 2 },
    tagline: 'The vibrant nurturer',
    explanation:
      'Bold, beautiful, and full of life. You give generously, create warmth wherever you are, and have a natural flair for making ordinary moments feel like celebrations.',
  },
];

// ---------------------------------------------------------------------------
// Scoring utilities
// ---------------------------------------------------------------------------

function addTraits(acc: TraitVector, delta: Partial<TraitVector>): TraitVector {
  return {
    J: acc.J + (delta.J ?? 0),
    W: acc.W + (delta.W ?? 0),
    C: acc.C + (delta.C ?? 0),
    O: acc.O + (delta.O ?? 0),
    G: acc.G + (delta.G ?? 0),
  };
}

function cosineSimilarity(a: TraitVector, b: TraitVector): number {
  const keys: (keyof TraitVector)[] = ['J', 'W', 'C', 'O', 'G'];
  const dot = keys.reduce((s, k) => s + a[k] * b[k], 0);
  const magA = Math.sqrt(keys.reduce((s, k) => s + a[k] ** 2, 0));
  const magB = Math.sqrt(keys.reduce((s, k) => s + b[k] ** 2, 0));
  if (magA === 0 || magB === 0) return 0;
  return dot / (magA * magB);
}

function getTopEmojis(
  userVector: TraitVector,
  count = 5,
): (EmojiPersonality & { score: number })[] {
  return EMOJI_POOL.map((e) => ({
    ...e,
    score: cosineSimilarity(userVector, e.traits),
  }))
    .sort((a, b) => b.score - a.score)
    .slice(0, count);
}

// ---------------------------------------------------------------------------
// Canvas image generator
// ---------------------------------------------------------------------------

async function generatePersonalityImage(
  emojis: EmojiPersonality[],
): Promise<Blob> {
  const SIZE = 1080;
  const canvas = document.createElement('canvas');
  canvas.width = SIZE;
  canvas.height = SIZE;
  const ctx = canvas.getContext('2d')!;

  // Background gradient
  const grad = ctx.createLinearGradient(0, 0, SIZE, SIZE);
  grad.addColorStop(0, '#1a1a2e');
  grad.addColorStop(0.5, '#16213e');
  grad.addColorStop(1, '#0f3460');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, SIZE, SIZE);

  // Subtle grid overlay
  ctx.strokeStyle = 'rgba(255,255,255,0.04)';
  ctx.lineWidth = 1;
  for (let x = 0; x < SIZE; x += 60) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, SIZE);
    ctx.stroke();
  }
  for (let y = 0; y < SIZE; y += 60) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(SIZE, y);
    ctx.stroke();
  }

  // Title
  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ctx.font = '500 32px system-ui, sans-serif';
  ctx.fillText('My Emoji Personality', SIZE / 2, 100);

  // Decorative line
  ctx.strokeStyle = 'rgba(255,255,255,0.15)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(200, 120);
  ctx.lineTo(SIZE - 200, 120);
  ctx.stroke();

  // Emojis — render via temporary off-screen approach
  // Draw emojis large in a row
  const emojiSize = 140;
  const totalWidth = emojis.length * emojiSize + (emojis.length - 1) * 20;
  const startX = (SIZE - totalWidth) / 2;
  const emojiY = 280;

  ctx.font = `${emojiSize}px serif`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  emojis.forEach((e, i) => {
    const x = startX + i * (emojiSize + 20);
    ctx.fillText(e.char, x, emojiY);
  });

  // Taglines below each emoji
  ctx.font = '500 22px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  emojis.forEach((e, i) => {
    const cx = startX + i * (emojiSize + 20) + emojiSize / 2;
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    ctx.fillText(e.tagline, cx, emojiY + emojiSize + 44);
  });

  // Separator
  ctx.strokeStyle = 'rgba(255,255,255,0.12)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(120, 590);
  ctx.lineTo(SIZE - 120, 590);
  ctx.stroke();

  // Primary result: top emoji name + explanation (wrapped)
  const primary = emojis[0];
  ctx.fillStyle = 'rgba(255,255,255,0.95)';
  ctx.font = 'bold 36px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(`${primary.char}  ${primary.name}`, SIZE / 2, 650);

  ctx.fillStyle = 'rgba(255,255,255,0.65)';
  ctx.font = '26px system-ui, sans-serif';
  const words = primary.explanation.split(' ');
  const lineHeight = 40;
  let line = '';
  let lineY = 700;
  const maxWidth = SIZE - 160;
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth) {
      ctx.fillText(line, SIZE / 2, lineY);
      line = word;
      lineY += lineHeight;
      if (lineY > 850) break;
    } else {
      line = test;
    }
  }
  if (line && lineY <= 850) ctx.fillText(line, SIZE / 2, lineY);

  // Footer
  ctx.fillStyle = 'rgba(255,255,255,0.35)';
  ctx.font = '24px system-ui, sans-serif';
  ctx.fillText('emojar.com/personality', SIZE / 2, SIZE - 60);

  // Gold accent line at bottom
  const accent = ctx.createLinearGradient(200, 0, SIZE - 200, 0);
  accent.addColorStop(0, 'transparent');
  accent.addColorStop(0.5, '#e2b96f');
  accent.addColorStop(1, 'transparent');
  ctx.strokeStyle = accent;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(200, SIZE - 40);
  ctx.lineTo(SIZE - 200, SIZE - 40);
  ctx.stroke();

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) =>
        blob ? resolve(blob) : reject(new Error('canvas toBlob failed')),
      'image/png',
    );
  });
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

type Phase = 'intro' | 'quiz' | 'results';

export default function PersonalityPage() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [results, setResults] = useState<
    (EmojiPersonality & { score: number })[]
  >([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [shareStatus, setShareStatus] = useState<
    'idle' | 'generating' | 'done' | 'error'
  >('idle');
  const [copied, setCopied] = useState(false);
  const blobRef = useRef<Blob | null>(null);

  const handleStart = () => {
    setPhase('quiz');
    setCurrentQ(0);
    setAnswers([]);
    setSelectedOption(null);
  };

  const handleOption = useCallback(
    (optIndex: number) => {
      if (selectedOption !== null) return;
      setSelectedOption(optIndex);

      setTimeout(() => {
        const newAnswers = [...answers, optIndex];
        if (currentQ < QUESTIONS.length - 1) {
          setAnswers(newAnswers);
          setCurrentQ((q) => q + 1);
          setSelectedOption(null);
        } else {
          // Calculate scores
          let vector: TraitVector = { J: 0, W: 0, C: 0, O: 0, G: 0 };
          newAnswers.forEach((opt, qi) => {
            vector = addTraits(vector, QUESTIONS[qi].options[opt].traits);
          });
          const top = getTopEmojis(vector, 5);
          setResults(top);
          setPhase('results');
        }
      }, 350);
    },
    [selectedOption, answers, currentQ],
  );

  const handleRestart = () => {
    setPhase('intro');
    setCurrentQ(0);
    setAnswers([]);
    setSelectedOption(null);
    setResults([]);
    setShareStatus('idle');
    blobRef.current = null;
    setCopied(false);
  };

  const handleDownload = async () => {
    setShareStatus('generating');
    try {
      const blob = blobRef.current ?? (await generatePersonalityImage(results));
      blobRef.current = blob;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'my-emoji-personality.png';
      a.click();
      URL.revokeObjectURL(url);
      setShareStatus('done');
    } catch {
      setShareStatus('error');
    }
  };

  const handleShare = async () => {
    setShareStatus('generating');
    try {
      const blob = blobRef.current ?? (await generatePersonalityImage(results));
      blobRef.current = blob;
      const file = new File([blob], 'my-emoji-personality.png', {
        type: 'image/png',
      });
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          title: 'My Emoji Personality',
          text: `My top emoji match is ${results[0].char} "${results[0].name}" — find yours at emojar.com/personality`,
          files: [file],
        });
      } else {
        await navigator.share({
          title: 'My Emoji Personality',
          text: `My top emoji match is ${results[0].char} "${results[0].name}" — find yours at emojar.com/personality`,
          url: 'https://emojar.com/personality',
        });
      }
      setShareStatus('done');
    } catch {
      setShareStatus('error');
    }
  };

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText('https://emojar.com/personality');
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // -------------------------------------------------------------------------
  // Intro screen
  // -------------------------------------------------------------------------

  if (phase === 'intro') {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 text-center space-y-8">
        <div className="space-y-3">
          <div className="text-7xl">🪞</div>
          <h1 className="text-3xl sm:text-4xl font-bold">
            Find Your Emoji Personality
          </h1>
          <p className="text-gray-500 text-lg leading-relaxed">
            Answer 12 questions rooted in personality psychology and discover
            which 5 emojis mirror your character — then share your result card
            with friends.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4 text-sm">
          {[
            { icon: '🧠', label: '12 questions', sub: 'Psychology-based' },
            {
              icon: '🎯',
              label: '5 emoji matches',
              sub: 'Personalised to you',
            },
            { icon: '📤', label: 'Shareable card', sub: 'Download or share' },
          ].map((f) => (
            <div
              key={f.label}
              className="rounded-xl border bg-gray-50 p-4 flex flex-col items-center gap-1"
            >
              <span className="text-3xl">{f.icon}</span>
              <span className="font-semibold">{f.label}</span>
              <span className="text-gray-400 text-xs">{f.sub}</span>
            </div>
          ))}
        </div>

        <button
          onClick={handleStart}
          className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gray-900 text-white text-lg font-semibold hover:bg-gray-700 transition-colors shadow-lg"
        >
          Start the Quiz ✨
        </button>

        <p className="text-xs text-gray-400">
          Takes about 2 minutes · No account needed · 100% free
        </p>
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // Quiz screen
  // -------------------------------------------------------------------------

  if (phase === 'quiz') {
    const q = QUESTIONS[currentQ];
    const progress = ((currentQ + 1) / QUESTIONS.length) * 100;

    return (
      <div className="max-w-2xl mx-auto py-10 px-4 space-y-8">
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-500">
            <span>
              Question {currentQ + 1} of {QUESTIONS.length}
            </span>
            <span>{Math.round(progress)}% complete</span>
          </div>
          <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
            <div
              className="h-full rounded-full bg-gray-900 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="space-y-6">
          <h2 className="text-xl sm:text-2xl font-semibold leading-snug">
            {q.text}
          </h2>

          <div className="space-y-3">
            {q.options.map((opt, i) => {
              const isSelected = selectedOption === i;
              return (
                <button
                  key={i}
                  onClick={() => handleOption(i)}
                  disabled={selectedOption !== null}
                  className={[
                    'w-full text-left px-5 py-4 rounded-xl border text-sm sm:text-base transition-all duration-200',
                    isSelected
                      ? 'bg-gray-900 text-white border-gray-900 shadow-lg scale-[1.02]'
                      : 'bg-white hover:bg-gray-50 hover:border-gray-400 hover:shadow-sm',
                    selectedOption !== null && !isSelected
                      ? 'opacity-40 cursor-not-allowed'
                      : 'cursor-pointer',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // Results screen
  // -------------------------------------------------------------------------

  const primary = results[0];

  return (
    <div className="max-w-2xl mx-auto py-10 px-4 space-y-10">
      {/* Hero result */}
      <div className="text-center space-y-3">
        <p className="text-sm text-gray-400 uppercase tracking-widest font-medium">
          Your Primary Emoji
        </p>
        <div className="text-8xl leading-none">{primary.char}</div>
        <h1 className="text-2xl sm:text-3xl font-bold">{primary.name}</h1>
        <p className="inline-block bg-gray-100 text-gray-700 text-sm font-medium px-4 py-1.5 rounded-full">
          {primary.tagline}
        </p>
        <p className="text-gray-600 leading-relaxed text-base mt-2">
          {primary.explanation}
        </p>
      </div>

      {/* Top 5 */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Your Full Personality Palette</h2>
        <div className="space-y-3">
          {results.map((e, i) => (
            <div
              key={e.slug}
              className={[
                'flex items-start gap-4 p-4 rounded-xl border transition-shadow',
                i === 0
                  ? 'bg-gray-900 text-white border-gray-900 shadow-md'
                  : 'bg-white hover:shadow-sm',
              ].join(' ')}
            >
              <span className="text-4xl shrink-0">{e.char}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-sm">{e.name}</span>
                  <span
                    className={[
                      'text-xs px-2 py-0.5 rounded-full font-medium',
                      i === 0
                        ? 'bg-white/20 text-white'
                        : 'bg-gray-100 text-gray-600',
                    ].join(' ')}
                  >
                    {i === 0 ? '✨ Primary match' : `#${i + 1} match`}
                  </span>
                </div>
                <p
                  className={[
                    'text-sm mt-1 leading-relaxed',
                    i === 0 ? 'text-gray-200' : 'text-gray-500',
                  ].join(' ')}
                >
                  {e.explanation}
                </p>
                <Link
                  href={`/emoji/${e.slug}`}
                  className={[
                    'text-xs mt-1.5 inline-block hover:underline',
                    i === 0 ? 'text-gray-300' : 'text-blue-600',
                  ].join(' ')}
                >
                  Learn about {e.char} →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Share section */}
      <div className="rounded-2xl border bg-gray-50 p-6 space-y-4">
        <div>
          <h2 className="text-lg font-semibold">Share Your Result</h2>
          <p className="text-sm text-gray-500 mt-1">
            Generate a personalised image card with your 5 emoji matches and
            share it anywhere.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleDownload}
            disabled={shareStatus === 'generating'}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gray-900 text-white text-sm font-medium hover:bg-gray-700 transition-colors disabled:opacity-60"
          >
            {shareStatus === 'generating' ? (
              <>
                <span className="animate-spin inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full" />
                Generating…
              </>
            ) : (
              <>⬇️ Download Image</>
            )}
          </button>

          {typeof navigator !== 'undefined' && 'share' in navigator && (
            <button
              onClick={handleShare}
              disabled={shareStatus === 'generating'}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-gray-300 bg-white text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-60"
            >
              📤 Share
            </button>
          )}

          <button
            onClick={handleCopyLink}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-gray-300 bg-white text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            {copied ? '✅ Copied!' : '🔗 Copy Link'}
          </button>
        </div>

        {shareStatus === 'error' && (
          <p className="text-red-500 text-sm">
            Something went wrong. Please try again.
          </p>
        )}
      </div>

      {/* Retake */}
      <div className="text-center space-y-3">
        <button
          onClick={handleRestart}
          className="text-sm text-gray-500 hover:text-gray-800 underline underline-offset-2 transition-colors"
        >
          Retake the quiz
        </button>
        <p className="text-xs text-gray-400">
          Discover{' '}
          <Link href="/collection/alphabet" className="underline">
            all 3,700+ emojis
          </Link>{' '}
          on Emojar
        </p>
      </div>
    </div>
  );
}
