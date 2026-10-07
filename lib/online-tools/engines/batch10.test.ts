import { describe, expect, it } from 'vitest';
import { CALCULATORS, initialValues } from './calculators';
import {
  formatHM,
  isoWeekOf,
  monthGrid,
  parseClock,
  timeCard,
  weekdayNames,
  workedMinutes,
} from './timecard';
import {
  buildSignature,
  generateFakeData,
  generateUsername,
  invoiceTotals,
  makeTeams,
  parseNames,
  randomColor,
  safeUrl,
  seededSource,
  textOn,
} from './generators';
import {
  checkStrength,
  hibpCount,
  hibpParts,
  humanDuration,
} from './password-strength';
import { encodeWav, peaks, processChannels } from '../media/pcm';

describe('time card', () => {
  it('parses clock times', () => {
    expect(parseClock('9:30')).toBe(570);
    expect(parseClock('930')).toBe(570);
    expect(parseClock('9:30 pm')).toBe(1290);
    expect(parseClock('12am')).toBe(0);
    expect(parseClock('12:15 PM')).toBe(735);
    expect(parseClock('25:00')).toBeNull();
    expect(parseClock('13pm')).toBeNull();
  });
  it('handles breaks, overnight shifts and overtime', () => {
    expect(workedMinutes({ start: '9:00', end: '17:30', breakMin: '30' })).toBe(
      480,
    );
    expect(workedMinutes({ start: '22:00', end: '6:00', breakMin: '0' })).toBe(
      480,
    );
    const day = { start: '8:00', end: '18:00', breakMin: '60' }; // 9 h
    const r = timeCard(
      [day, day, day, day, day, { start: '', end: '', breakMin: '' }],
      {
        rate: 20,
        weeklyThresholdH: 40,
      },
    );
    expect(r.totalMin).toBe(45 * 60);
    expect(r.overtimeMin).toBe(5 * 60);
    expect(r.pay).toBe(40 * 20 + 5 * 30);
    const daily = timeCard([day], {
      rate: 10,
      dailyThresholdH: 8,
      weeklyThresholdH: 0,
    });
    expect(daily.overtimeMin).toBe(60);
    expect(formatHM(485)).toBe('8:05');
  });
});

describe('calendar and day of week', () => {
  it('builds month grids for both week starts', () => {
    // October 2026 starts on a Thursday.
    expect(monthGrid(2026, 9, 1)[0]).toEqual([null, null, null, 1, 2, 3, 4]);
    expect(monthGrid(2026, 9, 0)[0]).toEqual([null, null, null, null, 1, 2, 3]);
    expect(monthGrid(2026, 1, 1).flat().filter(Boolean)).toHaveLength(28);
    expect(weekdayNames('en-US', 1)[0]).toBe('Mon');
    expect(weekdayNames('de-DE', 0, 'long')[0]).toBe('Sonntag');
    expect(isoWeekOf(2026, 0, 1)).toBe(1);
  });
  it('computes the day of the week', () => {
    const def = CALCULATORS['day-of-week'];
    const out = def.compute({ ...initialValues(def), date: '2000-01-01' });
    expect(out.ok && out.results[0].value).toBe('Saturday');
    const leap = def.compute({ date: '2024-02-29' });
    expect(
      leap.ok && leap.table?.rows.find((r) => r[0] === '2025')?.[1],
    ).toMatch(/no 29 February/);
    expect(def.compute({ date: 'nope' }).ok).toBe(false);
  });
});

describe('teams and usernames', () => {
  const src = seededSource('teams');
  it('splits evenly and seats captains', () => {
    const names = parseNames('a, b, c, d, e\nf\ng');
    const t = makeTeams(names, { teams: 3, captains: ['a', 'b', 'c'] }, src);
    expect(t.map((x) => x.length).sort()).toEqual([2, 2, 3]);
    expect(t.map((x) => x[0]).sort()).toEqual(['a', 'b', 'c']);
    expect(t.flat().sort()).toEqual(names.sort());
    expect(makeTeams(names, { perTeam: 2 }, src)).toHaveLength(4);
    expect(() => makeTeams(['a', 'b'], { teams: 3 })).toThrow(
      /can’t make 3 teams/,
    );
  });
  it('generates usernames', () => {
    for (const style of [
      'adjective-animal',
      'word-word',
      'gamer',
      'cute',
      'professional',
    ] as const) {
      const u = generateUsername(
        {
          style,
          separator: '_',
          numbers: true,
          capitalize: false,
          maxLength: 20,
        },
        src,
      );
      expect(u.length).toBeLessThanOrEqual(20);
      expect(u).toMatch(/^[A-Za-z0-9_]+$/);
    }
    const p = generateUsername(
      {
        style: 'professional',
        separator: '.',
        numbers: false,
        capitalize: false,
        firstName: 'Zoë',
        lastName: 'Ng',
      },
      src,
    );
    expect(p).toMatch(/zoe|ng/);
  });
});

