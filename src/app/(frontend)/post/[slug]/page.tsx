import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { RichText } from '@payloadcms/richtext-lexical/react'
import BackButton from '@/app/(frontend)/components/BackButton'

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const payload = await getPayload({ config: await config })
  const { docs } = await payload.find({
    collection: 'posts',
    where: { and: [{ slug: { equals: slug } }, { published: { equals: true } }] },
    limit: 1,
  })

  const post = docs[0]
  if (!post) notFound()

  return (
    <main className="container">
      <BackButton className="tag" />
      <h2 style={{ marginTop: 12 }}>{post.title}</h2>
      <div style={{ marginTop: 8, color: 'var(--muted)' }}>
        {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : ''}
      </div>
      <div style={{ marginTop: 20 }}>
        <RichText data={post.content} />
      </div>
    </main>
  )
}
