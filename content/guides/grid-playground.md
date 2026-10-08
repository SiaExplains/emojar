---
slug: css-grid-lines-tracks-and-fr-units-explained
tool: grid-playground
title: CSS Grid Lines, Tracks and fr Units, Explained Visually
description: How grid-template-columns, the fr unit and numbered grid lines work together, with a holy-grail layout you can build, resize and copy as CSS.
tags: [CSS, Grid, Layout, Web Development]
---

CSS grid divides a container into columns and rows, called tracks, separated by numbered lines. You describe the tracks once on the parent with `grid-template-columns` and `grid-template-rows`, and then place each child by naming the lines it starts and ends on. The `fr` unit shares out whatever space is left after fixed tracks and gaps. If you can count the lines, you can place anything.

## What are tracks, lines and cells?

The W3C specification CSS Grid Layout Module Level 1 uses a small vocabulary that is worth learning, because every property name builds on it:

- A **track** is one column or one row.
- A **grid line** is the boundary between tracks. Three columns have four vertical lines, numbered 1 to 4 from the start edge.
- A **cell** is where one row and one column cross, and a **grid area** is any rectangle of cells.
- **Gaps** sit between tracks. They are not tracks themselves, so they never get a line number of their own.

The [CSS grid playground](/online-tool/developer-tools/grid-playground) prints the line numbers in small type along the top and left edges of the preview. They are not guessed. The page reads the resolved track sizes back from your browser with `getComputedStyle` and recalculates them whenever the grid or the preview width changes, so the numbers always match the layout the browser really drew.

## How does the fr unit divide space?

`fr` means a fraction of the free space. The browser first subtracts fixed tracks (like `200px`), content-sized tracks (like `auto`) and the gaps from the container size. What remains is split among the fr tracks in proportion to their numbers.

Take `200px 1fr 200px` with an 8px column gap in a grid whose content area is 800px wide. The fixed columns use 400px and the two gaps use 16px, leaving 384px. There is only one fr track, so it gets all 384px. Change the template to `200px 1fr 2fr` and the free space becomes 584px, which splits into one share of about 194.7px and two shares of about 389.3px.

Two helpers come up constantly. `repeat(3, 1fr)` is shorthand for `1fr 1fr 1fr`. `minmax(120px, 1fr)` says a track may never be narrower than 120px but can grow to share free space. Combine them as `repeat(auto-fill, minmax(120px, 1fr))` and the browser creates as many columns as fit, which gives you a responsive gallery with no media queries.

The grid-template-columns and grid-template-rows fields are free text, so you can type any valid value, including `auto`, percentages, `minmax()` and `repeat()`. If you leave rows empty, the property is left out of the CSS and the browser creates rows automatically as items need them.

## How do you place an item by line number?

Click a colored box, or its number above the placement fields, and you get four inputs: **grid-column-start**, **grid-column-end**, **grid-row-start** and **grid-row-end**. A line of monospace text under them shows the shorthand the item will get, such as `grid-column: 1 / 3; grid-row: auto;`.

- `1 / 3` runs from line 1 to line 3, which covers two columns.
- `span 2` as the end value means "two tracks from wherever I start". With an `auto` start, the item is placed automatically and simply made two tracks wide.
- `-1` is the last line of the explicit grid, so `1 / -1` stretches an item across every column you defined, however many there are.

Empty a field and it goes back to `auto`. Items you don't place flow into the next free cells in the direction set by **grid-auto-flow**: `row`, `column`, `row dense` or `column dense`. The dense variants backfill earlier holes with later, smaller items. That can make a tidy mosaic, but it also means the visual order no longer matches the HTML order, which can confuse keyboard and screen reader users.

## A worked example: the holy grail layout

The "holy grail" is a classic page shape: a header across the top, a main column between two sidebars, and a footer across the bottom. Click the **Holy grail page** example and the playground loads five items with these settings. The Generated CSS panel reads:

```css
.container {
  display: grid;
  grid-template-columns: 200px 1fr 200px;
  grid-template-rows: auto 1fr auto;
  gap: 8px;
}

.item:nth-child(1) {
  grid-column: 1 / 4;
}

.item:nth-child(5) {
  grid-column: 1 / 4;
}
```

Item 1 spans from line 1 to line 4, the full width, so it becomes the header. Items 2, 3 and 4 have no placement, so auto-flow drops them into the three cells of the second row: left sidebar, main content, right sidebar. Item 5 is the footer. The rows are `auto 1fr auto`, so the header and footer are only as tall as their content and the middle row takes any extra height.

Now drag **Preview width** down toward 30%. The sidebars stay at 200px while the middle column shrinks. That is exactly what `fr` promises, and it shows why real sites switch to a single column on phones with a media query. Because row-gap and column-gap are equal, the CSS uses one `gap` declaration. Set them differently and you get `row-gap` and `column-gap` lines instead.

The other examples are worth a look too. **Dashboard** uses `span` values on a four-column grid to make a large two-by-two tile, a wide tile and a full-width strip. **12-column layout** shows the classic content-plus-sidebar split as `1 / span 8` and `9 / span 4`. **Photo gallery (auto-fill)** loads ten items into the auto-fill pattern above. **Reset** goes back to the default three-by-two grid.

## What do the alignment settings do?

Grid has two pairs of alignment properties. **justify-items** and **align-items** (stretch, start, center or end) position each item inside its own cell, horizontally and vertically. **justify-content** and **align-content** move the whole set of tracks inside the container. They only matter when the tracks are smaller than the container, for example fixed `100px` columns in a wide box. These keywords come from CSS Box Alignment Module Level 3, which is also where `gap` lives, so they mean the same thing in flexbox.

## Grid or flexbox?

Use grid when items need to line up in two directions at once, and the [CSS flexbox playground](/online-tool/developer-tools/flexbox-playground) when you have a single row or column whose items should size themselves from their content. For checking what values like `20vw` or `2rem` mean in pixels, the [CSS unit visualizer](/online-tool/developer-tools/css-unit-visualizer) is a good companion.

## FAQ

### Why does my grid have more lines than I expected?

Items placed beyond the explicit grid, or extra items with no room left, make the browser add implicit tracks. Line numbers continue past your template, and negative numbers still count from the end of the explicit grid only.

### Can I name areas with grid-template-areas?

Not in this playground. It works with line numbers and spans. Named areas are a separate CSS feature that you can add by hand after copying the CSS.

### Is span 2 the same as 1 / 3?

Only when the item starts at line 1. `span 2` keeps the width but lets the start move, while `1 / 3` pins both edges.

Open the [CSS grid playground](/online-tool/developer-tools/grid-playground), load the holy grail example and start moving lines around.
