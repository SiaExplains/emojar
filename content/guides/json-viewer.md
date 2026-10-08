---
slug: find-the-path-to-any-value-in-a-json-document
tool: json-viewer
title: How to Find the Path to Any Value in a Big JSON Document
description: Explore JSON as a tree, search keys and values, and copy paths like users[0].profile.name or $.meta['next page'] for code, tests and JSONPath.
tags: [JSON, JSONPath, Developer Tools]
---

To find the path to a value in JSON, open the document as a tree, click the value, and read the chain of keys and array indexes that leads to it from the root. In JavaScript notation that looks like `users[0].profile.name`. Array positions go in square brackets, simple keys follow a dot, and keys with spaces or symbols go in quoted brackets. JSONPath writes the same path with a leading `$`.

The [JSON viewer](/online-tool/developer-tools/json-viewer) builds those paths for you. Here's how JSON paths are put together and how to use the tree to find things fast in a large file.

## Why view JSON as a tree?

JSON (standardized as ECMA-404 and RFC 8259) has only six kinds of value: objects, arrays, strings, numbers, booleans and `null`. Objects and arrays can nest without limit, which is what makes API responses and config files hard to read as plain text. A thousand-line response may hide the one field you need five levels deep.

A tree shows that structure directly. In the viewer, every row shows its key, a short preview and a type label:

- Objects show their size, like `{3 keys}`.
- Arrays show their length, like `[2 items]`.
- Strings appear in quotes, and numbers, booleans and `null` appear as written. Long strings are cut off after 160 characters in the preview.

Each row also carries a type badge: string, number, boolean, null, object or array.

## How are JSON paths written?

A path is a list of steps from the root, and the viewer writes each step one of three ways:

| Step                          | Written as | Example             |
| ----------------------------- | ---------- | ------------------- |
| Array index                   | `[n]`      | `users[0]`          |
| Key that's a valid identifier | `.key`     | `.profile.name`     |
| Any other key                 | `["key"]`  | `meta["next page"]` |

A valid identifier means letters, digits, `_` and `$`, not starting with a digit. That's the same rule JavaScript uses for dot access, so a copied path works directly after a variable name: `data.users[0].profile.name`. Keys that contain quotes, backslashes or control characters are escaped inside the brackets.

Two options change the format:

- **Start paths with $ (JSONPath)** adds the root symbol, giving `$.users[0].profile.name`. That's the style used by JSONPath libraries (standardized as RFC 9535) and by many API testing tools.
- **Quotes for odd keys** switches between **Double ["key"]** and **Single ['key']**. Some JSONPath tools prefer single quotes.

## Worked example: the sample document

Press **Sample** to load a small document with two users and a `meta` object. The viewer opens the top two levels automatically and reports "Root is an object · 8 visible rows": the root, `users`, its two items, `meta` and the three keys inside `meta`.

**Finding a value.** Open `users`, then `0`, then `profile`, and click `name: "Ada"`. The selected-node panel shows the path `users[0].profile.name`. The three copy buttons give you:

- **Copy value:** `Ada`. Strings are copied without their quotes, and anything else is copied as compact JSON.
- **Copy JSON path:** `users[0].profile.name`, or `$.users[0].profile.name` with the JSONPath option on.
- **Copy subtree:** the selected node as indented JSON. On `profile`, that's the whole object with two-space indentation.

**An awkward key.** Click `next page` inside `meta`. Because of the space, the path is `meta["next page"]`. With the $ option and single quotes, it becomes `$.meta['next page']`.

**Searching.** Type `name` into **Search keys and values**. The status line reads "Match 1 of 4": the `name` key on each user and the `name` key inside each profile, in document order. Search is case-insensitive, so `english` finds both "English" values in the `languages` arrays. It also matches primitive values as text, so searching `null` finds `users[1].email` and `meta["next page"]`. Press **↓ Next** or Enter to go to the next match, and **↑ Prev** or Shift+Enter to go back. The tree opens each match's parents for you.

## How do I move around a big file?

You can paste JSON, open a `.json` file with **Or open a .json file**, or drop one onto that box. The file is read on your device and never uploaded. The viewer then shows its name and size.

- **Expand all** opens every object and array. On huge documents it stops after the first 2,000 containers, opening the top levels first, and shows a notice. Use search or open branches by hand to go deeper.
- **Collapse all** closes everything except the root.
- **Depth** with **Expand to depth** opens exactly 1 to 10 levels.
- Containers with more than 200 children show the first 200 and a "Show 200 more" row, so a 50,000-item array doesn't freeze the page.

Only the rows on screen are actually drawn, which keeps scrolling smooth on files of several megabytes. Large pastes are parsed after a short pause in typing rather than on every keystroke.

The tree works from the keyboard too. ↑ and ↓ move between rows, → expands, ← collapses or jumps to the parent, Enter toggles, and Home and End jump to the first and last row. Double-clicking a row also toggles it.

## What if my JSON is invalid?

The viewer scans the text itself to find the first error and reports its line and column, because browsers word their own parse errors inconsistently. Some real messages:

- `{"a": 1,}` gives "Invalid JSON at line 1, column 9: Trailing comma before '}'".
- `{'a': 1}` gives "Property names must use double quotes" at column 2.
- A missing comma between two properties gives "Expected ',' or '}' after a property value" at the start of the second key.
- `[1, 2` gives "Unexpected end of JSON input".

Comments, single quotes, trailing commas and unquoted keys are all fine in JavaScript but not in JSON. To fix and pretty-print a document, use the [JSON formatter](/online-tool/developer-tools/json-formatter). To compare two versions, the [JSON diff](/online-tool/developer-tools/json-diff) tool highlights what changed.

## FAQ

### Does the copied path work in jq?

Mostly. jq paths look similar but start with a dot instead of `$`, as in `.users[0].profile.name`. Copy the plain path and add a leading dot.

### Can I edit the JSON in the tree?

No. The tree is read-only. Edit the text in the JSON box, and the tree updates after a short pause.

### Is my data sent anywhere?

No. Parsing, searching and copying all run in your browser.

Paste an API response into the [JSON viewer](/online-tool/developer-tools/json-viewer) and click any value to get its path.
