---
slug: cmd-vs-ctrl-why-shortcuts-differ-on-mac-windows-linux
tool: keyboard-shortcuts
title: Cmd or Ctrl? Why Shortcuts Differ on Mac, Windows and Linux
description: How the Command, Control, Option and Windows keys map to each other, where the simple Cmd-equals-Ctrl rule breaks, and how to find any shortcut fast.
tags: [Keyboards, Productivity, Mac, Windows]
---

Most keyboard shortcuts translate between systems with one rule: the Mac's Command key (⌘) does the job of Ctrl on Windows and Linux, and Option (⌥) stands in for Alt. Copy is Ctrl + C on a PC and Cmd + C on a Mac. The rule covers the everyday basics, but it breaks for window management, text navigation, screenshots and a handful of browser commands. Those are the shortcuts people end up searching for.

## Where did the two systems come from?

Apple's Lisa and the original 1984 Macintosh used a dedicated Command key for menu shortcuts, separate from the Control key that computer terminals had long used for other purposes. The bottom-left letters Z, X, C and V became undo, cut, copy and paste because they sit right next to that key and are easy to reach with one hand.

Windows adopted the same letters but paired them with Ctrl, since PC keyboards had no Command key. Linux desktops such as GNOME, used by Ubuntu and Fedora, followed the Windows layout for app shortcuts. They use the Super key, which is the key with the Windows logo on most PC keyboards, for system actions.

So you end up with this rough mapping:

| Role                   | Windows | macOS          | Linux (GNOME) |
| ---------------------- | ------- | -------------- | ------------- |
| App commands           | Ctrl    | Cmd (⌘)        | Ctrl          |
| Alternate commands     | Alt     | Option (⌥)     | Alt           |
| System and window keys | Win     | Control or Cmd | Super         |

## Where does "Cmd equals Ctrl" stop working?

These examples all come from the reference's own list, and each one trips up people who switch between machines:

- **Quitting an app.** Windows uses Alt + F4 to close the active window. A Mac uses Cmd + Q, and GNOME apps use Ctrl + Q.
- **Redo.** Windows usually accepts Ctrl + Y or Ctrl + Shift + Z. The Mac only uses Cmd + Shift + Z.
- **Moving by word and by line.** On Windows and Linux, Ctrl + ← jumps a word and Home goes to the start of the line. On a Mac, word jumps move to Option + ←, and Cmd + ← goes to the start of the line.
- **Deleting a word.** Ctrl + Backspace on Windows and Linux becomes Option + Delete on a Mac.
- **Taking a screenshot of an area.** Windows uses Win + Shift + S, macOS uses Cmd + Shift + 4, and on GNOME, Print Screen opens the screenshot tool.
- **Browser history.** Chrome and Edge open history with Ctrl + H on Windows but Cmd + Y on a Mac.
- **Settings.** Windows opens system Settings with Win + I. On a Mac, Cmd + , opens the current app's settings.

The Mac's own Control key still has a job. It handles things like Control + ↑ to show all open windows, Control + ← and Control + → to move between desktops, and Control + Cmd + Space for the emoji picker.

## Browsers don't all agree either

Chrome and Edge share an engine and most of their shortcuts. Firefox and Safari go their own way in a few places:

- **Private browsing.** Chrome's Incognito window and Edge's InPrivate window both use Ctrl + Shift + N. Firefox uses Ctrl + Shift + P for a private window. On a Mac, swap Ctrl for Cmd. Safari also uses Cmd + Shift + N.
- **Downloads on Linux.** Chrome and Edge use Ctrl + J. Firefox on Linux uses Ctrl + Shift + Y.
- **Jumping to a tab by number.** Ctrl + 1–8 works in Chrome and Edge on Linux, but Firefox on Linux uses Alt + 1–8.
- **The developer console.** Chrome and Edge use Ctrl + Shift + J. Firefox's Web Console is Ctrl + Shift + K.

Some shortcuts really are universal across the four browsers. Reopening the last closed tab is Ctrl + Shift + T on Windows and Linux and Cmd + Shift + T on a Mac in all of them.

## A worked example: finding the private window shortcut

Open the [Keyboard Shortcut Reference](/online-tool/reference-tools/keyboard-shortcuts). It guesses your platform from the browser and selects **Windows**, **macOS** or **Linux** for you.

1. Leave **App** on **Everything** and type `private` into **Search shortcuts**.
2. On Windows, the list shows three results under **Browser (3)**: Chrome's "Open an Incognito window" (Ctrl + Shift + N), Firefox's "Open a private window" (Ctrl + Shift + P) and Edge's "Open an InPrivate window" (Ctrl + Shift + N). The word "incognito" finds the same three.
3. Click **macOS**. The list grows to four, because Safari's "Open a private window" (Cmd + Shift + N) only exists on a Mac, and the other three switch to Cmd.
4. Click the keys on any row to copy the combination as text, such as `Cmd + Shift + P`.

Search matches every word you type against the action name, extra keywords, the app name and the keys for all platforms. That makes a useful trick possible. Type `F9` while **macOS** is selected and you get Firefox's "Toggle Reader View" as Cmd + Option + R. That's the Mac version of a key you remember from Windows. Edge's Immersive Reader drops out, because the list has no Mac shortcut for it.

## How the reference is organized

The list holds 222 hand-picked shortcuts for Windows 11, recent macOS versions and GNOME. You can filter it three ways:

- **Platform**: Windows, macOS or Linux. Entries that don't exist on that platform are hidden.
- **App**: Everything, System & apps, Chrome, Firefox, Edge or Safari. If you pick Safari on Windows or Linux, a note explains that Safari is only on macOS.
- **Category**: General, Browser, Text editing, Navigation, Developer tools, Window management and File management.

Some entries carry a short note. The Mac window-tiling shortcuts, for example, need macOS 15 Sequoia or later, and Safari's developer shortcuts need "Show features for web developers" turned on in Safari Settings > Advanced.

## When a shortcut doesn't work

- **Check for Fn.** Many laptops use the top row for brightness and volume, so F-keys need Fn.
- **Check for remapping.** System settings, keyboard utilities and some apps can reassign shortcuts.
- **Check the key itself.** The [Keyboard Tester](/online-tool/device-tests/keyboard-tester) shows whether a key press registers at all.
- **Check your browser.** If you're not sure which browser or system you're on, [What Is My Browser](/online-tool/device-tests/what-is-my-browser) will tell you.

## FAQ

### Is the Windows key the same as Super on Linux?

Yes. It's the same physical key. GNOME calls it Super and uses it for the activities overview, search and window snapping.

### Does the reference record what I type?

No. It's a static list that filters in your browser. Typing in the search box only filters the list.

### How do I type symbols that aren't on my keyboard?

Use the emoji picker shortcut for emoji, or copy symbols from [Special Characters](/online-tool/text-tools/special-characters).

Find the shortcut you need in the [Keyboard Shortcut Reference](/online-tool/reference-tools/keyboard-shortcuts).
