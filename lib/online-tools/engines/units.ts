// Unit tables for the unit converters. Every unit is defined by its factor
// to the quantity's base unit; temperature is the one affine exception.

export type Unit = {
  id: string;
  name: string;
  symbol: string;
  /** Multiply by this to get the base unit. */
  factor: number;
  /** Reciprocal unit (e.g. L/100 km): base = factor / value. */
  inverse?: boolean;
};

export type Quantity = {
  id: string;
  name: string;
  base: string;
  units: Unit[];
  defaultFrom: string;
  defaultTo: string;
};

const u = (
  id: string,
  name: string,
  symbol: string,
  factor: number,
  inverse?: boolean,
): Unit => ({
  id,
  name,
  symbol,
  factor,
  ...(inverse ? { inverse } : {}),
});

export const QUANTITIES: Record<string, Quantity> = {
  length: {
    id: 'length',
    name: 'Length',
    base: 'm',
    defaultFrom: 'km',
    defaultTo: 'mi',
    units: [
      u('nm', 'Nanometer', 'nm', 1e-9),
      u('um', 'Micrometer', 'µm', 1e-6),
      u('mm', 'Millimeter', 'mm', 0.001),
      u('cm', 'Centimeter', 'cm', 0.01),
      u('m', 'Meter', 'm', 1),
      u('km', 'Kilometer', 'km', 1000),
      u('in', 'Inch', 'in', 0.0254),
      u('ft', 'Foot', 'ft', 0.3048),
      u('yd', 'Yard', 'yd', 0.9144),
      u('mi', 'Mile', 'mi', 1609.344),
      u('nmi', 'Nautical mile', 'nmi', 1852),
    ],
  },
  weight: {
    id: 'weight',
    name: 'Weight',
    base: 'kg',
    defaultFrom: 'kg',
    defaultTo: 'lb',
    units: [
      u('mg', 'Milligram', 'mg', 1e-6),
      u('g', 'Gram', 'g', 0.001),
      u('kg', 'Kilogram', 'kg', 1),
      u('t', 'Metric ton', 't', 1000),
      u('oz', 'Ounce', 'oz', 0.028349523125),
      u('lb', 'Pound', 'lb', 0.45359237),
      u('st', 'Stone', 'st', 6.35029318),
      u('ust', 'US ton (short)', 'ton', 907.18474),
      u('ukt', 'UK ton (long)', 'LT', 1016.0469088),
      u('ct', 'Carat', 'ct', 0.0002),
    ],
  },
  temperature: {
    id: 'temperature',
    name: 'Temperature',
    base: 'c',
    defaultFrom: 'c',
    defaultTo: 'f',
    units: [
      u('c', 'Celsius', '°C', 1),
      u('f', 'Fahrenheit', '°F', 1),
      u('k', 'Kelvin', 'K', 1),
      u('r', 'Rankine', '°R', 1),
    ],
  },
  area: {
    id: 'area',
    name: 'Area',
    base: 'm2',
    defaultFrom: 'm2',
    defaultTo: 'ft2',
    units: [
      u('mm2', 'Square millimeter', 'mm²', 1e-6),
      u('cm2', 'Square centimeter', 'cm²', 1e-4),
      u('m2', 'Square meter', 'm²', 1),
      u('ha', 'Hectare', 'ha', 10_000),
      u('km2', 'Square kilometer', 'km²', 1e6),
      u('in2', 'Square inch', 'in²', 0.00064516),
      u('ft2', 'Square foot', 'ft²', 0.09290304),
      u('yd2', 'Square yard', 'yd²', 0.83612736),
      u('ac', 'Acre', 'ac', 4046.8564224),
      u('mi2', 'Square mile', 'mi²', 2589988.110336),
    ],
  },
  volume: {
    id: 'volume',
    name: 'Volume',
    base: 'l',
    defaultFrom: 'l',
    defaultTo: 'usgal',
    units: [
      u('ml', 'Milliliter', 'mL', 0.001),
      u('cl', 'Centiliter', 'cL', 0.01),
      u('l', 'Liter', 'L', 1),
      u('m3', 'Cubic meter', 'm³', 1000),
      u('tsp', 'Teaspoon (US)', 'tsp', 0.00492892159375),
      u('tbsp', 'Tablespoon (US)', 'tbsp', 0.01478676478125),
      u('floz', 'Fluid ounce (US)', 'fl oz', 0.0295735295625),
      u('cup', 'Cup (US)', 'cup', 0.2365882365),
      u('pt', 'Pint (US)', 'pt', 0.473176473),
      u('qt', 'Quart (US)', 'qt', 0.946352946),
      u('usgal', 'Gallon (US)', 'gal', 3.785411784),
      u('ukgal', 'Gallon (UK)', 'imp gal', 4.54609),
      u('in3', 'Cubic inch', 'in³', 0.016387064),
      u('ft3', 'Cubic foot', 'ft³', 28.316846592),
    ],
  },
  speed: {
    id: 'speed',
    name: 'Speed',
    base: 'mps',
    defaultFrom: 'kmh',
    defaultTo: 'mph',
    units: [
      u('mps', 'Meters per second', 'm/s', 1),
      u('kmh', 'Kilometers per hour', 'km/h', 1 / 3.6),
      u('mph', 'Miles per hour', 'mph', 0.44704),
      u('fps', 'Feet per second', 'ft/s', 0.3048),
      u('kn', 'Knot', 'kn', 1852 / 3600),
      u('mach', 'Mach (sea level)', 'Ma', 340.29),
    ],
  },
  time: {
    id: 'time',
    name: 'Time',
    base: 's',
    defaultFrom: 'h',
    defaultTo: 'min',
    units: [
      u('ms', 'Millisecond', 'ms', 0.001),
      u('s', 'Second', 's', 1),
      u('min', 'Minute', 'min', 60),
      u('h', 'Hour', 'h', 3600),
      u('d', 'Day', 'd', 86_400),
      u('wk', 'Week', 'wk', 604_800),
      u('mo', 'Month (average)', 'mo', 2_629_746),
      u('yr', 'Year (365.2425 days)', 'yr', 31_556_952),
    ],
  },
  'data-storage': {
    id: 'data-storage',
    name: 'Data storage',
    base: 'B',
    defaultFrom: 'GB',
    defaultTo: 'MB',
    units: [
      u('bit', 'Bit', 'bit', 0.125),
      u('B', 'Byte', 'B', 1),
      u('KB', 'Kilobyte', 'KB', 1e3),
      u('MB', 'Megabyte', 'MB', 1e6),
      u('GB', 'Gigabyte', 'GB', 1e9),
      u('TB', 'Terabyte', 'TB', 1e12),
      u('PB', 'Petabyte', 'PB', 1e15),
      u('KiB', 'Kibibyte', 'KiB', 1024),
      u('MiB', 'Mebibyte', 'MiB', 1024 ** 2),
      u('GiB', 'Gibibyte', 'GiB', 1024 ** 3),
      u('TiB', 'Tebibyte', 'TiB', 1024 ** 4),
    ],
  },
  energy: {
    id: 'energy',
    name: 'Energy',
    base: 'J',
    defaultFrom: 'kcal',
    defaultTo: 'kJ',
    units: [
      u('J', 'Joule', 'J', 1),
      u('kJ', 'Kilojoule', 'kJ', 1000),
      u('cal', 'Calorie', 'cal', 4.184),
      u('kcal', 'Kilocalorie', 'kcal', 4184),
      u('Wh', 'Watt-hour', 'Wh', 3600),
      u('kWh', 'Kilowatt-hour', 'kWh', 3.6e6),
      u('BTU', 'British thermal unit', 'BTU', 1055.05585262),
      u('eV', 'Electronvolt', 'eV', 1.602176634e-19),
      u('ftlb', 'Foot-pound', 'ft·lbf', 1.3558179483),
    ],
  },
  pressure: {
    id: 'pressure',
    name: 'Pressure',
    base: 'Pa',
    defaultFrom: 'bar',
    defaultTo: 'psi',
    units: [
      u('Pa', 'Pascal', 'Pa', 1),
      u('hPa', 'Hectopascal', 'hPa', 100),
      u('kPa', 'Kilopascal', 'kPa', 1000),
      u('MPa', 'Megapascal', 'MPa', 1e6),
      u('bar', 'Bar', 'bar', 1e5),
      u('mbar', 'Millibar', 'mbar', 100),
      u('atm', 'Atmosphere', 'atm', 101_325),
      u('psi', 'Pound per square inch', 'psi', 6894.757293168),
      u('mmHg', 'Millimeter of mercury', 'mmHg', 133.322387415),
      u('inHg', 'Inch of mercury', 'inHg', 3386.389),
    ],
  },
  frequency: {
    id: 'frequency',
    name: 'Frequency',
    base: 'Hz',
    defaultFrom: 'MHz',
    defaultTo: 'kHz',
    units: [
      u('Hz', 'Hertz', 'Hz', 1),
      u('kHz', 'Kilohertz', 'kHz', 1e3),
      u('MHz', 'Megahertz', 'MHz', 1e6),
      u('GHz', 'Gigahertz', 'GHz', 1e9),
      u('rpm', 'Revolutions per minute', 'rpm', 1 / 60),
    ],
  },
  angle: {
    id: 'angle',
    name: 'Angle',
    base: 'rad',
    defaultFrom: 'deg',
    defaultTo: 'rad',
    units: [
      u('deg', 'Degree', '°', Math.PI / 180),
      u('rad', 'Radian', 'rad', 1),
      u('grad', 'Gradian', 'gon', Math.PI / 200),
      u('arcmin', 'Arcminute', '′', Math.PI / 10_800),
      u('arcsec', 'Arcsecond', '″', Math.PI / 648_000),
      u('turn', 'Turn', 'tr', 2 * Math.PI),
    ],
  },
  power: {
    id: 'power',
    name: 'Power',
    base: 'W',
    defaultFrom: 'kW',
    defaultTo: 'hp',
    units: [
      u('W', 'Watt', 'W', 1),
      u('kW', 'Kilowatt', 'kW', 1000),
      u('MW', 'Megawatt', 'MW', 1e6),
      u('hp', 'Horsepower (mechanical, imperial)', 'hp', 745.69987158227022),
      u('PS', 'Metric horsepower (PS, CV, pk)', 'PS', 735.49875),
      u('hpE', 'Electrical horsepower', 'hp(E)', 746),
      u('BTUh', 'BTU per hour', 'BTU/h', 0.29307107017),
      u('kcalh', 'Kilocalorie per hour', 'kcal/h', 1.163),
      u('ftlbs', 'Foot-pound per second', 'ft·lbf/s', 1.3558179483),
      u('TR', 'Ton of refrigeration', 'TR', 3516.8528421),
    ],
  },
  torque: {
    id: 'torque',
    name: 'Torque',
    base: 'Nm',
    defaultFrom: 'Nm',
    defaultTo: 'lbft',
    units: [
      u('Nm', 'Newton-meter', 'N·m', 1),
      u('kNm', 'Kilonewton-meter', 'kN·m', 1000),
      u('Ncm', 'Newton-centimeter', 'N·cm', 0.01),
      u('lbft', 'Pound-foot', 'lbf·ft', 1.3558179483),
      u('lbin', 'Pound-inch', 'lbf·in', 0.112984829),
      u('ozin', 'Ounce-inch', 'ozf·in', 0.00706155183),
      u('kgfm', 'Kilogram-force meter', 'kgf·m', 9.80665),
      u('kgfcm', 'Kilogram-force centimeter', 'kgf·cm', 0.0980665),
    ],
  },
  // Base unit: kilometers per liter. Consumption units are reciprocal.
  'fuel-economy': {
    id: 'fuel-economy',
    name: 'Fuel economy',
    base: 'kml',
    defaultFrom: 'mpgus',
    defaultTo: 'l100km',
    units: [
      u('l100km', 'Liters per 100 kilometers', 'L/100 km', 100, true),
      u('kml', 'Kilometers per liter', 'km/L', 1),
      u('mpgus', 'Miles per gallon (US)', 'mpg (US)', 0.42514370749),
      u('mpguk', 'Miles per gallon (UK)', 'mpg (UK)', 0.35400618994),
      u('mpl', 'Miles per liter', 'mi/L', 1.609344),
      u(
        'gal100mi',
        'US gallons per 100 miles',
        'gal/100 mi',
        42.514370749,
        true,
      ),
    ],
  },
};

