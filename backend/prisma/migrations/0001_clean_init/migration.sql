-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "public"."ShirtSize" AS ENUM ('XS', 'S', 'M', 'L', 'XL', 'XXL');

-- CreateTable
CREATE TABLE "public"."AboutSection" (
    "id" TEXT NOT NULL,
    "kusContent" TEXT NOT NULL,
    "osalejadContent" TEXT NOT NULL,
    "auhinnadContent" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "AboutSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Feature" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "iconPath" TEXT NOT NULL,
    "introductionId" INTEGER NOT NULL,

    CONSTRAINT "Feature_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Field" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Field_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Introduction" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Introduction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."MainSponsor" (
    "id" TEXT NOT NULL,
    "sponsorName" TEXT NOT NULL,
    "sponsorText" TEXT NOT NULL,
    "imageUrl" VARCHAR(500) NOT NULL,
    "website" VARCHAR(1000),
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "MainSponsor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ProjectMember" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."editions" (
    "id" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "capacity" INTEGER NOT NULL,
    "nextQueue" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "editions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."gallery_images" (
    "id" TEXT NOT NULL,
    "url" VARCHAR(500) NOT NULL,
    "alt" VARCHAR(200),
    "caption" VARCHAR(300),
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "gallery_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."hero_sections" (
    "id" TEXT NOT NULL,
    "dateText" VARCHAR(100) NOT NULL,
    "mainTitle" VARCHAR(200) NOT NULL,
    "eventDate" VARCHAR(100) NOT NULL,
    "backgroundImage" VARCHAR(500) NOT NULL,
    "eventDateInfo" VARCHAR(100) NOT NULL,
    "location" VARCHAR(100) NOT NULL,
    "audience" VARCHAR(200) NOT NULL,
    "duration" VARCHAR(50) NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "hero_sections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."sponsors" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "imageUrl" VARCHAR(500) NOT NULL,
    "website" VARCHAR(1000),
    "tier" VARCHAR(20),
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "sponsors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."team_members" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "age" VARCHAR(20) NOT NULL,
    "email" VARCHAR(255),
    "phone" VARCHAR(20),
    "accommodation" BOOLEAN NOT NULL DEFAULT false,
    "shirtSize" "public"."ShirtSize",
    "school" VARCHAR(120),
    "diet" VARCHAR(255),
    "consent" BOOLEAN NOT NULL DEFAULT false,
    "teamId" TEXT NOT NULL,

    CONSTRAINT "team_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."teams" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "field" VARCHAR(100) NOT NULL,
    "leaderName" VARCHAR(100) NOT NULL,
    "leaderEmail" VARCHAR(255) NOT NULL,
    "leaderPhone" VARCHAR(20),
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "editionId" TEXT NOT NULL,
    "queueNo" INTEGER NOT NULL,

    CONSTRAINT "teams_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "editions_year_key" ON "public"."editions"("year" ASC);

-- CreateIndex
CREATE INDEX "gallery_images_createdAt_idx" ON "public"."gallery_images"("createdAt" ASC);

-- CreateIndex
CREATE INDEX "sponsors_tier_idx" ON "public"."sponsors"("tier" ASC);

-- CreateIndex
CREATE INDEX "team_members_email_idx" ON "public"."team_members"("email" ASC);

-- CreateIndex
CREATE INDEX "teams_createdAt_idx" ON "public"."teams"("createdAt" ASC);

-- CreateIndex
CREATE INDEX "teams_field_idx" ON "public"."teams"("field" ASC);

-- CreateIndex
CREATE INDEX "teams_leaderEmail_idx" ON "public"."teams"("leaderEmail" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "teams_name_key" ON "public"."teams"("name" ASC);

-- AddForeignKey
ALTER TABLE "public"."Feature" ADD CONSTRAINT "Feature_introductionId_fkey" FOREIGN KEY ("introductionId") REFERENCES "public"."Introduction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."team_members" ADD CONSTRAINT "team_members_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "public"."teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."teams" ADD CONSTRAINT "teams_editionId_fkey" FOREIGN KEY ("editionId") REFERENCES "public"."editions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

