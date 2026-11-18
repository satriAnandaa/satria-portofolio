import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getContent } from '@/lib/content'
import {
  ProjectFields,
  ProjectLinks,
  Tags,
  mediaURL,
} from '@/components/sections/Portfolio'
import { ProjectVisual } from '@/components/sections/ProjectVisual'
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const project = (await getContent()).projects.find(
    (item) => item.slug === slug,
  )
  return {
    title: project?.title
      ? project.title + ' — Satria Data Lab'
      : 'Proyek tidak ditemukan',
    description: project?.summary,
  }
}
export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const project = (await getContent()).projects.find(
    (item) => item.slug === slug,
  )
  if (!project) notFound()
  return (
    <main className="container section detail-page" id="main-content">
      <Link className="text-link mb-10" href="/#projects">
        ← Kembali ke catatan proyek
      </Link>
      <p className="eyebrow">
        {project.stage === 'concept'
          ? 'KONSEP'
          : project.stage === 'in-progress'
            ? 'DALAM PENGERJAAN'
            : 'SELESAI'}{' '}
        / {project.category}
      </p>
      <h1>{project.title}</h1>
      <p className="my-6">{project.summary}</p>
      <Tags items={project.technologies} />
      <div className="detail-cover">
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
      </div>
      <div className="mt-10 border-t border-line pt-5">
        <ProjectFields project={project} />
      </div>
      <div className="mt-8">
        <ProjectLinks project={project} />
      </div>
      {project.scope && <p className="mt-8 text-sm">{project.scope}</p>}
    </main>
  )
}
