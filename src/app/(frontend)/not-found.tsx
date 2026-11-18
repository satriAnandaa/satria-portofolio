import Link from 'next/link'
export default function NotFound() {
  return <main className="container section" id="main-content"><p className="eyebrow">404 / NOT FOUND</p><h1 className="text-4xl">Catatan tidak ditemukan.</h1><p className="my-6">Halaman mungkin belum dipublikasikan atau sudah diarsipkan.</p><Link className="text-link" href="/">Kembali ke beranda ↗</Link></main>
}
