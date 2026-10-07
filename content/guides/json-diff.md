---
slug: how-a-structural-json-diff-works
tool: json-diff
title: How a Structural JSON Diff Works, and Why Line Diffs Mislead
description: Reordered keys and reformatting make line diffs useless for JSON. Learn how a structural diff compares values by path, and how arrays trip it up.
tags: [JSON, Debugging, Explainer]
---

A structural JSON diff parses both documents into data first and then compares values, not lines of text. That means key order, indentation and line breaks stop mattering, and every real difference comes back as a path such as `$.address.city` with its old and new value. If two API responses or config files "look" different but you only care whether the data changed, this is the comparison you want.

## Why does a line-by-line diff fail on JSON?

A classic text diff works on lines. JSON, though, doesn't care about lines at all: `{"a":1,"b":2}` on one line and the same object spread over four lines with the keys swapped are the same data. Serializers reorder keys, pretty-printers change indentation, and one tool emits `1.0` where another writes `1`. A line diff flags all of that, and the one value that actually changed gets buried in noise.

A structural diff skips the text problem entirely. Once both sides are parsed, `1` and `1.0` are the same number, `{"b":2,"a":1}` equals `{"a":1,"b":2}`, and whitespace never existed.

## How does the comparison actually work?

The [JSON Diff](/online-tool/developer-tools/json-diff) tool walks both documents at the same time, starting from the root, which it calls `$`:

1. **Two objects:** every key that exists only on the left is reported as *Removed*, every key only on the right as *Added*, and keys present on both sides are compared recursively.
2. **Two arrays:** by default, items are compared position by position. Index 0 against index 0, index 1 against index 1, and so on. Extra items at the end are Added or Removed.
3. **Anything else:** if the two values aren't equal, the path is reported as *Changed* with the old and new value. That includes type changes, so the number `42` becoming the string `"42"` is a change, and so is an object turning into an array.

Paths use a JSONPath-style notation. `.name` is a key, `[2]` is an array index, and keys that aren't plain identifiers are quoted in brackets, so a key called `e-mail` inside `user` shows up as `$.user["e-mail"]`.

## A worked example

Here is an original record and an updated one:

```json
{"id": 42, "name": "Ada", "price": 1.0, "tags": ["red", "green", "blue"],
 "address": {"city": "Paris", "zip": "75001"}, "active": true}
```

```json
{"active": true, "name": "Ada Lovelace", "price": 1,
 "tags": ["green", "red", "blue", "new"],
 "address": {"city": "Lyon"}, "id": "42", "nick": null}
```

The tool reports **8 differences: 2 added, 1 removed, 5 changed**. Copy report gives you this:

```text
~ $.name: "Ada" → "Ada Lovelace"
~ $.tags[0]: "red" → "green"
~ $.tags[1]: "green" → "red"
+ $.tags[3]: "new"
- $.address.zip: "75001"
~ $.address.city: "Paris" → "Lyon"
~ $.id: 42 → "42"
+ $.nick: null
```

Notice what's missing: `active` moved from last to first and `price` went from `1.0` to `1`, and neither shows up. Also notice the `$.id` line. The ID silently became a string, exactly the kind of bug that breaks a strict `===` check in production and that a line diff would hide among the reordered keys.

## Why do arrays cause so many "changes"?

Look at `tags` above. Only one tag was added, yet positional comparison reports three entries, because swapping `red` and `green` shifts both of them. Inserting one item at the start of a long array is worse: every later item moves one slot, so `["x","y","z"]` versus `["w","x","y","z"]` produces three Changed entries plus one Added.

Tick **Ignore the order of items in arrays** and the tool matches items by value instead. The same example drops to 6 differences, and `tags` is reduced to a single `+ $.tags[3]: "new"`. Use this for sets such as tags, role names or lists of IDs.

There's a trade-off. In this mode an item either has an identical twin on the other side or it doesn't. Change one field inside an array of objects, say `{"id":2,"qty":5}` becoming `{"id":2,"qty":6}`, and you get a Removed plus an Added for the whole object, not a precise `$.items[1].qty: 5 → 6`. With order respected, you get the precise line. Duplicates count too: `["a","a","b"]` against `["a","b"]` reports one removed `"a"`.

| Situation | Leave order on | Ignore order |
| --- | --- | --- |
| Ordered steps, rankings, coordinates | Yes | No |
| Tags, permissions, sets of IDs | Noisy | Yes |
| Arrays of records you edited in place | Yes, precise field paths | Whole items removed and added |

## How do you compare two files with the tool?

1. Open the tool and paste the old version into **Original JSON** and the new one into **Changed JSON**. **Load sample** fills both with a demo pair.
2. The differences appear as you type. Green rows are Added, red are Removed, amber are Changed. If either side fails to parse, you'll see an error naming which box is broken.
3. Use **⇄ Swap** to flip the direction, so additions become removals.
4. Decide whether array order matters, then click **Copy report** to paste the `+`, `-` and `~` lines into a ticket or pull request.

The list on screen shows the first 1,000 differences, but the copied report includes all of them. Parsing and comparing happen in your browser, so internal payloads aren't uploaded anywhere.

## When is a structural diff the wrong tool?

When formatting itself is the point. If you're reviewing a hand-edited config where comment placement or key order matters to humans, a line-based [Text Diff](/online-tool/text-tools/text-diff) shows what a reviewer will see. And if one side isn't valid JSON yet, fix it first with the [JSON Validator](/online-tool/developer-tools/json-validator).

## FAQ

### Is a missing key the same as a key set to null?

No. `{"a": null}` versus `{}` is reported as `$.a` removed with the value `null`. Many APIs treat "absent" and "null" differently, so the diff keeps them apart.

### Can I compare two YAML files this way?

Convert both to JSON first, then compare. Key order and indentation differences disappear the same way.

### Why do I see nothing when only one box is filled?

The comparison runs only when both sides contain JSON that parses. Fill in both boxes and the results appear.

Paste your two versions into the [JSON Diff](/online-tool/developer-tools/json-diff) tool and see exactly what changed.
