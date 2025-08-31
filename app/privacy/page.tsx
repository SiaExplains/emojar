// app/privacy/page.tsx
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | Emojar",
  description:
    "Read how Emojar.com collects, uses, and protects data when you browse, search, and copy emojis. Includes cookie and ad personalization details.",
  alternates: {
    canonical: "https://emojar.com/privacy",
  },
  openGraph: {
    title: "Privacy Policy | Emojar",
    description:
      "Learn about data collection, cookies, analytics, and ad personalization on Emojar.com.",
    url: "https://emojar.com/privacy",
    siteName: "Emojar",
    type: "article",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-5 py-10">
      <h1 className="text-3xl font-semibold tracking-tight">Privacy Policy</h1>
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
        Last updated: <time dateTime="2025-08-31">August 31, 2025</time>
      </p>

      <section className="mt-8 space-y-6 text-gray-800 dark:text-gray-200 leading-7">
        <p>
          Welcome to <strong>Emojar.com</strong> (“we,” “our,” or “us”). We value your
          privacy and are committed to protecting your information. This policy explains
          what we collect, how we use it, and the choices you have when using our website.
        </p>

        <h2 className="mt-10 text-xl font-semibold">1. Information We Collect</h2>
        <p>
          Emojar is a free emoji search, copy, and paste platform. You can use it without
          creating an account. We may collect:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <span className="font-medium">Non-Personal Information:</span> browser/device
            details, OS, language, IP (approx. city/country), pages viewed, time on site,
            referrers.
          </li>
          <li>
            <span className="font-medium">Cookies & Similar Technologies:</span> used to
            improve experience, remember preferences, measure usage, and display relevant
            ads. Third parties (e.g., Google AdSense/Analytics) may set cookies per their
            policies.
          </li>
        </ul>

        <h2 className="mt-10 text-xl font-semibold">2. How We Use Information</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Operate, maintain, and improve website performance and features.</li>
          <li>Analyze traffic, usage patterns, and trends.</li>
          <li>Serve relevant ads through advertising partners.</li>
          <li>Detect, prevent, and address security or misuse issues.</li>
        </ul>
        <p className="font-medium">We do not sell personal information.</p>

        <h2 className="mt-10 text-xl font-semibold">3. Third-Party Services</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li><span className="font-medium">Google Analytics</span> – usage measurement.</li>
          <li><span className="font-medium">Google AdSense</span> – ad delivery/measurement.</li>
        </ul>
        <p>
          These services may collect data via cookies or similar tech under their own
          privacy policies.
        </p>

        <h2 className="mt-10 text-xl font-semibold">4. Your Choices and Rights</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li><span className="font-medium">Cookies:</span> manage/disable in your browser.</li>
          <li><span className="font-medium">Ad Personalization:</span> adjust in your Google account or regional opt-out tools.</li>
          <li><span className="font-medium">Access/Deletion:</span> we don’t run accounts or store user-submitted personal data.</li>
        </ul>

        <h2 className="mt-10 text-xl font-semibold">5. Data Security</h2>
        <p>
          We implement reasonable technical and organizational measures to protect information.
          No method of transmission or storage is 100% secure.
        </p>

        <h2 className="mt-10 text-xl font-semibold">6. Children’s Privacy</h2>
        <p>
          Emojar isn’t directed to children under 13 and we don’t knowingly collect their data.
          If you believe a child provided data, contact us for removal.
        </p>

        <h2 className="mt-10 text-xl font-semibold">7. International Use</h2>
        <p>
          Using Emojar from anywhere constitutes consent to processing under this policy.
        </p>

        <h2 className="mt-10 text-xl font-semibold">8. Changes to This Policy</h2>
        <p>
          We may update this page over time and will change the “Last updated” date. Continued
          use means you accept the changes.
        </p>

        <h2 className="mt-10 text-xl font-semibold">9. Contact Us</h2>
        <p>
          Email: <a className="underline" href="mailto:emojar.info@gmail.com">emojar.info@gmail.com</a>
        </p>

        <hr className="my-6 border-gray-200/60 dark:border-gray-700" />

        <p className="text-sm">
          Related:{" "}
          <Link href="/terms" className="underline">Terms of Service</Link>
        </p>
      </section>
    </main>
  );
}
