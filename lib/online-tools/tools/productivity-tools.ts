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
      'online-notepad',
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
  {
    slug: 'resume-builder',
    category: 'productivity-tools',
    name: 'Resume Builder',
    icon: '📄',
    shortDescription: 'Build a clean CV and download it as a PDF.',
    description:
      'Create a professional resume (CV) in your browser: fill in your details, work experience, education and skills, pick a Classic or Modern template and an accent colour, and download a text-based PDF that applicant tracking systems can read. Your resume autosaves in this browser — no sign-up, no watermark.',
    title: 'Free Resume Builder – Make a CV and Download PDF',
    metaDescription:
      'Free resume builder with no sign-up: fill in your experience and skills, pick a template and download an ATS-friendly PDF CV. Autosaves privately in your browser.',
    keywords: [
      'resume builder',
      'free resume builder',
      'cv maker',
      'cv builder',
      'resume maker no sign up',
      'resume pdf',
      'ats resume',
    ],
    relatedTools: [
      'email-signature-generator',
      'profile-picture-maker',
      'word-counter',
      'invoice-generator',
      'online-notepad',
    ],
    component: 'resume-builder',
    handlesFiles: true,
    howTo: [
      'Fill in your personal details, a short profile summary and your work experience — one achievement per line. Or press “Load example” to start from a sample resume.',
      'Add education, optional projects, skills and languages. Reorder entries with Move up and Move down; the live preview updates as you type.',
      'Choose the Classic (one column) or Modern (sidebar) template, A4 or US Letter paper and an accent colour.',
      'Press Download PDF. Export a JSON backup to keep your resume or move it to another device.',
    ],
    about: [
      'A resume (or CV) works best when it is easy to scan: your name and contact details at the top, a two- to four-sentence profile, then experience in reverse order with achievements that start with a verb and include a number — “cut booking drop-off by 23%” says more than “responsible for the booking flow”. One page is enough for most people with under ten years of experience.',
      'Many employers run resumes through an applicant tracking system (ATS) before a person reads them. The PDF this builder makes contains real, selectable text in a single reading order with standard headings, which those systems parse reliably — unlike resumes exported as images. The built-in PDF font covers Latin alphabets; for other scripts, use Print → Save as PDF. Everything stays in your browser.',
    ],
    faqs: [
      {
        q: 'Is this resume builder really free?',
        a: 'Yes. There is no sign-up, no watermark and no paywall on the download. The resume is built and saved entirely in your browser.',
      },
      {
        q: 'Is the PDF ATS-friendly?',
        a: 'Yes. It uses real text (not an image), standard section headings such as Experience and Education, and a simple layout, so applicant tracking systems can read your name, jobs, dates and skills. The Classic template is the safest choice for very strict systems.',
      },
      {
        q: 'Where is my resume stored?',
        a: 'Only in this browser’s local storage, so it is still there when you come back on the same device. Use Export JSON to back it up or open it on another computer, and Import JSON to load it again.',
      },
      {
        q: 'Should I use A4 or US Letter?',
        a: 'Use US Letter for jobs in the United States and Canada and A4 almost everywhere else. The builder picks a default from your browser’s language, and you can change it at any time.',
      },
      {
        q: 'Can I write my resume in another language?',
        a: 'Yes, as long as it uses Latin letters (English, Spanish, German, French, Turkish and so on). For Cyrillic, Arabic, Persian, Chinese and other scripts, use “Print / Save as PDF”, which uses your system fonts.',
      },
    ],
  },
  {
    slug: 'online-notepad',
    category: 'productivity-tools',
    alsoIn: ['text-tools'],
    name: 'Online Notepad',
    icon: '🗒️',
    shortDescription: 'Write notes that save automatically in your browser.',
    description:
      'A simple online notepad: type and your notes save automatically in this browser. Keep many notes, search them, see word and character counts, switch to a distraction-free focus mode and download any note as .txt or .md. No account and nothing uploaded.',
    title: 'Online Notepad – Free Notes That Save in Your Browser',
    metaDescription:
      'Free online notepad that autosaves in your browser: multiple notes, search, word count, focus mode and .txt or .md download. No sign-up, nothing is uploaded.',
    keywords: [
      'online notepad',
      'notepad online',
      'online notes',
      'notepad',
      'write notes online',
      'text editor online',
      'scratchpad',
    ],
    relatedTools: [
      'word-counter',
      'markdown-previewer',
      'kanban-board',
      'find-and-replace',
      'text-diff',
    ],
    component: 'online-notepad',
    howTo: [
      'Start typing in the editor — every change saves automatically in this browser.',
      'Press New note for another page. The first line becomes the note’s title in the list, and the search box finds notes by any word they contain.',
      'Use Focus mode for a full-screen editor (Esc to leave), and switch on Monospace or a larger text size if you like.',
      'Download a note as .txt or .md, print it, or export all notes as a JSON backup.',
    ],
    about: [
      'An online notepad is the quickest place to park text: a phone number, a draft email, meeting notes or a list you will paste somewhere else later. This one keeps every note in your browser’s local storage, so it is there when you come back on the same device and browser, works offline once the page has loaded, and never sends your text to a server.',
      'Because notes live in the browser, clearing site data or using a private window removes them. Export a JSON backup for anything you want to keep long-term, or download single notes as plain text (.txt) or Markdown (.md), which every editor can open. Browsers allow roughly 5 MB of storage per site — about a thousand pages of text — and the notepad warns you well before that fills up.',
    ],
    faqs: [
      {
        q: 'Are my notes saved?',
        a: 'Yes, automatically, in this browser’s local storage. They stay when you close the tab or restart the computer, but not if you clear your browsing data or use a private window. Export a backup to be safe.',
      },
      {
        q: 'Can anyone else see my notes?',
        a: 'No. Notes never leave your device — there is no account, no server and no sync. Anyone using the same browser profile on your computer could open the page and see them, though.',
      },
      {
        q: 'Can I use it on my phone?',
        a: 'Yes. The notepad works in mobile browsers; notes are stored separately on each device and browser, so move them with Export and Import JSON.',
      },
      {
        q: 'How many notes can I keep?',
        a: 'Up to 200 notes. The practical limit is your browser’s storage, roughly 5 MB per site; the notepad shows a warning if you get close.',
      },
    ],
  },
  {
    slug: 'flashcard-maker',
    category: 'productivity-tools',
    alsoIn: ['reference-tools'],
    name: 'Flashcard Maker',
    icon: '🃏',
    shortDescription: 'Make flashcards, study them and quiz yourself.',
    description:
      'Create flashcard decks, study them with spaced repetition and test yourself with a multiple-choice or typed quiz. Add cards one by one or paste a whole list (Quizlet export or CSV), and see which cards you have mastered. Everything is saved in this browser — no account.',
    title: 'Flashcard Maker – Free Online Flashcards & Quiz',
    metaDescription:
      'Free online flashcard maker: create decks, import from Quizlet or CSV, study with spaced repetition (Leitner boxes) and quiz yourself. Saved in your browser, no sign-up.',
    keywords: [
      'flashcard maker',
      'online flashcards',
      'flashcards',
      'quiz maker',
      'spaced repetition',
      'study cards',
      'quizlet alternative',
    ],
    relatedTools: [
      'online-notepad',
      'pomodoro-timer',
      'typing-speed-test',
      'periodic-table',
      'wheel-spinner',
    ],
    component: 'flashcards',
    handlesFiles: true,
    howTo: [
      'Name your deck and add cards with a front (question or term) and a back (answer or definition) — or paste many at once, one card per line as “term<Tab>definition” or CSV.',
      'Open Study: read the front, flip the card with a click or Space, then choose Again or Got it. Known cards move up a box and come back less often.',
      'Open Quiz for a multiple-choice or typed test of the whole deck, with a score and a review of your mistakes at the end.',
      'Export a deck as CSV for spreadsheets or other apps, or all decks as a JSON backup.',
    ],
    about: [
      'Flashcards work because of active recall: trying to remember the answer before you see it strengthens memory far more than re-reading notes. Spaced repetition adds timing — cards you know are shown less and less often, and cards you miss come straight back. This tool uses the Leitner system with five boxes: new and missed cards sit in box 1 and appear every session, box 2 every second session, box 3 every fourth, and so on up to box 5.',
      'A short daily session beats a long one once a week. Keep each card to one fact, write the question the way an exam would ask it, and study both directions (term → definition and back) for vocabulary. Decks are stored in your browser only; you can import Quizlet’s tab-separated export or any CSV file with two columns.',
    ],
    faqs: [
      {
        q: 'How does the spaced repetition work?',
        a: 'Each card is in one of five Leitner boxes. “Got it” moves it up a box; “Again” sends it back to box 1. Box 1 is reviewed every session, box 2 every second session, box 3 every fourth, box 4 every eighth and box 5 every sixteenth.',
      },
      {
        q: 'Can I import my Quizlet sets?',
        a: 'Yes. In Quizlet, choose Export, keep “Tab” between term and definition and “New line” between cards, copy the text and paste it into Import. CSV files with two columns (front, back) work too.',
      },
      {
        q: 'How is a typed answer checked?',
        a: 'Case, accents, extra spaces and trailing punctuation are ignored, so “Cafe.” matches “café”. Anything else must match exactly — use multiple choice if your answers are long.',
      },
      {
        q: 'Where are my flashcards saved?',
        a: 'In your browser’s local storage on this device. Nothing is uploaded. Export a JSON backup to keep your decks or move them to another device.',
      },
    ],
  },
];
