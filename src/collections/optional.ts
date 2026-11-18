import type { Field } from 'payload'
import { content } from './content'
import { validateSlug, validateURL } from '../lib/validation'

const text = (name: string, label: string, required = false): Field => ({
  name,
  label,
  type: 'text',
  required,
  maxLength: 250,
})
const area = (name: string, label: string, required = false): Field => ({
  name,
  label,
  type: 'textarea',
  required,
  maxLength: 50000,
})
const image = (name: string, label: string): Field => ({
  name,
  label,
  type: 'upload',
  relationTo: 'media',
  filterOptions: { mimeType: { contains: 'image/' } },
})
const link = (name: string, label: string): Field =>
  ({ ...text(name, label), validate: validateURL }) as Field

export const Services = content('services', 'Layanan', [
  area('summary', 'Ringkasan', true),
  area('description', 'Pendekatan / rincian'),
  {
    name: 'icon',
    label: 'Ikon',
    type: 'select',
    defaultValue: 'code',
    options: ['code', 'data', 'design', 'web'],
  },
  {
    name: 'items',
    label: 'Cakupan layanan',
    type: 'array',
    fields: [text('name', 'Cakupan', true)],
  },
])
export const Awards = content('awards', 'Penghargaan', [
  text('issuer', 'Penerbit / institusi', true),
  { name: 'date', label: 'Tanggal diterima', type: 'date' },
  area('description', 'Keterangan'),
  link('evidenceURL', 'Tautan bukti'),
  image('logo', 'Logo (opsional)'),
])
export const Testimonials = content('testimonials', 'Testimoni', [
  text('author', 'Nama pemberi testimoni', true),
  text('role', 'Peran / organisasi'),
  area('quote', 'Testimoni asli', true),
  image('avatar', 'Foto (opsional)'),
  link('sourceURL', 'Tautan sumber (opsional)'),
])
export const PricingPlans = content('pricing-plans', 'Paket harga', [
  text('priceLabel', 'Harga / kisaran yang ditawarkan', true),
  text('period', 'Satuan (mis. per proyek)'),
  area('summary', 'Deskripsi paket'),
  {
    name: 'features',
    label: 'Yang termasuk',
    type: 'array',
    fields: [text('name', 'Fitur', true)],
  },
  {
    name: 'featured',
    label: 'Paket utama',
    type: 'checkbox',
    defaultValue: false,
  },
  text('ctaLabel', 'Teks tombol konsultasi'),
])
export const Posts = content('posts', 'Artikel blog', [
  {
    ...text('slug', 'Slug URL', true),
    unique: true,
    index: true,
    validate: validateSlug,
  } as Field,
  text('category', 'Kategori'),
  area('excerpt', 'Ringkasan', true),
  area('body', 'Isi artikel (paragraf dipisah baris kosong)', true),
  image('cover', 'Gambar sampul'),
  {
    name: 'publishedDate',
    label: 'Tanggal artikel',
    type: 'date',
    required: true,
  },
])
export const optionalCollections = [
  Services,
  Awards,
  Testimonials,
  PricingPlans,
  Posts,
]
