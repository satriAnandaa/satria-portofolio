import type { Viewport } from 'next'
import './globals.css'
import { getContent } from '@/lib/content'
export const dynamic = 'force-dynamic'
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#080908',
}
export async function generateMetadata() {
  const { settings } = await getContent()
  return {
    title: settings.siteTitle || 'Satria Data Lab',
    description: settings.description,
    icons: { icon: '/assets/favicon.svg' },
  }
}
const themeScript =
  "(function(){try{var t=localStorage.getItem('satria-theme');document.documentElement.dataset.theme=t==='light'||t==='dark'?t:matchMedia('(prefers-color-scheme:light)').matches?'light':'dark';document.documentElement.dataset.motion=localStorage.getItem('satria-motion')==='paused'?'paused':'playing'}catch(e){document.documentElement.dataset.theme=matchMedia('(prefers-color-scheme:light)').matches?'light':'dark'}})()"
export default async function FrontendLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { preview, settings } = await getContent()
  return (
    <html
      lang="id"
      data-accent={settings.appearance?.accent || 'lime'}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <a className="skip-link" href="#main-content">
          Lewati ke konten utama
        </a>
        {preview && (
          <aside className="preview-banner">
            PREVIEW DRAFT — hanya terlihat oleh admin.{' '}
            <a href="/preview/exit">Keluar dari preview ↗</a>
          </aside>
        )}
        {children}
      </body>
    </html>
  )
}
