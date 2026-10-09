import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Impressum | Emojar',
  description:
    'Impressum / Legal Notice for Emojar.com pursuant to § 5 TMG and § 18 MStV.',
  alternates: { canonical: 'https://emojar.com/impressum' },
  robots: { index: true, follow: true },
};

export default function ImpressumPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-10">
      <h1 className="text-3xl font-semibold tracking-tight">Impressum</h1>
      <p className="mt-1 text-sm text-gray-500">
        Legal Notice pursuant to § 5 TMG and § 18 Abs. 2 MStV
      </p>

      <section className="mt-8 space-y-6 text-gray-800 leading-7">
        {/* --- Angaben gemäß § 5 TMG --- */}
        <div>
          <h2 className="text-lg font-semibold">Angaben gemäß § 5 TMG</h2>
          <p className="text-sm text-gray-500 mb-2">
            (Information required by § 5 TMG)
          </p>
          <p className="font-medium">Siavash Ghanbari Hamzehkolaei</p>
          <p>Schützenstraße 41</p>
          <p>10117 Berlin</p>
          <p>Deutschland / Germany</p>
        </div>

        {/* --- Kontakt --- */}
        <div>
          <h2 className="text-lg font-semibold">Kontakt / Contact</h2>
          <p>
            E-Mail:{' '}
            <a href="mailto:emojar.info@gmail.com" className="underline">
              emojar.info@gmail.com
            </a>
          </p>
          <p>Telefon: +49 157 34589750</p>
        </div>

        {/* --- Verantwortlich für den Inhalt --- */}
        <div>
          <h2 className="text-lg font-semibold">
            Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV
          </h2>
          <p className="text-sm text-gray-500 mb-1">
            (Person responsible for editorial content)
          </p>
          <p>Siavash Ghanbari Hamzehkolaei</p>
          <p>Schützenstraße 41, 10117 Berlin</p>
        </div>

        {/* --- DSA --- */}
        <div>
          <h2 className="text-lg font-semibold">
            Anlaufstelle gemäß Art. 11 DSA
          </h2>
          <p className="text-sm text-gray-500 mb-1">
            (Single point of contact under the Digital Services Act, in force
            since Feb 2024)
          </p>
          <p>
            E-Mail:{' '}
            <a href="mailto:emojar.info@gmail.com" className="underline">
              emojar.info@gmail.com
            </a>
          </p>
          <p>Sprachen / Languages: Deutsch, English</p>
        </div>

        {/* --- Streitbeilegung --- */}
        <div>
          <h2 className="text-lg font-semibold">
            EU-Streitschlichtung / EU Dispute Resolution
          </h2>
          <p>
            Die Europäische Kommission stellt eine Plattform zur
            Online-Streitbeilegung (OS) bereit:{' '}
            <a
              href="https://ec.europa.eu/consumers/odr"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              https://ec.europa.eu/consumers/odr
            </a>
          </p>
          <p className="mt-1 text-sm text-gray-600">
            The European Commission provides a platform for online dispute
            resolution (ODR) at the link above. We are not obliged to
            participate in dispute resolution proceedings before a consumer
            arbitration board and do not do so voluntarily.
          </p>
        </div>

        {/* --- Haftungsausschluss --- */}
        <div>
          <h2 className="text-lg font-semibold">
            Haftungsausschluss / Disclaimer
          </h2>
          <p className="text-sm text-gray-600">
            All emoji data on this site is sourced from the Unicode Common
            Locale Data Repository (CLDR) and the Unicode Consortium&apos;s
            official emoji test files. No user-generated content is published on
            this site. Liability for the content of external links rests solely
            with the operators of those sites.
          </p>
        </div>
      </section>
    </div>
  );
}
