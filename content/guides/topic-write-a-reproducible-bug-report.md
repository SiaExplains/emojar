---
slug: write-a-bug-report-developers-can-reproduce
title: 'Write a Bug Report Developers Can Reproduce on the First Try'
description: 'Turn "it doesn''t save" into a report a developer can rerun: browser details, a screenshot, a ready cURL command and a JSON diff of what came back.'
tags: [Debugging, API, Developer Tools, How-to]
---

A bug report gets fixed fast when the developer can run it themselves without asking you anything. That takes four things: your exact browser and system, a screenshot of what you saw, the request as code they can paste into a terminal, and a clear list of how the response differs from what you expected. [What Is My Browser](/online-tool/device-tests/what-is-my-browser) gives you the first, the [Keyboard Shortcut Reference](/online-tool/reference-tools/keyboard-shortcuts) the screenshot keys, the [HTTP Request Builder](/online-tool/developer-tools/http-request-builder) the command, and [JSON Diff](/online-tool/developer-tools/json-diff) the comparison. [Code to Image](/online-tool/developer-tools/code-to-image) is optional, for when the report also goes into a chat thread or a slide. All five run in your browser: nothing you paste or type is uploaded, and the request builder never sends the request.

The example follows one bug from start to finish. You're testing a staging version of a web app. On the profile page you change your display name to Zoë O'Neil, untick the newsletter box and press Save. The page says "Saved", but after a reload the name reads "Zo" and the newsletter box is ticked again.

## What does "it doesn't work" leave out?

It leaves out the browser, the request and the response. Each missing answer costs a round of messages, and if the developer can't make the bug happen on their machine, the ticket often gets closed as "cannot reproduce".

Write down what you did, what you expected and what happened, then add your environment and the evidence. The tools below cover those last two parts.

## How do you capture your browser and system details?

Open What Is My Browser. The top of the page shows your browser and operating system, and further down you'll find the user agent string, device details and a list of supported web features. Click **Copy full report** and paste the whole thing into the ticket. It comes out as plain `Label: value` lines, one per line, so it's easy to read in any issue tracker.

It's worth knowing that user agent strings are simplified on purpose: Chrome and Edge report Windows 11 as "Windows NT 10.0", and Safari always says macOS 10.15.7. Where your browser supports User-Agent Client Hints, the page asks for the exact versions instead. Firefox doesn't support them, so on Windows it shows "10 or 11". Mention your real Windows version in the ticket if the bug might depend on it.

## Which keys take a clean screenshot?

Search the Keyboard Shortcut Reference for "screenshot". Your platform is detected automatically, and you can switch it if you're writing instructions for someone else. To grab only part of the screen:

- Windows: Win + Shift + S
- macOS: Cmd + Shift + 4
- Ubuntu and other GNOME desktops: Print Screen, then drag to select an area

On a Mac, Control + Cmd + Shift + 4 copies the area to the clipboard so you can paste it straight into the ticket. Cmd + Shift + 4 followed by Space captures a single window. Clicking any shortcut in the list copies its key combination.

