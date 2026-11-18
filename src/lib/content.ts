import 'server-only'
import { cache } from 'react'
import { draftMode, headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'

export type Media = {
  id: number
  url?: string | null
  alt?: string | null
  mimeType?: string | null
}
export type Project = {
  id: number
  title: string
  slug: string
  stage: string
  category: string
  summary: string
  context?: string | null
  contribution?: string | null
  outcome?: string | null
  limitations?: string | null
  scope?: string | null
  cover?: Media | null
  technologies?: { name: string }[] | null
  demoURL?: string | null
  repositoryURL?: string | null
  featured?: boolean
}
export type Skill = {
  id: number
  title: string
  description: string
  items?: { name: string }[]
  mark?: string
}
export type Experience = {
  id: number
  title: string
  period: string
  kind: string
  description: string
  institution?: string
  contribution?: string
  evidenceURL?: string
}
export type Education = {
  id: number
  title: string
  institution?: string
  period?: string
  educationStatus?: string
}
export type Step = {
  id: number
  title: string
  label: string
  description: string
}
export type Service = {
  id: number
  title: string
  summary: string
  description?: string
  icon?: string
  items?: { name: string }[]
}
export type Award = {
  id: number
  title: string
  issuer: string
  date?: string
  description?: string
  evidenceURL?: string
  logo?: Media | null
}
export type Testimonial = {
  id: number
  title: string
  author: string
  role?: string
  quote: string
  avatar?: Media | null
  sourceURL?: string
}
export type PricingPlan = {
  id: number
  title: string
  priceLabel: string
  period?: string
  summary?: string
  featured?: boolean
  ctaLabel?: string
  features?: { name: string }[]
}
export type Post = {
  id: number
  title: string
  slug: string
  category?: string
  excerpt: string
  body: string
  publishedDate: string
  cover?: Media | null
}
export type Profile = {
  imported?: boolean
  name: string
  location: string
  career: string
  bio?: string
  email: string
  phone?: string
  photo?: Media | null
  personalPhoto?: Media | null
  personalCaption?: string
  resumePDF?: Media | null
  socialLinks?: { label: string; url: string }[]
}
export type Section = {
  key: string
  eyebrow?: string
  title?: string
  accent?: string
  description?: string
  enabled?: boolean
}
export type Settings = {
  imported?: boolean
  siteTitle: string
  description?: string
  heroGreeting?: string
  heroTitle?: string
  heroAccent?: string
  heroDescription?: string
  notebookTitle?: string
  query?: string
  queryNote?: string
  footerNote?: string
  navigation?: { label: string; target: string }[]
  sections?: Section[]
  appearance?: {
    accent?: 'lime' | 'mint' | 'amber'
    socialRail?: boolean
    primaryLabel?: string
    secondaryLabel?: string
    footerHeadline?: string
  }
  optionalSections?: {
    services?: boolean
    awards?: boolean
    pricing?: boolean
    testimonials?: boolean
    blog?: boolean
  }
}
export type Content = {
  profile: Profile
  settings: Settings
  projects: Project[]
  skills: Skill[]
  experiences: Experience[]
  education: Education[]
  steps: Step[]
  preview: boolean
  services: Service[]
  awards: Award[]
  testimonials: Testimonial[]
  pricingPlans: PricingPlan[]
  posts: Post[]
}

export const getContent = cache(async (): Promise<Content> => {
  const payload = await getPayload({ config })
  const preview = (await draftMode()).isEnabled
  const user = preview
    ? (await payload.auth({ headers: await headers() })).user
    : undefined
  if (preview && !user) redirect('/admin/login')
  const access = { overrideAccess: false, user, draft: preview }
  const find = (
    collection:
      | 'projects'
      | 'skills'
      | 'experiences'
      | 'education'
      | 'process-steps'
      | 'services'
      | 'awards'
      | 'testimonials'
      | 'pricing-plans'
      | 'posts',
  ) =>
    payload.find({
      collection,
      ...access,
      pagination: false,
      depth: 1,
      sort: 'order',
      where: { archived: { not_equals: true } },
    })
  const [
    profile,
    settings,
    projects,
    skills,
    experiences,
    education,
    steps,
    services,
    awards,
    testimonials,
    pricingPlans,
    posts,
  ] = await Promise.all([
    payload.findGlobal({ slug: 'profile', ...access, depth: 1 }),
    payload.findGlobal({ slug: 'site-settings', ...access, depth: 1 }),
    find('projects'),
    find('skills'),
    find('experiences'),
    find('education'),
    find('process-steps'),
    find('services'),
    find('awards'),
    find('testimonials'),
    find('pricing-plans'),
    find('posts'),
  ])
  return {
    profile,
    settings,
    projects: projects.docs,
    skills: skills.docs,
    experiences: experiences.docs,
    education: education.docs,
    steps: steps.docs,
    services: services.docs,
    awards: awards.docs,
    testimonials: testimonials.docs,
    pricingPlans: pricingPlans.docs,
    posts: posts.docs,
    preview,
  } as unknown as Content
})

export function optionalSectionEnabled(
  settings: Settings,
  key: keyof NonNullable<Settings['optionalSections']>,
) {
  return Boolean(
    settings.optionalSections?.[key] &&
    settings.sections?.find((item) => item.key === key)?.enabled !== false,
  )
}

export function section(content: Content, key: string): Section {
  return (
    content.settings.sections?.find((item) => item.key === key) || {
      key,
      enabled: false,
    }
  )
}
