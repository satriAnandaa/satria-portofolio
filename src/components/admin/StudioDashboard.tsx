import Link from "next/link";

export const optionalMenus = [
  {
    slug: "services",
    label: "Layanan",
    description: "Jelaskan layanan yang Anda tawarkan.",
  },
  {
    slug: "awards",
    label: "Penghargaan",
    description: "Catat pencapaian beserta buktinya.",
  },
  {
    slug: "testimonials",
    label: "Testimoni",
    description: "Bagikan ulasan asli dari klien atau rekan.",
  },
  {
    slug: "pricing-plans",
    label: "Paket harga",
    description: "Susun harga dan cakupan layanan.",
  },
  {
    slug: "posts",
    label: "Artikel blog",
    description: "Tulis cerita, wawasan, atau studi kasus.",
  },
] as const;

const mainMenus = [
  {
    href: "/admin/globals/profile",
    icon: "person",
    label: "Profil & CV",
    description: "Nama, foto, bio, kontak, dan dokumen CV.",
    action: "Edit profil",
  },
  {
    href: "/admin/collections/projects",
    icon: "folder",
    label: "Proyek",
    description: "Karya, gambar, teknologi, dan hasil pekerjaan.",
    action: "Kelola proyek",
  },
  {
    href: "/admin/collections/media",
    icon: "image",
    label: "Pustaka media",
    description: "Kumpulan gambar dan PDF untuk website.",
    action: "Kelola berkas",
  },
  {
    href: "/admin/globals/site-settings",
    icon: "settings",
    label: "Tampilan website",
    description: "Judul, warna, dan bagian yang ditampilkan.",
    action: "Atur tampilan",
  },
] as const;

function Icon({ name }: { name: string }) {
  const paths: Record<string, React.ReactNode> = {
    person: (
      <>
        <circle cx="12" cy="8" r="3" />
        <path d="M5 21v-3a7 7 0 0 1 14 0v3" />
      </>
    ),
    folder: (
      <path d="M3 7V5a2 2 0 0 1 2-2h5l3 4h6a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z" />
    ),
    image: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="3" />
        <circle cx="8" cy="8" r="1" />
        <path d="m3 17 6-6 4 4 3-3 5 5" />
      </>
    ),
    settings: (
      <>
        <path d="M4 6h16M4 12h16M4 18h16" />
        <circle cx="8" cy="6" r="2" />
        <circle cx="16" cy="12" r="2" />
        <circle cx="10" cy="18" r="2" />
      </>
    ),
    arrow: <path d="M5 12h14m-6-6 6 6-6 6" />,
  };
  return (
    <svg
      className="studio-svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name] || paths.arrow}
    </svg>
  );
}

type Props = {
  projectCount: number;
  publishedCount: number;
  mediaCount: number;
  incomplete: { id: string | number; title: string; missing: string }[];
  optionalCounts: {
    slug: string;
    label: string;
    description: string;
    totalDocs: number;
  }[];
};

