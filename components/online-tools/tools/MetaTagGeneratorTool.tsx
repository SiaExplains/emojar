'use client';

import { useMemo, useState } from 'react';
import {
  META_LIMITS,
  buildMetaTags,
  type MetaInput,
} from '@/lib/online-tools/engines/web-meta';
import type { ToolProps } from '../ToolRenderer';
import {
  Checkbox,
  SelectField,
  TextField,
  ToolOutput,
  inputBase,
  labelBase,
} from '../ui';

const INITIAL: MetaInput = {
  title: 'Free Online Tools That Run in Your Browser | Emojar',
  description:
    'Convert images and PDFs, format JSON, count words and more — free online tools that run entirely in your browser. No sign-up, nothing uploaded.',
  url: 'https://emojar.com/online-tool',
  image: 'https://emojar.com/og-image.png',
  imageAlt: 'Emojar online tools',
  siteName: 'Emojar',
  type: 'website',
  locale: 'en_US',
  twitterCard: 'summary_large_image',
  twitterSite: '',
  themeColor: '#4f46e5',
  robots: 'index, follow',
  canonical: true,
};

function Counter({
  value,
  ideal,
  max,
}: {
  value: string;
  ideal: number;
  max: number;
}) {
  const n = value.trim().length;
  const tone =
    n === 0
      ? 'text-gray-400'
      : n <= ideal
        ? 'text-emerald-700'
        : n <= max
          ? 'text-amber-700'
          : 'text-rose-700';
  return (
    <span className={`text-xs ${tone}`}>
      {n} / {ideal} characters
      {n > ideal ? (n > max ? ' — will be cut off' : ' — may be cut off') : ''}
    </span>
  );
}

const host = (url: string) => {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return 'example.com';
  }
};

/** Only http(s) images are previewed; anything else shows a placeholder. */
const safeImage = (url: string) =>
  /^https?:\/\//i.test(url.trim()) ? url.trim() : '';

