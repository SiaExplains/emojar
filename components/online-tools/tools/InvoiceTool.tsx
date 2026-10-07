'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  formatMoney,
  invoiceTotals,
  parseAmount,
  type InvoiceItem,
} from '@/lib/online-tools/engines/generators';
import type { ToolProps } from '../ToolRenderer';
import {
  Checkbox,
  ErrorMessage,
  FileDropzone,
  SelectField,
  TextField,
  btnPrimary,
  btnSecondary,
  downloadBlob,
  friendlyError,
  inputBase,
  labelBase,
} from '../ui';

const CURRENCIES = [
  'USD',
  'EUR',
  'GBP',
  'CAD',
  'AUD',
  'CHF',
  'JPY',
  'INR',
  'SEK',
  'NOK',
  'DKK',
  'PLN',
  'NZD',
  'ZAR',
  'BRL',
  'MXN',
];
const DRAFT = 'emojar-invoice-draft-v1';

type Draft = {
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
  paper: 'a4' | 'letter';
};

const today = () => new Date().toISOString().slice(0, 10);
const plusDays = (n: number) =>
  new Date(Date.now() + n * 86400000).toISOString().slice(0, 10);

const EMPTY: Draft = {
  number: 'INV-0001',
  issueDate: today(),
  dueDate: plusDays(30),
  from: 'Your Company Ltd\n12 High Street\nLondon EC1A 1AA\nhello@yourcompany.example',
  to: 'Client Name\nClient Company\nStreet and number\nCity, Postcode',
  items: [
    { description: 'Website design', quantity: '1', price: '1200' },
    { description: 'Hosting (12 months)', quantity: '12', price: '15' },
  ],
  currency: 'EUR',
  taxPct: '20',
  taxLabel: 'VAT',
  discount: '0',
  discountType: 'percent',
  notes:
    'Payment within 30 days by bank transfer.\nIBAN: XX00 0000 0000 0000 0000 00',
  accent: '#4f46e5',
  paper: 'a4',
};

