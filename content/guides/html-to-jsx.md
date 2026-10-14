---
slug: convert-html-to-jsx-for-react-components
tool: html-to-jsx
title: 'HTML to JSX: What Changes When You Move Markup into React'
description: 'Pasting HTML into a React component breaks on class, style strings, unclosed tags and braces. Here is every change a converter makes, and what to fix yourself.'
tags: [React, JSX, HTML]
---

To turn HTML into JSX, you rename a handful of attributes (`class` to `className`, `for` to `htmlFor`, `tabindex` to `tabIndex`), rewrite inline `style` strings as JavaScript objects, close every void element (`<br />`), turn HTML comments into `{/* */}`, and escape literal curly braces in text. The [HTML to JSX Converter](/online-tool/developer-tools/html-to-jsx) applies all of these rules in one pass. A few things, like inline event handlers, still need a human decision, so the tool flags them in notes under the output.

## One snippet, before and after

Here's a small form fragment of the kind you might copy from a design system's docs or an old template:

```html
<label for="name" class="label">Name</label>
<input id="name" value="Ada" readonly>
<p style="font-size: 14px; line-height: 1.5">Hello, {name}<br>Welcome back.</p>
<button onclick="save()">Save</button>
<!-- footer -->
```

With the default options (fragment wrapping on), the converter returns:

```jsx
<>
<label htmlFor="name" className="label">Name</label>
<input id="name" defaultValue="Ada" readOnly />
<p style={{ fontSize: '14px', lineHeight: 1.5 }}>Hello, {'{'}name{'}'}<br />Welcome back.</p>
<button onClick={() => { /* save() */ }}>Save</button>
{/* footer */}
</>
```

Every line changed. Here's why.

## Attributes: reserved words and camelCase

`class` and `for` are reserved words in JavaScript, so React uses `className` and `htmlFor`. Many other attributes are written in camelCase in React: `readonly` becomes `readOnly`, `maxlength` becomes `maxLength`, `colspan` becomes `colSpan`, `srcset` becomes `srcSet`, and so on. The converter has a lookup table for these.

Two groups are left alone on purpose. `data-*` and `aria-*` attributes keep their dashes, because React passes them through as they are. Attribute names that already contain capitals, like SVG's `viewBox`, keep their case. Other dashed or namespaced names are camel-cased, which handles most SVG icons:

```html
<svg viewBox="0 0 24 24" stroke-width="2"><path fill-rule="evenodd" d="M0 0"/></svg>
```

```jsx
<svg viewBox="0 0 24 24" strokeWidth="2"><path fillRule="evenodd" d="M0 0" /></svg>
```

Boolean attributes such as `readonly`, `required` or `autofocus` stay bare (`readOnly`), which JSX reads as `true`.

## Inline styles become objects

In React, `style` takes an object, not a string. The converter splits the declarations on semicolons (ignoring any inside quotes or parentheses, so `url("a;b")` survives), camel-cases each property and quotes the values. Plain unitless numbers such as `1.5` stay numbers. Values with units, and `0`, are written as strings like `'14px'` and `'0'`, which React accepts. Custom properties like `--gap` keep their name in quotes, and vendor prefixes get React's casing, so `-webkit-transition` becomes `WebkitTransition`.

## Void elements, unclosed tags and fragments

JSX requires every element to be closed. Void elements (`br`, `img`, `input`, `hr`, `meta`, `link` and the rest) get a self-closing slash. Tags that HTML lets you leave open, such as `<li>`, `<p>`, `<td>` or `<option>`, are closed when the next sibling of the same kind starts, or when their parent closes:

```html
<ul><li>One<li>Two</ul>
```

```jsx
<ul><li>One</li><li>Two</li></ul>
```

A component can only return one root element. If your snippet has several top-level elements, keep **Wrap several top-level elements in a fragment** on and the result is wrapped in `<>…</>`. Turn it off and you'll get a note reminding you that JSX needs one parent.

## Text: braces, comments and `>`

Curly braces open a JavaScript expression in JSX, so a literal `{name}` in your text would try to read a variable. The converter writes each brace as a string expression, `{'{'}` and `{'}'}`, so the text renders exactly as before. A bare `>` in text becomes `&gt;`. HTML comments turn into JSX comments, `{/* footer */}`, so they stay in the source but never render.

## Event handlers and form fields need a decision

This is where a mechanical conversion stops. React event handlers take functions, not strings of code, so `onclick="save()"` can't simply be renamed. The converter writes `onClick={() => { /* save() */ }}`: correctly named, harmless, with the original code kept in a comment so you can move the logic into a real handler.

Form fields have a similar trap. In React, a `value` or `checked` prop without an `onChange` handler makes the field read-only. To keep the fields editable, the converter changes them on `input`, `textarea` and `select` to `defaultValue` and `defaultChecked`. If you want a controlled field, switch back to `value` and add state and an `onChange` yourself.

## Getting a ready-to-paste component

Tick **Wrap in a component** and give it a name, and the output becomes a full function component:

```jsx
export default function List() {
  return (
    <ul><li>One</li><li>Two</li></ul>
  );
}
```

The name has to start with a capital letter and contain only letters and digits. Anything else falls back to `Component`. If the markup has several top-level elements, the component wraps them in a fragment for you, so the `return` always has one root.

## Limits worth knowing

The converter tokenizes your markup as text. It never builds a live DOM and never runs anything, so it's safe to paste markup that contains scripts. `<script>` and `<style>` contents are kept as template strings, and React won't execute a script rendered that way. A `<!DOCTYPE>` is removed. It's not a full React compiler, though: template syntax from other frameworks (`{{ }}`, `v-if`, `*ngFor`), badly broken HTML and unusual attributes may still need edits.

Messy input converts better if you tidy it first in the [HTML Formatter](/online-tool/developer-tools/html-formatter). For SVG icons, run them through the [SVG Optimizer](/online-tool/developer-tools/svg-optimizer) before converting, to drop editor metadata you don't want in your bundle.

## FAQ

### Does it convert `class` inside `<style>` blocks or scripts?

No. Their contents are kept as text, exactly as written. Only attributes on elements are rewritten.

### Will the output pass my linter?

Usually, but line breaks and indentation come straight from your input. Run your formatter on the result.

Convert your next snippet with the [HTML to JSX Converter](/online-tool/developer-tools/html-to-jsx), then read the notes under the output before you paste it in.
