---
slug: how-css-flexbox-shares-space-between-items
tool: flexbox-playground
title: How CSS Flexbox Shares Space, Explained With a Live Playground
description: Learn how flex-direction, justify-content, align-items and the flex shorthand decide where boxes go, then try each one on live items and copy the CSS.
tags: [CSS, Flexbox, Layout, Web Development]
---

CSS flexbox arranges a set of boxes along one line, called the main axis, and then decides two things: how leftover space is shared between the boxes, and where each box sits across that line. The container controls direction, wrapping and alignment. Each item controls how much it grows, how much it shrinks and what size it starts from. Once you see those two layers separately, most flexbox puzzles become easy to read.

## What is flexbox, in one paragraph?

Flexbox is defined in the W3C specification CSS Flexible Box Layout Module Level 1. You turn it on with `display: flex` on a parent element, and every direct child becomes a flex item. The parent lays the items out along a main axis, which runs left to right with `flex-direction: row` and top to bottom with `column`. The perpendicular direction is the cross axis. Almost every flexbox property is about one of those two axes, and the alignment keywords (`center`, `space-between` and friends) come from the related CSS Box Alignment Module Level 3, which grid uses too.

## Which container properties matter most?

The [CSS flexbox playground](/online-tool/developer-tools/flexbox-playground) puts the container settings in a column on the left, in the order you usually think about them:

- **flex-direction** sets the main axis: `row`, `row-reverse`, `column` or `column-reverse`. The reverse values flip the visual order without touching the HTML.
- **flex-wrap** decides whether items stay on one line (`nowrap`, the default) or move onto new lines when they run out of room (`wrap` or `wrap-reverse`).
- **justify-content** spreads free space along the main axis. `space-between` puts all the space between items, `space-around` gives each item equal space on both sides (so the outer gaps are half the inner ones), and `space-evenly` makes every gap identical.
- **align-items** places items on the cross axis. The default, `stretch`, makes them as tall as the line. `baseline` lines up the first line of text inside each item.
- **align-content (wrapped lines)** only does something once items wrap onto several lines. It spaces the lines themselves, the way justify-content spaces items.
- **row-gap** and **column-gap** add fixed space between items and between lines, from 0 to 48px.

An **Items** slider sets how many boxes are in the preview, from 1 to 12. In the preview, items 2, 5, 8 and 11 are drawn a little taller than the rest. That extra height is not part of the CSS. It is there so you can actually see the difference between `flex-start`, `center`, `flex-end` and `baseline`, which would look identical on boxes of equal height.

## How do flex-grow, flex-shrink and flex-basis work?

Click any box, or its number in the row of buttons, to edit it. The item panel has five dropdowns: **flex-grow**, **flex-shrink**, **flex-basis**, **align-self** and **order**.

The first three are usually written together as the `flex` shorthand, in that order. The browser starts each item at its flex-basis (`auto` means "use the content size or the width you set"). Then it compares the total with the container:

- If there is space left over, it hands that space out in proportion to each item's flex-grow. An item with grow 0 never gets any.
- If the items are too big, it takes space away in proportion to flex-shrink multiplied by the basis, so large items give up more than small ones. An item with shrink 0 refuses to get smaller.

Here is the arithmetic for growing. Imagine a row that is 600px wide with a 12px gap, holding three items with no padding, each set to basis `0` and grow 1, 2 and 1. The two gaps use 24px, leaving 576px of free space. That splits into four shares of 144px, so the items end up 144px, 288px and 144px wide. With basis `auto` instead, the items would first take their content width and only the remainder would be split, which is why `flex: 1 1 0` gives equal columns and `flex: 1 1 auto` usually does not.

**align-self** overrides the container's align-items for one item. **order** moves an item earlier or later on screen (the playground offers -1 to 3). Be careful with it: order changes only the visual position, not the reading order or the keyboard tab order, so screen reader and keyboard users still meet the items in HTML order.

## A worked example: a header with a stretchy middle

Say you want a site header: a logo on the left, a search field that takes all spare room, and a button on the right, all centered vertically. Starting from **Reset**:

1. Drag **Items** down to 3.
2. Set **align-items** to `center`.
3. Click item 2, then set its **flex-grow** to `1` and its **flex-basis** to `0`.

The Generated CSS panel now shows:

```css
.container {
  display: flex;
  align-items: center;
  gap: 12px;
}

.item {
  padding: 16px;
}

.item:nth-child(2) {
  flex: 1 1 0;
}
```

Notice what is missing. The output only lists properties that differ from the defaults, so there is no `flex-direction: row` or `flex-wrap: nowrap`. The 12px gap appears because the playground starts both gaps at 12px, and when row-gap and column-gap match it writes them as one `gap`. The `.item` padding block is always included so the copied boxes look like the preview.

Now try setting justify-content to `space-between`. Nothing moves. Item 2 already swallowed all the free space, so there is nothing left to distribute. That is a common source of confusion, and seeing it happen live is the quickest way to remember it.

## How do I check a layout on smaller screens?

Drag **Preview width** between 30% and 100% to squeeze the container. With `nowrap`, items shrink until they reach their content size and then overflow. Switch flex-wrap to `wrap` and they drop onto a new line instead, at which point align-content starts to matter. For sizes in rem, vw or percentages, the [CSS unit visualizer](/online-tool/developer-tools/css-unit-visualizer) shows what each unit means in pixels. **Randomize** builds a random layout to study, and **Reset** returns everything to the starting state.

## When should you use grid instead?

Flexbox is built for one direction at a time: a toolbar, a row of tags, a card's footer. When you need items to line up in rows and columns at once, such as a dashboard or a photo wall, the [CSS grid playground](/online-tool/developer-tools/grid-playground) is the better fit. Many real pages use both, with grid for the overall page and flexbox inside each component. If you paste the result into a larger stylesheet, the [CSS formatter](/online-tool/developer-tools/css-formatter) can tidy the indentation.

## FAQ

### Why won't justify-content do anything?

Either an item with flex-grow above 0 has taken all the free space, or the items already fill the container. justify-content only moves items when there is space left over on the main axis.

### What is the difference between align-items and align-content?

align-items positions items inside their own line. align-content positions the lines inside the container, so it only has an effect when flex-wrap lets items form more than one line.

### Does the generated CSS work in all browsers?

Flexbox and the `gap` property for flex layouts are supported in all current major browsers. Very old browsers from before 2021 may ignore `gap` in flex containers.

Try the header example yourself in the [CSS flexbox playground](/online-tool/developer-tools/flexbox-playground) and copy the CSS when it looks right.
