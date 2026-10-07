---
slug: csv-to-json-checklist-types-quotes-and-headers
tool: csv-to-json
title: 'CSV to JSON Checklist: Types, Quotes, Headers and Zeros'
description: 'A pre-flight checklist for converting CSV to JSON without surprises: mixed column types, quoted commas, blank headers, delimiters and leading zeros.'
tags: [CSV, JSON, Data, Checklist]
---

Converting CSV to JSON takes one pass: split the text into rows and fields, use the first row as keys, and turn each later row into an object. The trouble is in the details. CSV has no types, so the converter has to guess what's a number. Quoting rules decide whether a comma separates fields or belongs to the value. And headers can be blank or duplicated. Run through the checklist below before you trust the output.

Every item matches how the [CSV to JSON converter](/online-tool/developer-tools/csv-to-json) behaves, with the actual output it produces.

## The example file

```
sku,zip,price,active,notes
00123,02134,19.90,true,"Red, large"
00124,10001,5,false,"He said ""ok"""
```

With default settings this becomes:

```json
[
  {
    "sku": "00123",
    "zip": "02134",
    "price": 19.9,
    "active": true,
    "notes": "Red, large"
  },
  {
    "sku": "00124",
    "zip": 10001,
    "price": 5,
    "active": false,
    "notes": "He said \"ok\""
  }
]
```

Look closely at `zip`: the first row produced a string and the second a number. That's checklist item 2.

## The checklist

### 1. Is the delimiter right?

Pick it under **Delimiter**: Comma, Semicolon, Tab or Pipe. Files exported from Excel in many European locales use semicolons. Data copied from a spreadsheet and pasted as text is tab-separated. With the wrong delimiter, every row collapses into a single key that contains the whole header line, which is easy to spot.

### 2. Do you want type detection?

**Detect numbers & booleans** is on by default. With it on:

- `true` and `false` become booleans, and `null` becomes `null`.
- Plain decimal numbers become numbers: `5`, `-0.5`, `19.90` (stored as `19.9`) and `1e3` (stored as `1000`).
- Values with a leading zero, like `00123` and `02134`, **stay strings**, because a leading zero almost always means an identifier.
- Anything else stays a string: `+1`, `.5`, `1,000`, `$5`, dates.

The catch is that detection runs per cell, not per column. A ZIP column holds `"02134"` in one row and `10001` in the next, so any code that expects one type will break. Turn detection **off** if a column holds identifiers (ZIP codes, phone numbers, SKUs, account numbers), and every value stays a string:

```json
{ "sku": "00123", "zip": "02134", "price": "19.90", "active": "true" }
```

Then convert the fields you need as numbers in your own code, where you control the rules.

### 3. Are fields with commas, quotes or line breaks quoted?

The parser follows [RFC 4180](https://www.rfc-editor.org/rfc/rfc4180):

- A field containing the delimiter must be wrapped in double quotes: `"Red, large"`.
- A double quote inside a quoted field is written as two: `"He said ""ok"""` → `He said "ok"`.
- Quoted fields can span several lines, which is handy for addresses and notes.
- A quote only opens a quoted field when it's the **first character** of the field. Text like `5" screen` stays as it is.

If a quote is never closed, you get `Invalid CSV: a quoted field is never closed.` Look for a stray `"` near the end of a long field.

### 4. Is the header row clean?

With **First row is a header** on (the default):

- Header names are trimmed, so `name` becomes `name`.
- Blank headers get placeholder names by position: `id,,name` gives keys `id`, `column2`, `name`.
- **Duplicate header names collide.** With two columns called `email`, the later one overwrites the earlier one in each object. Rename them before converting.
- A row with fewer cells than the header fills the gaps with `""`. Extra cells beyond the header are dropped.

### 5. Is there a header at all?

If the first row is data, uncheck **First row is a header**. You then get an array of arrays instead of objects:

```json
[
  ["a", "b"],
  [1, 2]
]
```

That works for matrix-like data or when you'll assign column names yourself.

### 6. Are there blank lines or Windows line endings?

You don't need to clean either. Fully empty lines are skipped, and both `\n` and `\r\n` line endings work. Whitespace _inside_ values is kept as-is, though, so `Ada ` keeps its trailing space.

### 7. Are there very large numbers?

IDs longer than 15–16 digits lose precision once they become JavaScript numbers. If you can't turn detection off for the whole file, quote those IDs in the source, or post-process them.

## Step by step

1. Paste your CSV into **CSV input**, or click **Load sample**.
2. Set **Delimiter**, **First row is a header** and **Detect numbers & booleans**.
3. Check the JSON output, which updates as you type.
4. Copy it or download `output.json`.

Parsing happens in your browser, so customer exports and internal reports never leave your machine. To check the result as JSON, paste it into the [JSON Validator](/online-tool/developer-tools/json-validator), or use [JSON to CSV](/online-tool/developer-tools/json-to-csv) to go back the other way.

## FAQ

### Can I convert an Excel .xlsx file directly?

Not directly. This tool reads CSV text. In Excel or Google Sheets, use **Save as / Download → CSV**, or select the cells and paste them in. Pasted cells arrive tab-separated, so choose **Tab** as the delimiter.

### Why are all my values strings even though detection is on?

Usually it's leading zeros, or formatting the detector doesn't treat as a number: thousands separators, currency symbols, a leading `+`, or spaces around the value (`" 42"`). Clean those in the source, or convert the fields in code.

### Is the output pretty-printed?

Yes, with 2-space indentation. If you need it compact for embedding, run it through the JSON Minifier.

Convert your next export with the [CSV to JSON converter](/online-tool/developer-tools/csv-to-json), and run through the checklist first.