For this bug, take two shots: the "Saved" message right after pressing Save, and the profile after a reload showing "Zo". Together they show the app reporting success while keeping the wrong data. Before the second screenshot, look up **Hard reload (ignore cache)** in the same reference (in Chrome it's Ctrl + Shift + R or Ctrl + F5 on Windows, Cmd + Shift + R on a Mac) so a cached page can't be the explanation.

## How do you turn the failing request into a command?

Open your browser's DevTools, go to the Network tab and press Save again. You'll see the request the page sent. In this case it was a PATCH to `https://staging.example.com/api/v1/users/42?fields=profile` with a small JSON body. Rebuild it in the HTTP Request Builder:

1. Set **Method** to PATCH and paste the URL. The query string fills the **Query parameters** table for you.
2. Keep the `Accept: application/json` header.
3. Choose **JSON** as the body type and enter `{"displayName": "Zoë O'Neil", "newsletter": false}`.
4. Under auth, choose **Bearer token**. Put a placeholder like `PASTE_TEST_TOKEN` there, never your real token, because the generated code contains whatever you type.

The **cURL** tab then gives you this:

```bash
curl -X PATCH 'https://staging.example.com/api/v1/users/42?fields=profile' \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer PASTE_TEST_TOKEN' \
  -H 'Content-Type: application/json' \
  --data-raw '{"displayName":"Zoë O'\''Neil","newsletter":false}'
```

Inside a single-quoted shell string, the apostrophe in O'Neil has to become `'\''`, and the builder does that for you. Get it wrong by hand and you send a broken body, then file the wrong bug. The builder also added `Content-Type: application/json` because you picked a JSON body, and wrote the bearer token as an `Authorization` header.

If the developer works in Python, switch to the **Python requests** tab. It writes the same request with `requests.patch(url, headers=headers, json=payload)` and prints the status code and response text. Other tabs cover JavaScript fetch, Axios, Node.js fetch, HTTPie and PowerShell.

The builder won't send the request itself, because browsers block a page from calling most other sites' APIs unless those APIs allow it (CORS), so you copy the code into a terminal. Run the cURL command once with your own test token and save the JSON that comes back.

## How do you show exactly what came back wrong?

Paste what you expected into JSON Diff on the left (**Original JSON**) and the real response on the right (**Changed JSON**). Expected:

```json
{ "id": 42, "displayName": "Zoë O'Neil", "newsletter": false, "tags": ["beta", "staff"] }
```

Actual:

```json
{ "id": 42, "newsletter": true, "displayName": "Zo", "tags": ["staff", "beta"], "updatedAt": "2026-11-20T09:14:03Z" }
```

The tool reports 5 differences: 1 added, 4 changed. Two of them are the swapped tags, because arrays are compared position by position. The tags are a set and their order doesn't matter, so tick **Ignore the order of items in arrays**. That drops it to 3 differences: 1 added, 2 changed. Click **Copy report** and you get:

```text
~ $.newsletter: false → true
~ $.displayName: "Zoë O'Neil" → "Zo"
+ $.updatedAt: "2026-11-20T09:14:03Z"
```

`newsletter` came before `displayName` in the response, and the diff still matched them by name, since key order doesn't count. The `updatedAt` line is a new field and expected, so note that in the ticket and keep the focus on the other two lines. The name was cut off right before the "ë", which points at how the server handles non-ASCII characters. The newsletter setting wasn't saved at all. Those are two bugs, and they may deserve two tickets.

## When is a picture of the code useful?

The ticket should hold the command as text so it can be copied. If you also post the bug in a team chat or show it in a weekly demo, an image is quicker to read. Paste the cURL command into Code to Image, set **Language** to **Bash / Shell**, choose a theme such as GitHub Light, type "PATCH user 42" as the **Window title** and turn on **Line numbers** so people can say "line 5" when they talk about the body. **Export size** 2× (sharp, recommended) suits most screens. Press **Download PNG** and the file is named after the title, `PATCH-user-42.png`, or use **Copy image** to paste it straight into the chat.

Put the text version next to the image, since nobody can copy or search an image and screen readers can't read it.

## FAQ

### Is it safe to put a real API token in the request builder?

Nothing is stored or sent anywhere: values stay in that tab's memory and are gone when you close it. The risk is the generated code, which contains the token. Use a placeholder in anything you paste into a ticket.

### Can the HTTP Request Builder run the request for me?

No. Browsers block cross-origin requests unless the API allows them through CORS, and most don't. Sending them anyway would need a proxy server that sees your data and tokens, so the builder only writes code for you to run.

### Why does JSON Diff list every item after an insertion as changed?

Arrays are compared position by position by default, so one inserted item shifts everything after it. Tick "Ignore the order of items in arrays" to match items by value instead.

### Why does my bug report say Windows 10 when I'm on Windows 11?

The user agent string can't tell the two apart. Chrome, Edge and Opera give the real version through Client Hints and What Is My Browser uses it. Firefox doesn't, so the page shows "10 or 11".

More tools for this kind of work are in [Developer Tools](/online-tool/developer-tools), [Device Tests](/online-tool/device-tests) and [Reference Tools](/online-tool/reference-tools).
