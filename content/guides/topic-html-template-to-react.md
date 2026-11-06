---
slug: convert-html-template-to-react-component
title: Turn an HTML Template Into a React Component, Step by Step
description: Tidy minified template HTML, convert it to JSX, format the result, swap old floats for CSS grid and export a code image for your PR, all free in the browser.
tags: [React, HTML, CSS, Developer Tools]
---

To turn an HTML template into a React component, work one section at a time: format the markup with the [HTML Formatter](/online-tool/developer-tools/html-formatter), convert it with the [HTML to JSX Converter](/online-tool/developer-tools/html-to-jsx), tidy the output with the [JavaScript Formatter](/online-tool/developer-tools/javascript-formatter), then fix the handlers the converter leaves empty. The stylesheet needs its own pass. The [CSS Formatter](/online-tool/developer-tools/css-formatter) makes it readable and the [CSS Grid Playground](/online-tool/developer-tools/grid-playground) can replace an old layout. These tools run in your browser and your code isn't uploaded, which helps if the template is a paid one or belongs to a client.

The example here is a landing page template you've bought and now need inside a React project. It arrived as one minified `index.html` and a minified `template.css`. We'll move its pricing section, which has two plans and a small sign-up form.

## How do you make minified HTML readable first?

Copy just the pricing `<section>` out of `index.html` and paste it into the HTML Formatter. Converting a section at a time gives you a component per section. A whole page would also bring along the `<!DOCTYPE>`, which the converter removes because JSX has no equivalent, plus `<html>` and `<head>` tags you don't want in a component.

Leave **Indent** on 2 spaces, or pick 4 spaces or Tab, then click **Format HTML**. Here is the sign-up form from the result:

```html
<form class="signup">
  <label for="email">Work email</label
  ><input
    id="email"
    type="email"
    value="you@example.com"
    tabindex="1"
    required
  />
</form>
```

That `</label` and `><input` split looks like a mistake, but Prettier, the formatter behind this tool, does it on purpose. A line break between two inline elements could add visible space, so it keeps them touching. The JavaScript Formatter clears this up later.

## What does the HTML to JSX Converter change?

Paste the formatted section into the converter. The JSX appears as you type. **Wrap several top-level elements in a fragment** is on by default, and it only matters if you paste more than one top-level element. Tick **Wrap in a component** and set **Component name** to `PricingSection`. The name has to start with a capital letter and contain only letters and numbers, or the tool falls back to `Component`.

Part of the output looks like this:

```jsx
<h2 style={{ textAlign: 'center', marginBottom: '24px' }}>Plans</h2>
<div className="plan-list">
  <div className="plan">
    <h3>Starter</h3>
    <p className="price">$9<br />per month</p>
    <button className="btn" onClick={() => { /* choosePlan('starter') */ }}>Choose</button>
  </div>
```

Every `class` became `className`, `for` became `htmlFor` and `tabindex` became `tabIndex`. The inline style turned into an object with camelCase keys, and the HTML comment became `{/* Plans */}`.

The tool flags two changes in amber notes under the output. The first is `onclick`. React handlers take functions, so `onclick="choosePlan('starter')"` becomes an empty arrow function with the old code in a comment, and nothing happens on click until you write the handler. The second is the email field. Its `value` became `defaultValue`, so the field stays editable without an `onChange` handler. If you want React to control it, change that yourself.

The converter reads the HTML as text and never renders or runs it, so any scripts in the template won't execute while you work.

## How do you clean up the converted JSX?

The converter keeps your line breaks and doesn't reformat anything, so long lines like that button stay long. Paste the component into the JavaScript Formatter, which accepts JSX. Choose **Single quotes** or **Double quotes** to match your project and click **Format JavaScript**. The button now spreads over several lines with the comment sitting inside the handler, and the odd label split is gone:

```jsx
<label htmlFor="email">Work email</label>
<input
  id="email"
  type="email"
  defaultValue="you@example.com"
  tabIndex="1"
  required
/>
```

If your project uses TypeScript, add types after this step. The formatter reports TypeScript-only syntax such as type annotations as a syntax error.

## How do you read and update the template's CSS?

Because `className` keeps the same names, the template's selectors still match the new component. Paste `template.css` into the CSS Formatter and click **Format CSS** to see what you're working with. Ours shows the pricing cards are laid out with floats:

```css
.plan {
  float: left;
  width: 30%;
  margin-right: 3%;
}
.plan:last-child {
  margin-right: 0;
}
```

There is also a media query at 700px that undoes the float on small screens. The formatter only beautifies. Minifying is left to your build tool.

## Can CSS grid replace the template's float layout?

Yes, and it removes the margin arithmetic and the media query. Open the CSS Grid Playground and click the **Photo gallery (auto-fill)** example, since it already has an empty rows field. Then make these changes:

1. Set **grid-template-columns** to `repeat(auto-fit, minmax(220px, 1fr))`.
2. Move **row-gap** and **column-gap** to 24px.
3. Drag **Items** down to 2, one for each plan.

With two plans, `auto-fit` is the right choice. `auto-fill` keeps empty tracks on a wide screen, while `auto-fit` collapses them so the two cards stretch across the row. Drag **Preview width** between 30% and 100% to watch the cards wrap. Two 220px cards and a 24px gap need 464px, so the cards stack in any narrower container.

**Copy CSS** gives you this:

```css
.container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 24px;
}
```

Rename `.container` to `.plan-list`, delete the float, width and margin rules from `.plan`, and remove the 700px media query. Check the result at a few widths, because the cards now stack at 464px and not at 700px.

If a section in your template needs a fixed structure, the **Holy grail page**, **Dashboard** and **12-column layout** examples are useful starting points. Click an item, then set its **grid-column-start** and **grid-column-end** using the small line numbers along the edge of the preview, or a value like `span 2`.

## How do you show the change to your team?

A before-and-after image works well on a slide or in a pull request comment. Paste one plan card into [Code to Image](/online-tool/developer-tools/code-to-image), set **Language** to JavaScript and type `PricingSection.jsx` as the **Window title**. The theme starts on One Dark with the Ocean background, and **Export size** starts at **2× (sharp, recommended)**. Tick **Line numbers** if you'll refer to specific lines.

**Download PNG** names the file after the title, here `PricingSection.jsx.png`, and **Copy image** puts it on your clipboard. The tool draws up to 300 lines, though 10 to 25 lines read best. An image can't be searched or copied, and screen readers can't read the code in it, so link to the real code too.

## FAQ

### Will the converted JSX always compile?

For typical HTML, yes, but the converter isn't a full React compiler. Broken markup, very unusual attributes and template syntax from other frameworks may need edits. A placeholder such as `{{ price }}` is treated as text, with its braces escaped, so replace it with a real prop.

### What happens to script tags in the template?

Their contents are kept as a string, and a note under the output warns you that React won't run inline `<script>` tags rendered this way. Move that logic into your component or import it as a module.

### Can I convert an SVG icon with this tool?

Yes. SVG attributes such as `stroke-width` become `strokeWidth`, `xlink:href` becomes `xlinkHref`, and mixed-case names such as `viewBox` keep their case.

### Why did my input's value become defaultValue?

A `value` prop with no `onChange` handler would make the field read-only in React. With `defaultValue` and `defaultChecked`, the field stays editable until you decide to control it.

More formatters, playgrounds and converters are in [Developer Tools](/online-tool/developer-tools).