export default function MetaTagGeneratorTool(_: ToolProps) {
  const [m, setM] = useState<MetaInput>(INITIAL);
  const set = <K extends keyof MetaInput>(k: K, v: MetaInput[K]) =>
    setM((x) => ({ ...x, [k]: v }));
  const html = useMemo(() => buildMetaTags(m), [m]);
  const img = safeImage(m.image);
  const domain = host(m.url);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1 sm:col-span-2">
          <TextField
            label="Page title"
            value={m.title}
            onChange={(v) => set('title', v)}
          />
          <Counter value={m.title} {...META_LIMITS.title} />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <label htmlFor="meta-desc" className={labelBase}>
            Description
          </label>
          <textarea
            id="meta-desc"
            rows={3}
            value={m.description}
            onChange={(e) => set('description', e.target.value)}
            className={inputBase}
          />
          <Counter value={m.description} {...META_LIMITS.description} />
        </div>
        <TextField
          label="Page URL"
          value={m.url}
          onChange={(v) => set('url', v)}
          placeholder="https://…"
        />
        <TextField
          label="Image URL (1200 × 630 recommended)"
          value={m.image}
          onChange={(v) => set('image', v)}
          placeholder="https://…/og.png"
        />
        <TextField
          label="Image description (alt)"
          value={m.imageAlt}
          onChange={(v) => set('imageAlt', v)}
        />
        <TextField
          label="Site name"
          value={m.siteName}
          onChange={(v) => set('siteName', v)}
        />
        <SelectField
          label="Content type (og:type)"
          value={m.type}
          onChange={(v) => set('type', v)}
          options={[
            'website',
            'article',
            'product',
            'profile',
            'video.other',
            'book',
          ].map((v) => ({ value: v, label: v }))}
        />
        <TextField
          label="Locale"
          value={m.locale}
          onChange={(v) => set('locale', v)}
          placeholder="en_US"
        />
        <SelectField
          label="X / Twitter card"
          value={m.twitterCard}
          onChange={(v) => set('twitterCard', v as MetaInput['twitterCard'])}
          options={[
            { value: 'summary_large_image', label: 'Large image' },
            { value: 'summary', label: 'Small square image' },
          ]}
        />
        <TextField
          label="X / Twitter @username (optional)"
          value={m.twitterSite}
          onChange={(v) => set('twitterSite', v)}
          placeholder="@yoursite"
        />
        <SelectField
          label="Search engines (robots)"
          value={m.robots}
          onChange={(v) => set('robots', v)}
          options={[
            { value: 'index, follow', label: 'Index and follow (default)' },
            { value: 'noindex, follow', label: 'Don’t index, follow links' },
            { value: 'noindex, nofollow', label: 'Don’t index or follow' },
            {
              value: 'index, follow, max-image-preview:large',
              label: 'Index, allow large image previews',
            },
          ]}
        />
        <TextField
          label="Theme colour (mobile browser bar)"
          value={m.themeColor}
          onChange={(v) => set('themeColor', v)}
          placeholder="#4f46e5"
        />
        <div className="sm:col-span-2">
          <Checkbox
            label="Add a canonical link for the page URL"
            checked={m.canonical}
            onChange={(v) => set('canonical', v)}
          />
        </div>
      </div>

      <ToolOutput
        label="HTML for your <head>"
        value={html}
        rows={14}
        filename="meta-tags.html"
        mime="text/html"
      />

      <div className="space-y-4">
        <h2 className="text-base font-semibold text-gray-900">Previews</h2>
        <div className="rounded-2xl border border-gray-100 p-4">
          <p className="text-xs text-gray-500">Google search result</p>
          <p className="mt-2 truncate text-xs text-gray-600">{domain} › …</p>
          <p className="line-clamp-1 text-lg text-[#1a0dab]">
            {m.title || 'Page title'}
          </p>
          <p className="line-clamp-2 text-sm text-gray-700">
            {m.description || 'Description'}
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="overflow-hidden rounded-2xl border border-gray-200">
            <p className="px-3 pt-2 text-xs text-gray-500">
              Facebook / LinkedIn
            </p>
            <div className="mt-2 aspect-[1.91/1] bg-gray-100">
              {img && (
                <img
                  src={img}
                  alt=""
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover"
                />
              )}
            </div>
            <div className="bg-gray-50 px-3 py-2">
              <p className="text-xs uppercase text-gray-500">{domain}</p>
              <p className="line-clamp-2 font-semibold text-gray-900">
                {m.title}
              </p>
              <p className="line-clamp-1 text-sm text-gray-600">
                {m.description}
              </p>
            </div>
          </div>
          <div className="overflow-hidden rounded-2xl border border-gray-200">
            <p className="px-3 pt-2 text-xs text-gray-500">X / Twitter</p>
            {m.twitterCard === 'summary_large_image' ? (
              <div className="relative mt-2 aspect-[2/1] bg-gray-100">
                {img && (
                  <img
                    src={img}
                    alt=""
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover"
                  />
                )}
                <span className="absolute bottom-2 left-2 rounded bg-black/60 px-1.5 py-0.5 text-xs text-white">
                  {domain}
                </span>
              </div>
            ) : (
              <div className="mt-2 flex gap-3 p-3">
                <div className="h-20 w-20 shrink-0 bg-gray-100">
                  {img && (
                    <img
                      src={img}
                      alt=""
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-gray-500">{domain}</p>
                  <p className="line-clamp-1 font-semibold text-gray-900">
                    {m.title}
                  </p>
                  <p className="line-clamp-2 text-sm text-gray-600">
                    {m.description}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
        <p className="text-xs text-gray-500">
          Previews are approximate — each platform changes its layout from time
          to time and caches cards, so re-scrape with its debugger after
          changing tags. The image preview loads from the URL you enter.
        </p>
      </div>
    </div>
  );
}
