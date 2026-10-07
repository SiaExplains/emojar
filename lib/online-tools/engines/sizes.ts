// Shoe and clothing size charts. These are the widely published standard
// conversions; individual brands deviate, so the UI recommends measuring.

export type SizeTable = {
  id: string;
  name: string;
  columns: { id: string; name: string }[];
  rows: Record<string, string>[];
  /** Column holding a body/foot measurement in cm, used for lookups. */
  measureColumn?: string;
  /** Allowed shortfall when matching a measurement (fraction of it). */
  tolerance?: number;
  note?: string;
};

const zip = (cols: Record<string, (string | number)[]>) => {
  const keys = Object.keys(cols);
  return cols[keys[0]].map((_, i) =>
    Object.fromEntries(keys.map((k) => [k, String(cols[k][i])])),
  );
};

const SHOE_COLUMNS = [
  { id: 'us', name: 'US' },
  { id: 'uk', name: 'UK' },
  { id: 'eu', name: 'EU' },
  { id: 'cm', name: 'Foot length (cm)' },
  { id: 'in', name: 'Foot length (in)' },
  { id: 'mondo', name: 'Mondopoint / JP (mm)' },
];

function shoeRows(
  us: (string | number)[],
  uk: (string | number)[],
  eu: number[],
  cm: number[],
) {
  return zip({
    us,
    uk,
    eu,
    cm,
    in: cm.map((c) => (c / 2.54).toFixed(1)),
    mondo: cm.map((c) => Math.round(c * 10)),
  });
}

export const SHOE_TABLES: SizeTable[] = [
  {
    id: 'men',
    name: 'Men',
    columns: SHOE_COLUMNS,
    measureColumn: 'cm',
    rows: shoeRows(
      [6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12, 13, 14, 15],
      [
        5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12.5, 13.5,
        14.5,
      ],
      [
        39, 39.5, 40, 40.5, 41, 42, 42.5, 43, 44, 44.5, 45, 45.5, 46, 47.5,
        48.5, 49.5,
      ],
      [
        24, 24.5, 25, 25.5, 26, 26.5, 27, 27.5, 28, 28.5, 29, 29.5, 30, 31, 32,
        33,
      ],
    ),
  },
  {
    id: 'women',
    name: 'Women',
    columns: SHOE_COLUMNS,
    measureColumn: 'cm',
    rows: shoeRows(
      [5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 12],
      [3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 10],
      [35.5, 36, 36.5, 37, 37.5, 38, 38.5, 39, 40, 40.5, 41, 41.5, 42, 43],
      [22, 22.5, 23, 23.5, 24, 24.5, 25, 25.5, 26, 26.5, 27, 27.5, 28, 29],
    ),
  },
  {
    id: 'kids',
    name: 'Kids',
    columns: SHOE_COLUMNS,
    measureColumn: 'cm',
    note: 'US toddler sizes end in C (child), youth sizes in Y; UK sizes restart at 1 after 13 (junior sizes).',
    rows: shoeRows(
      [
        '4C',
        '5C',
        '6C',
        '7C',
        '8C',
        '9C',
        '10C',
        '11C',
        '12C',
        '13C',
        '1Y',
        '2Y',
        '3Y',
        '4Y',
        '5Y',
        '6Y',
        '7Y',
      ],
      [
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10,
        11,
        12,
        13,
        '1 (junior)',
        '2 (junior)',
        '3 (junior)',
        '4 (junior)',
        '5 (junior)',
        '6 (junior)',
      ],
      [19, 20, 22, 23, 24, 25, 27, 28, 30, 31, 32, 33, 34, 36, 37, 38, 40],
      [
        12, 12.5, 13.5, 14, 15, 15.5, 16.5, 17, 18, 19, 20, 20.5, 21.5, 22.5,
        23, 24, 25,
      ],
    ),
  },
];

const inCm = (xs: number[]) => xs.map((x) => Math.round(x * 2.54));

