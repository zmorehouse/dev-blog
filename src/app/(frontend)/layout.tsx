import Link from 'next/link'
import './styles.css'
import ContactLink from './components/ContactLink'

export const metadata = {
  title: "Zac's Dev Blog",
  description: "tbh I haven't really thought this far",
}

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <html>
        <body>
          <div className="pageShell">
            <header className="siteHeader">
              <div className="container headerRow">
                <h1 className="logo">
                  <Link href="/">~/users/zac/articles</Link>
                </h1>

                <nav aria-label="Primary">
                  <ul className="nav">
                    <li>
                      <a href="https://zmorehouse.com" target="_blank" rel="noopener noreferrer">
                        ./portfolio
                      </a>
                    </li>

                    <ContactLink />
                  </ul>
                </nav>
              </div>
            </header>
            <div className="pageMain">{children}</div>
            <footer className="siteFooter">
              <div className="container footerInner">
                <div className="social">
                  <a
                    className="iconLink"
                    href="https://github.com/zmorehouse"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
                      <path
                        d="M12 2a10 10 0 0 0-3.16 19.48c.5.09.68-.22.68-.49v-1.7c-2.77.61-3.36-1.37-3.36-1.37-.45-1.18-1.1-1.49-1.1-1.49-.9-.63.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.9 1.56 2.35 1.11 2.9.85.09-.66.34-1.11.62-1.36-2.22-.26-4.55-1.14-4.55-5.06 0-1.12.38-2.04 1.02-2.76-.1-.26-.44-1.3.1-2.71 0 0 .84-.27 2.75 1.06.8-.22 1.64-.34 2.5-.34.86 0 1.7.12 2.5.34 1.9-1.33 2.74-1.06 2.74-1.06.55 1.41.2 2.45.1 2.71.64.72 1.02 1.64 1.02 2.76 0 3.93-2.34 4.8-4.57 5.06.35.31.67.93.67 1.89v2.21c0 .27.18.6.69.49A10 10 0 0 0 12 2Z"
                        fill="currentColor"
                      />
                    </svg>
                  </a>

                  <a
                    className="iconLink"
                    href="https://linkedin.com/in/your-handle"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
                      <rect x="4" y="9" width="3.5" height="11" fill="currentColor" />
                      <circle cx="5.75" cy="5.5" r="1.75" fill="currentColor" />
                      <path
                        d="M11 9h3.2v1.7h.05c.45-.85 1.55-1.75 3.2-1.7 3.42.1 3.55 3.07 3.55 5.1V20H17.8v-5c0-1.2-.02-2.75-1.75-2.75-1.75 0-2.02 1.3-2.02 2.66V20H11V9Z"
                        fill="currentColor"
                      />
                    </svg>
                  </a>
                </div>

                <div className="footerTagline">click around, it&apos;s good for you.</div>
              </div>
            </footer>
          </div>
        </body>
      </html>
    </>
  )
}
