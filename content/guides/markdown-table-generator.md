---
slug: how-to-make-a-markdown-table-without-counting-pipes
tool: markdown-table-generator
title: 'How to Make a Markdown Table Without Counting Pipes'
description: Build GitHub-ready Markdown tables in a grid editor, set column alignment with colons, and keep pipes in cells from breaking the layout.
tags: [Markdown, Developer, How-to]
---

The easiest way to make a Markdown table is to type your data into a grid editor and copy the Markdown it generates. You set each column's alignment from a menu instead of typing colons, and any pipe character inside a cell is escaped as `\|` automatically, so the table doesn't break when you paste it into a README, a pull request or a wiki page. If you'd rather write one by hand, the rules are short, and this guide covers them too.

## The anatomy of a Markdown table

Markdown tables come from GitHub-flavoured Markdown (GFM), and they're supported on GitHub, GitLab, many wikis, static site generators and note-taking apps. A table has three parts:

1. A **header row**, with cells separated by pipes: `| Name | Role |`
2. A **separator row** of at least three dashes per column: `| --- | --- |`
3. One or more **body rows** in the same pipe-separated shape.

Alignment lives in the separator row. A colon on the left (`:---`) aligns the column left, colons on both sides (`:---:`) centre it, and a colon on the right (`---:`) aligns it right. With no colons, the renderer uses its default, which is usually left.

Writing this by hand is fine for a tiny table. Past that, keeping pipes lined up and fixing the table after adding a column gets tedious.

## Building a table step by step

1. Open the [Markdown Table Generator](/online-tool/developer-tools/markdown-table-generator). It starts with a small example table so you can see how everything works; press **Clear table** to start fresh with two empty columns and one row.
2. Type the column headings in the top row of the grid, then fill in the cells below.
3. Press **＋ Row** to add a row at the bottom, or **＋ Column** to add one on the right. Each row and column has a **✕** button to delete it.
4. Under each heading, choose an alignment: Default, Left, Centre or Right.
5. Copy the Markdown from the output box, or download it as `table.md`. The live preview underneath shows how the table will look once rendered.

If you leave a heading blank, it's filled in as "Column 1", "Column 2" and so on, because a GFM table needs a header for every column.

## A worked example with alignment and a tricky cell

Say you're documenting project commands in a README: command column left-aligned, description on default, timings right-aligned so the numbers line up. One command contains a pipe.

With **Align columns in the Markdown source** switched on, the generator produces this:

```markdown
| Command       | Purpose             | Time (s) |
| :------------ | ------------------- | -------: |
| `npm test`    | Runs the unit tests |       42 |
| `ls \| wc -l` | Counts files        |      0.1 |
```

The separator row carries the alignment: `:---` for the first column, plain dashes for the second, `---:` for the third. And the pipe in `ls | wc -l` was written as `\|`; without the backslash, the renderer would see a column boundary and the row would gain an extra cell. GitHub still displays a normal pipe.

With padding switched off, the same table becomes compact:

```markdown
| Command | Purpose | Time (s) |
| :-- | --- | --: |
| `npm test` | Runs the unit tests | 42 |
| `ls \| wc -l` | Counts files | 0.1 |
```

Both render identically; padding is only for humans reading the raw file. Keep it on for files reviewed in diffs, and turn it off for smaller source or tables you'll edit by hand often. When padding, emoji and Chinese, Japanese or Korean characters count as two columns, so the source still lines up in most editors.

## What gets escaped, and why

The generator changes three things in cell text so the table can't break:

- **Pipes** become `\|`, so they stay inside their cell.
- **Backslashes** are doubled, so text such as `5\*3` keeps its backslash instead of having it swallowed as a Markdown escape.
- **Line breaks** become `<br>`. A real line break would end the row, while `<br>` is shown as a line break by most renderers.

That last point has a useful side effect: if you want two lines inside one cell, you can type `<br>` into the cell yourself.

## What Markdown tables can't do

GFM tables are deliberately simple. There's no way to merge cells across rows or columns, no column widths, no cell colours and no captions. A table also can't contain block content such as lists or code blocks. If you need any of that, write an HTML table instead; most Markdown renderers accept raw HTML.

The editor is meant for tables people actually read, so it allows up to 20 columns and 2,500 cells in total. For bigger datasets, Markdown isn't the right format anyway.

## Related tools

- Already have the data in a spreadsheet or CSV file? Paste it into [CSV to Markdown](/online-tool/developer-tools/csv-to-markdown) instead of retyping it.
- Check the table alongside the rest of your document in the [Markdown Previewer](/online-tool/text-tools/markdown-previewer).
- Need a table for a plain-text context such as a code comment or terminal output? The [ASCII Table](/online-tool/developer-tools/ascii-table) tool draws one with box characters.

## FAQ

### Does the order of alignment colons matter?

Yes. The colon's position is what sets the alignment, so `:--` is left and `--:` is right. The number of dashes doesn't change anything; GFM accepts a single dash, and the generator writes at least three characters per column.

Build your next README table in seconds with the [Markdown Table Generator](/online-tool/developer-tools/markdown-table-generator).
