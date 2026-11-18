import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE SCHEMA IF NOT EXISTS "portfolio";
  CREATE TYPE "portfolio"."enum_media_visibility" AS ENUM('private', 'public');
  CREATE TYPE "portfolio"."enum_projects_stage" AS ENUM('concept', 'in-progress', 'completed');
  CREATE TYPE "portfolio"."enum_projects_status" AS ENUM('draft', 'published');
  CREATE TYPE "portfolio"."enum__projects_v_version_stage" AS ENUM('concept', 'in-progress', 'completed');
  CREATE TYPE "portfolio"."enum__projects_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "portfolio"."enum_skills_status" AS ENUM('draft', 'published');
  CREATE TYPE "portfolio"."enum__skills_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "portfolio"."enum_process_steps_status" AS ENUM('draft', 'published');
  CREATE TYPE "portfolio"."enum__process_steps_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "portfolio"."enum_experiences_status" AS ENUM('draft', 'published');
  CREATE TYPE "portfolio"."enum__experiences_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "portfolio"."enum_education_status" AS ENUM('draft', 'published');
  CREATE TYPE "portfolio"."enum__education_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "portfolio"."enum_profile_status" AS ENUM('draft', 'published');
  CREATE TYPE "portfolio"."enum__profile_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "portfolio"."enum_site_settings_navigation_target" AS ENUM('projects', 'skills', 'process', 'about', 'contact');
  CREATE TYPE "portfolio"."enum_site_settings_sections_key" AS ENUM('projects', 'skills', 'process', 'about', 'contact');
  CREATE TYPE "portfolio"."enum_site_settings_status" AS ENUM('draft', 'published');
  CREATE TYPE "portfolio"."enum__site_settings_v_version_navigation_target" AS ENUM('projects', 'skills', 'process', 'about', 'contact');
  CREATE TYPE "portfolio"."enum__site_settings_v_version_sections_key" AS ENUM('projects', 'skills', 'process', 'about', 'contact');
  CREATE TYPE "portfolio"."enum__site_settings_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "portfolio"."users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "portfolio"."users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"reset_password_requested_at" timestamp(3) with time zone,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "portfolio"."media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"alt" varchar,
  	"visibility" "portfolio"."enum_media_visibility" DEFAULT 'private' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "portfolio"."projects_technologies" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar
  );
  
  CREATE TABLE "portfolio"."projects" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"stage" "portfolio"."enum_projects_stage" DEFAULT 'concept',
  	"category" varchar,
  	"summary" varchar,
  	"context" varchar,
  	"contribution" varchar,
  	"outcome" varchar,
  	"limitations" varchar,
  	"scope" varchar,
  	"cover_id" integer,
  	"demo_u_r_l" varchar,
  	"repository_u_r_l" varchar,
  	"featured" boolean DEFAULT false,
  	"legacy_id" varchar,
  	"order" numeric DEFAULT 0,
  	"archived" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "portfolio"."enum_projects_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "portfolio"."_projects_v_version_technologies" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "portfolio"."_projects_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_stage" "portfolio"."enum__projects_v_version_stage" DEFAULT 'concept',
  	"version_category" varchar,
  	"version_summary" varchar,
  	"version_context" varchar,
  	"version_contribution" varchar,
  	"version_outcome" varchar,
  	"version_limitations" varchar,
  	"version_scope" varchar,
  	"version_cover_id" integer,
  	"version_demo_u_r_l" varchar,
  	"version_repository_u_r_l" varchar,
  	"version_featured" boolean DEFAULT false,
  	"version_legacy_id" varchar,
  	"version_order" numeric DEFAULT 0,
  	"version_archived" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "portfolio"."enum__projects_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "portfolio"."skills_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar
  );
  
  CREATE TABLE "portfolio"."skills" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"mark" varchar,
  	"legacy_id" varchar,
  	"order" numeric DEFAULT 0,
  	"archived" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "portfolio"."enum_skills_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "portfolio"."_skills_v_version_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "portfolio"."_skills_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_description" varchar,
  	"version_mark" varchar,
  	"version_legacy_id" varchar,
  	"version_order" numeric DEFAULT 0,
  	"version_archived" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "portfolio"."enum__skills_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "portfolio"."process_steps" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"label" varchar,
  	"description" varchar,
  	"legacy_id" varchar,
  	"order" numeric DEFAULT 0,
  	"archived" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "portfolio"."enum_process_steps_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "portfolio"."_process_steps_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_label" varchar,
  	"version_description" varchar,
  	"version_legacy_id" varchar,
  	"version_order" numeric DEFAULT 0,
  	"version_archived" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "portfolio"."enum__process_steps_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "portfolio"."experiences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"period" varchar,
  	"kind" varchar,
  	"institution" varchar,
  	"description" varchar,
  	"contribution" varchar,
  	"evidence_u_r_l" varchar,
  	"legacy_id" varchar,
  	"order" numeric DEFAULT 0,
  	"archived" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "portfolio"."enum_experiences_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "portfolio"."_experiences_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_period" varchar,
  	"version_kind" varchar,
  	"version_institution" varchar,
  	"version_description" varchar,
  	"version_contribution" varchar,
  	"version_evidence_u_r_l" varchar,
  	"version_legacy_id" varchar,
  	"version_order" numeric DEFAULT 0,
  	"version_archived" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "portfolio"."enum__experiences_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "portfolio"."education" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"institution" varchar,
  	"period" varchar,
  	"education_status" varchar,
  	"legacy_id" varchar,
  	"order" numeric DEFAULT 0,
  	"archived" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "portfolio"."enum_education_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "portfolio"."_education_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_institution" varchar,
  	"version_period" varchar,
  	"version_education_status" varchar,
  	"version_legacy_id" varchar,
  	"version_order" numeric DEFAULT 0,
  	"version_archived" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "portfolio"."enum__education_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "portfolio"."payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "portfolio"."payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "portfolio"."payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"media_id" integer,
  	"projects_id" integer,
  	"skills_id" integer,
  	"process_steps_id" integer,
  	"experiences_id" integer,
  	"education_id" integer
  );
  
  CREATE TABLE "portfolio"."payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "portfolio"."payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "portfolio"."payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "portfolio"."profile_social_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"url" varchar
  );
  
  CREATE TABLE "portfolio"."profile" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"imported" boolean,
  	"name" varchar,
  	"location" varchar,
  	"career" varchar,
  	"bio" varchar,
  	"email" varchar,
  	"phone" varchar,
  	"photo_id" integer,
  	"personal_photo_id" integer,
  	"personal_caption" varchar,
  	"resume_p_d_f_id" integer,
  	"_status" "portfolio"."enum_profile_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "portfolio"."_profile_v_version_social_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "portfolio"."_profile_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_imported" boolean,
  	"version_name" varchar,
  	"version_location" varchar,
  	"version_career" varchar,
  	"version_bio" varchar,
  	"version_email" varchar,
  	"version_phone" varchar,
  	"version_photo_id" integer,
  	"version_personal_photo_id" integer,
  	"version_personal_caption" varchar,
  	"version_resume_p_d_f_id" integer,
  	"version__status" "portfolio"."enum__profile_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "portfolio"."site_settings_navigation" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"target" "portfolio"."enum_site_settings_navigation_target"
  );
  
  CREATE TABLE "portfolio"."site_settings_sections" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"key" "portfolio"."enum_site_settings_sections_key",
  	"eyebrow" varchar,
  	"title" varchar,
  	"accent" varchar,
  	"description" varchar,
  	"enabled" boolean DEFAULT true
  );
  
  CREATE TABLE "portfolio"."site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"imported" boolean,
  	"site_title" varchar,
  	"description" varchar,
  	"hero_greeting" varchar,
  	"hero_title" varchar,
  	"hero_accent" varchar,
  	"hero_description" varchar,
  	"notebook_title" varchar,
  	"query" varchar,
  	"query_note" varchar,
  	"footer_note" varchar,
  	"_status" "portfolio"."enum_site_settings_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "portfolio"."_site_settings_v_version_navigation" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"target" "portfolio"."enum__site_settings_v_version_navigation_target",
  	"_uuid" varchar
  );
  
  CREATE TABLE "portfolio"."_site_settings_v_version_sections" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" "portfolio"."enum__site_settings_v_version_sections_key",
  	"eyebrow" varchar,
  	"title" varchar,
  	"accent" varchar,
  	"description" varchar,
  	"enabled" boolean DEFAULT true,
  	"_uuid" varchar
  );
  
  CREATE TABLE "portfolio"."_site_settings_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_imported" boolean,
  	"version_site_title" varchar,
  	"version_description" varchar,
  	"version_hero_greeting" varchar,
  	"version_hero_title" varchar,
  	"version_hero_accent" varchar,
  	"version_hero_description" varchar,
  	"version_notebook_title" varchar,
  	"version_query" varchar,
  	"version_query_note" varchar,
  	"version_footer_note" varchar,
  	"version__status" "portfolio"."enum__site_settings_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  ALTER TABLE "portfolio"."users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "portfolio"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "portfolio"."projects_technologies" ADD CONSTRAINT "projects_technologies_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "portfolio"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "portfolio"."projects" ADD CONSTRAINT "projects_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "portfolio"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "portfolio"."_projects_v_version_technologies" ADD CONSTRAINT "_projects_v_version_technologies_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "portfolio"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "portfolio"."_projects_v" ADD CONSTRAINT "_projects_v_parent_id_projects_id_fk" FOREIGN KEY ("parent_id") REFERENCES "portfolio"."projects"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "portfolio"."_projects_v" ADD CONSTRAINT "_projects_v_version_cover_id_media_id_fk" FOREIGN KEY ("version_cover_id") REFERENCES "portfolio"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "portfolio"."skills_items" ADD CONSTRAINT "skills_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "portfolio"."skills"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "portfolio"."_skills_v_version_items" ADD CONSTRAINT "_skills_v_version_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "portfolio"."_skills_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "portfolio"."_skills_v" ADD CONSTRAINT "_skills_v_parent_id_skills_id_fk" FOREIGN KEY ("parent_id") REFERENCES "portfolio"."skills"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "portfolio"."_process_steps_v" ADD CONSTRAINT "_process_steps_v_parent_id_process_steps_id_fk" FOREIGN KEY ("parent_id") REFERENCES "portfolio"."process_steps"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "portfolio"."_experiences_v" ADD CONSTRAINT "_experiences_v_parent_id_experiences_id_fk" FOREIGN KEY ("parent_id") REFERENCES "portfolio"."experiences"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "portfolio"."_education_v" ADD CONSTRAINT "_education_v_parent_id_education_id_fk" FOREIGN KEY ("parent_id") REFERENCES "portfolio"."education"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "portfolio"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "portfolio"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "portfolio"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "portfolio"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "portfolio"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "portfolio"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "portfolio"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "portfolio"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "portfolio"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_skills_fk" FOREIGN KEY ("skills_id") REFERENCES "portfolio"."skills"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "portfolio"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_process_steps_fk" FOREIGN KEY ("process_steps_id") REFERENCES "portfolio"."process_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "portfolio"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_experiences_fk" FOREIGN KEY ("experiences_id") REFERENCES "portfolio"."experiences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "portfolio"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_education_fk" FOREIGN KEY ("education_id") REFERENCES "portfolio"."education"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "portfolio"."payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "portfolio"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "portfolio"."payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "portfolio"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "portfolio"."profile_social_links" ADD CONSTRAINT "profile_social_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "portfolio"."profile"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "portfolio"."profile" ADD CONSTRAINT "profile_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "portfolio"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "portfolio"."profile" ADD CONSTRAINT "profile_personal_photo_id_media_id_fk" FOREIGN KEY ("personal_photo_id") REFERENCES "portfolio"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "portfolio"."profile" ADD CONSTRAINT "profile_resume_p_d_f_id_media_id_fk" FOREIGN KEY ("resume_p_d_f_id") REFERENCES "portfolio"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "portfolio"."_profile_v_version_social_links" ADD CONSTRAINT "_profile_v_version_social_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "portfolio"."_profile_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "portfolio"."_profile_v" ADD CONSTRAINT "_profile_v_version_photo_id_media_id_fk" FOREIGN KEY ("version_photo_id") REFERENCES "portfolio"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "portfolio"."_profile_v" ADD CONSTRAINT "_profile_v_version_personal_photo_id_media_id_fk" FOREIGN KEY ("version_personal_photo_id") REFERENCES "portfolio"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "portfolio"."_profile_v" ADD CONSTRAINT "_profile_v_version_resume_p_d_f_id_media_id_fk" FOREIGN KEY ("version_resume_p_d_f_id") REFERENCES "portfolio"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "portfolio"."site_settings_navigation" ADD CONSTRAINT "site_settings_navigation_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "portfolio"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "portfolio"."site_settings_sections" ADD CONSTRAINT "site_settings_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "portfolio"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "portfolio"."_site_settings_v_version_navigation" ADD CONSTRAINT "_site_settings_v_version_navigation_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "portfolio"."_site_settings_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "portfolio"."_site_settings_v_version_sections" ADD CONSTRAINT "_site_settings_v_version_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "portfolio"."_site_settings_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_sessions_order_idx" ON "portfolio"."users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "portfolio"."users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "portfolio"."users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "portfolio"."users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "portfolio"."users" USING btree ("email");
  CREATE INDEX "media_updated_at_idx" ON "portfolio"."media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "portfolio"."media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "portfolio"."media" USING btree ("filename");
  CREATE INDEX "projects_technologies_order_idx" ON "portfolio"."projects_technologies" USING btree ("_order");
  CREATE INDEX "projects_technologies_parent_id_idx" ON "portfolio"."projects_technologies" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "projects_slug_idx" ON "portfolio"."projects" USING btree ("slug");
  CREATE INDEX "projects_cover_idx" ON "portfolio"."projects" USING btree ("cover_id");
  CREATE UNIQUE INDEX "projects_legacy_id_idx" ON "portfolio"."projects" USING btree ("legacy_id");
  CREATE INDEX "projects_updated_at_idx" ON "portfolio"."projects" USING btree ("updated_at");
  CREATE INDEX "projects_created_at_idx" ON "portfolio"."projects" USING btree ("created_at");
  CREATE INDEX "projects__status_idx" ON "portfolio"."projects" USING btree ("_status");
  CREATE INDEX "_projects_v_version_technologies_order_idx" ON "portfolio"."_projects_v_version_technologies" USING btree ("_order");
  CREATE INDEX "_projects_v_version_technologies_parent_id_idx" ON "portfolio"."_projects_v_version_technologies" USING btree ("_parent_id");
  CREATE INDEX "_projects_v_parent_idx" ON "portfolio"."_projects_v" USING btree ("parent_id");
  CREATE INDEX "_projects_v_version_version_slug_idx" ON "portfolio"."_projects_v" USING btree ("version_slug");
  CREATE INDEX "_projects_v_version_version_cover_idx" ON "portfolio"."_projects_v" USING btree ("version_cover_id");
  CREATE INDEX "_projects_v_version_version_legacy_id_idx" ON "portfolio"."_projects_v" USING btree ("version_legacy_id");
  CREATE INDEX "_projects_v_version_version_updated_at_idx" ON "portfolio"."_projects_v" USING btree ("version_updated_at");
  CREATE INDEX "_projects_v_version_version_created_at_idx" ON "portfolio"."_projects_v" USING btree ("version_created_at");
  CREATE INDEX "_projects_v_version_version__status_idx" ON "portfolio"."_projects_v" USING btree ("version__status");
  CREATE INDEX "_projects_v_created_at_idx" ON "portfolio"."_projects_v" USING btree ("created_at");
  CREATE INDEX "_projects_v_updated_at_idx" ON "portfolio"."_projects_v" USING btree ("updated_at");
  CREATE INDEX "_projects_v_latest_idx" ON "portfolio"."_projects_v" USING btree ("latest");
  CREATE INDEX "skills_items_order_idx" ON "portfolio"."skills_items" USING btree ("_order");
  CREATE INDEX "skills_items_parent_id_idx" ON "portfolio"."skills_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "skills_legacy_id_idx" ON "portfolio"."skills" USING btree ("legacy_id");
  CREATE INDEX "skills_updated_at_idx" ON "portfolio"."skills" USING btree ("updated_at");
  CREATE INDEX "skills_created_at_idx" ON "portfolio"."skills" USING btree ("created_at");
  CREATE INDEX "skills__status_idx" ON "portfolio"."skills" USING btree ("_status");
  CREATE INDEX "_skills_v_version_items_order_idx" ON "portfolio"."_skills_v_version_items" USING btree ("_order");
  CREATE INDEX "_skills_v_version_items_parent_id_idx" ON "portfolio"."_skills_v_version_items" USING btree ("_parent_id");
  CREATE INDEX "_skills_v_parent_idx" ON "portfolio"."_skills_v" USING btree ("parent_id");
  CREATE INDEX "_skills_v_version_version_legacy_id_idx" ON "portfolio"."_skills_v" USING btree ("version_legacy_id");
  CREATE INDEX "_skills_v_version_version_updated_at_idx" ON "portfolio"."_skills_v" USING btree ("version_updated_at");
  CREATE INDEX "_skills_v_version_version_created_at_idx" ON "portfolio"."_skills_v" USING btree ("version_created_at");
  CREATE INDEX "_skills_v_version_version__status_idx" ON "portfolio"."_skills_v" USING btree ("version__status");
  CREATE INDEX "_skills_v_created_at_idx" ON "portfolio"."_skills_v" USING btree ("created_at");
  CREATE INDEX "_skills_v_updated_at_idx" ON "portfolio"."_skills_v" USING btree ("updated_at");
  CREATE INDEX "_skills_v_latest_idx" ON "portfolio"."_skills_v" USING btree ("latest");
  CREATE UNIQUE INDEX "process_steps_legacy_id_idx" ON "portfolio"."process_steps" USING btree ("legacy_id");
  CREATE INDEX "process_steps_updated_at_idx" ON "portfolio"."process_steps" USING btree ("updated_at");
  CREATE INDEX "process_steps_created_at_idx" ON "portfolio"."process_steps" USING btree ("created_at");
  CREATE INDEX "process_steps__status_idx" ON "portfolio"."process_steps" USING btree ("_status");
  CREATE INDEX "_process_steps_v_parent_idx" ON "portfolio"."_process_steps_v" USING btree ("parent_id");
  CREATE INDEX "_process_steps_v_version_version_legacy_id_idx" ON "portfolio"."_process_steps_v" USING btree ("version_legacy_id");
  CREATE INDEX "_process_steps_v_version_version_updated_at_idx" ON "portfolio"."_process_steps_v" USING btree ("version_updated_at");
  CREATE INDEX "_process_steps_v_version_version_created_at_idx" ON "portfolio"."_process_steps_v" USING btree ("version_created_at");
  CREATE INDEX "_process_steps_v_version_version__status_idx" ON "portfolio"."_process_steps_v" USING btree ("version__status");
  CREATE INDEX "_process_steps_v_created_at_idx" ON "portfolio"."_process_steps_v" USING btree ("created_at");
  CREATE INDEX "_process_steps_v_updated_at_idx" ON "portfolio"."_process_steps_v" USING btree ("updated_at");
  CREATE INDEX "_process_steps_v_latest_idx" ON "portfolio"."_process_steps_v" USING btree ("latest");
  CREATE UNIQUE INDEX "experiences_legacy_id_idx" ON "portfolio"."experiences" USING btree ("legacy_id");
  CREATE INDEX "experiences_updated_at_idx" ON "portfolio"."experiences" USING btree ("updated_at");
  CREATE INDEX "experiences_created_at_idx" ON "portfolio"."experiences" USING btree ("created_at");
  CREATE INDEX "experiences__status_idx" ON "portfolio"."experiences" USING btree ("_status");
  CREATE INDEX "_experiences_v_parent_idx" ON "portfolio"."_experiences_v" USING btree ("parent_id");
  CREATE INDEX "_experiences_v_version_version_legacy_id_idx" ON "portfolio"."_experiences_v" USING btree ("version_legacy_id");
  CREATE INDEX "_experiences_v_version_version_updated_at_idx" ON "portfolio"."_experiences_v" USING btree ("version_updated_at");
  CREATE INDEX "_experiences_v_version_version_created_at_idx" ON "portfolio"."_experiences_v" USING btree ("version_created_at");
  CREATE INDEX "_experiences_v_version_version__status_idx" ON "portfolio"."_experiences_v" USING btree ("version__status");
  CREATE INDEX "_experiences_v_created_at_idx" ON "portfolio"."_experiences_v" USING btree ("created_at");
  CREATE INDEX "_experiences_v_updated_at_idx" ON "portfolio"."_experiences_v" USING btree ("updated_at");
  CREATE INDEX "_experiences_v_latest_idx" ON "portfolio"."_experiences_v" USING btree ("latest");
  CREATE UNIQUE INDEX "education_legacy_id_idx" ON "portfolio"."education" USING btree ("legacy_id");
  CREATE INDEX "education_updated_at_idx" ON "portfolio"."education" USING btree ("updated_at");
  CREATE INDEX "education_created_at_idx" ON "portfolio"."education" USING btree ("created_at");
  CREATE INDEX "education__status_idx" ON "portfolio"."education" USING btree ("_status");
  CREATE INDEX "_education_v_parent_idx" ON "portfolio"."_education_v" USING btree ("parent_id");
  CREATE INDEX "_education_v_version_version_legacy_id_idx" ON "portfolio"."_education_v" USING btree ("version_legacy_id");
  CREATE INDEX "_education_v_version_version_updated_at_idx" ON "portfolio"."_education_v" USING btree ("version_updated_at");
  CREATE INDEX "_education_v_version_version_created_at_idx" ON "portfolio"."_education_v" USING btree ("version_created_at");
  CREATE INDEX "_education_v_version_version__status_idx" ON "portfolio"."_education_v" USING btree ("version__status");
  CREATE INDEX "_education_v_created_at_idx" ON "portfolio"."_education_v" USING btree ("created_at");
  CREATE INDEX "_education_v_updated_at_idx" ON "portfolio"."_education_v" USING btree ("updated_at");
  CREATE INDEX "_education_v_latest_idx" ON "portfolio"."_education_v" USING btree ("latest");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "portfolio"."payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "portfolio"."payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "portfolio"."payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "portfolio"."payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "portfolio"."payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "portfolio"."payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "portfolio"."payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "portfolio"."payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "portfolio"."payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_projects_id_idx" ON "portfolio"."payload_locked_documents_rels" USING btree ("projects_id");
  CREATE INDEX "payload_locked_documents_rels_skills_id_idx" ON "portfolio"."payload_locked_documents_rels" USING btree ("skills_id");
  CREATE INDEX "payload_locked_documents_rels_process_steps_id_idx" ON "portfolio"."payload_locked_documents_rels" USING btree ("process_steps_id");
  CREATE INDEX "payload_locked_documents_rels_experiences_id_idx" ON "portfolio"."payload_locked_documents_rels" USING btree ("experiences_id");
  CREATE INDEX "payload_locked_documents_rels_education_id_idx" ON "portfolio"."payload_locked_documents_rels" USING btree ("education_id");
  CREATE INDEX "payload_preferences_key_idx" ON "portfolio"."payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "portfolio"."payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "portfolio"."payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "portfolio"."payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "portfolio"."payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "portfolio"."payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "portfolio"."payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "portfolio"."payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "portfolio"."payload_migrations" USING btree ("created_at");
  CREATE INDEX "profile_social_links_order_idx" ON "portfolio"."profile_social_links" USING btree ("_order");
  CREATE INDEX "profile_social_links_parent_id_idx" ON "portfolio"."profile_social_links" USING btree ("_parent_id");
  CREATE INDEX "profile_photo_idx" ON "portfolio"."profile" USING btree ("photo_id");
  CREATE INDEX "profile_personal_photo_idx" ON "portfolio"."profile" USING btree ("personal_photo_id");
  CREATE INDEX "profile_resume_p_d_f_idx" ON "portfolio"."profile" USING btree ("resume_p_d_f_id");
  CREATE INDEX "profile__status_idx" ON "portfolio"."profile" USING btree ("_status");
  CREATE INDEX "_profile_v_version_social_links_order_idx" ON "portfolio"."_profile_v_version_social_links" USING btree ("_order");
  CREATE INDEX "_profile_v_version_social_links_parent_id_idx" ON "portfolio"."_profile_v_version_social_links" USING btree ("_parent_id");
  CREATE INDEX "_profile_v_version_version_photo_idx" ON "portfolio"."_profile_v" USING btree ("version_photo_id");
  CREATE INDEX "_profile_v_version_version_personal_photo_idx" ON "portfolio"."_profile_v" USING btree ("version_personal_photo_id");
  CREATE INDEX "_profile_v_version_version_resume_p_d_f_idx" ON "portfolio"."_profile_v" USING btree ("version_resume_p_d_f_id");
  CREATE INDEX "_profile_v_version_version__status_idx" ON "portfolio"."_profile_v" USING btree ("version__status");
  CREATE INDEX "_profile_v_created_at_idx" ON "portfolio"."_profile_v" USING btree ("created_at");
  CREATE INDEX "_profile_v_updated_at_idx" ON "portfolio"."_profile_v" USING btree ("updated_at");
  CREATE INDEX "_profile_v_latest_idx" ON "portfolio"."_profile_v" USING btree ("latest");
  CREATE INDEX "site_settings_navigation_order_idx" ON "portfolio"."site_settings_navigation" USING btree ("_order");
  CREATE INDEX "site_settings_navigation_parent_id_idx" ON "portfolio"."site_settings_navigation" USING btree ("_parent_id");
  CREATE INDEX "site_settings_sections_order_idx" ON "portfolio"."site_settings_sections" USING btree ("_order");
  CREATE INDEX "site_settings_sections_parent_id_idx" ON "portfolio"."site_settings_sections" USING btree ("_parent_id");
  CREATE INDEX "site_settings__status_idx" ON "portfolio"."site_settings" USING btree ("_status");
  CREATE INDEX "_site_settings_v_version_navigation_order_idx" ON "portfolio"."_site_settings_v_version_navigation" USING btree ("_order");
  CREATE INDEX "_site_settings_v_version_navigation_parent_id_idx" ON "portfolio"."_site_settings_v_version_navigation" USING btree ("_parent_id");
  CREATE INDEX "_site_settings_v_version_sections_order_idx" ON "portfolio"."_site_settings_v_version_sections" USING btree ("_order");
  CREATE INDEX "_site_settings_v_version_sections_parent_id_idx" ON "portfolio"."_site_settings_v_version_sections" USING btree ("_parent_id");
  CREATE INDEX "_site_settings_v_version_version__status_idx" ON "portfolio"."_site_settings_v" USING btree ("version__status");
  CREATE INDEX "_site_settings_v_created_at_idx" ON "portfolio"."_site_settings_v" USING btree ("created_at");
  CREATE INDEX "_site_settings_v_updated_at_idx" ON "portfolio"."_site_settings_v" USING btree ("updated_at");
  CREATE INDEX "_site_settings_v_latest_idx" ON "portfolio"."_site_settings_v" USING btree ("latest");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "portfolio"."users_sessions" CASCADE;
  DROP TABLE "portfolio"."users" CASCADE;
  DROP TABLE "portfolio"."media" CASCADE;
  DROP TABLE "portfolio"."projects_technologies" CASCADE;
  DROP TABLE "portfolio"."projects" CASCADE;
  DROP TABLE "portfolio"."_projects_v_version_technologies" CASCADE;
  DROP TABLE "portfolio"."_projects_v" CASCADE;
  DROP TABLE "portfolio"."skills_items" CASCADE;
  DROP TABLE "portfolio"."skills" CASCADE;
  DROP TABLE "portfolio"."_skills_v_version_items" CASCADE;
  DROP TABLE "portfolio"."_skills_v" CASCADE;
  DROP TABLE "portfolio"."process_steps" CASCADE;
  DROP TABLE "portfolio"."_process_steps_v" CASCADE;
  DROP TABLE "portfolio"."experiences" CASCADE;
  DROP TABLE "portfolio"."_experiences_v" CASCADE;
  DROP TABLE "portfolio"."education" CASCADE;
  DROP TABLE "portfolio"."_education_v" CASCADE;
  DROP TABLE "portfolio"."payload_kv" CASCADE;
  DROP TABLE "portfolio"."payload_locked_documents" CASCADE;
  DROP TABLE "portfolio"."payload_locked_documents_rels" CASCADE;
  DROP TABLE "portfolio"."payload_preferences" CASCADE;
  DROP TABLE "portfolio"."payload_preferences_rels" CASCADE;
  DROP TABLE "portfolio"."payload_migrations" CASCADE;
  DROP TABLE "portfolio"."profile_social_links" CASCADE;
  DROP TABLE "portfolio"."profile" CASCADE;
  DROP TABLE "portfolio"."_profile_v_version_social_links" CASCADE;
  DROP TABLE "portfolio"."_profile_v" CASCADE;
  DROP TABLE "portfolio"."site_settings_navigation" CASCADE;
  DROP TABLE "portfolio"."site_settings_sections" CASCADE;
  DROP TABLE "portfolio"."site_settings" CASCADE;
  DROP TABLE "portfolio"."_site_settings_v_version_navigation" CASCADE;
  DROP TABLE "portfolio"."_site_settings_v_version_sections" CASCADE;
  DROP TABLE "portfolio"."_site_settings_v" CASCADE;
  DROP TYPE "portfolio"."enum_media_visibility";
  DROP TYPE "portfolio"."enum_projects_stage";
  DROP TYPE "portfolio"."enum_projects_status";
  DROP TYPE "portfolio"."enum__projects_v_version_stage";
  DROP TYPE "portfolio"."enum__projects_v_version_status";
  DROP TYPE "portfolio"."enum_skills_status";
  DROP TYPE "portfolio"."enum__skills_v_version_status";
  DROP TYPE "portfolio"."enum_process_steps_status";
  DROP TYPE "portfolio"."enum__process_steps_v_version_status";
  DROP TYPE "portfolio"."enum_experiences_status";
  DROP TYPE "portfolio"."enum__experiences_v_version_status";
  DROP TYPE "portfolio"."enum_education_status";
  DROP TYPE "portfolio"."enum__education_v_version_status";
  DROP TYPE "portfolio"."enum_profile_status";
  DROP TYPE "portfolio"."enum__profile_v_version_status";
  DROP TYPE "portfolio"."enum_site_settings_navigation_target";
  DROP TYPE "portfolio"."enum_site_settings_sections_key";
  DROP TYPE "portfolio"."enum_site_settings_status";
  DROP TYPE "portfolio"."enum__site_settings_v_version_navigation_target";
  DROP TYPE "portfolio"."enum__site_settings_v_version_sections_key";
  DROP TYPE "portfolio"."enum__site_settings_v_version_status";`)
}