export const CLOTHING_TABLES: SizeTable[] = (<SizeTable[]>[
  {
    id: 'women-dresses',
    name: 'Women’s dresses & tops',
    columns: [
      { id: 'letter', name: 'Letter' },
      { id: 'us', name: 'US' },
      { id: 'uk', name: 'UK / AU' },
      { id: 'eu', name: 'EU / DE' },
      { id: 'fr', name: 'FR / ES' },
      { id: 'it', name: 'IT' },
      { id: 'jp', name: 'JP' },
      { id: 'bust', name: 'Bust (cm)' },
    ],
    measureColumn: 'bust',
    rows: zip({
      letter: ['XXS', 'XS', 'S', 'S', 'M', 'M', 'L', 'L', 'XL', 'XL', 'XXL'],
      us: [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20],
      uk: [4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24],
      eu: [30, 32, 34, 36, 38, 40, 42, 44, 46, 48, 50],
      fr: [32, 34, 36, 38, 40, 42, 44, 46, 48, 50, 52],
      it: [36, 38, 40, 42, 44, 46, 48, 50, 52, 54, 56],
      jp: [3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23],
      bust: [76, 80, 84, 88, 92, 96, 100, 104, 110, 116, 122],
    }),
  },
  {
    id: 'men-jackets',
    name: 'Men’s suits & jackets',
    columns: [
      { id: 'letter', name: 'Letter' },
      { id: 'us', name: 'US / UK' },
      { id: 'eu', name: 'EU / IT' },
      { id: 'chest', name: 'Chest (cm)' },
    ],
    measureColumn: 'chest',
    rows: zip({
      letter: ['XS', 'S', 'S', 'M', 'M', 'L', 'L', 'XL', 'XL', 'XXL'],
      us: [34, 36, 37, 38, 40, 42, 44, 46, 48, 50],
      eu: [44, 46, 47, 48, 50, 52, 54, 56, 58, 60],
      chest: inCm([34, 36, 37, 38, 40, 42, 44, 46, 48, 50]),
    }),
    note: 'US/UK jacket sizes are the chest measurement in inches; EU sizes are about half the chest in cm.',
  },
  {
    id: 'men-shirts',
    name: 'Men’s dress shirts',
    columns: [
      { id: 'letter', name: 'Letter' },
      { id: 'us', name: 'US / UK (neck in)' },
      { id: 'eu', name: 'EU (neck cm)' },
    ],
    measureColumn: 'eu',
    rows: zip({
      letter: ['S', 'S', 'M', 'M', 'L', 'L', 'XL', 'XL', 'XXL'],
      us: [14, 14.5, 15, 15.5, 16, 16.5, 17, 17.5, 18],
      eu: [36, 37, 38, 39, 41, 42, 43, 44, 46],
    }),
  },
  {
    id: 'trousers',
    name: 'Men’s trousers & jeans',
    columns: [
      { id: 'letter', name: 'Letter' },
      { id: 'us', name: 'US / UK (waist in)' },
      { id: 'eu', name: 'EU / DE' },
      { id: 'waist', name: 'Waist (cm)' },
    ],
    measureColumn: 'waist',
    rows: zip({
      letter: ['XS', 'S', 'S', 'M', 'M', 'L', 'L', 'XL', 'XL', 'XXL'],
      us: [28, 29, 30, 31, 32, 33, 34, 36, 38, 40],
      eu: [44, 45, 46, 47, 48, 49, 50, 52, 54, 56],
      waist: inCm([28, 29, 30, 31, 32, 33, 34, 36, 38, 40]),
    }),
    note: 'Jeans are labelled W (waist) × L (inside leg) in inches, e.g. W32 L32.',
  },
]).map((t) => ({ ...t, tolerance: 0.01 }));

export function findRow(table: SizeTable, column: string, value: string) {
  const v = value.trim().toUpperCase();
  return table.rows.findIndex((r) => r[column]?.toUpperCase() === v);
}

/** Smallest size whose measurement is at least the given body/foot size. */
export function rowForMeasurement(table: SizeTable, cm: number): number {
  const col = table.measureColumn;
  if (!col || !Number.isFinite(cm) || cm <= 0) return -1;
  // Shoes round strictly up (a shoe must not be shorter than the foot);
  // clothing charts allow 1 % because values are rounded (15.5 in = 39.4 cm
  // is shirt size 39).
  const tol = Math.max(0.05, cm * (table.tolerance ?? 0));
  const i = table.rows.findIndex((r) => Number(r[col]) >= cm - tol);
  return i;
}
