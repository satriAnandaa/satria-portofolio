import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildConfig } from "payload";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { s3Storage } from "@payloadcms/storage-s3";
import { nodemailerAdapter } from "@payloadcms/email-nodemailer";
import sharp from "sharp";
import { id } from "@payloadcms/translations/languages/id";
import { collections } from "./collections/content";
import { optionalCollections } from "./collections/optional";
import { Profile, SiteSettings } from "./globals/content";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const storage = process.env.STORAGE_DRIVER === "s3";
if (process.env.VERCEL && !storage)
  throw new Error(
    "Vercel memerlukan STORAGE_DRIVER=s3. Folder upload lokal tidak persisten.",
  );
if (
  storage &&
  [
    "S3_BUCKET",
    "S3_ENDPOINT",
    "S3_REGION",
    "S3_ACCESS_KEY_ID",
    "S3_SECRET_ACCESS_KEY",
  ].some((key) => !process.env[key])
) {
  throw new Error(
    "Lengkapi konfigurasi Supabase Storage/S3 pada environment server.",
  );
}

export default buildConfig({
  i18n: {
    supportedLanguages: { id },
    fallbackLanguage: "id",
    translations: {
      id: {
        general: { dashboard: "Beranda admin" },
        version: {
          publish: "Terbitkan",
          publishChanges: "Terbitkan perubahan",
          published: "Terbit",
          saveDraft: "Simpan draf",
        },
      },
    },
  },
  secret: process.env.PAYLOAD_SECRET || "",
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000",
  admin: {
    user: "users",
    importMap: { baseDir: dirname },
    meta: { titleSuffix: "— Satria Studio" },
    components: {
      views: { dashboard: { Component: "@/components/admin/Welcome#Welcome" } },
      beforeLogin: ["@/components/admin/Brand#LoginIntro"],
      graphics: {
        Logo: "@/components/admin/Brand#AdminLogo",
        Icon: "@/components/admin/Brand#AdminIcon",
      },
    },
  },
  db: postgresAdapter({
    schemaName: "portfolio",
    pool: {
      connectionString: process.env.DATABASE_URL,
      max: 3,
      connectionTimeoutMillis: 15000,
      idleTimeoutMillis: 30000,
    },
    push: process.env.DATABASE_PUSH === "true",
    migrationDir: path.resolve(dirname, "migrations"),
  }),
  collections: [...collections, ...optionalCollections],
  globals: [Profile, SiteSettings],
  sharp,
  typescript: { outputFile: path.resolve(dirname, "payload-types.ts") },
  upload: { limits: { fileSize: 4 * 1024 * 1024 } },
  csrf: [process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000"],
  plugins: storage
    ? [
        s3Storage({
          collections: { media: true },
          bucket: process.env.S3_BUCKET!,
          config: {
            endpoint: process.env.S3_ENDPOINT,
            region: process.env.S3_REGION,
            forcePathStyle: true,
            credentials: {
              accessKeyId: process.env.S3_ACCESS_KEY_ID!,
              secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
            },
          },
        }),
      ]
    : [],
  email: process.env.SMTP_HOST
    ? nodemailerAdapter({
        defaultFromAddress: process.env.SMTP_FROM || "noreply@example.com",
        defaultFromName: "Satria Data Lab",
        transportOptions: {
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT || 587),
          secure: Number(process.env.SMTP_PORT) === 465,
          auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
        },
      })
    : () => ({
        name: "operator-reset-only",
        defaultFromAddress: "noreply@localhost",
        defaultFromName: "Satria Data Lab",
        sendEmail: async () => {
          throw new Error(
            "SMTP belum dikonfigurasi. Gunakan npm run admin:reset melalui terminal operator.",
          );
        },
      }),
});
