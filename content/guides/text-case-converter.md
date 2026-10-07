---
slug: camelcase-snake-case-kebab-case-when-to-use-each
tool: text-case-converter
title: 'camelCase vs snake_case vs kebab-case: When to Use Each'
description: 'A quick decision guide to the 12 text cases, from camelCase and PascalCase to CONSTANT_CASE and kebab-case, with real examples of where each one belongs.'
tags: [Developers, Naming, Text Case]
---

Use camelCase for variables and functions in JavaScript, Java and Swift; PascalCase for class and component names; snake_case for Python variables and database columns; kebab-case for URLs, CSS classes and file names; and CONSTANT_CASE for environment variables and constants. The right choice is mostly set by your language or platform, so the real skill is knowing the convention and converting cleanly when text moves between them.

Here's a reference for every style the [Text Case Converter](/online-tool/text-tools/text-case-converter) supports, plus the gotchas that trip people up.

## Which case should I use?

| Style         | "Order total amount" becomes | Typical home                                                     |
| ------------- | ---------------------------- | ---------------------------------------------------------------- |
| camelCase     | `orderTotalAmount`           | JS/TS variables and functions, JSON keys, Java and Swift members |
| PascalCase    | `OrderTotalAmount`           | Classes, types, React components, C# methods                     |
| snake_case    | `order_total_amount`         | Python, Ruby, SQL columns, many REST APIs                        |
| kebab-case    | `order-total-amount`         | URL slugs, CSS classes, HTML attributes, CLI flags, file names   |
| CONSTANT_CASE | `ORDER_TOTAL_AMOUNT`         | Environment variables, constants                                 |
| dot.case      | `order.total.amount`         | Config keys, i18n message keys, logging namespaces               |
| Title Case    | Order Total Amount           | Headlines, buttons and menu labels in some style guides          |
| Sentence case | Order total amount           | UI copy, email subjects, most body headings                      |
| UPPERCASE     | ORDER TOTAL AMOUNT           | Short labels, acronyms                                           |
| lowercase     | order total amount           | Tags, normalized data                                            |
| aLtErNaTiNg   | oRdEr ToTaL aMoUnT           | Memes and sarcasm                                                |
| iNVERSE       | oRDER TOTAL AMOUNT           | Fixing text typed with Caps Lock on                              |

When a team's style guide disagrees with this table, the style guide wins. Consistency inside one codebase matters more than any universal rule.

## How does the converter split words?

The programming styles (camelCase, PascalCase, snake_case, kebab-case, CONSTANT_CASE and dot.case) first break your text into words, then rejoin them. Words are split at:

- spaces and punctuation, including `_`, `-` and `.`
- a change from lowercase to uppercase (`helloWorld` → hello + World)
- the end of an acronym (`XMLHttpRequest` → XML + Http + Request)

So you can convert directly between code styles without going through plain words first:

- `first-name` → camelCase → `firstName`
- `XMLHttpRequest parser` → snake_case → `xml_http_request_parser`
- `getHTTPResponse` → kebab-case → `get-http-response`
- `API key rotation policy` → CONSTANT_CASE → `API_KEY_ROTATION_POLICY`

Code styles are applied line by line, so a pasted list of ten field names comes back as ten converted names instead of one long identifier.

## Watch out for acronyms

Converting to camelCase or PascalCase rewrites acronyms in their capitalized-word form: `user ID number` becomes `userIdNumber`, not `userIDNumber`. That matches the Google style guides, but some codebases (and .NET for two-letter acronyms) keep acronyms in caps. If yours does, fix those by hand after converting.

The prose styles have their own trap. Title Case and Sentence case lowercase the rest of each word first, so "User ID number" becomes "User Id Number" and "this is NASA" becomes "This is nasa". Re-capitalize proper nouns and acronyms afterwards.

## How to convert text case step by step

1. Paste your text into **Your text**.
2. Under **Convert to**, click a style. **Title Case** is selected by default.
3. The **Result** box updates instantly. Click another style to compare.
4. Use **Copy** to grab the result, or **Download** to save it as `converted.txt`.

Conversion runs in your browser, which is handy when you're renaming fields from a private schema or an internal API.

## Common conversions, step by step

**API response to Python model.** Paste the JSON keys `createdAt`, `lastLoginIp`, `isActive` one per line, choose snake_case and get `created_at`, `last_login_ip`, `is_active`.

**Blog headline to URL slug.** Paste "10 Tips for Better Sleep" and choose kebab-case to get `10-tips-for-better-sleep`. Punctuation such as apostrophes and question marks is dropped as a separator, which is exactly what a slug needs.

**Feature flag to environment variable.** `enableNewCheckout` becomes `ENABLE_NEW_CHECKOUT` with CONSTANT_CASE.

If you only ever need one style, the single-purpose [Title Case Converter](/online-tool/text-tools/title-case-converter) and [Uppercase Converter](/online-tool/text-tools/uppercase-converter) convert as you type with no buttons to click.

## FAQ

### What's the difference between camelCase and PascalCase?

Only the first letter. camelCase starts lowercase (`orderTotal`), PascalCase starts uppercase (`OrderTotal`). Many languages use camelCase for values and PascalCase for types.

### Can I convert a whole file of variable names at once?

Yes. Paste them one per line. Each line is converted on its own and the line breaks are preserved.

### Why did my apostrophe disappear in kebab-case?

Apostrophes are treated as word separators in the code styles, so "don't stop" becomes `don-t-stop`. Remove apostrophes before converting if you'd rather get `dont-stop`.

Convert your next batch of names with the [Text Case Converter](/online-tool/text-tools/text-case-converter).
