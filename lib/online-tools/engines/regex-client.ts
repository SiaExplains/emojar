export type RegexMatch = {
  index: number;
  match: string;
  groups: (string | undefined)[];
  named: Record<string, string | undefined> | null;
};

export function createRegexWorker(): Worker {
  return new Worker(new URL('./regex.worker.ts', import.meta.url), {
    type: 'module',
  });
}
