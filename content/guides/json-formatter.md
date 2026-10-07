---
slug: pretty-print-json-api-responses-and-compare-them
tool: json-formatter
title: How to Pretty-Print JSON API Responses and Compare Them
description: 'Turn a one-line API response into readable, indented JSON, then sort keys so two payloads diff cleanly. A practical walkthrough with examples.'
tags: [JSON, APIs, Debugging]
---

To pretty-print JSON, parse it and print it back out with indentation: every object and array gets its own block, and every key-value pair its own line. A JSON formatter does exactly that. If you also sort the keys alphabetically, two responses that hold the same data in a different key order will line up line for line, so a diff shows only the real changes.

This guide follows a common debugging session: an API call works in staging but fails in production, and all you have is two one-line responses.

## Why are API responses minified in the first place?

Servers usually send JSON with no whitespace because humans aren't the main readers. `JSON.stringify(value)` in JavaScript, `json.dumps(value)` in Python with compact separators, and most framework serializers all produce one long line by default. That's ideal on the wire and painful in a terminal or a log viewer:

```json
{
  "order": {
    "id": "ord_981",
    "status": "failed",
    "items": [{ "sku": "A-12", "qty": 2 }],
    "error": { "code": "card_declined", "retryable": false }
  },
  "meta": { "region": "eu-west-1", "version": 3 }
}
```

Somewhere in there is the reason the order failed, but you can't see the structure at a glance.

## Step 1: Format the response

Open the [JSON Formatter](/online-tool/developer-tools/json-formatter), paste the response into the **JSON input** box and click **Format JSON** (or press Ctrl/⌘ + Enter). With the default **Indent** of 2 spaces you get:

```json
{
  "order": {
    "id": "ord_981",
    "status": "failed",
    "items": [
      {
        "sku": "A-12",
        "qty": 2
      }
    ],
    "error": {
      "code": "card_declined",
      "retryable": false
    }
  },
  "meta": {
    "region": "eu-west-1",
    "version": 3
  }
}
```

Now the `error` object stands out, and you can see it's nested inside `order`, not at the top level. That detail matters when you write the code that reads it.

The **Indent** menu offers 2 spaces, 4 spaces or Tab. Pick whatever matches the file you'll paste the result into. The output is a standard `JSON.stringify(value, null, indent)` result, so it looks the same as what your own code would print.

## Step 2: Sort keys before you compare

Now take the staging response for the same request. Say its serializer emits keys in a different order:

```json
{
  "meta": { "version": 3, "region": "eu-west-1" },
  "order": {
    "status": "ok",
    "id": "ord_981",
    "items": [{ "qty": 2, "sku": "A-12" }]
  }
}
```

Format both responses as they are and a line-by-line diff will flag almost every line, even though most of the data matches. Tick **Sort keys A–Z** and format both again. Sorting is recursive: it reaches every nested object, including objects inside arrays. Both documents now share the same skeleton, and a diff shows only what really differs: `status` is `"ok"` instead of `"failed"`, and the `error` block is missing.

Array order is never touched. `[3, 1]` stays `[3, 1]`, because in JSON the order of array elements carries meaning, while the order of object keys does not. Here's a small sorted example:

```json
{ "b": 1, "a": { "d": [3, 1], "c": 2 } }
```

becomes

```json
{
  "a": {
    "c": 2,
    "d": [3, 1]
  },
  "b": 1
}
```

To see the differences highlighted, paste the two formatted outputs into the [Text Diff](/online-tool/text-tools/text-diff) tool.

## What if the formatter shows an error instead?

The formatter has to parse the input before it can print it, so anything that isn't valid JSON is rejected with a message and a position, for example `Invalid JSON: Expected double-quoted property name (line 1, column 8).` The exact wording comes from your browser's JSON parser, so it varies a little between Chrome, Firefox and Safari. When you copy JSON out of logs, these are the usual culprits:

- **Truncated payloads.** Log lines are often cut off at a fixed length, so the closing braces are missing.
- **Escaped JSON inside a string.** A log entry like `"body":"{\"id\":1}"` holds JSON as a string. Format the outer document first, then copy the inner string out, remove the escaping and format that too.
- **Python or JavaScript literals.** `None`, `True`, single quotes and trailing commas aren't JSON.

To fix syntax errors as you type, the [JSON Validator](/online-tool/developer-tools/json-validator) is a better fit, because it re-checks on every keystroke.

## Things formatting will not change (and a few it will)

Formatting is a parse-and-print round trip, so most of your data stays exactly as it was:

- Keys, string values, booleans and `null` come out unchanged.
- Arrays keep their order.
- Unicode escapes such as `é` are printed as the actual character (`é`). The data is the same, but the text looks different.
- Numbers are printed the way JavaScript prints them, so `1.50` becomes `1.5` and `1E3` becomes `1000`. Integers larger than 2^53 (about 9 quadrillion) lose precision, because JavaScript stores every number as a 64-bit float. If your API returns 64-bit IDs as bare numbers, format a copy and keep the original response as the source of truth.
- If a key appears twice in the same object, only the last value survives.

For long results, download them as a `.json` file instead of copying. Everything happens in your browser through the native `JSON.parse`, so it's safe to paste responses that contain customer records or internal IDs. Nothing is uploaded.

## FAQ

### Can I format JSON Lines (one JSON object per line)?

Not in one go. JSON Lines isn't a single JSON document, so the parser stops at the end of the first object with an "unexpected non-whitespace character" error. Format one line at a time, or wrap the lines in `[` `]` and separate them with commas to make an array.

### Does sorting keys affect how my app reads the JSON?

For any compliant parser, no, because object key order carries no meaning in JSON. The exception is code that relies on insertion order, such as a UI that renders fields in the order they arrive. In that case, use sorted output for comparing and the original for everything else.

Paste your next API response into the [JSON Formatter](/online-tool/developer-tools/json-formatter) and read it in seconds.
