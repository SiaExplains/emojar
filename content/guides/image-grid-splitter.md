---
slug: how-to-split-a-photo-into-an-instagram-grid
tool: image-grid-splitter
title: How to Split a Photo Into an Instagram Grid That Lines Up
description: A start-to-finish walkthrough of turning one wide photo into a 3×3 Instagram puzzle, with real tile sizes, the right posting order and the pitfalls to avoid.
tags: [Images, Instagram, How-to]
---

To turn one photo into an Instagram grid, cut it into equal tiles three columns wide, then post the tiles in reverse: the bottom-right piece goes up first and the top-left piece goes up last. Instagram puts each new post at the top left of your profile, so posting backward is what makes the picture reassemble. The [Image Grid Splitter](/online-tool/image-tools/image-grid-splitter) cuts the tiles and prints the posting number on each one, so you don't have to work out the order in your head.

Below is a complete example, from a single landscape photo to nine posts on a profile.

## The scenario: a 3×3 launch post for a small shop

Say you run a small bakery account and want your new storefront photo to fill the top of your profile for launch week. The photo came off a camera at **3000 × 2000 pixels**, a 3:2 landscape. A 3×3 grid gives you nine posts and a big, eye-catching block on the profile page.

Before cutting anything, make two decisions: how many rows, and what shape each tile should be.

## Which grid should you pick?

Instagram profiles are always three posts wide, so every useful preset in the tool has three columns:

| Grid preset                     | Posts | Good for                                     |
| ------------------------------- | ----- | -------------------------------------------- |
| 1 row × 3 (panorama, 3 posts)   | 3     | Wide landscapes, banners, a single headline  |
| 2 rows × 3 (6 posts)            | 6     | Medium announcements                         |
| 3 rows × 3 (9 posts)            | 9     | The classic full-screen puzzle               |
| 4 rows × 3 (12 posts)           | 12    | Tall posters, or a really big reveal         |
| 1 row × 2 (carousel)            | 2     | A two-slide carousel that pans across a shot |

There's also **Custom**, which accepts 1 to 10 rows and 1 to 10 columns. Anything other than three columns won't line up on a profile, but it's handy for carousels or for cutting a poster into printable pieces.

For the bakery, **3 rows × 3** is the natural choice.

## What tile shape do you need?

The **Tile shape** setting decides how much of the photo survives. Unless you pick "Keep the image as is", the tool takes the largest area from the center of your photo that fits the chosen shape, then divides it evenly. Here's what each option does to the 3000 × 2000 storefront photo on a 3×3 grid:

| Tile shape                                    | Area kept from the photo | Each tile        |
| --------------------------------------------- | ------------------------ | ---------------- |
| Square tiles (1:1)                            | 2000 × 2000, centered    | about 667 × 667  |
| Portrait tiles (4:5 — Instagram post)         | 1600 × 2000, centered    | about 533 × 667  |
| Portrait tiles (3:4 — Instagram profile grid) | 1500 × 2000, centered    | 500 × 667        |
| Keep the image as is                          | All 3000 × 2000          | 1000 × 667       |

The tiles say "about" because 2,000 pixels don't divide evenly by three. The tool rounds each edge to a whole pixel, so some tiles come out 666 pixels and some 667. That's invisible once posted, and it means no pixel is lost or duplicated at the seams.

Square tiles give the classic puzzle look. The tool's own guidance points out that Instagram's profile grid now previews posts at 3:4, so pick the 3:4 shape if you want the pieces to meet exactly on the profile page itself.

Notice how much of a landscape photo a 3×3 grid of portrait tiles throws away: half the width disappears at 3:4. If the storefront sign sits off to one side, a centered crop could slice through it.

## The steps in the tool

1. Open the [Image Grid Splitter](/online-tool/image-tools/image-grid-splitter) and choose your photo.
2. Pick a **Grid** preset and a **Tile shape**. The line under the settings confirms the result, for example "9 tiles · 667 × 667 px each".
3. Keep **Show posting order on preview** ticked and check the numbers on the preview. Number 1 sits in the bottom-right tile, and the highest number in the top left.
4. Click **Split image**. The tiles appear underneath in posting order, each with its own "Post 1", "Post 2" download link.
5. Click **Download all (ZIP)** to grab everything at once.

The photo is cut in your browser, so nothing is uploaded anywhere.

## What's in the ZIP?

Each file name carries both the posting number and the tile's position, so a storefront photo named `bakery.jpg` produces files like `bakery-post-01-r3c3.jpg` (row 3, column 3) up to `bakery-post-09-r1c1.jpg`, inside `bakery-grid-3x3.zip`. Sorted by name, they're already in the order you'll post them.

Tiles are cut straight from the original pixels with no resizing. PNG uploads stay PNG; everything else is saved as a JPG at 95% quality.

## Pitfalls that break the puzzle

- **The subject isn't centered.** Because the shaped crop is always taken from the middle, crop the photo yourself first with the [Image Cropper](/online-tool/image-tools/image-cropper) if the important part sits near an edge.
- **Something gets posted in between.** One stray post in the middle shifts every later tile by a column. Post all nine in one sitting.
- **Single posts afterward.** Each new post pushes the puzzle along by one. Adding posts in groups of three keeps it aligned as it moves down the profile.
- **Carousels run the other way.** Carousel slides are uploaded left to right, the opposite of the profile order. For a 1 row × 2 carousel, use the position in the name instead: `r1c1` is the first slide, `r1c2` the second.

## FAQ

### Can I re-split the same photo with a different shape?

Yes. Change the grid or tile shape and the preview updates immediately; click **Split image** again to make the new set. The earlier tiles are cleared when the settings change, so download them first if you want to keep both.

### Do I need a huge photo for this to look good?

For the profile view, no: thumbnails are small, and 500-pixel tiles look crisp there. It matters when someone taps a single tile and sees it full width. To get square tiles of 1,080 pixels, the size Instagram recommends for square posts, a 3×3 grid needs a source of at least 3240 × 3240 pixels.

### Will the numbers appear on the downloaded tiles?

No. The posting numbers are drawn on the preview only, as a guide. The tiles you download are clean.

Ready to plan your own puzzle feed? Open the [Image Grid Splitter](/online-tool/image-tools/image-grid-splitter) and try it on your photo.
