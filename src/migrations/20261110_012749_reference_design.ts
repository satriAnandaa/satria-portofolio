import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "portfolio"."enum_services_icon" AS ENUM('code', 'data', 'design', 'web');
  CREATE TYPE "portfolio"."enum_services_status" AS ENUM('draft', 'published');
  CREATE TYPE "portfolio"."enum__services_v_version_icon" AS ENUM('code', 'data', 'design', 'web');
  CREATE TYPE "portfolio"."enum__services_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "portfolio"."enum_awards_status" AS ENUM('draft', 'published');
  CREATE TYPE "portfolio"."enum__awards_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "portfolio"."enum_testimonials_status" AS ENUM('draft', 'published');
  CREATE TYPE "portfolio"."enum__testimonials_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "portfolio"."enum_pricing_plans_status" AS ENUM('draft', 'published');
  CREATE TYPE "portfolio"."enum__pricing_plans_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "portfolio"."enum_posts_status" AS ENUM('draft', 'published');
  CREATE TYPE "portfolio"."enum__posts_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "portfolio"."enum_site_settings_appearance_accent" AS ENUM('lime', 'mint', 'amber');
  CREATE TYPE "portfolio"."enum__site_settings_v_version_appearance_accent" AS ENUM('lime', 'mint', 'amber');
  ALTER TYPE "portfolio"."enum_site_settings_navigation_target" ADD VALUE 'services';
  ALTER TYPE "portfolio"."enum_site_settings_navigation_target" ADD VALUE 'awards';
  ALTER TYPE "portfolio"."enum_site_settings_navigation_target" ADD VALUE 'pricing';
  ALTER TYPE "portfolio"."enum_site_settings_navigation_target" ADD VALUE 'testimonials';
  ALTER TYPE "portfolio"."enum_site_settings_navigation_target" ADD VALUE 'blog';
  ALTER TYPE "portfolio"."enum_site_settings_sections_key" ADD VALUE 'services';
  ALTER TYPE "portfolio"."enum_site_settings_sections_key" ADD VALUE 'awards';
  ALTER TYPE "portfolio"."enum_site_settings_sections_key" ADD VALUE 'pricing';
  ALTER TYPE "portfolio"."enum_site_settings_sections_key" ADD VALUE 'testimonials';
  ALTER TYPE "portfolio"."enum_site_settings_sections_key" ADD VALUE 'blog';
  ALTER TYPE "portfolio"."enum__site_settings_v_version_navigation_target" ADD VALUE 'services';
  ALTER TYPE "portfolio"."enum__site_settings_v_version_navigation_target" ADD VALUE 'awards';
  ALTER TYPE "portfolio"."enum__site_settings_v_version_navigation_target" ADD VALUE 'pricing';
  ALTER TYPE "portfolio"."enum__site_settings_v_version_navigation_target" ADD VALUE 'testimonials';
  ALTER TYPE "portfolio"."enum__site_settings_v_version_navigation_target" ADD VALUE 'blog';
  ALTER TYPE "portfolio"."enum__site_settings_v_version_sections_key" ADD VALUE 'services';
  ALTER TYPE "portfolio"."enum__site_settings_v_version_sections_key" ADD VALUE 'awards';
  ALTER TYPE "portfolio"."enum__site_settings_v_version_sections_key" ADD VALUE 'pricing';
  ALTER TYPE "portfolio"."enum__site_settings_v_version_sections_key" ADD VALUE 'testimonials';
  ALTER TYPE "portfolio"."enum__site_settings_v_version_sections_key" ADD VALUE 'blog';
  CREATE TABLE "portfolio"."services_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar
  );
  
  CREATE TABLE "portfolio"."services" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"summary" varchar,
  	"description" varchar,
  	"icon" "portfolio"."enum_services_icon" DEFAULT 'code',
  	"legacy_id" varchar,
  	"order" numeric DEFAULT 0,
  	"archived" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "portfolio"."enum_services_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "portfolio"."_services_v_version_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "portfolio"."_services_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_summary" varchar,
  	"version_description" varchar,
  	"version_icon" "portfolio"."enum__services_v_version_icon" DEFAULT 'code',
  	"version_legacy_id" varchar,
  	"version_order" numeric DEFAULT 0,
  	"version_archived" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "portfolio"."enum__services_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "portfolio"."awards" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"issuer" varchar,
  	"date" timestamp(3) with time zone,
  	"description" varchar,
  	"evidence_u_r_l" varchar,
  	"logo_id" integer,
  	"legacy_id" varchar,
  	"order" numeric DEFAULT 0,
  	"archived" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "portfolio"."enum_awards_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "portfolio"."_awards_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_issuer" varchar,
  	"version_date" timestamp(3) with time zone,
  	"version_description" varchar,
  	"version_evidence_u_r_l" varchar,
  	"version_logo_id" integer,
  	"version_legacy_id" varchar,
  	"version_order" numeric DEFAULT 0,
  	"version_archived" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "portfolio"."enum__awards_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "portfolio"."testimonials" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"author" varchar,
  	"role" varchar,
  	"quote" varchar,
  	"avatar_id" integer,
  	"source_u_r_l" varchar,
  	"legacy_id" varchar,
  	"order" numeric DEFAULT 0,
  	"archived" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "portfolio"."enum_testimonials_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "portfolio"."_testimonials_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_author" varchar,
  	"version_role" varchar,
  	"version_quote" varchar,
  	"version_avatar_id" integer,
  	"version_source_u_r_l" varchar,
  	"version_legacy_id" varchar,
  	"version_order" numeric DEFAULT 0,
  	"version_archived" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "portfolio"."enum__testimonials_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "portfolio"."pricing_plans_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar
  );
  
  CREATE TABLE "portfolio"."pricing_plans" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"price_label" varchar,
  	"period" varchar,
  	"summary" varchar,
  	"featured" boolean DEFAULT false,
  	"cta_label" varchar,
  	"legacy_id" varchar,
  	"order" numeric DEFAULT 0,
  	"archived" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "portfolio"."enum_pricing_plans_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "portfolio"."_pricing_plans_v_version_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "portfolio"."_pricing_plans_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_price_label" varchar,
  	"version_period" varchar,
  	"version_summary" varchar,
  	"version_featured" boolean DEFAULT false,
  	"version_cta_label" varchar,
  	"version_legacy_id" varchar,
  	"version_order" numeric DEFAULT 0,
  	"version_archived" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "portfolio"."enum__pricing_plans_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "portfolio"."posts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"category" varchar,
  	"excerpt" varchar,
  	"body" varchar,
  	"cover_id" integer,
  	"published_date" timestamp(3) with time zone,
  	"legacy_id" varchar,
  	"order" numeric DEFAULT 0,
  	"archived" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "portfolio"."enum_posts_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "portfolio"."_posts_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_category" varchar,
  	"version_excerpt" varchar,
  	"version_body" varchar,
  	"version_cover_id" integer,
  	"version_published_date" timestamp(3) with time zone,
  	"version_legacy_id" varchar,
  	"version_order" numeric DEFAULT 0,
  	"version_archived" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "portfolio"."enum__posts_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  ALTER TABLE "portfolio"."payload_locked_documents_rels" ADD COLUMN "services_id" integer;
  ALTER TABLE "portfolio"."payload_locked_documents_rels" ADD COLUMN "awards_id" integer;
  ALTER TABLE "portfolio"."payload_locked_documents_rels" ADD COLUMN "testimonials_id" integer;
  ALTER TABLE "portfolio"."payload_locked_documents_rels" ADD COLUMN "pricing_plans_id" integer;
  ALTER TABLE "portfolio"."payload_locked_documents_rels" ADD COLUMN "posts_id" integer;
  ALTER TABLE "portfolio"."site_settings" ADD COLUMN "appearance_accent" "portfolio"."enum_site_settings_appearance_accent" DEFAULT 'lime';
  ALTER TABLE "portfolio"."site_settings" ADD COLUMN "appearance_social_rail" boolean DEFAULT true;
  ALTER TABLE "portfolio"."site_settings" ADD COLUMN "appearance_primary_label" varchar;
  ALTER TABLE "portfolio"."site_settings" ADD COLUMN "appearance_secondary_label" varchar;
  ALTER TABLE "portfolio"."site_settings" ADD COLUMN "appearance_footer_headline" varchar;
  ALTER TABLE "portfolio"."site_settings" ADD COLUMN "optional_sections_services" boolean DEFAULT false;
  ALTER TABLE "portfolio"."site_settings" ADD COLUMN "optional_sections_awards" boolean DEFAULT false;
  ALTER TABLE "portfolio"."site_settings" ADD COLUMN "optional_sections_pricing" boolean DEFAULT false;
  ALTER TABLE "portfolio"."site_settings" ADD COLUMN "optional_sections_testimonials" boolean DEFAULT false;
  ALTER TABLE "portfolio"."site_settings" ADD COLUMN "optional_sections_blog" boolean DEFAULT false;
  ALTER TABLE "portfolio"."_site_settings_v" ADD COLUMN "version_appearance_accent" "portfolio"."enum__site_settings_v_version_appearance_accent" DEFAULT 'lime';
  ALTER TABLE "portfolio"."_site_settings_v" ADD COLUMN "version_appearance_social_rail" boolean DEFAULT true;
  ALTER TABLE "portfolio"."_site_settings_v" ADD COLUMN "version_appearance_primary_label" varchar;
  ALTER TABLE "portfolio"."_site_settings_v" ADD COLUMN "version_appearance_secondary_label" varchar;
  ALTER TABLE "portfolio"."_site_settings_v" ADD COLUMN "version_appearance_footer_headline" varchar;
  ALTER TABLE "portfolio"."_site_settings_v" ADD COLUMN "version_optional_sections_services" boolean DEFAULT false;
  ALTER TABLE "portfolio"."_site_settings_v" ADD COLUMN "version_optional_sections_awards" boolean DEFAULT false;
  ALTER TABLE "portfolio"."_site_settings_v" ADD COLUMN "version_optional_sections_pricing" boolean DEFAULT false;
  ALTER TABLE "portfolio"."_site_settings_v" ADD COLUMN "version_optional_sections_testimonials" boolean DEFAULT false;
  ALTER TABLE "portfolio"."_site_settings_v" ADD COLUMN "version_optional_sections_blog" boolean DEFAULT false;
  ALTER TABLE "portfolio"."services_items" ADD CONSTRAINT "services_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "portfolio"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "portfolio"."_services_v_version_items" ADD CONSTRAINT "_services_v_version_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "portfolio"."_services_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "portfolio"."_services_v" ADD CONSTRAINT "_services_v_parent_id_services_id_fk" FOREIGN KEY ("parent_id") REFERENCES "portfolio"."services"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "portfolio"."awards" ADD CONSTRAINT "awards_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "portfolio"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "portfolio"."_awards_v" ADD CONSTRAINT "_awards_v_parent_id_awards_id_fk" FOREIGN KEY ("parent_id") REFERENCES "portfolio"."awards"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "portfolio"."_awards_v" ADD CONSTRAINT "_awards_v_version_logo_id_media_id_fk" FOREIGN KEY ("version_logo_id") REFERENCES "portfolio"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "portfolio"."testimonials" ADD CONSTRAINT "testimonials_avatar_id_media_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "portfolio"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "portfolio"."_testimonials_v" ADD CONSTRAINT "_testimonials_v_parent_id_testimonials_id_fk" FOREIGN KEY ("parent_id") REFERENCES "portfolio"."testimonials"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "portfolio"."_testimonials_v" ADD CONSTRAINT "_testimonials_v_version_avatar_id_media_id_fk" FOREIGN KEY ("version_avatar_id") REFERENCES "portfolio"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "portfolio"."pricing_plans_features" ADD CONSTRAINT "pricing_plans_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "portfolio"."pricing_plans"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "portfolio"."_pricing_plans_v_version_features" ADD CONSTRAINT "_pricing_plans_v_version_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "portfolio"."_pricing_plans_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "portfolio"."_pricing_plans_v" ADD CONSTRAINT "_pricing_plans_v_parent_id_pricing_plans_id_fk" FOREIGN KEY ("parent_id") REFERENCES "portfolio"."pricing_plans"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "portfolio"."posts" ADD CONSTRAINT "posts_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "portfolio"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "portfolio"."_posts_v" ADD CONSTRAINT "_posts_v_parent_id_posts_id_fk" FOREIGN KEY ("parent_id") REFERENCES "portfolio"."posts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "portfolio"."_posts_v" ADD CONSTRAINT "_posts_v_version_cover_id_media_id_fk" FOREIGN KEY ("version_cover_id") REFERENCES "portfolio"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "services_items_order_idx" ON "portfolio"."services_items" USING btree ("_order");
  CREATE INDEX "services_items_parent_id_idx" ON "portfolio"."services_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "services_legacy_id_idx" ON "portfolio"."services" USING btree ("legacy_id");
  CREATE INDEX "services_updated_at_idx" ON "portfolio"."services" USING btree ("updated_at");
  CREATE INDEX "services_created_at_idx" ON "portfolio"."services" USING btree ("created_at");
  CREATE INDEX "services__status_idx" ON "portfolio"."services" USING btree ("_status");
  CREATE INDEX "_services_v_version_items_order_idx" ON "portfolio"."_services_v_version_items" USING btree ("_order");
  CREATE INDEX "_services_v_version_items_parent_id_idx" ON "portfolio"."_services_v_version_items" USING btree ("_parent_id");
  CREATE INDEX "_services_v_parent_idx" ON "portfolio"."_services_v" USING btree ("parent_id");
  CREATE INDEX "_services_v_version_version_legacy_id_idx" ON "portfolio"."_services_v" USING btree ("version_legacy_id");
  CREATE INDEX "_services_v_version_version_updated_at_idx" ON "portfolio"."_services_v" USING btree ("version_updated_at");
  CREATE INDEX "_services_v_version_version_created_at_idx" ON "portfolio"."_services_v" USING btree ("version_created_at");
  CREATE INDEX "_services_v_version_version__status_idx" ON "portfolio"."_services_v" USING btree ("version__status");
  CREATE INDEX "_services_v_created_at_idx" ON "portfolio"."_services_v" USING btree ("created_at");
  CREATE INDEX "_services_v_updated_at_idx" ON "portfolio"."_services_v" USING btree ("updated_at");
  CREATE INDEX "_services_v_latest_idx" ON "portfolio"."_services_v" USING btree ("latest");
  CREATE INDEX "awards_logo_idx" ON "portfolio"."awards" USING btree ("logo_id");
  CREATE UNIQUE INDEX "awards_legacy_id_idx" ON "portfolio"."awards" USING btree ("legacy_id");
  CREATE INDEX "awards_updated_at_idx" ON "portfolio"."awards" USING btree ("updated_at");
  CREATE INDEX "awards_created_at_idx" ON "portfolio"."awards" USING btree ("created_at");
  CREATE INDEX "awards__status_idx" ON "portfolio"."awards" USING btree ("_status");
  CREATE INDEX "_awards_v_parent_idx" ON "portfolio"."_awards_v" USING btree ("parent_id");
  CREATE INDEX "_awards_v_version_version_logo_idx" ON "portfolio"."_awards_v" USING btree ("version_logo_id");
  CREATE INDEX "_awards_v_version_version_legacy_id_idx" ON "portfolio"."_awards_v" USING btree ("version_legacy_id");
  CREATE INDEX "_awards_v_version_version_updated_at_idx" ON "portfolio"."_awards_v" USING btree ("version_updated_at");
  CREATE INDEX "_awards_v_version_version_created_at_idx" ON "portfolio"."_awards_v" USING btree ("version_created_at");
  CREATE INDEX "_awards_v_version_version__status_idx" ON "portfolio"."_awards_v" USING btree ("version__status");
  CREATE INDEX "_awards_v_created_at_idx" ON "portfolio"."_awards_v" USING btree ("created_at");
  CREATE INDEX "_awards_v_updated_at_idx" ON "portfolio"."_awards_v" USING btree ("updated_at");
  CREATE INDEX "_awards_v_latest_idx" ON "portfolio"."_awards_v" USING btree ("latest");
  CREATE INDEX "testimonials_avatar_idx" ON "portfolio"."testimonials" USING btree ("avatar_id");
  CREATE UNIQUE INDEX "testimonials_legacy_id_idx" ON "portfolio"."testimonials" USING btree ("legacy_id");
  CREATE INDEX "testimonials_updated_at_idx" ON "portfolio"."testimonials" USING btree ("updated_at");
  CREATE INDEX "testimonials_created_at_idx" ON "portfolio"."testimonials" USING btree ("created_at");
  CREATE INDEX "testimonials__status_idx" ON "portfolio"."testimonials" USING btree ("_status");
  CREATE INDEX "_testimonials_v_parent_idx" ON "portfolio"."_testimonials_v" USING btree ("parent_id");
  CREATE INDEX "_testimonials_v_version_version_avatar_idx" ON "portfolio"."_testimonials_v" USING btree ("version_avatar_id");
  CREATE INDEX "_testimonials_v_version_version_legacy_id_idx" ON "portfolio"."_testimonials_v" USING btree ("version_legacy_id");
  CREATE INDEX "_testimonials_v_version_version_updated_at_idx" ON "portfolio"."_testimonials_v" USING btree ("version_updated_at");
  CREATE INDEX "_testimonials_v_version_version_created_at_idx" ON "portfolio"."_testimonials_v" USING btree ("version_created_at");
  CREATE INDEX "_testimonials_v_version_version__status_idx" ON "portfolio"."_testimonials_v" USING btree ("version__status");
  CREATE INDEX "_testimonials_v_created_at_idx" ON "portfolio"."_testimonials_v" USING btree ("created_at");
  CREATE INDEX "_testimonials_v_updated_at_idx" ON "portfolio"."_testimonials_v" USING btree ("updated_at");
  CREATE INDEX "_testimonials_v_latest_idx" ON "portfolio"."_testimonials_v" USING btree ("latest");
  CREATE INDEX "pricing_plans_features_order_idx" ON "portfolio"."pricing_plans_features" USING btree ("_order");
  CREATE INDEX "pricing_plans_features_parent_id_idx" ON "portfolio"."pricing_plans_features" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pricing_plans_legacy_id_idx" ON "portfolio"."pricing_plans" USING btree ("legacy_id");
  CREATE INDEX "pricing_plans_updated_at_idx" ON "portfolio"."pricing_plans" USING btree ("updated_at");
  CREATE INDEX "pricing_plans_created_at_idx" ON "portfolio"."pricing_plans" USING btree ("created_at");
  CREATE INDEX "pricing_plans__status_idx" ON "portfolio"."pricing_plans" USING btree ("_status");
  CREATE INDEX "_pricing_plans_v_version_features_order_idx" ON "portfolio"."_pricing_plans_v_version_features" USING btree ("_order");
  CREATE INDEX "_pricing_plans_v_version_features_parent_id_idx" ON "portfolio"."_pricing_plans_v_version_features" USING btree ("_parent_id");
  CREATE INDEX "_pricing_plans_v_parent_idx" ON "portfolio"."_pricing_plans_v" USING btree ("parent_id");
  CREATE INDEX "_pricing_plans_v_version_version_legacy_id_idx" ON "portfolio"."_pricing_plans_v" USING btree ("version_legacy_id");
  CREATE INDEX "_pricing_plans_v_version_version_updated_at_idx" ON "portfolio"."_pricing_plans_v" USING btree ("version_updated_at");
  CREATE INDEX "_pricing_plans_v_version_version_created_at_idx" ON "portfolio"."_pricing_plans_v" USING btree ("version_created_at");
  CREATE INDEX "_pricing_plans_v_version_version__status_idx" ON "portfolio"."_pricing_plans_v" USING btree ("version__status");
  CREATE INDEX "_pricing_plans_v_created_at_idx" ON "portfolio"."_pricing_plans_v" USING btree ("created_at");
  CREATE INDEX "_pricing_plans_v_updated_at_idx" ON "portfolio"."_pricing_plans_v" USING btree ("updated_at");
  CREATE INDEX "_pricing_plans_v_latest_idx" ON "portfolio"."_pricing_plans_v" USING btree ("latest");
  CREATE UNIQUE INDEX "posts_slug_idx" ON "portfolio"."posts" USING btree ("slug");
  CREATE INDEX "posts_cover_idx" ON "portfolio"."posts" USING btree ("cover_id");
  CREATE UNIQUE INDEX "posts_legacy_id_idx" ON "portfolio"."posts" USING btree ("legacy_id");
  CREATE INDEX "posts_updated_at_idx" ON "portfolio"."posts" USING btree ("updated_at");
  CREATE INDEX "posts_created_at_idx" ON "portfolio"."posts" USING btree ("created_at");
  CREATE INDEX "posts__status_idx" ON "portfolio"."posts" USING btree ("_status");
  CREATE INDEX "_posts_v_parent_idx" ON "portfolio"."_posts_v" USING btree ("parent_id");
  CREATE INDEX "_posts_v_version_version_slug_idx" ON "portfolio"."_posts_v" USING btree ("version_slug");
  CREATE INDEX "_posts_v_version_version_cover_idx" ON "portfolio"."_posts_v" USING btree ("version_cover_id");
  CREATE INDEX "_posts_v_version_version_legacy_id_idx" ON "portfolio"."_posts_v" USING btree ("version_legacy_id");
  CREATE INDEX "_posts_v_version_version_updated_at_idx" ON "portfolio"."_posts_v" USING btree ("version_updated_at");
  CREATE INDEX "_posts_v_version_version_created_at_idx" ON "portfolio"."_posts_v" USING btree ("version_created_at");
  CREATE INDEX "_posts_v_version_version__status_idx" ON "portfolio"."_posts_v" USING btree ("version__status");
  CREATE INDEX "_posts_v_created_at_idx" ON "portfolio"."_posts_v" USING btree ("created_at");
  CREATE INDEX "_posts_v_updated_at_idx" ON "portfolio"."_posts_v" USING btree ("updated_at");
  CREATE INDEX "_posts_v_latest_idx" ON "portfolio"."_posts_v" USING btree ("latest");
  ALTER TABLE "portfolio"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "portfolio"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "portfolio"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_awards_fk" FOREIGN KEY ("awards_id") REFERENCES "portfolio"."awards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "portfolio"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_testimonials_fk" FOREIGN KEY ("testimonials_id") REFERENCES "portfolio"."testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "portfolio"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pricing_plans_fk" FOREIGN KEY ("pricing_plans_id") REFERENCES "portfolio"."pricing_plans"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "portfolio"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "portfolio"."posts"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_services_id_idx" ON "portfolio"."payload_locked_documents_rels" USING btree ("services_id");
  CREATE INDEX "payload_locked_documents_rels_awards_id_idx" ON "portfolio"."payload_locked_documents_rels" USING btree ("awards_id");
  CREATE INDEX "payload_locked_documents_rels_testimonials_id_idx" ON "portfolio"."payload_locked_documents_rels" USING btree ("testimonials_id");
  CREATE INDEX "payload_locked_documents_rels_pricing_plans_id_idx" ON "portfolio"."payload_locked_documents_rels" USING btree ("pricing_plans_id");
  CREATE INDEX "payload_locked_documents_rels_posts_id_idx" ON "portfolio"."payload_locked_documents_rels" USING btree ("posts_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "portfolio"."services_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "portfolio"."services" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "portfolio"."_services_v_version_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "portfolio"."_services_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "portfolio"."awards" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "portfolio"."_awards_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "portfolio"."testimonials" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "portfolio"."_testimonials_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "portfolio"."pricing_plans_features" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "portfolio"."pricing_plans" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "portfolio"."_pricing_plans_v_version_features" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "portfolio"."_pricing_plans_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "portfolio"."posts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "portfolio"."_posts_v" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "portfolio"."services_items" CASCADE;
  DROP TABLE "portfolio"."services" CASCADE;
  DROP TABLE "portfolio"."_services_v_version_items" CASCADE;
  DROP TABLE "portfolio"."_services_v" CASCADE;
  DROP TABLE "portfolio"."awards" CASCADE;
  DROP TABLE "portfolio"."_awards_v" CASCADE;
  DROP TABLE "portfolio"."testimonials" CASCADE;
  DROP TABLE "portfolio"."_testimonials_v" CASCADE;
  DROP TABLE "portfolio"."pricing_plans_features" CASCADE;
  DROP TABLE "portfolio"."pricing_plans" CASCADE;
  DROP TABLE "portfolio"."_pricing_plans_v_version_features" CASCADE;
  DROP TABLE "portfolio"."_pricing_plans_v" CASCADE;
  DROP TABLE "portfolio"."posts" CASCADE;
  DROP TABLE "portfolio"."_posts_v" CASCADE;
  ALTER TABLE "portfolio"."payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_services_fk";
  
  ALTER TABLE "portfolio"."payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_awards_fk";
  
  ALTER TABLE "portfolio"."payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_testimonials_fk";
  
  ALTER TABLE "portfolio"."payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_pricing_plans_fk";
  
  ALTER TABLE "portfolio"."payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_posts_fk";
  
  ALTER TABLE "portfolio"."site_settings_navigation" ALTER COLUMN "target" SET DATA TYPE text;
  DROP TYPE "portfolio"."enum_site_settings_navigation_target";
  CREATE TYPE "portfolio"."enum_site_settings_navigation_target" AS ENUM('projects', 'skills', 'process', 'about', 'contact');
  ALTER TABLE "portfolio"."site_settings_navigation" ALTER COLUMN "target" SET DATA TYPE "portfolio"."enum_site_settings_navigation_target" USING "target"::"portfolio"."enum_site_settings_navigation_target";
  ALTER TABLE "portfolio"."site_settings_sections" ALTER COLUMN "key" SET DATA TYPE text;
  DROP TYPE "portfolio"."enum_site_settings_sections_key";
  CREATE TYPE "portfolio"."enum_site_settings_sections_key" AS ENUM('projects', 'skills', 'process', 'about', 'contact');
  ALTER TABLE "portfolio"."site_settings_sections" ALTER COLUMN "key" SET DATA TYPE "portfolio"."enum_site_settings_sections_key" USING "key"::"portfolio"."enum_site_settings_sections_key";
  ALTER TABLE "portfolio"."_site_settings_v_version_navigation" ALTER COLUMN "target" SET DATA TYPE text;
  DROP TYPE "portfolio"."enum__site_settings_v_version_navigation_target";
  CREATE TYPE "portfolio"."enum__site_settings_v_version_navigation_target" AS ENUM('projects', 'skills', 'process', 'about', 'contact');
  ALTER TABLE "portfolio"."_site_settings_v_version_navigation" ALTER COLUMN "target" SET DATA TYPE "portfolio"."enum__site_settings_v_version_navigation_target" USING "target"::"portfolio"."enum__site_settings_v_version_navigation_target";
  ALTER TABLE "portfolio"."_site_settings_v_version_sections" ALTER COLUMN "key" SET DATA TYPE text;
  DROP TYPE "portfolio"."enum__site_settings_v_version_sections_key";
  CREATE TYPE "portfolio"."enum__site_settings_v_version_sections_key" AS ENUM('projects', 'skills', 'process', 'about', 'contact');
  ALTER TABLE "portfolio"."_site_settings_v_version_sections" ALTER COLUMN "key" SET DATA TYPE "portfolio"."enum__site_settings_v_version_sections_key" USING "key"::"portfolio"."enum__site_settings_v_version_sections_key";
  DROP INDEX "portfolio"."payload_locked_documents_rels_services_id_idx";
  DROP INDEX "portfolio"."payload_locked_documents_rels_awards_id_idx";
  DROP INDEX "portfolio"."payload_locked_documents_rels_testimonials_id_idx";
  DROP INDEX "portfolio"."payload_locked_documents_rels_pricing_plans_id_idx";
  DROP INDEX "portfolio"."payload_locked_documents_rels_posts_id_idx";
  ALTER TABLE "portfolio"."payload_locked_documents_rels" DROP COLUMN "services_id";
  ALTER TABLE "portfolio"."payload_locked_documents_rels" DROP COLUMN "awards_id";
  ALTER TABLE "portfolio"."payload_locked_documents_rels" DROP COLUMN "testimonials_id";
  ALTER TABLE "portfolio"."payload_locked_documents_rels" DROP COLUMN "pricing_plans_id";
  ALTER TABLE "portfolio"."payload_locked_documents_rels" DROP COLUMN "posts_id";
  ALTER TABLE "portfolio"."site_settings" DROP COLUMN "appearance_accent";
  ALTER TABLE "portfolio"."site_settings" DROP COLUMN "appearance_social_rail";
  ALTER TABLE "portfolio"."site_settings" DROP COLUMN "appearance_primary_label";
  ALTER TABLE "portfolio"."site_settings" DROP COLUMN "appearance_secondary_label";
  ALTER TABLE "portfolio"."site_settings" DROP COLUMN "appearance_footer_headline";
  ALTER TABLE "portfolio"."site_settings" DROP COLUMN "optional_sections_services";
  ALTER TABLE "portfolio"."site_settings" DROP COLUMN "optional_sections_awards";
  ALTER TABLE "portfolio"."site_settings" DROP COLUMN "optional_sections_pricing";
  ALTER TABLE "portfolio"."site_settings" DROP COLUMN "optional_sections_testimonials";
  ALTER TABLE "portfolio"."site_settings" DROP COLUMN "optional_sections_blog";
  ALTER TABLE "portfolio"."_site_settings_v" DROP COLUMN "version_appearance_accent";
  ALTER TABLE "portfolio"."_site_settings_v" DROP COLUMN "version_appearance_social_rail";
  ALTER TABLE "portfolio"."_site_settings_v" DROP COLUMN "version_appearance_primary_label";
  ALTER TABLE "portfolio"."_site_settings_v" DROP COLUMN "version_appearance_secondary_label";
  ALTER TABLE "portfolio"."_site_settings_v" DROP COLUMN "version_appearance_footer_headline";
  ALTER TABLE "portfolio"."_site_settings_v" DROP COLUMN "version_optional_sections_services";
  ALTER TABLE "portfolio"."_site_settings_v" DROP COLUMN "version_optional_sections_awards";
  ALTER TABLE "portfolio"."_site_settings_v" DROP COLUMN "version_optional_sections_pricing";
  ALTER TABLE "portfolio"."_site_settings_v" DROP COLUMN "version_optional_sections_testimonials";
  ALTER TABLE "portfolio"."_site_settings_v" DROP COLUMN "version_optional_sections_blog";
  DROP TYPE "portfolio"."enum_services_icon";
  DROP TYPE "portfolio"."enum_services_status";
  DROP TYPE "portfolio"."enum__services_v_version_icon";
  DROP TYPE "portfolio"."enum__services_v_version_status";
  DROP TYPE "portfolio"."enum_awards_status";
  DROP TYPE "portfolio"."enum__awards_v_version_status";
  DROP TYPE "portfolio"."enum_testimonials_status";
  DROP TYPE "portfolio"."enum__testimonials_v_version_status";
  DROP TYPE "portfolio"."enum_pricing_plans_status";
  DROP TYPE "portfolio"."enum__pricing_plans_v_version_status";
  DROP TYPE "portfolio"."enum_posts_status";
  DROP TYPE "portfolio"."enum__posts_v_version_status";
  DROP TYPE "portfolio"."enum_site_settings_appearance_accent";
  DROP TYPE "portfolio"."enum__site_settings_v_version_appearance_accent";`)
}
