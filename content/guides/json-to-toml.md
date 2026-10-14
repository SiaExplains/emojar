---
slug: convert-json-config-to-toml-tables-and-nulls
tool: json-to-toml
title: 'Convert JSON to TOML: Tables, Arrays of Tables and Null Values'
description: 'Move a JSON config to pyproject.toml, Cargo.toml or Hugo: how objects become tables, why null is refused and what happens to numbers like 1.0.'
tags: [TOML, JSON, Configuration]
---

Converting JSON to TOML means mapping the JSON object onto TOML's key/value lines: simple values become `key = value`, nested objects become `[table]` sections, and arrays of objects become repeated `[[array]]` sections. Most config-shaped JSON converts cleanly. Two things don't: the top level must be an object, and TOML has no `null`. The [JSON to TOML Converter](/online-tool/developer-tools/json-to-toml) handles the mapping and stops with a clear message instead of guessing when your data hits one of those gaps.

## A config file, converted

Here's a JSON version of the kind of settings you'd find in a Python project:

```json
{
  "project": { "name": "demo-app", "version": "1.0.0", "requires-python": ">=3.11" },
  "tool": { "ruff": { "line-length": 100, "select": ["E", "F"] } },
  "ratio": 1.0,
  "authors": [ { "name": "Ada" }, { "name": "Linus", "email": "linus@example.com" } ]
}
```

The converter produces:

```toml
ratio = 1

[project]
name = "demo-app"
version = "1.0.0"
requires-python = ">=3.11"

[tool.ruff]
line-length = 100
select = ["E", "F"]

[[authors]]
name = "Ada"

[[authors]]
name = "Linus"
email = "linus@example.com"
```

It also shows a note under the output: numbers written like `1.0` are whole numbers to JSON, so they appear as integers. More on that below.

## How the mapping works

**Plain values come first.** Within each table, strings, numbers, booleans and arrays of plain values are written before any sub-tables. That's why `ratio` jumped to the top. TOML requires it: once a `[table]` header appears, every following `key = value` line belongs to that table, so a top-level key written after `[project]` would silently end up inside it.

**Nested objects become dotted headers.** `tool.ruff` becomes `[tool.ruff]`. Note that there's no separate `[tool]` header: when a table holds nothing but other tables, the converter skips its header, because the dotted path already creates it. An empty object, on the other hand, gets a bare header such as `[empty]`, so the key isn't lost.

**Arrays of objects become arrays of tables.** Each object in `authors` gets its own `[[authors]]` block, and the objects don't need the same keys. If an array mixes objects with other values, as in `[{"a": 1}, 2]`, it can't be an array of tables, so it's written inline: `mixed = [{ a = 1 }, 2]`.

**Keys are quoted only when needed.** Bare TOML keys can contain letters, digits, `_` and `-`, so `requires-python` and `line-length` stay bare. A key with a space, a dot or any other character is quoted: `"my key" = "x"`.

**Strings are escaped.** Quotes, backslashes, tabs, newlines and other control characters are written as TOML escape sequences inside double-quoted strings.

## Why does it refuse null?

TOML has no null or "empty" value, and simply dropping the key could change what your program does: a missing `timeout` often means "use the default", which isn't the same as "no timeout". So by default the converter stops and lists every null with its path:

```
TOML has no null value, so 2 values can’t be converted: a, b[1]. Remove them, replace them, or choose “Leave out null values”.
```

That's the error for `{"a":null,"b":[1,null]}`. You have two options:

1. **Replace the nulls** in the JSON with real values: an empty string, `0`, `false` or a sensible default.
2. **Tick "Leave out null values (TOML has no null) and list them".** Keys whose value is `null` are skipped, and a notice under the output names each one, so you can check that the omission is safe.

The option has one hard limit. A `null` inside an array can't be left out, because removing it would shift the position of every item after it. For the example above, ticking the box still gives:

```
Null inside an array can’t be left out without shifting the positions of the other items: b[1]. Replace these values first.
```

Fix those by hand. Nulls in objects are omitted cleanly: `{"a":null,"b":1,"my key":"x"}` becomes `b = 1` and `"my key" = "x"`, with `a` listed as left out.

## Why the top level must be an object

A TOML document is itself a table of key/value pairs, so there's no way to write a bare list. If your JSON starts with `[`, the converter tells you to wrap it, for example `{"items": [...]}`. Arrays of objects then become `[[items]]` blocks.

## Numbers and dates

Once JSON is parsed, `1.0` and `1` are the same number, so the converter writes `1`, an integer. For most settings that doesn't matter. Some strict TOML readers do distinguish integers from floats, though, so if a setting must be a float, edit it back to `1.0` after copying. Decimals like `0.5` and very large numbers keep a float form.

JSON has no date type either, so date-like strings such as `"2026-10-14"` stay quoted strings. If your program expects a native TOML date, remove the quotes yourself.

## Before you convert

The converter needs valid JSON. If it reports a syntax error, fix it in the [JSON Validator](/online-tool/developer-tools/json-validator), or tidy the file first with the [JSON Formatter](/online-tool/developer-tools/json-formatter). If your target tool reads YAML instead, [JSON to YAML](/online-tool/developer-tools/json-to-yaml) covers that format.

This tool supports a deliberate subset of TOML 1.0: strings, numbers, booleans, arrays, nested objects and arrays of tables. It doesn't produce native dates, multi-line strings or comments. The output is still valid TOML, just plain in style.

## FAQ

### Is the key order kept?

Yes, within each group. Plain values keep their JSON order, then tables follow in their JSON order.

### Can I convert TOML back to JSON here?

No, this tool only goes from JSON to TOML. Keep the original JSON if you'll need it again.

Paste your config into the [JSON to TOML Converter](/online-tool/developer-tools/json-to-toml), read the notes under the output, and download `config.toml`.
