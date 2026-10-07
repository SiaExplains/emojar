// Cooking measurements: volume and weight units, and ingredient densities
// (grams per US cup) to convert between them. Densities are typical values
// from published baking weight charts — how you fill a cup changes them.

import { ToolInputError } from './data';

export type CookingUnit = {
  id: string;
  name: string;
  symbol: string;
  kind: 'volume' | 'weight';
  /** Milliliters (volume) or grams (weight) per unit. */
  factor: number;
};

const v = (
  id: string,
  name: string,
  symbol: string,
  ml: number,
): CookingUnit => ({
  id,
  name,
  symbol,
  kind: 'volume',
  factor: ml,
});
const w = (
  id: string,
  name: string,
  symbol: string,
  g: number,
): CookingUnit => ({
  id,
  name,
  symbol,
  kind: 'weight',
  factor: g,
});

export const US_CUP_ML = 236.5882365;

export const COOKING_UNITS: CookingUnit[] = [
  v('cup', 'Cup (US)', 'cup', US_CUP_ML),
  v('cup-metric', 'Cup (metric, AU/NZ/CA)', 'metric cup', 250),
  v('cup-uk', 'Cup (imperial UK, traditional)', 'UK cup', 284.130625),
  v('tbsp', 'Tablespoon (US)', 'tbsp', 14.78676478125),
  v('tsp', 'Teaspoon (US)', 'tsp', 4.92892159375),
  v('tbsp-metric', 'Tablespoon (metric, 15 ml)', 'tbsp (15 ml)', 15),
  v('tbsp-au', 'Tablespoon (Australia, 20 ml)', 'tbsp (20 ml)', 20),
  v('tsp-metric', 'Teaspoon (metric, 5 ml)', 'tsp (5 ml)', 5),
  v('floz', 'Fluid ounce (US)', 'fl oz', 29.5735295625),
  v('floz-uk', 'Fluid ounce (UK)', 'UK fl oz', 28.4130625),
  v('ml', 'Milliliter', 'ml', 1),
  v('l', 'Liter', 'l', 1000),
  v('pint', 'Pint (US)', 'pt', 473.176473),
  v('pint-uk', 'Pint (UK)', 'UK pt', 568.26125),
  v('quart', 'Quart (US)', 'qt', 946.352946),
  v('gallon', 'Gallon (US)', 'gal', 3785.411784),
  w('g', 'Gram', 'g', 1),
  w('kg', 'Kilogram', 'kg', 1000),
  w('oz', 'Ounce (weight)', 'oz', 28.349523125),
  w('lb', 'Pound', 'lb', 453.59237),
  w('stick', 'Stick of butter (US, 4 oz)', 'stick', 113.3980925),
];

export type Ingredient = { id: string; name: string; gramsPerCup: number };

// Grams per level US cup (spooned and levelled for flours).
export const INGREDIENTS: Ingredient[] = [
  { id: 'water', name: 'Water', gramsPerCup: 236.6 },
  { id: 'milk', name: 'Milk', gramsPerCup: 242 },
  { id: 'cream', name: 'Heavy cream', gramsPerCup: 238 },
  { id: 'buttermilk', name: 'Buttermilk', gramsPerCup: 242 },
  { id: 'yogurt', name: 'Yogurt / sour cream', gramsPerCup: 227 },
  { id: 'butter', name: 'Butter', gramsPerCup: 227 },
  { id: 'oil', name: 'Vegetable oil', gramsPerCup: 198 },
  { id: 'olive-oil', name: 'Olive oil', gramsPerCup: 200 },
  { id: 'honey', name: 'Honey', gramsPerCup: 336 },
  { id: 'maple', name: 'Maple syrup', gramsPerCup: 312 },
  { id: 'corn-syrup', name: 'Corn syrup', gramsPerCup: 328 },
  { id: 'peanut-butter', name: 'Peanut butter', gramsPerCup: 270 },
  { id: 'ap-flour', name: 'All-purpose flour', gramsPerCup: 120 },
  { id: 'bread-flour', name: 'Bread flour', gramsPerCup: 120 },
  { id: 'cake-flour', name: 'Cake flour', gramsPerCup: 114 },
  { id: 'ww-flour', name: 'Whole wheat flour', gramsPerCup: 113 },
  { id: 'almond-flour', name: 'Almond flour', gramsPerCup: 96 },
  { id: 'cornstarch', name: 'Cornstarch', gramsPerCup: 112 },
  { id: 'cocoa', name: 'Cocoa powder', gramsPerCup: 84 },
  { id: 'sugar', name: 'Granulated sugar', gramsPerCup: 198 },
  { id: 'brown-sugar', name: 'Brown sugar (packed)', gramsPerCup: 213 },
  { id: 'powdered-sugar', name: 'Powdered (icing) sugar', gramsPerCup: 113 },
  { id: 'rice', name: 'Rice (uncooked, long grain)', gramsPerCup: 185 },
  { id: 'oats', name: 'Rolled oats', gramsPerCup: 89 },
  { id: 'chocolate-chips', name: 'Chocolate chips', gramsPerCup: 170 },
  { id: 'nuts', name: 'Chopped nuts (walnuts, pecans)', gramsPerCup: 113 },
  { id: 'raisins', name: 'Raisins', gramsPerCup: 149 },
  { id: 'coconut', name: 'Shredded coconut (sweetened)', gramsPerCup: 85 },
  { id: 'parmesan', name: 'Grated Parmesan', gramsPerCup: 100 },
  { id: 'salt', name: 'Table salt', gramsPerCup: 288 },
  {
    id: 'kosher-salt',
    name: 'Kosher salt (Diamond Crystal)',
    gramsPerCup: 135,
  },
  { id: 'baking-powder', name: 'Baking powder', gramsPerCup: 192 },
  { id: 'baking-soda', name: 'Baking soda', gramsPerCup: 288 },
  { id: 'yeast', name: 'Instant / active dry yeast', gramsPerCup: 149 },
];

