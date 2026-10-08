import type { FAQItem, ToolDefinition, ToolVariant } from '../types';

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
  /** Hand-written SEO copy overriding the generated defaults. */
  title?: string;
  meta?: string;
  description?: string;
  extraAbout?: string[];
  extraFaqs?: FAQItem[];
  variants?: ToolVariant[];
  popular?: boolean;
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
    variants: [
      {
        slug: 'km-to-miles',
        name: 'Kilometers to Miles Converter',
        title: 'Kilometers to Miles – km to mi Converter (and Miles to km)',
        metaDescription:
          'Convert kilometers to miles: 1 km = 0.621371 mi and 1 mile = 1.609344 km exactly. A 5K run is 3.11 miles, a marathon 42.195 km = 26.22 mi.',
        description:
          'Enter kilometers to get miles instantly. One kilometer is 0.621371 miles — so 10 km is about 6.2 miles — and a mile is exactly 1.609344 km.',
        config: { quantity: 'length', init_from: 'km', init_to: 'mi' },
        keywords: [
          'km to miles',
          'kilometers to miles',
          'km to mi',
          'convert km to miles',
        ],
      },
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
      'cooking-measurement-converter',
      'volume-converter',
      'bmi-calculator',
      'length-converter',
      'energy-converter',
    ],
    variants: [
      {
        slug: 'kg-to-lbs',
        name: 'Kilograms to Pounds Converter',
        title: 'Kilograms to Pounds – kg to lbs Converter (and lbs to kg)',
        metaDescription:
          'Convert kg to lbs: 1 kg = 2.20462 lb and 1 lb = 0.45359237 kg exactly. 70 kg is 154.3 lb. Pounds and ounces shown too. Instant and exact.',
        description:
          'Enter kilograms to get pounds. One kilogram is about 2.2046 pounds — so 70 kg is 154.3 lb — because a pound is defined as exactly 0.45359237 kg.',
        config: { quantity: 'weight', init_from: 'kg', init_to: 'lb' },
        keywords: [
          'kg to lbs',
          'kilograms to pounds',
          'kg to lb',
          'convert kg to pounds',
        ],
      },
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
    related: [
      'cooking-measurement-converter',
      'energy-converter',
      'pressure-converter',
      'length-converter',
    ],
    variants: [
      {
        slug: 'celsius-to-fahrenheit',
        name: 'Celsius to Fahrenheit Converter',
        title: 'Celsius to Fahrenheit – °C to °F Converter with Formula',
        metaDescription:
          'Convert Celsius to Fahrenheit: °F = °C × 9/5 + 32. 0 °C = 32 °F, 20 °C = 68 °F, 37 °C = 98.6 °F, 100 °C = 212 °F. Instant results.',
        description:
          'Enter a temperature in Celsius to get Fahrenheit. Multiply by 9/5 and add 32: 20 °C is 68 °F, body temperature 37 °C is 98.6 °F and water boils at 212 °F.',
        config: { quantity: 'temperature', init_from: 'c', init_to: 'f' },
        keywords: [
          'celsius to fahrenheit',
          'c to f',
          '°c to °f',
          'convert celsius to fahrenheit',
        ],
      },
    ],
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
    related: [
      'cooking-measurement-converter',
      'weight-converter',
      'area-converter',
      'length-converter',
    ],
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
    related: ['fuel-economy-converter', 'length-converter', 'time-converter'],
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
    related: [
      'power-converter',
      'torque-converter',
      'bmr-calculator',
      'temperature-converter',
      'pressure-converter',
    ],
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
  {
    quantity: 'power',
    name: 'Power',
    icon: '⚡',
    examples: 'kW to hp, watts to horsepower, hp to kW',
    intro:
      'Convert power units — watts, kilowatts, megawatts, mechanical, metric (PS) and electrical horsepower, BTU per hour and tons of refrigeration.',
    title: 'Power Converter – kW to hp, Watts to Horsepower & BTU/h',
    meta: 'Convert kW to hp, watts to horsepower, PS to kW and BTU/h to watts. Mechanical, metric (PS) and electrical horsepower explained. Instant and free.',
    description:
      'Convert power between watts, kilowatts, horsepower and more: 100 kW is 134.1 mechanical hp or 136 PS, and a 12,000 BTU/h air conditioner draws about 3.5 kW of cooling power. Results update as you type, with every unit listed.',
    about:
      'There are three common horsepowers: mechanical (imperial) hp = 745.7 W, used for US and UK car engines; metric hp (PS, CV, pk) = 735.5 W, used in Europe and Japan; and electrical hp = exactly 746 W, used for electric motors.',
    extraAbout: [
      'Air conditioners and heaters are rated in BTU per hour: 1 W = 3.412 BTU/h, and one “ton” of refrigeration is 12,000 BTU/h (about 3.517 kW) — the cooling power of melting one short ton of ice per day.',
    ],
    faq: {
      q: 'Is PS the same as horsepower?',
      a: 'Almost: 1 PS (metric horsepower) is 735.5 W, about 1.4 % less than mechanical hp (745.7 W). A 150 PS car engine is about 148 hp.',
    },
    extraFaqs: [
      {
        q: 'How many watts is 1 horsepower?',
        a: 'Mechanical horsepower is 745.7 W, metric horsepower 735.5 W and electrical horsepower exactly 746 W.',
      },
    ],
    keywords: [
      'power converter',
      'kw to hp',
      'watts to horsepower',
      'hp to kw',
      'btu to watts',
    ],
    related: [
      'energy-converter',
      'torque-converter',
      'fuel-economy-converter',
      'speed-converter',
    ],
    variants: [
      {
        slug: 'watts-to-horsepower',
        name: 'Watts to Horsepower Converter',
        title: 'Watts to Horsepower Converter – W to hp (and hp to W)',
        metaDescription:
          'Convert watts to horsepower: 1 W = 0.00134 hp and 1 hp = 745.7 W. Also metric PS and electrical hp. Enter a value for an instant, exact result.',
        description:
          'Enter watts to get mechanical horsepower — 1,000 W is 1.341 hp — with metric (PS) and electrical horsepower listed below.',
        config: { quantity: 'power', init_from: 'W', init_to: 'hp' },
        keywords: ['watts to horsepower', 'w to hp', 'convert watts to hp'],
      },
    ],
  },
  {
    quantity: 'torque',
    name: 'Torque',
    icon: '🔧',
    examples: 'Nm to lb-ft, lb-ft to Nm, kgf·m to Nm',
    intro:
      'Convert torque units — newton-meters, kilonewton-meters, newton-centimeters, pound-feet, pound-inches, ounce-inches and kilogram-force meters and centimeters.',
    title: 'Torque Converter – Nm to lb-ft, ft-lb to Nm & kgf·m',
    meta: 'Convert torque: newton-meters to pound-feet (Nm to lb-ft), lb-in, oz-in and kgf·m. For engines, bolts and torque wrenches. Instant and free.',
    description:
      'Convert torque between newton-meters, pound-feet, pound-inches and kilogram-force meters — 100 N·m is 73.76 lb·ft. Useful for engine specs, wheel nuts and torque-wrench settings.',
    about:
      'Torque is a turning force: force times the distance from the axis. 1 lbf·ft = 1.3558 N·m, and 1 kgf·m = 9.80665 N·m. A pound-foot and a foot-pound are the same quantity; engineers write lb·ft for torque to tell it apart from the energy unit.',
    extraAbout: [
      'Wheel nuts on a typical car are tightened to 100–140 N·m (74–103 lb·ft); small screws and bike parts are specified in N·m or lb·in, where 12 lb·in make 1 lb·ft.',
    ],
    faq: {
      q: 'How many lb-ft is 100 Nm?',
      a: 'About 73.76 lb·ft. To convert N·m to lb·ft, multiply by 0.7376.',
    },
    keywords: [
      'torque converter',
      'nm to lb ft',
      'ft lb to nm',
      'torque conversion',
      'kgf m to nm',
    ],
    related: [
      'power-converter',
      'energy-converter',
      'pressure-converter',
      'weight-converter',
    ],
  },
  {
    quantity: 'fuel-economy',
    name: 'Fuel Economy',
    icon: '⛽',
    examples: 'mpg to L/100 km, L/100 km to mpg, km/L',
    intro:
      'Convert fuel economy between miles per gallon (US and UK), liters per 100 km, kilometers per liter and gallons per 100 miles.',
    title: 'Fuel Economy Converter – MPG to L/100 km (US & UK Gallons)',
    meta: 'Convert mpg to L/100 km and back, plus km/L and UK mpg. 30 US mpg = 7.84 L/100 km. Handles reciprocal units correctly. Free and instant.',
    description:
      'Convert fuel consumption between miles per gallon and liters per 100 km — 30 US mpg is 7.84 L/100 km and 5 L/100 km is 56.5 UK mpg — plus km/L and gallons per 100 miles.',
    about:
      'Miles per gallon and km per liter measure distance per fuel (higher is better), while L/100 km and gallons per 100 miles measure fuel per distance (lower is better). Converting between them is a reciprocal, not a multiplication: L/100 km = 235.21 ÷ US mpg.',
    extraAbout: [
      'UK and US mpg differ because the imperial gallon (4.546 L) is about 20 % bigger than the US gallon (3.785 L), so the same car shows a higher mpg figure in the UK: 40 UK mpg is only 33.3 US mpg.',
    ],
    faq: {
      q: 'How do I convert mpg to L/100 km?',
      a: 'Divide 235.21 by US mpg (or 282.48 by UK mpg). For example, 30 US mpg = 235.21 ÷ 30 = 7.84 L/100 km.',
    },
    extraFaqs: [
      {
        q: 'Why do small mpg gains matter more for thirsty cars?',
        a: 'Because fuel used is the reciprocal. Going from 10 to 12 mpg saves more fuel per mile than going from 40 to 50 mpg — L/100 km shows this directly.',
      },
    ],
    keywords: [
      'fuel economy converter',
      'mpg to l/100km',
      'l/100km to mpg',
      'mpg converter',
      'km/l to mpg',
    ],
    related: [
      'speed-converter',
      'volume-converter',
      'length-converter',
      'power-converter',
    ],
    variants: [
      {
        slug: 'mpg-to-l-per-100km',
        name: 'MPG to L/100 km Converter',
        title: 'MPG to L/100 km Converter – Miles per Gallon to Liters',
        metaDescription:
          'Convert miles per gallon to liters per 100 km instantly: 30 US mpg = 7.84 L/100 km. Choose US or UK gallons; see km/L too.',
        description:
          'Enter miles per gallon (US) to get liters per 100 km — 25 mpg is 9.41 L/100 km. Switch to UK mpg for imperial gallons.',
        config: {
          quantity: 'fuel-economy',
          init_from: 'mpgus',
          init_to: 'l100km',
        },
        keywords: [
          'mpg to l/100km',
          'mpg to liters per 100 km',
          'miles per gallon to l/100km',
        ],
      },
    ],
  },
];

