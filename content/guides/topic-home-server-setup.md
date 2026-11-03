---
slug: set-up-a-raspberry-pi-home-server
title: "Set Up a Raspberry Pi Home Server: IPs, Permissions and Logs"
description: Pick a fixed IP for a Raspberry Pi server, set safe chmod permissions, read who visits in the logs and build a Basic auth header, all with free browser tools.
tags: [Developer, Networking, Linux, How-to]
---

Setting up a small home server, such as a Raspberry Pi running a web server, comes down to four jobs you'll repeat on every box: give it an address that won't clash with anything on your network, set file permissions so the web server can read what it needs and nothing more, check who is actually requesting pages once it's online, and protect the admin page with a password. Emojar has a tool for each: the Subnet Calculator, the Chmod Calculator, the User Agent Parser and the Base64 Encoder and Decoder. They run in your browser, and nothing you type into them is uploaded, which matters when the input is a server log or a password.

The example here is a Pi on a typical home network. The router hands out addresses in `192.168.1.0/24`, the Pi serves a small site from `/var/www/site`, a second person in the house uploads photos to a shared folder, and there's an `/admin` page that should ask for a login.

## Which IP address should the server use?

Start with the [Subnet Calculator](/online-tool/developer-tools/subnet-calculator). Type the address your Pi currently has with its prefix, for example `192.168.1.10/24`. You can also write it with a mask, `192.168.1.10 255.255.255.0`, and get the same answer.

For a /24 the table shows:

- **Network address**: `192.168.1.0/24`
- **Subnet mask**: `255.255.255.0`
- **Broadcast address**: `192.168.1.255`
- **First usable host** and **Last usable host**: `192.168.1.1` to `192.168.1.254`
- **Usable hosts**: 254 of 256 total addresses
- **Type**: Private (RFC 1918)

Any address from .1 to .254 works on paper. In practice the router usually sits on .1 and its DHCP pool takes a block of the rest. Keep the server out of that pool so the router never hands its address to a phone.

The **Split this network into smaller subnets** menu helps you see a clean boundary. Choose `/25 — 2 subnets of 128 addresses` and the tool lists `192.168.1.0/25` and `192.168.1.128/25`. If you set the router's DHCP range inside the lower half, the upper half is free for fixed addresses. Type `192.168.1.130/25` to check that block on its own: first usable host `192.168.1.129`, last `192.168.1.254`, 126 usable hosts, mask `255.255.255.128`. Give the Pi `192.168.1.130` and keep the mask at `255.255.255.0` in its network settings, since the whole house still shares one /24.
The **Type** row says whether any range you paste is private, loopback, link-local, carrier-grade NAT or public, which helps with a range copied from a Docker config. IPv6 prefixes such as `2001:db8:abcd:12::1/64` work too.

## What permissions should the website files have?

Open the [Chmod Calculator](/online-tool/developer-tools/chmod-calculator). It has a grid of **Read**, **Write** and **Execute** checkboxes for **Owner (u)**, **Group (g)** and **Others (o)**, plus **Octal** and **Symbolic** fields that stay in sync, and a **File or folder** field that fills in the `chmod` command you can copy.

For the site the usual split is:

- HTML, CSS and image files: `644`, shown as `rw-r--r--`. You can edit them, and the web server, running as another user, can read them.
- Folders such as `/var/www/site`: `755`, or `rwxr-xr-x`. On a folder, execute means the server may enter it, and read means it may list what's inside.
- A deploy script you run yourself: `755` too, so it can be executed.

The **Common permissions** list under the command has these as one-click buttons, along with `600` (Private files such as SSH keys) and `700` (Private folders and scripts). Click `600`, type `~/.ssh/id_ed25519` in the file field and the command reads `chmod 600 ~/.ssh/id_ed25519`. SSH refuses to use a private key that other users can read.

You can also go the other way. When `ls -l` prints `rw-------` and you're not sure what it means, type it into **Symbolic** and the octal box changes to `600`.

