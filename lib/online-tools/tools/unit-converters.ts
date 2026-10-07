import type { ToolDefinition } from '../types';

type Spec = {
  quantity: string;
  name: string;
  icon: string;
  examples: string;
  intro: string;
  about: string;
  faq: { q: string; a: string };
  keywords: string[];
  related: string[];
};

const SPECS: Spec[] = [
  {
    quantity: 'length',
    name: 'Length',
    icon: '📏',
    examples: 'km to miles, cm to inches, feet to meters',
    intro:
      'Convert between metric and imperial length units — kilometers, meters, centimeters, miles, feet, inches and more.',
    about:
      'Imperial units are defined exactly in metric: 1 inch = 2.54 cm, 1 foot = 0.3048 m and 1 mile = 1.609344 km.',
    faq: {
      q: 'How many centimeters are in an inch?',
      a: 'Exactly 2.54 cm. One foot is 30.48 cm.',
    },
    keywords: [
      'length converter',
      'km to miles',
      'cm to inches',
      'feet to meters',
    ],
    related: [
      'area-converter',
      'speed-converter',
      'volume-converter',
      'bmi-calculator',
    ],
  },
  {
    quantity: 'weight',
    name: 'Weight',
    icon: '⚖️',
    examples: 'kg to lbs, grams to ounces, stone to kg',
    intro:
      'Convert weight and mass units — kilograms, grams, pounds, ounces, stone, tons and carats.',
    about:
      'One pound is defined as exactly 0.45359237 kg; one stone is 14 pounds.',
    faq: { q: 'How many pounds is 1 kg?', a: 'About 2.2046 lb.' },
    keywords: ['weight converter', 'kg to lbs', 'lbs to kg', 'grams to ounces'],
    related: [
      'volume-converter',
      'bmi-calculator',
      'length-converter',
      'energy-converter',
    ],
  },
  {
    quantity: 'temperature',
    name: 'Temperature',
    icon: '🌡️',
    examples: 'Celsius to Fahrenheit, Fahrenheit to Celsius, Kelvin',
    intro:
      'Convert temperatures between Celsius, Fahrenheit, Kelvin and Rankine.',
    about:
      '°F = °C × 9/5 + 32 and °C = (°F − 32) × 5/9. Kelvin starts at absolute zero: K = °C + 273.15.',
    faq: {
      q: 'What is 0 °C in Fahrenheit?',
      a: '32 °F. Body temperature, 37 °C, is 98.6 °F.',
    },
    keywords: [
      'temperature converter',
      'celsius to fahrenheit',
      'fahrenheit to celsius',
      'kelvin',
    ],
    related: ['energy-converter', 'pressure-converter', 'length-converter'],
  },
  {
    quantity: 'area',
    name: 'Area',
    icon: '🗺️',
    examples: 'm² to ft², acres to hectares',
    intro:
      'Convert area units — square meters, square feet, acres, hectares, square kilometers and square miles.',
    about:
      'One hectare is 10,000 m² (a 100 m × 100 m square); one acre is about 4,047 m².',
    faq: {
      q: 'How many square feet are in a square meter?',
      a: 'About 10.764 ft².',
    },
    keywords: [
      'area converter',
      'square meters to square feet',
      'acres to hectares',
    ],
    related: ['length-converter', 'volume-converter'],
  },
  {
    quantity: 'volume',
    name: 'Volume',
    icon: '🧪',
    examples: 'liters to gallons, ml to cups, fl oz to ml',
    intro:
      'Convert volume and capacity units — liters, milliliters, cubic meters, US and UK gallons, cups, pints and fluid ounces.',
    about:
      'US and UK gallons differ: a US gallon is 3.785 L, an imperial (UK) gallon is 4.546 L. Cooking units here are US customary.',
    faq: {
      q: 'How many milliliters are in a cup?',
      a: 'A US cup is about 236.6 mL; a metric cup is 250 mL.',
    },
    keywords: [
      'volume converter',
      'liters to gallons',
      'ml to cups',
      'fl oz to ml',
    ],
    related: ['weight-converter', 'area-converter', 'length-converter'],
  },
  {
    quantity: 'speed',
    name: 'Speed',
    icon: '🏎️',
    examples: 'km/h to mph, m/s to km/h, knots',
    intro:
      'Convert speed units — kilometers per hour, miles per hour, meters per second, feet per second, knots and Mach.',
    about:
      'To convert m/s to km/h multiply by 3.6. One knot is one nautical mile (1,852 m) per hour.',
    faq: { q: 'How fast is 100 km/h in mph?', a: 'About 62.1 mph.' },
    keywords: [
      'speed converter',
      'km/h to mph',
      'mph to km/h',
      'knots converter',
    ],
    related: ['length-converter', 'time-converter'],
  },
  {
    quantity: 'time',
    name: 'Time',
    icon: '⏳',
    examples: 'hours to minutes, days to seconds, weeks to days',
    intro:
      'Convert time units — milliseconds, seconds, minutes, hours, days, weeks, months and years.',
    about:
      'Months and years use average Gregorian lengths (30.44 and 365.2425 days) because their real length varies.',
    faq: { q: 'How many seconds are in a day?', a: '86,400 seconds.' },
    keywords: [
      'time converter',
      'hours to minutes',
      'seconds to hours',
      'days to weeks',
    ],
    related: [
      'time-duration-calculator',
      'unix-timestamp-converter',
      'speed-converter',
    ],
  },
  {
    quantity: 'data-storage',
    name: 'Data Storage',
    icon: '💾',
    examples: 'GB to MB, MiB to MB, TB to GB',
    intro:
      'Convert digital storage units — bits, bytes, KB, MB, GB, TB and the binary KiB, MiB, GiB and TiB.',
    about:
      'Decimal units (KB, MB, GB) use powers of 1,000; binary units (KiB, MiB, GiB) use powers of 1,024. That is why a “1 TB” drive shows as about 931 GiB in many operating systems.',
    faq: {
      q: 'Is 1 GB 1,000 MB or 1,024 MB?',
      a: 'In SI units 1 GB = 1,000 MB. 1 GiB = 1,024 MiB.',
    },
    keywords: [
      'data storage converter',
      'gb to mb',
      'mb to gb',
      'bytes converter',
      'gib to gb',
    ],
    related: ['frequency-converter', 'image-compressor', 'compress-pdf'],
  },
  {
    quantity: 'energy',
    name: 'Energy',
    icon: '⚡',
    examples: 'kcal to kJ, kWh to joules, BTU',
    intro:
      'Convert energy units — joules, kilojoules, calories, kilocalories, watt-hours, kilowatt-hours, BTU and electronvolts.',
    about:
      'One food Calorie is one kilocalorie (4.184 kJ). One kilowatt-hour equals 3.6 megajoules.',
    faq: { q: 'How many kJ are in a kcal?', a: '4.184 kJ.' },
    keywords: [
      'energy converter',
      'kcal to kj',
      'kwh to joules',
      'calories converter',
    ],
    related: ['bmr-calculator', 'temperature-converter', 'pressure-converter'],
  },
  {
    quantity: 'pressure',
    name: 'Pressure',
    icon: '🎈',
    examples: 'bar to psi, kPa to psi, atm to Pa',
    intro:
      'Convert pressure units — pascals, kilopascals, bar, millibar, atmospheres, psi, mmHg and inHg.',
    about:
      'Standard atmospheric pressure is 101,325 Pa = 1.01325 bar = 14.696 psi = 760 mmHg.',
    faq: { q: 'What tyre pressure is 2.2 bar in psi?', a: 'About 31.9 psi.' },
    keywords: ['pressure converter', 'bar to psi', 'psi to bar', 'kpa to psi'],
    related: ['temperature-converter', 'energy-converter'],
  },
  {
    quantity: 'frequency',
    name: 'Frequency',
    icon: '📶',
    examples: 'MHz to kHz, GHz to Hz, rpm to Hz',
    intro:
      'Convert frequency units — hertz, kilohertz, megahertz, gigahertz and revolutions per minute.',
    about: 'One hertz is one cycle per second; 60 rpm equals 1 Hz.',
    faq: { q: 'How many Hz is 1 GHz?', a: '1,000,000,000 Hz.' },
    keywords: [
      'frequency converter',
      'mhz to khz',
      'hz converter',
      'rpm to hz',
    ],
    related: ['data-storage-converter', 'angle-converter', 'time-converter'],
  },
  {
    quantity: 'angle',
    name: 'Angle',
    icon: '📐',
    examples: 'degrees to radians, radians to degrees, gradians',
    intro:
      'Convert angle units — degrees, radians, gradians, arcminutes, arcseconds and turns.',
    about:
      'A full circle is 360° = 2π radians = 400 gradians. To convert degrees to radians, multiply by π/180.',
    faq: { q: 'How many degrees is one radian?', a: 'About 57.2958°.' },
    keywords: ['angle converter', 'degrees to radians', 'radians to degrees'],
    related: ['frequency-converter', 'length-converter', 'image-rotator'],
  },
];

