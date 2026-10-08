---
slug: personal-kanban-board-how-to-set-one-up
tool: kanban-board
title: 'Personal Kanban: How to Set Up a Board That Keeps Work Moving'
description: Where Kanban comes from, how to choose columns, why limiting work in progress helps, and a worked example of a small board with labels and due dates.
tags: [Kanban, Productivity, Project Management]
---

A Kanban board is a set of columns that stand for the stages of your work, with one card for each task. You move a card to the right as the work progresses, so the board always shows what's waiting, what's underway and what's finished. For personal use, three columns (To Do, In Progress, Done) and one simple rule (finish things before starting new ones) are enough to get started.

## Where does Kanban come from?

Kanban is Japanese for "signboard" or "visual card". In the late 1940s and 1950s, Taiichi Ohno and his colleagues at Toyota used cards to signal when a station on the factory floor needed more parts. Work was "pulled" by actual demand instead of being pushed out in large batches.

Software teams adapted the idea in the 2000s. David J. Anderson's 2010 book _Kanban_ described a method built on a few practices: make the work visible, limit work in progress, and manage the flow. Jim Benson and Tonianne DeMaria Barry later applied the same ideas to individuals in _Personal Kanban_. Their two rules were simple: visualize your work, and limit your work in progress.

## How should you choose your columns?

Each column is a stage that a card passes through. Start with the defaults and only add a column when you notice a real step that cards wait in. Common additions:

- **Waiting** or **Blocked**, for tasks stuck on someone else.
- **Review**, for work that someone has to check before it's done.
- **This week**, between To Do and In Progress, to keep the backlog from feeling endless.

In the [Kanban board](/online-tool/productivity-tools/kanban-board), type a name in **New column** and press **Add column**. New columns appear on the right, and ← and → in each column header move it. Click a column's name to rename it, and use ✕ to delete it. If the column has cards, you're asked to confirm first, because its cards are deleted along with it.

## Why limit work in progress?

Every task you've started but not finished costs attention. Switching between five half-done things is slower than finishing two. That's why a Kanban rule of thumb is a work-in-progress (WIP) limit: a maximum number of cards allowed in a column at once. For one person, two or three in In Progress is a good starting point.

This board doesn't enforce limits, but it does show a count next to every column name, so the rule is easy to keep. If In Progress keeps growing while Done stays still, stop pulling new cards and finish what's there. Putting the limit in the name, like "In Progress (max 3)", is a simple reminder.

## A worked example: planning a small website launch

Here's a board for a freelancer building a portfolio site:

| To Do               | In Progress            | Review        | Done              |
| ------------------- | ---------------------- | ------------- | ----------------- |
| Write About page    | Design home page       | Logo from Sam | Buy domain        |
| Set up contact form | Collect project photos |               | Pick color scheme |
| Test on phone       |                        |               |                   |

Steps to build it:

1. Add a column named **Review**. New columns start at the far right, so press ← once in its header to place it between In Progress and Done.
2. At the bottom of To Do, type "Write About page" in **New card…** and press **Add**. Repeat for the other cards.
3. Click the title "Set up contact form" to open the **Edit card** dialog. Add a description, add a label with **+ Add label** (type "Dev" and choose a color such as blue), and set a **Due date (optional)**. Press **Save**.
4. Drag "Design home page" to In Progress, or choose "Move to In Progress" from the menu on the card.

If the contact form was due yesterday and is still in To Do, the card gets a red border and reads "⚠ Overdue" before the date. Once you move it to Done, the warning goes away. The tool treats any column whose name contains the word "Done" as finished, so a column named "Done ✅" counts too.

With the board full, type "Dev" in **Filter cards**. Only matching cards stay visible, and each column count changes to a fraction, such as "1/3", so you can see how many cards are hidden. The filter matches titles, descriptions and label text, and ignores upper and lower case.

## Moving cards without a mouse

Dragging works with a mouse anywhere on the card. On a phone or tablet, drag the ⠿ handle on the card. The board scrolls sideways when you reach the edge. Every card also has a "Move to" menu, and ↑ ↓ buttons to reorder it within its column. Those controls work with the keyboard as well.

## Where is your board stored?

The whole board lives in this browser's localStorage on this device. Nothing is uploaded, there's no sign-up, and nobody else can see it. That also means no sharing and no sync. If you clear your browser's site data, the board is deleted, so export a backup from time to time with **⬇ Export JSON**. **⬆ Import JSON** loads a backup on another device. The file is validated first, and if it's damaged or comes from a different tool, the board is left unchanged. **Clear all** resets the board to empty To Do, In Progress and Done columns.

The limits are generous for personal use: up to 30 columns and 500 cards per column, with up to 10 labels on each card.

## Kanban and other planning tools

A Kanban board shows the flow of work, but not its priority. Many people sort a long backlog with the [Eisenhower matrix](/online-tool/productivity-tools/eisenhower-matrix) first, then pull the important cards onto the board. For a project with dates that matter more than stages, a [timeline](/online-tool/productivity-tools/timeline-maker) shows the order of events at a glance.

## FAQ

### Is a Kanban board the same as Scrum?

No. Scrum works in fixed sprints with planned commitments. Kanban has no sprints. Work flows continuously, and the limits on work in progress keep it from piling up.

### How many columns should a personal board have?

Three to five. Every extra column is another place for cards to wait, so add one only when it reflects a real step.

### Can my team use this board together?

Not at the same time. It's saved in one browser and doesn't sync. You can pass an exported JSON file around, but a shared online tool fits teams better.

Set up your first board in the [Kanban board](/online-tool/productivity-tools/kanban-board) and move one card to Done today.
