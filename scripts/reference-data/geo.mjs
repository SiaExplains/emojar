// countries.json, cities.json and land-mask.ts from GeoNames (CC BY 4.0),
// Natural Earth (public domain) and the IANA tz database (public domain).
import { unzipSync, strFromU8 } from 'fflate';
import fs from 'node:fs';
import { read, source, write } from './sources.mjs';

export async function buildGeo() {
  const lang = new Intl.DisplayNames(['en'], { type: 'language' });
  const cur = new Intl.DisplayNames(['en'], { type: 'currency' });
  const CONT = {
    AF: 'Africa',
    AS: 'Asia',
    EU: 'Europe',
    NA: 'North America',
    SA: 'South America',
    OC: 'Oceania',
    AN: 'Antarctica',
  };
  const LEFT = new Set(
    'AG AI AU BB BD BM BN BS BT BW CC CK CX CY DM FJ FK GB GD GG GY HK IE IM IN ID IO JE JM JP KE KI KN KY LC LK LS MO MS MT MU MV MW MY MZ NA NF NP NR NU NZ PG PK PN SB SC SG SH SR SZ TC TH TK TL TO TT TV TZ UG VC VG VI WS ZA ZM ZW'.split(
      ' ',
    ),
  );
  const ne = JSON.parse(read(await source('ne50'))).features.map(
    (f) => f.properties,
  );
  const neBy = new Map();
  for (const p of ne)
    for (const k of [p.ISO_A2_EH, p.ISO_A2])
      if (k && k !== '-99' && !neBy.has(k)) neBy.set(k, p);
  const tz = new Map();
  for (const l of read(await source('zoneTab')).split('\n')) {
    if (!l || l[0] === '#') continue;
    const [cc, , zone] = l.split('\t');
    if (!tz.has(cc)) tz.set(cc, []);
    tz.get(cc).push(zone);
  }
  // Capitals' coordinates as a fallback for places Natural Earth 50m lacks.
  const cities = strFromU8(
    unzipSync(fs.readFileSync(await source('cities')))['cities15000.txt'],
  )
    .split('\n')
    .filter(Boolean)
    .map((l) => l.split('\t'));
  const capBy = new Map(
    cities.filter((c) => c[7] === 'PPLC').map((c) => [c[8], c]),
  );
  const SUB_FALLBACK = {
    AQ: 'Antarctica',
    BV: 'Antarctica',
    GS: 'Antarctica',
    HM: 'Antarctica',
    TF: 'Antarctica',
    UM: 'Micronesia',
    BQ: 'Caribbean',
    XK: 'Southern Europe',
    TK: 'Polynesia',
    CX: 'Australia and New Zealand',
    CC: 'Australia and New Zealand',
    GP: 'Caribbean',
    MQ: 'Caribbean',
    GF: 'South America',
    RE: 'Eastern Africa',
    YT: 'Eastern Africa',
    SJ: 'Northern Europe',
    GI: 'Southern Europe',
    BL: 'Caribbean',
    MF: 'Caribbean',
    SX: 'Caribbean',
    IO: 'Eastern Africa',
    PM: 'Northern America',
    SH: 'Western Africa',
    PN: 'Polynesia',
    NU: 'Polynesia',
    NR: 'Micronesia',
    TV: 'Polynesia',
    CK: 'Polynesia',
    WF: 'Polynesia',
    EH: 'Northern Africa',
    SS: 'Eastern Africa',
  };
  const countries = [];
  for (const l of read(await source('countryInfo')).split('\n')) {
    if (!l || l[0] === '#') continue;
    const f = l.split('\t');
    const [
      iso2,
      iso3,
      num,
      ,
      name,
      capital,
      area,
      pop,
      cont,
      tld,
      ccode,
      cname,
      phone,
      ,
      ,
      langs,
    ] = f;
    if (iso2 === 'CS' || iso2 === 'AN') continue;
    // Kosovo: not in zone.tab; ITU code +383 since 2017.
    if (iso2 === 'XK') {
      f[12] = '383';
      tz.set('XK', ['Europe/Belgrade']);
    }
    const n = neBy.get(iso2);
    const cap = capBy.get(iso2);
    const languages = [
      ...new Set(
        (langs || '')
          .split(',')
          .filter(Boolean)
          .map((c) => {
            const base = c.split('-')[0];
            try {
              const nm = lang.of(base);
              return nm && nm !== base ? nm : null;
            } catch {
              return null;
            }
          })
          .filter(Boolean),
      ),
    ].slice(0, 6);
    let currency = cname;
    try {
      if (ccode) currency = cur.of(ccode) || cname;
    } catch {}
    const lat = n ? n.LABEL_Y : cap ? Number(cap[4]) : null;
    const lon = n ? n.LABEL_X : cap ? Number(cap[5]) : null;
    countries.push({
      a2: iso2,
      a3: iso3,
      num: num === '0' ? '' : num,
      n: name,
      cap: capital || '',
      ct: CONT[cont],
      rg: n?.SUBREGION ?? SUB_FALLBACK[iso2] ?? '',
      cur: ccode || '',
      curN: currency || '',
      lang: languages,
      tel: phone ? '+' + phone.replace(/^\+/, '').replace('-', ' ') : '',
      tld: tld || '',
      tz: tz.get(iso2) ?? [],
      drive: LEFT.has(iso2) ? 'left' : 'right',
      pop: Number(pop) || 0,
      area: Number(area) || 0,
      lat: lat == null ? null : Math.round(lat * 100) / 100,
      lon: lon == null ? null : Math.round(lon * 100) / 100,
    });
  }
  const missing = countries.filter((c) => !c.rg).map((c) => c.a2);
  if (missing.length)
    throw new Error('countries without a region: ' + missing.join(', '));
  countries.find((c) => c.a2 === 'XK').tel = '+383';
  write('countries.json', JSON.stringify(countries));

  // Cities for the time-zone map: capitals and big cities.
  const byPop = cities
    .filter((c) => c[7] === 'PPLC' || Number(c[14]) >= 1_500_000)
    .sort((a, b) => Number(b[14]) - Number(a[14]));
  const seen = new Set();
  const out = [];
  for (const c of byPop) {
    const key = c[2] + c[8];
    if (seen.has(key) || !c[17]) continue;
    seen.add(key);
    out.push([
      c[2],
      c[8],
      Math.round(Number(c[4]) * 10) / 10,
      Math.round(Number(c[5]) * 10) / 10,
      c[17],
      c[7] === 'PPLC' ? 1 : 0,
    ]);
  }
  write('cities.json', JSON.stringify(out));

  // Dot-matrix land mask, 2° cells, rows from 90N.
  const land = JSON.parse(read(await source('ne110land')));
  const polys = [];
  for (const f of land.features) {
    const g = f.geometry;
    const ps = g.type === 'Polygon' ? [g.coordinates] : g.coordinates;
    for (const p of ps) polys.push(p);
  }
  const inRing = (x, y, r) => {
    let ins = false;
    for (let i = 0, j = r.length - 1; i < r.length; j = i++) {
      const [xi, yi] = r[i],
        [xj, yj] = r[j];
      if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi)
        ins = !ins;
    }
    return ins;
  };
  const isLand = (x, y) =>
    polys.some(
      (p) => inRing(x, y, p[0]) && !p.slice(1).some((h) => inRing(x, y, h)),
    );
  const W = 180,
    H = 90;
  let bits = '';
  for (let r = 0; r < H; r++)
    for (let c = 0; c < W; c++)
      bits += isLand(-180 + c * 2 + 1, 90 - r * 2 - 1) ? '1' : '0';
  const bytes = Buffer.alloc(bits.length / 8);
  for (let i = 0; i < bytes.length; i++)
    bytes[i] = parseInt(bits.slice(i * 8, i * 8 + 8), 2);
  write(
    'land-mask.ts',
    `// 180×90 land mask (2° cells, row 0 = 90°N, column 0 = 180°W), rasterised from\n// Natural Earth 1:110m land (public domain). One bit per cell, base64.\nexport const LAND_W = ${W};\nexport const LAND_H = ${H};\nexport const LAND_MASK = '${bytes.toString('base64')}';\n`,
  );
}
