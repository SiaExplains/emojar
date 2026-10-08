// Regenerates the bundled reference data. Run yearly (or when Unicode, the
// IANA tz database or GeoNames change):  npm run data:reference
// Add REFRESH=1 to re-download sources instead of using .cache/reference-data.
import { execFileSync } from 'node:child_process';
import { buildElements } from './elements.mjs';
import { buildEntitiesAndColors } from './entities-colors.mjs';
import { buildGeo } from './geo.mjs';
import { ROOT } from './sources.mjs';
import { buildUnicode } from './unicode.mjs';

await buildElements();
await buildGeo();
const major = await buildUnicode();
await buildEntitiesAndColors();
execFileSync(
  'npx',
  ['prettier', '--write', '--log-level', 'warn', 'lib/online-tools/data/*.ts'],
  {
    cwd: ROOT,
    stdio: 'inherit',
  },
);
console.log(
  `Done. If the Unicode major version changed (now ${major}), update NAMES_URL users and delete the old public/data/unicode-names-*.txt.`,
);
