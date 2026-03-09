CREATE TABLE IF NOT EXISTS "public"."footer_sections" (
  "id" TEXT PRIMARY KEY,
  "logoUrl" VARCHAR(500) NOT NULL,
  "tagline" TEXT NOT NULL,
  "contactEmail" VARCHAR(255) NOT NULL,
  "contactPhone" VARCHAR(50) NOT NULL,
  "contactAddress" VARCHAR(500) NOT NULL,
  "facebookUrl" VARCHAR(1000) NOT NULL,
  "instagramUrl" VARCHAR(1000) NOT NULL,
  "linkedinUrl" VARCHAR(1000) NOT NULL,
  "partner1Name" VARCHAR(120) NOT NULL,
  "partner1LogoUrl" VARCHAR(500) NOT NULL,
  "partner2Name" VARCHAR(120) NOT NULL,
  "partner2LogoUrl" VARCHAR(500) NOT NULL,
  "copyrightText" VARCHAR(300) NOT NULL,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL
);
