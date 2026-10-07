'use client';

import { useMemo, useState } from 'react';
import {
  buildSignature,
  type SignatureInput,
} from '@/lib/online-tools/engines/generators';
import type { ToolProps } from '../ToolRenderer';
import {
  CopyButton,
  SelectField,
  TextField,
  btnPrimary,
  inputBase,
  labelBase,
} from '../ui';

const INITIAL: SignatureInput = {
  name: 'Alex Morgan',
  title: 'Head of Design',
  company: 'Northwind Studio',
  phone: '+1 555 010 0199',
  email: 'alex@example.com',
  website: 'example.com',
  address: '',
  imageUrl: '',
  color: '#4f46e5',
  linkedin: '',
  x: '',
  github: '',
  template: 'side',
};

const HOW_TO: [string, string][] = [
  [
    'Gmail',
    'Settings (⚙) → See all settings → General → Signature → Create new, then paste and Save changes at the bottom.',
  ],
  [
    'Outlook (web & new Outlook)',
    'Settings → Account → Signatures → New signature, paste, then Save.',
  ],
  [
    'Apple Mail',
    'Mail → Settings → Signatures → +, untick “Always match my default message font”, then paste.',
  ],
  [
    'Thunderbird',
    'Account Settings → Use HTML → paste the HTML code into the Signature text box.',
  ],
];

export default function EmailSignatureTool(_: ToolProps) {
  const [s, setS] = useState<SignatureInput>(INITIAL);
  const [copied, setCopied] = useState('');
  const set = <K extends keyof SignatureInput>(k: K, v: SignatureInput[K]) =>
    setS((x) => ({ ...x, [k]: v }));
  const html = useMemo(() => buildSignature(s), [s]);

  // Rich copy keeps formatting when pasted into Gmail, Outlook and Apple Mail.
  const copyRich = async () => {
    try {
      await navigator.clipboard.write([
        new ClipboardItem({
          'text/html': new Blob([html], { type: 'text/html' }),
          'text/plain': new Blob(
            [`${s.name}\n${s.title} · ${s.company}\n${s.phone} | ${s.email}`],
            { type: 'text/plain' },
          ),
        }),
      ]);
      setCopied('✓ Copied — paste it into your email signature settings');
    } catch {
      setCopied(
        'Rich copy isn’t supported here — select the preview and copy it, or use “Copy HTML”.',
      );
    }
    window.setTimeout(() => setCopied(''), 3500);
  };

  const fields: [keyof SignatureInput, string, string?][] = [
    ['name', 'Full name'],
    ['title', 'Job title'],
    ['company', 'Company'],
    ['phone', 'Phone'],
    ['email', 'Email'],
    ['website', 'Website', 'example.com'],
    ['address', 'Address (optional)'],
    ['imageUrl', 'Photo or logo URL (https://…)', 'https://…/photo.jpg'],
    ['linkedin', 'LinkedIn URL'],
    ['x', 'X / Twitter URL'],
    ['github', 'GitHub URL'],
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {fields.map(([k, label, ph]) => (
          <TextField
            key={k}
            label={label}
            value={String(s[k])}
            onChange={(v) => set(k, v as never)}
            placeholder={ph}
          />
        ))}
        <SelectField
          label="Template"
          value={s.template}
          onChange={(v) => set('template', v as SignatureInput['template'])}
          options={[
            { value: 'side', label: 'Photo + colour bar' },
            { value: 'classic', label: 'Classic (photo on top)' },
            { value: 'compact', label: 'Compact (text only)' },
          ]}
        />
        <div className="space-y-1.5">
          <label htmlFor="sig-color" className={labelBase}>
            Brand colour
          </label>
          <input
            id="sig-color"
            type="color"
            value={s.color}
            onChange={(e) => set('color', e.target.value)}
            className={`${inputBase} h-[38px] p-1`}
          />
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="text-sm font-semibold text-gray-800">Preview</h2>
        {/* The signature is our own escaped HTML (buildSignature), shown in a sandboxed frame. */}
        <iframe
          title="Signature preview"
          sandbox=""
          srcDoc={`<!doctype html><meta charset="utf-8"><body style="margin:16px;background:#fff">${html}</body>`}
          className="h-56 w-full rounded-2xl border border-gray-100 bg-white"
        />
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          className={btnPrimary}
          onClick={() => void copyRich()}
        >
          Copy signature
        </button>
        <CopyButton text={html} label="Copy HTML" />
        {copied && (
          <span className="text-sm text-gray-600" aria-live="polite">
            {copied}
          </span>
        )}
      </div>
      <div className="space-y-2">
        <h2 className="text-sm font-semibold text-gray-800">How to add it</h2>
        <ul className="space-y-1.5 text-sm text-gray-700">
          {HOW_TO.map(([client, how]) => (
            <li key={client}>
              <strong>{client}:</strong> {how}
            </li>
          ))}
        </ul>
      </div>
      <p className="text-xs text-gray-500">
        Images in signatures are loaded from their URL, so host your photo or
        logo somewhere public (not as a file attachment). Tables and inline
        styles are used because email clients ignore most CSS.
      </p>
    </div>
  );
}