const MEASUREMENT_CONVERTERS: ToolDefinition[] = SPECS.map((s) => ({
  slug: `${s.quantity}-converter`,
  category: 'unit-converters',
  name: `${s.name} Converter`,
  icon: s.icon,
  shortDescription: `Convert ${s.examples}.`,
  description:
    s.description ??
    `${s.intro} Type a value to see the result instantly, together with a table of every other unit.`,
  title:
    s.title ??
    `${s.name} Converter – ${s.examples.split(',')[0].replace(/^\w/, (c) => c.toUpperCase())} & More`,
  metaDescription:
    s.meta ??
    `Free ${s.name.toLowerCase()} converter: ${s.examples} and more. Accurate results as you type, with a full conversion table.`,
  keywords: s.keywords,
  relatedTools: s.related,
  component: 'unit-converter',
  config: { quantity: s.quantity },
  popular:
    s.popular ?? (s.quantity === 'length' || s.quantity === 'temperature'),
  howTo: [
    'Enter a value.',
    'Choose the unit to convert from and to (use ⇄ to swap).',
    'Read the result, or scan the table for every unit at once.',
  ],
  about: [
    s.about,
    ...(s.extraAbout ?? []),
    'Results show up to 10 significant digits; very large or small values switch to scientific notation.',
  ],
  faqs: [s.faq, ...(s.extraFaqs ?? [])],
  ...(s.variants ? { variants: s.variants } : {}),
}));

