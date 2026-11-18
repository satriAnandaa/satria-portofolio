import type { Profile, Settings } from '@/lib/content'
import { Arrow, BrandMark } from '../ui/Design'
import { Marquee } from './Marquee'

export function SiteFooter({
  profile,
  settings,
  navigation,
}: {
  profile: Profile
  settings: Settings
  navigation: { label: string; target: string }[]
}) {
  return (
    <footer className="site-footer">
      <Marquee
        footer
        items={[
          settings.appearance?.footerHeadline ||
            'Punya ide? Mari berkolaborasi.',
          settings.appearance?.footerHeadline ||
            'Punya ide? Mari berkolaborasi.',
        ]}
      />
      <div className="container footer-main">
        <a className="brand footer-brand" href="/#home">
          <BrandMark />
          <span>
            {profile.name.split(' ')[0]}
            <b>.</b>
          </span>
        </a>
        <nav aria-label="Navigasi footer">
          {navigation.map((item) => (
            <a key={item.target} href={'/#' + item.target}>
              {item.label}
            </a>
          ))}
        </nav>
        <div className="footer-socials">
          {profile.socialLinks?.map((link) => (
            <a
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {link.label}
              <Arrow />
            </a>
          ))}
        </div>
        <div className="footer-bottom">
          <p>
            © {new Date().getFullYear()} {profile.name}
          </p>
          <span>{settings.footerNote}</span>
          <a href="#home">Kembali ke atas ↑</a>
        </div>
      </div>
    </footer>
  )
}
