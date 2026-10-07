'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  TRANSFORMS,
  type TransformValues,
} from '@/lib/online-tools/engines/transforms';
import type { ToolProps } from '../ToolRenderer';
import {
  Checkbox,
  ErrorMessage,
  Notice,
  SelectField,
  TextField,
  ToolInput,
  ToolOutput,
  btnPrimary,
  btnSecondary,
  friendlyError,
} from '../ui';

const MIME: Record<string, string> = {
  json: 'application/json',
  yaml: 'application/yaml',
  csv: 'text/csv',
  xml: 'application/xml',
  html: 'text/html',
  css: 'text/css',
  js: 'text/javascript',
  'min.js': 'text/javascript',
  md: 'text/markdown',
  sql: 'application/sql',
  ts: 'text/typescript',
};

export default function TextTransformTool({ config }: ToolProps) {
  const def = TRANSFORMS[String(config.transform)];
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [opts, setOpts] = useState<TransformValues>(() =>
    Object.fromEntries((def?.options ?? []).map((o) => [o.id, o.default])),
  );
  const runId = useRef(0);

  const run = useCallback(
    async (value: string, values: TransformValues) => {
      if (!def) return;
      const id = ++runId.current;
      if (!value.trim()) {
        setOutput('');
        setError('');
        return;
      }
      setBusy(true);
      try {
        const out = await def.run(value, values);
        if (id !== runId.current) return;
        setOutput(out);
        setError('');
      } catch (e) {
        if (id !== runId.current) return;
        setOutput('');
        setError(friendlyError(e));
      } finally {
        if (id === runId.current) setBusy(false);
      }
    },
    [def],
  );

  useEffect(() => {
    if (!def?.live) return;
    const t = window.setTimeout(() => void run(input, opts), 150);
    return () => window.clearTimeout(t);
  }, [input, opts, def, run]);

  if (!def) return <ErrorMessage>This tool is not available.</ErrorMessage>;

  const setOpt = (id: string, v: string | boolean) => {
    const next = { ...opts, [id]: v };
    setOpts(next);
    if (!def.live && output) void run(input, next);
  };

  return (
    <div className="space-y-4">
      <ToolInput
        label={def.inputLabel}
        value={input}
        onChange={setInput}
        placeholder={def.placeholder}
        onKeyDown={(e) => {
          if ((e.metaKey || e.ctrlKey) && e.key === 'Enter')
            void run(input, opts);
        }}
        actions={
          <>
            <button
              type="button"
              className={btnSecondary}
              onClick={() => setInput(def.sample)}
            >
              Load sample
            </button>
            <button
              type="button"
              className={btnSecondary}
              onClick={() => setInput('')}
              disabled={!input}
            >
              Clear
            </button>
          </>
        }
      />

      {(def.options?.length || !def.live) && (
        <div className="flex flex-wrap items-end gap-4">
          {def.options?.map((o) =>
            o.type === 'select' ? (
              <SelectField
                key={o.id}
                label={o.label}
                value={String(opts[o.id])}
                onChange={(v) => setOpt(o.id, v)}
                options={o.choices}
                className="min-w-[180px]"
              />
            ) : o.type === 'text' ? (
              <TextField
                key={o.id}
                label={o.label}
                value={String(opts[o.id] ?? '')}
                onChange={(v) => setOpt(o.id, v)}
                placeholder={o.placeholder}
                className="min-w-[160px]"
              />
            ) : (
              <div key={o.id} className="pb-2">
                <Checkbox
                  label={o.label}
                  checked={!!opts[o.id]}
                  onChange={(v) => setOpt(o.id, v)}
                />
              </div>
            ),
          )}
          {!def.live && (
            <button
              type="button"
              className={btnPrimary}
              onClick={() => void run(input, opts)}
              disabled={!input.trim() || busy}
            >
              {busy ? 'Working…' : def.actionLabel}
            </button>
          )}
        </div>
      )}

      <ErrorMessage>{error}</ErrorMessage>

      {def.statusOnly ? (
        output && <Notice tone="green">{output}</Notice>
      ) : (
        <ToolOutput
          label={def.outputLabel}
          value={output}
          filename={`output.${def.outputExt}`}
          mime={MIME[def.outputExt] ?? 'text/plain'}
          status={
            busy && def.live ? (
              <p className="text-xs text-gray-400">Working…</p>
            ) : undefined
          }
        />
      )}
      {!def.live && (
        <p className="text-xs text-gray-400">
          Tip: press Ctrl/⌘ + Enter to run.
        </p>
      )}
    </div>
  );
}
