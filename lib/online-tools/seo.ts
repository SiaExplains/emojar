// Metadata and JSON-LD builders. Everything is derived from the registry so
// titles, canonicals and structured data never drift from the rendered page.

import type { Metadata } from 'next';
import {
  absolute,
  categoryPath,
  getCategory,
  toolPath,
  toolsInCategory,
  variantPath,
  TOOLS_UPDATED,
} from './registry';
import type {
  CategoryDefinition,
  FAQItem,
  ToolDefinition,
  ToolVariant,
} from './types';

const SITE_NAME = 'Emojar';

function ogImage(icon: string, name: string, desc: string) {
  const qs = new URLSearchParams({
    type: 'tool',
    emoji: icon,
    name,
    desc: desc.slice(0, 120),
  });
  return absolute(`/api/og?${qs.toString()}`);
}

function pageMetadata(opts: {
  title: string;
  description: string;
  path: string;
  icon: string;
  name: string;
  keywords?: string[];
}): Metadata {
  const url = absolute(opts.path);
  const image = ogImage(opts.icon, opts.name, opts.description);
  return {
    title: { absolute: `${opts.title} | ${SITE_NAME}` },
    description: opts.description,
    keywords: opts.keywords,
    alternates: { canonical: url },
    openGraph: {
      title: opts.title,
      description: opts.description,
      url,
      siteName: SITE_NAME,
      type: 'website',
      images: [{ url: image, width: 1200, height: 630, alt: opts.name }],
    },
    twitter: {
      card: 'summary_large_image',
      title: opts.title,
      description: opts.description,
      images: [image],
    },
    robots: { index: true, follow: true },
  };
}

export function hubMetadata(count: number): Metadata {
  // "110+" reads better in a title than an exact, ever-changing number.
  const rounded = Math.floor(count / 10) * 10;
  return pageMetadata({
    title: `Free Online Tools – ${rounded}+ Private Browser Utilities`,
    description: `${rounded}+ free online tools that run in your browser: image converter, PDF merger, JSON formatter, word counter, calculators, unit converters and more. No sign-up, no uploads.`,
    path: '/online-tool',
    icon: '🧰',
    name: 'Online Tools',
    keywords: [
      'online tools',
      'free online tools',
      'browser tools',
      'privacy-friendly tools',
      'web utilities',
    ],
  });
}

export function categoryMetadata(c: CategoryDefinition): Metadata {
  return pageMetadata({
    title: c.title,
    description: c.metaDescription,
    path: categoryPath(c.slug),
    icon: c.icon,
    name: c.name,
  });
}

export function toolMetadata(t: ToolDefinition): Metadata {
  return pageMetadata({
    title: t.title,
    description: t.metaDescription,
    path: toolPath(t),
    icon: t.icon,
    name: t.name,
    keywords: t.keywords,
  });
}

export function variantMetadata(t: ToolDefinition, v: ToolVariant): Metadata {
  return pageMetadata({
    title: v.title,
    description: v.metaDescription,
    path: variantPath(t, v),
    icon: t.icon,
    name: v.name,
    keywords: v.keywords,
  });
}

/** Privacy FAQ appended to every tool, worded for whether it reads files. */
export function privacyFaq(
  t: Pick<ToolDefinition, 'name' | 'handlesFiles'>,
): FAQItem {
  return t.handlesFiles
    ? {
        q: `Is the ${t.name} free and private?`,
        a: `Yes. The ${t.name} is free, needs no account, and processes your files entirely in your browser. Files are never uploaded to a server or stored.`,
      }
    : {
        q: `Is the ${t.name} free and private?`,
        a: `Yes. The ${t.name} is free, needs no account, and runs entirely in your browser. What you type is never sent to a server or stored.`,
      };
}

const APP_CATEGORY: Record<string, string> = {
  'image-tools': 'MultimediaApplication',
  'pdf-tools': 'BusinessApplication',
  'developer-tools': 'DeveloperApplication',
  'text-tools': 'UtilitiesApplication',
  'color-tools': 'DesignApplication',
  calculators: 'UtilitiesApplication',
  'unit-converters': 'UtilitiesApplication',
  'security-generators': 'SecurityApplication',
  'date-time-tools': 'UtilitiesApplication',
};

export function webApplicationJsonLd(t: ToolDefinition, v?: ToolVariant) {
  const path = v ? variantPath(t, v) : toolPath(t);
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: v?.name ?? t.name,
    url: absolute(path),
    description: v?.description ?? t.description,
    applicationCategory: APP_CATEGORY[t.category] ?? 'UtilitiesApplication',
    operatingSystem: 'Any',
    browserRequirements: 'Requires JavaScript. Runs entirely in the browser.',
    isAccessibleForFree: true,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    dateModified: TOOLS_UPDATED,
    publisher: { '@type': 'Organization', name: SITE_NAME, url: absolute('/') },
  };
}

export function faqJsonLd(faqs: FAQItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

export function howToJsonLd(name: string, steps: string[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: `How to use the ${name}`,
    step: steps.map((s, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      text: s,
    })),
  };
}

export function itemListJsonLd(
  name: string,
  path: string,
  items: { name: string; path: string }[],
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name,
    url: absolute(path),
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: items.length,
      itemListElement: items.map((it, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: it.name,
        url: absolute(it.path),
      })),
    },
  };
}

export function categoryItemList(c: CategoryDefinition) {
  return itemListJsonLd(
    c.name,
    categoryPath(c.slug),
    toolsInCategory(c.slug).map((t) => ({ name: t.name, path: toolPath(t) })),
  );
}

export function categoryName(slug: string): string {
  return getCategory(slug)?.name ?? slug;
}
