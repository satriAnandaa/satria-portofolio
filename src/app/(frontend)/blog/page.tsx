import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getContent, optionalSectionEnabled } from '@/lib/content'
import { mediaURL, postDate } from '@/components/sections/Portfolio'
import { Arrow, WorkIcon } from '@/components/ui/Design'

export const metadata = { title: 'Catatan & perspektif — Satria Ananda' }

export default async function BlogPage() {
  const { settings, posts, preview } = await getContent()
  if (!optionalSectionEnabled(settings, 'blog') && !preview) notFound()
  return (
    <main id="main-content" className="container section">
      <Link className="text-link" href="/#blog">
        ← Kembali ke beranda
      </Link>
      <div className="section-heading mt-10">
        <div>
          <p className="eyebrow">Catatan / Blog</p>
          <h1 className="text-6xl">
            Ide, proses & <em>perspektif.</em>
          </h1>
        </div>
      </div>
      <div className="blog-grid">
        {posts.map((post) => (
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
              <h2 className="text-3xl">
                <Link href={'/blog/' + post.slug}>{post.title}</Link>
              </h2>
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
      {!posts.length && (
        <p>
          Belum ada artikel. Tambahkan dan publikasikan artikel melalui admin.
        </p>
      )}
    </main>
  )
}
