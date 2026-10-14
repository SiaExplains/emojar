---
slug: turn-csv-or-spreadsheet-data-into-a-markdown-table
tool: csv-to-markdown
title: 'Turn CSV or Spreadsheet Data into a Markdown Table'
description: 'Paste CSV or cells copied from Excel and get a GitHub Markdown table for a README, pull request or wiki, with alignment, escaped pipes and line breaks.'
tags: [Markdown, CSV, Documentation]
---

To turn CSV into a Markdown table, write the header row between pipes, add a separator line of dashes under it, and then write one piped line per data row, escaping any pipe that appears inside a cell. The [CSV to Markdown Converter](/online-tool/developer-tools/csv-to-markdown) does this as you paste. It reads the CSV with proper quoting rules, pads the columns so the source lines up, and handles the characters that would otherwise break a table. The result works on GitHub, GitLab, most wikis and static site generators.

## From CSV to table in one paste

Take a small CSV with two awkward cells, one containing a pipe and one containing a line break inside quotes:

```
name,role,notes
Ada,admin,"Owns billing | invoices"
Linus,dev,"Line one
line two"
```

With the default settings you get:

```markdown
| name  | role  | notes                    |
| ----- | ----- | ------------------------ |
| Ada   | admin | Owns billing \| invoices |
| Linus | dev   | Line one<br>line two     |
```

Both problem cells survived. The pipe is written as `\|`, so it doesn't start a new column, and the line break became `<br>`, because a real newline would end the table row. Most Markdown renderers, including GitHub's, show `<br>` as a line break inside the cell.

## Pasting straight from Excel or Google Sheets

You don't need to export a file first. Select the cells in your spreadsheet, copy, and paste into the **CSV** box. Copied cells arrive tab-separated, and with **Delimiter** set to **Detect automatically** the converter picks tabs on its own. Detection also recognises commas, semicolons and pipes by checking which character splits the first lines most consistently. If it guesses wrong, choose the delimiter yourself.

You can also drop a `.csv`, `.tsv` or `.txt` file of up to 25 MB on the box. It's read in your browser and never uploaded, and a UTF-8 byte-order mark at the start is removed.

Here's tab-separated data pasted from a sheet, with **Alignment** set to **Left**:

```
Item	Qty	Path
Apples	3	C:\fruit
Pears	12
```

```markdown
| Item   | Qty | Path      |
| :----- | :-- | :-------- |
| Apples | 3   | C:\\fruit |
| Pears  | 12  |           |
```

Two more details show up here. Backslashes are doubled, so a renderer doesn't treat them as escape characters. And the `Pears` row was one cell short, so it was padded with an empty cell. The status line under the output reports rows like that ("1 row has a different number of cells (padded)"), which is your hint to check for a missing value or a wrong delimiter.

## Choosing an alignment

**Alignment** applies to every column and controls the colons in the separator line:

- **Default** writes plain dashes (`---`), and the renderer decides, which usually means left.
- **Left** writes `:---`.
- **Centre** writes `:---:`.
- **Right** writes `---:`, which suits columns of prices and counts.

The padding in the source follows the alignment too, so right-aligned columns line up on the right in your editor as well. If you need different alignments per column, convert here, then change individual colons in the separator line by hand, or rebuild the table in the [Markdown Table Generator](/online-tool/developer-tools/markdown-table-generator), which has an alignment control under every column.

## Data without a header row

Markdown tables always have a header. If your first row is data, untick **First row is the header**. The columns then get the headings `Column 1`, `Column 2` and so on, and every line of the input becomes a body row:

```markdown
|  Column 1  | Column 2 | Column 3 |
| :--------: | :------: | :------: |
| 2026-10-01 |  Deploy  |    ok    |
| 2026-10-02 | Rollback |  failed  |
```

That's a two-line deploy log with **Centre** alignment. Replace the generic headings in the output with real names before you publish. A header cell that's empty in your CSV gets the same kind of placeholder.

## Big tables and the row limit

Markdown tables get hard to read, and slow to render, long before CSV files get big. The converter has three safeguards:

1. **Row limit (empty = all).** Enter a number to convert only the first rows, which is handy for a "sample of the data" section in a README.
2. **A 5,000-row ceiling.** However large the file, and whatever row limit you enter, at most the first 5,000 rows are written. The status line tells you how many rows the file has and how many are shown.
3. **No padding above 1,000 rows.** Past that size, columns aren't padded, so the output stays compact. Renderers ignore padding anyway, and the table looks the same once rendered. Only the source is less tidy.

For small inputs of up to 200 rows, a rendered preview of the table appears under the output, so you can check it before copying.

## Where the table will be used

Paste the output into a README, a pull request description, an issue or a wiki page. To check how it renders before you commit, use the [Markdown Previewer](/online-tool/text-tools/markdown-previewer). If you first need to check a large export, or sort and filter it down to the rows worth showing, open it in the [CSV Viewer](/online-tool/developer-tools/csv-viewer), download the filtered CSV and convert that.

## Limits to keep in mind

GitHub-flavoured Markdown tables can't merge cells, can't nest lists or code blocks inside cells, and can't hold real multi-line rows. `<br>` is the closest you get. Cells are trimmed of leading and trailing spaces. The converter reads CSV text only, so `.xlsx` workbooks need to be saved as CSV, or copied and pasted, first.

## FAQ

### Can I download the table as a file?

Yes. Copy it, or download it as `table.md`.

### Will numbers keep their formatting?

Yes. Every cell is copied as text, so `0042`, `1,000` and `$8` come out exactly as they were written in the CSV.

Paste your next spreadsheet range into the [CSV to Markdown Converter](/online-tool/developer-tools/csv-to-markdown) and drop the table straight into your docs.
