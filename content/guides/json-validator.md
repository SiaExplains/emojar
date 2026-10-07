---
slug: common-json-syntax-errors-and-how-to-fix-them
tool: json-validator
title: 9 Common JSON Syntax Errors and How to Fix Each One
description: Trailing commas, single quotes, comments, NaN, leading zeros. See the error message each mistake produces and the one-line fix for it.
tags: [JSON, Troubleshooting, Validation]
---

Most invalid JSON comes down to a short list of mistakes: a trailing comma, single quotes, unquoted keys, comments, or a value JSON doesn't support, like `NaN`. A validator parses your text with a strict JSON parser and reports the first spot where it breaks, as a line and column. Fix that spot, validate again, and repeat until it passes.

JSON is stricter than the JavaScript or Python you probably write every day. The grammar in [RFC 8259](https://www.rfc-editor.org/rfc/rfc8259) is small, and anything outside it is rejected, even when it looks harmless. Below are the errors you'll actually hit, with the messages a Chromium-based browser shows. Firefox and Safari word these differently, but the position is reported the same way.

## How do you read a JSON error message?

Paste JSON into the [JSON Validator](/online-tool/developer-tools/json-validator) and it checks the text as you type. Valid input shows a green confirmation that also describes the top-level value, such as `✓ Valid JSON — the document is an object with 4 key(s).` Invalid input shows something like:

```
Invalid JSON: Expected double-quoted property name (line 1, column 8).
```

The position marks where the parser **gave up**, which is not always where the mistake is. A missing comma is reported at the start of the _next_ value, and an unclosed string is reported at the end of the document. If the flagged spot looks fine, look one token earlier.

## The nine errors, with fixes

### 1. Trailing comma

```json
{ "name": "Emojar", "valid": true }
```

Message: _Expected double-quoted property name_. After a comma the parser expects another key, so it complains when it finds `}`. **Fix:** delete the last comma. This is the most common error, because JavaScript, TypeScript and Python all allow trailing commas.

### 2. Single quotes

```json
{ "name": "Ada" }
```

Message: _Expected property name or '}'_. JSON strings and keys must use double quotes. **Fix:** replace `'` with `"`. Be careful with apostrophes inside values, like `"Ada's"`. Those are fine inside a double-quoted string.

### 3. Unquoted keys

```json
{ "name": "Ada" }
```

Same message as above. JavaScript object literals allow bare keys, JSON doesn't. **Fix:** put every key in double quotes.

### 4. Comments

```json
{
  "port": 8080 // default
}
```

Message: _Expected ',' or '}' after property value_. JSON has no comment syntax. **Fix:** remove the comment, or move it into the data as a field like `"_comment": "default"`. Files such as `tsconfig.json` accept comments because their tools use a looser parser (JSONC). Standard JSON parsers don't.

### 5. Missing comma between members

```json
{"a": 1
 "b": 2}
```

Message: _Expected ',' or '}' after property value (line 2, column 2)_. The position points at `"b"`, the line _after_ the mistake. **Fix:** add the comma at the end of line 1.

### 6. Leading zeros

```json
{ "zip": 02134 }
```

Message: _Unexpected number_. JSON numbers can't start with `0` unless the number is exactly `0` or a decimal like `0.5`. **Fix:** if the leading zero matters (postcodes, product codes), make it a string: `"02134"`.

### 7. NaN, Infinity and undefined

```json
{ "ratio": NaN }
```

Message: _Unexpected token 'N'_. JSON only allows finite numbers, strings, `true`, `false`, `null`, arrays and objects. **Fix:** use `null`, or a string if you need to keep the meaning. Note that `JSON.stringify` in JavaScript quietly turns `NaN` into `null`, while some other languages' serializers write `NaN` anyway.

### 8. Raw line breaks or tabs inside strings

```
{"note": "line one
line two"}
```

Message: _Bad control character in string literal_. Control characters must be escaped. **Fix:** write `\n` for a newline and `\t` for a tab inside the string.

### 9. Two documents back to back

```json
{"a":1}{"b":2}
```

Message: _Unexpected non-whitespace character after JSON_. This happens when you paste several log lines or a JSON Lines file at once. **Fix:** validate one document at a time, or wrap them in an array: `[{"a":1},{"b":2}]`.

## A quick workflow for fixing broken JSON

1. Paste the text into the input. It's checked on every keystroke, so there's no button to press.
2. Jump to the line and column in the message. If nothing looks wrong there, check the character just before it.
3. Fix that one error. The status updates right away and either turns green or moves on to the next error.
4. Repeat until you see the green check, then copy the JSON back.

Click **Load sample** to see a document with a deliberate trailing comma and practice on it.

## What does the validator not check?

It answers one question: _is this text syntactically valid JSON?_ It doesn't check:

- **Schema.** Whether `age` is a number, or whether required fields are present, is a JSON Schema question, and this tool doesn't do schema validation.
- **Duplicate keys.** `{"a":1,"a":2}` is accepted, as it is by most parsers, and the last value wins. RFC 8259 only says names _should_ be unique.
- **Number precision.** `12345678901234567890` is valid JSON, but JavaScript can't hold it exactly. Send large IDs as strings.

Once your JSON is valid, the [JSON Formatter](/online-tool/developer-tools/json-formatter) will indent it for reading. If you're looking at a YAML config instead, [YAML to JSON](/online-tool/developer-tools/yaml-to-json) reports YAML syntax errors the same way.

## FAQ

### Why does my JSON work in JavaScript but fail here?

A JavaScript object literal isn't JSON. JS accepts single quotes, bare keys, trailing commas, comments and `undefined`, and JSON accepts none of them. If you copied an object out of source code, check those five things first.

### Is an empty object or a bare value valid JSON?

Yes. `{}`, `[]`, `"hello"`, `42` and `null` are all complete JSON documents under RFC 8259. The validator will report, for example, that the document is `a number`. An empty input, though, isn't JSON at all.

### Does pasting sensitive data into the validator expose it?

No. Validation uses your browser's built-in `JSON.parse`, and the text stays on your device.

Find and fix your next syntax error with the [JSON Validator](/online-tool/developer-tools/json-validator).
