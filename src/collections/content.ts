import path from 'node:path'
import sharp from 'sharp'
import { APIError, type CollectionConfig, type Field } from 'payload'
import { adminOnly, publishedOnly, readMedia } from '../lib/access'
import { validateSlug, validateURL, recognizedFile } from '../lib/validation'
import { revalidateContent } from '../hooks/revalidateContent'

const text = (name: string, label: string, required = false): Field => ({ name, label, type: 'text', required, maxLength: 250 })
const area = (name: string, label: string, required = false): Field => ({ name, label, type: 'textarea', required, maxLength: 10000 })
const url = (name: string, label: string): Field => ({ ...text(name, label), validate: validateURL } as Field)
const common: Field[] = [
  { name: 'legacyId', type: 'text', unique: true, index: true, admin: { hidden: true } },
  { name: 'order', label: 'Urutan', type: 'number', defaultValue: 0, required: true },
  { name: 'archived', label: 'Arsipkan', type: 'checkbox', defaultValue: false, admin: { position: 'sidebar' } },
]

export function content(slug: string, singular: string, fields: Field[]): CollectionConfig {
  return {
    slug, labels: { singular, plural: singular },
    admin: {
      useAsTitle: 'title', group: 'Konten', defaultColumns: ['title', '_status', 'order', 'updatedAt'],
      ...(['projects', 'posts'].includes(slug) ? { preview: (data: Record<string, unknown>) => (process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000') + '/preview?path=' + encodeURIComponent((slug === 'posts' ? '/blog/' : '/projects/') + data.slug) } : {}),
    },
    access: { read: publishedOnly, create: adminOnly, update: adminOnly, delete: adminOnly },
    versions: { drafts: true, maxPerDoc: 20 },
    hooks: { afterChange: [revalidateContent], afterDelete: [revalidateContent] },
    fields: [text('title', 'Judul', true), ...fields, ...common],
  }
}

export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: 'Akun pemilik', plural: 'Akun pemilik' },
  admin: { useAsTitle: 'email', group: 'Pengaturan' },
  auth: {
    maxLoginAttempts: 5, lockTime: 10 * 60 * 1000, tokenExpiration: 2 * 60 * 60,
    cookies: { sameSite: 'Lax', secure: process.env.NODE_ENV === 'production' },
  },
  access: { admin: ({ req }) => Boolean(req.user), read: adminOnly, create: () => false, update: adminOnly, delete: () => false },
  hooks: {
    beforeChange: [({ operation, req, context, data }) => {
      if (operation === 'create' && !context.bootstrapAdmin) throw new APIError('Pendaftaran publik dinonaktifkan. Gunakan npm run admin:create.', 403)
      return data
    }],
  },
  fields: [text('name', 'Nama')],
}

export const Projects = content('projects', 'Proyek', [
  { ...text('slug', 'Slug URL', true), unique: true, index: true, validate: validateSlug } as Field,
  { name: 'stage', label: 'Tahap proyek', type: 'select', defaultValue: 'concept', required: true,
    options: [{ label: 'Konsep', value: 'concept' }, { label: 'Dalam pengerjaan', value: 'in-progress' }, { label: 'Selesai', value: 'completed' }] },
  text('category', 'Kategori', true),
  area('summary', 'Ringkasan', true), area('context', 'Konteks / masalah'),
  area('contribution', 'Kontribusi pribadi'), area('outcome', 'Hasil & bukti'),
  area('limitations', 'Keterbatasan'), area('scope', 'Catatan lingkup'),
  { name: 'technologies', label: 'Teknologi', type: 'array', fields: [text('name', 'Nama', true)] },
  { name: 'cover', label: 'Gambar', type: 'upload', relationTo: 'media', filterOptions: { mimeType: { contains: 'image/' } } },
  url('demoURL', 'URL demo'), url('repositoryURL', 'URL repositori'),
  { name: 'featured', label: 'Unggulan', type: 'checkbox', defaultValue: false },
])

export const Skills = content('skills', 'Kelompok keahlian', [
  area('description', 'Deskripsi', true),
  { name: 'items', label: 'Keahlian yang benar-benar tercantum', type: 'array', fields: [text('name', 'Nama', true)] },
  text('mark', 'Penanda editorial'),
])
export const ProcessSteps = content('process-steps', 'Langkah proses', [
  text('label', 'Label', true), area('description', 'Penjelasan', true),
])
export const Experiences = content('experiences', 'Pengalaman', [
  text('period', 'Periode', true), text('kind', 'Jenis', true),
  text('institution', 'Institusi / perusahaan'),
  area('description', 'Uraian', true), area('contribution', 'Kontribusi spesifik'),
  url('evidenceURL', 'Tautan bukti'),
])
export const Education = content('education', 'Pendidikan', [
  text('institution', 'Institusi'), text('period', 'Periode'),
  text('educationStatus', 'Status pendidikan (bila sudah dikonfirmasi)'),
])

export const Media: CollectionConfig = {
  slug: 'media', labels: { singular: 'Media', plural: 'Media' },
  admin: { group: 'Konten', useAsTitle: 'title', description: 'Media privat tidak bisa dibaca pengunjung. Pilih Publik untuk gambar/CV yang siap ditampilkan.' },
  access: { read: readMedia, create: adminOnly, update: adminOnly, delete: adminOnly },
  upload: {
    staticDir: path.resolve(process.cwd(), '.data/uploads'),
    mimeTypes: ['image/png', 'image/jpeg', 'image/webp', 'application/pdf'],
  },
  hooks: {
    beforeValidate: [async ({ req, data }) => {
      const file = req.file
      if (file && (!recognizedFile(file.data) || recognizedFile(file.data) !== file.mimetype)) {
        throw new APIError('Isi file harus benar-benar PNG, JPG, WebP, atau PDF yang valid.', 400)
      }
      if (file?.mimetype.startsWith('image/')) {
        try { await sharp(file.data, { limitInputPixels: 32000000 }).metadata() }
        catch { throw new APIError('Gambar rusak atau melebihi batas dimensi yang aman.', 400) }
      }
      if (file?.mimetype === 'application/pdf' && !file.data.subarray(-2048).includes(Buffer.from('%%EOF'))) {
        throw new APIError('Dokumen PDF tidak lengkap atau rusak.', 400)
      }
      if (file?.mimetype.startsWith('image/') && !data?.alt?.trim()) throw new APIError('Alt text wajib untuk gambar.', 400)
      return data
    }],
    afterChange: [revalidateContent],
  },
  fields: [
    text('title', 'Judul', true),
    { ...text('alt', 'Alt text'), admin: { description: 'Wajib untuk gambar, boleh kosong untuk PDF.' } } as Field,
    { name: 'visibility', label: 'Visibilitas file', type: 'select', required: true, defaultValue: 'private',
      options: [{ label: 'Privat / draft', value: 'private' }, { label: 'Publik', value: 'public' }] },
  ],
}

export const collections = [Users, Media, Projects, Skills, ProcessSteps, Experiences, Education]
