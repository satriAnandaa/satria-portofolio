import path from "node:path";
import sharp from "sharp";
import { APIError, type CollectionConfig, type Field } from "payload";
import { adminOnly, publishedOnly, readMedia } from "../lib/access";
import { validateSlug, validateURL, recognizedFile } from "../lib/validation";
import { revalidateContent } from "../hooks/revalidateContent";

const text = (name: string, label: string, required = false): Field => ({
  name,
  label,
  type: "text",
  required,
  maxLength: 250,
});
const area = (name: string, label: string, required = false): Field => ({
  name,
  label,
  type: "textarea",
  required,
  maxLength: 10000,
});
const url = (name: string, label: string): Field =>
  ({ ...text(name, label), validate: validateURL }) as Field;
const common: Field[] = [
  {
    name: "legacyId",
    type: "text",
    unique: true,
    index: true,
    admin: { hidden: true },
  },
  {
    name: "order",
    label: "Urutan tampil",
    type: "number",
    defaultValue: 0,
    required: true,
    admin: {
      description: "Angka terkecil muncul lebih dahulu. Contoh: 1, 2, 3.",
    },
  },
  {
    name: "archived",
    label: "Arsipkan konten",
    type: "checkbox",
    defaultValue: false,
    admin: {
      position: "sidebar",
      description: "Sembunyikan dari website tanpa menghapus kontennya.",
    },
  },
];

