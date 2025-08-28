import { type NextRequest } from 'next/server'

export function GET(_req: NextRequest) {
  const body = `User-agent: *
Allow: /
Sitemap: https://emojar.com/sitemap.xml`
  return new Response(body, { headers: { 'content-type': 'text/plain' } })
}
