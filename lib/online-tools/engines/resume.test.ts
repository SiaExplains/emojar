import { describe, expect, it } from 'vitest';
import {
  bullets,
  dateRange,
  emptyResume,
  exampleResume,
  isResume,
  resumeFileName,
  splitList,
} from './resume';

let n = 0;
const id = () => `id${n++}`;

describe('resume builder', () => {
  it('validates the empty and example resumes', () => {
    expect(isResume(emptyResume())).toBe(true);
    expect(isResume(exampleResume(id))).toBe(true);
    expect(isResume({ ...emptyResume(), accent: 'red' })).toBe(false);
    expect(isResume({ ...emptyResume(), links: ['a', 'b', 'c', 'd'] })).toBe(
      false,
    );
  });

  it('formats dates, bullets and lists', () => {
    expect(dateRange({ start: 'Mar 2021', end: '', current: true })).toBe(
      'Mar 2021 – Present',
    );
    expect(dateRange({ start: '2014', end: '2018', current: false })).toBe(
      '2014 – 2018',
    );
    expect(dateRange({ start: '', end: '2019', current: false })).toBe('2019');
    expect(bullets('- one\n\n• two\n  three  ')).toEqual([
      'one',
      'two',
      'three',
    ]);
    expect(splitList('Figma, , CSS\nHTML')).toEqual(['Figma', 'CSS', 'HTML']);
    expect(resumeFileName('Alex Morgan')).toBe('Alex-Morgan-Resume.pdf');
    expect(resumeFileName('  ')).toBe('Resume.pdf');
  });

  it('creates a PDF for both templates and long resumes', async () => {
    const { resumePdf } = await import('../pdf/documents');
    const { PDFDocument } = await import('pdf-lib');
    const ex = exampleResume(id);
    for (const template of ['classic', 'modern'] as const) {
      const bytes = await resumePdf({ ...ex, template });
      const doc = await PDFDocument.load(bytes);
      expect(doc.getPageCount()).toBe(1);
      expect(doc.getTitle()).toBe('Alex Morgan – Resume');
    }
    const long = {
      ...ex,
      template: 'modern' as const,
      experience: Array.from({ length: 12 }, () => ({
        ...ex.experience[0],
        id: id(),
      })),
    };
    const doc = await PDFDocument.load(await resumePdf(long));
    expect(doc.getPageCount()).toBeGreaterThan(1);
  });

  it('refuses text the built-in font cannot show', async () => {
    const { resumePdf } = await import('../pdf/documents');
    await expect(
      resumePdf({ ...emptyResume(), name: 'سیاوش' }),
    ).rejects.toThrow(/built-in PDF font/);
  });
});
