import type { Metadata } from 'next';
import Breadcrumb from '@/components/Breadcrumb';
import { FAQ, JsonLd } from '@/components/online-tools/ToolPage';
import { ToolDirectory } from '@/components/online-tools/ToolDirectory';
import { ToolSearch } from '@/components/online-tools/ToolSearch';
import {
  CATEGORIES,
  TOOLS,
  categoryPath,
  searchIndex,
} from '@/lib/online-tools/registry';
import { faqJsonLd, hubMetadata, itemListJsonLd } from '@/lib/online-tools/seo';

export const metadata: Metadata = hubMetadata(TOOLS.length);

const HUB_FAQS = [
  {
    q: 'Are these online tools really free?',
    a: 'Yes. Every tool is free to use with no account, no sign-up and no usage limits.',
  },
  {
    q: 'Are my files uploaded to a server?',
    a: 'No. The tools run in your web browser using built-in browser features such as the File API, Canvas, Web Workers and the Web Crypto API, so your files and text stay on your device. The few optional features that contact another service — for example downloading the OCR engine — say so on the tool page.',
  },
  {
    q: 'Do the tools work on my phone?',
    a: 'Yes. Every tool works in modern mobile browsers on iPhone and Android, as well as on tablets and desktop computers.',
  },
  {
    q: 'Do the tools work offline?',
    a: 'Most tools keep working without a connection once the page has loaded, because nothing is sent to a server. A few need a one-time download first — for example the OCR engine in Image to Text and PDF to Text.',
  },
];

export default function OnlineToolsHub() {
  return (
    <>
      <JsonLd
        data={itemListJsonLd(
          'Online Tools',
          '/online-tool',
          CATEGORIES.map((c) => ({ name: c.name, path: categoryPath(c.slug) })),
        )}
      />
      <JsonLd data={faqJsonLd(HUB_FAQS)} />
      <div className="space-y-12">
        <div>
          <Breadcrumb crumbs={[{ label: 'Online Tools' }]} />
          <header className="mx-auto max-w-4xl space-y-4 text-center">
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
              Online Tools
            </h1>
            <p className="text-base leading-relaxed text-gray-600 sm:text-lg">
              {TOOLS.length} free, fast and privacy-friendly tools that run
              directly in your browser — image and PDF converters, developer
              utilities, text tools, calculators and more. No sign-up, and your
              files never leave your device.
            </p>
            <ToolSearch entries={searchIndex()} syncUrl />
          </header>
        </div>

        <ToolDirectory fullIntro />

        <FAQ faqs={HUB_FAQS} heading="About these tools" />
      </div>
    </>
  );
}
