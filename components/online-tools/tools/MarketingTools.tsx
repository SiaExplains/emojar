'use client';

// UTM Link Builder, FAQ Schema Generator, Article Schema Generator and
// Social Share Card Preview. Nothing here requests the URLs users type.

import { useEffect, useMemo, useState } from 'react';
import type { ToolProps } from '../ToolRenderer';
import {
  CopyButton,
  ErrorMessage,
  FileDropzone,
  Notice,
  SelectField,
  TextField,
  ToolOutput,
  btnPrimary,
  btnSecondary,
  downloadBlob,
  inputBase,
  labelBase,
  useObjectUrl,
} from '../ui';
import {
  UTM_KEYS,
  articleSchema,
  buildUtmUrl,
  faqSchema,
  scriptTag,
  type ArticleInput,
  type FaqPair,
  type UtmFields,
  type UtmKey,
} from '@/lib/online-tools/engines/seo-schema';

/* ------------------------------------------------------------------ */
/* UTM Link Builder                                                     */
/* ------------------------------------------------------------------ */

const UTM_FIELDS: {
  key: UtmKey;
  label: string;
  placeholder: string;
  help: string;
}[] = [
  {
    key: 'utm_source',
    label: 'Campaign source *',
    placeholder: 'newsletter, google, facebook',
    help: 'Where the traffic comes from.',
  },
  {
    key: 'utm_medium',
    label: 'Campaign medium *',
    placeholder: 'email, cpc, social',
    help: 'The marketing channel.',
  },
  {
    key: 'utm_campaign',
    label: 'Campaign name *',
    placeholder: 'spring_sale',
    help: 'The promotion or campaign.',
  },
  {
    key: 'utm_term',
    label: 'Campaign term',
    placeholder: 'running+shoes',
    help: 'Optional: paid search keyword.',
  },
  {
    key: 'utm_content',
    label: 'Campaign content',
    placeholder: 'header_link',
    help: 'Optional: tells links in the same ad or email apart.',
  },
];

const emptyUtm = (): UtmFields =>
  Object.fromEntries(UTM_KEYS.map((k) => [k, ''])) as UtmFields;

