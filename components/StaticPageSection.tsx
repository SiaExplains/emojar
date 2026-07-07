import { PAGE_CONTENT } from '@/data/static-page-content';

const TOOL_SLUGS = new Set([
  'emoji-to-png',
  'emoji-favicon',
  'emoji-color-palette',
  'emoji-watermark',
  'emoji-card',
  'emoji-inspector',
  'emoji-kitchen',
  'personality',
]);

export function StaticPageSection({ slug }: { slug: string }) {
  const content = PAGE_CONTENT[slug];
  if (!content) return null;

  const isTool = TOOL_SLUGS.has(slug);

  return (
    <section className="mt-16 border-t border-gray-100 pt-10 pb-12 max-w-5xl mx-auto px-4">
      <h2 className="text-xl font-semibold text-gray-900 mb-3">
        {content.heading}
      </h2>
      <p className="text-gray-600 leading-7 mb-8">{content.description}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-base font-semibold text-gray-800 mb-3">
            {isTool ? 'How to Use' : 'How to Play'}
          </h3>
          <ol className="space-y-2">
            {content.howTo.map((step, i) => (
              <li key={i} className="flex gap-3 text-sm text-gray-600">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold flex items-center justify-center mt-0.5">
                  {i + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>

        <div>
          <h3 className="text-base font-semibold text-gray-800 mb-3">
            Tips &amp; Tricks
          </h3>
          <ul className="space-y-2">
            {content.tips.map((tip, i) => (
              <li key={i} className="flex gap-2 text-sm text-gray-600">
                <span className="text-emerald-500 flex-shrink-0 mt-0.5">✓</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {content.faqs.length > 0 && (
        <div className="mt-8">
          <h3 className="text-base font-semibold text-gray-800 mb-4">
            Frequently Asked Questions
          </h3>
          <div className="space-y-4">
            {content.faqs.map((faq, i) => (
              <div key={i}>
                <p className="text-sm font-medium text-gray-800">{faq.q}</p>
                <p className="text-sm text-gray-600 mt-1">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
