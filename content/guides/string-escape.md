---
slug: fix-broken-strings-quotes-backslashes-and-escapes
tool: string-escape
title: "Broken String Literals: Fixing Quotes, Backslashes and \n"
description: Why a Windows path turns into a tab, why JSON rejects your quotes, and why O'Brien breaks SQL. Six escaping symptoms, their causes and the fix for each.
tags: [Developers, Debugging, Strings]
---

Most "broken string" bugs come down to one thing: a character that means something special inside a string literal was pasted in raw. A quote ends the string early, a backslash starts an escape sequence you didn't intend, or a line break isn't allowed at all. The fix is to escape the text for the exact language or format it's going into, because JSON, JavaScript, Python, SQL, CSV, regex and the shell each have different rules.

Below are six common symptoms, their causes and the setting that fixes each.

## Symptom 1: My Windows path turned into a tab and a newline

You paste `C:\new\temp` into a JavaScript string and the program reads `C:`, a newline, `ew`, a tab, `emp`. Inside C-style strings (JSON, JavaScript, Java, C#, Python), `\n` means newline and `\t` means tab, so the backslashes in your path were read as escape sequences.

**Fix:** escape the path before pasting it. With **Mode** set to Escape and **Format** set to `JavaScript / TypeScript`, `C:\new\temp` becomes `C:\\new\\temp`, and every doubled backslash stands for one literal backslash.

To see the bug in reverse, unescape `C:\new\temp` with the JavaScript format: the output contains a real line break and tab, exactly what your code saw.

## Symptom 2: JSON says "unexpected token" near a quote

JSON strings must be wrapped in double quotes, so any double quote inside the value has to be written as `\"`. Raw line breaks aren't allowed either; they must be `\n`. A value like `He said "hello"` followed by a new line breaks the parser.

**Fix:** escape with the `JSON string` format. The tool's sample text,

`He said "hello"` + a newline + a tab + `and left — it's C:\temp`

comes out as:

`He said \"hello\"\n\tand left — it's C:\\temp`

Notice that the apostrophe in `it's` is left alone. JSON only uses double quotes, so a single quote has no special meaning there.

When unescaping, the input must already be a valid JSON string body. `say "hi"` fails because the inner quotes aren't escaped, and `C:\Users\sia` fails because `\U` isn't a valid JSON escape. The tool shows an error rather than guessing. Surrounding double quotes are optional; `"He said \"hi\""` unescapes to `He said "hi"`.

## Symptom 3: The same text works in JSON but breaks in JavaScript

JavaScript strings can be delimited by double quotes, single quotes or backticks, so the `JavaScript / TypeScript` format escapes all three. The sample text's `it's` becomes `it\'s`, which JSON mode would leave alone.

The `Python` format also escapes single quotes and writes low control characters as `\x` sequences: a bell character becomes `\x07` in Python mode but `\u0007` in JSON mode. The `Java / C# / C` format behaves like JSON for quotes and leaves `'` unescaped, which is correct for double-quoted strings in those languages.

One caution for template literals: backticks are escaped, but `${` is not, so `Say ${name}` pasted inside backticks will still interpolate. Use a regular quoted string, or escape the `$` by hand.

## Symptom 4: O'Brien breaks my SQL query

In SQL, a string literal is wrapped in single quotes, and a single quote inside it is written by doubling it. The `SQL string literal` format turns `O'Brien` into `O''Brien`.

That's fine for a one-off query you're typing by hand. In application code, use parameterized queries instead. They pass values separately from the SQL text, so no escaping is needed and SQL injection isn't possible.

## Symptom 5: A CSV field with a comma splits into two columns

CSV separates fields with commas, so a value containing a comma, a double quote or a line break must be wrapped in double quotes, with any inner quotes doubled. The `CSV field` format does exactly that: `Smith, "Jr."` becomes `"Smith, ""Jr."""`, while `plain` stays `plain` because it doesn't need quoting.

## Symptom 6: My regex matches far more than the text I searched for

In a regular expression, characters like `.` `*` `+` `?` `(` `)` `[` `]` `{` `}` `|` `^` `$` have special meanings. Searching for `price: $9.99 (USD)` without escaping means `.` matches any character and `(USD)` becomes a capture group.

**Fix:** use the `Regular expression` format. The output is `price: \$9\.99 \(USD\)`, which matches only that literal text. The tool also escapes backslashes, `/` and `-`, so `2024-01-05` becomes `2024\-01\-05` and the result is safe inside a `/.../` literal or a character class. Test the pattern in the [Regex Tester](/online-tool/developer-tools/regex-tester) before you ship it.

## What about shell commands and XML?

**Shell (POSIX single quotes)** wraps the whole text in single quotes, where nothing is expanded: no `$VAR`, no globbing. A single quote inside can't be escaped within single quotes, so it's written as close-quote, escaped quote, reopen: `it's` becomes `'it'\''s'`.

**XML / HTML** replaces `&`, `<`, `>`, `"` and `'` with entities, so `Tom & "Jerry"` becomes `Tom &amp; &quot;Jerry&quot;`.

## How do you use the tool?

1. Open [String Escape / Unescape](/online-tool/developer-tools/string-escape) and paste your text into **Text**.
2. Pick **Escape** or **Unescape** under **Mode**.
3. Choose the target under **Format**. The **Result** updates as you type, entirely in your browser, so secrets in config strings stay on your machine.

## FAQ

### Why do I sometimes see four backslashes?

Each layer of escaping doubles them. One backslash becomes `\\` in a JSON string, and if that JSON is itself embedded in another string, it becomes `\\\\`. Count the layers the text passes through and escape once per layer.

### Should I escape before or after encoding for a URL?

They're separate steps. Escape for the language the string literal lives in, and percent-encode values that go into a URL. Mixing the two is a common source of double-escaped output.

Fix your next broken literal with [String Escape / Unescape](/online-tool/developer-tools/string-escape).
