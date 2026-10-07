// City → IANA time zone shortlist for pickers; the full IANA list is appended
// at runtime from Intl.supportedValuesOf where available.

export const CITY_ZONES: { city: string; tz: string }[] = [
  { city: 'Los Angeles', tz: 'America/Los_Angeles' },
  { city: 'Denver', tz: 'America/Denver' },
  { city: 'Chicago', tz: 'America/Chicago' },
  { city: 'New York', tz: 'America/New_York' },
  { city: 'Toronto', tz: 'America/Toronto' },
  { city: 'Mexico City', tz: 'America/Mexico_City' },
  { city: 'São Paulo', tz: 'America/Sao_Paulo' },
  { city: 'Buenos Aires', tz: 'America/Argentina/Buenos_Aires' },
  { city: 'London', tz: 'Europe/London' },
  { city: 'Lisbon', tz: 'Europe/Lisbon' },
  { city: 'Paris', tz: 'Europe/Paris' },
  { city: 'Berlin', tz: 'Europe/Berlin' },
  { city: 'Madrid', tz: 'Europe/Madrid' },
  { city: 'Rome', tz: 'Europe/Rome' },
  { city: 'Amsterdam', tz: 'Europe/Amsterdam' },
  { city: 'Stockholm', tz: 'Europe/Stockholm' },
  { city: 'Athens', tz: 'Europe/Athens' },
  { city: 'Istanbul', tz: 'Europe/Istanbul' },
  { city: 'Moscow', tz: 'Europe/Moscow' },
  { city: 'Cairo', tz: 'Africa/Cairo' },
  { city: 'Lagos', tz: 'Africa/Lagos' },
  { city: 'Johannesburg', tz: 'Africa/Johannesburg' },
  { city: 'Nairobi', tz: 'Africa/Nairobi' },
  { city: 'Dubai', tz: 'Asia/Dubai' },
  { city: 'Tehran', tz: 'Asia/Tehran' },
  { city: 'Karachi', tz: 'Asia/Karachi' },
  { city: 'Mumbai / Delhi', tz: 'Asia/Kolkata' },
  { city: 'Dhaka', tz: 'Asia/Dhaka' },
  { city: 'Bangkok', tz: 'Asia/Bangkok' },
  { city: 'Jakarta', tz: 'Asia/Jakarta' },
  { city: 'Singapore', tz: 'Asia/Singapore' },
  { city: 'Hong Kong', tz: 'Asia/Hong_Kong' },
  { city: 'Shanghai / Beijing', tz: 'Asia/Shanghai' },
  { city: 'Seoul', tz: 'Asia/Seoul' },
  { city: 'Tokyo', tz: 'Asia/Tokyo' },
  { city: 'Sydney', tz: 'Australia/Sydney' },
  { city: 'Auckland', tz: 'Pacific/Auckland' },
  { city: 'Honolulu', tz: 'Pacific/Honolulu' },
  { city: 'UTC', tz: 'UTC' },
];

export function allTimeZones(): { value: string; label: string }[] {
  const cities = CITY_ZONES.map((c) => ({
    value: c.tz,
    label: `${c.city} (${c.tz})`,
  }));
  const known = new Set(CITY_ZONES.map((c) => c.tz));
  const intl = Intl as unknown as {
    supportedValuesOf?: (k: string) => string[];
  };
  const rest = (intl.supportedValuesOf?.('timeZone') ?? [])
    .filter((z) => !known.has(z))
    .map((z) => ({ value: z, label: z.replace(/_/g, ' ') }));
  return [...cities, ...rest];
}

export function cityName(tz: string): string {
  return (
    CITY_ZONES.find((c) => c.tz === tz)?.city ??
    tz.split('/').pop()!.replace(/_/g, ' ')
  );
}

export function localTimeZone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
}
