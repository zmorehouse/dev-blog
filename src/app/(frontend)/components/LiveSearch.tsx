'use client'

import { useEffect, useRef, useState, useDeferredValue, startTransition, useMemo } from 'react'
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

const cache = new Map<string, { ts: number; docs: Post[] }>()
const CACHE_TTL = 30_000
const LRU_LIMIT = 20

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
  const [loading, setLoading] = useState(false)

  const tags = initialTags

  const dq = useDeferredValue(q)
  const dtag = useDeferredValue(tag)

  const controllerRef = useRef<AbortController | null>(null)
  const timerRef = useRef<number | null>(null)

  const router = useRouter()

  useEffect(() => {
    docs.slice(0, 3).forEach((p) => router.prefetch(`/post/${p.slug}`))
  }, [docs, router])

  const key = useMemo(() => {
    const s = new URLSearchParams()
    if (dq) s.set('q', dq)
    if (dtag) s.set('tag', dtag)
    return s.toString()
  }, [dq, dtag])

  useEffect(() => {
    const newUrl = key ? `/?${key}` : '/'

    const current = window.location.pathname + window.location.search
    if (current !== newUrl) {
      startTransition(() => router.replace(newUrl, { scroll: false }))
    }

    const now = Date.now()
    const hit = cache.get(key)
    if (hit && now - hit.ts < CACHE_TTL) {
      startTransition(() => setDocs(hit.docs))
      return
    }

    if (timerRef.current) window.clearTimeout(timerRef.current)
    timerRef.current = window.setTimeout(async () => {
      if (controllerRef.current) controllerRef.current.abort()
      controllerRef.current = new AbortController()
      setLoading(true)
      try {
        const res = await fetch(`/api/search?${key}`, {
          signal: controllerRef.current.signal,
          cache: 'no-store',
        })
        if (!res.ok) throw new Error('bad response')
        const json = await res.json()

        startTransition(() => setDocs(json.docs))

        cache.set(key, { ts: Date.now(), docs: json.docs })
        if (cache.size > LRU_LIMIT) {
          const oldest = [...cache.entries()].sort((a, b) => a[1].ts - b[1].ts)[0]?.[0]
          if (oldest) cache.delete(oldest)
        }
      } catch {
      } finally {
        setLoading(false)
      }
    }, 160)

    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current)
      controllerRef.current?.abort()
    }
  }, [key, router])

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

      <div className="cards" aria-busy={loading}>
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
                <Link
                  key={`${p.id}-${t}-${i}`}
                  className="tag"
                  href={`/?tag=${encodeURIComponent(t)}`}
                >
                  {t}
                </Link>
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
