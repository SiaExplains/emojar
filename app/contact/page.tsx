import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact | Emojar',
  description:
    'Get in touch with the Emojar team for general inquiries, press questions, or legal and GDPR requests.',
  alternates: { canonical: 'https://emojar.com/contact' },
  openGraph: {
    title: 'Contact Emojar',
    description:
      'Get in touch with Emojar for inquiries, press, or legal requests.',
    url: 'https://emojar.com/contact',
    siteName: 'Emojar',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Contact Emojar',
    description:
      'Get in touch with Emojar for inquiries, press, or legal requests.',
  },
  robots: { index: true, follow: true },
};

const EMAIL = 'emojar.info@gmail.com';

function ContactCard({
  title,
  description,
  subject,
}: {
  title: string;
  description: string;
  subject: string;
}) {
  const href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}`;
  return (
    <div className="border rounded-xl p-6 space-y-2">
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="text-gray-600 text-sm">{description}</p>
      <a
        href={href}
        className="inline-block mt-2 text-sm underline underline-offset-2"
      >
        {EMAIL}
      </a>
    </div>
  );
}

export default function ContactPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-5 py-10">
      <h1 className="text-3xl font-semibold tracking-tight">Contact</h1>
      <p className="mt-3 text-gray-600">
        We typically respond within <strong>2–5 business days</strong>. Please
        use the most relevant category below so your message reaches the right
        queue.
      </p>

      <div className="mt-8 space-y-4">
        <ContactCard
          title="General Inquiries"
          description="Feedback, suggestions, bugs, or anything else about the site."
          subject="General inquiry — Emojar"
        />
        <ContactCard
          title="Press"
          description="Media requests, interviews, or partnership proposals."
          subject="Press inquiry — Emojar"
        />
        <ContactCard
          title="Legal / DMCA / GDPR"
          description="Data subject requests (access, erasure, objection), DMCA notices, or other legal matters."
          subject="Legal request — Emojar"
        />
      </div>

      <p className="mt-8 text-sm text-gray-500">
        All emoji data on Emojar is derived from the Unicode CLDR standard and
        is not user-generated. For data controller details, see our{' '}
        <a href="/impressum" className="underline">
          Impressum
        </a>
        .
      </p>
    </main>
  );
}
