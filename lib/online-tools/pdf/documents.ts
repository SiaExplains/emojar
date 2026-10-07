// PDF builders for the printable calendar and the invoice generator. They
// use pdf-lib's standard fonts (Latin / WinAnsi), so text outside that range
// gets a clear error instead of a broken file.

import { ToolInputError } from '../engines/data';
import {
  formatMoney,
  invoiceTotals,
  parseAmount,
  type InvoiceItem,
} from '../engines/generators';
import {
  isoWeekOf,
  monthGrid,
  monthName,
  weekdayNames,
} from '../engines/timecard';
import { hexToRgb01 } from './core';

const lib = () => import('pdf-lib');

export const PAPER = {
  a4: [595.28, 841.89],
  letter: [612, 792],
} as const;

type Font = import('pdf-lib').PDFFont;

function checkText(font: Font, texts: string[]) {
  for (const t of texts.flatMap((x) => x.split(/\r?\n/))) {
    try {
      font.encodeText(t);
    } catch {
      throw new ToolInputError(
        `“${t.slice(0, 30)}” contains characters the built-in PDF font can’t show (emoji or non-Latin scripts). Please use Latin letters.`,
      );
    }
  }
}

/* ------------------------------------------------------------------ */
/* Calendar                                                             */
/* ------------------------------------------------------------------ */

export type CalendarOptions = {
  year: number;
  /** 0–11 for one month, or 'year' for all twelve (one page each, or 12 on one page). */
  month: number | 'year';
  yearLayout: 'pages' | 'single';
  weekStart: 0 | 1;
  locale: string;
  paper: keyof typeof PAPER;
  landscape: boolean;
  weekNumbers: boolean;
  notes: boolean;
  accent: string;
  title?: string;
};

export async function calendarPdf(o: CalendarOptions): Promise<Uint8Array> {
  const { PDFDocument, StandardFonts, rgb } = await lib();
  const doc = await PDFDocument.create();
  doc.setTitle(o.title || `Calendar ${o.year}`);
  doc.setCreator('Emojar Printable Calendar');
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const reg = await doc.embedFont(StandardFonts.Helvetica);
  const [ar, ag, ab] = hexToRgb01(o.accent);
  const accent = rgb(ar, ag, ab);
  const grey = rgb(0.45, 0.45, 0.48);
  const line = rgb(0.82, 0.82, 0.85);
  const days = weekdayNames(o.locale, o.weekStart, 'short');
  const months = Array.from({ length: 12 }, (_, m) => monthName(o.locale, m));
  checkText(reg, [...days, ...months, o.title ?? '']);
  const [pw, ph] = o.landscape
    ? [PAPER[o.paper][1], PAPER[o.paper][0]]
    : PAPER[o.paper];
  const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  // Draws one month into a box; `big` adds notes lines and larger text.
  const drawMonth = (
    page: import('pdf-lib').PDFPage,
    m: number,
    x: number,
    y: number,
    w: number,
    h: number,
    big: boolean,
  ) => {
    const titleSize = big ? 26 : 11;
    page.drawText(cap(months[m]) + (big ? ` ${o.year}` : ''), {
      x,
      y: y + h - titleSize,
      size: titleSize,
      font: bold,
      color: accent,
    });
    const grid = monthGrid(o.year, m, o.weekStart);
    const wk = o.weekNumbers ? (big ? 26 : 16) : 0;
    const top = y + h - titleSize - (big ? 22 : 8);
    const headH = big ? 18 : 10;
    const cw = (w - wk) / 7;
    const notesH = big && o.notes ? Math.min(110, h * 0.18) : 0;
    const rh = (top - headH - y - notesH) / grid.length;
    days.forEach((d, i) => {
      const label = big ? cap(d) : cap(d).slice(0, 2);
      const size = big ? 10 : 6.5;
      const tw = bold.widthOfTextAtSize(label, size);
      page.drawText(label, {
        x: x + wk + i * cw + (cw - tw) / 2,
        y: top - headH + 4,
        size,
        font: bold,
        color: grey,
      });
    });
    grid.forEach((row, r) => {
      const ry = top - headH - (r + 1) * rh;
      if (o.weekNumbers) {
        // ISO weeks run Monday–Sunday: label the row by its Monday (in a
        // Sunday-start row the Sunday belongs to the previous ISO week).
        const mondayCol = o.weekStart === 1 ? 0 : 1;
        const first = row[mondayCol] ?? row.find((d) => d !== null);
        if (first) {
          const t = String(isoWeekOf(o.year, m, first));
          page.drawText(t, {
            x: x + 2,
            y: ry + rh - (big ? 14 : 8),
            size: big ? 8 : 5.5,
            font: reg,
            color: grey,
          });
        }
      }
      row.forEach((d, c) => {
        const cx = x + wk + c * cw;
        if (big)
          page.drawRectangle({
            x: cx,
            y: ry,
            width: cw,
            height: rh,
            borderColor: line,
            borderWidth: 0.6,
          });
        if (d === null) return;
        const weekend =
          (c + o.weekStart) % 7 === 0 || (c + o.weekStart) % 7 === 6;
        const t = String(d);
        const size = big ? 12 : 7;
        if (big)
          page.drawText(t, {
            x: cx + 5,
            y: ry + rh - 15,
            size,
            font: bold,
            color: weekend ? accent : rgb(0.1, 0.1, 0.12),
          });
        else {
          const tw = reg.widthOfTextAtSize(t, size);
          page.drawText(t, {
            x: cx + (cw - tw) / 2,
            y: ry + rh / 2 - 2.5,
            size,
            font: weekend ? bold : reg,
            color: weekend ? accent : rgb(0.1, 0.1, 0.12),
          });
        }
      });
    });
    if (notesH) {
      page.drawText('Notes', {
        x,
        y: y + notesH - 12,
        size: 9,
        font: bold,
        color: grey,
      });
      for (let i = 1; i <= 4; i++) {
        const ly = y + notesH - 12 - i * ((notesH - 16) / 4);
        page.drawLine({
          start: { x, y: ly },
          end: { x: x + w, y: ly },
          thickness: 0.5,
          color: line,
        });
      }
    }
  };

  const margin = 36;
  if (o.month !== 'year') {
    const page = doc.addPage([pw, ph]);
    drawMonth(
      page,
      o.month,
      margin,
      margin,
      pw - 2 * margin,
      ph - 2 * margin,
      true,
    );
  } else if (o.yearLayout === 'pages') {
    for (let m = 0; m < 12; m++) {
      const page = doc.addPage([pw, ph]);
      drawMonth(
        page,
        m,
        margin,
        margin,
        pw - 2 * margin,
        ph - 2 * margin,
        true,
      );
    }
  } else {
    const page = doc.addPage([pw, ph]);
    const heading = o.title || String(o.year);
    checkText(bold, [heading]);
    page.drawText(heading, {
      x: margin,
      y: ph - margin - 28,
      size: 28,
      font: bold,
      color: accent,
    });
    const cols = o.landscape ? 4 : 3;
    const rows = 12 / cols;
    const gap = 18;
    const gw = (pw - 2 * margin - gap * (cols - 1)) / cols;
    const gh = (ph - 2 * margin - 48 - gap * (rows - 1)) / rows;
    for (let m = 0; m < 12; m++) {
      const c = m % cols;
      const r = Math.floor(m / cols);
      drawMonth(
        page,
        m,
        margin + c * (gw + gap),
        ph - margin - 48 - (r + 1) * gh - r * gap,
        gw,
        gh,
        false,
      );
    }
  }
  return doc.save();
}