## How do you share an upload folder with someone else?

The shared photo folder needs the group to write as well, so tick **Write** for the group to get `775` (`rwxrwxr-x`). That still leaves a gap. Files a person creates get that person's primary group, so the other person may not be able to edit them later.

That's what the **setgid** bit in **Special bits** is for. On a folder it makes new files inherit the folder's group. Tick it and the octal value becomes `2775` and the symbolic form `rwxrwsr-x`, with an `s` in the group's execute position. Type `uploads` as the file name and copy `chmod 2775 uploads`. The tool's list also marks `777` as "Everyone can do everything — avoid on servers". With a shared group and setgid you don't need it.

## Who is visiting the server?

Once the Pi has been online for a day, the web server's access log fills up with requests, and many of them aren't people. Paste the user-agent strings into the [User Agent Parser](/online-tool/developer-tools/user-agent-parser), one per line, up to 50 at a time. It starts with your own browser filled in; the **Use mine** button puts it back.

The tool expects the user-agent strings alone, not whole log lines. With the common "combined" log format, `awk -F'"' '{print $6}' access.log | sort | uniq -c | sort -rn | head -50` prints the 50 most frequent ones with a count in front; drop the counts before pasting.

For each line you get the browser and version, the engine, the operating system and the device type. Lines that match a known bot get a warning box with the bot's name and kind. A few you'll likely see on a fresh server:

- `curl/8.4.0` shows as curl, a Command-line client.
- A string containing `python-requests` shows as a Python HTTP client, a Script.
- A string containing `GPTBot` shows as an OpenAI crawler, an AI crawler.
- `Googlebot` shows as a Search engine bot.

Anyone can send any user agent, and the tool says so in the warning: check real search-engine bots with a reverse DNS lookup of their IP address. **Copy as CSV** gives you a table with browser, version, engine, OS, OS version, device and bot columns to sort in a spreadsheet.

## How do you build the Basic auth header for the admin page?

Many web servers can put a password in front of a path using HTTP Basic authentication. The browser then sends a header like `Authorization: Basic <value>`, where the value is `username:password` in Base64. When you test the page with curl or an API client, you have to make that value yourself.

Type `pi:raspberry` (use your own login, of course) into the [Base64 Encoder](/online-tool/developer-tools/base64-encoder) and the output is `cGk6cmFzcGJlcnJ5`. A longer one, `admin:correct-horse-42`, becomes `YWRtaW46Y29ycmVjdC1ob3JzZS00Mg==`, with `=` padding at the end. Leave **URL-safe (Base64URL)** unticked here, because Basic auth uses standard Base64.

To check what a client is sending, paste the value after `Basic` into the [Base64 Decoder](/online-tool/developer-tools/base64-decoder) and the username and password appear as plain text. It accepts standard and URL-safe Base64, with or without padding, and ignores whitespace.

Anyone who sees the header can decode it the same way, because Base64 is an encoding with no key. Only use Basic auth over HTTPS.

## FAQ

### Should the server's netmask be /24 or /25?

Use the netmask of your home network, normally `255.255.255.0` for a /24. Splitting into /25 in the Subnet Calculator is only a way to plan which half of the range holds fixed addresses.

### Is chmod 777 ever fine on a home server?

Rarely. It lets every user on the system change or replace the file. For a shared folder, `775` with the right group, or `2775` with setgid, gives the same access to the people who need it.

### Why does the User Agent Parser call something a bot when it says Chrome?

Bot detection looks for known bot names anywhere in the string, so a crawler that also mentions Chrome or Safari is still flagged, and its device type shows as Bot. A script can also pretend to be a normal browser and slip through, which is why a reverse DNS lookup is the real check.

### Is it safe to type a password into the Base64 Encoder?

The encoder runs in your browser and doesn't send what you type anywhere. Still, use a test login when you're only trying things out.

More network and server helpers are in [Developer Tools](/online-tool/developer-tools).
