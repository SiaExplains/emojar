---
slug: open-sort-and-filter-csv-files-without-excel
tool: csv-viewer
title: 'How to Open, Sort and Filter a CSV File Without Excel'
description: 'View a CSV export as a table in your browser: see every cell exactly as written, sort and filter columns, and save the filtered rows as a new CSV.'
tags: [CSV, Data, Spreadsheets]
---

To look inside a CSV file without a spreadsheet changing it, open it in a viewer that shows the text of every cell as written. Drop the file on the [CSV Viewer](/online-tool/developer-tools/csv-viewer) and it appears as a table you can sort, search and filter, and you can download the rows you've narrowed down as a new CSV. The file is read in your browser tab and never uploaded, which matters for customer lists, payroll exports and anything else you shouldn't send to a random website.

## Why not just double-click the file?

Spreadsheet apps guess types when they open a CSV, and the guesses rewrite your data on screen: a 16-digit order number turns into `1.23457E+15`, a ZIP code like `02134` loses its leading zero, and `3-4` becomes a date. Save the file, and those changes stick. A viewer that treats every cell as text avoids all of that.

## Opening a file

Drop a `.csv`, `.tsv` or `.txt` file on the box, or choose **…or paste CSV text** and click **Show table**. A few things happen automatically:

- **The delimiter is detected.** The viewer checks the first 20 non-empty lines for commas, semicolons, tabs and pipes, counting only the ones outside quotes, and picks the one that splits the lines most consistently. If it guesses wrong, set **Delimiter** by hand.
- **A UTF-8 byte-order mark is removed**, so the first column heading doesn't start with an invisible character.
- **Quoted fields are respected.** A field in double quotes can contain commas and even line breaks, and `""` inside it stands for one literal quote, following RFC 4180.

The limit is 25 MB, because the whole file is parsed in memory. That's usually a few hundred thousand rows. A bigger file is rejected with a message giving its size, rather than freezing the tab.

If some rows have more or fewer cells than the header, an amber notice says how many. That almost always means the wrong delimiter (European exports often use semicolons) or a quote that's never closed.

## Sorting columns

Click a column heading to sort ascending, click again for descending, and a third time to go back to the file order. The sort is smarter than plain alphabetical order:

- **Numbers sort as numbers**, including thousands separators, so `1,050` lands between `950` and `1200`.
- **Text sorts naturally** and ignores case: `file2` comes before `file10`.
- **Empty cells always go last**, in both directions.
- **Ties keep their file order**, so you can sort by one column without scrambling the rest.

Take this small file:

```
file,size,city
file10,1200,Berlin
file2,950,berlin
file1,,Paris
file3,"1,050",Oslo
```

Sorting by `size` ascending gives `file2` (950), `file3` (1,050), `file10` (1200) and then `file1`, whose size is empty. Descending gives 1200, 1,050, 950, and `file1` still comes last. Sorting by `file` gives `file1`, `file2`, `file3`, `file10`.

The grey `#` column always shows each row's original position.

## Searching and filtering

**Search all columns** keeps only the rows where at least one cell contains your text. Matching ignores case, so `BERLIN` finds both `Berlin` and `berlin`. For one column at a time, click **Filter by column**: a small "contains…" box appears under each heading. All filters apply together, so `city` contains `ber` and `size` contains `9` narrows the table to rows that match both.

**Reset view** clears the search, the filters and the sort in one click.

## Paging through big files

Only the first 200 matching rows are drawn at first, which keeps scrolling smooth. **Show more** loads the next batch. Search, filters and sorting always cover the whole file, not just the rows on screen.

## Downloading what you see

The download button exports the rows that match your current search and filters, in the current sort order. The file is named after the original, for example `orders-filtered.csv`, and keeps the original delimiter. Three details make it safer to open in Excel:

1. It starts with a UTF-8 byte-order mark, so Excel reads accents and non-Latin text correctly.
2. Fields with the delimiter, quotes or line breaks are quoted again.
3. Cells that start with `=`, `+`, `-` or `@` get an apostrophe in front, unless they start with a minus followed by a digit. That blocks formula injection, where a cell like `=HYPERLINK(...)` runs as a formula when the file is opened.

For example:

```
a,b
'=SUM(A1),-5
'+44 20,'@x
"hi, there","""q"""
```

Negative numbers like `-5` stay as they are, but a phone number like `+44 20` gets the apostrophe too.

## What it doesn't do

The viewer is read-only, with no cell editing, charts or totals. It also can't open Excel `.xlsx` files, which use a different, zipped format. In Excel or Google Sheets, export as **CSV (UTF-8)** first.

## Where to go next

To use the data in code, convert it with [CSV to JSON](/online-tool/developer-tools/csv-to-json). To paste a slice into a README or an issue, turn it into a table with [CSV to Markdown](/online-tool/developer-tools/csv-to-markdown). If a column of values has repeats you want to drop, copy it into [Remove Duplicate Lines](/online-tool/text-tools/remove-duplicate-lines).

## FAQ

### My file shows strange characters instead of accents. Why?

The viewer reads files as UTF-8. Older exports in Windows-1252 or another encoding show replacement characters for accented letters. Re-export the file as UTF-8 and open it again.

Open your next export in the [CSV Viewer](/online-tool/developer-tools/csv-viewer) before you share it or import it anywhere.