const EVERYDAY_CONVERTERS: ToolDefinition[] = [
  {
    slug: 'cooking-measurement-converter',
    category: 'unit-converters',
    name: 'Cooking Measurement Converter',
    icon: '🥄',
    shortDescription: 'Cups to grams, tbsp to ml, oz to g — by ingredient.',
    description:
      'Convert recipe measurements between cups, tablespoons, teaspoons, milliliters, grams, ounces and sticks of butter. Pick the ingredient to convert volume to weight correctly — 1 cup of flour is about 120 g, but 1 cup of sugar is about 198 g — plus an oven temperature chart with gas marks.',
    title: 'Cooking Measurement Converter – Cups to Grams, Tbsp, Ml & Oz',
    metaDescription:
      'Convert cups to grams, tablespoons to ml, ounces to grams and more by ingredient (flour, sugar, butter…). US, metric and UK cups, plus oven temperatures.',
    keywords: [
      'cooking measurement converter',
      'cups to grams',
      'grams to cups',
      'tablespoons to ml',
      'baking conversion chart',
    ],
    relatedTools: [
      'weight-converter',
      'volume-converter',
      'temperature-converter',
      'unit-price-calculator',
      'calorie-calculator',
    ],
    component: 'cooking-converter',
    popular: true,
    howTo: [
      'Enter the amount and choose the unit you have and the unit you want.',
      'Pick the ingredient — it matters when converting between volume (cups, spoons) and weight (grams, ounces).',
      'Read the result; kitchen fractions such as ⅓ cup are shown where they fit.',
    ],
    about: [
      'Volume and weight can only be converted with the ingredient’s density: a cup of water weighs 237 g, a cup of all-purpose flour about 120 g and a cup of honey about 336 g. The tool uses typical weights for a level, spooned cup from published baking charts; weighing with a kitchen scale is always the most accurate.',
      'Cup sizes differ by country: a US cup is 236.6 ml, a metric cup (Australia, New Zealand, Canada) 250 ml, and old British recipes used a 284 ml imperial cup. One US tablespoon is 3 teaspoons (14.8 ml); an Australian tablespoon is 20 ml.',
    ],
    faqs: [
      {
        q: 'How many grams is 1 cup of flour?',
        a: 'About 120 g of all-purpose flour, spooned and levelled. Scooped flour can weigh 140 g or more, which is why bakers prefer weights.',
      },
      {
        q: 'How many tablespoons are in a cup?',
        a: '16 US tablespoons, or 48 teaspoons. A quarter cup is 4 tablespoons.',
      },
      {
        q: 'How much is a stick of butter?',
        a: 'A US stick is ½ cup, 8 tablespoons or 4 oz — about 113 g.',
      },
    ],
    variants: [
      {
        slug: 'cups-to-grams',
        name: 'Cups to Grams Converter',
        title: 'Cups to Grams Converter – Flour, Sugar, Butter & More',
        metaDescription:
          'Convert cups to grams for 30+ ingredients: 1 cup flour = 120 g, sugar = 198 g, butter = 227 g. US and metric cups. Free baking converter.',
        description:
          'Choose an ingredient and enter cups to get grams — 1 cup of all-purpose flour is 120 g, granulated sugar 198 g and butter 227 g.',
        config: { init_from: 'cup', init_to: 'g' },
        keywords: [
          'cups to grams',
          'cup of flour in grams',
          'cups to grams converter',
        ],
      },
    ],
  },
  {
    slug: 'shoe-size-converter',
    category: 'unit-converters',
    name: 'Shoe Size Converter',
    icon: '👟',
    shortDescription: 'US, UK, EU and cm shoe sizes for men, women and kids.',
    description:
      'Convert shoe sizes between US, UK, EU and foot length in cm, inches and Mondopoint (JP) for men, women and kids — or measure your foot and find your size. US men’s 10 is UK 9.5 and EU 44 on the standard chart.',
    title: 'Shoe Size Converter – US, UK, EU & CM for Men, Women, Kids',
    metaDescription:
      'Convert shoe sizes between US, UK, EU and cm for men, women and kids, or find your size from foot length. Includes Mondopoint/JP sizes and a full chart.',
    keywords: [
      'shoe size converter',
      'us to eu shoe size',
      'uk to us shoe size',
      'shoe size chart',
      'eu shoe size to us',
    ],
    relatedTools: [
      'clothing-size-converter',
      'length-converter',
      'unit-price-calculator',
      'bmi-calculator',
    ],
    component: 'size-converter',
    config: { kind: 'shoe' },
    popular: true,
    howTo: [
      'Choose men, women or kids.',
      'Select your size system and size — or enter your foot length.',
      'Read the matching US, UK, EU, cm and Mondopoint sizes; the row is highlighted in the chart.',
    ],
    about: [
      'Each system counts differently: US and UK sizes step in thirds of an inch from different starting points (and US women’s sizes are about 1 to 1.5 larger than men’s), EU sizes use Paris points of ⅔ cm, and Mondopoint and Japanese sizes are simply the foot length in millimeters or centimeters. That is why conversions can differ by half a size between charts.',
      'To measure, stand on paper in the evening (feet swell during the day), mark heel and longest toe, and measure in cm. If you are between sizes, choose the larger one. Brands — especially sports and European brands — run differently, so check the brand’s own chart.',
    ],
    faqs: [
      {
        q: 'Is women’s US size the same as men’s?',
        a: 'No. A US women’s size is about 1 to 1.5 larger than the men’s size for the same foot: on this chart a women’s 9 (26 cm) matches a men’s 8.',
      },
      {
        q: 'What size is EU 42 in US?',
        a: 'On the standard chart EU 42 is US men’s 8.5 or US women’s about 10.5–11.',
      },
    ],
  },
  {
    slug: 'clothing-size-converter',
    category: 'unit-converters',
    name: 'Clothing Size Converter',
    icon: '👕',
    shortDescription: 'International clothing sizes: US, UK, EU, IT, JP.',
    description:
      'Convert clothing sizes between US, UK, EU, French, Italian and (for women’s sizes) Japanese systems and S/M/L letters — women’s dresses and tops, men’s jackets, shirts and trousers — or enter your measurements to find your size.',
    title: 'Clothing Size Converter – US, UK, EU, IT & JP Size Charts',
    metaDescription:
      'Convert women’s and men’s clothing sizes between US, UK, EU, IT, FR and JP, plus S/M/L. Dresses, jackets, shirts and trousers — or find a size by measurement.',
    keywords: [
      'clothing size converter',
      'us to uk dress size',
      'eu to us clothing size',
      'international size chart',
      'italian size to us',
    ],
    relatedTools: [
      'shoe-size-converter',
      'length-converter',
      'bmi-calculator',
      'body-fat-calculator',
    ],
    component: 'size-converter',
    config: { kind: 'clothing' },
    howTo: [
      'Choose the type of clothing.',
      'Select a size system and size, or enter your bust, chest, neck or waist measurement.',
      'Read the equivalent sizes; the row is highlighted in the chart.',
    ],
    about: [
      'Women’s sizes follow fixed offsets between countries: UK = US + 4, EU/German = US + 30, French = EU + 2, and Italian = EU + 6 — so a US 8 is a UK 12, EU 38 and IT 44. Men’s jackets in the US and UK are labelled by chest size in inches (40 = about 102 cm), while EU jacket sizes are about half the chest in centimeters (50).',
      'Men’s dress shirts are sized by neck circumference (15.5 in ≈ 39 cm) and trousers by waist in inches. Letter sizes vary most between brands and countries; a measurement-based lookup is the safest way to buy abroad.',
    ],
    faqs: [
      {
        q: 'What is a US size 8 in UK and EU?',
        a: 'A US women’s 8 is a UK 12 and an EU 38 (Italian 44, French 40).',
      },
      {
        q: 'Are Asian sizes smaller?',
        a: 'Often yes — Japanese, Chinese and Korean brands tend to cut smaller, so going up one letter size is common. Use your measurements to check.',
      },
    ],
  },
];

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
    alsoIn: ['reference-tools'],
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
  ...EVERYDAY_CONVERTERS,
];
