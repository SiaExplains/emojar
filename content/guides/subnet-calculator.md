---
slug: plan-an-office-network-with-cidr-subnetting
tool: subnet-calculator
title: "Planning an Office Network With CIDR: A Subnetting Walkthrough"
description: "Carve one /22 into staff, guest, server and link subnets step by step, with the exact masks, host ranges and broadcast addresses for each."
tags: [Networking, Subnetting, CIDR]
---

To plan a network with CIDR, start from the block you were given, decide how many hosts each segment needs, and split the block into subnets whose prefix leaves enough host bits for each. A subnet calculator does the binary arithmetic for you: enter the block, read the usable range, then pick a longer prefix to see the equal-sized pieces. Below is a complete worked example for a small office.

## What are we building?

Imagine you're setting up a new office and the network team hands you `10.20.0.0/22`. You need:

- a staff LAN for roughly 150 laptops and phones,
- a guest Wi-Fi network,
- a printer and server segment of about 40 devices,
- a small management network for switches and access points,
- a point-to-point link to the router at headquarters.

Before splitting anything, find out what the /22 actually contains.

## How big is a /22?

Type `10.20.0.0/22` into the [subnet calculator](/online-tool/developer-tools/subnet-calculator) and it returns:

| Field | Value |
| --- | --- |
| Network address | 10.20.0.0/22 |
| Subnet mask | 255.255.252.0 |
| Wildcard mask | 0.0.3.255 |
| Broadcast address | 10.20.3.255 |
| First usable host | 10.20.0.1 |
| Last usable host | 10.20.3.254 |
| Usable hosts | 1,022 |
| Total addresses | 1,024 |
| Type | Private (RFC 1918) |

The arithmetic behind it: an IPv4 address has 32 bits, the /22 fixes the first 22, and the remaining 10 bits give 2¹⁰ = 1,024 addresses. The first one names the network and the last is the broadcast address, so 1,022 are left for devices. The "Binary mask" row makes this visible: `11111111.11111111.11111100.00000000` is 22 ones followed by 10 zeros.

## How do I split the block into /24s?

Below the results is a dropdown labeled **Split this network into smaller subnets**. Each option tells you what you'd get, for example "/24 — 4 subnets of 256 addresses". Choose it and the list fills in:

- `10.20.0.0/24`
- `10.20.1.0/24`
- `10.20.2.0/24`
- `10.20.3.0/24`

A /24 has 254 usable hosts, which comfortably fits the 150 staff devices with room to grow. Give `10.20.0.0/24` to staff and `10.20.3.0/24` to guest Wi-Fi. Guest networks fill up fast, so a generous range avoids exhausted DHCP pools.

## How do I size the smaller segments?

That leaves `10.20.1.0/24` and `10.20.2.0/24`. The server segment needs about 40 addresses, which is far less than a /24. Enter `10.20.1.0/24` and split it into /26s:

| Subnet | Usable range | Broadcast |
| --- | --- | --- |
| 10.20.1.0/26 | 10.20.1.1 – 10.20.1.62 | 10.20.1.63 |
| 10.20.1.64/26 | 10.20.1.65 – 10.20.1.126 | 10.20.1.127 |
| 10.20.1.128/26 | 10.20.1.129 – 10.20.1.190 | 10.20.1.191 |
| 10.20.1.192/26 | 10.20.1.193 – 10.20.1.254 | 10.20.1.255 |

Each /26 holds 62 hosts, so `10.20.1.0/26` covers the 40 printers and servers. Use `10.20.1.64/26` for management, and keep the other two in reserve.

A handy check when someone hands you a random address: type `10.20.1.77/26` and the tool tells you it lives in network `10.20.1.64`, with hosts from `.65` to `.126` and broadcast `.127`.

For the remaining `10.20.2.0/24`, you might take a /28 from the end for a lab: `10.20.2.240/28` gives 14 usable hosts, from `10.20.2.241` to `10.20.2.254`.

## What about the link to headquarters?

Point-to-point links need exactly two addresses. Traditionally that meant a /30 (four addresses, two usable). The calculator also handles /31, which [RFC 3021](https://www.rfc-editor.org/rfc/rfc3021) allows on point-to-point links because there's no need for a broadcast address. Enter `10.0.0.6/31` and both `10.0.0.6` and `10.0.0.7` show up as usable, with "Usable hosts: 2". A /32 is treated the same way, as a single usable address.

## The final plan

| Segment | Subnet | Usable hosts |
| --- | --- | --- |
| Staff | 10.20.0.0/24 | 254 |
| Servers and printers | 10.20.1.0/26 | 62 |
| Management | 10.20.1.64/26 | 62 |
| Lab | 10.20.2.240/28 | 14 |
| Guest Wi-Fi | 10.20.3.0/24 | 254 |
| Uplink | 10.0.0.6/31 | 2 |

Everything else stays free for future segments, and because every subnet sits on a clean boundary inside the /22, a single route for `10.20.0.0/22` at headquarters still covers the whole office.

## Pitfalls worth avoiding

- **Masks must be contiguous.** You can type `172.16.5.4 255.255.240.0` instead of a prefix, and the tool converts it to /20 (4,094 usable hosts). A mask like `255.0.255.0` is rejected because its 1-bits aren't contiguous.
- **Wildcard masks are not subnet masks.** Cisco ACLs and OSPF use the inverse (`0.0.3.255` for a /22). Copy the right row.
- **Watch the address type.** The "Type" row flags private, loopback, link-local, multicast, documentation and carrier-grade NAT ranges. An address in `100.64.0.0/10` is CGNAT space, not something to put on your office LAN.
- **Large splits are truncated.** The dropdown offers up to 16 prefix lengths beyond the current one, and the list shows the first 256 subnets with a note giving the full count.

For IPv6, the same input box accepts prefixes like `2001:db8:abcd:12::1/64` and shows the network, first and last address, address count and expanded form. There's no broadcast in IPv6, and /64 is the standard LAN size. Everything is calculated in your browser, so internal addressing plans never leave your machine. If you need to read the binary yourself, the [number base converter](/online-tool/developer-tools/number-base-converter) turns any octet into bits.

## FAQ

### Should I use one big subnet or several small ones?

Several small ones are usually easier to secure and troubleshoot, since firewall rules can target a whole segment such as guest Wi-Fi. One big flat network is simpler but lets broadcast traffic and problems spread everywhere.

### Can I work backward from a host count?

Yes. Pick the smallest prefix whose usable host count covers your need: 62 hosts means /26, 126 means /25, and 254 means /24.

Try your own address plan in the [Subnet Calculator](/online-tool/developer-tools/subnet-calculator).
