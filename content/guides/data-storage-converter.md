---
slug: why-1tb-drive-shows-931gb-gb-vs-gib
tool: data-storage-converter
title: 'Why Does My 1 TB Drive Show 931 GB? GB vs GiB Explained'
description: "Your new drive isn't missing space. The gap comes from decimal GB vs binary GiB, and bits vs bytes explains slow downloads. Here's how to convert both."
tags: [Tech, Storage, Troubleshooting]
---

A 1 TB drive shows up as about 931 GB because the manufacturer counts in **decimal** units (1 TB = 1,000,000,000,000 bytes), while some operating systems count in **binary** units (1 GiB = 1,073,741,824 bytes) but still label them "GB". Divide 10¹² bytes by 1,073,741,824 and you get **931.32**, exactly the number on screen. No space is missing; it is the same number of bytes measured with a different ruler.

The same kind of mismatch, bits vs bytes, explains why a "100 Mbps" connection downloads at about 12.5 MB/s. Here's how to diagnose and convert both.

## Decimal vs binary units

| Decimal (SI) | Bytes         | Binary (IEC) | Bytes             |
| ------------ | ------------- | ------------ | ----------------- |
| 1 KB         | 1,000         | 1 KiB        | 1,024             |
| 1 MB         | 1,000,000     | 1 MiB        | 1,048,576         |
| 1 GB         | 1,000,000,000 | 1 GiB        | 1,073,741,824     |
| 1 TB         | 10¹²          | 1 TiB        | 1,099,511,627,776 |

At each step up, the gap grows: a KiB is 2.4% bigger than a KB, but a TiB is almost 10% bigger than a TB. That is why the discrepancy seems small on a USB stick and large on a big hard drive.

## Problem: My drive is "smaller" than advertised

**Check:** convert the advertised size from GB or TB to GiB.

| Advertised | Shown in binary units |
| ---------- | --------------------- |
| 64 GB      | 59.60 GiB             |
| 256 GB     | 238.42 GiB            |
| 500 GB     | 465.66 GiB            |
| 1 TB       | 931.32 GiB (0.91 TiB) |
| 2 TB       | 1,862.65 GiB          |

If the number your computer shows matches the right-hand column, everything is fine. Windows typically reports binary sizes with "GB" labels; macOS has used decimal units for storage since 2009, so a Mac shows the full advertised figure.

**If it is still smaller:** formatting reserves some space for the file system, and phones and laptops set aside space for the operating system and recovery partitions. Those are real reductions, but they come on top of the unit difference, not instead of it.

## Problem: My download is eight times slower than my plan

**Check:** internet speeds are quoted in **bits** per second (Mbps), while file sizes and download managers use **bytes** (MB/s). There are 8 bits in a byte.

A 100 Mbps connection moves 100,000,000 bits per second. Convert that to bytes: **12.5 MB per second**. So downloading a 4.7 GB file takes at least 4.7 × 8 ÷ 0.1 ≈ 376 seconds, about six and a quarter minutes, before any network overhead.

If your download manager shows around 11–12 MB/s on a 100 Mbps plan, the connection is performing as sold.

## Problem: The RAM spec and the system report disagree

Memory is built in binary sizes. A "16 GB" RAM module actually holds 16 GiB, which is about 17.18 decimal GB. Here the binary figure is the honest one, and marketing simply uses the shorter "GB" label.

## Problem: A file "fits" on one device but not another

A 4.7 GB single-layer DVD holds 4.7 billion bytes, which is **4.38 GiB**. A video your editor reports as "4.5 GB" in binary units (4.5 GiB, about 4.83 decimal GB) will not fit. Compare sizes in the same unit before copying.

## How to use the Data Storage Converter

The [Data Storage Converter](/online-tool/unit-converters/data-storage-converter) includes both families of units, plus bits:

1. Enter the size in **Value**.
2. Choose **From** and **To**: bit, byte, KB, MB, GB, TB, PB, KiB, MiB, GiB or TiB. Use ⇄ to swap them.
3. Read the result, or check the table, which lists the same amount in every unit, so you can see the decimal and binary figures side by side.

To convert a network speed, enter it as plain bits (100 Mbps = 100,000,000 bits) and convert to MB. Results show up to 10 significant digits, and the copy button gives a number without thousands separators.

## Quick rules of thumb

- **GB to GiB:** multiply by about 0.931.
- **GiB to GB:** multiply by about 1.074.
- **Mbps to MB/s:** divide by 8.

If you are trying to shrink files rather than measure them, the [Image Compressor](/online-tool/image-tools/image-compressor) and [Compress PDF](/online-tool/pdf-tools/compress-pdf) tools reduce file sizes in your browser.

## FAQ

### Which is correct, 1 GB = 1,000 MB or 1,024 MB?

By the international standard, 1 GB = 1,000 MB and 1 GiB = 1,024 MiB. The 1,024 usage for "GB" is a long-standing convention in computing, which is why the separate binary names were introduced in 1998.

### What is a petabyte?

1,000 TB, or 10¹⁵ bytes. You'll mostly see it in data center and cloud storage figures.

### Is a "kb" a kilobit or a kilobyte?

Lowercase b usually means bits and uppercase B means bytes, so kb or kbit is a kilobit and KB is a kilobyte. Context matters, since not everyone follows the convention.

Settle any GB-vs-GiB question with the [Data Storage Converter](/online-tool/unit-converters/data-storage-converter).