const MEASUREMENT_CONVERTERS: ToolDefinition[] = SPECS.map((s) => ({
  slug: `${s.quantity}-converter`,
  category: 'unit-converters',
  name: `${s.name} Converter`,
  icon: s.icon,
  shortDescription: `Convert ${s.examples}.`,
  description: `${s.intro} Type a value to see the result instantly, together with a table of every other unit.`,
  title: `${s.name} Converter – ${s.examples.split(',')[0].replace(/^\w/, (c) => c.toUpperCase())} & More`,
  metaDescription: `Free ${s.name.toLowerCase()} converter: ${s.examples} and more. Accurate results as you type, with a full conversion table.`,
  keywords: s.keywords,
  relatedTools: s.related,
  component: 'unit-converter',
  config: { quantity: s.quantity },
  popular: s.quantity === 'length' || s.quantity === 'temperature',
  howTo: [
    'Enter a value.',
    'Choose the unit to convert from and to (use ⇄ to swap).',
    'Read the result, or scan the table for every unit at once.',
  ],
  about: [
    s.about,
    'Results show up to 10 significant digits; very large or small values switch to scientific notation.',
  ],
  faqs: [s.faq],
}));

const NUMBER_CONVERTERS: ToolDefinition[] = [
  {
    slug: 'number-to-words',
    category: 'unit-converters',
    name: 'Number to Words',
    icon: '🔡',
    shortDescription: 'Write numbers in words, for cheques and documents.',
    description:
      'Convert numbers into English words — “1,250.50” becomes “one thousand two hundred fifty point five zero” — or into ordinal words (twenty-first) and cheque wording (One thousand two hundred fifty dollars and 50/100).',
    title: 'Number to Words Converter – Spell Out Numbers & Cheque Amounts',
    metaDescription:
      'Convert numbers to words in English: cardinal, ordinal and cheque format with any currency. Handles decimals and numbers up to sextillions. Free.',
    keywords: [
      'number to words',
      'numbers in words',
      'cheque amount in words',
      'spell number',
      'number to text converter',
    ],
    relatedTools: [
      'roman-numeral-converter',
      'scientific-calculator',
      'text-case-converter',
      'percentage-calculator',
    ],
    component: 'number-to-words',
    popular: true,
    howTo: [
      'Type a number (commas are fine).',
      'Choose cardinal, ordinal or cheque wording, and US or UK style.',
      'Copy the words — in lowercase, Sentence case or UPPERCASE.',
    ],
    about: [
      'Writing amounts in words is required on cheques and many contracts because words are harder to alter than digits. The cheque format writes the whole amount in words and the cents as a fraction (50/100), the convention banks expect.',
      'British English inserts “and” after hundreds (“one hundred and five”); American English usually leaves it out. Hyphens join tens and units from twenty-one to ninety-nine.',
    ],
    faqs: [
      {
        q: 'How do I write $1,250.50 on a cheque?',
        a: '“One thousand two hundred fifty dollars and 50/100 (50 cents)” — use any currency name you choose, and drop the currency word if it is preprinted on the cheque.',
      },
      {
        q: 'How large a number can it convert?',
        a: 'Whole numbers up to 24 digits (hundreds of sextillions), with any number of decimal places.',
      },
    ],
  },
  {
    slug: 'roman-numeral-converter',
    category: 'unit-converters',
    name: 'Roman Numeral Converter',
    icon: '🏛️',
    shortDescription: 'Numbers to Roman numerals and back.',
    description:
      'Convert numbers to Roman numerals (2026 → MMXXVI) and Roman numerals back to numbers, with validation that catches non-standard forms like IIII. Also converts dates for tattoos and inscriptions.',
    title: 'Roman Numeral Converter – Numbers to Roman Numerals & Back',
    metaDescription:
      'Convert numbers to Roman numerals and Roman numerals to numbers from 1 to 3999. Validates input and converts dates (e.g. for tattoos). Free and instant.',
    keywords: [
      'roman numeral converter',
      'roman numerals',
      'number to roman numerals',
      'roman numeral date converter',
      'mmxxvi',
    ],
    relatedTools: [
      'number-to-words',
      'date-calculator',
      'scientific-calculator',
      'fancy-text-generator',
    ],
    component: 'roman-numerals',
    popular: true,
    howTo: [
      'Type a number (1–3999) or a Roman numeral — the direction is detected automatically.',
      'Or pick a date to get it in Roman numerals (e.g. for a tattoo).',
      'Copy the result.',
    ],
    about: [
      'Roman numerals combine I (1), V (5), X (10), L (50), C (100), D (500) and M (1000). A smaller symbol before a larger one is subtracted: IV = 4, XC = 90, CM = 900.',
      'Standard Roman numerals go up to 3999 (MMMCMXCIX). Only six subtractive pairs are valid — IV, IX, XL, XC, CD and CM — so 99 is XCIX, not IC.',
    ],
    faqs: [
      {
        q: 'Why does a clock show IIII instead of IV?',
        a: 'Many clock faces use IIII for visual balance — it is a long-standing design tradition, not the standard form.',
      },
      {
        q: 'How do I write a date in Roman numerals?',
        a: 'Convert day, month and year separately and separate them with dots, e.g. 7 October 2026 → VII.X.MMXXVI.',
      },
    ],
  },
];

export const UNIT_CONVERTERS: ToolDefinition[] = [
  ...MEASUREMENT_CONVERTERS,
  ...NUMBER_CONVERTERS,
];
