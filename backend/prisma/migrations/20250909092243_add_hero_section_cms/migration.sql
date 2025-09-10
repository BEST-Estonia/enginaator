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
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "hero_sections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."sponsors" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "logo" VARCHAR(500) NOT NULL,
    "website" VARCHAR(300),
    "tier" VARCHAR(20) NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "sponsors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."gallery_images" (
    "id" TEXT NOT NULL,
    "url" VARCHAR(500) NOT NULL,
    "alt" VARCHAR(200),
    "caption" VARCHAR(300),
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "gallery_images_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "sponsors_tier_idx" ON "public"."sponsors"("tier");

-- CreateIndex
CREATE INDEX "gallery_images_createdAt_idx" ON "public"."gallery_images"("createdAt");
