import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getContent, optionalSectionEnabled } from '@/lib/content'
import { mediaURL, postDate } from '@/components/sections/Portfolio'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const content = await getContent()
  const post =
    optionalSectionEnabled(content.settings, 'blog') || content.preview
      ? content.posts.find((item) => item.slug === slug)
      : undefined
  return {
    title: post ? post.title + ' — Satria Ananda' : 'Artikel tidak ditemukan',
    description: post?.excerpt,
  }
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const { posts, settings, preview, profile } = await getContent()
  const post = posts.find((item) => item.slug === slug)
  if (!post || (!optionalSectionEnabled(settings, 'blog') && !preview))
    notFound()
  return (
    <main id="main-content" className="container section detail-page">
      <Link href="/blog" className="text-link">
        ← Semua artikel
      </Link>
      <p className="eyebrow mt-10">
        {post.category || 'Catatan'} / {postDate(post.publishedDate)}
      </p>
      <h1>{post.title}</h1>
      <p className="my-6">{post.excerpt}</p>
      {post.cover?.url && (
        <div className="detail-cover">
          <Image
            src={mediaURL(post.cover, '')}
            alt={post.cover.alt || post.title}
            width={1200}
            height={750}
            unoptimized
          />
        </div>
      )}
      <article className="article-body" aria-label={post.title}>
        {(post.body || 'Isi artikel belum diisi.')
          .split(/\n\s*\n/)
          .filter(Boolean)
          .map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
      </article>
      <Link
        href={
          settings.sections?.find((item) => item.key === 'contact')?.enabled
            ? '/#contact'
            : 'mailto:' + profile.email
        }
        className="button button-outline"
      >
        Hubungi Satria ↗
      </Link>
    </main>
  )
}