export default function InvoiceTool(_: ToolProps) {
  const [d, setD] = useState<Draft>(EMPTY);
  const [save, setSave] = useState(false);
  const [logo, setLogo] = useState<{
    bytes: Uint8Array;
    type: 'png' | 'jpg';
    url: string;
  } | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  // Draft saving is opt-in and stays in this browser only.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT);
      if (raw) {
        setD({ ...EMPTY, ...(JSON.parse(raw) as Partial<Draft>) });
        setSave(true);
      }
    } catch {
      /* ignore */
    }
  }, []);
  useEffect(() => {
    try {
      if (save) localStorage.setItem(DRAFT, JSON.stringify(d));
      else localStorage.removeItem(DRAFT);
    } catch {
      /* ignore */
    }
  }, [d, save]);
  useEffect(() => () => void (logo && URL.revokeObjectURL(logo.url)), [logo]);

  const set = <K extends keyof Draft>(k: K, v: Draft[K]) =>
    setD((x) => ({ ...x, [k]: v }));
  const setItem = (i: number, patch: Partial<InvoiceItem>) =>
    set(
      'items',
      d.items.map((it, j) => (j === i ? { ...it, ...patch } : it)),
    );
  const t = useMemo(
    () => invoiceTotals(d.items, d.taxPct, d.discount, d.discountType),
    [d],
  );
  const money = (n: number) => formatMoney(n, d.currency);

  const download = async () => {
    setBusy(true);
    setError('');
    try {
      const { invoicePdf } = await import('@/lib/online-tools/pdf/documents');
      const bytes = await invoicePdf({
        ...d,
        logo: logo ? { bytes: logo.bytes, type: logo.type } : undefined,
      });
      downloadBlob(
        new Blob([bytes as BlobPart], { type: 'application/pdf' }),
        `${(d.number || 'invoice').replace(/[^\w.-]+/g, '-')}.pdf`,
      );
    } catch (e) {
      setError(friendlyError(e, 'The PDF could not be created.'));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <TextField
          label="Invoice number"
          value={d.number}
          onChange={(v) => set('number', v)}
        />
        <TextField
          label="Issue date"
          type="date"
          value={d.issueDate}
          onChange={(v) => set('issueDate', v)}
        />
        <TextField
          label="Due date"
          type="date"
          value={d.dueDate}
          onChange={(v) => set('dueDate', v)}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {(['from', 'to'] as const).map((k) => (
          <div key={k} className="space-y-1.5">
            <label htmlFor={`inv-${k}`} className={labelBase}>
              {k === 'from' ? 'From (your details)' : 'Bill to'}
            </label>
            <textarea
              id={`inv-${k}`}
              rows={4}
              value={d[k]}
              onChange={(e) => set(k, e.target.value)}
              className={inputBase}
            />
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <h2 className="text-sm font-semibold text-gray-800">Items</h2>
        {d.items.map((it, i) => (
          <div
            key={i}
            className="grid grid-cols-[1fr_5rem_7rem_auto] items-center gap-2"
          >
            <input
              aria-label={`Item ${i + 1} description`}
              value={it.description}
              onChange={(e) => setItem(i, { description: e.target.value })}
              placeholder="Description"
              className={inputBase}
            />
            <input
              aria-label={`Item ${i + 1} quantity`}
              value={it.quantity}
              onChange={(e) => setItem(i, { quantity: e.target.value })}
              inputMode="decimal"
              placeholder="Qty"
              className={inputBase}
            />
            <input
              aria-label={`Item ${i + 1} unit price`}
              value={it.price}
              onChange={(e) => setItem(i, { price: e.target.value })}
              inputMode="decimal"
              placeholder="Price"
              className={inputBase}
            />
            <button
              type="button"
              className={btnSecondary}
              onClick={() =>
                set(
                  'items',
                  d.items.filter((_, j) => j !== i),
                )
              }
              aria-label={`Remove item ${i + 1}`}
              disabled={d.items.length === 1}
            >
              ✕
            </button>
          </div>
        ))}
        <button
          type="button"
          className={btnSecondary}
          onClick={() =>
            set('items', [
              ...d.items,
              { description: '', quantity: '1', price: '' },
            ])
          }
        >
          + Add item
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <SelectField
          label="Currency"
          value={d.currency}
          onChange={(v) => set('currency', v)}
          options={CURRENCIES.map((c) => ({ value: c, label: c }))}
        />
        <TextField
          label="Tax name"
          value={d.taxLabel}
          onChange={(v) => set('taxLabel', v)}
        />
        <TextField
          label="Tax %"
          value={d.taxPct}
          onChange={(v) => set('taxPct', v)}
        />
        <TextField
          label="Discount"
          value={d.discount}
          onChange={(v) => set('discount', v)}
        />
        <SelectField
          label="Discount type"
          value={d.discountType}
          onChange={(v) => set('discountType', v as 'percent' | 'amount')}
          options={[
            { value: 'percent', label: '%' },
            { value: 'amount', label: 'Amount' },
          ]}
        />
        <SelectField
          label="Paper"
          value={d.paper}
          onChange={(v) => set('paper', v as 'a4' | 'letter')}
          options={[
            { value: 'a4', label: 'A4' },
            { value: 'letter', label: 'Letter' },
          ]}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
        <div className="space-y-1.5">
          <label htmlFor="inv-notes" className={labelBase}>
            Notes / payment details
          </label>
          <textarea
            id="inv-notes"
            rows={3}
            value={d.notes}
            onChange={(e) => set('notes', e.target.value)}
            className={inputBase}
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="inv-accent" className={labelBase}>
            Colour
          </label>
          <input
            id="inv-accent"
            type="color"
            value={d.accent}
            onChange={(e) => set('accent', e.target.value)}
            className={`${inputBase} h-[38px] w-24 p-1`}
          />
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <div className="max-w-xs flex-1">
          <FileDropzone
            accept="image/png,image/jpeg"
            label={
              logo
                ? 'Change logo (PNG or JPG)'
                : 'Add a logo (PNG or JPG, optional)'
            }
            onFiles={async (files) => {
              const f = files[0];
              if (!f) return;
              const type =
                f.type === 'image/png'
                  ? 'png'
                  : f.type === 'image/jpeg'
                    ? 'jpg'
                    : null;
              if (!type) return setError('Please use a PNG or JPG logo.');
              setLogo({
                bytes: new Uint8Array(await f.arrayBuffer()),
                type,
                url: URL.createObjectURL(f),
              });
            }}
          />
        </div>
        {logo && (
          <>
            <img
              src={logo.url}
              alt="Logo preview"
              className="h-12 w-auto rounded border border-gray-100"
            />
            <button
              type="button"
              className={btnSecondary}
              onClick={() => setLogo(null)}
            >
              Remove logo
            </button>
          </>
        )}
      </div>

      <div
        className="rounded-2xl border border-gray-100 bg-gray-50 p-4 text-sm"
        aria-live="polite"
      >
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal</span>
          <span className="tabular-nums">{money(t.subtotal)}</span>
        </div>
        {t.discountAmount > 0 && (
          <div className="flex justify-between">
            <span className="text-gray-600">Discount</span>
            <span className="tabular-nums">−{money(t.discountAmount)}</span>
          </div>
        )}
        {parseAmount(d.taxPct) > 0 && (
          <div className="flex justify-between">
            <span className="text-gray-600">
              {d.taxLabel || 'Tax'} ({d.taxPct}%)
            </span>
            <span className="tabular-nums">{money(t.tax)}</span>
          </div>
        )}
        <div className="mt-1 flex justify-between border-t border-gray-200 pt-1 text-base font-semibold">
          <span>Total</span>
          <span className="tabular-nums" style={{ color: d.accent }}>
            {money(t.total)}
          </span>
        </div>
      </div>

      <ErrorMessage>{error}</ErrorMessage>
      <div className="flex flex-wrap items-center gap-4">
        <button
          type="button"
          className={btnPrimary}
          onClick={() => void download()}
          disabled={busy}
        >
          {busy ? 'Creating PDF…' : 'Download PDF invoice'}
        </button>
        <Checkbox
          label="Remember this draft in this browser"
          checked={save}
          onChange={setSave}
        />
        <button
          type="button"
          className={btnSecondary}
          onClick={() => {
            setD(EMPTY);
            setLogo(null);
          }}
        >
          Reset
        </button>
      </div>
      <p className="text-xs text-gray-500">
        The invoice is created in your browser; nothing is uploaded. Check the
        legal requirements for invoices in your country (for example tax IDs).
        Text must use Latin characters because the PDF uses a built-in font.
      </p>
    </div>
  );
}
