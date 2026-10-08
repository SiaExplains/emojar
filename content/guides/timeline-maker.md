---
slug: how-to-make-a-timeline-proportional-vs-even-spacing
tool: timeline-maker
title: 'How to Make a Clear Timeline: Layouts, Spacing and Export'
description: When to use proportional or even spacing, horizontal or vertical layouts, and SVG or PNG export, with a worked example built from a five-event project plan.
tags: [Timeline, Productivity, Design]
---

To make a clear timeline, list your events with a date for each, let them sort into date order, then pick a layout that fits the story. Proportional spacing shows real gaps between events, even spacing keeps crowded dates readable, and a vertical layout suits long lists with descriptions. Then export it: SVG for documents you'll scale or edit, PNG for slides and chat.

## What makes a timeline easy to read?

A timeline answers two questions at once: in what order did things happen, and how far apart were they? A good one makes both obvious without the reader having to compare dates in their head. A few rules help:

- **Keep titles short.** Two to five words on the card, with details in the description.
- **Use color for meaning, not decoration.** One color per category (planning, design, launch) lets readers spot patterns.
- **Choose the spacing on purpose.** This matters most, and it's covered below.
- **Leave out the noise.** Ten well-chosen events tell a story better than forty.

## Proportional or even spacing?

In the horizontal view of the [timeline maker](/online-tool/productivity-tools/timeline-maker), the **Spacing** menu offers two options.

**Proportional to time** places each event on the axis by its date and time, so the distance between dots matches the time between events. A three-month gap looks three times as long as a one-month gap. Use it when the gaps themselves are part of the story: a slow start followed by a busy launch month, or a long quiet period in a company's history.

**Evenly spaced** puts the same distance between every pair of neighboring events, and alternates cards above and below the axis. Use it when events bunch together, such as six things in one week and then nothing for a year, or when only the order matters.

The **Vertical** view always lists one event per row, top to bottom, with the date to the left of the line and the card to the right. It handles long lists and longer descriptions better, and it reads naturally on a phone or a printed page.

## A worked example: a product launch plan

The tool opens with a sample timeline called "Product launch 2025". You can bring it back at any time with **Load sample timeline**:

| Event           | Date              | Category    | Days after kick-off |
| --------------- | ----------------- | ----------- | ------------------- |
| Kick-off        | 13 Jan 2025       | Planning    | 0                   |
| Design sign-off | 28 Feb 2025       | Design      | 46                  |
| Beta release    | 7 Apr 2025, 09:00 | Engineering | 84                  |
| Press briefing  | 20 May 2025       | Marketing   | 127                 |
| Public launch   | 2 Jun 2025, 10:00 | Milestone   | 140                 |

With proportional spacing, the gaps of 46, 38 and 43 days come out roughly equal on the axis, while the last gap, 13 days from the press briefing to the launch, is much shorter. The Press briefing and Public launch cards would overlap if they sat side by side, so the layout moves the launch card into a second row above the axis instead of letting them collide. That tightening at the end is exactly what a reader should notice: the final push is fast.

Switch to **Evenly spaced** and all five dots sit the same distance apart. The order is just as clear, but the last-minute rush disappears. Neither view is wrong. They tell slightly different stories, so pick the one that matches your point.

## Adding and arranging events

The **Add an event** form takes a **Title** and a **Date**. **Time (optional)**, **Category (optional)**, **Colour** and **Description (optional)** are optional. Pick one of the seven preset colors, or use the color picker for any other. Dates come from the browser's date input, and the time is in 24-hour HH:MM form.

You never drag events into place. They are sorted by date and time automatically. Two events on the same date and time keep the order you added them in, and the ↑ ↓ buttons in the event list swap them. Those buttons are only enabled when there's a neighbor at exactly the same moment. Adding a time is often the cleaner way to order a busy day.

Click **Edit** on an event to load it back into the form, then **Save event**. An event with a broken date, for example from an imported file, stays in the list with an error message but is left off the drawing until you fix it. Dates run from year 1 to 9999, so BC dates aren't supported.

## SVG, PNG or print?

**⬇ Download SVG** saves exactly what you see as a vector file made of real text and shapes. It stays sharp at any size, works in web pages and documents, and can be edited in Figma, Illustrator or Inkscape. Dates on the cards are written in a fixed English format, such as "7 Apr 2025, 09:00", so the file looks the same everywhere.

**⬇ Download PNG** renders that SVG at twice its size, which looks crisp on slides and high-resolution screens. A very large timeline is saved at a lower scale instead, because browsers limit how big an image canvas can be, and the status line tells you the scale it used. **🖨 Print** prints only the timeline.

The file name comes from your title, so "Product launch 2025" downloads as product-launch-2025.svg.

## Is your timeline private?

Yes. Drawing and exporting both happen in your browser, and nothing is uploaded. Your title and events are saved in this browser's localStorage, so they're still there next time on the same device. Clearing your site data deletes them. To keep a copy or move to another computer, use **⬇ Export JSON** and later **⬆ Import JSON**. Imports are checked before anything is replaced.

For the exact number of days between two events, the [date difference calculator](/online-tool/date-time-tools/date-difference-calculator) is quicker than counting. To track the tasks behind each milestone, pair your timeline with a [Kanban board](/online-tool/productivity-tools/kanban-board).

## FAQ

### How many events can a timeline hold?

Up to 300. Beyond a few dozen, the vertical view is usually easier to read.

### Why do some cards appear in a second row?

In proportional mode, events that are close together would overlap. The layout stacks those cards into extra rows above or below the axis so every card stays readable.

### Can I change the fonts or the background?

No. The style is fixed so the export is clean and consistent. Because the SVG is real text, you can restyle it in a vector editor afterward.

Lay out your own project or history in the [timeline maker](/online-tool/productivity-tools/timeline-maker), then download it as SVG or PNG.
