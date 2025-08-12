import { getPayload } from 'payload'
import config from '@/payload.config'
import LiveSearch from './components/LiveSearch'
import Link from 'next/link'

type SP = Record<string, string | string[] | undefined>

export default async function HomePage({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams
  const q = Array.isArray(sp.q) ? sp.q[0] : sp.q
  const tag = Array.isArray(sp.tag) ? sp.tag[0] : sp.tag

  const payload = await getPayload({ config: await config })
  const where: any = { published: { equals: true } }
  if (tag) where['tags.tag'] = { contains: tag }
  if (q) where.or = [{ title: { like: q } }, { excerpt: { like: q } }]

  const { docs } = await payload.find({
    collection: 'posts',
    where,
    sort: '-publishedAt',
    limit: 20,
    depth: 0,
  })

  const initialDocs = docs.map((p: any) => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    excerpt: p.excerpt ?? '',
    publishedAt: p.publishedAt ?? null,
    tags: (p.tags ?? []).map((t: any) => t.tag).filter(Boolean),
  }))
  const initialTags = Array.from(new Set(initialDocs.flatMap((p: any) => p.tags)))

  return (
    <main className="container">
      <LiveSearch
        initialDocs={initialDocs}
        initialTags={initialTags}
        initialQ={q as string | undefined}
        initialTag={tag as string | undefined}
      />
    </main>
  )
}
