import Link from 'next/link'
import { getContent } from '@/lib/content'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { PrintButton } from '@/components/ui/PrintButton'
import { mediaURL } from '@/components/sections/Portfolio'
export async function generateMetadata() {
  const { profile } = await getContent()
  return { title: 'CV — ' + profile.name + ' / Data & Backend' }
}
export default async function CVPage() {
  const { profile, skills, experiences, education, projects } = await getContent()
  return <div className="resume-page">
    <nav className="resume-navigation container" aria-label="Navigasi CV"><Link className="text-link" href="/">← Kembali ke portofolio</Link><div className="flex flex-wrap items-center gap-4"><ThemeToggle /><PrintButton />{profile.resumePDF?.url && <a className="text-link" href={mediaURL(profile.resumePDF, '')} download>Unduh PDF final ↗</a>}</div></nav>
    <main className="resume-sheet" id="main-content">
      <p className="eyebrow">CURRICULUM VITAE / DATA LAB</p><h1>{profile.name}</h1><p className="resume-role">Arah karier: {profile.career}</p>
      <p className="resume-contact">{profile.location} · <a href={'mailto:' + profile.email}>{profile.email}</a>{profile.phone && <><br /><a href={'tel:' + profile.phone}>{profile.phone}</a></>}</p>
      <div className="mt-3 flex flex-wrap gap-4 text-xs">{profile.socialLinks?.map(link => <a key={link.url} href={link.url}>{link.label} ↗</a>)}</div>
      <section><h2>PROFIL</h2>{profile.bio?.split('\n\n').map((paragraph, i) => <p className="mb-3" key={i}>{paragraph}</p>)}</section>
      <section><h2>KEAHLIAN YANG TERCANTUM</h2><ul>{skills.map(group => <li key={group.id}><strong>{group.title}: </strong>{group.items?.map(item => item.name).join(', ')}</li>)}</ul></section>
      <section><h2>PENGALAMAN</h2>{experiences.map(item => <article key={item.id}><h3>{item.title}</h3><p className="date">{item.period} / {item.kind}{item.institution ? ' / ' + item.institution : ''}</p><p>{item.description}</p>{item.contribution && <p>{item.contribution}</p>}{!item.institution && <p className="fill-in">Institusi, periode spesifik, dan kontribusi perlu dilengkapi.</p>}</article>)}</section>
      <section><h2>PENDIDIKAN</h2>{education.map(item => <article key={item.id}><h3>{item.title}</h3><p className={item.institution ? '' : 'fill-in'}>{item.institution || 'Institusi belum dicantumkan.'} {item.period || ''}</p>{item.educationStatus && <p>{item.educationStatus}</p>}</article>)}</section>
      <section><h2>CATATAN PROYEK</h2><ul>{projects.map(project => <li key={project.id}><Link href={'/projects/' + project.slug}>{project.title}</Link> — {project.stage === 'concept' ? 'Konsep' : project.stage === 'completed' ? 'Selesai' : 'Dalam pengerjaan'}. {project.summary}</li>)}</ul><p className="fill-in">Informasi yang belum tersedia tidak digantikan dengan pencapaian buatan. Lengkapi penanda sebelum memakai CV final.</p></section>
    </main>
  </div>
}
