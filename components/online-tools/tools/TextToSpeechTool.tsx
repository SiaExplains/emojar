'use client';

import { useEffect, useRef, useState } from 'react';
import type { ToolProps } from '../ToolRenderer';
import {
  ErrorMessage,
  Notice,
  RangeField,
  SelectField,
  ToolInput,
  btnPrimary,
  btnSecondary,
} from '../ui';

const SAMPLE =
  'Emojar tools run right in your browser. Paste any text here and press Play to hear it read aloud. Change the voice, speed and pitch until it sounds just right.';

export default function TextToSpeechTool(_: ToolProps) {
  const supported =
    typeof window !== 'undefined' && 'speechSynthesis' in window;
  const [text, setText] = useState(SAMPLE);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voiceURI, setVoiceURI] = useState('');
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [state, setState] = useState<'idle' | 'speaking' | 'paused'>('idle');
  const [highlight, setHighlight] = useState<{
    start: number;
    end: number;
  } | null>(null);
  const [error, setError] = useState('');
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (!supported) return;
    const load = () => {
      const list = speechSynthesis
        .getVoices()
        .slice()
        .sort(
          (a, b) =>
            Number(b.localService) - Number(a.localService) ||
            a.lang.localeCompare(b.lang),
        );
      setVoices(list);
      setVoiceURI((cur) => {
        if (cur) return cur;
        const lang = navigator.language.slice(0, 2);
        return (
          (
            list.find(
              (v) => v.localService && v.lang.startsWith(lang) && v.default,
            ) ??
            list.find((v) => v.localService && v.lang.startsWith(lang)) ??
            list[0]
          )?.voiceURI ?? ''
        );
      });
    };
    load();
    speechSynthesis.addEventListener('voiceschanged', load);
    return () => {
      speechSynthesis.removeEventListener('voiceschanged', load);
      speechSynthesis.cancel();
    };
  }, [supported]);

  const play = () => {
    if (!text.trim()) return setError('Enter some text to read.');
    setError('');
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    const voice = voices.find((v) => v.voiceURI === voiceURI);
    if (voice) {
      u.voice = voice;
      u.lang = voice.lang;
    }
    u.rate = rate;
    u.pitch = pitch;
    u.onboundary = (e) => {
      if (e.name !== 'word') return;
      const end = e.charLength
        ? e.charIndex + e.charLength
        : text.slice(e.charIndex).search(/\s|$/) + e.charIndex;
      setHighlight({ start: e.charIndex, end });
    };
    u.onend = () => {
      setState('idle');
      setHighlight(null);
    };
    u.onerror = (e) => {
      setState('idle');
      setHighlight(null);
      if (e.error !== 'canceled' && e.error !== 'interrupted')
        setError('Speech could not be played. Try another voice.');
    };
    utterRef.current = u;
    speechSynthesis.speak(u);
    setState('speaking');
  };

  const pause = () => {
    speechSynthesis.pause();
    setState('paused');
  };
  const resume = () => {
    speechSynthesis.resume();
    setState('speaking');
  };
  const stop = () => {
    speechSynthesis.cancel();
    setState('idle');
    setHighlight(null);
  };

  if (!supported)
    return (
      <ErrorMessage>
        Your browser does not support speech synthesis. Try a recent version of
        Chrome, Edge, Safari or Firefox.
      </ErrorMessage>
    );

  const selected = voices.find((v) => v.voiceURI === voiceURI);
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;

  return (
    <div className="space-y-5">
      {state === 'idle' ? (
        <ToolInput
          label="Text to read"
          value={text}
          onChange={setText}
          rows={8}
          mono={false}
        />
      ) : (
        <div className="space-y-1.5">
          <span className="block text-sm font-medium text-gray-700">
            Reading…
          </span>
          <p
            className="max-h-64 overflow-auto whitespace-pre-wrap rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm leading-relaxed text-gray-800"
            aria-live="off"
          >
            {highlight ? (
              <>
                {text.slice(0, highlight.start)}
                <mark className="rounded bg-amber-200">
                  {text.slice(highlight.start, highlight.end)}
                </mark>
                {text.slice(highlight.end)}
              </>
            ) : (
              text
            )}
          </p>
        </div>
      )}
      <p className="text-xs text-gray-500">
        {words.toLocaleString('en-US')} words · about{' '}
        {Math.max(1, Math.round(words / (150 * rate)))} min at this speed
      </p>
      <div className="grid gap-4 sm:grid-cols-3">
        <SelectField
          label="Voice"
          value={voiceURI}
          onChange={setVoiceURI}
          options={
            voices.length
              ? voices.map((v) => ({
                  value: v.voiceURI,
                  label: `${v.name} (${v.lang})${v.localService ? '' : ' · online'}`,
                }))
              : [{ value: '', label: 'Loading voices…' }]
          }
        />
        <RangeField
          label="Speed"
          value={rate}
          onChange={setRate}
          min={0.5}
          max={2}
          step={0.1}
          display={`${rate.toFixed(1)}×`}
        />
        <RangeField
          label="Pitch"
          value={pitch}
          onChange={setPitch}
          min={0.5}
          max={2}
          step={0.1}
          display={pitch.toFixed(1)}
        />
      </div>
      {selected && !selected.localService && (
        <Notice tone="amber">
          “{selected.name}” is an online voice: your browser sends the text to
          its speech service. Pick a voice without “online” to keep everything
          on your device.
        </Notice>
      )}
      <div className="flex flex-wrap gap-2">
        {state === 'idle' && (
          <button type="button" className={btnPrimary} onClick={play}>
            ▶ Play
          </button>
        )}
        {state === 'speaking' && (
          <button type="button" className={btnSecondary} onClick={pause}>
            ⏸ Pause
          </button>
        )}
        {state === 'paused' && (
          <button type="button" className={btnPrimary} onClick={resume}>
            ▶ Resume
          </button>
        )}
        {state !== 'idle' && (
          <button type="button" className={btnSecondary} onClick={stop}>
            ⏹ Stop
          </button>
        )}
      </div>
      <ErrorMessage>{error}</ErrorMessage>
    </div>
  );
}
