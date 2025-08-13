'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function BackButton({
  className = 'tag',
  children = '← back',
}: {
  className?: string
  children?: React.ReactNode
}) {
  const router = useRouter()

  useEffect(() => {
    router.prefetch('/')
  }, [router])

  function handleClick() {
    const ref = document.referrer
    const sameOrigin = ref && new URL(ref).origin === window.location.origin

    if (sameOrigin && window.history.length > 1) {
      router.back()
    } else {
      router.replace('/')
    }
  }

  return (
    <button type="button" className={className} onClick={handleClick} aria-label="Go back">
      {children}
    </button>
  )
}
