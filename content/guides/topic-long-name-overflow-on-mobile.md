---
slug: fix-long-name-overflow-on-mobile
title: Fix a Card Layout That Breaks on Long Names on Phones
description: A long name or email spills out of a card on mobile. Find the browser, rebuild the text, size the card in px and see why your CSS fix is ignored.
tags: [CSS, Debugging, Developer Tools]
---

When a long name pushes text out of a card on phones, the fix is usually one CSS line, `overflow-wrap: anywhere`, but you need to reproduce the bug before you can trust it. Read the reporter's browser and device with the [User Agent Parser](/online-tool/developer-tools/user-agent-parser), build a test string of the right length with the [Text Repeater](/online-tool/text-tools/text-repeater), open your browser's device toolbar using the [Keyboard Shortcut Reference](/online-tool/reference-tools/keyboard-shortcuts), work out how much room the name really has with the [CSS Unit Visualizer](/online-tool/developer-tools/css-unit-visualizer), and if the fix doesn't take, check which rule wins in the [CSS Specificity Calculator](/online-tool/developer-tools/css-specificity-calculator). All five run in your browser, so the user agent and CSS you paste stay on your machine.

The example is a small members directory. Each person gets a profile card with their name as an `h3`. A member writes in to say their name runs past the edge of the card and disappears on their phone. Desktop looks fine. The report includes the user-agent string from your feedback form.

## Which browser and device did the bug come from?

Paste the string into the User Agent Parser. It reads one string per line, up to 50, and fills in your own browser's string to start, so clear that first or use the **Use mine** button later to compare. The member's string was this:

```text
Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1
```

The parser shows four boxes: **Browser** Safari 18.0, **Engine** WebKit, **Operating system** iOS 18.0 and **Device type** Mobile. So the bug shows up on a narrow screen in WebKit. If you only test in Chrome on a desktop, you're checking a different engine at a different width. If you collect a few reports, paste all of them, one per line, and click **Copy as CSV** to keep a list of which browsers are affected.

The tool also flags bots. If a "bug report" arrives with a crawler's user agent, it will say so and remind you that anyone can send that string.

## How do you make a test name that's long enough?

A repeatable string is easier to reason about than a long name typed by hand. In the Text Repeater, type `Abcdefghij` (ten characters), set **Repeat (times)** to 6 and **Separate with** to **Nothing**. The output is one unbroken 60-character word:

```text
AbcdefghijAbcdefghijAbcdefghijAbcdefghijAbcdefghijAbcdefghij
```

Because each block is ten characters, you can count where the line overflows at a glance. Switch **Separate with** to **Space** and you get six normal-sized words instead, which is a good second test: spaced text should already wrap, while the unbroken one shows the overflow. You can repeat up to 10,000 times and the output is capped at 2 million characters, which is plenty for a stress test of a bio or address field too. Copy the result and paste it into the name field of a test profile.

Real data has plenty of these. Email addresses and long URLs behave the same way as the test string.

## What's the shortcut for the phone view in DevTools?

Open the Keyboard Shortcut Reference, pick your platform (it's detected automatically), choose the app and set the category to **Developer tools**. In Chrome, **Open DevTools** is F12 or Ctrl + Shift + I on Windows, and Cmd + Option + I on a Mac. **Toggle the device toolbar** is Ctrl + Shift + M on Windows and Cmd + Shift + M on a Mac, with DevTools open and focused. Firefox calls it **Toggle Responsive Design Mode**: Ctrl + Shift + M on Windows, Cmd + Option + M on a Mac.

Two more entries are worth keeping nearby while you test CSS. **Inspect an element** in Chrome is Ctrl + Shift + C on Windows, and **Hard reload (ignore cache)** is Ctrl + Shift + R or Ctrl + F5, so you know you're seeing the stylesheet you just saved. Click any shortcut to copy its key combination.

With the device toolbar open, set a 375 × 812 viewport and load the test profile. The 60-character name runs straight out of the card.

## How much room does the name actually have?

The card's CSS uses relative units, so it helps to turn them into pixels for this viewport. Here's the relevant part:

```css
.profile-card {
  width: 90vw;
  padding: 1.5rem;
}
.profile-card .name {
  font-size: 1.25rem;
}
```

In the CSS Unit Visualizer, set **Viewport width** to 375 and **Viewport height** to 812, and leave **Root font (rem)** at 16. Enter 90 vw: it comes out as 337.5px. Enter 1.5 rem: 24px, so the padding takes 48px across both sides and leaves 289.5px for the name. The name's font size, 1.25rem, is 20px.

The tool also lists the value in every other unit, including ch, the width of the digit 0. The ch ratio is measured in your browser for its default font, so the number you see there matches what your CSS would produce on your machine. Either way, 60 characters at 20px need far more than 289.5px, and with no break opportunity the browser lets the word spill out.

Further down the page you can size a box in any units and see it drawn inside the viewport to scale. Set it to 90 vw wide to picture the card on the phone screen.

## Why is the fix being ignored?

Add the fix to your stylesheet:

```css
.profile-card .name {
  overflow-wrap: anywhere;
}
```

In this example nothing changes, so another rule is winning. Inspecting the `h3` shows an older rule from the sidebar styles, `#sidebar .card h3 { white-space: nowrap; }`, which also applies because the directory renders inside the sidebar. A `nowrap` stops the text from wrapping at all.

Paste both selectors into the CSS Specificity Calculator, one per line:

```text
.profile-card .name
#sidebar .card h3
```

The first scores (0, 2, 0): two classes. The second scores (1, 1, 1): one ID, one class and one element. The ranking puts `#sidebar .card h3` on top, because a single ID beats any number of classes. Source order would only decide if the scores tied.

You have a few options. Set `white-space: normal` on a selector that beats (1, 1, 1), or better, rewrite the old rule as `:where(#sidebar) .card h3`. The calculator shows that `:where()` always counts zero, so that selector drops to (0, 1, 1) and your `.profile-card .name` rule at (0, 2, 0) wins. Load the **Level 4** example in the tool to see how `:is()`, `:not()`, `:has()` and `:where()` are counted.

Reload with the hard-reload shortcut and the 60-character name now wraps inside the card. Test the spaced version and a real long email address too, then check on an actual phone if you have one, since the parser told you the reporter is on WebKit.

## FAQ

### What is the difference between overflow-wrap: anywhere and break-word?

Both let the browser break a long word that would otherwise overflow. With `anywhere`, those break points also count when the browser works out an element's minimum size, so the text can shrink a flex or grid item. With `break-word` they don't, which can leave a flex item too wide.

### Why does my layout look fine on desktop but not on a phone?

The card is sized in vw, so it gets narrower with the viewport while the name's font size in rem stays the same. At 375px wide the name has 289.5px in this example. On a wide desktop window it has far more room, so the overflow never shows.

### Can a user agent string tell me the exact phone model?

Usually not. An iPhone's string says iPhone and the iOS version, not the model. The parser reports the browser, engine, operating system and device type. For screen size, ask the reporter or test common widths.

### How do I repeat text with something between each copy?

Pick **Custom…** under **Separate with** in the Text Repeater and type your own separator in **Custom separator**, such as " | " or a full stop.

More tools for this kind of work are in [Developer Tools](/online-tool/developer-tools), [Text Tools](/online-tool/text-tools) and [Reference Tools](/online-tool/reference-tools).
