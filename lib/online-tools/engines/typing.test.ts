import { describe, expect, it } from 'vitest';
import {
  COMMON_WORDS,
  addToHistory,
  compareText,
  generateText,
  isHistory,
  liveWpm,
  personalBest,
  scoreTest,
} from './typing';

describe('typing test', () => {
  it('generates the same text for the same seed', () => {
    const a = generateText({ mode: 'words', seed: 7, words: 30 });
    expect(a).toBe(generateText({ mode: 'words', seed: 7, words: 30 }));
    expect(a.split(' ')).toHaveLength(30);
    expect(a.split(' ').every((w) => COMMON_WORDS.includes(w))).toBe(true);
    expect(a).not.toBe(generateText({ mode: 'words', seed: 8, words: 30 }));
  });

  it('adds punctuation, capitals and numbers when asked', () => {
    const t = generateText({
      mode: 'words',
      seed: 3,
      words: 200,
      punctuation: true,
      numbers: true,
    });
    expect(t).toMatch(/[A-Z]/);
    expect(t).toMatch(/[.,?!;:]/);
    expect(t).toMatch(/\d/);
    expect(t.endsWith('.')).toBe(true);
  });

  it('builds sentence mode from passages up to the word target', () => {
    const t = generateText({ mode: 'sentences', seed: 1, words: 60 });
    expect(t.split(' ').length).toBeGreaterThanOrEqual(60);
    expect(t).toMatch(/\.$/);
  });

  it('counts correct, incorrect and extra characters', () => {
    expect(compareText('hello world', 'hellp world!')).toEqual({
      correct: 10,
      incorrect: 1,
      extra: 1,
    });
  });

  it('scores WPM with 5 characters per word', () => {
    // 250 correct characters in 60 s = 50 WPM.
    const target = 'a'.repeat(300);
    const r = scoreTest({
      target,
      typed: 'a'.repeat(250),
      seconds: 60,
      keystrokes: 260,
      wrongKeystrokes: 13,
    });
    expect(r.wpm).toBe(50);
    expect(r.rawWpm).toBe(50);
    expect(r.accuracy).toBe(95);
    expect(r.errors).toBe(0);
    // Errors lower net WPM but not raw WPM: 30 s, 100 typed, 90 right.
    const r2 = scoreTest({
      target: 'b'.repeat(200),
      typed: 'b'.repeat(90) + 'x'.repeat(10),
      seconds: 30,
      keystrokes: 100,
      wrongKeystrokes: 10,
    });
    expect(r2.wpm).toBe(36);
    expect(r2.rawWpm).toBe(40);
    expect(r2.errors).toBe(10);
    expect(liveWpm(0, 0)).toBe(0);
    expect(liveWpm(100, 30)).toBe(40);
  });

  it('keeps the last 10 results and finds the best per duration', () => {
    let h: ReturnType<typeof addToHistory> = [];
    for (let i = 0; i < 12; i++)
      h = addToHistory(h, {
        wpm: 40 + i,
        accuracy: 97,
        seconds: i % 2 ? 60 : 30,
        mode: 'words',
        at: i,
      });
    expect(h).toHaveLength(10);
    expect(personalBest(h, 60)).toBe(51);
    expect(personalBest(h, 120)).toBe(0);
    expect(isHistory(h)).toBe(true);
    expect(isHistory([{ wpm: 'x' }])).toBe(false);
  });
});
