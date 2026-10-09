import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy | Emojar',
  description:
    'How Emojar.com collects, uses, and protects your data. Includes GDPR legal bases, data recipients, your rights, and contact for the Berlin DPA.',
  alternates: { canonical: 'https://emojar.com/privacy' },
  openGraph: {
    title: 'Privacy Policy | Emojar',
    description: 'GDPR-compliant privacy policy for Emojar.com.',
    url: 'https://emojar.com/privacy',
    siteName: 'Emojar',
    type: 'article',
  },
  twitter: {
    card: 'summary',
    title: 'Privacy Policy | Emojar',
    description: 'GDPR-compliant privacy policy for Emojar.com.',
  },
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-10">
      <h1 className="text-3xl font-semibold tracking-tight">Privacy Policy</h1>
      <p className="mt-2 text-sm text-gray-500">
        Last updated: <time dateTime="2026-10-09">9 October 2026</time>
      </p>

      <section className="mt-8 space-y-8 text-gray-800 leading-7">
        <p>
          Welcome to <strong>Emojar.com</strong> (&quot;we,&quot;
          &quot;our,&quot; or &quot;us&quot;). This policy explains what
          personal data we collect, why, and the rights you have under the EU
          General Data Protection Regulation (GDPR) and other applicable law.
        </p>

        {/* 1. Data Controller */}
        <div>
          <h2 className="text-xl font-semibold">1. Data Controller</h2>
          <p className="mt-2">
            The data controller responsible for this website is:
          </p>
          <address className="mt-2 not-italic text-gray-700 border-l-2 pl-4 border-gray-200">
            Siavash Ghanbari Hamzehkolaei
            <br />
            Schützenstraße 41
            <br />
            10117 Berlin, Germany
            <br />
            E-Mail:{' '}
            <a href="mailto:emojar.info@gmail.com" className="underline">
              emojar.info@gmail.com
            </a>
          </address>
          <p className="mt-2 text-sm text-gray-500">
            (See also our{' '}
            <Link href="/impressum" className="underline">
              Impressum
            </Link>{' '}
            for the full legal notice.)
          </p>
        </div>

        {/* 2. What we collect */}
        <div>
          <h2 className="text-xl font-semibold">2. What We Collect</h2>
          <p className="mt-2">
            Emojar is an online-tools and emoji website. You do not create an
            account or submit personal data directly. Files and text you use
            with our online tools are processed in your browser — they are not
            uploaded to, stored on, or logged by our servers. A few optional
            features contact a third party; they are listed in section 4 and
            labelled on the tool page. We may receive:
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>
              <strong>Server logs:</strong> IP address, browser user-agent,
              pages visited, referrer URL, and timestamps — generated
              automatically by our hosting infrastructure.
            </li>
            <li>
              <strong>Analytics data:</strong> aggregated page views (page URL,
              referrer, country, device and browser type) via Vercel Web
              Analytics. It sets no cookies and does not identify you across
              sites or days.
            </li>
            <li>
              <strong>Advertising data:</strong> Google AdSense serves ads on
              this site. Visitors in the EEA, the UK and Switzerland see
              Google&apos;s consent message first; Google sets advertising
              cookies for personalised ads only if you agree there.
            </li>
          </ul>
        </div>

        {/* 3. Legal basis (Art. 6 GDPR) */}
        <div>
          <h2 className="text-xl font-semibold">
            3. Legal Basis (Art. 6 GDPR)
          </h2>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>
              <strong>Consent (Art. 6(1)(a)):</strong> personalised advertising
              and the cookies Google sets for it — only after you agree in
              Google&apos;s consent message.
            </li>
            <li>
              <strong>Legitimate interest (Art. 6(1)(f)):</strong> server
              security logs, fraud prevention, basic site functionality, and
              cookieless, aggregated usage statistics (Vercel Web Analytics).
            </li>
          </ul>
        </div>

        {/* 4. Recipients */}
        <div>
          <h2 className="text-xl font-semibold">4. Recipients of Data</h2>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>
              <strong>Google LLC</strong> — Google AdSense (ad serving) and
              Google&apos;s consent management (Privacy &amp; messaging).
              Privacy policy:{' '}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                policies.google.com/privacy
              </a>
              .
            </li>
            <li>
              <strong>Vercel Inc.</strong> — hosting, CDN and server logs for
              site delivery, and Vercel Web Analytics (cookieless page-view
              statistics).
            </li>
          </ul>
          <p className="mt-4">Only when you use these optional features:</p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>
              <strong>jsDelivr (CDN)</strong> — Image to Text and the OCR option
              in PDF to Text download the open-source Tesseract engine and
              language data. Your image or PDF stays on your device.
            </li>
            <li>
              <strong>Have I Been Pwned</strong> — the opt-in breach check in
              the Password Strength Checker sends only the first five characters
              of your password&apos;s SHA-1 hash, never the password.
            </li>
            <li>
              <strong>Google (gstatic.com)</strong> — Emoji Kitchen loads the
              combined emoji images from Google; the request contains the two
              emoji you picked.
            </li>
            <li>
              <strong>Your browser&apos;s speech service</strong> — in Text to
              Speech, voices marked &quot;online&quot; send the text to your
              browser vendor (for example Google, Apple or Microsoft); local
              voices do not.
            </li>
          </ul>
        </div>

        {/* 5. International Transfers */}
        <div>
          <h2 className="text-xl font-semibold">5. International Transfers</h2>
          <p className="mt-2">
            Google LLC is certified under the EU–US Data Privacy Framework (DPF)
            and uses Standard Contractual Clauses (SCCs) for transfers of
            personal data to the United States. More details:{' '}
            <a
              href="https://business.safety.google/gdpr/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              business.safety.google/gdpr
            </a>
            .
          </p>
        </div>

        {/* 6. Retention */}
        <div>
          <h2 className="text-xl font-semibold">6. Retention Periods</h2>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>
              <strong>Server logs:</strong> retained for up to 7 days for
              security and operational purposes.
            </li>
            <li>
              <strong>Analytics data:</strong> stored only in aggregate in
              Vercel Web Analytics; no profile of you is kept.
            </li>
            <li>
              <strong>Advertising cookies:</strong> lifespan as set by Google
              (typically up to 13 months); see Google&apos;s cookie policy.
            </li>
          </ul>
        </div>

        {/* 6a. Storage on your device */}
        <div>
          <h2 className="text-xl font-semibold">
            6a. Data Stored in Your Browser
          </h2>
          <p className="mt-2">
            Some tools and games save your work or settings in your
            browser&apos;s local storage — for example Kanban boards, timelines,
            pixel art, alarms, world clocks, invoices, how often you copied each
            emoji, and game high scores. This data never leaves your device, we
            cannot see it, and it is needed for the feature you use (§ 25(2)
            TDDDG). You can delete it with the tool&apos;s &quot;Clear&quot;
            button or by clearing this site&apos;s data in your browser.
          </p>
        </div>

        {/* 7. Your Rights */}
        <div>
          <h2 className="text-xl font-semibold">7. Your Rights</h2>
          <p className="mt-2">Under GDPR you have the right to:</p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>
              <strong>Access</strong> the personal data we hold about you (Art.
              15).
            </li>
            <li>
              <strong>Rectification</strong> of inaccurate data (Art. 16).
            </li>
            <li>
              <strong>Erasure</strong> (&quot;right to be forgotten&quot;) (Art.
              17).
            </li>
            <li>
              <strong>Restriction</strong> of processing (Art. 18).
            </li>
            <li>
              <strong>Data portability</strong> in a machine-readable format
              (Art. 20).
            </li>
            <li>
              <strong>Object</strong> to processing based on legitimate interest
              (Art. 21).
            </li>
            <li>
              <strong>Withdraw consent</strong> at any time without affecting
              the lawfulness of prior processing: use the privacy and cookie
              settings button from Google&apos;s consent message, or clear this
              site&apos;s cookies in your browser and reload the page to be
              asked again.
            </li>
          </ul>
          <p className="mt-3">
            To exercise any of these rights, email{' '}
            <a href="mailto:emojar.info@gmail.com" className="underline">
              emojar.info@gmail.com
            </a>{' '}
            with &quot;GDPR Request&quot; in the subject. We will respond within
            30 days.
          </p>
        </div>

        {/* 8. Right to Lodge a Complaint */}
        <div>
          <h2 className="text-xl font-semibold">
            8. Right to Lodge a Complaint
          </h2>
          <p className="mt-2">
            If you believe we have violated your rights, you may lodge a
            complaint with the supervisory authority in your EU member state. As
            this site is operated from Berlin, the lead authority is:
          </p>
          <address className="mt-2 not-italic text-gray-700 border-l-2 pl-4 border-gray-200">
            Berliner Beauftragte für Datenschutz und Informationsfreiheit
            <br />
            Friedrichstr. 219, 10969 Berlin
            <br />
            <a
              href="https://www.datenschutz-berlin.de"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              www.datenschutz-berlin.de
            </a>
          </address>
        </div>

        {/* 9. Children */}
        <div>
          <h2 className="text-xl font-semibold">9. Children&apos;s Privacy</h2>
          <p className="mt-2">
            Emojar is not directed at children under 13. We do not knowingly
            collect personal data from children. If you believe a child has
            provided data, contact us for immediate removal.
          </p>
        </div>

        {/* 10. Changes */}
        <div>
          <h2 className="text-xl font-semibold">10. Changes to This Policy</h2>
          <p className="mt-2">
            We may update this page and will revise the &quot;Last updated&quot;
            date accordingly. Continued use of the site after changes are posted
            constitutes acceptance of the revised policy.
          </p>
        </div>

        {/* 11. Contact */}
        <div>
          <h2 className="text-xl font-semibold">11. Contact</h2>
          <p className="mt-2">
            For any privacy-related questions:{' '}
            <a href="mailto:emojar.info@gmail.com" className="underline">
              emojar.info@gmail.com
            </a>{' '}
            or visit our{' '}
            <Link href="/contact" className="underline">
              Contact page
            </Link>
            .
          </p>
        </div>

        <hr className="border-gray-200" />
        <p className="text-sm text-gray-500">
          Related:{' '}
          <Link href="/terms" className="underline">
            Terms of Service
          </Link>{' '}
          ·{' '}
          <Link href="/impressum" className="underline">
            Impressum
          </Link>
        </p>
      </section>
    </div>
  );
}
