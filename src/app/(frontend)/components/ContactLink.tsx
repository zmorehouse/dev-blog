'use client'

import { useEffect, useState } from 'react'

export default function ContactLink() {
  const [copied, setCopied] = useState(false)
  const email = 'me@zmorehouse.com'

  async function handleClick(e: React.MouseEvent) {
    e.preventDefault()
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(email)
      } else {
        const ta = document.createElement('textarea')
        ta.value = email
        ta.setAttribute('readonly', '')
        ta.style.position = 'absolute'
        ta.style.left = '-9999px'
        document.body.appendChild(ta)
        ta.select()
        document.execCommand('copy')
        document.body.removeChild(ta)
      }
      setCopied(true)
    } catch {
      window.location.href = `mailto:${email}`
    }
  }

  useEffect(() => {
    if (!copied) return
    const t = setTimeout(() => setCopied(false), 1400)
    return () => clearTimeout(t)
  }, [copied])

  return (
    <li className="contactWrap">
      <a
        href="#"
        className="navLinkBtn"
        onClick={handleClick}
        role="button"
        aria-label="Copy email to clipboard"
      >
        ./contact
      </a>
      <span className={`copiedToast ${copied ? 'show' : ''}`} role="status" aria-live="polite">
        email copied!
      </span>
    </li>
  )
}
