---
slug: build-and-debug-a-javascript-regex-step-by-step
tool: regex-tester
title: Build and Debug a JavaScript Regex Step by Step
description: 'A worked example: build a log-parsing regex one piece at a time, use named groups, flags and a replace preview, and learn to spot catastrophic backtracking.'
tags: [Regex, JavaScript, Debugging]
---

The reliable way to write a regular expression is to build it in small steps against real sample text, and check the matches after every change. A live tester makes that fast: each edit immediately highlights what matched, lists the capture groups, and previews any replacement. This guide builds a log-parsing pattern from scratch to show the workflow, then covers the mistake that can freeze a program: catastrophic backtracking.

## The task

Extract the warnings and errors from log lines like these:

```
2026-10-07 09:14:03 ERROR [payments] Card declined for order 981
2026-10-07 09:14:05 INFO [web] GET /checkout 200
2026-10-07 09:15:11 WARN [payments] Retry 2/3 for order 981
```

For each match we want the date, time, level, service and message. INFO lines should be skipped.

## Step 1: Paste real text first

Open the [Regex Tester](/online-tool/developer-tools/regex-tester) and paste the three lines into **Test string**. Always test against real data, including lines that should **not** match. The INFO line is our negative case.

## Step 2: Match the date, and only the date

In **Regular expression**, type:

```
\d{4}-\d{2}-\d{2}
```

With the **g** (global) flag on, all three dates are highlighted, and the results table lists 3 matches with their index (character offset) in the text. Starting with a small piece and confirming it works is the whole method.

## Step 3: Anchor to line starts

Prefix the pattern with `^`. Now only the first line matches, because `^` means "start of the whole string" by default. Turn on the **m** (multiline) flag and `^`/`$` match at every line break, which brings back all three lines. Forgetting `m` is one of the most common reasons a pattern "works on one line but not on the file".

## Step 4: Add the rest, with named groups

Extend it piece by piece, checking the highlight after each addition:

```
^(?<date>\d{4}-\d{2}-\d{2}) (?<time>[\d:]{8}) (?<level>ERROR|WARN) \[(?<svc>\w+)\] (?<msg>.*)$
```

Notes on the pieces:

- `(?<name>…)` is a **named capture group**. In the results table, the Groups column shows `date: 2026-10-07, time: 09:14:03, level: ERROR, …` instead of `$1, $2, …`.
- `ERROR|WARN` inside a group is an alternation, and that's what excludes the INFO line. The table now shows **2 matches**, at index 0 and 114.
- `\[` escapes the bracket. An unescaped `[` would start a character class.
- `.*` grabs the rest of the line. Without the **s** (dotAll) flag, `.` doesn't match newlines, so the match stops at the end of the line. That's exactly what we want here.

## Step 5: Preview a replacement

Type into **Replace with (optional)**:

```
$<level> $<svc>: $<msg>
```

The preview shows:

```
ERROR payments: Card declined for order 981
2026-10-07 09:14:05 INFO [web] GET /checkout 200
WARN payments: Retry 2/3 for order 981
```

Lines that didn't match are left as they were. Numbered references work too: `$1`, `$2`, and `$&` for the whole match. The replacement follows your flags exactly as `String.prototype.replace` would, so without **g** only the first match is replaced.

Now you can copy the pattern into your code with confidence:

```js
const re =
  /^(?<date>\d{4}-\d{2}-\d{2}) (?<time>[\d:]{8}) (?<level>ERROR|WARN) \[(?<svc>\w+)\] (?<msg>.*)$/gm;
for (const m of log.matchAll(re)) console.log(m.groups.level, m.groups.msg);
```

The tester uses your browser's JavaScript regex engine, the same family of engine Node.js uses, so what you see is how your code will behave. Other flavors (PCRE, Python, Go) differ in places. Go's RE2, for example, has no lookbehind and no backreferences.

## Catastrophic backtracking: the regex that hangs

Some patterns take exponential time on certain inputs. The textbook case:

```
^(a+)+$
```

tested against `aaaaaaaaaaaaaaaaaaaaaaaaaaaaab`. The engine tries every possible way to split the `a`s between the inner and outer `+` before concluding there's no match. Each extra `a` roughly doubles the work. Somewhere around 30 characters it takes seconds, and a few more takes minutes.

In your application that means a frozen tab or a pegged server CPU, which is a known denial-of-service vector called ReDoS. The tester runs matching in a background worker with a **1.5-second timeout**. If a pattern takes longer, the worker is stopped and you see a message pointing at catastrophic backtracking, and the page stays responsive.

Warning signs to look for in your own patterns:

- **Nested quantifiers** like `(a+)+`, `(\w*)*` or `(.*)+`.
- **Alternations that overlap**, such as `(\w|\d)+`, where both branches can match the same character.
- **`.*` followed by something that may never appear**, especially several `.*` in one pattern.

The fixes: make the pieces mutually exclusive (use `[^\]]+` instead of `.*` before a `]`), remove the redundant nesting (`a+` instead of `(a+)+`), and anchor patterns so failure is detected early.

## Quick reference: the five flags

| Flag | Name        | Effect                                                           |
| ---- | ----------- | ---------------------------------------------------------------- |
| g    | global      | Find all matches, not just the first                             |
| i    | ignore case | `a` matches `A`                                                  |
| m    | multiline   | `^` and `$` match at line breaks                                 |
| s    | dotAll      | `.` also matches newlines                                        |
| u    | unicode     | Full Unicode handling, `\p{…}` property escapes, stricter syntax |

## FAQ

### Why does the match count show a "+"?

The tester stops collecting matches at 5,000 to keep the page fast, and the `+` tells you there were more. The table shows details for the first 100.

### Why is my pattern "invalid" here but fine in another tool?

It's probably using syntax from another flavor, such as possessive quantifiers (`a++`), atomic groups (`(?>…)`) or inline flags (`(?i)`), which JavaScript doesn't support. The error message names the problem.

### Can I test a regex for find-and-replace across a document?

Yes. The replace preview covers that. For plain-text find-and-replace without regex syntax, [Find and Replace](/online-tool/text-tools/find-and-replace) is simpler.

Build your next pattern one step at a time in the [Regex Tester](/online-tool/developer-tools/regex-tester).
