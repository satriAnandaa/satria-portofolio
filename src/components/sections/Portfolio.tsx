import Image from 'next/image'
import Link from 'next/link'
import type { Content, Project, Section, Media } from '@/lib/content'
import { section, optionalSectionEnabled } from '@/lib/content'
import { Header } from '../layout/Header'
import { Arrow, Spark, WorkIcon } from '../ui/Design'
import { ProjectVisual } from './ProjectVisual'
import { ScrollEffects } from '../ui/ScrollEffects'
import { PointerEffects } from '../ui/PointerEffects'
import { MotionToggle } from '../ui/MotionToggle'
import { RoleTicker } from '../ui/RoleTicker'
import { ContactSection } from './ContactSection'
import { LabNotebook } from './LabNotebook'
import { Marquee } from './Marquee'
import { SiteFooter } from './SiteFooter'
import { Heading } from './SectionHeading'

export function mediaURL(file: Media | null | undefined, fallback: string) {
  if (!file || !file.url) return fallback
  return file.url
}
export function TextLink({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) {
  return (
    <Link className="text-link" href={href}>
      {children}
      <Arrow />
    </Link>
  )
}
export function Tags({ items }: { items?: { name: string }[] | null }) {
  return (
    <ul className="tags">
      {items?.map((item) => (
        <li key={item.name}>{item.name}</li>
      ))}
    </ul>
  )
}
const missing =
  'Belum diisi — tambahkan informasi dan bukti yang dapat diverifikasi.'
export function ProjectFields({ project }: { project: Project }) {
  return (
    <dl className="case-fields">
      {[
        ['Konteks / masalah', project.context],
        ['Kontribusi pribadi', project.contribution],
        ['Hasil & bukti', project.outcome],
        ...(project.limitations ? [['Keterbatasan', project.limitations]] : []),
      ].map(([label, value]) => (
        <div key={label}>
          <dt>{label}</dt>
          <dd className={!value ? 'fill-in' : ''}>{value || missing}</dd>
        </div>
      ))}
    </dl>
  )
}
export function ProjectLinks({ project }: { project: Project }) {
  return (
    <div className="flex flex-wrap gap-5">
      {project.demoURL && (
        <a
          className="text-link"
          href={project.demoURL}
          target="_blank"
          rel="noopener noreferrer"
        >
          Demo <Arrow />
        </a>
      )}
      {project.repositoryURL && (
        <a
          className="text-link"
          href={project.repositoryURL}
          target="_blank"
          rel="noopener noreferrer"
        >
          Repositori <Arrow />
        </a>
      )}
    </div>
  )
}
export function postDate(date: string) {
  if (!date || Number.isNaN(new Date(date).getTime()))
    return 'Tanggal belum diisi'
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Singapore',
  }).format(new Date(date))
}
export function Portfolio({ content }: { content: Content }) {
  const { profile, settings, projects, skills, steps, experiences, education } =
    content
  const visible = (key: string) => section(content, key).enabled
  const optionalVisible: Record<string, boolean> = {
    services: Boolean(
      optionalSectionEnabled(settings, 'services') && content.services.length,
    ),
    awards: Boolean(
      optionalSectionEnabled(settings, 'awards') && content.awards.length,
    ),
    testimonials: Boolean(
      optionalSectionEnabled(settings, 'testimonials') &&
      content.testimonials.length,
    ),
    pricing: Boolean(
      optionalSectionEnabled(settings, 'pricing') &&
      content.pricingPlans.length,
    ),
    blog: Boolean(
      optionalSectionEnabled(settings, 'blog') && content.posts.length,
    ),
  }
  const navigation =
    settings.navigation?.filter((item) =>
      item.target in optionalVisible
        ? optionalVisible[item.target]
        : visible(item.target),
    ) || []
  const extras = Object.entries(optionalVisible)
    .filter(([, enabled]) => enabled)
    .map(([target]) => ({
      target,
      label: (
        {
          services: 'Layanan',
          awards: 'Penghargaan',
          testimonials: 'Testimoni',
          pricing: 'Paket harga',
          blog: 'Blog',
        } as Record<string, string>
      )[target],
    }))
    .filter((item) => !navigation.some((link) => link.target === item.target))
  const optionalHeading = (
    key: string,
    title: string,
    accent: string,
    eyebrow: string,
  ): Section => {
    const saved = settings.sections?.find((item) => item.key === key)
    return { key, title, accent, eyebrow, ...saved }
  }
  const names = profile.name.trim().split(' ')
  const roles = profile.career
    .split(/\s*\/\s*/)
    .map((role) => role.trim())
    .filter(Boolean)
  const mainCV = profile.resumePDF?.url
    ? mediaURL(profile.resumePDF, '/cv')
    : '/cv'
  const cvLabel =
    settings.appearance?.primaryLabel ||
    (profile.resumePDF?.url ? 'Download CV' : 'Lihat CV')
  const socials = profile.socialLinks || []
  const contactHref = visible('contact')
    ? '#contact'
    : 'mailto:' + profile.email
  const nextSection = [
    'about',
    'skills',
    'projects',
    'process',
    'contact',
  ].find(visible)
  return (
    <>
      <Header name={profile.name} navigation={navigation} extras={extras} />
      <ScrollEffects />
      <PointerEffects />
      <MotionToggle />
      <main id="main-content">
        <section className="hero" id="home" aria-labelledby="hero-title">
          <div className="hero-contours" aria-hidden="true" />
          {settings.appearance?.socialRail !== false && (
            <aside className="hero-socials" aria-label="Media sosial">
              {socials.slice(0, 3).map((link) => (
                <a
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {link.label}
                </a>
              ))}
            </aside>
          )}
          <div className="hero-content container">
            <p className="hero-greeting">
              <Spark />
              {settings.heroGreeting || 'Halo, saya'}
            </p>
            <h1 id="hero-title">
              {names[0]}{' '}
              <span className="outline-text">{names.slice(1).join(' ')}</span>
              <span className="sr-only"> — {profile.career}</span>
            </h1>
            <RoleTicker roles={roles} />
            <p className="hero-description">{settings.heroDescription}</p>
            <div className="hero-actions">
              <Link className="button" href={mainCV}>
                {cvLabel}
                <Arrow />
              </Link>
              {visible('projects') && (
                <a className="hero-secondary" href="#projects">
                  <span className="circle-action">
                    <Arrow />
                  </span>
                  {settings.appearance?.secondaryLabel || 'Jelajahi karya'}
                </a>
              )}
            </div>
            <p className="hero-location">
              <span className="status-dot" />
              {profile.location}
              <span className="hero-location-separator">/</span>Data · Code ·
              Clarity
            </p>
          </div>
          <a
            className="hero-down"
            href={nextSection ? '#' + nextSection : '#main-content'}
            aria-label="Jelajahi bagian berikutnya"
          >
            <Arrow />
          </a>
          <Spark className="hero-star" />
        </section>
        <Marquee items={[...roles, ...roles]} />

        {visible('about') && (
          <section
            className="section about-section"
            id="about"
            aria-label="Tentang saya"
          >
            <div className="container">
              <div className="about-intro">
                <div>
                  <p className="eyebrow">
                    <Spark />
                    Tentang saya
                  </p>
                  <h2>
                    {settings.heroTitle?.split('\n').join(' ')}{' '}
                    <em>{settings.heroAccent}</em>
                  </h2>
                </div>
                <div>
                  <p>{profile.bio?.split('\n\n')[0]}</p>
                  <div className="mt-8">
                    <TextLink href="/cv">Kenali saya lebih dekat</TextLink>
                  </div>
                </div>
              </div>
              <div className="focus-grid">
                {skills.slice(0, 3).map((skill, i) => (
                  <a
                    className="focus-card"
                    href={visible('skills') ? '#skills' : '/cv'}
                    key={skill.id}
                  >
                    <span className="focus-index">0{i + 1}</span>
                    <WorkIcon kind={['data', 'code', 'web'][i]} />
                    <h3>{skill.title}</h3>
                    <p>{skill.items?.map((item) => item.name).join(' / ')}</p>
                    <Arrow />
                  </a>
                ))}
              </div>
              <div className="profile-story">
                <figure className="profile-visual">
                  <div className="profile-image">
                    <Image
                      src={mediaURL(profile.photo, '/assets/images/about.png')}
                      alt={profile.photo?.alt || 'Potret ' + profile.name}
                      width={454}
                      height={549}
                      unoptimized={Boolean(profile.photo)}
                    />
                  </div>
                  <figcaption>
                    {profile.name}
                    <span>{profile.location}</span>
                  </figcaption>
                </figure>
                <div>
                  <Heading data={section(content, 'about')} />
                  {profile.bio
                    ?.split('\n\n')
                    .slice(1)
                    .map((paragraph, i) => (
                      <p className="mb-5" key={i}>
                        {paragraph}
                      </p>
                    ))}
                  <dl className="profile-facts">
                    <div>
                      <dt>Lokasi</dt>
                      <dd>{profile.location}</dd>
                    </div>
                    <div>
                      <dt>Pendidikan</dt>
                      <dd>
                        {education.map((item) => item.title).join(', ') ||
                          'Belum diisi'}
                      </dd>
                    </div>
                    <div>
                      <dt>Arah karier</dt>
                      <dd>{profile.career}</dd>
                    </div>
                  </dl>
                  <Link className="button button-outline" href="/cv">
                    Profil & CV <Arrow />
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}

        {optionalVisible.services && (
          <section
            className="section tinted"
            id="services"
            aria-label="Layanan"
          >
            <div className="container">
              <Heading
                centered
                data={optionalHeading(
                  'services',
                  'Dari kebutuhan ke',
                  'solusi.',
                  'Layanan',
                )}
              />
              <div className="service-list">
                {content.services.map((service, i) => (
                  <details className="service-row" key={service.id}>
                    <summary>
                      <span className="service-number">0{i + 1}</span>
                      <h3>{service.title}</h3>
                      <p>{service.summary}</p>
                      <span className="circle-action">
                        <Arrow />
                      </span>
                    </summary>
                    <div className="service-body">
                      <WorkIcon kind={service.icon || 'code'} />
                      <p>{service.description || service.summary}</p>
                      <Tags items={service.items} />
                      <a className="text-link" href={contactHref}>
                        Diskusikan kebutuhan <Arrow />
                      </a>
                    </div>
                  </details>
                ))}
              </div>
            </div>
          </section>
        )}

        {visible('skills') && (
          <section
            className="section skills-section"
            id="skills"
            aria-label="Keahlian"
          >
            <div className="container">
              <Heading centered data={section(content, 'skills')} />
              <div className="skill-grid">
                {skills.map((group, i) => (
                  <article className="skill-card" key={group.id}>
                    <span className="skill-icon">
                      <WorkIcon
                        kind={['data', 'code', 'web', 'design'][i % 4]}
                      />
                    </span>
                    <h3>{group.title}</h3>
                    <p>{group.description}</p>
                    <Tags items={group.items} />
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}
        {visible('skills') && (
          <div className="container notebook-wrap">
            <LabNotebook settings={settings} />
          </div>
        )}

        {visible('projects') && (
          <section
            className="section projects-section"
            id="projects"
            aria-label="Catatan proyek"
          >
            <div className="container">
              <div className="projects-heading">
                <Heading data={section(content, 'projects')} />
                <a className="button button-light" href="#project-grid">
                  Lihat semua karya <Arrow />
                </a>
              </div>
              <div className="project-grid" id="project-grid">
                {projects.map((project, i) => (
                  <article
                    className={
                      'project-card ' +
                      (projects.length % 2 === 1 && i === projects.length - 1
                        ? 'project-card--wide'
                        : '')
                    }
                    key={project.id}
                    id={'project-' + project.slug}
                  >
                    <Link
                      className="project-cover"
                      href={'/projects/' + project.slug}
                      aria-label={'Lihat ' + project.title}
                    >
                      {project.cover?.url ? (
                        <Image
                          src={mediaURL(project.cover, '')}
                          alt={project.cover.alt || project.title}
                          width={1000}
                          height={650}
                          unoptimized
                        />
                      ) : (
                        <ProjectVisual project={project} />
                      )}
                      <span className="project-cover-index">
                        0{i + 1} /{' '}
                        {project.stage === 'concept'
                          ? 'KONSEP'
                          : project.stage === 'completed'
                            ? 'SELESAI'
                            : 'DALAM PENGERJAAN'}
                      </span>
                    </Link>
                    <div className="project-card-heading">
                      <div>
                        <p>{project.category}</p>
                        <h3>
                          <Link href={'/projects/' + project.slug}>
                            {project.title}
                          </Link>
                        </h3>
                      </div>
                      <Link
                        className="circle-action"
                        href={'/projects/' + project.slug}
                        aria-label={'Detail ' + project.title}
                      >
                        <Arrow />
                      </Link>
                    </div>
                    <p className="project-summary">{project.summary}</p>
                    <Tags items={project.technologies} />
                    <details className="case-details">
                      <summary>
                        Catatan & kontribusi <span aria-hidden="true">+</span>
                      </summary>
                      <ProjectFields project={project} />
                      <div className="mt-5">
                        <ProjectLinks project={project} />
                      </div>
                    </details>
                  </article>
                ))}
              </div>
              {!projects.length && <p>Belum ada karya yang dipublikasikan.</p>}
              <p className="project-note">
                Konsep diberi label secara jelas. Informasi kontribusi dan hasil
                yang belum tersedia ditandai untuk dilengkapi.
              </p>
            </div>
          </section>
        )}

        {visible('about') && (
          <section
            className="section tinted experience-section"
            id="experience"
            aria-label="Pengalaman dan pendidikan"
          >
            <div className="container">
              <Heading
                centered
                data={{
                  key: 'experience',
                  eyebrow: 'Pengalaman',
                  title: 'Langkah kecil.',
                  accent: 'Fondasi yang terus tumbuh.',
                }}
              />
              <ol className="experience-table">
                {experiences.map((item) => (
                  <li key={item.id}>
                    <div className="experience-period">
                      {item.period}
                      <span>{item.kind}</span>
                    </div>
                    <div>
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
                      {item.contribution && <p>{item.contribution}</p>}
                      {item.evidenceURL && (
                        <a
                          className="text-link"
                          href={item.evidenceURL}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Lihat bukti <Arrow />
                        </a>
                      )}
                    </div>
                    <div className="experience-institution">
                      {item.institution || (
                        <span className="fill-in">
                          Institusi belum dicantumkan
                        </span>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
              <div className="education-grid">
                {education.map((item) => (
                  <article key={item.id}>
                    <span className="eyebrow">Pendidikan</span>
                    <h3>{item.title}</h3>
                    <p className={!item.institution ? 'fill-in' : ''}>
                      {item.institution ||
                        'Institusi dan periode belum dicantumkan.'}{' '}
                      {item.period || ''}
                    </p>
                    {item.educationStatus && <p>{item.educationStatus}</p>}
                  </article>
                ))}
              </div>
              <div className="technology-strip">
                {skills
                  .flatMap((group) => group.items || [])
                  .map((item) => (
                    <span key={item.name}>
                      {item.name}
                      <Spark />
                    </span>
                  ))}
              </div>
            </div>
          </section>
        )}

        {visible('process') && (
          <section
            className="section process-section"
            id="process"
            aria-label="Kerangka kerja"
          >
            <div className="container">
              <Heading centered data={section(content, 'process')} />
              <ol className="process-grid">
                {steps.map((step, i) => (
                  <li key={step.id}>
                    <span className="process-number">0{i + 1}</span>
                    <h3>{step.title}</h3>
                    <p>{step.description}</p>
                    <span className="process-label">{step.label}</span>
                  </li>
                ))}
              </ol>
            </div>
          </section>
        )}

        {optionalVisible.awards && (
          <section
            className="section awards-section"
            id="awards"
            aria-label="Penghargaan"
          >
            <div className="container awards-layout">
              <Heading
                data={optionalHeading(
                  'awards',
                  'Penghargaan &',
                  'pengakuan.',
                  'Pencapaian',
                )}
              />
              <div className="award-grid">
                {content.awards.map((award) => (
                  <article className="award-card" key={award.id}>
                    <span className="award-symbol">
                      <Spark />
                    </span>
                    <div>
                      <h3>{award.title}</h3>
                      <p>
                        {award.issuer}
                        {award.date ? ' / ' + postDate(award.date) : ''}
                      </p>
                      {award.description && <p>{award.description}</p>}
                      {award.evidenceURL && (
                        <a
                          className="text-link"
                          href={award.evidenceURL}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Lihat bukti <Arrow />
                        </a>
                      )}
                    </div>
                    {award.logo?.url && (
                      <Image
                        src={mediaURL(award.logo, '')}
                        alt={award.logo.alt || award.issuer}
                        width={60}
                        height={60}
                        unoptimized
                      />
                    )}
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        {optionalVisible.pricing && (
          <section
            className="section tinted"
            id="pricing"
            aria-label="Paket harga"
          >
            <div className="container">
              <Heading
                centered
                data={optionalHeading(
                  'pricing',
                  'Pilihan untuk',
                  'ide Anda.',
                  'Paket harga',
                )}
              />
              <div className="pricing-grid">
                {content.pricingPlans.map((plan) => (
                  <article
                    className={
                      'pricing-card ' + (plan.featured ? 'is-featured' : '')
                    }
                    key={plan.id}
                  >
                    {plan.featured && (
                      <span className="plan-featured">Paket utama</span>
                    )}
                    <h3>{plan.title}</h3>
                    <p className="plan-price">
                      {plan.priceLabel}
                      <small>{plan.period}</small>
                    </p>
                    {plan.summary && <p>{plan.summary}</p>}
                    <ul>
                      {plan.features?.map((feature) => (
                        <li key={feature.name}>
                          <span aria-hidden="true">↗</span>
                          {feature.name}
                        </li>
                      ))}
                    </ul>
                    <a className="button button-outline" href={contactHref}>
                      {plan.ctaLabel || 'Diskusikan proyek'}
                      <Arrow />
                    </a>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        {optionalVisible.testimonials && (
          <section
            className="section testimonials-section"
            id="testimonials"
            aria-label="Testimoni"
          >
            <div className="container testimonials-layout">
              <Heading
                data={optionalHeading(
                  'testimonials',
                  'Dari mereka yang',
                  'berkolaborasi.',
                  'Testimoni',
                )}
              />
              <div className="testimonial-list">
                {content.testimonials.map((item) => (
                  <figure className="testimonial-card" key={item.id}>
                    <div className="testimonial-person">
                      {item.avatar?.url ? (
                        <Image
                          src={mediaURL(item.avatar, '')}
                          alt={item.avatar.alt || item.author}
                          width={60}
                          height={60}
                          unoptimized
                        />
                      ) : (
                        <span className="avatar-initial" aria-hidden="true">
                          {item.author?.slice(0, 1) || '?'}
                        </span>
                      )}
                      <figcaption>
                        <strong>{item.author}</strong>
                        <span>{item.role}</span>
                      </figcaption>
                    </div>
                    <blockquote>
                      <span aria-hidden="true">“</span>
                      {item.quote}
                    </blockquote>
                    {item.sourceURL && (
                      <a
                        className="text-link"
                        href={item.sourceURL}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Sumber testimoni <Arrow />
                      </a>
                    )}
                  </figure>
                ))}
              </div>
            </div>
          </section>
        )}

        {optionalVisible.blog && (
          <section
            className="section tinted"
            id="blog"
            aria-label="Artikel blog"
          >
            <div className="container">
              <Heading
                centered
                data={optionalHeading(
                  'blog',
                  'Catatan &',
                  'perspektif terbaru.',
                  'Blog',
                )}
              />
              <div className="blog-grid">
                {content.posts.slice(0, 3).map((post) => (
                  <article className="blog-card" key={post.id}>
                    <Link className="blog-cover" href={'/blog/' + post.slug}>
                      {post.cover?.url ? (
                        <Image
                          src={mediaURL(post.cover, '')}
                          alt={post.cover.alt || post.title}
                          width={800}
                          height={500}
                          unoptimized
                        />
                      ) : (
                        <span className="blog-placeholder">
                          <WorkIcon kind="data" />
                          <span>Notes / {post.category || 'Perspektif'}</span>
                        </span>
                      )}
                    </Link>
                    <div className="blog-card-body">
                      <p className="blog-meta">
                        <span>{post.category}</span>
                        {postDate(post.publishedDate)}
                      </p>
                      <h3>
                        <Link href={'/blog/' + post.slug}>{post.title}</Link>
                      </h3>
                      <p>{post.excerpt}</p>
                      <Link
                        className="circle-action"
                        href={'/blog/' + post.slug}
                        aria-label={'Baca ' + post.title}
                      >
                        <Arrow />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
              <div className="section-action">
                <Link className="button" href="/blog">
                  Semua artikel <Arrow />
                </Link>
              </div>
            </div>
          </section>
        )}

        {visible('contact') && (
          <ContactSection
            profile={profile}
            data={section(content, 'contact')}
          />
        )}

        {visible('about') && (
          <div className="container personal-note-wrap">
            <details className="personal-note">
              <summary>
                Catatan di luar layar <span aria-hidden="true">+</span>
              </summary>
              <figure>
                <Image
                  src={mediaURL(
                    profile.personalPhoto,
                    '/assets/images/hero.png',
                  )}
                  alt={
                    profile.personalPhoto?.alt ||
                    profile.name + ' di jalur alam dekat air terjun'
                  }
                  width={1200}
                  height={1600}
                  unoptimized={Boolean(profile.personalPhoto)}
                />
                <figcaption>{profile.personalCaption}</figcaption>
              </figure>
            </details>
          </div>
        )}
      </main>
      <SiteFooter
        profile={profile}
        settings={settings}
        navigation={navigation}
      />
    </>
  )
}