describe('fake data', () => {
  it('is reproducible with a seed and well-formed', () => {
    const a = generateFakeData(
      ['id', 'fullName', 'email', 'price', 'boolean'],
      5,
      'json',
      { seed: 'x' },
    );
    expect(
      generateFakeData(
        ['id', 'fullName', 'email', 'price', 'boolean'],
        5,
        'json',
        { seed: 'x' },
      ),
    ).toBe(a);
    const rows = JSON.parse(a);
    expect(rows).toHaveLength(5);
    expect(rows[0].email).toMatch(/@example\.(com|org|net)$/);
    const csv = generateFakeData(['id', 'sentence'], 3, 'csv', {
      seed: 's',
    }).split('\n');
    expect(csv[0]).toBe('id,sentence');
    expect(csv).toHaveLength(4);
    const sql = generateFakeData(['lastName', 'number'], 2, 'sql', {
      seed: 'q',
      table: 'my table',
    });
    expect(sql).toMatch(
      /^INSERT INTO my_table \(lastName, number\) VALUES \('[^']*', \d+\);/,
    );
    expect(() => generateFakeData([], 1, 'csv')).toThrow();
    expect(() => generateFakeData(['id'], 5000, 'csv')).toThrow(/1000/);
  });
});

describe('colours, invoice and signature', () => {
  it('keeps random colours in range', () => {
    const src = seededSource('c');
    for (let i = 0; i < 50; i++) {
      const p = randomColor('pastel', 0, src);
      expect(p.l).toBeGreaterThanOrEqual(78);
      expect(p.hex).toMatch(/^#[0-9a-f]{6}$/);
      const h = randomColor('hue', 120, src);
      expect(Math.abs(h.h - 120)).toBeLessThanOrEqual(15);
    }
    expect(textOn({ r: 255, g: 255, b: 255 })).toBe('#000000');
    expect(textOn({ r: 0, g: 0, b: 80 })).toBe('#ffffff');
  });
  it('totals invoices', () => {
    const t = invoiceTotals(
      [
        { description: 'Design', quantity: '10', price: '75' },
        { description: 'Hosting', quantity: '1', price: '19.99' },
      ],
      '19',
      '10',
      'percent',
    );
    expect(t).toMatchObject({
      subtotal: 769.99,
      discountAmount: 77,
      taxable: 692.99,
      tax: 131.67,
      total: 824.66,
    });
    expect(
      invoiceTotals(
        [{ description: '', quantity: '1', price: '50' }],
        '0',
        '80',
        'amount',
      ).total,
    ).toBe(0);
  });
  it('escapes signature HTML and drops unsafe links', () => {
    const html = buildSignature({
      name: 'Ada <script>',
      title: 'CTO',
      company: 'A&B',
      phone: '+1 (555) 010-0200',
      email: 'ada@example.com',
      website: 'example.com',
      address: '',
      imageUrl: 'javascript:alert(1)',
      color: 'red;background:url(x)',
      linkedin: 'https://linkedin.com/in/ada',
      x: '',
      github: '',
      template: 'side',
    });
    expect(html).toContain('Ada &lt;script&gt;');
    expect(html).toContain('A&amp;B');
    expect(html).not.toContain('javascript:');
    expect(html).toContain('#4f46e5');
    expect(html).toContain('href="tel:+15550100200"');
    expect(html).toContain('href="https://example.com/"');
    expect(safeUrl('ftp://x')).toBe('');
  });
});

describe('password strength', () => {
  it('rates passwords', () => {
    expect(checkStrength('password123').score).toBe(0);
    expect(checkStrength('P@ssw0rd!').score).toBeLessThanOrEqual(1);
    expect(
      checkStrength('qwerty').findings.some(
        (f) => f.label === 'Common password',
      ),
    ).toBe(true);
    expect(
      checkStrength('Summer2024!').findings.some((f) =>
        /year|shape/i.test(f.label),
      ),
    ).toBe(true);
    expect(checkStrength('vT8#qL2!mZ9@xW4$').score).toBe(4);
    expect(
      checkStrength('correct-horse-battery-staple-orbit').score,
    ).toBeGreaterThanOrEqual(3);
    expect(humanDuration(0.2)).toBe('instantly');
    expect(humanDuration(7200)).toBe('2 hours');
  });
  it('splits SHA-1 for HIBP and reads counts', async () => {
    const { prefix, suffix } = await hibpParts('password');
    expect(prefix).toBe('5BAA6');
    expect(suffix).toBe('1E4C9B93F3F0682250B6CF8331B7EE68FD8');
    expect(
      hibpCount(
        `0018A45C4D1DEF81644B54AB7F969B88D65:1\r\n${suffix}:9659365`,
        suffix,
      ),
    ).toBe(9659365);
    expect(hibpCount('ABC:2', suffix)).toBe(0);
  });
});

describe('PCM', () => {
  it('cuts, fades, mixes and encodes WAV', () => {
    const sr = 1000;
    const l = new Float32Array(2000).fill(1);
    const r = new Float32Array(2000).fill(0);
    const [m] = processChannels([l, r], sr, {
      start: 0.5,
      end: 1.5,
      mono: true,
      fadeIn: 0.1,
    });
    expect(m).toHaveLength(1000);
    expect(m[0]).toBe(0);
    expect(m[500]).toBeCloseTo(0.5, 6);
    const wav = encodeWav([m], sr);
    expect(new TextDecoder().decode(wav.slice(0, 4))).toBe('RIFF');
    expect(new TextDecoder().decode(wav.slice(8, 12))).toBe('WAVE');
    expect(wav.length).toBe(44 + 2000);
    expect(new DataView(wav.buffer).getUint32(24, true)).toBe(1000);
    expect(Array.from(peaks(new Float32Array([0, -0.5, 0.2, 1]), 2))).toEqual([
      0.5, 1,
    ]);
  });
});

describe('calendar and invoice PDFs', () => {
  it('builds valid PDFs and rejects non-Latin text', async () => {
    const { calendarPdf, invoicePdf } = await import('../pdf/documents');
    const base = {
      year: 2026,
      weekStart: 1 as const,
      locale: 'en-US',
      paper: 'a4' as const,
      landscape: false,
      weekNumbers: true,
      notes: true,
      accent: '#4f46e5',
    };
    const pdfs = [
      await calendarPdf({ ...base, month: 9, yearLayout: 'pages' }),
      await calendarPdf({
        ...base,
        month: 'year',
        yearLayout: 'single',
        landscape: true,
      }),
      await invoicePdf({
        number: 'INV-1',
        issueDate: '2026-10-08',
        dueDate: '2026-11-07',
        from: 'Ada Ltd\n1 Main St',
        to: 'Client GmbH',
        items: Array.from({ length: 40 }, (_, i) => ({
          description: `Item ${i}`,
          quantity: '1',
          price: '10',
        })),
        currency: 'EUR',
        taxPct: '19',
        taxLabel: 'VAT',
        discount: '0',
        discountType: 'percent',
        notes: 'Thanks!',
        accent: '#111111',
        paper: 'letter',
      }),
    ];
    for (const b of pdfs)
      expect(new TextDecoder().decode(b.slice(0, 5))).toBe('%PDF-');
    await expect(
      calendarPdf({ ...base, month: 0, yearLayout: 'pages', locale: 'ru-RU' }),
    ).rejects.toThrow(/Latin/);
  });
});

describe('password substitutions', () => {
  it('only flags l33t inside the word, not trailing digits', () => {
    const has = (pw: string) =>
      checkStrength(pw).findings.some((f) => /substitution/i.test(f.label));
    expect(has('Summer2024!')).toBe(false);
    expect(has('P@ssw0rd')).toBe(true);
  });
});

describe('review fixes', () => {
  it('parses European and formatted amounts', async () => {
    const { parseAmount } = await import('./generators');
    expect(parseAmount('1,200')).toBe(1200);
    expect(parseAmount('1.200,50')).toBe(1200.5);
    expect(parseAmount('1,5')).toBe(1.5);
    expect(parseAmount('20%')).toBe(20);
    expect(parseAmount('€19.99')).toBe(19.99);
    expect(parseAmount('1 234 567.8')).toBe(1234567.8);
    expect(
      invoiceTotals(
        [{ description: '', quantity: '2', price: '1.200,00' }],
        '20%',
        '0',
        'percent',
      ).total,
    ).toBe(2880);
  });
  it('caps common shapes and keeps extensions out of tel links', () => {
    expect(checkStrength('Melbourne1987').score).toBeLessThanOrEqual(2);
    const html = buildSignature({
      name: 'A',
      title: '',
      company: '',
      phone: '+1 555 010 0199 ext. 12',
      email: 'a@example',
      website: '',
      address: '',
      imageUrl: '',
      color: '#123456',
      linkedin: '',
      x: '',
      github: '',
      template: 'compact',
    });
    expect(html).toContain('tel:+15550100199"');
    expect(html).not.toContain('mailto:');
  });
});

describe('team generator edge cases', () => {
  it('rejects zero teams and keeps duplicate names', () => {
    expect(() => makeTeams(['a', 'b', 'c'], { teams: 0 })).toThrow(/two teams/);
    const t = makeTeams(['Ada', 'Ada', 'Ben', 'Cy'], {
      teams: 2,
      captains: ['Ada'],
    });
    expect(t.flat().sort()).toEqual(['Ada', 'Ada', 'Ben', 'Cy']);
    expect(() => makeTeams(['a', 'b', 'c'], { perTeam: 5 })).toThrow(
      /only one team/,
    );
  });
});
