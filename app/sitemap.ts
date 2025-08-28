import type { MetadataRoute } from 'next'
import data from '@/data/emojis.json'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://emojar.com'
  const emojiUrls = data.map(e => ({ url: `${base}/emoji/${e.slug}`, lastModified: new Date() }))
  const routes = ['', '/categories'].map(r => ({ url: `${base}${r}`, lastModified: new Date() }))
  return [...routes, ...emojiUrls]
}
