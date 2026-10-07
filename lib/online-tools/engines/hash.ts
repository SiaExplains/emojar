// Hashing via the Web Crypto API (SHA family) plus a small MD5 for legacy
// checksums — Web Crypto deliberately does not implement MD5.

export type HashAlgorithm = 'MD5' | 'SHA-1' | 'SHA-256' | 'SHA-384' | 'SHA-512';

export const HASH_ALGORITHMS: HashAlgorithm[] = [
  'MD5',
  'SHA-1',
  'SHA-256',
  'SHA-384',
  'SHA-512',
];

export function toHex(buf: ArrayBuffer | Uint8Array): string {
  const bytes = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}

function md5Bytes(input: Uint8Array): Uint8Array {
  const K = new Uint32Array(64);
  for (let i = 0; i < 64; i++)
    K[i] = Math.floor(Math.abs(Math.sin(i + 1)) * 2 ** 32) >>> 0;
  const S = [7, 12, 17, 22, 5, 9, 14, 20, 4, 11, 16, 23, 6, 10, 15, 21];

  const len = input.length;
  const paddedLen = (((len + 8) >> 6) + 1) << 6;
  const buf = new Uint8Array(paddedLen);
  buf.set(input);
  buf[len] = 0x80;
  const view = new DataView(buf.buffer);
  view.setUint32(paddedLen - 8, (len * 8) >>> 0, true);
  view.setUint32(paddedLen - 4, Math.floor(len / 0x20000000), true);

  let a0 = 0x67452301;
  let b0 = 0xefcdab89;
  let c0 = 0x98badcfe;
  let d0 = 0x10325476;
  const M = new Uint32Array(16);

  for (let off = 0; off < paddedLen; off += 64) {
    for (let i = 0; i < 16; i++) M[i] = view.getUint32(off + i * 4, true);
    let A = a0;
    let B = b0;
    let C = c0;
    let D = d0;
    for (let i = 0; i < 64; i++) {
      let F: number;
      let g: number;
      const round = i >> 4;
      if (round === 0) {
        F = (B & C) | (~B & D);
        g = i;
      } else if (round === 1) {
        F = (D & B) | (~D & C);
        g = (5 * i + 1) % 16;
      } else if (round === 2) {
        F = B ^ C ^ D;
        g = (3 * i + 5) % 16;
      } else {
        F = C ^ (B | ~D);
        g = (7 * i) % 16;
      }
      const s = S[round * 4 + (i % 4)];
      F = (F + A + K[i] + M[g]) >>> 0;
      A = D;
      D = C;
      C = B;
      B = (B + ((F << s) | (F >>> (32 - s)))) >>> 0;
    }
    a0 = (a0 + A) >>> 0;
    b0 = (b0 + B) >>> 0;
    c0 = (c0 + C) >>> 0;
    d0 = (d0 + D) >>> 0;
  }
  const out = new Uint8Array(16);
  const ov = new DataView(out.buffer);
  [a0, b0, c0, d0].forEach((v, i) => ov.setUint32(i * 4, v, true));
  return out;
}

export function md5Hex(input: string | Uint8Array): string {
  const bytes =
    typeof input === 'string' ? new TextEncoder().encode(input) : input;
  return toHex(md5Bytes(bytes));
}

export async function hashBytes(
  bytes: Uint8Array,
  algorithm: HashAlgorithm,
): Promise<string> {
  if (algorithm === 'MD5') return md5Hex(bytes);
  // Copy into a fresh ArrayBuffer so SharedArrayBuffer-backed views are accepted.
  const digest = await crypto.subtle.digest(
    algorithm,
    new Uint8Array(bytes).buffer,
  );
  return toHex(digest);
}

export function hashText(
  text: string,
  algorithm: HashAlgorithm,
): Promise<string> {
  return hashBytes(new TextEncoder().encode(text), algorithm);
}

export async function hmacText(
  text: string,
  key: string,
  algorithm: Exclude<HashAlgorithm, 'MD5'>,
): Promise<string> {
  const enc = new TextEncoder();
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    enc.encode(key),
    { name: 'HMAC', hash: algorithm },
    false,
    ['sign'],
  );
  return toHex(await crypto.subtle.sign('HMAC', cryptoKey, enc.encode(text)));
}
