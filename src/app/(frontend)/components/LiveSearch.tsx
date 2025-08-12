'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

type Post = {
  id: string
  title: string
  slug: string
  excerpt?: string
  publishedAt?: string | null
  tags: string[]
}

export default function LiveSearch({
  initialDocs,
  initialTags,
  initialQ,
  initialTag,
}: {
  initialDocs: Post[]
  initialTags: string[]
  initialQ?: string
  initialTag?: string
}) {
  const [q, setQ] = useState(initialQ ?? '')
  const [tag, setTag] = useState<string | undefined>(initialTag)
  const [docs, setDocs] = useState<Post[]>(initialDocs)
  const [tags, setTags] = useState<string[]>(initialTags)
  const [loading, setLoading] = useState(false)

  const controllerRef = useRef<AbortController | null>(null)
  const timerRef = useRef<number | null>(null)

  const router = useRouter()
  useEffect(() => {
    docs.slice(0, 6).forEach((p) => {
      router.prefetch(`/post/${p.slug}`)
    })
  }, [docs, router])

  useEffect(() => {
    if (timerRef.current) window.clearTimeout(timerRef.current)
    timerRef.current = window.setTimeout(async () => {
      if (controllerRef.current) controllerRef.current.abort()
      controllerRef.current = new AbortController()
      setLoading(true)

      const params = new URLSearchParams()
      if (q) params.set('q', q)
      if (tag) params.set('tag', tag)

      const newUrl = params.toString() ? `/?${params}` : '/'
      window.history.replaceState(null, '', newUrl)

      try {
        const res = await fetch(`/api/search?${params}`, {
          signal: controllerRef.current.signal,
        })
        if (!res.ok) throw new Error('bad response')
        const json = await res.json()
        setDocs(json.docs)
        setTags(json.tags)
      } catch (_) {
      } finally {
        setLoading(false)
      }
    }, 220)
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current)
      controllerRef.current?.abort()
    }
  }, [q, tag])

  return (
    <>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', margin: '12px 0 18px' }}>
        <input
          className="input"
          name="q"
          placeholder="search..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          aria-label="Search posts"
        />
        <div className="tagRow">
          {tags.map((t) => {
            const active = tag === t
            return (
              <button
                key={t}
                className="tag"
                onClick={() => setTag(active ? undefined : t)}
                aria-pressed={active}
                type="button"
                title={`Filter by ${t}`}
              >
                {t}
              </button>
            )
          })}
          {tag && (
            <button
              className="clearBtn"
              onClick={() => setTag(undefined)}
              type="button"
              title="Clear tag filter"
            >
              clear
            </button>
          )}
        </div>
      </div>

      <div className="cards">
        {docs.map((p) => (
          <article key={p.id} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16 }}>
              <h3 style={{ margin: 0 }} className="cardHeader">
                <Link href={`/post/${p.slug}`} prefetch>
                  {p.title}
                </Link>
              </h3>
              <time dateTime={p.publishedAt ?? undefined}>
                {p.publishedAt ? new Date(p.publishedAt).toLocaleDateString() : ''}
              </time>
            </div>

            {p.excerpt && <p style={{ margin: '6px 0 0', color: 'var(--muted)' }}>{p.excerpt}</p>}

            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 20 }}>
              {p.tags.map((t, i) => (
                <a
                  key={`${p.id}-${t}-${i}`}
                  className="tag"
                  href={`/?tag=${encodeURIComponent(t)}`}
                >
                  {t}
                </a>
              ))}
            </div>
          </article>
        ))}
        {docs.length === 0 && !loading && (
          <div className="item" style={{ color: 'var(--muted)' }}>
            no matches
          </div>
        )}
      </div>
    </>
  )
}