export function content(
  slug: string,
  singular: string,
  fields: Field[],
): CollectionConfig {
  return {
    slug,
    labels: { singular, plural: singular },
    admin: {
      useAsTitle: "title",
      group: [
        "services",
        "awards",
        "testimonials",
        "pricing-plans",
        "posts",
      ].includes(slug)
        ? "Bagian tambahan"
        : "Portofolio",
      defaultColumns: ["title", "_status", "order", "updatedAt"],
      description:
        "Isi konten, simpan sebagai draf untuk ditinjau, lalu terbitkan agar tampil di website. Urutan terkecil ditampilkan lebih dahulu.",
      ...(["projects", "posts"].includes(slug)
        ? {
            preview: (data: Record<string, unknown>) =>
              (process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000") +
              "/preview?path=" +
              encodeURIComponent(
                (slug === "posts" ? "/blog/" : "/projects/") + data.slug,
              ),
          }
        : {}),
    },
    access: {
      read: publishedOnly,
      create: adminOnly,
      update: adminOnly,
      delete: adminOnly,
    },
    versions: { drafts: true, maxPerDoc: 20 },
    hooks: {
      afterChange: [revalidateContent],
      afterDelete: [revalidateContent],
    },
    fields: [text("title", "Judul", true), ...fields, ...common],
  };
}

export const Users: CollectionConfig = {
  slug: "users",
  labels: { singular: "Akun pemilik", plural: "Akun pemilik" },
  admin: { useAsTitle: "email", group: "Pengaturan" },
  auth: {
    maxLoginAttempts: 5,
    lockTime: 10 * 60 * 1000,
    tokenExpiration: 2 * 60 * 60,
    cookies: { sameSite: "Lax", secure: process.env.NODE_ENV === "production" },
  },
  access: {
    admin: ({ req }) => Boolean(req.user),
    read: adminOnly,
    create: () => false,
    update: adminOnly,
    delete: () => false,
  },
  hooks: {
    beforeChange: [
      ({ operation, req, context, data }) => {
        if (operation === "create" && !context.bootstrapAdmin)
          throw new APIError(
            "Pendaftaran publik dinonaktifkan. Gunakan npm run admin:create.",
            403,
          );
        return data;
      },
    ],
  },
  fields: [text("name", "Nama")],
};

export const Projects = content("projects", "Proyek", [
  {
    name: "cover",
    label: "Foto / gambar proyek",
    type: "upload",
    relationTo: "media",
    filterOptions: { mimeType: { contains: "image/" } },
    admin: {
      description:
        "Klik Buat Baru untuk mengunggah foto, atau Pilih dari yang sudah ada untuk memakai Pustaka media. Pada berkas yang diunggah, isi deskripsi gambar dan pilih visibilitas Publik agar foto tampil di website.",
    },
  },
  {
    ...text("slug", "Alamat halaman (slug)", true),
    unique: true,
    index: true,
    validate: validateSlug,
    admin: {
      description:
        "Gunakan huruf kecil dan tanda hubung, misalnya: dashboard-penjualan. Menjadi bagian dari alamat /projects/dashboard-penjualan.",
    },
  } as Field,
  {
    name: "stage",
    label: "Tahap proyek",
    type: "select",
    defaultValue: "concept",
    required: true,
    options: [
      { label: "Konsep", value: "concept" },
      { label: "Dalam pengerjaan", value: "in-progress" },
      { label: "Selesai", value: "completed" },
    ],
  },
  text("category", "Kategori", true),
  area("summary", "Ringkasan", true),
  area("context", "Konteks / masalah"),
  area("contribution", "Kontribusi pribadi"),
  area("outcome", "Hasil & bukti"),
  area("limitations", "Keterbatasan"),
  area("scope", "Catatan lingkup"),
  {
    name: "technologies",
    label: "Teknologi",
    labels: { singular: "Teknologi", plural: "Teknologi" },
    type: "array",
    fields: [text("name", "Nama", true)],
  },
  url("demoURL", "URL demo"),
  url("repositoryURL", "URL repositori"),
  {
    name: "featured",
    label: "Jadikan proyek unggulan",
    type: "checkbox",
    defaultValue: false,
    admin: {
      description: "Tandai karya utama yang ingin ditonjolkan di portofolio.",
    },
  },
]);

export const Skills = content("skills", "Keahlian", [
  area("description", "Deskripsi", true),
  {
    name: "items",
    label: "Keahlian yang benar-benar tercantum",
    type: "array",
    fields: [text("name", "Nama", true)],
  },
  text("mark", "Penanda editorial"),
]);
export const ProcessSteps = content("process-steps", "Proses kerja", [
  text("label", "Label", true),
  area("description", "Penjelasan", true),
]);
export const Experiences = content("experiences", "Pengalaman", [
  text("period", "Periode", true),
  text("kind", "Jenis", true),
  text("institution", "Institusi / perusahaan"),
  area("description", "Uraian", true),
  area("contribution", "Kontribusi spesifik"),
  url("evidenceURL", "Tautan bukti"),
]);
export const Education = content("education", "Pendidikan", [
  text("institution", "Institusi"),
  text("period", "Periode"),
  text("educationStatus", "Status pendidikan (bila sudah dikonfirmasi)"),
]);

export const Media: CollectionConfig = {
  slug: "media",
  labels: { singular: "Berkas media", plural: "Pustaka media" },
  admin: {
    group: "Berkas",
    useAsTitle: "title",
    description:
      "Unggah gambar JPG, PNG, WebP atau PDF, maksimal 4 MB. Isi judul dan deskripsi gambar, lalu pilih Publik jika berkas akan digunakan di website.",
  },
  access: {
    read: readMedia,
    create: adminOnly,
    update: adminOnly,
    delete: adminOnly,
  },
  upload: {
    staticDir: path.resolve(process.cwd(), ".data/uploads"),
    mimeTypes: ["image/png", "image/jpeg", "image/webp", "application/pdf"],
  },
  hooks: {
    beforeValidate: [
      async ({ req, data }) => {
        const file = req.file;
        if (
          file &&
          (!recognizedFile(file.data) ||
            recognizedFile(file.data) !== file.mimetype)
        ) {
          throw new APIError(
            "Isi file harus benar-benar PNG, JPG, WebP, atau PDF yang valid.",
            400,
          );
        }
        if (file?.mimetype.startsWith("image/")) {
          try {
            await sharp(file.data, { limitInputPixels: 32000000 }).metadata();
          } catch {
            throw new APIError(
              "Gambar rusak atau melebihi batas dimensi yang aman.",
              400,
            );
          }
        }
        if (
          file?.mimetype === "application/pdf" &&
          !file.data.subarray(-2048).includes(Buffer.from("%%EOF"))
        ) {
          throw new APIError("Dokumen PDF tidak lengkap atau rusak.", 400);
        }
        if (file?.mimetype.startsWith("image/") && !data?.alt?.trim())
          throw new APIError("Alt text wajib untuk gambar.", 400);
        return data;
      },
    ],
    afterChange: [revalidateContent],
  },
  fields: [
    // Keep the database shape stable for local uploads and the S3 adapter.
    {
      name: "_objectKey",
      type: "text",
      admin: {
        hidden: true,
        readOnly: true,
        disableBulkEdit: true,
        disableGroupBy: true,
        disableListColumn: true,
        disableListFilter: true,
      },
    },
    text("title", "Judul", true),
    {
      ...text("alt", "Deskripsi gambar"),
      admin: {
        description:
          "Jelaskan isi gambar secara singkat untuk pembaca layar. Wajib untuk gambar; boleh kosong untuk PDF.",
      },
    } as Field,
    {
      name: "visibility",
      label: "Visibilitas file",
      type: "select",
      required: true,
      defaultValue: "private",
      options: [
        { label: "Privat — hanya admin", value: "private" },
        { label: "Publik — bisa tampil di website", value: "public" },
      ],
      admin: {
        description:
          "Gunakan Publik untuk gambar dan CV yang akan dilihat pengunjung.",
      },
    },
  ],
};

export const collections = [
  Users,
  Media,
  Projects,
  Skills,
  ProcessSteps,
  Experiences,
  Education,
];
