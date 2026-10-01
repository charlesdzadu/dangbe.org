-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'MENTOR', 'PARTICIPANT');

-- CreateEnum
CREATE TYPE "Locale" AS ENUM ('fr', 'en');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('INVITED', 'ACTIVE', 'DISABLED');

-- CreateEnum
CREATE TYPE "AuthTokenPurpose" AS ENUM ('INVITE', 'PASSWORD_RESET');

-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('SUBMITTED', 'UNDER_REVIEW', 'ACCEPTED', 'WAITLISTED', 'REJECTED', 'WITHDRAWN');

-- CreateEnum
CREATE TYPE "DegreeLevel" AS ENUM ('BAC_PLUS_2', 'LICENCE', 'MASTER', 'DOCTORAT', 'AUTRE');

-- CreateEnum
CREATE TYPE "DeviceAccess" AS ENUM ('NONE', 'SMARTPHONE_ONLY', 'SHARED_COMPUTER', 'OWN_COMPUTER');

-- CreateEnum
CREATE TYPE "InternetAccess" AS ENUM ('OCCASIONAL', 'MOBILE_DATA', 'RELIABLE');

-- CreateEnum
CREATE TYPE "LanguageLevel" AS ENUM ('A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'NATIVE');

-- CreateEnum
CREATE TYPE "PathwayType" AS ENUM ('SHORT', 'MEDIUM', 'LONG');

-- CreateEnum
CREATE TYPE "CohortStatus" AS ENUM ('PLANNED', 'ACTIVE', 'COMPLETED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "EnrollmentStatus" AS ENUM ('ACTIVE', 'PAUSED', 'COMPLETED', 'DROPPED');

-- CreateEnum
CREATE TYPE "ProgressStatus" AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED');

-- CreateEnum
CREATE TYPE "ProofType" AS ENUM ('NONE', 'LINK', 'FILE');

-- CreateEnum
CREATE TYPE "ValidationStatus" AS ENUM ('NONE', 'PENDING', 'VALIDATED', 'REJECTED');

-- CreateEnum
CREATE TYPE "ActivityType" AS ENUM ('APPLICATION_SUBMITTED', 'APPLICATION_REVIEWED', 'APPLICATION_DECIDED', 'PARTICIPANT_ADMITTED', 'INVITE_SENT', 'INVITE_ACCEPTED', 'PASSWORD_RESET_REQUESTED', 'LOGIN', 'MENTOR_ASSIGNED', 'ENROLLMENT_STATUS_CHANGED', 'PROGRESS_UPDATED', 'PROOF_SUBMITTED', 'PROOF_VALIDATED', 'PROOF_REJECTED', 'EVALUATION_CREATED', 'NOTE_ADDED', 'EMAIL_SENT', 'EMAIL_FAILED');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "phone" TEXT,
    "role" "Role" NOT NULL,
    "status" "UserStatus" NOT NULL DEFAULT 'INVITED',
    "locale" "Locale" NOT NULL DEFAULT 'fr',
    "last_login_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "token_hash" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "last_seen_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_agent" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth_tokens" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "purpose" "AuthTokenPurpose" NOT NULL,
    "token_hash" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "consumed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "auth_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "applications" (
    "id" TEXT NOT NULL,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'SUBMITTED',
    "locale" "Locale" NOT NULL DEFAULT 'fr',
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "degree_level" "DegreeLevel" NOT NULL,
    "field_of_study" TEXT NOT NULL,
    "institution" TEXT NOT NULL,
    "graduation_year" INTEGER NOT NULL,
    "motivation" TEXT NOT NULL,
    "device_access" "DeviceAccess" NOT NULL,
    "internet_access" "InternetAccess" NOT NULL,
    "hours_per_week" INTEGER NOT NULL,
    "pathway_preference" "PathwayType",
    "feedback_willing" BOOLEAN NOT NULL,
    "french_level" "LanguageLevel" NOT NULL,
    "english_level" "LanguageLevel" NOT NULL,
    "how_heard" TEXT,
    "consent_at" TIMESTAMP(3) NOT NULL,
    "decided_by_id" TEXT,
    "decided_at" TIMESTAMP(3),
    "decision_notes" TEXT,
    "user_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "applications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "application_reviews" (
    "id" TEXT NOT NULL,
    "application_id" TEXT NOT NULL,
    "reviewer_id" TEXT NOT NULL,
    "motivation_score" INTEGER NOT NULL,
    "access_score" INTEGER NOT NULL,
    "feedback_score" INTEGER NOT NULL,
    "comment" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "application_reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "competencies" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name_fr" TEXT NOT NULL,
    "name_en" TEXT NOT NULL,
    "description_fr" TEXT,
    "description_en" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "competencies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "course_resources" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "language" "Locale" NOT NULL,
    "estimated_hours" INTEGER NOT NULL,
    "is_free" BOOLEAN NOT NULL DEFAULT true,
    "has_certificate" BOOLEAN NOT NULL DEFAULT false,
    "certificate_is_free" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "course_resources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "competency_courses" (
    "competency_id" TEXT NOT NULL,
    "course_id" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "competency_courses_pkey" PRIMARY KEY ("competency_id","course_id")
);

-- CreateTable
CREATE TABLE "pathway_templates" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "PathwayType" NOT NULL,
    "target_weeks" INTEGER NOT NULL,
    "description_fr" TEXT,
    "is_default" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pathway_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pathway_template_items" (
    "id" TEXT NOT NULL,
    "template_id" TEXT NOT NULL,
    "competency_id" TEXT NOT NULL,
    "course_id" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_required" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "pathway_template_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cohorts" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "pathway_type" "PathwayType" NOT NULL,
    "pathway_template_id" TEXT NOT NULL,
    "start_date" DATE NOT NULL,
    "end_date" DATE NOT NULL,
    "status" "CohortStatus" NOT NULL DEFAULT 'PLANNED',
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cohorts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "enrollments" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "cohort_id" TEXT NOT NULL,
    "mentor_id" TEXT,
    "status" "EnrollmentStatus" NOT NULL DEFAULT 'ACTIVE',
    "joined_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMP(3),
    "last_activity_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "enrollments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "course_progress" (
    "id" TEXT NOT NULL,
    "enrollment_id" TEXT NOT NULL,
    "course_id" TEXT NOT NULL,
    "competency_id" TEXT NOT NULL,
    "is_required" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "status" "ProgressStatus" NOT NULL DEFAULT 'NOT_STARTED',
    "started_at" TIMESTAMP(3),
    "completed_at" TIMESTAMP(3),
    "proof_type" "ProofType" NOT NULL DEFAULT 'NONE',
    "proof_url" TEXT,
    "proof_file_key" TEXT,
    "proof_submitted_at" TIMESTAMP(3),
    "validation_status" "ValidationStatus" NOT NULL DEFAULT 'NONE',
    "validated_by_id" TEXT,
    "validated_at" TIMESTAMP(3),
    "validation_note" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "course_progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "evaluations" (
    "id" TEXT NOT NULL,
    "enrollment_id" TEXT NOT NULL,
    "competency_id" TEXT NOT NULL,
    "evaluator_id" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "rubric" JSONB,
    "notes" TEXT,
    "evaluated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "evaluations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mentor_notes" (
    "id" TEXT NOT NULL,
    "enrollment_id" TEXT NOT NULL,
    "author_id" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "visible_to_participant" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mentor_notes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activity_log" (
    "id" TEXT NOT NULL,
    "type" "ActivityType" NOT NULL,
    "actor_id" TEXT,
    "enrollment_id" TEXT,
    "application_id" TEXT,
    "subject_user_id" TEXT,
    "payload" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "activity_log_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_role_status_idx" ON "users"("role", "status");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_token_hash_key" ON "sessions"("token_hash");

-- CreateIndex
CREATE INDEX "sessions_user_id_idx" ON "sessions"("user_id");

-- CreateIndex
CREATE INDEX "sessions_expires_at_idx" ON "sessions"("expires_at");

-- CreateIndex
CREATE UNIQUE INDEX "auth_tokens_token_hash_key" ON "auth_tokens"("token_hash");

-- CreateIndex
CREATE INDEX "auth_tokens_user_id_purpose_idx" ON "auth_tokens"("user_id", "purpose");

-- CreateIndex
CREATE UNIQUE INDEX "applications_user_id_key" ON "applications"("user_id");

-- CreateIndex
CREATE INDEX "applications_status_created_at_idx" ON "applications"("status", "created_at");

-- CreateIndex
CREATE INDEX "applications_email_idx" ON "applications"("email");

-- CreateIndex
CREATE UNIQUE INDEX "application_reviews_application_id_reviewer_id_key" ON "application_reviews"("application_id", "reviewer_id");

-- CreateIndex
CREATE UNIQUE INDEX "competencies_slug_key" ON "competencies"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "course_resources_slug_key" ON "course_resources"("slug");

-- CreateIndex
CREATE INDEX "course_resources_provider_idx" ON "course_resources"("provider");

-- CreateIndex
CREATE UNIQUE INDEX "pathway_templates_slug_key" ON "pathway_templates"("slug");

-- CreateIndex
CREATE INDEX "pathway_templates_type_is_active_idx" ON "pathway_templates"("type", "is_active");

-- CreateIndex
CREATE INDEX "pathway_template_items_template_id_sort_order_idx" ON "pathway_template_items"("template_id", "sort_order");

-- CreateIndex
CREATE UNIQUE INDEX "pathway_template_items_template_id_course_id_key" ON "pathway_template_items"("template_id", "course_id");

-- CreateIndex
CREATE UNIQUE INDEX "cohorts_slug_key" ON "cohorts"("slug");

-- CreateIndex
CREATE INDEX "cohorts_status_start_date_idx" ON "cohorts"("status", "start_date");

-- CreateIndex
CREATE INDEX "enrollments_cohort_id_status_idx" ON "enrollments"("cohort_id", "status");

-- CreateIndex
CREATE INDEX "enrollments_mentor_id_idx" ON "enrollments"("mentor_id");

-- CreateIndex
CREATE UNIQUE INDEX "enrollments_user_id_cohort_id_key" ON "enrollments"("user_id", "cohort_id");

-- CreateIndex
CREATE INDEX "course_progress_validation_status_proof_submitted_at_idx" ON "course_progress"("validation_status", "proof_submitted_at");

-- CreateIndex
CREATE UNIQUE INDEX "course_progress_enrollment_id_course_id_key" ON "course_progress"("enrollment_id", "course_id");

-- CreateIndex
CREATE INDEX "evaluations_enrollment_id_competency_id_evaluated_at_idx" ON "evaluations"("enrollment_id", "competency_id", "evaluated_at");

-- CreateIndex
CREATE INDEX "mentor_notes_enrollment_id_created_at_idx" ON "mentor_notes"("enrollment_id", "created_at");

-- CreateIndex
CREATE INDEX "activity_log_enrollment_id_created_at_idx" ON "activity_log"("enrollment_id", "created_at");

-- CreateIndex
CREATE INDEX "activity_log_application_id_created_at_idx" ON "activity_log"("application_id", "created_at");

-- CreateIndex
CREATE INDEX "activity_log_type_created_at_idx" ON "activity_log"("type", "created_at");

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auth_tokens" ADD CONSTRAINT "auth_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "applications_decided_by_id_fkey" FOREIGN KEY ("decided_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "applications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "application_reviews" ADD CONSTRAINT "application_reviews_application_id_fkey" FOREIGN KEY ("application_id") REFERENCES "applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "application_reviews" ADD CONSTRAINT "application_reviews_reviewer_id_fkey" FOREIGN KEY ("reviewer_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "competency_courses" ADD CONSTRAINT "competency_courses_competency_id_fkey" FOREIGN KEY ("competency_id") REFERENCES "competencies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "competency_courses" ADD CONSTRAINT "competency_courses_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "course_resources"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pathway_template_items" ADD CONSTRAINT "pathway_template_items_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "pathway_templates"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pathway_template_items" ADD CONSTRAINT "pathway_template_items_competency_id_fkey" FOREIGN KEY ("competency_id") REFERENCES "competencies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pathway_template_items" ADD CONSTRAINT "pathway_template_items_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "course_resources"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cohorts" ADD CONSTRAINT "cohorts_pathway_template_id_fkey" FOREIGN KEY ("pathway_template_id") REFERENCES "pathway_templates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_cohort_id_fkey" FOREIGN KEY ("cohort_id") REFERENCES "cohorts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_mentor_id_fkey" FOREIGN KEY ("mentor_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_progress" ADD CONSTRAINT "course_progress_enrollment_id_fkey" FOREIGN KEY ("enrollment_id") REFERENCES "enrollments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_progress" ADD CONSTRAINT "course_progress_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "course_resources"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_progress" ADD CONSTRAINT "course_progress_competency_id_fkey" FOREIGN KEY ("competency_id") REFERENCES "competencies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_progress" ADD CONSTRAINT "course_progress_validated_by_id_fkey" FOREIGN KEY ("validated_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evaluations" ADD CONSTRAINT "evaluations_enrollment_id_fkey" FOREIGN KEY ("enrollment_id") REFERENCES "enrollments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evaluations" ADD CONSTRAINT "evaluations_competency_id_fkey" FOREIGN KEY ("competency_id") REFERENCES "competencies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evaluations" ADD CONSTRAINT "evaluations_evaluator_id_fkey" FOREIGN KEY ("evaluator_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mentor_notes" ADD CONSTRAINT "mentor_notes_enrollment_id_fkey" FOREIGN KEY ("enrollment_id") REFERENCES "enrollments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mentor_notes" ADD CONSTRAINT "mentor_notes_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_log" ADD CONSTRAINT "activity_log_actor_id_fkey" FOREIGN KEY ("actor_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_log" ADD CONSTRAINT "activity_log_enrollment_id_fkey" FOREIGN KEY ("enrollment_id") REFERENCES "enrollments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_log" ADD CONSTRAINT "activity_log_application_id_fkey" FOREIGN KEY ("application_id") REFERENCES "applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;
