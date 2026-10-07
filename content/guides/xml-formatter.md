---
slug: how-xml-formatting-works-and-when-whitespace-matters
tool: xml-formatter
title: How XML Formatting Works and When Whitespace Matters
description: 'What an XML beautifier actually does to your document, how it finds mismatched tags, and why minifying mixed-content XML can change your text.'
tags: [XML, Formatting, Explainer]
---

An XML formatter splits a document into tokens (tags, text, comments, CDATA) and writes each one on its own line, indented one level for every open element. Along the way it keeps a stack of open tags, so any closing tag that doesn't match the last one opened is caught right away. For data-style XML like feeds, configs, SOAP payloads and SVG, formatting is completely safe. For _mixed content_, where text and tags sit side by side, whitespace becomes part of the data, and that's where you need to be careful.

## What happens inside the formatter?

Take this one-line feed:

```xml
<?xml version="1.0"?><feed><!-- items --><entry id="1"><title>Hi</title><content><![CDATA[<b>bold</b>]]></content><link href="/x"/></entry></feed>
```

The [XML Formatter](/online-tool/developer-tools/xml-formatter) reads it as a sequence of tokens and handles each kind differently:

| Token                  | Example                   | What the formatter does                                     |
| ---------------------- | ------------------------- | ----------------------------------------------------------- |
| Processing instruction | `<?xml version="1.0"?>`   | Prints it at the current depth, no nesting                  |
| Comment                | `<!-- items -->`          | Keeps it verbatim on its own line                           |
| Opening tag            | `<entry id="1">`          | Prints it, then pushes `entry` onto the stack (depth +1)    |
| Text-only element      | `<title>Hi</title>`       | Keeps it on **one line** for readability                    |
| CDATA                  | `<![CDATA[<b>bold</b>]]>` | Keeps it verbatim; the `<b>` inside is not treated as a tag |
| Self-closing tag       | `<link href="/x"/>`       | Prints it, no depth change                                  |
| Closing tag            | `</entry>`                | Pops the stack; errors if the name doesn't match            |

Result:

```xml
<?xml version="1.0"?>
<feed>
  <!-- items -->
  <entry id="1">
    <title>Hi</title>
    <content>
      <![CDATA[<b>bold</b>]]>
    </content>
    <link href="/x"/>
  </entry>
</feed>
```

## How does it find broken tags?

That stack is the whole trick. Every opening tag is pushed onto it, and every closing tag must match the name on top. Three kinds of error come out of it:

```
<a><b>1</c></a>  →  Invalid XML: closing tag </c> does not match <b>.
<a><b>1</b>      →  Invalid XML: <a> is never closed.
hello            →  Invalid XML: the document must start with a tag.
```

XML is case-sensitive, so `<Item></item>` is also reported as a mismatch. HTML is a common source of confusion too: `<br>` without a slash is fine in HTML, but in XML it opens an element that is never closed. Write `<br/>` in XHTML and in XML-based formats like SVG.

## What it does not check

The formatter checks structure, not every rule in the XML spec. Specifically:

- **No schema or DTD validation.** An XSD that says `<price>` must be a decimal isn't consulted.
- **Attributes aren't validated.** `<a x=1>` (unquoted) passes through as written, even though strict XML requires quotes.
- **Entities aren't checked.** `&nbsp;` is undefined in plain XML but passes through unchanged.
- **Multiple root elements are allowed.** `<a/><b/>` formats fine, but a strict parser would reject it.

If you need full well-formedness checking, run the result through a real XML parser such as `xmllint --noout file.xml` or your language's DOM parser. Use the formatter to _read_ the document and find nesting problems fast.

## When does whitespace matter?

In data-centric XML, whitespace between tags is just formatting, and adding or removing it changes nothing. In **mixed content**, it's part of the text:

```xml
<p>Hello <b>x</b> world</p>
```

**Beautify** gives:

```xml
<p>
  Hello
  <b>x</b>
  world
</p>
```

and **Minify** gives `<p>Hello<b>x</b>world</p>`. The spaces around `<b>` are gone, so a renderer would now show "Helloxworld". The formatter treats text next to tags as separate tokens and trims them.

Rule of thumb: format data XML freely. For document XML (DocBook, DITA, XHTML bodies, rich-text fields), use beautify only for reading, and don't save or minify the result. Whitespace _inside_ a text-only element is kept, so `<item>Text   with  spaces</item>` comes through intact.

## Using the tool

1. Paste XML into **XML input**, or click **Load sample**.
2. Choose a **Mode**: **Beautify (2 spaces)**, **Beautify (4 spaces)** or **Minify**.
3. Click **Format XML** (or press Ctrl/⌘ + Enter). Changing the mode after a run reformats right away.
4. Copy the result or download `output.xml`.

It's handy for SVG icons exported as one line from design tools. Formatting makes the `<g>`, `<path>` and `<circle>` structure readable, so you can delete a stray layer or change a `fill` by hand. Everything runs locally in the browser, which matters for SOAP payloads and config files with credentials.

For HTML, the [HTML Formatter](/online-tool/developer-tools/html-formatter) is the better choice, because it understands HTML's optional closing tags and inline elements. For JSON payloads, use the [JSON Formatter](/online-tool/developer-tools/json-formatter).

## FAQ

### Why does an empty element span two lines?

`<b></b>` is an opening tag followed by a closing tag with no text between them, so it's printed as two lines. If you want it compact, write it as the self-closing `<b/>`. The two forms mean the same thing in XML.

### Are attributes reordered or reformatted?

No. Each tag is printed exactly as written, attributes and quoting included. Only the line breaks and indentation between tokens change.

### How much smaller does minified XML get?

It depends on how much indentation the source had. A deeply nested, 4-space-indented file can shrink substantially, but as with any text format, gzip on the server recovers most of that difference anyway.

Untangle your next one-line XML document with the [XML Formatter](/online-tool/developer-tools/xml-formatter).
