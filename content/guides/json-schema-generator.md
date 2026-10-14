---
slug: generate-json-schema-from-sample-json
tool: json-schema-generator
title: 'How to Generate a JSON Schema from Sample JSON (and Tighten It)'
description: 'Infer a JSON Schema from a real API response, understand how required keys and mixed types are decided, then turn the draft into a contract you can trust.'
tags: [JSON, JSON Schema, APIs, Validation]
---

The fastest way to get a JSON Schema is to infer it from a real example: walk the document, write down the type of every value, describe each object's keys and each array's items, and mark the keys that always appear as required. The [JSON Schema Generator](/online-tool/developer-tools/json-schema-generator) does that walk for you. What you get back is an accurate description of your sample, which is a strong first draft but not yet a full data contract. This guide shows what the generator decides on its own and what you should add by hand.

## A worked example

Say an endpoint returns a list of users. Two records are enough to show how the inference works:

```json
[
  { "id": 1, "email": "ada@example.com", "joined": "2026-01-05", "score": 9.5 },
  { "id": 2, "email": "linus@example.com", "joined": "2026-02-11", "nickname": null }
]
```

With the default settings (draft 2020-12, required keys on, format detection on) the generator writes:

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "array",
  "items": {
    "type": "object",
    "properties": {
      "id": {
        "type": "integer"
      },
      "email": {
        "type": "string",
        "format": "email"
      },
      "joined": {
        "type": "string",
        "format": "date"
      },
      "score": {
        "type": "number"
      },
      "nickname": {
        "type": "null"
      }
    },
    "required": [
      "id",
      "email",
      "joined"
    ]
  }
}
```

Four decisions in that output are worth a closer look.

## How the generator decides

**Objects in an array are merged.** Both users are combined into a single `items` schema. Every key found in any object becomes a property, in the order it first appears.

**Required means "present in every object".** `id`, `email` and `joined` appear in both records, so they're required. `score` and `nickname` each appear only once, so they stay optional. Untick **Mark keys found in every object as required** if you'd rather leave the `required` list out entirely.

**Integers and decimals are told apart.** `1` and `2` give `"integer"`, while `9.5` gives `"number"`. When an array mixes whole numbers and decimals, the result is `"number"`, which accepts both.

**Formats come from patterns.** With **Detect formats (date-time, email, uri, uuid)** on, strings are checked against five patterns: date-time, date, email, uri and uuid. A format is only added when every sample value for that field matches, so one odd value is enough to drop it. Note that many validators treat `format` as an annotation and don't enforce it unless you switch format checking on.

## What happens with mixed types

Real data is rarely tidy. When the same position holds different kinds of values, the generator keeps all of them:

```json
{ "maybe": [1, null, 2.5], "values": [1, "two", { "n": 3 }] }
```

Here `maybe` gets `"items": { "type": ["number", "null"] }`, a compact type list, because both parts are simple scalars. `values` mixes an integer, a string and an object, and an object can't be squeezed into a type list, so its items become an `anyOf` with three branches: `{"type": "integer"}`, `{"type": "string"}` and an object schema with a required `n`.

Two edge cases to watch for. A key that's `null` in the only object that has it, like `nickname` above, becomes `{"type": "null"}`, which would reject a real nickname later. And an empty array gives `"items": {}`, which allows anything, because there's nothing to learn from.

## Forbid extra keys, or keep the schema open

Tick **No extra keys (additionalProperties: false)** and every object schema, nested ones included, gets `"additionalProperties": false`:

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "name": {
      "type": "string"
    },
    "tags": {
      "type": "array",
      "items": {
        "type": "string"
      }
    }
  },
  "required": [
    "name",
    "tags"
  ],
  "additionalProperties": false
}
```

That's the output for `{"name":"Ada","tags":["x"]}` with **Draft-07** selected. A closed schema is great for catching typos in config files. For API responses it can backfire, because a provider adding a new field would suddenly make valid responses fail. Leave the option off unless you control both sides.

## Which draft should you pick?

The **JSON Schema version** menu offers Draft 2020-12 (the default), Draft 2019-09 and Draft-07. For the schemas this tool writes, only the `$schema` URI changes, since it doesn't use any keyword that differs between drafts. Pick draft-07 when an older validator or an OpenAPI 3.0 document needs it; otherwise stay on 2020-12.

## Turning the draft into a contract

An inferred schema can only describe what the sample shows. Before you rely on it, go through it by hand:

1. **Feed it a richer sample.** Paste several records, including ones with optional fields filled in, so that more keys get the right type.
2. **Fix accidental `null` types.** Change `{"type": "null"}` to something like `{"type": ["string", "null"]}`.
3. **Add the rules the data can't show:** `enum` for status fields, `minimum`/`maximum` for numbers, `maxLength` for strings, `minItems` for arrays that must not be empty.
4. **Review `required`.** A key that happened to be in every sample record might still be optional in the real API.
5. **Add a `title` and `description`** to each property, so the schema doubles as documentation.

If the input isn't valid JSON, the generator shows the parser's error instead of a schema. Clean it up first in the [JSON Formatter](/online-tool/developer-tools/json-formatter), or use the [JSON Validator](/online-tool/developer-tools/json-validator) to locate the problem as you type. If what you really want is types for your code rather than runtime validation, [JSON to TypeScript](/online-tool/developer-tools/json-to-typescript) produces interfaces from the same sample.

## FAQ

### Is my sample sent anywhere?

No. Parsing and inference both run in your browser tab, so you can paste responses that contain real customer data.

### Can I give the schema a title?

The tool doesn't set one. Add a `"title"` key next to `$schema` after you copy or download `schema.json`.

### Why is a field typed as an `anyOf` when I expected one type?

Some sample values for that field had different shapes, such as an object in one record and a string in another. If that's a data bug, fix the sample. If it's real, keep the `anyOf`.

Paste a real payload into the [JSON Schema Generator](/online-tool/developer-tools/json-schema-generator) and start from an accurate draft instead of a blank file.