function toCelsius(value: number, from: string): number {
  switch (from) {
    case 'f':
      return ((value - 32) * 5) / 9;
    case 'k':
      return value - 273.15;
    case 'r':
      return ((value - 491.67) * 5) / 9;
    default:
      return value;
  }
}

function fromCelsius(value: number, to: string): number {
  switch (to) {
    case 'f':
      return (value * 9) / 5 + 32;
    case 'k':
      return value + 273.15;
    case 'r':
      return ((value + 273.15) * 9) / 5;
    default:
      return value;
  }
}

export function convertUnit(
  value: number,
  quantityId: string,
  from: string,
  to: string,
): number {
  if (quantityId === 'temperature')
    return fromCelsius(toCelsius(value, from), to);
  const q = QUANTITIES[quantityId];
  if (!q) throw new Error(`Unknown quantity ${quantityId}`);
  const f = q.units.find((x) => x.id === from);
  const t = q.units.find((x) => x.id === to);
  if (!f || !t) throw new Error(`Unknown unit ${from} or ${to}`);
  // Reciprocal units: 0 L/100 km has no finite km/L, so the result is NaN.
  const base = f.inverse
    ? value === 0
      ? NaN
      : f.factor / value
    : value * f.factor;
  if (t.inverse) return base === 0 ? NaN : t.factor / base;
  return base / t.factor;
}

/** Human-friendly number: up to 10 significant digits, no float noise. */
export function formatNumber(n: number, maxSig = 10): string {
  if (!Number.isFinite(n)) return '—';
  if (n === 0) return '0';
  const abs = Math.abs(n);
  if (abs >= 1e15 || abs < 1e-6)
    return n.toExponential(Math.min(maxSig - 1, 8)).replace(/\.?0+e/, 'e');
  return Number(n.toPrecision(maxSig)).toLocaleString('en-US', {
    maximumFractionDigits: 10,
  });
}
