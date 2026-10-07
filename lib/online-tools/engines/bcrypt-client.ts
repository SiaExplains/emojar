export function createBcryptWorker(): Worker {
  return new Worker(new URL('./bcrypt.worker.ts', import.meta.url), {
    type: 'module',
  });
}
