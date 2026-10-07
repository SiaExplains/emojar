// TOTP (RFC 6238) / HOTP (RFC 4226) with Web Crypto HMAC, plus Base32
// (RFC 4648) and otpauth:// URI parsing.

import { ToolInputError } from './data';

const B32 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

export function base32Decode(input: string): Uint8Array {
  const s = input.toUpperCase().replace(/[\s=-]/g, '');
  if (!s) throw new ToolInputError('Enter a secret key.');
  let bits = 0;
  let value = 0;
  const out: number[] = [];
  for (const ch of s) {
    const v = B32.indexOf(ch);
    if (v < 0)
      throw new ToolInputError(
        `“${ch}” is not valid in a Base32 secret (use A–Z and 2–7).`,
      );
    value = (value << 5) | v;
    bits += 5;
    if (bits >= 8) {
      out.push((value >>> (bits - 8)) & 0xff);
      bits -= 8;
    }
  }
  return new Uint8Array(out);
}

export function base32Encode(bytes: Uint8Array): string {
  let bits = 0;
  let value = 0;
  let out = '';
  for (const b of bytes) {
    value = (value << 8) | b;
    bits += 8;
    while (bits >= 5) {
      out += B32[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }
  if (bits > 0) out += B32[(value << (5 - bits)) & 31];
  return out;
}

export type OtpAlgorithm = 'SHA-1' | 'SHA-256' | 'SHA-512';

export async function hotp(
  key: Uint8Array,
  counter: number,
  digits = 6,
  algorithm: OtpAlgorithm = 'SHA-1',
): Promise<string> {
  const msg = new ArrayBuffer(8);
  const view = new DataView(msg);
  view.setUint32(0, Math.floor(counter / 2 ** 32));
  view.setUint32(4, counter >>> 0);
  const k = await crypto.subtle.importKey(
    'raw',
    key as BufferSource,
    { name: 'HMAC', hash: algorithm },
    false,
    ['sign'],
  );
  const mac = new Uint8Array(await crypto.subtle.sign('HMAC', k, msg));
  const offset = mac[mac.length - 1] & 0x0f;
  const bin =
    ((mac[offset] & 0x7f) << 24) |
    (mac[offset + 1] << 16) |
    (mac[offset + 2] << 8) |
    mac[offset + 3];
  return String(bin % 10 ** digits).padStart(digits, '0');
}

export function totp(
  key: Uint8Array,
  timeMs: number,
  opts: { period?: number; digits?: number; algorithm?: OtpAlgorithm } = {},
): Promise<string> {
  const period = opts.period ?? 30;
  return hotp(
    key,
    Math.floor(timeMs / 1000 / period),
    opts.digits ?? 6,
    opts.algorithm ?? 'SHA-1',
  );
}

export type OtpAuth = {
  secret: string;
  issuer?: string;
  account?: string;
  algorithm: OtpAlgorithm;
  digits: number;
  period: number;
};

export function parseOtpAuthUri(uri: string): OtpAuth {
  let url: URL;
  try {
    url = new URL(uri.trim());
  } catch {
    throw new ToolInputError('This is not a valid otpauth:// link.');
  }
  if (url.protocol !== 'otpauth:')
    throw new ToolInputError('The link must start with otpauth://');
  if (url.host.toLowerCase() !== 'totp')
    throw new ToolInputError(
      'Only time-based (otpauth://totp/…) codes are supported.',
    );
  const secret = url.searchParams.get('secret');
  if (!secret) throw new ToolInputError('The link has no secret= parameter.');
  const label = decodeURIComponent(url.pathname.replace(/^\/+/, ''));
  const colon = label.indexOf(':');
  const labelIssuer = colon >= 0 ? label.slice(0, colon) : undefined;
  const account = colon >= 0 ? label.slice(colon + 1) : label;
  const alg = (url.searchParams.get('algorithm') ?? 'SHA1').toUpperCase();
  const algorithm: OtpAlgorithm =
    alg === 'SHA256' ? 'SHA-256' : alg === 'SHA512' ? 'SHA-512' : 'SHA-1';
  const digits = Number(url.searchParams.get('digits') ?? 6);
  const period = Number(url.searchParams.get('period') ?? 30);
  return {
    secret,
    issuer: url.searchParams.get('issuer') ?? labelIssuer ?? undefined,
    account: account || undefined,
    algorithm,
    digits: [6, 7, 8].includes(digits) ? digits : 6,
    period: period > 0 && period <= 300 ? period : 30,
  };
}

export function randomSecret(bytes = 20): string {
  const b = new Uint8Array(bytes);
  crypto.getRandomValues(b);
  return base32Encode(b);
}