export function StudioDashboard({
  projectCount,
  publishedCount,
  mediaCount,
  incomplete,
  optionalCounts,
}: Props) {
  return (
    <main className="studio-dashboard">
      <header className="studio-page-heading">
        <div>
          <span className="studio-kicker">RUANG KERJA ANDA</span>
          <h1>Kelola portofolio.</h1>
          <p>Semua yang Anda perlukan untuk menjaga website tetap terbarui.</p>
        </div>
        <Link
          className="studio-button studio-button-secondary"
          href="/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Lihat website <span aria-hidden="true">↗</span>
        </Link>
      </header>
      <section className="studio-banner" aria-labelledby="studio-start">
        <div>
          <span className="studio-pill">MULAI DI SINI</span>
          <h2 id="studio-start">Karya baru, cerita baru.</h2>
          <p>
            Tambahkan proyek dan ceritakan prosesnya. Anda bisa menyimpan draf
            sebelum menerbitkannya.
          </p>
        </div>
        <Link
          className="studio-button studio-button-primary"
          href="/admin/collections/projects/create"
        >
          <span aria-hidden="true">＋</span> Tambah proyek
        </Link>
      </section>
      <section className="studio-stats" aria-label="Ringkasan konten">
        {[
          {
            count: projectCount,
            label: "Total proyek",
            detail: "Termasuk draf dan arsip",
            href: "/admin/collections/projects",
          },
          {
            count: publishedCount,
            label: "Proyek terbit",
            detail: "Berstatus terbit, bukan arsip",
            href: "/admin/collections/projects",
          },
          {
            count: mediaCount,
            label: "Berkas media",
            detail: "Gambar dan dokumen tersimpan",
            href: "/admin/collections/media",
          },
        ].map((stat) => (
          <Link key={stat.label} href={stat.href} className="studio-stat">
            <span>{stat.label}</span>
            <strong>{stat.count}</strong>
            <small>{stat.detail}</small>
            <span className="studio-stat-arrow" aria-hidden="true">
              ↗
            </span>
          </Link>
        ))}
      </section>
      <div className="studio-workspace">
        <div className="studio-main-column">
          <section aria-labelledby="studio-manage">
            <div className="studio-section-heading">
              <h2 id="studio-manage">Apa yang ingin Anda ubah?</h2>
              <span>Menu utama</span>
            </div>
            <div className="studio-menu-grid">
              {mainMenus.map((menu) => (
                <Link
                  className="studio-menu-card"
                  href={menu.href}
                  key={menu.label}
                >
                  <span className="studio-menu-icon">
                    <Icon name={menu.icon} />
                  </span>
                  <h3>{menu.label}</h3>
                  <p>{menu.description}</p>
                  <span className="studio-card-action">
                    {menu.action}
                    <Icon name="arrow" />
                  </span>
                </Link>
              ))}
            </div>
          </section>
          <section className="studio-panel" aria-labelledby="studio-career">
            <div className="studio-section-heading">
              <h2 id="studio-career">Keahlian & perjalanan</h2>
            </div>
            <p className="studio-muted">
              Lengkapi informasi pendukung profil dan CV Anda.
            </p>
            <div className="studio-compact-links">
              {[
                ["skills", "Keahlian", "Teknologi dan kemampuan"],
                ["experiences", "Pengalaman", "Peran dan kontribusi"],
                ["education", "Pendidikan", "Institusi dan periode"],
                [
                  "process-steps",
                  "Proses kerja",
                  "Langkah dalam mengerjakan proyek",
                ],
              ].map(([slug, label, description]) => (
                <Link href={"/admin/collections/" + slug} key={slug}>
                  <span>
                    <strong>{label}</strong>
                    <small>{description}</small>
                  </span>
                  <Icon name="arrow" />
                </Link>
              ))}
            </div>
          </section>
        </div>
        <aside
          className="studio-side-column"
          aria-label="Panduan mengelola konten"
        >
          <section className="studio-panel studio-guide">
            <span className="studio-kicker">PANDUAN SINGKAT</span>
            <h2>Dari draf ke website</h2>
            <ol>
              <li>
                <strong>Isi atau edit konten</strong>
                <p>Mulai dari profil, proyek, atau media.</p>
              </li>
              <li>
                <strong>Simpan sebagai draf</strong>
                <p>Perubahan disimpan untuk ditinjau terlebih dahulu.</p>
              </li>
              <li>
                <strong>Periksa, lalu terbitkan</strong>
                <p>
                  Setelah siap, pilih Terbitkan agar perubahan tampil di
                  website.
                </p>
              </li>
            </ol>
            <Link
              className="studio-text-link"
              href="/preview?path=/"
              target="_blank"
              rel="noopener noreferrer"
              prefetch={false}
            >
              Pratinjau draf <span aria-hidden="true">↗</span>
            </Link>
          </section>
          <section className="studio-panel studio-media-help">
            <Icon name="image" />
            <h2>Ingin mengganti foto?</h2>
            <p>
              Unggah berkas di Pustaka media, isi deskripsi gambar, lalu pilih
              visibilitas <strong>Publik</strong>. Setelah itu, pilih gambar
              pada profil atau proyek.
            </p>
            <small>JPG, PNG, WebP, atau PDF · Maks. 4 MB</small>
            <Link
              className="studio-text-link"
              href="/admin/collections/media/create"
            >
              Unggah berkas <span aria-hidden="true">↗</span>
            </Link>
          </section>
        </aside>
      </div>
      <section
        className="studio-panel studio-review"
        aria-labelledby="studio-review-title"
      >
        <div className="studio-section-heading">
          <h2 id="studio-review-title">Perlu dilengkapi</h2>
          <span className="studio-badge">{incomplete.length} proyek</span>
        </div>
        <p className="studio-muted">
          Catatan ini membantu memperjelas cerita proyek Anda, dan tidak
          menghalangi publikasi.
        </p>
        {incomplete.length ? (
          <ul>
            {incomplete.map((project) => (
              <li key={project.id}>
                <span>
                  <strong>{project.title}</strong>
                  <small>Lengkapi {project.missing}.</small>
                </span>
                <Link
                  href={"/admin/collections/projects/" + project.id}
                  aria-label={"Lengkapi proyek " + project.title}
                >
                  Lengkapi <span aria-hidden="true">↗</span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="studio-success">
            Semua proyek sudah memiliki kontribusi dan hasil. Periksa kembali
            buktinya sebelum dibagikan.
          </p>
        )}
      </section>
      <details className="studio-panel studio-additional">
        <summary>
          <span>
            <strong>Bagian tambahan</strong>
            <small>
              Layanan, penghargaan, testimoni, paket harga, dan blog. Isi saat
              diperlukan.
            </small>
          </span>
          <span className="studio-details-icon" aria-hidden="true">
            ＋
          </span>
        </summary>
        <div className="studio-optional-grid">
          {optionalCounts.map((menu) => (
            <Link href={"/admin/collections/" + menu.slug} key={menu.slug}>
              <h3>{menu.label}</h3>
              <p>{menu.description}</p>
              <span className="studio-badge">
                {menu.totalDocs
                  ? menu.totalDocs + " konten tersimpan"
                  : "Belum ada konten"}
              </span>
            </Link>
          ))}
        </div>
        <p className="studio-optional-note">
          Agar muncul di website: isi konten → terbitkan → aktifkan bagiannya di{" "}
          <Link href="/admin/globals/site-settings">Situs & beranda</Link>.
        </p>
      </details>
      <footer className="studio-dashboard-footer">
        <span>Satria Studio · Ruang admin pribadi</span>
        <Link href="/admin/globals/site-settings">
          Pengaturan website <span aria-hidden="true">↗</span>
        </Link>
      </footer>
    </main>
  );
}
