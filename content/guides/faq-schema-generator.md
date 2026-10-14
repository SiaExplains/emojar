---
slug: faq-schema-markup-explained-with-example
tool: faq-schema-generator
title: 'FAQ Schema Markup: How FAQPage JSON-LD Works and When to Use It'
description: How FAQPage structured data is built, what changed for FAQ rich results in 2023, and a worked example of generating and checking JSON-LD for a help page.
tags: [SEO, Structured Data, JSON-LD]
---

FAQ schema is a small block of JSON-LD that describes the questions and answers on a page using the Schema.org `FAQPage` type. You write the questions and answers once on the page, put the same text into the markup, and add it inside a `<script type="application/ld+json">` tag. The [FAQ Schema Generator](/online-tool/developer-tools/faq-schema-generator) builds that block for you. Just be realistic about what it does: since August 2023 Google shows FAQ rich results only for well-known, authoritative government and health sites, so for most websites the markup describes the content without changing how the search result looks.

## What does FAQPage markup look like?

The structure is short and always the same. A `FAQPage` object has a `mainEntity` array, and each item in that array is a `Question` with two parts:

- **name**, the question text.
- **acceptedAnswer**, an `Answer` object whose **text** holds the answer.

That's the whole vocabulary you need. There are no ratings, dates or authors to fill in, which is why hand-written FAQ markup usually breaks for boring reasons: a missing comma between two questions, an unescaped quotation mark inside an answer, or a stray line break in the middle of a string.

## Is FAQ schema still worth adding?

It depends on what you expect from it. In August 2023 Google cut back FAQ rich results, the expandable questions that used to appear under a search listing. They're now limited to well-known, authoritative government and health websites. If you run a shop, a SaaS product or a blog, valid markup almost certainly won't bring those dropdowns back.

There are still reasonable reasons to add it:

- It describes your Q&A content in a clear, machine-readable way that other search engines, assistants and crawlers can read.
- It costs little to maintain if it's generated from the same text as the page.
- It keeps your structured data consistent if you already mark up other content.

What it can't do is guarantee rankings, rich results or any particular display. No generator can promise that, and you should be wary of anyone who does.

## A worked example: a small shop's help page

Imagine a help page with three questions. The generator opens with two sample pairs already filled in, so overwrite them and press **＋ Add question** for the third:

1. "How long does delivery take?" with "Orders leave our warehouse within 2 working days and usually arrive in 3–5 days."
2. "Can I return a product?" with "Yes. Unused items can be returned within 30 days of delivery."
3. "Do you ship outside the EU?" with "We currently ship to the EU, the UK and Switzerland."

As you type, the output box updates. With **Wrap in a &lt;script&gt; tag** ticked (the default), you get a complete element you can paste straight into the page:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How long does delivery take?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Orders leave our warehouse within 2 working days and usually arrive in 3–5 days."
      }
    }
  ]
}
</script>
```

The example above shows only the first question to save space; the real output contains all three. Untick the checkbox if your CMS has its own field for structured data and only wants the bare JSON. **Copy** puts the result on your clipboard, and **Download** saves it as `faq-schema.html` with the tag or `faq-schema.json` without it.

## How the generator keeps the JSON valid

The tool builds the markup as a JavaScript object and serialises it, so quotes, backslashes and line breaks inside your answers are escaped correctly. When the output is wrapped in a script tag, any `</` sequence inside the text is escaped as well, so an answer that happens to contain `</script>` can't end the element early.

It also checks the pairs before producing anything:

- Completely empty pairs are skipped, so a spare blank row does no harm.
- A pair with only a question or only an answer is an error, for example "Pair 3 needs both a question and an answer."
- The same question listed twice produces a warning, because duplicate entries are almost always a copy-and-paste slip.

## Common mistakes with FAQ markup

**Marking up text that isn't on the page.** Every question and answer in the JSON-LD should be visible to visitors. Hidden or invented Q&A is against Google's guidelines and helps nobody.

**Rewording the answers.** Keep the markup identical to the page. If you edit the page later, regenerate the markup too.

**Using FAQPage for user questions.** A forum thread where visitors post their own answers is a different type (`QAPage`). FAQPage is for questions the site itself answers.

**Pasting HTML-heavy answers.** Basic formatting is tolerated in answer text, but plain text is the safest choice. If you must show code or symbols in an answer on the page, the [HTML Entity Encoder](/online-tool/developer-tools/html-entity-encoder) helps you escape them in the visible HTML.

## FAQ

### Where on the page should the script tag go?

Anywhere in the HTML. The `<head>` is common, but placing it in the `<body>` works just as well for JSON-LD.

### Can one page have FAQ markup and Article markup?

Yes. Use separate script blocks, or combine both objects in an array. The [Article Schema Generator](/online-tool/developer-tools/article-schema-generator) produces the second block.

### How do I check the output?

Paste it into the [JSON-LD Validator](/online-tool/developer-tools/json-ld-validator) for a quick local check of syntax and required properties, such as a Question missing its acceptedAnswer. For Google's own verdict, use its Rich Results Test after the page is live.

Write the questions your customers actually ask, then turn them into markup with the [FAQ Schema Generator](/online-tool/developer-tools/faq-schema-generator).
