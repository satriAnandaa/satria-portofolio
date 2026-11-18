import type { Field, GlobalConfig } from 'payload'
import { adminOnly, readGlobal } from '../lib/access'
import { validateURL } from '../lib/validation'
import { revalidateContent } from '../hooks/revalidateContent'

const text = (name: string, label: string, required = false): Field => ({
  name,
  label,
  type: 'text',
  required,
  maxLength: 250,
})
const area = (name: string, label: string): Field => ({
  name,
  label,
  type: 'textarea',
  maxLength: 10000,
})
function global(slug: string, label: string, fields: Field[]): GlobalConfig {
  return {
    slug,
    label,
    admin: {
      group: 'Pengaturan',
      preview: () =>
        (process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000') +
        '/preview?path=/',
    },
    access: { read: readGlobal, update: adminOnly },
    versions: { drafts: true, max: 20 },
    hooks: { afterChange: [revalidateContent] },
    fields: [
      { name: 'imported', type: 'checkbox', admin: { hidden: true } },
      ...fields,
    ],
  }
}
export const Profile = global('profile', 'Profil & CV', [
  text('name', 'Nama', true),
  text('location', 'Lokasi', true),
  text('career', 'Arah karier', true),
  area('bio', 'Bio (paragraf dipisah baris kosong)'),
  { name: 'email', label: 'Email', type: 'email', required: true },
  text('phone', 'Nomor telepon (format internasional)'),
  {
    name: 'photo',
    type: 'upload',
    label: 'Foto profil',
    relationTo: 'media',
    filterOptions: { mimeType: { contains: 'image/' } },
  },
  {
    name: 'personalPhoto',
    type: 'upload',
    label: 'Foto di luar layar',
    relationTo: 'media',
    filterOptions: { mimeType: { contains: 'image/' } },
  },
  text('personalCaption', 'Keterangan foto pribadi'),
  {
    name: 'resumePDF',
    type: 'upload',
    label: 'PDF CV final (opsional)',
    relationTo: 'media',
    filterOptions: { mimeType: { equals: 'application/pdf' } },
  },
  {
    name: 'socialLinks',
    label: 'Tautan kontak',
    type: 'array',
    fields: [
      text('label', 'Label', true),
      { ...text('url', 'URL', true), validate: validateURL } as Field,
    ],
  },
])
export const SiteSettings = global('site-settings', 'Situs & beranda', [
  text('siteTitle', 'SEO title', true),
  area('description', 'SEO description'),
  text('heroGreeting', 'Sapaan'),
  area('heroTitle', 'Judul hero (satu baris per baris tampilan)'),
  text('heroAccent', 'Judul hero aksen'),
  area('heroDescription', 'Deskripsi hero'),
  text('notebookTitle', 'Judul notebook'),
  area('query', 'Query ilustratif (teks biasa)'),
  area('queryNote', 'Keterangan ilustrasi'),
  text('footerNote', 'Catatan footer'),
  {
    name: 'appearance',
    label: 'Tampilan & tombol',
    type: 'group',
    fields: [
      {
        name: 'accent',
        label: 'Warna aksen',
        type: 'select',
        defaultValue: 'lime',
        options: [
          { label: 'Lime (referensi)', value: 'lime' },
          { label: 'Mint', value: 'mint' },
          { label: 'Amber', value: 'amber' },
        ],
      },
      {
        name: 'socialRail',
        label: 'Tampilkan tautan sosial di hero',
        type: 'checkbox',
        defaultValue: true,
      },
      text('primaryLabel', 'Tombol utama hero (CV)'),
      text('secondaryLabel', 'Tombol kedua hero (karya)'),
      text('footerHeadline', 'Judul ajakan di footer'),
      {
        type: 'ui',
        name: 'appearanceHelp',
        admin: {
          components: { Field: '@/components/admin/Brand#AppearanceHelp' },
        },
      },
    ],
  },
  {
    name: 'optionalSections',
    label: 'Bagian opsional',
    type: 'group',
    admin: {
      description:
        'Kosong secara awal. Aktifkan setelah konten valid dibuat dan dipublikasikan. Bagian tanpa konten tidak ditampilkan.',
    },
    fields: [
      {
        name: 'services',
        label: 'Layanan',
        type: 'checkbox',
        defaultValue: false,
      },
      {
        name: 'awards',
        label: 'Penghargaan',
        type: 'checkbox',
        defaultValue: false,
      },
      {
        name: 'pricing',
        label: 'Paket harga',
        type: 'checkbox',
        defaultValue: false,
      },
      {
        name: 'testimonials',
        label: 'Testimoni',
        type: 'checkbox',
        defaultValue: false,
      },
      {
        name: 'blog',
        label: 'Artikel blog',
        type: 'checkbox',
        defaultValue: false,
      },
    ],
  },
  {
    name: 'navigation',
    label: 'Navigasi',
    type: 'array',
    fields: [
      text('label', 'Label', true),
      {
        name: 'target',
        label: 'Tujuan',
        type: 'select',
        required: true,
        options: [
          'projects',
          'skills',
          'process',
          'about',
          'contact',
          'services',
          'awards',
          'pricing',
          'testimonials',
          'blog',
        ],
      },
    ],
  },
  {
    name: 'sections',
    label: 'Bagian halaman',
    type: 'array',
    fields: [
      {
        name: 'key',
        label: 'Bagian',
        type: 'select',
        required: true,
        options: [
          'projects',
          'skills',
          'process',
          'about',
          'contact',
          'services',
          'awards',
          'pricing',
          'testimonials',
          'blog',
        ],
      },
      text('eyebrow', 'Label editorial'),
      text('title', 'Judul'),
      text('accent', 'Judul aksen'),
      area('description', 'Deskripsi'),
      {
        name: 'enabled',
        label: 'Tampilkan',
        type: 'checkbox',
        defaultValue: true,
      },
    ],
  },
])
