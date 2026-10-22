// Copies the LibRaw WebAssembly build from node_modules/libraw-wasm into
// public/vendor/libraw, where the ARW Converter loads it as same-origin ES
// modules (its workers resolve each other with import.meta.url, which a
// bundler would rewrite). Run after updating libraw-wasm:
//   npm run vendor:libraw

import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const src = join(root, 'node_modules', 'libraw-wasm', 'dist');
const out = join(root, 'public', 'vendor', 'libraw');
mkdirSync(out, { recursive: true });

for (const f of ['index.js', 'worker.js', 'libraw.js', 'libraw.wasm'])
  copyFileSync(join(src, f), join(out, f));

const { version } = JSON.parse(
  readFileSync(
    join(root, 'node_modules', 'libraw-wasm', 'package.json'),
    'utf8',
  ),
);
console.log(`Copied libraw-wasm ${version} to public/vendor/libraw`);