/* ------------------------------------------------------------------ */
/* Invoice                                                              */
/* ------------------------------------------------------------------ */

export type InvoiceData = {
  number: string;
  issueDate: string;
  dueDate: string;
  from: string;
  to: string;
  items: InvoiceItem[];
  currency: string;
  taxPct: string;
  taxLabel: string;
  discount: string;
  discountType: 'percent' | 'amount';
  notes: string;
  accent: string;
  paper: keyof typeof PAPER;
  logo?: { bytes: Uint8Array; type: 'png' | 'jpg' };
};

export async function invoicePdf(d: InvoiceData): Promise<Uint8Array> {
  const { PDFDocument, StandardFonts, rgb } = await lib();
  const doc = await PDFDocument.create();
  doc.setTitle(`Invoice ${d.number}`);
  doc.setCreator('Emojar Invoice Generator');
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const reg = await doc.embedFont(StandardFonts.Helvetica);
  const money = (n: number) => formatMoney(n, d.currency);
  const t = invoiceTotals(d.items, d.taxPct, d.discount, d.discountType);
  checkText(reg, [
    d.number,
    d.from,
    d.to,
    d.notes,
    d.taxLabel,
    ...d.items.map((i) => i.description),
    money(t.total),
  ]);
  const [ar, ag, ab] = hexToRgb01(d.accent);
  const accent = rgb(ar, ag, ab);
  const dark = rgb(0.1, 0.1, 0.12);
  const grey = rgb(0.42, 0.42, 0.46);
  const [pw, ph] = PAPER[d.paper];
  let page = doc.addPage([pw, ph]);
  const m = 48;
  let y = ph - m;

  // Wraps text to a width; returns the lines.
  const wrap = (text: string, size: number, width: number, font = reg) => {
    const out: string[] = [];
    for (const para of text.split(/\r?\n/)) {
      let cur = '';
      for (const word of para.split(/\s+/)) {
        const next = cur ? `${cur} ${word}` : word;
        if (font.widthOfTextAtSize(next, size) > width && cur) {
          out.push(cur);
          cur = word;
        } else cur = next;
      }
      out.push(cur);
    }
    return out;
  };
  const right = (
    text: string,
    x: number,
    yy: number,
    size: number,
    font = reg,
    color = dark,
  ) =>
    page.drawText(text, {
      x: x - font.widthOfTextAtSize(text, size),
      y: yy,
      size,
      font,
      color,
    });

  if (d.logo) {
    const img =
      d.logo.type === 'png'
        ? await doc.embedPng(d.logo.bytes)
        : await doc.embedJpg(d.logo.bytes);
    const s = Math.min(140 / img.width, 56 / img.height);
    page.drawImage(img, {
      x: m,
      y: y - img.height * s,
      width: img.width * s,
      height: img.height * s,
    });
  }
  right('INVOICE', pw - m, y - 24, 26, bold, accent);
  y -= 70;
  const meta = [
    ['Invoice number', d.number],
    ['Issue date', d.issueDate],
    ['Due date', d.dueDate],
  ].filter(([, v]) => v);
  meta.forEach(([k, v], i) => {
    right(`${k}: ${v}`, pw - m, y - i * 14, 10, i === 0 ? bold : reg);
  });
  const colW = (pw - 2 * m) / 2 - 10;
  const block = (label: string, text: string, x: number, yy: number) => {
    page.drawText(label, { x, y: yy, size: 9, font: bold, color: accent });
    wrap(text, 10, colW).forEach((l, i) =>
      page.drawText(l, {
        x,
        y: yy - 15 - i * 13,
        size: 10,
        font: i === 0 ? bold : reg,
        color: dark,
      }),
    );
    return wrap(text, 10, colW).length * 13 + 15;
  };
  const h1 = block('FROM', d.from, m, y);
  y -= Math.max(h1, meta.length * 14) + 18;
  const h2 = block('BILL TO', d.to, m, y);
  y -= h2 + 24;

  const cols = {
    desc: m,
    qty: pw - m - 210,
    price: pw - m - 110,
    total: pw - m,
  };
  const header = () => {
    page.drawRectangle({
      x: m - 6,
      y: y - 6,
      width: pw - 2 * m + 12,
      height: 22,
      color: accent,
    });
    const white = rgb(1, 1, 1);
    page.drawText('Description', {
      x: cols.desc,
      y,
      size: 10,
      font: bold,
      color: white,
    });
    right('Qty', cols.qty, y, 10, bold, white);
    right('Unit price', cols.price, y, 10, bold, white);
    right('Amount', cols.total, y, 10, bold, white);
    y -= 26;
  };
  header();
  d.items.forEach((it, i) => {
    const lines = wrap(it.description || '—', 10, cols.qty - cols.desc - 60);
    if (y - lines.length * 13 < m + 140) {
      page = doc.addPage([pw, ph]);
      y = ph - m;
      header();
    }
    lines.forEach((l, j) =>
      page.drawText(l, {
        x: cols.desc,
        y: y - j * 13,
        size: 10,
        font: reg,
        color: dark,
      }),
    );
    right(String(parseAmount(it.quantity)), cols.qty, y, 10);
    right(money(parseAmount(it.price)), cols.price, y, 10);
    right(money(t.lines[i]), cols.total, y, 10, bold);
    y -= lines.length * 13 + 8;
    page.drawLine({
      start: { x: m - 6, y: y + 4 },
      end: { x: pw - m + 6, y: y + 4 },
      thickness: 0.4,
      color: rgb(0.88, 0.88, 0.9),
    });
  });
  y -= 10;
  const rows: [string, string, boolean][] = [
    ['Subtotal', money(t.subtotal), false],
  ];
  if (t.discountAmount)
    rows.push([
      d.discountType === 'percent' ? `Discount (${d.discount}%)` : 'Discount',
      `-${money(t.discountAmount)}`,
      false,
    ]);
  const taxPct = parseAmount(d.taxPct);
  if (taxPct)
    rows.push([`${d.taxLabel || 'Tax'} (${taxPct}%)`, money(t.tax), false]);
  rows.push(['Total', money(t.total), true]);
  // Keep the totals block together on one page.
  if (y - rows.length * 18 < m) {
    page = doc.addPage([pw, ph]);
    y = ph - m;
  }
  for (const [k, v, strong] of rows) {
    right(
      k,
      cols.price,
      y,
      strong ? 12 : 10,
      strong ? bold : reg,
      strong ? dark : grey,
    );
    right(v, cols.total, y, strong ? 12 : 10, bold, strong ? accent : dark);
    y -= strong ? 20 : 15;
  }
  if (d.notes.trim()) {
    y -= 14;
    if (y - 30 < m) {
      page = doc.addPage([pw, ph]);
      y = ph - m;
    }
    page.drawText('NOTES', { x: m, y, size: 9, font: bold, color: accent });
    y -= 14;
    // Long notes continue on new pages instead of running off the bottom.
    for (const l of wrap(d.notes, 9.5, pw - 2 * m)) {
      if (y < m) {
        page = doc.addPage([pw, ph]);
        y = ph - m;
      }
      page.drawText(l, { x: m, y, size: 9.5, font: reg, color: grey });
      y -= 12;
    }
  }
  return doc.save();
}