export function convertCooking(
  amount: number,
  fromId: string,
  toId: string,
  ingredientId = 'water',
): number {
  const from = COOKING_UNITS.find((u) => u.id === fromId);
  const to = COOKING_UNITS.find((u) => u.id === toId);
  if (!from || !to) throw new ToolInputError('Unknown unit.');
  if (from.kind === to.kind) return (amount * from.factor) / to.factor;
  const ing = INGREDIENTS.find((i) => i.id === ingredientId);
  if (!ing)
    throw new ToolInputError(
      'Choose an ingredient to convert between volume and weight.',
    );
  const gramsPerMl = ing.gramsPerCup / US_CUP_ML;
  if (from.kind === 'volume')
    return (amount * from.factor * gramsPerMl) / to.factor;
  return (amount * from.factor) / gramsPerMl / to.factor;
}

/** Nicest kitchen fraction for a cup/spoon amount, e.g. 0.333 → "⅓". */
export function kitchenFraction(x: number): string {
  if (!Number.isFinite(x) || x <= 0) return '';
  const whole = Math.floor(x + 1e-9);
  const frac = x - whole;
  const options: [number, string][] = [
    [0, ''],
    [1 / 8, '⅛'],
    [1 / 4, '¼'],
    [1 / 3, '⅓'],
    [3 / 8, '⅜'],
    [1 / 2, '½'],
    [5 / 8, '⅝'],
    [2 / 3, '⅔'],
    [3 / 4, '¾'],
    [7 / 8, '⅞'],
    [1, ''],
  ];
  let best = options[0];
  for (const o of options)
    if (Math.abs(o[0] - frac) < Math.abs(best[0] - frac)) best = o;
  if (Math.abs(best[0] - frac) > 0.04) return '';
  const w2 = best[0] === 1 ? whole + 1 : whole;
  return `≈ ${w2 ? w2 : ''}${w2 && best[1] ? ' ' : ''}${best[1]}`.trim() || '';
}

export const OVEN_TEMPS: {
  gas: string;
  c: number;
  f: number;
  fan: number;
  desc: string;
}[] = [
  { gas: '¼', c: 110, f: 225, fan: 90, desc: 'Very cool' },
  { gas: '½', c: 120, f: 250, fan: 100, desc: 'Very cool' },
  { gas: '1', c: 140, f: 275, fan: 120, desc: 'Cool' },
  { gas: '2', c: 150, f: 300, fan: 130, desc: 'Cool' },
  { gas: '3', c: 170, f: 325, fan: 150, desc: 'Moderate' },
  { gas: '4', c: 180, f: 350, fan: 160, desc: 'Moderate' },
  { gas: '5', c: 190, f: 375, fan: 170, desc: 'Moderately hot' },
  { gas: '6', c: 200, f: 400, fan: 180, desc: 'Hot' },
  { gas: '7', c: 220, f: 425, fan: 200, desc: 'Hot' },
  { gas: '8', c: 230, f: 450, fan: 210, desc: 'Very hot' },
  { gas: '9', c: 240, f: 475, fan: 220, desc: 'Very hot' },
];
