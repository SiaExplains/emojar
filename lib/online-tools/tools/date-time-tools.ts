import type { ToolDefinition } from '../types';

export const DATE_TIME_TOOLS: ToolDefinition[] = [
  {
    slug: 'unix-timestamp-converter',
    category: 'date-time-tools',
    alsoIn: ['developer-tools'],
    name: 'Unix Timestamp Converter',
    icon: '🕰️',
    shortDescription: 'Convert Unix epoch time to dates and back.',
    description:
      'Convert Unix timestamps (seconds or milliseconds since 1 January 1970 UTC) to human-readable dates, and dates back to timestamps. The current epoch time ticks live.',
    title: 'Unix Timestamp Converter – Epoch to Date & Date to Epoch',
    metaDescription:
      'Convert Unix timestamps to dates and dates to epoch time. Seconds and milliseconds detected automatically; live current timestamp.',
    keywords: [
      'unix timestamp converter',
      'epoch converter',
      'timestamp to date',
      'date to timestamp',
      'epoch time',
    ],
    relatedTools: [
      'timestamp-converter',
      'timezone-converter',
      'cron-expression-generator',
      'jwt-decoder',
    ],
    component: 'timestamp',
    config: { mode: 'unix' },
    howTo: [
      'Paste a timestamp — seconds (10 digits) and milliseconds (13 digits) are detected automatically.',
      'Or pick a date and time to get its timestamp.',
      'Copy the format you need.',
    ],
    about: [
      'Unix time counts seconds since 00:00:00 UTC on 1 January 1970, ignoring leap seconds. JavaScript and many APIs use milliseconds instead. 32-bit signed timestamps overflow on 19 January 2038.',
    ],
    faqs: [
      {
        q: 'Is a Unix timestamp affected by time zones?',
        a: 'No — it is always UTC. Only its display as a local date depends on the time zone.',
      },
    ],
  },
  {
    slug: 'timestamp-converter',
    category: 'date-time-tools',
    alsoIn: ['developer-tools'],
    name: 'Timestamp Converter',
    icon: '🗓️',
    shortDescription: 'Convert dates between ISO 8601, RFC 2822 and more.',
    description:
      'Paste a date in almost any format — ISO 8601, RFC 2822, a Unix timestamp or plain text — and see it as ISO, UTC, local time, Unix seconds, milliseconds and relative time.',
    title: 'Timestamp Converter – ISO 8601, RFC 2822, Unix & Local Time',
    metaDescription:
      'Convert timestamps between ISO 8601, RFC 2822, UTC, local time and Unix epoch. Paste any date format and copy the one you need.',
    keywords: [
      'timestamp converter',
      'iso 8601 converter',
      'date format converter',
      'rfc 2822',
    ],
    relatedTools: [
      'unix-timestamp-converter',
      'timezone-converter',
      'date-difference-calculator',
    ],
    component: 'timestamp',
    config: { mode: 'any' },
    howTo: [
      'Paste or type a date/time in any common format.',
      'See it converted to every format, in your time zone and UTC.',
      'Copy the format you need.',
    ],
    about: [
      'ISO 8601 (2026-10-07T14:30:00Z) is the standard for data exchange and sorts correctly as text. RFC 2822 (Wed, 07 Oct 2026 14:30:00 +0000) is used in email headers.',
    ],
    faqs: [
      {
        q: 'What does the Z at the end of an ISO date mean?',
        a: 'Z (“Zulu”) means UTC, equivalent to +00:00.',
      },
    ],
  },
  {
    slug: 'timezone-converter',
    category: 'date-time-tools',
    name: 'Time Zone Converter',
    icon: '🌍',
    shortDescription: 'Convert a time between time zones.',
    description:
      'Convert a date and time from one time zone to several others at once, with daylight saving time handled automatically. Ideal for scheduling meetings across countries.',
    title: 'Time Zone Converter – Convert Time Between Cities',
    metaDescription:
      'Convert time between time zones and cities with automatic daylight saving. Compare several zones at once for meeting planning. Free.',
    keywords: [
      'time zone converter',
      'timezone converter',
      'convert time zones',
      'meeting planner',
      'utc converter',
    ],
    relatedTools: [
      'world-clock',
      'unix-timestamp-converter',
      'timestamp-converter',
    ],
    component: 'timezone-converter',
    howTo: [
      'Pick a date, time and the source time zone.',
      'Add the time zones you want to compare.',
      'Read the converted times; the day changes are highlighted.',
    ],
    about: [
      'Conversions use the IANA time zone database built into your browser, which includes historical and future daylight saving rules.',
    ],
    faqs: [
      {
        q: 'Why is the difference between two cities not always the same?',
        a: 'Countries switch to daylight saving time on different dates (or not at all), so the offset can change by an hour during parts of the year.',
      },
    ],
  },
  {
    slug: 'date-difference-calculator',
    category: 'date-time-tools',
    name: 'Date Difference Calculator',
    icon: '↔️',
    shortDescription: 'Exact time between two dates.',
    description:
      'Calculate the exact time between two dates in days, weeks, months and years — plus working days, hours and minutes — with the option to include the end date.',
    title: 'Date Difference Calculator – Days, Weeks & Months Between Dates',
    metaDescription:
      'Calculate the difference between two dates in years, months, weeks and days, plus working days and hours. Include the end date or not.',
    keywords: [
      'date difference calculator',
      'days between dates',
      'how many days until',
      'date duration calculator',
    ],
    relatedTools: [
      'date-calculator',
      'working-days-calculator',
      'age-calculator',
      'date-add-subtract',
    ],
    component: 'form-calculator',
    config: { calculator: 'date-difference' },
    howTo: [
      'Enter the start and end dates.',
      'Choose whether to include the end date.',
      'Read the difference in several units.',
    ],
    about: [
      '“Include end date” adds one day, which is what you want when counting days of an event (Monday to Friday is 5 days), but not for durations like nights in a hotel (4 nights).',
    ],
    faqs: [
      {
        q: 'Does it account for leap years?',
        a: 'Yes. Calculations use the real calendar, including 29 February in leap years.',
      },
    ],
  },
  {
    slug: 'date-add-subtract',
    category: 'date-time-tools',
    name: 'Add or Subtract Days from a Date',
    icon: '➕',
    shortDescription: 'Add or subtract days, weeks, months or business days.',
    description:
      'Add or subtract days, business days, weeks, months or years from a date to find a deadline, due date or anniversary.',
    title: 'Add or Subtract Days to a Date – Date Calculator',
    metaDescription:
      'Add or subtract days, business days, weeks, months or years from any date. Find deadlines and due dates instantly. Free.',
    keywords: [
      'add days to date',
      'subtract days from date',
      'date plus days',
      'business days calculator',
      'deadline calculator',
    ],
    relatedTools: [
      'date-difference-calculator',
      'working-days-calculator',
      'date-calculator',
      'week-number-calculator',
    ],
    component: 'form-calculator',
    config: { calculator: 'date-add-subtract' },
    howTo: [
      'Enter the start date.',
      'Choose add or subtract, the amount and the unit.',
      'Read the resulting date.',
    ],
    about: [
      'Business days skip Saturdays and Sundays. Public holidays are not excluded here — use the Working Days Calculator to account for them.',
    ],
    faqs: [
      {
        q: 'What is 90 days from today?',
        a: 'Enter today’s date (the default), choose Add, 90, Days — the tool shows the exact date and weekday.',
      },
    ],
  },
  {
    slug: 'working-days-calculator',
    category: 'date-time-tools',
    alsoIn: ['productivity-tools'],
    name: 'Working Days Calculator',
    icon: '💼',
    shortDescription: 'Count business days, excluding holidays.',
    description:
      'Count the working days between two dates, excluding weekends and any public holidays you list. Supports Friday–Saturday weekends.',
    title: 'Working Days Calculator – Business Days Between Dates',
    metaDescription:
      'Count working days between two dates, excluding weekends and public holidays. Custom weekend days supported. Free and private.',
    keywords: [
      'working days calculator',
      'business days calculator',
      'workdays between dates',
      'exclude holidays',
    ],
    relatedTools: [
      'date-add-subtract',
      'date-difference-calculator',
      'time-duration-calculator',
    ],
    component: 'form-calculator',
    config: { calculator: 'working-days' },
    howTo: [
      'Enter the start and end dates (both are included).',
      'Choose the weekend days and paste any holidays, one date per line.',
      'Read the number of working days.',
    ],
    about: [
      'Holidays that fall on a weekend are not subtracted twice. Working hours assume an 8-hour day.',
    ],
    faqs: [
      {
        q: 'Does it know my country’s holidays?',
        a: 'No — paste your country’s or state’s public holidays so the count matches your calendar exactly.',
      },
    ],
  },
  {
    slug: 'week-number-calculator',
    category: 'date-time-tools',
    name: 'Week Number Calculator',
    icon: '📆',
    shortDescription: 'Find the ISO week number of any date.',
    description:
      'Find the ISO 8601 week number for any date, the dates that week runs from Monday to Sunday, and the day of the year.',
    title: 'Week Number Calculator – What Week Is It? (ISO 8601)',
    metaDescription:
      'Find the ISO week number for any date, plus the week’s start and end dates and day of the year. Free week number calculator.',
    keywords: [
      'week number',
      'what week is it',
      'iso week number',
      'calendar week',
      'kw calculator',
    ],
    relatedTools: [
      'day-of-week-calculator',
      'printable-calendar',
      'date-add-subtract',
      'date-difference-calculator',
      'working-days-calculator',
    ],
    component: 'form-calculator',
    config: { calculator: 'week-number' },
    howTo: [
      'Pick a date (today by default).',
      'Read the ISO week number and week dates.',
    ],
    about: [
      'ISO weeks start on Monday, and week 1 is the week containing the year’s first Thursday. Because of this, 1 January can belong to week 52 or 53 of the previous year.',
    ],
    faqs: [
      {
        q: 'Do the US and Europe number weeks differently?',
        a: 'Often, yes. Europe uses ISO weeks (Monday start); many US calendars start weeks on Sunday and count 1 January as week 1.',
      },
    ],
  },
  {
    slug: 'countdown-generator',
    category: 'date-time-tools',
    name: 'Countdown Timer Generator',
    icon: '⏳',
    shortDescription: 'Create a shareable countdown to any date.',
    description:
      'Create a live countdown to an event — a launch, birthday or holiday — and share it with a link. The countdown runs in the viewer’s browser.',
    title: 'Countdown Timer Generator – Shareable Event Countdown',
    metaDescription:
      'Create a live countdown timer to any date and share it with a link. No sign-up, no app — runs in the browser.',
    keywords: [
      'countdown timer',
      'countdown generator',
      'event countdown',
      'days until',
    ],
    relatedTools: [
      'date-difference-calculator',
      'world-clock',
      'age-calculator',
    ],
    component: 'countdown',
    howTo: [
      'Enter a title and the target date and time.',
      'Watch the live countdown.',
      'Copy the share link — anyone who opens it sees the same countdown.',
    ],
    about: [
      'The event details are stored in the link itself (not on a server), so the link works as long as this page exists.',
    ],
    faqs: [
      {
        q: 'Which time zone does the countdown use?',
        a: 'The target time is saved in UTC, so everyone counts down to the same moment wherever they are.',
      },
    ],
  },
  {
    slug: 'world-clock',
    category: 'date-time-tools',
    name: 'World Clock',
    icon: '🕐',
    shortDescription: 'Current time in cities around the world.',
    description:
      'See the current local time in major cities around the world side by side, with UTC offsets and day/night indicators. Add or remove cities.',
    title: 'World Clock – Current Local Time in Cities Worldwide',
    metaDescription:
      'See the current time in cities around the world with UTC offsets and day/night indicators. Add your own cities. Free world clock.',
    keywords: [
      'world clock',
      'current time',
      'time in other countries',
      'time around the world',
    ],
    relatedTools: [
      'timezone-converter',
      'unix-timestamp-converter',
      'countdown-generator',
    ],
    component: 'world-clock',
    howTo: [
      'Check the times for the default cities.',
      'Add a city or time zone from the list, or remove ones you do not need.',
      'Your selection is remembered in this browser.',
    ],
    about: [
      'Times update every second using your device clock and the IANA time zone database, including daylight saving time.',
    ],
    faqs: [
      {
        q: 'Is the time accurate?',
        a: 'It is as accurate as your device clock, which is usually synchronised over the internet automatically.',
      },
    ],
  },

  {
    slug: 'stopwatch',
    category: 'date-time-tools',
    name: 'Online Stopwatch',
    icon: '⏱️',
    shortDescription: 'Precise stopwatch with lap times.',
    description:
      'A precise online stopwatch with lap and split times, keyboard shortcuts and a full-screen view. Keeps accurate time even when you switch tabs.',
    title: 'Online Stopwatch – With Laps, Full Screen & Keyboard Shortcuts',
    metaDescription:
      'Free online stopwatch with lap times, splits, full-screen mode and keyboard shortcuts. Accurate to the hundredth of a second, even in background tabs.',
    keywords: [
      'online stopwatch',
      'stopwatch',
      'stopwatch with laps',
      'timer online',
      'lap timer',
    ],
    relatedTools: [
      'online-timer',
      'pomodoro-timer',
      'time-duration-calculator',
      'world-clock',
    ],
    component: 'stopwatch',
    popular: true,
    howTo: [
      'Press Start (or the space bar).',
      'Press Lap (or L) to record a lap; the fastest and slowest laps are highlighted.',
      'Press Stop, then Reset (or R) to start over.',
    ],
    about: [
      'The stopwatch measures elapsed time from your device’s high-resolution clock instead of counting ticks, so it stays accurate when the tab is in the background or the device is busy.',
      'A lap time is the time since the previous lap; a split is the total time since the start. Both are shown for every lap.',
    ],
    faqs: [
      {
        q: 'Does it keep running if I close the tab?',
        a: 'No — closing the page stops it. Switching to another tab or app is fine; the time keeps counting.',
      },
    ],
  },
  {
    slug: 'online-timer',
    category: 'date-time-tools',
    name: 'Online Timer',
    icon: '⏲️',
    shortDescription: 'Countdown timer with alarm.',
    description:
      'Set a countdown timer for any length — 1 minute, 5 minutes, 1 hour — and get an alarm sound and notification when time is up. Works in the background and in full screen.',
    title: 'Online Timer – Countdown Timer With Alarm, Free',
    metaDescription:
      'Set an online countdown timer for minutes or hours with an alarm sound and notification. Quick presets, full-screen mode, works in background tabs.',
    keywords: [
      'online timer',
      'countdown timer',
      'timer with alarm',
      '5 minute timer',
      '10 minute timer',
    ],
    relatedTools: [
      'alarm-clock',
      'pomodoro-timer',
      'stopwatch',
      'countdown-generator',
      'world-clock',
    ],
    component: 'timer',
    config: { mode: 'timer' },
    popular: true,
    howTo: [
      'Pick a preset or enter hours, minutes and seconds.',
      'Press Start; pause or add a minute at any time.',
      'When the timer ends, an alarm beeps and the display flashes until you dismiss it.',
    ],
    about: [
      'The timer counts down to a fixed end time, so it stays accurate even if the browser throttles background tabs. Allow notifications to get an alert when the page is hidden.',
      'The remaining time is also shown in the browser tab title, so you can keep an eye on it while working in another tab.',
    ],
    faqs: [
      {
        q: 'Why didn’t I hear the alarm?',
        a: 'Browsers only play sound after you have interacted with the page — pressing Start counts. Check that your device is not muted.',
      },
    ],
  },
  {
    slug: 'pomodoro-timer',
    category: 'date-time-tools',
    alsoIn: ['productivity-tools'],
    name: 'Pomodoro Timer',
    icon: '🍅',
    shortDescription: '25-minute focus sessions with breaks.',
    description:
      'Work in focused 25-minute sessions with 5-minute breaks and a longer break after every four rounds — the Pomodoro Technique. Customise the lengths and get a sound when each phase ends.',
    title: 'Pomodoro Timer Online – 25/5 Focus Timer With Breaks',
    metaDescription:
      'Free Pomodoro timer: 25-minute focus sessions, 5-minute breaks and a long break every 4 rounds. Custom lengths, alarm sound and round counter.',
    keywords: [
      'pomodoro timer',
      'pomodoro technique',
      'focus timer',
      'study timer',
      '25 minute timer',
    ],
    relatedTools: [
      'alarm-clock',
      'online-timer',
      'stopwatch',
      'world-clock',
      'working-days-calculator',
      'flashcard-maker',
    ],
    component: 'timer',
    config: { mode: 'pomodoro' },
    popular: true,
    howTo: [
      'Press Start to begin a 25-minute focus session.',
      'Take a 5-minute break when the alarm sounds; the timer moves to the next phase, and you press Start when you are ready.',
      'After four focus sessions, enjoy a longer 15-minute break.',
    ],
    about: [
      'The Pomodoro Technique, created by Francesco Cirillo in the late 1980s, breaks work into short, timed intervals. The fixed end time makes it easier to start difficult tasks and to protect focus from interruptions.',
      'You can change the focus, short-break and long-break lengths; many people prefer 50/10 for deep work.',
    ],
    faqs: [
      {
        q: 'What should I do during a break?',
        a: 'Step away from the screen — stand up, stretch or get water. Checking messages tends to pull your attention back into work mode.',
      },
    ],
  },
  {
    slug: 'alarm-clock',
    category: 'date-time-tools',
    name: 'Online Alarm Clock',
    icon: '⏰',
    shortDescription: 'Set alarms with sounds, snooze and repeat days.',
    description:
      'Set one or more alarms in your browser with a label, a choice of sounds, repeat days and 5- or 10-minute snooze, plus an optional desktop notification. A big live clock shows the time and how long until the next alarm.',
    title: 'Online Alarm Clock – Free Alarm with Sounds, Snooze & Repeat',
    metaDescription:
      'Free online alarm clock: set alarms with labels, sounds, repeat days and snooze, plus optional notifications. Runs in your browser — no app or sign-up.',
    keywords: [
      'online alarm clock',
      'alarm clock',
      'set an alarm',
      'wake me up',
      'alarm online',
    ],
    relatedTools: [
      'online-timer',
      'pomodoro-timer',
      'world-clock',
      'stopwatch',
      'countdown-generator',
    ],
    component: 'alarm-clock',
    popular: true,
    howTo: [
      'Pick a time, an optional label and a sound — click “Test sound” once so the browser allows audio.',
      'Choose repeat days, or leave them empty for a one-time alarm, then click “Add alarm”.',
      'Keep the tab open; when it rings, stop it or snooze for 5 or 10 minutes.',
    ],
    about: [
      'The alarm runs in this browser tab: sounds are generated with the Web Audio API, so there is nothing to download, and alarms are saved in your browser (localStorage) so they’re still there after a reload. A one-time alarm switches itself off after ringing; repeating alarms ring on the chosen weekdays.',
      'Browsers can’t ring from a closed tab, and phones and laptops may pause pages when they sleep or the screen locks. For important alarms — an early flight, medication — use your phone’s built-in alarm as well. The optional notification helps when the tab is in the background.',
    ],
    faqs: [
      {
        q: 'Will the alarm ring if my computer goes to sleep?',
        a: 'No — a sleeping device pauses the browser. Keep it awake and plugged in, and leave the tab open (it can be in the background).',
      },
      {
        q: 'Why do I need to click “Test sound”?',
        a: 'Browsers block audio until you interact with the page. One click unlocks sound for the alarm.',
      },
    ],
  },
  {
    slug: 'day-of-week-calculator',
    category: 'date-time-tools',
    name: 'Day of the Week Calculator',
    icon: '📅',
    shortDescription: 'What day of the week was (or will be) any date?',
    description:
      'Find the day of the week for any date — past or future — plus the day of the year, ISO week number, quarter, whether it’s a leap year and how far it is from today. See the same date’s weekday in other years too.',
    title: 'Day of the Week Calculator – What Day Was That Date?',
    metaDescription:
      'Find the day of the week for any date: what day was 1 January 2000, what weekday is your birthday next year. Plus day of year, ISO week and leap year.',
    keywords: [
      'day of the week calculator',
      'what day was',
      'what day of the week',
      'day finder',
      'weekday calculator',
    ],
    relatedTools: [
      'date-difference-calculator',
      'week-number-calculator',
      'age-calculator',
      'printable-calendar',
      'date-add-subtract',
    ],
    component: 'form-calculator',
    config: { calculator: 'day-of-week' },
    howTo: [
      'Pick a date — today is filled in to start.',
      'Read the weekday and the details below it.',
      'Check the table to see which weekday the same date falls on in other years.',
    ],
    about: [
      'The weekday of a date shifts by one each year (365 days is 52 weeks plus 1 day) and by two after 29 February in a leap year — that is why your birthday moves through the week. Leap years are divisible by 4, except century years not divisible by 400: 2000 was a leap year, 1900 was not.',
      'Dates use the Gregorian calendar throughout, the standard in most countries today. For historical dates before a country switched from the Julian calendar (1582 in much of Europe, 1752 in Britain), contemporary records may name a different weekday.',
    ],
    faqs: [
      {
        q: 'What day of the week was 1 January 2000?',
        a: 'A Saturday.',
      },
      {
        q: 'What happens to 29 February birthdays?',
        a: 'In non-leap years the date doesn’t exist; the table marks those years instead of guessing between 28 February and 1 March.',
      },
    ],
  },
  {
    slug: 'printable-calendar',
    category: 'date-time-tools',
    alsoIn: ['productivity-tools'],
    name: 'Printable Calendar Generator',
    icon: '🗓️',
    shortDescription: 'Make a printable monthly or yearly calendar PDF.',
    description:
      'Create a printable calendar as a PDF: one month, a whole year on one page, or 12 monthly pages. Choose Monday or Sunday starts, week numbers, notes lines, A4 or Letter, portrait or landscape, your accent colour and the language.',
    title: 'Printable Calendar Generator – Free Monthly & Yearly PDF',
    metaDescription:
      'Make a free printable calendar PDF for any month or year: Monday or Sunday start, week numbers, notes, A4 or Letter, landscape or portrait, 12 languages.',
    keywords: [
      'printable calendar',
      'calendar generator',
      'printable calendar 2027',
      'monthly calendar pdf',
      'yearly calendar printable',
    ],
    relatedTools: [
      'day-of-week-calculator',
      'week-number-calculator',
      'working-days-calculator',
      'invoice-generator',
      'date-difference-calculator',
    ],
    component: 'calendar-maker',
    popular: true,
    howTo: [
      'Choose the year and a month — or “Whole year”.',
      'Set the week start, paper size, orientation, language and options such as week numbers.',
      'Click “Download PDF” and print it at 100 % (actual size).',
    ],
    about: [
      'Monthly pages give each day a large box for writing, with optional lines for notes underneath; the year view fits all twelve months on one page for a wall planner. Weekends are highlighted in your accent colour, and ISO week numbers (Monday-based, used in Europe and in business planning) can be added in the margin.',
      'The PDF is built in your browser. Month and weekday names come from your browser’s built-in language data; the languages offered are Latin-script ones because the PDF uses a standard font that every printer and viewer supports.',
    ],
    faqs: [
      {
        q: 'Should my calendar start on Monday or Sunday?',
        a: 'Most of Europe and the ISO standard start the week on Monday; the US, Canada and Japan usually start on Sunday. Pick whichever matches the calendars you use.',
      },
      {
        q: 'Can I add holidays?',
        a: 'Not automatically — holidays differ by country and region. Use the notes lines or write them into the day boxes after printing.',
      },
    ],
  },
  {
    slug: 'time-card-calculator',
    category: 'date-time-tools',
    alsoIn: ['calculators', 'productivity-tools'],
    name: 'Time Card Calculator',
    icon: '🕘',
    shortDescription: 'Add up weekly hours, breaks, overtime and pay.',
    description:
      'Enter start and end times for each day — with breaks, 12- or 24-hour times and overnight shifts — to get daily and weekly hours, overtime after 40 hours (or per day), and gross pay at your hourly rate. Export to CSV.',
    title: 'Time Card Calculator – Weekly Hours, Overtime & Pay',
    metaDescription:
      'Free time card calculator: add up hours worked per day and week with breaks, overnight shifts and overtime, in hh:mm and decimal hours, plus gross pay. CSV export.',
    keywords: [
      'time card calculator',
      'timesheet calculator',
      'hours worked calculator',
      'work hours calculator',
      'overtime calculator',
    ],
    relatedTools: [
      'salary-to-hourly-calculator',
      'time-duration-calculator',
      'working-days-calculator',
      'invoice-generator',
      'percentage-calculator',
    ],
    component: 'time-card',
    popular: true,
    howTo: [
      'Type start and end times for each day you worked (e.g. 9:00 and 17:30, or 9am and 5:30pm) and the break in minutes.',
      'Set your hourly rate and when overtime starts — 40 hours a week by default, or per day.',
      'Read total, regular and overtime hours and pay, then copy or download the CSV.',
    ],
    about: [
      'Hours are shown both as hours:minutes (8:30) and as decimal hours (8.50), which is what payroll and invoices usually need — 15 minutes is 0.25 h, not 0.15. An end time earlier than the start is treated as an overnight shift, so 22:00 to 6:00 counts 8 hours.',
      'Overtime is calculated after a weekly threshold (40 h by default, as under the US FLSA), after a daily threshold, or both, and paid at the multiplier you set (1.5× by default). Rules differ by country, state and contract, so treat the pay figure as an estimate before tax.',
    ],
    faqs: [
      {
        q: 'How do I convert minutes to decimal hours?',
        a: 'Divide by 60: 45 minutes = 0.75 h, so 7 h 45 min is 7.75 hours.',
      },
      {
        q: 'Are unpaid breaks subtracted?',
        a: 'Yes — whatever you enter as the break is subtracted from that day. Leave it empty for paid breaks.',
      },
    ],
  },
  {
    slug: 'world-time-zone-map',
    category: 'date-time-tools',
    name: 'World Time Zone Map',
    icon: '🗺️',
    shortDescription: 'See day, night and local times on a live world map.',
    description:
      'A live world map with day and night shading and the local time in cities around the globe. Search 500 cities or any IANA time zone, add them to a comparison table with local time, date, UTC offset, daylight saving status and the difference from your own time.',
    title: 'World Time Zone Map – Live Day & Night Map with Local Times',
    metaDescription:
      'Live world time zone map with day and night shading. Compare local time, UTC offset and daylight saving in Berlin, London, New York, Tokyo and any city or time zone.',
    keywords: [
      'world time zone map',
      'time zone map',
      'world clock map',
      'day and night map',
      'utc offset',
      'current time around the world',
    ],
    relatedTools: [
      'world-clock',
      'timezone-converter',
      'country-explorer',
      'unix-timestamp-converter',
      'countdown-generator',
    ],
    component: 'world-time-map',
    popular: true,
    howTo: [
      'The map shows where it is day and night right now, with your own time zone listed first.',
      'Search for a city or time zone (Berlin, Asia/Kolkata) and add it.',
      'Click a blue dot on the map to add a capital city.',
      'Compare local times, dates, UTC offsets and daylight saving in the table, then copy it.',
    ],
    about: [
      'Time zones are offsets from Coordinated Universal Time (UTC). In theory each covers 15° of longitude — one hour — and the map’s stripes show those nominal bands, but real borders follow countries: China uses a single zone across five bands, and India and parts of Australia use half-hour offsets.',
      'Local times come from your browser’s built-in IANA time-zone database (zones like Europe/Berlin and America/New_York), so daylight-saving changes are always applied correctly. The night shading is calculated from the sun’s position for the current minute; nothing is fetched from a server.',
    ],
    faqs: [
      {
        q: 'What time zone is UTC+0?',
        a: 'UTC itself. London (GMT) is UTC+0 in winter and UTC+1 (BST) in summer; Iceland, Ghana and Senegal stay at UTC+0 all year.',
      },
      {
        q: 'Which countries use daylight saving time?',
        a: 'Most of Europe and North America, plus parts of South America, Australia and New Zealand. Most of Asia and Africa do not. The table shows whether DST is active for each place right now.',
      },
      {
        q: 'Why do some places have 30- or 45-minute offsets?',
        a: 'Countries choose their offsets: India is UTC+5:30, Nepal UTC+5:45 and Newfoundland UTC−3:30 (UTC−2:30 in summer).',
      },
    ],
  },
];
