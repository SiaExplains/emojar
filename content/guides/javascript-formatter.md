---
slug: how-prettier-formats-javascript-and-what-it-reveals
tool: javascript-formatter
title: How Prettier Formats JavaScript, and the Bugs It Can Reveal
description: "Prettier rebuilds your code from a syntax tree instead of adjusting whitespace. Here's how that works, what changes, and how formatting exposes real bugs."
tags: [JavaScript, Prettier, Explainer]
---

A JavaScript formatter like Prettier doesn't nudge your whitespace around. It parses your code into a syntax tree, throws away the original layout entirely, and prints the tree again using fixed rules. That's why the output is the same no matter how messy the input was. It's also why formatting can expose bugs: the printed code shows how the parser actually understood your source, which isn't always what you meant.

## Parse, discard, reprint

Take this one-liner:

```js
const add = (a, b) => {
  return a + b;
};
function greet(name) {
  if (!name) {
    return 'Hello!';
  }
  return `Hello, ${name}!`;
}
console.log(greet('world'), add(2, 3));
```

Prettier turns it into an abstract syntax tree (AST): a `VariableDeclaration` holding an `ArrowFunctionExpression`, a `FunctionDeclaration` with an `IfStatement`, and an `ExpressionStatement` calling `console.log`. Spaces, line breaks and semicolons aren't part of that tree. Then it prints the tree:

```js
const add = (a, b) => {
  return a + b;
};
function greet(name) {
  if (!name) {
    return 'Hello!';
  }
  return `Hello, ${name}!`;
}
console.log(greet('world'), add(2, 3));
```

Because the original layout is discarded, two developers with completely different habits end up with byte-identical files. That's the whole reason teams adopt Prettier: formatting stops being something people argue about in code review.

## What exactly gets normalized?

| Aspect           | What Prettier does                                                                                                        |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------- |
| Indentation      | Uses your **Indent** choice: 2 spaces, 4 spaces or Tab                                                                    |
| Semicolons       | Adds them at the end of every statement                                                                                   |
| Quotes           | Uses your **Quotes** choice (double or single), unless switching would need more escapes                                  |
| Line length      | Wraps code that goes past 80 characters                                                                                   |
| Blocks           | Spreads `{ … }` bodies over multiple lines, but never adds braces that weren't there (`if (!u) return null;` stays as is) |
| Object literals  | Adds spaces inside braces and removes trailing commas in single-line objects                                              |
| Arrow functions  | Wraps single parameters in parentheses: `u => …` → `(u) => …`                                                             |
| Empty statements | Removes stray `;;`                                                                                                        |

What it **never** changes: names, logic, the text of comments, and the order of statements. Prettier's guarantee is that the output's AST is equivalent to the input's.

## The bug-revealing part: automatic semicolon insertion

JavaScript inserts semicolons for you in many places, but not all. Consider:

```js
let x = a(b);
```

You might read this as two statements. The parser doesn't, because a line starting with `(` continues the previous expression. Prettier prints what the parser saw:

```js
let x = a(b);
```

If you ever format code and a line merges with the one above it, that's not Prettier making a mistake. That's the bug that was already in your code. The same thing happens with lines that start with `[`, a template literal, or `+`/`-`. Formatting legacy code without semicolons is a cheap way to find these.

## Syntax errors are reported, not "fixed"

Since parsing comes first, invalid code produces an error instead of output:

```js
function(){
```

> The code could not be parsed. Unexpected token (1:9)

The `(line:column)` points to where the parser got stuck. Fix that and format again. A beautifier that just re-indents would have given you neatly indented broken code. Prettier gives you nothing until the code parses, which is the more honest result.

## JSX works; TypeScript doesn't

The tool uses Prettier's Babel parser, so modern syntax (optional chaining, classes, async/await, ES modules) and JSX are supported:

```js
const el = (
  <Button onClick={() => setOpen(true)} disabled>
    Open
  </Button>
);
```

```jsx
const el = (
  <Button onClick={() => setOpen(true)} disabled>
    Open
  </Button>
);
```

TypeScript-only syntax isn't supported. `function f(x: number) {}` fails with _Unexpected token, expected ","_ at the type annotation. Format TypeScript in your editor or with the Prettier CLI.

## Formatting minified code is not deobfuscation

Paste a minified bundle and you'll get readable _layout_, but names like `t`, `e` and `n` stay exactly as they are, because Prettier never renames anything. That's often enough to follow control flow during a production incident. To get the original names back, you need source maps, not a formatter.

## Using the formatter

1. Open the [JavaScript Formatter](/online-tool/developer-tools/javascript-formatter) and paste your code into **JavaScript input**, or click **Load sample**.
2. Choose **Indent** and **Quotes**.
3. Click **Format JavaScript** (or press Ctrl/⌘ + Enter). If you change an option after formatting, the output updates right away.
4. Copy the result or download `output.js`.

Prettier runs in your browser and is only loaded when you use the tool, so proprietary code never leaves your machine. To go the other way and shrink code for production, use the [JavaScript Minifier](/online-tool/developer-tools/javascript-minifier).

## FAQ

### Can I set my own Prettier options, like trailing commas or print width?

Not here. The tool exposes indentation and quote style, and uses a print width of 80 with Prettier's defaults for everything else. For a project-specific `.prettierrc`, run Prettier in your editor or CI so the whole team gets the same result.

### Why did Prettier keep some double quotes when I chose single quotes?

If a string contains more single quotes than double quotes, such as `"it's"`, Prettier keeps the quote style that needs fewer escapes. The output is easier to read than `'it\'s'`.

### Will formatted code behave differently?

No. Prettier only changes layout. If the formatted code behaves differently from what you expected, as in the semicolon example above, it already behaved that way before formatting.

See how the parser reads your code with the [JavaScript Formatter](/online-tool/developer-tools/javascript-formatter).
