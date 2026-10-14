---
slug: online-notepad-where-your-notes-are-saved-and-how-to-keep-them
tool: online-notepad
title: 'Online Notepad: Where Your Notes Are Saved and How to Keep Them'
description: How a browser notepad stores notes in local storage, what can delete them, how much fits, and a simple routine to back up the notes you care about.
tags: [Notes, Productivity, Privacy]
---

An online notepad that saves "in your browser" keeps your text in the browser's local storage on your own device, not on a server. That makes it fast, private and usable offline, but it also means your notes live in one browser on one computer. The [Online Notepad](/online-tool/productivity-tools/online-notepad) works this way. This guide explains what that means in practice and how to make sure you never lose a note you care about.

## What is local storage?

Local storage is a small key-value store that every modern browser gives each website. A page can save text there and read it back later, even after you close the tab or restart the computer. Nothing is sent over the network. The data sits in your browser profile's folder on your disk.

For a notepad, this has clear benefits:

- **Privacy.** Your notes never leave your device, so there is no account to hack and no server log of what you wrote.
- **Speed.** Saving is instant. There is no upload, and every keystroke is stored as you type.
- **Offline use.** Once the page has loaded, you can keep writing without a connection.

## What can delete your notes?

Because the notes belong to one browser profile, a few everyday actions can remove them:

- **Clearing browsing data** with "cookies and site data" selected deletes local storage for every site.
- **Private or incognito windows** start with empty storage and discard everything when you close them.
- **Another browser or device** has its own separate storage. Notes written in Chrome on your laptop are not visible in Safari on your phone.
- **Storage pressure.** Some browsers, Safari in particular, may remove data for sites you haven't visited for a long time.

None of this happens on its own from one day to the next, but it is why a notepad without an account needs a backup habit.

## How much can you store?

Browsers allow roughly 5 MB of local storage per site. Text is stored at about two bytes per character, so that is around 2.5 million characters, or roughly a thousand pages of plain text. The notepad keeps up to 200 notes and shows a warning when you are getting close to the limit, well before anything fails.

Images and files don't belong in a notepad like this. Keep it for text: lists, drafts, meeting notes, snippets you will paste somewhere else.

## A simple backup routine

Pick the method that fits how important the note is:

1. **One note you need elsewhere:** press **.txt** or **.md** to download it as a file. Plain text opens in every editor; Markdown keeps headings and lists readable and renders nicely in tools like the [Markdown Previewer](/online-tool/text-tools/markdown-previewer).
2. **All your notes:** press **Export JSON** at the bottom of the tool. The file contains every note and can be loaded again with **Import JSON** on any device.
3. **A regular habit:** export once a week, or before you clear your browser data, switch computers or reinstall your browser.

Importing replaces the notes in the current browser with the ones in the file, so export first if the browser you are importing into already has notes you want to keep.

## Working comfortably

- **Titles come from the first line.** Start each note with a short heading, such as "Groceries" or "Q4 planning", and the list on the left becomes easy to scan.
- **Search finds every word.** Typing "invoice march" shows only notes that contain both words.
- **Focus mode** hides everything except the text. Press Esc to return.
- **Monospace and text size** make code snippets and long drafts easier to read.
- **Counts update as you type.** The words, characters and lines are shown under the editor. For detailed statistics such as reading time, paste the text into the [Word Counter](/online-tool/text-tools/word-counter).

## When to use something else

A local notepad is ideal for quick, private writing on one device. If you need notes on several devices at once, real-time collaboration or attachments, a synced notes app is the better fit. For tasks with stages, such as to do, doing and done, a [Kanban Board](/online-tool/productivity-tools/kanban-board) is clearer than a list in a note.

For everything else — the phone number you need for ten minutes, the email you are drafting, the ideas you don't want to lose — open the [Online Notepad](/online-tool/productivity-tools/online-notepad) and start typing. It saves as you go.
