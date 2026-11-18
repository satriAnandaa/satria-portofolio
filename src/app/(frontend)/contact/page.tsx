import Link from 'next/link'
import { getContent, section } from '@/lib/content'
import { Header } from '@/components/layout/Header'
import { ContactSection } from '@/components/sections/ContactSection'
import { SiteFooter } from '@/components/sections/SiteFooter'
import { PointerEffects } from '@/components/ui/PointerEffects'
import { MotionToggle } from '@/components/ui/MotionToggle'
import { ScrollEffects } from '@/components/ui/ScrollEffects'
import { Spark } from '@/components/ui/Design'

export async function generateMetadata() {
  const { profile } = await getContent()
  return {
    title: 'Contact Me — ' + profile.name,
    description:
      'Hubungi ' +
      profile.name +
      ' untuk kesempatan kerja dan kolaborasi melalui kontak yang tercantum.',
  }
}

export default async function ContactPage() {
  const content = await getContent()
  const { profile, settings } = content
  const navigation =
    settings.navigation?.filter(
      (item) => section(content, item.target).enabled,
    ) || []
  const savedHeading = section(content, 'contact')
  return (
    <>
      <Header name={profile.name} navigation={navigation} />
      <PointerEffects />
      <MotionToggle />
      <ScrollEffects />
      <main id="main-content">
        <section
          className="page-hero"
          id="home"
          aria-labelledby="contact-title"
        >
          <div className="hero-contours" aria-hidden="true" />
          <Spark className="page-hero-spark" />
          <div className="container">
            <p className="eyebrow">LET’S CONNECT</p>
            <h1 id="contact-title">
              Contact <em>Me</em>
            </h1>
            <nav className="breadcrumbs" aria-label="Breadcrumb">
              <Link href="/">Beranda</Link>
              <span aria-hidden="true">›</span>
              <span aria-current="page">Contact Me</span>
            </nav>
          </div>
        </section>
        <ContactSection
          profile={profile}
          data={{
            ...savedHeading,
            title: savedHeading.title || 'Mari mulai',
            accent: savedHeading.accent || 'percakapan.',
          }}
        />
      </main>
      <SiteFooter
        profile={profile}
        settings={settings}
        navigation={navigation}
      />
    </>
  )
}
