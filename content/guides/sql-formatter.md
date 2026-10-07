---
slug: sql-formatter-dialects-keyword-case-and-parse-errors
tool: sql-formatter
title: Formatting SQL – Which Dialect, Keyword Case and Indent to Pick
description: Why a query formats fine as PostgreSQL but fails as Standard SQL, whether to uppercase keywords, and how to pick formatter settings your team can live with.
tags: [SQL, Developer, Formatting, Guide]
---

Pick the dialect of the database the query actually runs on, uppercase keywords unless your team already uses lowercase, and use 2-space indentation unless your codebase says otherwise. The dialect is the setting that matters most: each database has its own syntax for quoting names, casting types and writing parameters, and a formatter that expects the wrong dialect will refuse to parse the query. The other two settings are purely about style.

Here's how each choice plays out, with real output from the formatter.

## What does a SQL formatter actually change?

It rewrites **whitespace and, optionally, keyword case**, and nothing else. Each clause (SELECT, FROM, JOIN, WHERE, GROUP BY…) starts on its own line, column lists are split one per line, and nested queries are indented. String literals and identifiers stay exactly as written.

Here's the one-line sample query from the [SQL Formatter](/online-tool/developer-tools/sql-formatter), formatted with Standard SQL, UPPERCASE keywords and 2-space indentation:

```sql
SELECT
  u.id,
  u.name,
  count(o.id) AS orders
FROM
  users u
  LEFT JOIN orders o ON o.user_id = u.id
WHERE
  u.created_at > '2026-01-01'
  AND u.active = TRUE
GROUP BY
  u.id,
  u.name
HAVING
  count(o.id) > 5
ORDER BY
  orders DESC
LIMIT
  20;
```

Notice that `true` became `TRUE` because it's treated as a keyword, while the function name `count` kept its original case.

## Why does the dialect matter so much?

Databases disagree on syntax. To format a query, the formatter has to parse it into tokens, and syntax that's normal in one dialect is an error in another. These are tested examples:

| Query uses                          | Example                            | Works with         | Fails with Standard SQL?                 |
| ----------------------------------- | ---------------------------------- | ------------------ | ---------------------------------------- |
| Square-bracket names                | `[Order ID]`, `[dbo].[Orders]`     | SQL Server (T-SQL) | Yes: _Unexpected "[Order ID]"_           |
| `::` type casts and `$1` parameters | `created_at::date`, `user_id = $1` | PostgreSQL         | Yes: _Unexpected "::date, co"_           |
| `@` variables                       | `declare @n int = 5`               | SQL Server (T-SQL) | Yes                                      |
| `#` line comments                   | `# comment`                        | MySQL              | Yes                                      |
| Backtick names                      | `` `my-project.sales.orders` ``    | BigQuery, MySQL    | No, but PostgreSQL and T-SQL reject them |

When parsing fails, the tool shows **The SQL could not be parsed**, followed by the parser's message with a line and column. That position points to the first piece of syntax the chosen dialect didn't recognize, which is usually your clue to switch dialects.

The full list is Standard SQL, PostgreSQL, MySQL, MariaDB, SQLite, SQL Server (T-SQL), Oracle PL/SQL, BigQuery, Snowflake and Redshift. **Standard SQL** is the strictest choice: use it for portable queries, and pick the specific database whenever the query uses vendor features.

## Uppercase or lowercase keywords?

Both are legitimate. SQL keywords are case-insensitive, so this is purely about readability:

- **UPPERCASE** (the default) makes the query's structure jump out from table and column names. It's the most common convention in documentation and books.
- **lowercase** is popular in teams that write a lot of SQL inside application code and find capitals noisy. Many modern style guides accept it.
- **Keep as typed** leaves keyword case untouched and only fixes whitespace. It's useful when you're reformatting someone else's query and don't want a noisy diff.

Whichever you choose, **be consistent within a project**. Mixed casing makes code reviews harder, which defeats the point of formatting.

Case changes never touch string contents. Formatting `SELECT 'select from where' AS Txt` with lowercase keywords gives `select 'select from where' as Txt`: the words inside the quotes are left alone.

## 2 spaces, 4 spaces or tabs?

Follow your repository's existing style if it has one. If not:

- **2 spaces** keeps deeply nested subqueries and CTEs from drifting off the right edge.
- **4 spaces** is easier to scan in short queries and matches many Python and C# codebases.
- **Tab** lets each developer set their own visual width in their editor.

## When is formatting most useful?

- **Code reviews.** One clause per line means a changed condition shows up as a single changed line in a diff instead of a rewritten 300-character line.
- **Debugging generated SQL.** ORMs and BI tools often log queries on one line. Formatting makes joins and filters readable at a glance.
- **Comparing two versions.** Format both with the same settings, then compare them with [Text Diff](/online-tool/text-tools/text-diff).

## How to format SQL step by step

1. Open the [SQL Formatter](/online-tool/developer-tools/sql-formatter) and paste your query, or click **Load sample**.
2. Choose the **Dialect**, **Keywords** case and **Indent**.
3. Click **Format SQL** (or press Ctrl/⌘ + Enter).
4. Copy the result or download it as a `.sql` file.

The formatter runs in your browser, so queries that reveal table names or contain customer data aren't sent anywhere.

## FAQ

### Does it keep my comments?

Yes. Comments are kept in the output, though their position can shift slightly as lines are rearranged. Check that each one still sits next to the code it describes.

### Does it validate my SQL?

No. It checks that the query can be parsed in the chosen dialect, not that tables exist or the logic is right.

### Why are my function names not uppercased?

The keyword setting applies to keywords such as SELECT, AS and TRUE. Function names like `count` and `sum` are left as typed.

Clean up your next query with the [SQL Formatter](/online-tool/developer-tools/sql-formatter).
