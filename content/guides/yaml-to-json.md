---
slug: yaml-to-json-errors-indentation-anchors-and-types
tool: yaml-to-json
title: 'YAML to JSON: Fixing Indentation Errors and Type Surprises'
description: "Why YAML fails to parse, and why it sometimes parses into values you didn't expect. Indentation, tabs, anchors, versions like 1.10, explained with examples."
tags: [YAML, JSON, Troubleshooting]
---

Converting YAML to JSON is the quickest way to see what a YAML file actually _means_. JSON has no indentation rules, no implicit types and no aliases, so the output shows every value exactly as a program will receive it. If the YAML is broken, the converter tells you where. If it parses but behaves strangely, the JSON shows you why.

This guide covers both cases: errors that stop parsing, and valid YAML that doesn't mean what you thought.

## Part 1: Why won't my YAML parse?

Paste the YAML into the [YAML to JSON converter](/online-tool/developer-tools/yaml-to-json) and the JSON appears as you type. When parsing fails, you get an `Invalid YAML:` message with a line and column. These are the ones you'll see most often.

### Inconsistent indentation

```yaml
server:
  host: localhost
 port: 8080
```

> Invalid YAML: All mapping items must start at the same column at line 3, column 1

YAML uses indentation to define structure, so every key in a mapping must start in the same column. Here `port` sits one space left of `host`. Line 3 is reported because that's where the column changed.

### Tabs used for indentation

```yaml
server:
	host: localhost
```

> Invalid YAML: Tabs are not allowed as indentation at line 2, column 1

The YAML spec forbids tabs for indentation. Editors that insert tabs automatically are the usual cause. Switch your editor to spaces for `.yml` files.

### A colon inside an unquoted value

```yaml
title: Note: read this
```

> Invalid YAML: Nested mappings are not allowed in compact mappings

A colon followed by a space starts a new mapping. Quote the value: `title: "Note: read this"`.

### Unclosed quotes and duplicate keys

A string opened with `"` and never closed gives a _Missing closing "quote_ error. YAML also rejects duplicate keys (_Map keys must be unique_), which many JSON parsers quietly accept. That's a useful check when two people have edited the same config.

### Several documents in one file

Files that contain several resources, such as a Kubernetes bundle, separate them with `---`. This tool converts **one** document at a time, and input with more than one document is reported as an error. Paste each document separately. A single leading `---` is fine.

## Part 2: It parsed, but the values are wrong

These are harder to catch, because nothing fails. The JSON output makes them obvious.

### Versions and numbers

```yaml
version: 1.10
port: 08080
```

becomes

```json
{
  "version": 1.1,
  "port": 8080
}
```

`1.10` is a float, so it's stored as `1.1`. Your "version 1.10" is now "version 1.1". Leading zeros are dropped too. If a value is an identifier rather than a quantity (versions, postcodes, account codes), quote it: `version: "1.10"`.

### Booleans, null and empty values

The converter follows YAML 1.2. Only `true` and `false` become booleans, so `yes`, `no`, `on` and `off` stay strings. That's safer, but it may not match the tool that will actually read your file: parsers that follow YAML 1.1, like PyYAML, read `no` as `false`. Also, `key: ~`, `key: null` and a key with no value (`key:`) all become `null`, not an empty string.

### Anchors and aliases

Anchors (`&name`) and aliases (`*name`) are resolved into full copies:

```yaml
defaults: &d
  retries: 3
  timeout: 30
prod:
  settings: *d
```

```json
{
  "defaults": { "retries": 3, "timeout": 30 },
  "prod": { "settings": { "retries": 3, "timeout": 30 } }
}
```

There's one exception: the `<<:` **merge key**, common in Docker Compose and GitLab CI files, is not expanded. YAML 1.2 dropped it from the core spec, so `<<: *d` shows up in the JSON as a literal key named `"<<"` that contains the anchored object. If you rely on merges, confirm the behavior in the tool that consumes the file.

### Multi-line strings

`|` keeps line breaks, and `>` folds them into spaces. Both add a final newline unless you use the `-` chomping indicator:

```yaml
folded: >
  one
  two
literal: |-
  x
  y
```

```json
{ "folded": "one two\n", "literal": "x\ny" }
```

That trailing `\n` often explains "why does my string comparison fail?"

## How to use the converter

1. Paste YAML into **YAML input**, or click **Load sample**.
2. Choose the **Indent** for the JSON: 2 spaces, 4 spaces or Tab.
3. Read the **JSON output**, or the error message, as you type.
4. Copy the JSON or download it as `output.json`.

Parsing runs in your browser using the `yaml` library, so configs that contain hostnames or credentials stay on your machine. Once you have JSON, the [JSON Validator](/online-tool/developer-tools/json-validator) and [JSON Formatter](/online-tool/developer-tools/json-formatter) work on it like on any other JSON.

## FAQ

### Are YAML comments kept in the JSON?

No. JSON has no comment syntax, so comments are dropped. Keep the YAML as your source file and treat the JSON as derived output.

### Why does `time: 12:30` come out as a string?

Under YAML 1.2, `12:30` isn't a number, so it stays the string `"12:30"`. Some YAML 1.1 parsers read it as base-60 and produce `750`. Quote times if the file might be read by older tooling.

### Can I go back from JSON to YAML?

Yes, with [JSON to YAML](/online-tool/developer-tools/json-to-yaml). Expect anchors, comments and block-string styles to be gone, since JSON can't represent them.

Paste a stubborn config into the [YAML to JSON converter](/online-tool/developer-tools/yaml-to-json) and see exactly what it means.
