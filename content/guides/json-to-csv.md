---
slug: turn-json-api-data-into-a-spreadsheet
tool: json-to-csv
title: How to Turn JSON API Data Into a Spreadsheet (CSV)
description: 'Convert an array of JSON objects into a CSV file that opens in Excel or Google Sheets, and see how nested objects, arrays and missing fields are handled.'
tags: [JSON, CSV, Spreadsheets]
---

To get JSON into a spreadsheet, convert it to CSV. Each object in the array becomes a row, and each key becomes a column. Nested objects are flattened into dot-notation columns like `address.city`. Arrays don't fit in a single cell as a table, so they're kept as JSON text in one cell. The resulting `.csv` file opens directly in Excel, Google Sheets or Numbers.

Here's the typical scenario: someone in ops or finance asks for "that data from the API, but in Excel," and you have a JSON response to hand over.

## Step 1: Get the data into array shape

CSV is a table, so the converter expects a **JSON array of objects**:

```json
[
  {
    "id": 1,
    "name": "Ada",
    "address": { "city": "London", "zip": "N1" },
    "tags": ["math", "poet"]
  },
  { "id": 2, "name": "Alan, Jr.", "email": "alan@example.com" }
]
```

API responses often wrap the array, as in `{"data": [...], "page": 1}`. Copy just the array. If you paste a single object instead of an array, it becomes a one-row table. If the array holds plain values like `[1, 2, 3]`, you get a single column named `value`.

## Step 2: Convert it

Paste the array into the [JSON to CSV converter](/online-tool/developer-tools/json-to-csv). The CSV updates as you type:

```
id,name,address.city,address.zip,tags,email
1,Ada,London,N1,"[""math"",""poet""]",
2,"Alan, Jr.",,,,alan@example.com
```

A lot happens in those three lines:

- **Columns come from every row, not just the first.** `email` exists only on the second object, but it still gets a column, added after the columns of the earlier rows. Ada's `email` cell is empty, and so are Alan's address cells.
- **Nested objects are flattened.** `address: {city, zip}` becomes two columns, `address.city` and `address.zip`. Deeper nesting gives longer names like `billing.address.city`.
- **Arrays stay as JSON.** `["math","poet"]` is written into one cell. Since that text contains quotes and commas, the cell is wrapped in double quotes and the inner quotes are doubled (`""`), as the CSV format requires.
- **Values with commas are quoted.** `Alan, Jr.` is wrapped in quotes so the comma isn't read as a column break.
- **`null` becomes an empty cell.** Same as a missing key.

## Step 3: Pick the right delimiter for your spreadsheet

The **Delimiter** menu offers Comma, Semicolon, Tab and Pipe. This matters more than people expect:

| Who opens the file                                                                | Choose        |
| --------------------------------------------------------------------------------- | ------------- |
| Excel or Sheets in the US, UK and most English locales                            | Comma (,)     |
| Excel in Germany, France, Italy, Spain and other locales that use a decimal comma | Semicolon (;) |
| Pasting straight into spreadsheet cells, or values full of commas                 | Tab           |
| A Unix pipeline or a legacy import format                                         | Pipe (\|)     |

If Excel opens your file with everything crammed into column A, the delimiter doesn't match the locale. Convert again with a semicolon.

## Step 4: Download and open

Copy the output, or download it as `output.csv`, and open it in your spreadsheet app. The conversion runs entirely in your browser, which matters when the data contains customer emails or order details you shouldn't paste into a random server.

## Common surprises after opening in Excel

The CSV is correct, but spreadsheet apps guess at types when they open it:

- **Leading zeros vanish.** A `zip` of `"02134"` is written correctly, but Excel shows `2134`. Use **Data → From Text/CSV** and set that column to Text.
- **Long IDs turn into scientific notation.** A 16-digit order ID can show up as `1.23457E+15`, and Excel keeps only 15 significant digits. Import the column as Text.
- **Dates get reinterpreted.** `"03/04/2026"` might become March 4 or April 3 depending on locale.
- **Accented characters look garbled.** If `é` shows as `Ã©`, the app opened the UTF-8 file with the wrong encoding. Use the import dialog and pick UTF-8.

None of these change the file. They happen when the spreadsheet opens it. Google Sheets' **File → Import** generally handles UTF-8 and delimiters better than double-clicking the file.

## When CSV is the wrong target

- **Deeply nested data with arrays of objects.** Line items inside orders, for example: one CSV row per order loses the structure. Either flatten the data into one row per line item before converting, or keep it as JSON.
- **Round trips.** Turning the CSV back into JSON with [CSV to JSON](/online-tool/developer-tools/csv-to-json) won't rebuild the nesting. You'd get flat keys like `"address.city"` and array cells as strings.
- **Data people need to read, not analyze.** Sometimes a pretty-printed file from the [JSON Formatter](/online-tool/developer-tools/json-formatter) is all the requester needs.

## FAQ

### What order are the columns in?

The order keys first appear: all keys of the first object in its own order, then any new keys from later objects as they show up. To control the order, reorder the keys in the first object before converting.

### Can I convert JSON with a top-level object of objects, like `{"u1": {...}, "u2": {...}}`?

It's treated as one object, so you get a single row with columns like `u1.name` and `u2.name`. Convert it to an array first, for example with `Object.values(data)` in a browser console, then paste the result.

### Is there a row limit?

There's no fixed limit. Conversion runs in your browser tab, so very large arrays depend on your device's memory. Tens of thousands of rows are normally fine.

Hand over that spreadsheet in a minute with the [JSON to CSV converter](/online-tool/developer-tools/json-to-csv).
