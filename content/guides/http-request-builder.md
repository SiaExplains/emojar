---
slug: build-an-http-request-and-turn-it-into-curl-or-python
tool: http-request-builder
title: 'From Form to Code: Build HTTP Requests for cURL, fetch and Python'
description: How an HTTP request is put together, why a browser tool can't just send it for you (CORS), and a worked example turned into cURL, fetch and Python code.
tags: [HTTP, API, Developer Tools]
---

An HTTP request has four parts you control: a method, a URL with an optional query string, headers, and sometimes a body. The HTTP request builder lets you fill those in as a form and writes the matching code for cURL, JavaScript fetch, Axios, Python requests, Node.js, HTTPie and PowerShell. It only generates code. It never sends the request itself, so you copy the code and run it in your terminal or project.

## What goes into an HTTP request?

The semantics of HTTP are defined in RFC 9110. For everyday API work, these are the parts that matter:

- **Method.** What you want to do. GET reads, POST creates or submits, PUT replaces, PATCH changes part of a resource, DELETE removes. HEAD is GET without the body, and OPTIONS asks what's allowed. The builder offers all seven.
- **URL.** The scheme (`https://`), host, path and an optional query string after `?`, such as `?page=1&limit=20`.
- **Headers.** Name and value pairs that describe the request. `Accept` says which format you want back, `Content-Type` says what format the body is in, and `Authorization` carries credentials.
- **Body.** The data sent with POST, PUT or PATCH. GET and HEAD requests don't carry a body in fetch, and the builder warns you and leaves it out if you pick a body type for them.

## A worked example: creating a user

The builder opens with a ready-made request. The method is **POST**, the URL is `https://api.example.com/users?page=1&limit=20`, there's an `Accept: application/json` header, and the JSON body is:

```json
{
  "name": "Ada Lovelace",
  "role": "admin"
}
```

Set the auth **Type** to "Bearer token" and enter `YOUR_TOKEN`. The **cURL** tab then shows:

```bash
curl 'https://api.example.com/users?page=1&limit=20' \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  --data-raw '{"name":"Ada Lovelace","role":"admin"}'
```

A few things happened for you. The token became an `Authorization: Bearer …` header. `Content-Type: application/json` was added because the body type is JSON and you didn't set one yourself. The JSON was compacted to one line and wrapped in single quotes so the shell passes it through untouched. There's no `-X POST`, because `--data-raw` already makes cURL send a POST.

The **Python requests** tab turns the same request into a dictionary and calls `requests.post(url, headers=headers, json=payload)`. The **JavaScript fetch** tab builds a `fetch()` call with `method: 'POST'`, the headers object and `body: JSON.stringify({...})`, then prints the status and response text.

## How the form stays in sync with the URL

Paste a URL with a query string and the **Query parameters** table fills itself in, already decoded. Edit the table and the URL updates, with keys and values percent-encoded as needed. Untick a row's checkbox to leave that parameter out without deleting it. The same switch works for headers and form fields, which makes it easy to test a request with and without a header.

The **Body** section has five types: None, JSON, Form (urlencoded), Raw text and Multipart form. JSON bodies are checked as you type, and **Format JSON** pretty-prints them. Each type sets a matching `Content-Type` unless you add your own, except Multipart. A multipart body needs a boundary string that the HTTP client generates, so the builder never writes that header and removes it if you add one. Multipart is limited to text fields. For a file, add a part by hand, such as `-F 'file=@photo.jpg'` in cURL.

For **Basic** auth, the username and password are joined as `username:password` and base64-encoded into the header, as RFC 7617 describes. Keep in mind that base64 is an encoding, not encryption. Anyone who sees the header can decode it, so only send Basic auth over HTTPS.

## Why doesn't the tool send the request?

Because of how browsers protect you. Under the same-origin policy, a script on one website can't read responses from another origin, meaning a different scheme, host or port. CORS (Cross-Origin Resource Sharing), defined in the WHATWG Fetch Standard, is the way a server can opt out of that restriction. It answers with headers like `Access-Control-Allow-Origin` to say which other sites may read its responses.

For many API requests, the browser first sends a "preflight" OPTIONS request to ask permission. Sending JSON or adding an `Authorization` header is enough to trigger that. Most APIs don't allow arbitrary websites, so a request sent from this page would usually fail, even though the same request works fine elsewhere.

CORS is enforced by browsers only. cURL, Python, Node.js and PowerShell don't apply it, which is why the code you copy runs normally in a terminal or on a server. The only way to send requests from a web page to any API would be to route them through a proxy server, and that server would see your data and tokens. Generating code avoids that. Your values stay in this tab's memory. They aren't saved, and they're gone when you close the tab.

One thing to watch: the generated code contains your token or password in plain text. Treat it like the secret itself, and don't paste it into public chats or commit it to a repository.

## Getting the quoting right

Hand-written commands break when a value contains a quote, a `$` sign or a line break. Each tab escapes values its own way. Shell commands use single quotes, and a single quote inside a value becomes `'\''`. JavaScript and Python strings escape quotes, backslashes and newlines. PowerShell doubles single quotes. Values with emoji or accented letters come through intact.

The builder also flags problems before you run anything: header names with characters HTTP doesn't allow, line breaks inside a header value, invalid JSON, and an Authorization header that overrides the auth helper.

## Related tools

When a response comes back, the [HTTP status codes](/online-tool/developer-tools/http-status-codes) reference explains what a 401 or 422 means. To take apart a long URL first, use the [URL parser](/online-tool/developer-tools/url-parser), and to tidy a JSON response, the [JSON formatter](/online-tool/developer-tools/json-formatter).

## FAQ

### Which language tab should I use?

Use cURL for quick tests in a terminal, fetch or Axios in JavaScript projects, and Python requests in scripts. The Node.js tab uses the fetch built into Node.js 18 and later, and the PowerShell tab uses `Invoke-RestMethod`.

### Why is my URL rejected?

The builder needs a complete URL that starts with `http://` or `https://`, such as `https://api.example.com/users`. Until the URL is fixed, it shows "Fix the URL to generate code."

### Does the HTTPie tab need a particular version?

For JSON and raw text bodies, it uses the `--raw` option, which needs HTTPie 3.2 or later.

Build your next API call in the [HTTP request builder](/online-tool/developer-tools/http-request-builder) and copy the code for the language you use.
