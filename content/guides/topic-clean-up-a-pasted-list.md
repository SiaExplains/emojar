---
slug: clean-up-a-pasted-list-into-a-comma-separated-line
title: Turn a Messy Pasted List Into a Clean Comma-Separated Line
description: Clean a pasted list of emails or IDs, drop blanks and repeats, quote each item and join it all into one line for a SQL IN clause or code, in your browser.
tags: [Text, Lists, SQL, How-to]
---

To turn a messy pasted list into one clean, comma-separated line, fix it one step at a time: delete the blank lines, make the case consistent, remove repeats, escape any quotes, wrap each item in quotes with a comma after it, and then join the lines into one. Emojar has a small text tool for each of those steps. They update as you type, and the text stays in your browser, so a list of customer emails is never uploaded anywhere.

The example in this guide: a colleague in support pastes eight lines into a chat and asks you to check those customers in the database. You want a query like `SELECT * FROM customers WHERE email IN (...)`, and this is what you've got:

```text
Ana.Silva@example.com
  ben@example.org

CHLOE@example.com
dan.o'neill@example.net
   
ana.silva@example.com
evan@example.com
Ben@Example.org
```

It has a blank line, a line holding only spaces, a stray indent, mixed capitals, two repeats in disguise and an apostrophe that would break a SQL string.

## How do you remove the blank lines first?

Paste the list into [Remove Empty Lines](/online-tool/text-tools/remove-empty-lines). The option **Also remove lines with only spaces** is ticked by default, and you want it on here, because the line with three spaces looks empty but isn't. With it on, both the blank line and the space-only line go, and seven lines are left.

The tool deletes whole lines only and doesn't touch spaces inside a line that has text, so `  ben@example.org` keeps its two leading spaces for now.

## How do you make the case consistent?

Copy the result into the [Lowercase Converter](/online-tool/text-tools/lowercase-converter). It has no options: the lowercase version appears as you type. Only letters change, so the dots, the `@` and the apostrophe stay where they are.

Do this before removing duplicates. `Ana.Silva@example.com` and `ana.silva@example.com` are the same address to almost every mail system, but a case-sensitive comparison treats them as two different lines. After this step the list reads:

```text
ana.silva@example.com
  ben@example.org
chloe@example.com
dan.o'neill@example.net
ana.silva@example.com
evan@example.com
ben@example.org
```

## How do you remove the repeated entries?

Paste that into [Remove Duplicate Lines](/online-tool/text-tools/remove-duplicate-lines). Leave both defaults on: **Case sensitive** and **Ignore leading/trailing spaces**. The tool keeps the first occurrence of each line and the original order, so nothing gets shuffled.

Two lines disappear. The second `ana.silva@example.com` is an exact repeat. The last line, `ben@example.org`, counts as a repeat of `  ben@example.org` because spaces at the start and end are ignored when lines are compared. The line that stays is the first one, though, and it still has its two leading spaces. Five addresses remain.

If you'd rather keep the original capitals, you could skip the lowercase step and untick **Case sensitive** instead. Then the first spelling of each address wins, `Ana.Silva@example.com` in this case.

## Why does the apostrophe need escaping?

In SQL, a string literal is wrapped in single quotes, so the `'` in `dan.o'neill` would end the string early and the query would fail. The fix is to double it. Open [String Escape / Unescape](/online-tool/developer-tools/string-escape), keep **Mode** on Escape and set **Format** to **SQL string literal**. That mode doubles every single quote and leaves the rest alone, line breaks included, so you can run the whole list through at once. The address becomes `dan.o''neill@example.net`.

The same tool covers JSON, JavaScript / TypeScript, Python, CSV and a few more formats if the list is headed for code. One caution from the tool's own notes: escaping by hand is fine for a one-off query you type yourself, but application code should use parameterised queries instead.

## How do you put quotes and a comma around every line?

Use [Add Prefix / Suffix to Lines](/online-tool/text-tools/add-prefix-suffix-to-lines). Clear the prefix field first. It starts with `{n}. `, which numbers the lines, and you don't want that here. Then set:

- **Prefix (before each line)**: `'`
- **Suffix (after each line)**: `',`
- **Trim spaces from each line**: ticked
- **Skip empty lines**: ticked (the default)

The trim option removes the two spaces in front of `ben@example.org`, which would otherwise end up inside the quotes. The output is:

```text
'ana.silva@example.com',
'ben@example.org',
'chloe@example.com',
'dan.o''neill@example.net',
'evan@example.com',
```

For a JavaScript array or JSON, use `"` as the prefix and `",` as the suffix instead.

## How do you join the lines into one?

The last tool is [Remove Line Breaks](/online-tool/text-tools/remove-line-breaks). Set **Line breaks** to **Replace all with a space** and leave **Collapse repeated spaces** on. You'll get a single line:

```text
'ana.silva@example.com', 'ben@example.org', 'chloe@example.com', 'dan.o''neill@example.net', 'evan@example.com',
```

The suffix also went onto the last item, so delete that final comma by hand, then put the line in brackets after `IN`. If you want no space after each comma, choose **Remove all (no space)** instead. The default mode, **Remove, keep paragraphs**, gives the same single line here because the list has no blank lines left, but picking the space option makes it clear what you'll get.

Every one of these tools has **Copy** and **Download** buttons under the result, and **Load sample** above the input if you want to see what it does before pasting your own text.

## Can you do it in fewer steps?

Yes, when the list is already tidy. If there are no blank lines and the case is consistent, you can go straight to removing duplicates, then add the quotes and join the lines. Blank lines don't do much harm at the prefix step either, since **Skip empty lines** leaves them without quotes and joining with spaces folds them away. For a list pasted from a chat or a form, the full sequence is safer, because trailing spaces and stray capitals are hard to spot by eye.

## FAQ

### Why is there a comma after the last item?

Add Prefix / Suffix to Lines puts the suffix on every line that has text, the last one included. Delete the final comma by hand after joining the lines.

### Does Remove Duplicate Lines change the order of my list?

No. It keeps the first occurrence of each line where it was and drops the later repeats. To sort the list as well, run the result through Sort Lines.

### What if one of the addresses contains a double quote?

SQL string literals use single quotes, so a double quote can stay as it is in SQL mode. For JSON or JavaScript, pick that format in String Escape / Unescape and it escapes double quotes with a backslash.

### Is my list sent to a server?

No. These text tools run in your browser, and the list you paste isn't uploaded or saved.

More tools for lists and text are in [Text Tools](/online-tool/text-tools), and String Escape sits with the other converters in [Developer Tools](/online-tool/developer-tools).
