---
slug: pdf-metadata-checklist-before-publishing
tool: pdf-metadata-viewer
title: A PDF Metadata Checklist Before You Publish or Send a File
description: Your PDF may show a stranger's name as author, "Untitled" in browser tabs, or the wrong page size. A quick checklist for checking and fixing PDF properties.
tags: [PDF, Metadata, Checklist]
---

Before publishing or sending an important PDF, check its document properties: the **Title** (shown in browser tabs and often in search results), the **Author** (which may be a former colleague or your full name), the **Subject** and **Keywords**, the **Creator** and **Producer** apps, the **dates**, and the **page size**. A metadata viewer shows all of these in one place, and you can correct the title, author, subject and keywords and download an updated copy in under a minute.

Here's what to look for and why each item matters.

## Why bother with PDF metadata?

Metadata is invisible when you read a PDF, but it shows up in surprising places:

- **Browser tabs and PDF viewers** often display the Title instead of the file name. A title like `Microsoft Word - Template_v3_FINAL.docx` looks careless on a client proposal.
- **Search engines** may use the Title when listing a PDF hosted on your website.
- **File properties** in any viewer reveal the Author, which often comes from whoever made the original template, sometimes years ago.
- **Creator and Producer** reveal the software and sometimes the version used.

## The checklist

### 1. Title

**Check:** is it a clean, human title like "2026 Pricing Guide – Acme Studio"?
**Common problems:** empty, a leftover file name, or the name of the template it was copied from.
**Fix:** type a proper title.

### 2. Author

**Check:** is this the name, or organization, you want attached to the document?
**Common problems:** a former employee from the template, a personal account name on a company document, or your full name on something you'd rather publish under a team name.
**Fix:** change it, or clear it completely.

### 3. Subject and keywords

**Check:** are they accurate or empty?
**Common problems:** internal notes, such as a client name in the keywords of a document meant for a different client.
**Fix:** edit or clear them. Keywords are entered comma-separated.

### 4. Creator and Producer

**Check:** what app made the document (Creator) and what wrote the PDF (Producer)?
**Why it matters:** usually harmless, but it can reveal internal tools, and an unexpected producer can hint that a file was modified by something you didn't use. These two fields are shown for reference and aren't editable here.

### 5. Created and Modified dates

**Check:** do the dates make sense? A "new" proposal created three years ago tells the reader it was recycled.
**Note:** saving changes in this tool sets the Modified date to the moment you save.

### 6. Pages and page size

**Check:** is the page count right, and is every page the expected size? Sizes are shown in millimeters: A4 is 210 × 297 mm, US Letter is about 216 × 279 mm.
**Why it matters:** if you see both, for example `210 × 297 mm, 216 × 279 mm`, the file mixes paper sizes, often after merging documents from different countries. That can cause scaling surprises when printing.

## A before-and-after example

| Field    | Before                                       | After                                          |
| -------- | -------------------------------------------- | ---------------------------------------------- |
| Title    | `Microsoft Word - proposal_template_v3.docx` | `Website Redesign Proposal – Northwind Bakery` |
| Author   | `j.smith` (left the company)                 | `Acme Studio`                                  |
| Subject  | _(empty)_                                    | `Proposal and timeline for website redesign`   |
| Keywords | `old client, draft`                          | `proposal, web design, 2026`                   |

Nothing in the visible document changed, but the file now presents itself properly everywhere it's opened.

## How to view and edit PDF metadata

1. Open the [PDF Metadata Viewer](/online-tool/pdf-tools/pdf-metadata-viewer) and choose a PDF.
2. Review the properties list: file size, pages, page size, Creator (app), Producer, Created and Modified.
3. Under **Editable properties**, change **Title**, **Author**, **Subject** or **Keywords (comma-separated)**. To remove a value, clear the field.
4. Click **Save & download PDF**. The new file is saved with `-edited` in its name; the pages themselves aren't touched.
5. Open the downloaded copy in the viewer again to confirm the changes.

The file is read and rewritten in your browser, so confidential drafts stay on your device.

**One caveat:** some PDFs carry a second copy of these properties in an embedded XMP block, and certain apps prefer it. If one particular viewer still shows an old value after editing, that copy is the likely reason. Re-exporting from the original app with the right properties set is the cleanest fix.

## Related clean-up

Images inside your documents carry their own metadata. Photos can include GPS location and camera details, which the [EXIF Viewer](/online-tool/image-tools/image-exif-viewer) can show and remove before you place them in a PDF.

## FAQ

### Does editing metadata change the PDF's content or quality?

No. Only the document properties are rewritten. Pages, text, images and links stay exactly as they were.

### Can I edit a password-protected PDF's properties?

No. The file has to be unlocked first: open it with the password and save an unprotected copy.

### Is the file name part of the metadata?

No. The file name belongs to your computer's file system, not to the PDF. Rename the downloaded file separately if needed.

Run your next PDF through the [PDF Metadata Viewer](/online-tool/pdf-tools/pdf-metadata-viewer) before you hit send.
