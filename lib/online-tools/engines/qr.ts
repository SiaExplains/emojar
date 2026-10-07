// Builds the text payload encoded in a QR code for common content types.

export type QrContent =
  | { type: 'url'; url: string }
  | { type: 'text'; text: string }
  | {
      type: 'wifi';
      ssid: string;
      password: string;
      security: 'WPA' | 'WEP' | 'nopass';
      hidden: boolean;
    }
  | { type: 'email'; to: string; subject: string; body: string }
  | { type: 'phone'; phone: string }
  | { type: 'sms'; phone: string; message: string };

/** Escapes the characters that are special in the Wi-Fi QR format. */
function wifiEscape(s: string): string {
  return s.replace(/([\\;,:"])/g, '\\$1');
}

export function buildQrPayload(c: QrContent): string {
  switch (c.type) {
    case 'url': {
      const u = c.url.trim();
      if (!u) return '';
      return /^[a-z][a-z0-9+.-]*:/i.test(u) ? u : `https://${u}`;
    }
    case 'text':
      return c.text;
    case 'wifi':
      if (!c.ssid) return '';
      return `WIFI:T:${c.security};S:${wifiEscape(c.ssid)};${c.security === 'nopass' ? '' : `P:${wifiEscape(c.password)};`}${c.hidden ? 'H:true;' : ''};`;
    case 'email': {
      if (!c.to.trim()) return '';
      const params = new URLSearchParams();
      if (c.subject) params.set('subject', c.subject);
      if (c.body) params.set('body', c.body);
      const qs = params.toString().replace(/\+/g, '%20');
      return `mailto:${c.to.trim()}${qs ? `?${qs}` : ''}`;
    }
    case 'phone':
      return c.phone.trim() ? `tel:${c.phone.replace(/[^\d+]/g, '')}` : '';
    case 'sms':
      return c.phone.trim()
        ? `SMSTO:${c.phone.replace(/[^\d+]/g, '')}:${c.message}`
        : '';
  }
}