export function UtmBuilderTool(_: ToolProps) {
  const [url, setUrl] = useState('');
  const [f, setF] = useState<UtmFields>(emptyUtm);
  const touched = url.trim() || Object.values(f).some((v) => v.trim());
  const result = useMemo(() => buildUtmUrl(url, f), [url, f]);

  return (
    <div className="space-y-5">
      <TextField
        label="Website URL *"
        value={url}
        onChange={setUrl}
        placeholder="https://example.com/landing-page"
      />
      <div className="grid gap-4 sm:grid-cols-2">
        {UTM_FIELDS.map((x) => (
          <div key={x.key} className="space-y-1">
            <TextField
              label={`${x.label} (${x.key})`}
              value={f[x.key]}
              onChange={(v) => setF((p) => ({ ...p, [x.key]: v }))}
              placeholder={x.placeholder}
            />
            <p className="text-xs text-gray-500">{x.help}</p>
          </div>
        ))}
      </div>
      {touched && !result.ok && <ErrorMessage>{result.error}</ErrorMessage>}
      {result.ok && (
        <div className="space-y-3">
          <div className="space-y-1.5">
            <p className={labelBase}>Your campaign URL</p>
            <p className="break-all rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 font-mono text-[13px] text-gray-900">
              {result.url}
            </p>
            <div className="flex flex-wrap gap-2">
              <CopyButton text={result.url} label="Copy URL" />
              <button
                type="button"
                className={btnSecondary}
                onClick={() => {
                  setUrl('');
                  setF(emptyUtm());
                }}
              >
                Reset
              </button>
            </div>
          </div>
          {result.replaced.length > 0 && (
            <Notice tone="amber">
              The URL already had {result.replaced.join(', ')}; the old value
              was replaced by yours.
            </Notice>
          )}
          {result.warnings.map((w) => (
            <Notice key={w} tone="amber">
              {w}
            </Notice>
          ))}
        </div>
      )}
      <p className="text-xs text-gray-500">
        Existing query parameters and the #fragment are kept. The link is built
        in your browser and the page is never visited.
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* FAQ Schema Generator                                                 */
/* ------------------------------------------------------------------ */

let pairId = 0;
type Row = FaqPair & { id: number };
const newRow = (q = '', a = ''): Row => ({
  id: ++pairId,
  question: q,
  answer: a,
});

export function FaqSchemaTool(_: ToolProps) {
  const [rows, setRows] = useState<Row[]>(() => [
    newRow(
      'How long does shipping take?',
      'Orders ship within 2 business days and arrive in 3–5 days.',
    ),
    newRow(
      'Can I return an item?',
      'Yes, within 30 days of delivery if it is unused.',
    ),
  ]);
  const [wrap, setWrap] = useState(true);
  const r = useMemo(() => faqSchema(rows), [rows]);
  const out = r.ok ? (wrap ? scriptTag(r.json) : r.json) : '';
  const set = (id: number, k: 'question' | 'answer', v: string) =>
    setRows((rs) => rs.map((x) => (x.id === id ? { ...x, [k]: v } : x)));

  return (
    <div className="space-y-5">
      <ol className="space-y-3">
        {rows.map((x, i) => (
          <li
            key={x.id}
            className="space-y-2 rounded-xl border border-gray-200 bg-gray-50 p-3"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-gray-500">
                Question {i + 1}
              </span>
              <button
                type="button"
                className="rounded-lg px-2 py-1 text-xs text-gray-500 hover:bg-red-50 hover:text-red-700"
                onClick={() => setRows((rs) => rs.filter((y) => y.id !== x.id))}
                aria-label={`Remove question ${i + 1}`}
              >
                ✕ Remove
              </button>
            </div>
            <input
              value={x.question}
              onChange={(e) => set(x.id, 'question', e.target.value)}
              placeholder="Question"
              aria-label={`Question ${i + 1}`}
              className={inputBase}
            />
            <textarea
              value={x.answer}
              onChange={(e) => set(x.id, 'answer', e.target.value)}
              rows={2}
              placeholder="Answer (plain text, as shown on the page)"
              aria-label={`Answer ${i + 1}`}
              className={inputBase}
            />
          </li>
        ))}
      </ol>
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          className={btnSecondary}
          onClick={() => setRows((rs) => [...rs, newRow()])}
        >
          ＋ Add question
        </button>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={wrap}
            onChange={(e) => setWrap(e.target.checked)}
          />
          Wrap in a &lt;script&gt; tag
        </label>
      </div>
      {!r.ok && <ErrorMessage>{r.error}</ErrorMessage>}
      {r.ok &&
        r.warnings.map((w) => (
          <Notice key={w} tone="amber">
            {w}
          </Notice>
        ))}
      <ToolOutput
        label="FAQPage JSON-LD"
        value={out}
        filename={wrap ? 'faq-schema.html' : 'faq-schema.json'}
        mime={wrap ? 'text/html' : 'application/ld+json'}
        rows={12}
      />
      <Notice>
        The questions and answers must also be visible on the page. Valid markup
        doesn’t guarantee a rich result: since 2023 Google shows FAQ rich
        results only for a small set of authoritative government and health
        sites.
      </Notice>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Article Schema Generator                                             */
/* ------------------------------------------------------------------ */

const today = () => new Date().toISOString().slice(0, 10);

export function ArticleSchemaTool(_: ToolProps) {
  const [a, setA] = useState<ArticleInput>(() => ({
    type: 'BlogPosting',
    headline: '',
    description: '',
    url: '',
    images: '',
    authorName: '',
    authorType: 'Person',
    authorUrl: '',
    publisherName: '',
    publisherLogo: '',
    datePublished: today(),
    dateModified: '',
  }));
  const [wrap, setWrap] = useState(true);
  const set =
    <K extends keyof ArticleInput>(k: K) =>
    (v: string) =>
      setA((p) => ({ ...p, [k]: v }));
  const r = useMemo(() => articleSchema(a), [a]);
  const out = r.ok ? (wrap ? scriptTag(r.json) : r.json) : '';

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <SelectField
          label="Type"
          value={a.type}
          onChange={set('type')}
          options={[
            { value: 'BlogPosting', label: 'BlogPosting (blog post)' },
            { value: 'Article', label: 'Article' },
            { value: 'NewsArticle', label: 'NewsArticle (news)' },
          ]}
        />
        <TextField
          label="Headline *"
          value={a.headline}
          onChange={set('headline')}
          placeholder="The visible title of the article"
        />
        <TextField
          label="Page URL"
          value={a.url}
          onChange={set('url')}
          placeholder="https://example.com/blog/post"
        />
        <TextField
          label="Description"
          value={a.description}
          onChange={set('description')}
          placeholder="One-sentence summary"
        />
        <div className="space-y-1.5 sm:col-span-2">
          <label htmlFor="as-images" className={labelBase}>
            Image URLs (one per line)
          </label>
          <textarea
            id="as-images"
            rows={2}
            value={a.images}
            onChange={(e) => set('images')(e.target.value)}
            placeholder="https://example.com/images/cover-16x9.jpg"
            className={`${inputBase} font-mono text-[13px]`}
          />
        </div>
        <TextField
          label="Author name"
          value={a.authorName}
          onChange={set('authorName')}
        />
        <SelectField
          label="Author is a"
          value={a.authorType}
          onChange={set('authorType')}
          options={[
            { value: 'Person', label: 'Person' },
            { value: 'Organization', label: 'Organization' },
          ]}
        />
        <TextField
          label="Author URL (profile page)"
          value={a.authorUrl}
          onChange={set('authorUrl')}
        />
        <TextField
          label="Publisher name"
          value={a.publisherName}
          onChange={set('publisherName')}
        />
        <TextField
          label="Publisher logo URL"
          value={a.publisherLogo}
          onChange={set('publisherLogo')}
        />
        <TextField
          label="Date published (ISO 8601)"
          value={a.datePublished}
          onChange={set('datePublished')}
          placeholder="2026-10-14"
        />
        <TextField
          label="Date modified (ISO 8601)"
          value={a.dateModified}
          onChange={set('dateModified')}
          placeholder="2026-10-15T09:30:00+02:00"
        />
      </div>
      <label className="flex items-center gap-2 text-sm text-gray-700">
        <input
          type="checkbox"
          checked={wrap}
          onChange={(e) => setWrap(e.target.checked)}
        />
        Wrap in a &lt;script&gt; tag
      </label>
      {!r.ok && <ErrorMessage>{r.error}</ErrorMessage>}
      {r.ok &&
        r.warnings.map((w) => (
          <Notice key={w} tone="amber">
            {w}
          </Notice>
        ))}
      <ToolOutput
        label={`${a.type} JSON-LD`}
        value={out}
        filename={wrap ? 'article-schema.html' : 'article-schema.json'}
        mime={wrap ? 'text/html' : 'application/ld+json'}
        rows={14}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Social Share Card Preview                                            */
/* ------------------------------------------------------------------ */

type Layout = 'large' | 'square';
const MAX_IMAGE = 15 * 1024 * 1024;

const hostOf = (u: string) => {
  try {
    return new URL(/^[a-z]+:/i.test(u) ? u : `https://${u}`).hostname.replace(
      /^www\./,
      '',
    );
  } catch {
    return '';
  }
};

const clip = (s: string, n: number) =>
  s.length > n ? `${s.slice(0, n - 1).trimEnd()}…` : s;

export function SocialPreviewTool(_: ToolProps) {
  const [title, setTitle] = useState(
    'Free online tools that run in your browser',
  );
  const [desc, setDesc] = useState(
    'Convert images and PDFs, format JSON and more — private, fast and free.',
  );
  const [url, setUrl] = useState('https://example.com/blog/post');
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  // A typed URL is only requested after the user asks for it.
  const [shownUrl, setShownUrl] = useState('');
  const [layout, setLayout] = useState<Layout>('large');
  const [imgError, setImgError] = useState('');
  const [natural, setNatural] = useState<{ w: number; h: number } | null>(null);
  const local = useObjectUrl(file);
  const src = local ?? (shownUrl || null);
  const host = hostOf(url) || 'example.com';
  const ratio = layout === 'large' ? 1.91 : 1;

  useEffect(() => {
    setNatural(null);
    setImgError('');
  }, [src]);

  const exportPng = async () => {
    const W = layout === 'large' ? 1200 : 1080;
    const imgH = layout === 'large' ? 628 : 1080;
    const H = imgH + 190;
    const c = document.createElement('canvas');
    c.width = W;
    c.height = H;
    const ctx = c.getContext('2d')!;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = '#e5e7eb';
    ctx.fillRect(0, 0, W, imgH);
    if (local) {
      // Only the local file is drawn: a remote image would taint the canvas.
      const img = new Image();
      img.src = local;
      await img.decode().catch(() => undefined);
      if (img.naturalWidth) {
        const s = Math.max(W / img.naturalWidth, imgH / img.naturalHeight);
        const dw = img.naturalWidth * s;
        const dh = img.naturalHeight * s;
        ctx.drawImage(img, (W - dw) / 2, (imgH - dh) / 2, dw, dh);
      }
    }
    ctx.fillStyle = '#f3f4f6';
    ctx.fillRect(0, imgH, W, H - imgH);
    ctx.fillStyle = '#6b7280';
    ctx.font = '28px system-ui, sans-serif';
    ctx.fillText(host.toUpperCase(), 32, imgH + 48);
    ctx.fillStyle = '#111827';
    ctx.font = 'bold 40px system-ui, sans-serif';
    ctx.fillText(clip(title, 60), 32, imgH + 102, W - 64);
    ctx.fillStyle = '#4b5563';
    ctx.font = '30px system-ui, sans-serif';
    ctx.fillText(clip(desc, 80), 32, imgH + 150, W - 64);
    c.toBlob(
      (b) => b && downloadBlob(b, 'social-card-preview.png'),
      'image/png',
    );
  };

  const fit = natural ? Math.abs(natural.w / natural.h - ratio) < 0.05 : null;

  return (
    <div className="space-y-5">
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-4">
          <TextField
            label={`Title (${title.length}/60)`}
            value={title}
            onChange={setTitle}
          />
          <div className="space-y-1.5">
            <label htmlFor="sp-desc" className={labelBase}>
              Description ({desc.length}/160)
            </label>
            <textarea
              id="sp-desc"
              rows={3}
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              className={inputBase}
            />
          </div>
          <TextField
            label="Page URL (only the domain is shown)"
            value={url}
            onChange={setUrl}
          />
          <SelectField
            label="Image layout"
            value={layout}
            onChange={(v) => setLayout(v as Layout)}
            options={[
              { value: 'large', label: 'Large image — 1.91:1 (1200 × 630 px)' },
              { value: 'square', label: 'Square — 1:1 (1080 × 1080 px)' },
            ]}
          />
          {file ? (
            <div className="flex flex-wrap items-center gap-2 text-sm text-gray-700">
              <span className="truncate">🖼 {file.name}</span>
              <button
                type="button"
                className={btnSecondary}
                onClick={() => setFile(null)}
              >
                Remove image
              </button>
            </div>
          ) : (
            <>
              <FileDropzone
                accept="image/*"
                onFiles={(f) => {
                  if (f[0].size > MAX_IMAGE)
                    setImgError('That image is larger than 15 MB.');
                  else setFile(f[0]);
                }}
                hint="Choose the share image from your device (stays local)"
              />
              <div className="flex flex-wrap items-end gap-2">
                <div className="min-w-[220px] flex-1">
                  <TextField
                    label="…or an image URL"
                    value={imageUrl}
                    onChange={setImageUrl}
                    placeholder="https://example.com/og-image.jpg"
                  />
                </div>
                <button
                  type="button"
                  className={btnSecondary}
                  disabled={!/^https?:\/\//i.test(imageUrl.trim())}
                  onClick={() => setShownUrl(imageUrl.trim())}
                >
                  Load image
                </button>
              </div>
              <p className="text-xs text-gray-500">
                Loading a URL asks that site for the image, like opening it in a
                tab. A file from your device never leaves it.
              </p>
            </>
          )}
          <ErrorMessage>{imgError}</ErrorMessage>
        </div>

        <div className="space-y-3">
          <p className={labelBase}>Preview</p>
          <div className="mx-auto w-full max-w-[520px] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <div
              className="relative w-full bg-gray-200"
              style={{ aspectRatio: String(ratio) }}
            >
              {src ? (
                <img
                  src={src}
                  alt=""
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 h-full w-full object-cover"
                  onLoad={(e) =>
                    setNatural({
                      w: e.currentTarget.naturalWidth,
                      h: e.currentTarget.naturalHeight,
                    })
                  }
                  onError={() =>
                    setImgError(
                      'The image couldn’t be loaded. Check the URL or choose a file.',
                    )
                  }
                />
              ) : (
                <span className="absolute inset-0 flex items-center justify-center text-sm text-gray-500">
                  No image
                </span>
              )}
            </div>
            <div className="space-y-0.5 border-t border-gray-200 bg-gray-50 px-3 py-2.5">
              <p className="text-xs uppercase tracking-wide text-gray-500">
                {host}
              </p>
              <p className="line-clamp-2 font-semibold text-gray-900">
                {title || 'Page title'}
              </p>
              <p className="line-clamp-2 text-sm text-gray-600">{desc}</p>
            </div>
          </div>
          {natural && (
            <p
              className={`text-xs ${fit ? 'text-emerald-700' : 'text-amber-800'}`}
            >
              Image is {natural.w} × {natural.h} px (
              {(natural.w / natural.h).toFixed(2)}:1).{' '}
              {fit
                ? 'It matches this layout.'
                : 'It will be cropped to fill this layout — use 1200 × 630 px for large cards.'}
              {natural.w < 600 &&
                ' It is narrower than 600 px, so some platforms show a small thumbnail instead.'}
            </p>
          )}
          <div className="flex flex-wrap gap-2">
            <button type="button" className={btnPrimary} onClick={exportPng}>
              ⬇ Download mockup PNG
            </button>
          </div>
          {!local && shownUrl && (
            <p className="text-xs text-gray-500">
              The PNG mockup includes the image only when you choose a file —
              browsers don’t allow drawing images from other sites.
            </p>
          )}
        </div>
      </div>
      <Notice>
        This is a simulation built from what you type — it doesn’t read your
        page’s real meta tags. Facebook, LinkedIn, X, Slack and WhatsApp each
        crop and truncate differently. To create the tags, use the Meta Tag
        Generator.
      </Notice>
    </div>
  );
}
