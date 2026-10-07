---
slug: what-javascript-minification-actually-does
tool: javascript-minifier
title: What JavaScript Minification Actually Does to Your Code
description: "Compression and mangling explained with real before-and-after Terser output, plus when to turn off name shortening and why minified code isn't secret."
tags: [JavaScript, Performance, Explainer]
---

JavaScript minification makes code smaller without changing what it does. A minifier like Terser does two separate jobs. **Compression** rewrites the code into a shorter equivalent: it removes whitespace and comments, deletes dead branches, inlines single-use variables and simplifies expressions. **Mangling** renames local variables and parameters to one-letter names. Together they typically cut a hand-written file by 30–60% before gzip.

Here's what each step does, shown with real Terser output.

## Before and after: a small example

The input, 390 characters:

```js
const API_URL = 'https://api.example.com';
function formatPrice(amountInCents, currency) {
  const DEBUG = false;
  if (DEBUG) {
    console.log('formatting', amountInCents);
  }
  const amount = amountInCents / 100;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
}
document.querySelector('#total').textContent = formatPrice(1999, 'USD');
```

Output with **Shorten variable names** on, 227 characters (42% smaller):

```js
const API_URL = 'https://api.example.com';
function formatPrice(t, e) {
  const r = t / 100;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: e,
  }).format(r);
}
document.querySelector('#total').textContent = formatPrice(1999, 'USD');
```

Let's go through what happened.

## Step 1: Compression

These changes come from the compressor, and they happen whether or not mangling is on:

- **Whitespace and line breaks removed.** Spaces are kept only where the syntax needs them, as in `return new`.
- **Comments removed.**
- **Dead code eliminated.** `DEBUG` is a constant `false`, so `if (DEBUG) { … }` can never run. Terser drops the branch, and then the now-unused `DEBUG` declaration too.
- **Single-use variables inlined, where safe.** In the tool's sample, the two statements ``const message = `Hello, ${name}!`; return message;`` become just ``return`Hello, ${e}!` ``.
- **Syntax shortened.** Optional semicolons and braces are dropped, and `new Foo()` might become `(new Foo)`.

With mangling **off**, the same input comes out at 275 characters. It's still smaller, but the names stay readable:

```js
function formatPrice(amountInCents, currency) {
  const amount = amountInCents / 100;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
}
```

## Step 2: Mangling

Mangling renames the **local** names: `amountInCents` → `t`, `currency` → `e`, `amount` → `r`. Those names exist only inside the function, so renaming them can't affect any other code. In this example, mangling saved another 48 characters.

Notice what was **not** renamed: `API_URL` and `formatPrice`. They're top-level names, and other scripts on the page might reference them as globals, so renaming them could break something Terser can't see. Property names (`style`, `currency`, `textContent`) are never touched either, because objects can be accessed in ways that can't be followed statically.

## When should you turn off "Shorten variable names"?

Leave it on by default. Turn it off when:

- **You'll debug the output directly.** A stack trace mentioning `currency` is easier to read than one mentioning `e`.
- **Code reads parameter names at runtime.** Some older dependency-injection libraries (AngularJS's implicit annotation is the classic case) parse `function.toString()` to find parameter names. Mangling breaks them.
- **You want readable but compact code** for a bookmarklet or a snippet someone else will review.

Function and class names declared at the top level keep their names, so `Widget.name` still returns `"Widget"` in the output.

## Minification is not obfuscation

Minified code looks unreadable, but a formatter brings back the structure in seconds, and only the local names stay lost. Anyone can read the logic. **Never put secrets in client-side JavaScript**, minified or not. API keys, internal URLs and feature flags in a bundle are public.

## How to minify JavaScript in the browser

1. Open the [JavaScript Minifier](/online-tool/developer-tools/javascript-minifier) and paste your code into **JavaScript input**, or click **Load sample**.
2. Tick or untick **Shorten variable names**.
3. Click **Minify JavaScript** (or press Ctrl/⌘ + Enter).
4. Copy the **Minified JavaScript** or download it as `output.min.js`.

Terser loads on demand and runs locally, so your source isn't uploaded. If the code doesn't parse, you'll see an error such as _The JavaScript could not be parsed. Unexpected token: punc (;)_. Fix the syntax and try again. To read a minified file instead of producing one, use the [JavaScript Formatter](/online-tool/developer-tools/javascript-formatter).

## When to use a build tool instead

For an application, minify in your bundler (Vite, webpack, esbuild and others), not by hand. The bundler can minify across all your modules at once, generate source maps so production errors point back to your original lines, and run on every build. The online tool is the right fit for one-off scripts, snippets embedded in a CMS, bookmarklets, quick size comparisons, or for seeing what a minifier does to a specific piece of code.

## FAQ

### How much does minification save after gzip?

Less than the raw numbers suggest, since gzip already compresses repeated whitespace and long names well. Minification still helps, because removed comments and dead code are gone entirely rather than compressed, and the browser has less code to parse.

### Can minification break my code?

With default settings, Terser keeps behavior the same for valid JavaScript. Breakage usually comes from code that relies on things minifiers are allowed to change: `Function.prototype.toString()`, parameter names, or `eval` reaching into local scope. Test the minified file before shipping it.

### Does it support TypeScript or JSX?

No. Terser expects plain JavaScript. Compile TypeScript or JSX to JavaScript first, then minify the result.

Shrink your next snippet with the [JavaScript Minifier](/online-tool/developer-tools/javascript-minifier).
