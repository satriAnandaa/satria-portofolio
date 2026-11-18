import { getContent } from '@/lib/content'
import { Portfolio } from '@/components/sections/Portfolio'
export default async function Home() {
  const content = await getContent()
  if (!content.profile.imported) return <main className="container section" id="main-content"><h1>Portofolio sedang disiapkan.</h1><p className="mt-6">Konten akan tersedia setelah pengaturan awal selesai.</p></main>
  return <Portfolio content={content} />
}
