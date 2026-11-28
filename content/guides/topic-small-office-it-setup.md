---
slug: set-up-small-office-network-wifi-monitors
title: "Set Up a Small Office: Network Plan, Wi-Fi, Monitors, Asset Tags"
description: "Set up IT for a small office: split the network, make staff and guest Wi-Fi passwords and a QR code, test new monitors and print asset-tag barcodes."
tags: [Networking, Office, Security, How-to]
---

To set up IT for a small office without hiring anyone, do it in four passes: plan the network so staff, guests and printers each get their own address range, create the Wi-Fi passwords and a QR code guests can scan, check every new monitor for dead pixels while you can still return it, and put a barcode asset tag on each device so you know what you own. Emojar covers each step with a free tool: the Subnet Calculator, the Password Generator, the QR Code Generator, the Dead Pixel Test, the Screen Resolution Checker and the Barcode Generator. They all run in your browser and nothing you type, including the Wi-Fi password, is uploaded.

The example is an eight-person design studio moving into a two-room office. There's a new router, eight laptops, eight new monitors, a network printer, a couple of security cameras and visitors who want Wi-Fi.

## How do I split the office network into separate ranges?

Most routers start with a single /24 such as `192.168.10.0/24`, which gives 254 usable addresses. That's plenty for eight people, but it puts the guests' phones on the same network as the printer and the cameras. Routers that support VLANs or a separate guest network let you give each group its own block, and the [Subnet Calculator](/online-tool/developer-tools/subnet-calculator) shows where those blocks start and end.

Type `192.168.10.0/24`, then open **Split this network into smaller subnets** and pick `/26 — 4 subnets of 64 addresses`. The tool lists four blocks:

- `192.168.10.0/26` for staff laptops and phones
- `192.168.10.64/26` for the printer, cameras and other fixed devices
- `192.168.10.128/26` for guests
- `192.168.10.192/26` kept free for later

Paste one block back into the input to see its details. For `192.168.10.128/26` the table shows a **Subnet mask** of `255.255.255.192`, a **Wildcard mask** of `0.0.0.63`, **First usable host** `192.168.10.129`, **Last usable host** `192.168.10.190`, **Broadcast address** `192.168.10.191` and 62 **Usable hosts**. The **Type** row reads Private (RFC 1918), which confirms the range won't clash with anything on the internet. The wildcard mask is the value some business routers ask for in access rules, for example a rule that blocks the guest block from reaching the device block.

Use **Copy details** to paste each block's numbers into your setup notes, so whoever looks after the router next doesn't have to work them out again.

## How long should the office Wi-Fi password be?

Open the [Password Generator](/online-tool/security-generators/password-generator). It starts at 20 characters with all four character types ticked. People type a Wi-Fi password by hand on phones, smart TVs and the odd printer, so drop the symbols and the characters that look alike:

- Set **Length** to 16.
- Untick **Symbols (!@#$…)**, which are fiddly on a TV remote.
- Tick **Exclude look-alikes (I, l, 1, O, 0)** so nobody confuses an `l` with a `1`.

With those settings each character comes from 56 possibilities: 24 capitals, 24 lowercase letters and 8 digits. The strength line shows about 93 bits, rated Strong. Set **How many passwords** to 2 and you have one for staff and one for guests, which you can grab with **Copy all**. Put both in your password manager before you touch the router.

Change the guest password now and then, for example when a contractor finishes, and leave the staff one alone unless a laptop goes missing.

## How do guests join the Wi-Fi without typing the password?

In the [QR Code Generator](/online-tool/security-generators/qr-code-generator), set **Content type** to 📶 Wi-Fi network. Fill in **Network name (SSID)** and **Password**, leave **Security** on WPA/WPA2/WPA3, and tick **Hidden network** only if the router doesn't broadcast the name. The code updates as you type. Phone cameras read it and offer to join, so visitors never see the password itself.

For a printed card at the front desk, set **Error correction** to "High (30%) — for logos/print" so a scuffed card still scans, and download the SVG, which stays sharp at any print size. The code holds the network details directly, with no short link to a tracking server, so it keeps working until you change the password. When you do, make a new code and swap the card.

## How do I check new monitors for dead pixels?

Do this the day the monitors arrive, while the return window is open. Set each monitor to its native resolution first. The [Screen Resolution Checker](/online-tool/device-tests/screen-resolution-checker) shows what the browser sees; if a 4K panel reports 1920 × 1080, display scaling is the reason, and the **Physical pixels** row gives the true panel size. Click **Copy all details** if you need to send the numbers to the supplier.

Then open the [Dead Pixel Test](/online-tool/device-tests/dead-pixel-test), drag the browser window onto the monitor you're checking and click **Start full-screen test**. The screen fills with one colour at a time: Black, White, Red, Green, Blue, Cyan, Magenta, Yellow and Gray 50 %. Click, or press Space or the arrow keys, to move between them, and press Esc to leave. A dead pixel shows as a black dot on white and the bright colours. A stuck pixel shows as a coloured or white dot on black. Dust looks blurry and moves when you wipe it.

With eight monitors, tick **Change colour automatically every 3 s** and walk along the row. If you find a stuck pixel, the optional fixer flashes colours over that spot for 10 to 20 minutes, after a photosensitivity warning. Dead pixels usually can't be fixed, so check the maker's pixel policy and send the monitor back if it qualifies.

## How do I make asset tags for office equipment?

The [Barcode Generator](/online-tool/security-generators/barcode-generator) makes the labels. Give each device an ID with a short scheme, such as `OFC-LAP-01` to `OFC-LAP-08` for laptops and `OFC-MON-01` to `OFC-MON-08` for monitors, and keep a spreadsheet that maps each ID to the serial number, the person who has it and the purchase date.

Leave **Format** on Code 128 (any text), which handles letters, digits and dashes. Code 39 also works if your IDs stay in capitals, digits and the few symbols it allows. EAN-13 and UPC-A are for retail products and need numbers licensed from GS1, so they're the wrong choice for internal tags. Type the ID into **Value**, keep **Show text below the barcode** ticked so people can read the tag without a scanner, and adjust **Height** (30 to 200 px) and **Bar width** (1 to 4 px) to fit your label size. **⬇ SVG** is best for a label printer or a sheet of sticky labels; **⬇ PNG** exports at three times the preview size.

Most USB barcode scanners act like a keyboard, so scanning a tag into the spreadsheet's search box finds the device's row.

## FAQ

### Do I need separate subnets in an office this small?

Not strictly. One /24 works for eight people. Splitting it keeps guests and smart devices away from staff laptops, and if your router offers a guest network or VLANs, the Subnet Calculator gives you clean ranges to type in.

### Is it safe to put the Wi-Fi password into a web tool?

The Password Generator and the QR Code Generator both run in your browser. The password is created with your browser's cryptographically secure random generator and isn't sent or stored anywhere.

### Should the guest Wi-Fi QR code be PNG or SVG?

SVG for anything printed, since it's a vector and stays sharp at any size. PNG is fine for a screen, such as a slide on a reception TV.

### Can I use EAN-13 barcodes for my own asset tags?

You can generate the image, but EAN-13 numbers are meant to be licensed from GS1 for retail products. Code 128 takes any text, so an ID like `OFC-LAP-01` fits without registering anything.

More help is in [Developer Tools](/online-tool/developer-tools), [Security & Generators](/online-tool/security-generators) and [Device Tests](/online-tool/device-tests).
