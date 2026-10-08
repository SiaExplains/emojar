import { searchIndex } from '@/lib/online-tools/registry';

// Compact tool index for the header search, fetched on first focus so pages
// don't carry it in their HTML. Built at deploy time from the registry.
export const dynamic = 'force-static';
export const revalidate = 86400;

export function GET() {
  return Response.json(searchIndex(), {
    headers: { 'Cache-Control': 'public, max-age=3600, s-maxage=86400' },
  });
}
