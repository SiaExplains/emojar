---
slug: linux-file-permissions-for-a-website-walkthrough
tool: chmod-calculator
title: Setting File Permissions for a Website on Linux, Step by Step
description: A walkthrough of chmod on a real server. 644 for pages, 755 for folders, 600 for SSH keys, 640 for secrets and setgid for a shared upload folder.
tags: [Linux, Servers, Security]
---

For a typical website on Linux, files should be `644` (rw-r--r--), folders `755` (rwxr-xr-x), files holding secrets `640` or `600`, and nothing should be `777`. Those four numbers cover most of a deployment. Below, we set up a small site and explain each number so you can handle the odd cases yourself.

## The setup

You've just copied a site to `/var/www/shop` on a fresh server. Your user `deploy` owns the files, the web server runs as `www-data`, and the group on the site folder is `www-data` too. There's a `.env` file with a database password, a deploy script, an `uploads` folder that both you and the web server write to, and your SSH key for pulling code.

## How do the three digits work?

Each digit is one class of user: **owner**, **group**, **others**. Inside a digit you add up read (4), write (2) and execute (1):

| Digit | Bits | Symbolic |
| --- | --- | --- |
| 7 | 4 + 2 + 1 | rwx |
| 6 | 4 + 2 | rw- |
| 5 | 4 + 1 | r-x |
| 4 | 4 | r-- |
| 0 | none | --- |

So `750` reads as owner `rwx`, group `r-x`, others `---`, written `rwxr-x---`. On folders the letters mean something slightly different. Read lets you list the names inside, write lets you create, rename or delete entries, and execute lets you enter the folder and reach anything in it. A folder without execute is effectively locked even if read is set.

## Step 1: Ordinary files get 644

HTML, CSS, images and PHP files only need to be readable by the web server. `644` (`rw-r--r--`) lets `deploy` edit them and everyone else read them. PHP files are read by an interpreter, so they don't need execute.

## Step 2: Folders get 755

`755` (`rwxr-xr-x`) lets the web server enter and list every directory while only the owner can add or remove files. This is also where the most common mistake happens. Running `chmod -R 644` on the whole site strips execute from the folders, and the web server instantly gets "permission denied" on everything below the top level. Set files and folders separately, for example with `find /var/www/shop -type d -exec chmod 755 {} +` and the same command with `-type f` and `644`.

## Step 3: Secrets get 640

The `.env` file must not be world-readable, since any other account or compromised process on the box could read your database password. `640` (`rw-r-----`) lets you edit it, lets the `www-data` group read it, and shuts out everyone else. If only your own user needs it, use `600` (`rw-------`).

## Step 4: The deploy script gets 750

Scripts need the execute bit to run as `./deploy.sh`. `750` (`rwxr-x---`) lets you and your group run it while others can't even read it.

## Step 5: The SSH key gets 600, its folder 700

SSH refuses to use a private key that other users can read, so `~/.ssh/id_ed25519` must be `600` and `~/.ssh` itself `700` (`rwx------`). That fixes the "UNPROTECTED PRIVATE KEY FILE" warning.

## Step 6: The shared uploads folder gets 2775

Both `deploy` and `www-data` write to `uploads`, so the group needs write: `775` (`rwxrwxr-x`). The catch is that new files normally take the primary group of whoever created them, and a file you create by hand might end up unwritable for the web server. The **setgid** bit fixes that: on a folder, new files inherit the folder's group. Add a leading `2` and you get `2775`, shown as `rwxrwsr-x`. The `s` in the group's execute slot is setgid. `2770` (`rwxrws---`) is tighter if others need no access.

The other two special bits are **setuid** (4, run a program as its owner) and **sticky** (1, only owners can delete their own files in a shared folder, as in `/tmp` at `1777`). An uppercase `S` or `T`, as in `4644` → `rwSr--r--`, means the special bit is on but execute is off, which is usually a mistake.

## Why not just use 777?

It lets every account on the server replace your files. When something "only works with 777", the real problem is almost always the owner or group. Fix that with `chown` or `chgrp` and use `775` or `2775`.

## How do you check each value with the calculator?

1. Open the [Chmod Calculator](/online-tool/developer-tools/chmod-calculator) and tick **Read**, **Write** and **Execute** for **Owner (u)**, **Group (g)** and **Others (o)**. The **Value** column shows each digit as you go.
2. Or type into **Octal** (`640`, `2775`, even `0o750`) or **Symbolic** (`rw-r-----`). You can paste a 10-character `ls -l` string like `drwxrwsr-x`, and the leading file-type letter is ignored.
3. Tick **setuid**, **setgid** or **sticky** under **Special bits** when you need them.
4. Enter the path in **File or folder** and copy the command, for example `chmod 2775 uploads`. Names with spaces are quoted for you.

The **Common permissions** list has one-click presets for 644, 755, 600, 700, 775, 777 and 1777. Note that the generated command sets a single mode on a single path. For the separate file and folder pass in step 2, use `find` as shown. Each digit is simply a base-8 number. To see `755` as binary bits, try the [Number Base Converter](/online-tool/developer-tools/number-base-converter).

## FAQ

### Is `0755` different from `755`?

No. The leading zero just means "no special bits", so the calculator turns `0755` into `chmod 755`.

### Why can't my web server read a 644 file?

Check every folder on the path. Each one needs execute for the web server's user, either through the group or others. A single `700` folder above the site blocks everything beneath it.

Work out your next permission set in the [Chmod Calculator](/online-tool/developer-tools/chmod-calculator).
