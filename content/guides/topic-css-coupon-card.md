---
slug: style-a-discount-coupon-card-in-css
title: Style a Discount Coupon Card in CSS, From Colour to Hover Tilt
description: Turn a brand colour into a gradient, lay out a coupon with flexbox, round two corners, cut a tag point with clip-path and add a hover tilt, all in plain CSS.
tags: [CSS, Web Design, Developer Tools]
---

You can build a coupon card in plain CSS with five properties: a `linear-gradient()` background, a flexbox row for the content, a `border-radius` on the left corners, a `clip-path` polygon that cuts a point on the right, and a `transform` for the hover state. Each one has a visual generator on Emojar that writes the CSS for you. Start with the [Color Converter](/online-tool/color-tools/color-converter) to get your brand colour into a shape you can adjust, build the background in the [CSS Gradient Generator](/online-tool/color-tools/gradient-generator), lay out the content in the [CSS Flexbox Playground](/online-tool/developer-tools/flexbox-playground), shape it with the [CSS Border Radius Generator](/online-tool/developer-tools/border-radius-generator) and the [CSS Clip-Path Generator](/online-tool/developer-tools/clip-path-generator), and finish in the [CSS Transform Playground](/online-tool/developer-tools/css-transform-playground).

The example is a small bakery website that wants a "20% off this week" banner above its menu. The brand colour is coral. The coupon should have the discount on the left, a line of text in the middle and the code `BAKE20` on the right. It should look like a paper tag, rounded on the left and pointed on the right.

## How do you turn one brand colour into a gradient?

A gradient needs at least two colours, and the bakery only has one. Type `coral` into the Color Converter. It accepts HEX, RGB, HSL and common CSS names, and shows the colour in every format at once:

- HEX `#ff7f50`
- RGB `rgb(255, 127, 80)`
- HSL `hsl(16, 100%, 66%)`

HSL is the useful row here. The last number is lightness, so you can make a darker coral by lowering it and leaving hue and saturation alone. Type `hsl(16, 100%, 40%)` into the same box and the HEX row reads `#cc3600`, a deep burnt orange from the same family.

Now open the Gradient Generator. Leave **Type** on Linear and set **Angle** to 90° so the colour runs from left to right. Set the first colour stop to `#ff7f50` at 0% and the second to `#cc3600` at 100%. You can add up to six stops with **+ Add stop**, but two are enough for a coupon. The CSS panel gives you two lines:

```css
background: #ff7f50;
background: linear-gradient(90deg, #ff7f50 0%, #cc3600 100%);
```

The first line is a solid fallback in the first stop's colour. The browser draws the gradient itself, so it scales to any coupon size and adds no image to download.

## How do you lay out the coupon's content with flexbox?

The coupon has three pieces in a row, and flexbox handles one row well. In the Flexbox Playground, set **Items** to 3 so the preview matches. Under the container settings, choose `space-between` for **justify-content** to push the discount to the left edge and the code to the right, and `center` for **align-items** so the three line up through the middle even if one is taller.

Drag **row-gap** and **column-gap** to 16px. When both match, the tool writes a single `gap` line.

The middle text should take whatever room is left. Click item 2 and set its **flex-grow** to 1. The generated CSS only includes properties that differ from the defaults, so it stays short:

```css
.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.item {
  padding: 16px;
}

.item:nth-child(2) {
  flex: 1 1 auto;
}
```

Drag **Preview width** down toward its 30% minimum to see what happens on a narrow phone. All three items keep the default flex-shrink of 1, so they all get narrower together. If the text gets too cramped, try `wrap` under **flex-wrap** and watch the code drop to a second line.

## How do you round only the left corners?

The tag should be rounded where you'd hold it and pointed at the other end. In the Border Radius Generator, untick **Link all corners** so each corner gets its own slider. Set Top left and Bottom left to 16, and Top right and Bottom right to 0, with the unit on px.

The tool writes the shortest valid form of the property. Corners are listed in the order top-left, top-right, bottom-right, bottom-left, so this comes out as:

```css
border-radius: 16px 0 0 16px;
```

The **Ticket tab** preset looks tempting, but it rounds the two top corners by 24px, which fits a tab sitting on top of a panel. For a coupon on its side you want the left pair.

## How do you cut a pointed tag shape with clip-path?

Open the Clip-Path Generator with **Shape** on Polygon and pick the **Chevron** preset. It has six points, and one of them, point 5 at 25% 50%, is the notch on the left side. Select it and press Delete. You're left with five points, and the left edge becomes straight again.

In the point list, change the x of point 1 and point 3 from 75 to 90. If you'd rather drag the points, set **Snap to grid** to 5% first so they land on round numbers. The point now starts 10% from the right edge, which is about right for a wide banner. The CSS reads:

```css
clip-path: polygon(
  90% 0%,
  100% 50%,
  90% 100%,
  0% 100%,
  0% 0%
);
```

The coordinates are percentages of the element's width and height, so the same shape works whether the coupon is 300px or 900px wide. The left two points sit on the corners of the box, so the 16px radius from the last step still shows there.

clip-path also clips any `box-shadow`, because the shadow sits outside the shape. The clipped-away area stops receiving clicks and hover too, so the clickable area matches what people see.

## How do you add a small tilt on hover?

A slight rotation and a slight zoom make the coupon feel like something you can pick up. In the Transform Playground, set **Rotate** to -3° and leave **Same scale for X and Y** ticked while you move **Scale** to 1.05. The tool writes only the functions you changed:

```css
transform: rotate(-3deg) scale(1.05);

/* Same as one matrix: */
transform: matrix(1.048561, -0.054953, 0.054953, 1.048561, 0, 0);
```

Put the first line inside `.coupon:hover` and add a `transition: transform 0.2s` to the base rule. You don't need the matrix line, but it shows what the browser computes from the two functions.

A transform doesn't trigger layout the way changing `top` or `left` does, so the menu below stays put while the coupon tilts. The transform-origin stays at the centre by default. If you'd rather the tag swing from its rounded end, pick the middle-left square in the origin grid and the tool adds `transform-origin: left center`.

All six tools draw their previews in your browser, and nothing you type is uploaded.

## FAQ

### Why does the gradient CSS have two background lines?

The first line is a solid colour taken from the first stop. Gradients work in every modern browser without prefixes, so the fallback rarely shows, but it costs nothing to keep.

### Can I put a box-shadow on a clip-path shape?

Not on the same element, because clip-path clips the shadow as well. Put the clip-path on an inner element and use `filter: drop-shadow()` on a wrapper around it.

### Why does the border-radius output have fewer than four values sometimes?

The generator writes the shortest equivalent form. Four equal corners become one value and matching diagonals become two. Our coupon needs all four, because top-left and bottom-left differ from the other two.

### Does the order of rotate and scale matter?

For rotate and scale around the same origin, the result looks the same either way. Order matters once translate is involved, because each function works in the coordinate system left by the one before it. The Transform Playground always writes translate, rotate, scale, skew in that order.

More colour tools are in [Color Tools](/online-tool/color-tools), and the other CSS generators are in [Developer Tools](/online-tool/developer-tools).
