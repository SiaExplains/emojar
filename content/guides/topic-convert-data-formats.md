---
slug: turn-a-spreadsheet-export-into-config-docs-and-api-samples
title: 'Turn a Spreadsheet Export Into Config, Docs and API Samples'
description: Take one CSV export to JSON, YAML, TOML and XML, infer a JSON Schema, build Markdown and HTML docs tables, and avoid the type traps along the way.
tags: [JSON, Conversion, Developer Tools, How-to]
---

To move a spreadsheet into code and docs, convert it once to JSON, fix the types there, and produce every other format from that clean JSON: YAML or TOML for config, XML for a partner feed, a JSON Schema for the API, and Markdown or HTML tables for the docs. JSON is the hub because that's where you can see and fix types. Every converter below runs in your browser, so unreleased prices stay on your machine.

## The example data

Product keeps the plan list in a spreadsheet. Engineering needs app config, the docs need a pricing table and a reseller wants XML. The export, `plans.csv`, looks like this:

```csv
id,name,price_eur,sku,region,trial_days
1,Starter,9.90,007,NO,14
2,Team,29.00,018,DE,
3,"Business, annual",290,021,US,30
```

It hides four traps: a price with a trailing zero, SKUs with leading zeros, Norway's country code `NO`, and an empty cell.

## Step 1: Look before you convert

Open the file in the [CSV viewer](/online-tool/developer-tools/csv-viewer). It shows each cell exactly as written, so `007` stays `007` where a spreadsheet app might show `7`. The delimiter is detected, including semicolons from European exports, and a notice flags rows whose cell count differs from the header, usually a wrong delimiter or an unclosed quote. The quoted `"Business, annual"` stays one cell, so this table is clean.

## Step 2: Convert to JSON and fix the types

Paste the CSV into [CSV to JSON](/online-tool/developer-tools/csv-to-json) with **First row is a header** and **Detect numbers & booleans** on. The first plan comes out as:

```json
{
  "id": 1,
  "name": "Starter",
  "price_eur": 9.9,
  "sku": "007",
  "region": "NO",
  "trial_days": 14
}
```

Check three things. `9.90` became the number `9.9`, fine for code but not for display. Leading zeros kept `sku` a string. The empty `trial_days` cell for Team became an empty string `""`, not `null`. Decide what "no trial" means; here it becomes `null`.

After editing, paste the result into the [JSON validator](/online-tool/developer-tools/json-validator). A trailing comma after the last key, as in `"trial_days": 14,`, is the classic slip, and the validator reports the line and column of the closing brace right after it.

## Step 3: Write the config files

For a YAML config, wrap the array as `{"plans": [...]}` and use [JSON to YAML](/online-tool/developer-tools/json-to-yaml):

```yaml
plans:
  - id: 1
    name: Starter
    price_eur: 9.9
    sku: "007"
    region: NO
    trial_days: 14
```

The SKU stays quoted because it looks like a number. `region: NO` is left bare, which modern YAML reads as text, but older YAML 1.1 parsers read `NO` as the boolean false. If your app's parser is one of those, quote it as `"NO"`. To check the file after editing, paste it into [YAML to JSON](/online-tool/developer-tools/yaml-to-json), which reports syntax errors and shows the values as JSON again.

For a Python or Rust project, [JSON to TOML](/online-tool/developer-tools/json-to-toml) turns the same object into `[[plans]]` tables. It needs the wrapper too, because a TOML document is always a table and can't start with an array. TOML also has no null, so the Team plan stops the conversion with a message naming `plans[1].trial_days`. Tick **Leave out null values**, which drops the key and lists it, or choose a real value such as `trial_days = 0`.

## Step 4: Produce the API sample and schema

The reseller asked for XML. In [JSON to XML](/online-tool/developer-tools/json-to-xml), paste the plain array, set the root element to `plans` and the array item name to `plan`:

```xml
<plans>
  <plan>
    <id>1</id>
    <name>Starter</name>
    <sku>007</sku>
    <region>NO</region>
    <trial_days>14</trial_days>
  </plan>
</plans>
```

That's the first plan with some fields trimmed. A `null` becomes an empty element, so Team gets `<trial_days/>`.

Next, paste the JSON into the [JSON Schema generator](/online-tool/developer-tools/json-schema-generator). With draft 2020-12 and required keys on, `trial_days` gets the type `["integer", "null"]`, and all six keys are required because every row had them. That's a description of these three rows, not the full contract. It doesn't know that `sku` is always three digits or that `region` is a two-letter code, so add a `pattern` or an `enum` by hand before validating real requests against it.

## Step 5: Build the docs tables

For the pricing page in the docs, paste the original CSV into [CSV to Markdown](/online-tool/developer-tools/csv-to-markdown). It keeps text exactly as typed, so the price shows as `9.90` and the empty cell stays empty:

```markdown
| id  | name             | price_eur | sku | region | trial_days |
| --- | ---------------- | --------- | --- | ------ | ---------- |
| 1   | Starter          | 9.90      | 007 | NO     | 14         |
```

Its alignment applies to all columns. For a field reference with a right-aligned example column, type it into the [Markdown table generator](/online-tool/developer-tools/markdown-table-generator) and set alignment per column. If a cell says `9.90 | 29.00`, it writes the pipe as `\|` so the row doesn't split.

If the docs live in a CMS that wants HTML, [Markdown to HTML](/online-tool/developer-tools/markdown-to-html) turns the table into a `<table>` with `<thead>` and `<tbody>`. Going the other way needs care. When you move an old HTML help page into Markdown with [HTML to Markdown](/online-tool/developer-tools/html-to-markdown), headings, links, lists and code blocks come through cleanly, but a table turns into one cell per line with no pipes. Rebuild tables from the CSV instead of converting them.

## Step 6: Send changes back to the spreadsheet

When engineering adds a plan, [JSON to CSV](/online-tool/developer-tools/json-to-csv) writes the list back for product. Expect `9.9` rather than `9.90`, and an empty cell where the value was `null`. A spreadsheet app may also turn `007` into `7` on opening, so import that column as text.

## Common mistakes

- Converting with type detection on and losing trailing zeros in prices or versions.
- Treating an empty CSV cell as `null`. It arrives as `""`.
- Leaving country codes like `NO` unquoted for an old YAML parser.
- Expecting TOML to hold `null`, or to start with an array.
- Shipping an inferred schema without adding the rules the sample can't show.

## Quick checklist

1. View the CSV and confirm the delimiter and cell counts.
2. Convert to JSON, fix types and empty cells, validate.
3. Generate YAML or TOML from the clean JSON.
4. Produce the XML sample and a schema, then tighten the schema.
5. Build docs tables from the CSV, not from HTML.

Find more converters in [developer tools](/online-tool/developer-tools).
