---
slug: uuid-v4-vs-v7-choosing-ids-for-your-database
tool: uuid-generator
title: 'UUID v4 vs v7: Choosing IDs for Your Database'
description: 'Random v4 or time-ordered v7? How each UUID is built, what it means for database indexes and privacy, and a quick decision table for picking the right one.'
tags: [UUID, Databases, Decision Guide]
---

Use **UUID v7** for database primary keys and anything you want to sort by creation time. Its first 48 bits are a millisecond timestamp, so new IDs arrive in order and keep B-tree indexes compact. Use **UUID v4** when the ID must reveal nothing, not even roughly when it was created, or when the system you're feeding expects v4. Both are 128-bit, both are standard (RFC 9562), and both are collision-safe in practice.

## How each version is built

A UUID is 128 bits, written as 32 hex digits in a 8-4-4-4-12 pattern. Some of those bits are fixed: the **version** nibble (the first digit of the third group) and the **variant** bits (the first digit of the fourth group, always `8`, `9`, `a` or `b`).

**Version 4** is random apart from those fixed bits:

```
4c481917-3e25-4b5c-a035-dffe145f2678
              ^    ^
          version  variant
```

That leaves 122 random bits. The generator fills them from `crypto.getRandomValues`, your browser's cryptographically secure random source.

**Version 7** puts a Unix timestamp in milliseconds first, followed by random bits:

```
01a1163c-1a00-7479-8a4a-3d4d5f64cef3
└──────┬─────┘ ^
  timestamp   version 7
```

`01a1163c1a00` in hex is 1,791,374,400,000 ms, which is 2026-10-07 12:00:00 UTC. After the version and variant bits, 74 bits remain random.

## Why v7 is kinder to your database

Most relational databases store the primary key in a B-tree index. With **v4 keys**, every insert lands at a random spot in that tree. Pages split all over the place, the index fragments, and the working set no longer fits in cache once the table gets large. Write throughput drops and the index grows bigger than it needs to be.

With **v7 keys**, new IDs are always larger than older ones (apart from same-millisecond ties), so inserts go to the right-hand edge of the index, just like an auto-increment integer. You keep the benefits of UUIDs, like generating IDs on the client, merging data across shards, and not exposing row counts, without the random-insert penalty.

As a bonus, `ORDER BY id` roughly equals `ORDER BY created_at`, and you can read an approximate creation time straight from the ID while debugging.

## Why you might still choose v4

- **The ID leaks timing.** Anyone who sees a v7 ID can decode when it was created, to the millisecond. For public IDs on things like invite links, password-reset tokens, documents or user accounts, that may reveal more than you want, such as signup dates or activity patterns.
- **Compatibility.** Some libraries, APIs and validation rules still expect version 4 specifically.
- **Randomness.** v4 has 122 random bits against v7's 74. Both are far beyond any realistic collision risk, but if a UUID is doing double duty as an unguessable secret, more randomness is better. Really, though, secrets should come from a dedicated token generator.

## Decision table

| Use case                                           | Pick                                         |
| -------------------------------------------------- | -------------------------------------------- |
| Primary key in PostgreSQL, MySQL or SQL Server     | v7                                           |
| Event or log IDs you sort by time                  | v7                                           |
| Public-facing IDs where creation time is sensitive | v4                                           |
| Third-party system that validates "version 4"      | v4                                           |
| Idempotency keys, correlation IDs                  | Either; v4 is the common default             |
| Placeholder or "no value" sentinel                 | Nil (`00000000-0000-0000-0000-000000000000`) |

## Generating UUIDs

1. Open the [UUID Generator](/online-tool/developer-tools/uuid-generator) and choose the **Version**: **UUID v4 (random)**, **UUID v7 (time-ordered)** or **Nil UUID**.
2. Set **How many**, anywhere from 1 to 10,000.
3. Choose formatting: **Uppercase**, **Hyphens** (untick for 32 bare hex digits), and **Braces { }** for the `{…}` style used in the Windows registry and some .NET code.
4. Click **Generate** (the list also refreshes when you change an option), then copy the list or download it as `uuids.txt`.

Bulk v7 batches are strictly ordered. Within one batch, each ID's timestamp is one millisecond after the previous one:

```
01a1163c-1a00-7479-8a4a-3d4d5f64cef3
01a1163c-1a01-7bf4-bc19-9d4df34e3646
01a1163c-1a02-76eb-b4b4-de9d280f510b
```

That makes them handy for seed data and fixtures that need a stable order. A batch of 10,000 spans 10 seconds of timestamps starting at the moment you click.

## Practical tips

- **Store UUIDs as a native type** (`uuid` in PostgreSQL, `BINARY(16)` in MySQL), not as 36-character strings. That's less than half the storage, with faster comparisons.
- **Pick one case and stick with it.** UUIDs are case-insensitive by spec, but string comparisons in code often aren't. Lowercase is the RFC's recommended output.
- **Generate in the database or app for production.** PostgreSQL 18 and recent language runtimes have native v7 support. A browser generator is ideal for fixtures, test data, migrations and one-off records.

## FAQ

### Can two UUIDs ever collide?

Theoretically yes, practically no. With 122 random bits you'd need to generate about 2.7 quintillion v4 IDs for a 50% chance of a single collision. v7 has fewer random bits, but they only have to be unique _within the same millisecond_, which is an even safer position.

### Are GUIDs the same as UUIDs?

Yes. GUID is Microsoft's name for the same 128-bit format. A GUID shown in braces and uppercase is just a formatting choice, which the generator's checkboxes reproduce.

### Can I get a UUID v1 or v6?

Not here. The tool offers v4, v7 and the nil UUID. v1 includes a MAC address and v6 is a reordered v1. For new systems, v7 covers the same "sortable" need without the hardware identifier.

Generate the IDs you need with the [UUID Generator](/online-tool/developer-tools/uuid-generator).
