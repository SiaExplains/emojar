---
slug: minify-a-static-site-without-a-build-step
title: Minify a Static Site's JS, JSON, SVG and Sitemap by Hand
description: Shrink a hand-written site with no bundler. Minify the script and the JSON data, optimise the logo SVG and check the sitemap, with real before and after sizes.
tags: [Web Performance, JavaScript, Static Sites, How-to]
---

You can minify a small static site without installing a bundler. Paste each file into a browser tool, copy the smaller version back and keep the readable original for editing. A script, a JSON data file, an SVG logo and a sitemap take a few minutes, and in the example below the four files go from 2,100 bytes to 1,116, a little under half. All the tools here run in your browser, so the code you paste is not uploaded.

The example is a bakery's site written by hand: plain HTML, one script that shows today's opening hours, a `menu.json` the page fetches, a logo exported from a drawing app and a `sitemap.xml`. There is no `package.json` and nobody wants one.

## How much does minifying the script save?

Here is `hours.js`, 482 bytes:

```js
// Opening hours for the footer
const OPENING_HOURS = {
  weekdays: '8:00-18:00',
  saturday: '9:00-16:00',
  sunday: 'Closed',
};

function showHours(elementId) {
  const element = document.getElementById(elementId);
  const today = new Date().getDay();
  let label = OPENING_HOURS.weekdays;
  if (today === 6) {
    label = OPENING_HOURS.saturday;
  } else if (today === 0) {
    label = OPENING_HOURS.sunday;
  }
  element.textContent = 'Today: ' + label;
}

showHours('hours');
```

Paste it into the [JavaScript Minifier](/online-tool/developer-tools/javascript-minifier) and press **Minify JavaScript** (Ctrl/⌘ + Enter does the same). The tool runs Terser, and with **Shorten variable names** ticked, which is the default, the output is one line of 298 bytes, 38% smaller:

```
const OPENING_HOURS={weekdays:"8:00-18:00",saturday:"9:00-16:00",sunday:"Closed"};function showHours(e){const t=document.getElementById(e),s=(new Date).getDay();let o=OPENING_HOURS.weekdays;6===s?o=OPENING_HOURS.saturday:0===s&&(o=OPENING_HOURS.sunday),t.textContent="Today: "+o}showHours("hours");
```

The comment is gone and the `if`/`else` has turned into a conditional expression. `elementId`, `element`, `today` and `label` are now `e`, `t`, `s` and `o`. `OPENING_HOURS` and `showHours` keep their names. They sit at the top level of the file, where another script or an `onclick` attribute could be calling them, so they are left alone.

Untick **Shorten variable names** and the result updates to 354 bytes, 27% smaller, with every name intact. That version is easier to follow in the browser's debugger if you expect to chase a bug on the live site.

**Download** saves the result as `output.min.js`. Rename it `hours.min.js`, point the `<script>` tag at it and keep `hours.js` as the file you edit. If the tool answers "The JavaScript could not be parsed", the source has a syntax error, and the message goes on to say what Terser tripped over.

## What happens to the JSON data file?

`menu.json` is indented with two spaces and one field per line, 296 bytes:

```json
{
  "updated": "2026-11-13",
  "items": [
    {
      "name": "Sourdough loaf",
      "price": 6.5,
      "vegan": true
    },
    {
      "name": "Cinnamon bun",
      "price": 3.2,
      "vegan": false
    },
    {
      "name": "Rye bread",
      "price": 5.8,
      "vegan": true
    }
  ]
}
```

The [JSON Minifier](/online-tool/developer-tools/json-minifier) has no button to press. The result appears as you paste, 181 bytes and 39% smaller:

```
{"updated":"2026-11-13","items":[{"name":"Sourdough loaf","price":6.5,"vegan":true},{"name":"Cinnamon bun","price":3.2,"vegan":false},{"name":"Rye bread","price":5.8,"vegan":true}]}
```

Only the whitespace between tokens is removed. The space inside "Sourdough loaf" stays, because it is part of the value.

The minifier has to parse the file first, so it doubles as a syntax check. Leave a comma after the last `"vegan": true` and, in Chrome, you get "Invalid JSON: Expected double-quoted property name (line 18, column 5)." in place of any output. The wording of the first part comes from the browser, so it reads a little differently in Firefox or Safari.

