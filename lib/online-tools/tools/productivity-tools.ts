import type { ToolDefinition } from '../types';

// Productivity: local-only planners. Data stays in the browser (localStorage).
export const PRODUCTIVITY_TOOLS: ToolDefinition[] = [
  {
    slug: 'decision-matrix',
    category: 'productivity-tools',
    name: 'Decision Matrix',
    icon: '⚖️',
    shortDescription: 'Compare options with weighted criteria and scores.',
    description:
      'Score each option against the criteria that matter, give every criterion a weight, and the decision matrix ranks the options by weighted total — with the winner, the margin and any ties spelled out. Mark costs and risks as “lower is better”, switch between 1–5 and 1–10 scales, and copy the table to a spreadsheet, download it as CSV or print it.',
    title: 'Decision Matrix – Weighted Scoring Calculator & Template',
    metaDescription:
      'Free weighted decision matrix: add options and criteria, set weights and 1–10 scores, and see the ranked totals and winner. Copy to Excel, export CSV or print.',
    keywords: [
      'decision matrix',
      'weighted decision matrix',
      'decision matrix template',
      'weighted scoring model',
      'pugh matrix',
      'pros and cons',
      'compare options',
    ],
    relatedTools: [
      'eisenhower-matrix',
      'kanban-board',
      'wheel-spinner',
      'timeline-maker',
      'random-team-generator',
    ],
    component: 'decision-matrix',
    howTo: [
      'Name the options you are choosing between (the columns) and the criteria you care about (the rows).',
      'Give each criterion a weight. Enter percentages that add up to 100, or any relative points — the tool shows the normalised percentage either way, and “Normalise to 100%” fixes the total.',
      'Score every option on every criterion from 1 to 10 (or 1 to 5). Tick “lower is better” where a low number is the good outcome.',
      'Read the ranking: each option’s weighted total, its rank and how far the winner is ahead. Copy the table, download CSV or print it.',
    ],
    about: [
      'A weighted decision matrix (also called a weighted scoring model or, in engineering, a Pugh-style matrix) turns a fuzzy choice into arithmetic. Each option’s total is the sum of its scores multiplied by the criterion weights: with Price 30%, Quality 40% and Location 30%, an option scored 8, 7 and 9 gets 0.3 × 8 + 0.4 × 7 + 0.3 × 9 = 7.9 out of 10.',
      'The weights matter as much as the scores, so it is worth deciding them before you score — otherwise it is tempting to tune them until your favourite wins. If the top two are within a few tenths of a point, treat it as a tie and look at the criterion where they differ most. Your matrix is saved only in this browser; nothing is uploaded.',
    ],
    faqs: [
      {
        q: 'Do the weights have to add up to 100?',
        a: 'No. The totals always use each weight’s share of the sum, so 3, 4 and 3 give the same result as 30%, 40% and 30%. In percentage mode the tool warns when the total isn’t 100 and can rescale the weights for you.',
      },
      {
        q: 'What does “lower is better” do?',
        a: 'It inverts the score on the chosen scale, so on 1–10 a 2 counts as 9 and a 9 counts as 2. Use it when you rate an amount where less is better, such as cost, commute time or risk.',
      },
      {
        q: 'How are ties handled?',
        a: 'Options with the same weighted total share a rank (1, 1, 3) and the summary names all tied options instead of picking one.',
      },
      {
        q: 'Can I open the matrix in Excel or Google Sheets?',
        a: 'Yes. “Copy table” copies tab-separated values that paste straight into cells, and “Download CSV” saves a file any spreadsheet opens. Text that starts with = or + is prefixed so it can’t run as a formula.',
      },
    ],
  },
  {
    slug: 'eisenhower-matrix',
    category: 'productivity-tools',
    name: 'Eisenhower Matrix',
    icon: '🗂️',
    shortDescription: 'Sort tasks by urgency and importance.',
    description:
      'Sort your to-dos into the four boxes of the Eisenhower matrix — Do first (urgent and important), Schedule (important, not urgent), Delegate (urgent, not important) and Eliminate (neither). Add tasks, drag them between quadrants or use “Move to”, tick them off and clear the done ones. Your list stays in this browser.',
    title: 'Eisenhower Matrix – Online Urgent vs Important Task Planner',
    metaDescription:
      'Free online Eisenhower matrix: sort tasks into Do, Schedule, Delegate and Eliminate, drag them between quadrants and tick them off. Saved privately in your browser.',
    keywords: [
      'eisenhower matrix',
      'urgent important matrix',
      'priority matrix',
      'eisenhower box',
      'time management matrix',
      'prioritize tasks',
      'to do list',
    ],
    relatedTools: [
      'kanban-board',
      'pomodoro-timer',
      'decision-matrix',
      'working-days-calculator',
      'printable-calendar',
    ],
    component: 'eisenhower-matrix',
    howTo: [
      'Type a task, choose its quadrant and press Add task.',
      'Drag a task to another quadrant with the mouse or the ⠿ handle on a touch screen — or pick a quadrant from its “Move to” menu.',
      'Click a task to edit it, tick the box when it’s done, and use “Clear completed” to tidy up.',
      'Export the matrix as JSON to back it up or move it to another device.',
    ],
    about: [
      'The Eisenhower matrix, named after US president Dwight D. Eisenhower and popularised by Stephen Covey as the “time management matrix”, splits tasks by two questions: is it urgent, and is it important? Urgent and important work gets done first; important but not urgent work — planning, learning, health — gets a slot in the calendar; urgent but unimportant requests are delegated; and the rest is dropped.',
      'The point is to notice how much time goes to quadrant 3 and 4 and to protect quadrant 2, where most long-term progress happens. This version is deliberately simple: no accounts, no due dates, no sync. Tasks are kept in your browser’s local storage and never sent anywhere.',
    ],
    faqs: [
      {
        q: 'What is the difference between urgent and important?',
        a: 'Urgent means it demands attention now, usually because someone is waiting or a deadline is close. Important means it moves your own goals forward. Many urgent things aren’t important, and the most important things are rarely urgent.',
      },
      {
        q: 'Where are my tasks saved?',
        a: 'Only in this browser’s local storage on this device. Clearing your browser data removes them, so use Export JSON for a backup.',
      },
      {
        q: 'Can I use it without a mouse?',
        a: 'Yes. Every task has a “Move to” menu and up/down buttons, and all controls are reachable with Tab and Enter.',
      },
    ],
  },
  {
    slug: 'kanban-board',
    category: 'productivity-tools',
    name: 'Kanban Board',
    icon: '📌',
    shortDescription: 'A private Kanban board saved in your browser.',
    description:
      'A simple Kanban board that needs no account: start with To Do, In Progress and Done, add your own columns, and drag cards between them. Cards can have a description, coloured labels and a due date that is flagged when it’s overdue. Everything is saved in this browser and can be exported as JSON.',
    title: 'Kanban Board Online – Free, Private, No Sign-Up',
    metaDescription:
      'Free online Kanban board with no sign-up: drag cards between To Do, In Progress and Done, add labels, due dates and columns. Saved only in your browser; JSON export.',
    keywords: [
      'kanban board',
      'online kanban board',
      'free kanban board',
      'kanban no sign up',
      'task board',
      'personal kanban',
      'trello alternative',
    ],
    relatedTools: [
      'eisenhower-matrix',
      'pomodoro-timer',
      'timeline-maker',
      'decision-matrix',
      'time-card-calculator',
    ],
    component: 'kanban-board',
    howTo: [
      'Type a card title at the bottom of a column and press Add.',
      'Click a card’s title to add a description, labels and a due date.',
      'Drag cards between and within columns, or use the card’s “Move to” menu and ↑ ↓ buttons.',
      'Add, rename (click the name), reorder (← →) or delete columns. Filter cards by text or label with the search box.',
      'Export the board as JSON for a backup, and import it on another device.',
    ],
    about: [
      'Kanban comes from the Toyota production system and was adapted for knowledge work: each card is a piece of work, and each column a stage it passes through. Seeing everything on one board makes it obvious where work piles up — if “In Progress” keeps growing, start fewer things and finish more.',
      'This board is for personal use and small lists. It runs entirely in your browser: cards are stored in local storage on this device, nothing is uploaded, and there is no sharing or sync. Use Export JSON to keep a copy or move the board to another browser.',
    ],
    faqs: [
      {
        q: 'Is my board private?',
        a: 'Yes. Cards are saved only in this browser’s local storage and never sent to a server. That also means other people can’t see it and it doesn’t sync between devices.',
      },
      {
        q: 'Does drag and drop work on a phone?',
        a: 'Yes — drag a card by its ⠿ handle; the board scrolls sideways when you reach the edge. You can also use the “Move to” menu on every card.',
      },
      {
        q: 'How do overdue cards show?',
        a: 'Cards past their due date get a red border and an “Overdue” label, unless they are in a column whose name contains “Done”.',
      },
      {
        q: 'Can I back up or move my board?',
        a: 'Use Export JSON to download the board and Import JSON to load it again. Imports are checked first, and an invalid file changes nothing.',
      },
    ],
  },
  {
    slug: 'timeline-maker',
    category: 'productivity-tools',
    name: 'Timeline Maker',
    icon: '🗓️',
    shortDescription: 'Make a timeline and download it as SVG or PNG.',
    description:
      'Make a clean timeline in your browser: add events with a date, optional time, description, category and colour, and they line up in date order. Switch between a horizontal timeline — spaced by real time or evenly — and a vertical one, then download it as SVG or PNG or print it.',
    title: 'Timeline Maker – Create Timelines Online, Export SVG & PNG',
    metaDescription:
      'Free online timeline maker: add dated events with colours and categories, choose a horizontal or vertical layout and download SVG or PNG. No sign-up, runs offline.',
    keywords: [
      'timeline maker',
      'timeline generator',
      'create a timeline',
      'online timeline',
      'project timeline',
      'history timeline',
      'timeline template',
    ],
    relatedTools: [
      'date-difference-calculator',
      'kanban-board',
      'printable-calendar',
      'working-days-calculator',
      'decision-matrix',
    ],
    component: 'timeline-maker',
    howTo: [
      'Give your timeline a title, or press “Load sample timeline” to start from an example.',
      'Add events with a title and date; time, category, colour and description are optional.',
      'Choose a horizontal view (proportional to time or evenly spaced) or a vertical view.',
      'Use Edit to change an event and ↑ ↓ to reorder events on the same date.',
      'Download the timeline as SVG (sharp at any size) or PNG (2× resolution), or print it.',
    ],
    about: [
      'A timeline shows events in the order they happened, which makes it easy to explain a project plan, a company history or a chapter of a history course. With proportional spacing the distance between events matches the time between them, so gaps and busy periods stand out; even spacing keeps every event the same distance apart when the dates are bunched together.',
      'The SVG export is the exact image you see, made of real text and shapes, so it stays sharp when scaled and can be edited in Figma, Illustrator or Inkscape. The PNG is rendered from that SVG at twice the size for crisp slides. Events are saved in your browser only; dates use the year 1 to 9999 calendar format, so BC dates aren’t supported.',
    ],
    faqs: [
      {
        q: 'What is the difference between proportional and even spacing?',
        a: 'Proportional spacing places each event by its date, so a five-year gap looks five times as long as a one-year gap. Even spacing puts the same distance between all events, which is easier to read when many happen close together.',
      },
      {
        q: 'How do I order two events on the same day?',
        a: 'Add a time to each, or use the ↑ ↓ buttons in the event list — they swap events that share the same date and time.',
      },
      {
        q: 'What happens to an event with an invalid date?',
        a: 'It is kept in the list with an error message but left off the timeline until you fix the date, so imported data is never silently lost.',
      },
      {
        q: 'Is my timeline uploaded anywhere?',
        a: 'No. Everything, including the SVG and PNG export, happens in your browser, and the timeline is saved only in this browser’s local storage.',
      },
    ],
  },
];
