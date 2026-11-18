'use client'
import { useState, type FormEvent } from 'react'

export function ContactForm({ email }: { email: string }) {
  const [draft, setDraft] = useState('')
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const name = form.elements.namedItem('name') as HTMLInputElement
    const message = form.elements.namedItem('message') as HTMLTextAreaElement
    name.setCustomValidity(name.value.trim() ? '' : 'Masukkan nama Anda, bukan hanya spasi.')
    message.setCustomValidity(message.value.trim().length >= 10 ? '' : 'Tuliskan pesan minimal 10 karakter.')
    if (!form.reportValidity()) return
    const data = new FormData(form)
    const body = ['Halo,', '', message.value.trim(), '', 'Salam,', name.value.trim(), String(data.get('email')).trim()].join('\r\n')
    const url = 'mailto:' + email + '?subject=' + encodeURIComponent(String(data.get('subject')) + ' — ' + name.value.trim()) + '&body=' + encodeURIComponent(body)
    setDraft(url); window.location.href = url
  }
  return <form id="contact-form" action={'mailto:' + email} method="post" encType="text/plain" onSubmit={submit}
    onInput={event => { if ('setCustomValidity' in event.target) (event.target as HTMLInputElement).setCustomValidity(''); setDraft('') }}>
    <p className="mono form-heading">NEW CONVERSATION / DRAF EMAIL</p>
    <div className="grid grid-cols-2 gap-4 max-[360px]:grid-cols-1">
      <div className="form-field"><label htmlFor="name">Nama *</label><input id="name" name="name" autoComplete="name" placeholder="Nama Anda" required maxLength={100} /></div>
      <div className="form-field"><label htmlFor="email">Email *</label><input id="email" name="email" type="email" autoComplete="email" placeholder="nama@email.com" required maxLength={254} /></div>
    </div>
    <div className="form-field"><label htmlFor="subject">Topik *</label><select id="subject" name="subject" required defaultValue="">
      <option value="">Pilih topik percakapan</option>
      {['Kesempatan kerja — Data Analyst', 'Kesempatan kerja — Backend Developer', 'Kolaborasi proyek', 'Pengembangan web', 'Lainnya'].map(item => <option key={item}>{item}</option>)}
    </select></div>
    <div className="form-field"><label htmlFor="message">Pesan *</label><textarea id="message" name="message" rows={4} placeholder="Ceritakan konteks dan hal yang ingin didiskusikan…" required minLength={10} maxLength={2000} /></div>
    <button className="button w-full" type="submit">Siapkan draf email <span aria-hidden="true">↗</span></button>
    <p className="form-hint">Membuka aplikasi email dengan draf pesan. Pesan belum dikirim sampai Anda mengirimkannya dari aplikasi tersebut.</p>
    <p className="form-status" role="status">{draft && <>Draf siap. Jika aplikasi email belum terbuka, <a href={draft}>buka draf kembali</a>. Pesan belum terkirim.</>}</p>
  </form>
}
