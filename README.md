# Emojar — MVP Starter

A minimal Next.js 14 + TypeScript + Tailwind project to launch **Emojar.com**.

## Features

- ⚡️ Client-side fuzzy search (Fuse.js) on a local emoji JSON dataset
- 📚 Categories & emoji pages with static routes
- 📋 One-click copy to clipboard + toast
- 🌙 Dark-ready styles (Tailwind) + clean UI
- 🔎 SEO metadata, robots, sitemap route
- 🍪 Basic consent banner (replace with a proper CMP for production)
- 🪧 AdSense placeholders (replace with your publisher id and ad slots)
- 📱 PWA manifest

## Quickstart

```bash
pnpm i # or npm i / yarn
pnpm dev
```

Then visit http://localhost:3000

## Production

```bash
pnpm build && pnpm start
```

## Where to customize

- `public/ads.txt` → put your AdSense publisher ID
- `components/AdSlot.tsx` → replace slot id with your own
- `app/layout.tsx` → AdSense `data-ad-client` and SEO
- `data/emojis.json` → extend this with the full dataset
- `components/ConsentBanner.tsx` → replace with a GDPR-compliant CMP before going live in the EU
