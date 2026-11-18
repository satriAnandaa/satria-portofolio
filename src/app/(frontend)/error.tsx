'use client'
export default function ContentError({ reset }: { reset: () => void }) {
  return <main className="container section" id="main-content"><h1 className="text-4xl">Konten belum dapat dimuat.</h1><p className="my-6">Silakan coba kembali beberapa saat lagi.</p><button className="button" type="button" onClick={reset}>Coba kembali ↗</button></main>
}
