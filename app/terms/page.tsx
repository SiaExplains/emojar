export default function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12 text-gray-800">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
      <p className="text-sm text-gray-500 mb-8">Last updated: August 29, 2025</p>

      <p className="mb-6">
        Welcome to <strong>Emojar.com</strong> (“Emojar,” “we,” “our,” or “us”).
        By accessing or using Emojar.com, you agree to comply with and be bound
        by these Terms of Service. Please read them carefully. If you do not
        agree, you should not use our website.
      </p>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">1. Use of the Website</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            Emojar.com is a free online emoji platform that allows users to
            search, copy, and paste emojis into social media, messages, and
            documents.
          </li>
          <li>
            You may use the website only for lawful purposes and in accordance
            with these Terms.
          </li>
          <li>
            You agree not to misuse the website, attempt to disrupt its
            functionality, or use it in a way that could harm us or other users.
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">2. Intellectual Property</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            Emojis are part of the Unicode Standard and are not owned by Emojar.
            We provide access to emojis in a searchable, copy-and-paste format.
          </li>
          <li>
            All website content (including design, layout, code, text, and
            graphics) is the property of Emojar.com or its licensors, unless
            otherwise noted.
          </li>
          <li>
            You may not copy, modify, distribute, or exploit our website content
            for commercial purposes without our written consent.
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">
          3. Advertisements &amp; Affiliate Links
        </h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            Emojar.com is supported by advertising (Google AdSense) and may
            contain affiliate links.
          </li>
          <li>
            Clicking on third-party ads or links will direct you to websites we
            do not control. We are not responsible for the content, policies, or
            practices of third-party websites.
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">
          4. Disclaimer of Warranties
        </h2>
        <p>
          Emojar.com is provided “as is” and “as available” without warranties
          of any kind. We make no guarantees about the accuracy, availability,
          or reliability of emojis, categories, or search results. We do not
          guarantee uninterrupted access, error-free operation, or protection
          against viruses or other harmful components.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">5. Limitation of Liability</h2>
        <p>
          To the maximum extent permitted by law, Emojar.com shall not be liable
          for any direct, indirect, incidental, or consequential damages
          resulting from your use of or inability to use the website. This
          includes but is not limited to data loss, interruption of business, or
          damages caused by third-party links and ads.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">6. Privacy</h2>
        <p>
          By using Emojar.com, you acknowledge that we may collect basic usage
          data (e.g., through cookies or analytics) for site improvement and
          advertising purposes. For details, please see our{" "}
          <a href="/privacy" className="text-blue-600 underline">
            Privacy Policy
          </a>
          .
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">7. Changes to the Terms</h2>
        <p>
          We may update these Terms of Service at any time. Changes will be
          effective immediately upon posting to this page. Continued use of
          Emojar.com after changes constitutes acceptance of the updated Terms.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">8. Governing Law</h2>
        <p>
          These Terms shall be governed by and construed in accordance with the
          laws of Germany (where Emojar.com is operated). Any disputes shall be
          subject to the jurisdiction of the courts in Berlin, Germany.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">9. Contact Us</h2>
        <p>
          If you have any questions about these Terms, you can reach us at:{" "}
          <a
            href="mailto:support@emojar.com"
            className="text-blue-600 underline"
          >
            support@emojar.com
          </a>
        </p>
      </section>
    </main>
  );
}
