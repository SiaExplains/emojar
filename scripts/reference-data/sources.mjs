// Downloads the public source datasets into .cache/reference-data (gitignored
// via the scripts' own cache dir) and returns their local paths.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../..',
);
export const DATA = path.join(ROOT, 'lib/online-tools/data');
export const CACHE = path.join(ROOT, '.cache/reference-data');

export const SOURCES = {
  pubchem: 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/periodictable/CSV',
  unicodeData: 'https://www.unicode.org/Public/UCD/latest/ucd/UnicodeData.txt',
  blocks: 'https://www.unicode.org/Public/UCD/latest/ucd/Blocks.txt',
  entities: 'https://html.spec.whatwg.org/entities.json',
  xkcd: 'https://xkcd.com/color/rgb.txt',
  countryInfo: 'https://download.geonames.org/export/dump/countryInfo.txt',
  cities: 'https://download.geonames.org/export/dump/cities15000.zip',
  ne50: 'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_50m_admin_0_countries.geojson',
  ne110land:
    'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_land.geojson',
  zoneTab: 'https://data.iana.org/time-zones/tzdb/zone.tab',
};

/** Fetches a source once (cached) and returns its local file path. */
export async function source(key) {
  fs.mkdirSync(CACHE, { recursive: true });
  const url = SOURCES[key];
  const file = path.join(
    CACHE,
    `${key}${path.extname(new URL(url).pathname) || '.csv'}`,
  );
  if (!fs.existsSync(file) || process.env.REFRESH) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`${url}: ${res.status}`);
    fs.writeFileSync(file, Buffer.from(await res.arrayBuffer()));
    console.log(`downloaded ${key}`);
  }
  return file;
}

export const read = (file) => fs.readFileSync(file, 'utf8');
export const write = (name, text) => {
  fs.writeFileSync(path.join(DATA, name), text);
  console.log(`wrote lib/online-tools/data/${name}`);
};
