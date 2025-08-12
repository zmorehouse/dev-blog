import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const q = url.searchParams.get('q') || ''
  const tag = url.searchParams.get('tag') || ''

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

  const minimal = docs.map((p: any) => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    excerpt: p.excerpt ?? '',
    publishedAt: p.publishedAt ?? null,
    tags: (p.tags ?? []).map((t: any) => t.tag).filter(Boolean),
  }))

  const tags = Array.from(new Set(minimal.flatMap((p) => p.tags)))
  return NextResponse.json({ docs: minimal, tags })
}
