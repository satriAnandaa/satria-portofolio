import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'
import { headers } from 'next/headers'

const optionalMenus = [
  { slug: 'services', label: 'Layanan' },
  { slug: 'awards', label: 'Penghargaan' },
  { slug: 'testimonials', label: 'Testimoni' },
  { slug: 'pricing-plans', label: 'Paket harga' },
  { slug: 'posts', label: 'Artikel blog' },
] as const

export async function Welcome() {
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: await headers() })
  if (!user) return null
  const access = { overrideAccess: false, user }
  const [projects, media, optionalCounts] = await Promise.all([
    payload.find({
      collection: 'projects',
      pagination: false,
      ...access,
      draft: true,
    }),
    payload.count({ collection: 'media', ...access }),
    Promise.all(
      optionalMenus.map(async (menu) => ({
        ...menu,
        ...(await payload.count({ collection: menu.slug, ...access })),
      })),
    ),
  ])
  const incomplete = projects.docs.filter(
    (project) => !project.contribution || !project.outcome,
  )
  const published = projects.docs.filter(
    (project) => project._status === 'published' && !project.archived,
  ).length
  return (
    <section className="studio-welcome">
      <div className="studio-welcome-heading">
        <div>
          <span className="studio-kicker">SATRIA / CONTENT STUDIO</span>
          <h2>Karya yang terus berkembang.</h2>
          <p>
            Kelola profil, karya, dan cerita Anda. Simpan draft untuk meninjau
            perubahan, lalu publikasikan saat siap dibagikan.
          </p>
        </div>
      </div>
      <div className="studio-actions">
        <Link href="/" target="_blank">
          Buka website ↗
        </Link>
        <Link href="/preview?path=/" target="_blank" prefetch={false}>
          Preview draft ↗
        </Link>
        <Link href="/admin/globals/profile">Profil & CV</Link>
        <Link href="/admin/globals/site-settings">
          Tampilan & bagian halaman
        </Link>
      </div>
      <div className="studio-counts">
        <Link href="/admin/collections/projects">
          <strong>{projects.totalDocs}</strong>
          <span>Catatan proyek</span>
        </Link>
        <Link href="/admin/collections/projects">
          <strong>{published}</strong>
          <span>Proyek berstatus publik</span>
        </Link>
        <Link href="/admin/collections/media">
          <strong>{media.totalDocs}</strong>
          <span>Berkas media</span>
        </Link>
      </div>
      <h3>Ruang untuk cerita berikutnya.</h3>
      <p>
        Bagian opsional dimulai kosong. Tambahkan konten asli, publikasikan,
        kemudian aktifkan bagiannya di Situs & beranda → Bagian opsional.
      </p>
      <div className="studio-optional">
        {optionalCounts.map((menu) => (
          <Link key={menu.slug} href={'/admin/collections/' + menu.slug}>
            <strong>{menu.label}</strong>
            <span>
              {menu.totalDocs
                ? menu.totalDocs + ' konten tersimpan'
                : 'KOSONG / SIAP DIISI'}{' '}
              ↗
            </span>
          </Link>
        ))}
      </div>
      <div className="studio-checklist">
        <h3>Lengkapi sebelum dibagikan.</h3>
        {incomplete.length ? (
          <ul>
            {incomplete.map((project) => (
              <li key={project.id}>
                <Link href={'/admin/collections/projects/' + project.id}>
                  {project.title}
                </Link>{' '}
                — lengkapi{' '}
                {[
                  !project.contribution && 'kontribusi pribadi',
                  !project.outcome && 'hasil dan bukti',
                ]
                  .filter(Boolean)
                  .join(' serta ')}
                .
              </li>
            ))}
          </ul>
        ) : (
          <p>
            Semua proyek memiliki uraian kontribusi dan hasil. Periksa kembali
            bukti sebelum publikasi.
          </p>
        )}
        <p>
          Unggahan awal bersifat privat. Pilih visibilitas Publik untuk gambar
          dan PDF yang siap ditampilkan. CV menggunakan data profil yang sama
          dengan beranda.
        </p>
      </div>
    </section>
  )
}