The data is parsed and written out again, so each number comes out in its shortest form. A price typed as `6.50` becomes `6.5`. It is the same number, but if your page prints the raw value and you need the trailing zero, store the price as a string.

## How do you slim down the logo?

SVGs exported from Illustrator, Inkscape, Figma or Sketch carry editor metadata, comments, empty groups and coordinates with six decimal places. Drop the file onto the [SVG Optimizer](/online-tool/developer-tools/svg-optimizer), or paste its code, and the tool runs SVGO on it as soon as it arrives.

I can't show you the bakery's logo, so for a size comparison I pressed **Load sample**, which loads a smiley face with that kind of export clutter. With the defaults (**Number precision (decimal places)** at 3 and **Multiple passes (smaller)** ticked) the line under the options reads **975 B → 335 B (65.6 % smaller)**. `cx="60.000000"` became `cx="60"`, `#ffcc00` became `#fc0`, and the metadata block, the comment and both wrapper groups were removed.

Two more options matter for a logo. **Remove width/height (keep viewBox, scales freely)** takes the sample down to 310 B and lets CSS decide the size. Lowering the precision saves a few more bytes but can move curves slightly, so compare the **Before** and **After** previews before you download. A dropped `logo.svg` downloads as `logo.min.svg`.

## Should a sitemap be minified too?

It can be, though the saving is small. Check first that it is well formed, which is easier when you can see the nesting. The bakery's sitemap was typed on one line. Paste it into the [XML Formatter](/online-tool/developer-tools/xml-formatter), leave **Mode** on **Beautify (2 spaces)** and press **Format XML**:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://example.com/</loc>
    <lastmod>2026-11-13</lastmod>
  </url>
  <url>
    <loc>https://example.com/menu</loc>
    <lastmod>2026-11-10</lastmod>
  </url>
  <url>
    <loc>https://example.com/contact</loc>
  </url>
</urlset>
```

Elements that hold only text, like `<loc>`, stay on one line. If a closing `</url>` were missing, you would see "Invalid XML: closing tag </urlset> does not match <url>." and no output. The check covers nesting and closing tags only. It does not know the sitemap format, so it won't notice a misspelled `<lastmod>` as long as its closing tag matches.

Once the structure looks right, switch **Mode** to **Minify**. The output re-runs by itself and collapses to a single line: 302 bytes against 347 for the indented version, 13% smaller. On three URLs that is nothing. A sitemap with a few thousand entries carries the same indentation on every one of them.

## What did the four files add up to?

| File          | Before | After | Smaller |
| ------------- | ------ | ----- | ------- |
| `hours.js`    | 482 B  | 298 B | 38%     |
| `menu.json`   | 296 B  | 181 B | 39%     |
| Sample SVG    | 975 B  | 335 B | 65.6%   |
| `sitemap.xml` | 347 B  | 302 B | 13%     |

That is 2,100 bytes down to 1,116. Real files are bigger, and the tool pages give typical savings of 30 to 60% for JavaScript, 10 to 30% for pretty-printed JSON and 20 to 60% for exported SVGs. Your server's gzip or Brotli compression still applies on top.

Keep two copies of everything. Edit the readable one, minify again after each change and upload only the small one.

## FAQ

### Can I turn minified JavaScript back into the original?

Only partly. The [JavaScript Formatter](/online-tool/developer-tools/javascript-formatter) restores the indentation and line breaks, but the comments and the original local variable names are gone. Keep the source file.

### Does minifying change what my code or data does?

No. Terser rewrites the script into a shorter equivalent, and the JSON Minifier's output parses to the same data. The only visible difference in JSON is number formatting, such as `6.50` becoming `6.5`.

### Does the XML Formatter validate my sitemap?

It checks that tags are properly nested and closed. It does not validate against a schema, so sitemap-specific mistakes need a search engine's own sitemap report.

### Are my files uploaded when I use these tools?

No. Terser, SVGO and the JSON and XML code all run in your browser on the text you paste or the file you drop.

More formatters, minifiers and converters are in the [developer tools](/online-tool/developer-tools) collection, and the [image tools](/online-tool/image-tools) section has more for SVG and other graphics.
