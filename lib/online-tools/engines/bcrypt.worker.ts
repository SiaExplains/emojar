// Hashes and verifies bcrypt off the main thread: cost 12+ takes seconds and
// would otherwise freeze the page.

import bcrypt from 'bcryptjs';

type Request =
  | { id: number; op: 'hash'; password: string; cost: number }
  | { id: number; op: 'verify'; password: string; hash: string };

const scope = self as unknown as {
  onmessage: ((e: MessageEvent<Request>) => void) | null;
  postMessage: (message: unknown) => void;
};

scope.onmessage = async (e) => {
  const req = e.data;
  const started = performance.now();
  try {
    if (req.op === 'hash') {
      const hash = await bcrypt.hash(req.password, req.cost);
      scope.postMessage({
        id: req.id,
        ok: true,
        hash,
        ms: performance.now() - started,
      });
    } else {
      const match = await bcrypt.compare(req.password, req.hash);
      scope.postMessage({
        id: req.id,
        ok: true,
        match,
        ms: performance.now() - started,
      });
    }
  } catch (err) {
    scope.postMessage({
      id: req.id,
      ok: false,
      error: err instanceof Error ? err.message : String(err),
    });
  }
};
