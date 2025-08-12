'use client'

import { useRouter } from 'next/navigation'
import clsx from 'clsx'

export default function BackButton({ className }: { className?: string }) {
  const router = useRouter()
  return (
    <button
      type="button"
      className={clsx('tag', className)}
      onClick={() => {
        if (typeof window !== 'undefined' && window.history.length > 1) {
          router.back()
        } else {
          router.push('/')
        }
      }}
    >
      ← back
    </button>
  )
}
