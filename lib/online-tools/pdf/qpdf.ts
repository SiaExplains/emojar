// Password protection via qpdf compiled to WebAssembly (browser only).
// qpdf handles AES-256 encryption and decryption that pdf-lib cannot.

import { ToolInputError } from '../engines/data';

type QpdfModule = {
  callMain: (args: string[]) => number;
  FS: {
    writeFile: (path: string, data: Uint8Array) => void;
    readFile: (path: string) => Uint8Array;
    unlink: (path: string) => void;
  };
};

let stderr = '';

/** A fresh module per run: an Emscripten runtime may not be reusable after main() exits. */
async function load(): Promise<QpdfModule> {
  const { default: createModule } = await import('@neslinesli93/qpdf-wasm');
  const wasmUrl = new URL(
    '@neslinesli93/qpdf-wasm/dist/qpdf.wasm',
    import.meta.url,
  ).toString();
  const factory = createModule as unknown as (
    opts: Record<string, unknown>,
  ) => Promise<QpdfModule>;
  // This build ignores print/printErr and binds console.log/console.error
  // when the factory starts, so swap them in just for that synchronous call.
  const { log, error } = console;
  console.log = () => undefined;
  console.error = (...msg: unknown[]) => {
    stderr += `${msg.join(' ')}\n`;
  };
  try {
    return factory({ locateFile: () => wasmUrl, noInitialRun: true });
  } finally {
    console.log = log;
    console.error = error;
  }
}

async function run(input: Uint8Array, args: string[]): Promise<Uint8Array> {
  const q = await load();
  const inPath = '/input.pdf';
  const outPath = '/output.pdf';
  q.FS.writeFile(inPath, input);
  stderr = '';
  let code: number;
  try {
    code = q.callMain([
      ...args.map((a) => (a === '%IN%' ? inPath : a)),
      outPath,
    ]);
  } catch {
    code = 2;
  }
  // qpdf exit code 3 = success with warnings.
  if (code !== 0 && code !== 3) {
    if (/invalid password/i.test(stderr))
      throw new ToolInputError('The password is incorrect.');
    throw new ToolInputError(
      'This file could not be processed. Please make sure it is a valid PDF file.',
    );
  }
  return q.FS.readFile(outPath);
}

export async function encryptPdf(
  input: Uint8Array,
  opts: {
    userPassword: string;
    ownerPassword?: string;
    allowPrint: boolean;
    allowCopy: boolean;
  },
): Promise<Uint8Array> {
  if (!opts.userPassword) throw new ToolInputError('Please enter a password.');
  const owner = opts.ownerPassword || opts.userPassword;
  return run(input, [
    '%IN%',
    '--encrypt',
    opts.userPassword,
    owner,
    '256',
    `--print=${opts.allowPrint ? 'full' : 'none'}`,
    `--extract=${opts.allowCopy ? 'y' : 'n'}`,
    '--',
  ]);
}

export async function decryptPdf(
  input: Uint8Array,
  password: string,
): Promise<Uint8Array> {
  return run(input, [
    ...(password ? [`--password=${password}`] : []),
    '--decrypt',
    '%IN%',
  ]);
}

/** Quick check whether a PDF is encrypted (looks for the /Encrypt trailer key). */
export function looksEncrypted(bytes: Uint8Array): boolean {
  const tail = new TextDecoder('latin1').decode(
    bytes.subarray(Math.max(0, bytes.length - 4096)),
  );
  const head = new TextDecoder('latin1').decode(
    bytes.subarray(0, Math.min(bytes.length, 2048)),
  );
  return /\/Encrypt\s/.test(tail) || /\/Encrypt\s/.test(head);
}
