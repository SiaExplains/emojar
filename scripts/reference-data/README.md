# Reference data generators

`npm run data:reference` rebuilds the bundled datasets used by the Reference &
Learning tools from their public sources. Downloads are cached in
`.cache/reference-data/`; run with `REFRESH=1` to fetch fresh copies.

Run it once a year (and whenever Unicode publishes a new major version), then
check `git diff` and run the tests (`npm test`).

| Output                                                   | Source                                                                                  | Licence                                                                                 |
| -------------------------------------------------------- | --------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| `lib/online-tools/data/elements.ts`                      | PubChem periodic table + `elements-tables.mjs` (IUPAC weights, discoverers, year fixes) | Public domain (US gov)                                                                  |
| `countries.json`, `cities.json`, `land-mask.ts`          | GeoNames `countryInfo.txt` + `cities15000`, Natural Earth 1:50m/1:110m, IANA `zone.tab` | GeoNames **CC BY 4.0** (credit shown on the pages); Natural Earth and tz: public domain |
| `unicode-blocks.ts`, `public/data/unicode-names-<v>.txt` | Unicode Character Database (`UnicodeData.txt`, `Blocks.txt`)                            | Unicode License v3                                                                      |
| `html-entities.json`                                     | WHATWG HTML `entities.json`                                                             | CC BY 4.0 (WHATWG)                                                                      |
| `css-colors.json`                                        | CSS Color Module keywords (via `color-name`)                                            | MIT                                                                                     |
| `xkcd-colors.json`                                       | xkcd colour survey `rgb.txt`                                                            | CC0                                                                                     |

When the Unicode major version changes, the names file gets a new name
(`unicode-names-19.txt`); delete the old one. `UNICODE_VERSION` in
`unicode-blocks.ts` updates automatically and the explorer picks the new file.

Hand-written datasets (`math-symbols.ts`, `keyboard-shortcuts.ts`) are not
generated — edit them directly.
