ALTER TABLE "public"."teams"
ADD COLUMN IF NOT EXISTS "customAnswers" JSONB;

CREATE TABLE IF NOT EXISTS "public"."registration_questions" (
  "id" TEXT PRIMARY KEY,
  "label" VARCHAR(200) NOT NULL,
  "fieldKey" VARCHAR(100) NOT NULL UNIQUE,
  "type" VARCHAR(20) NOT NULL,
  "required" BOOLEAN NOT NULL DEFAULT false,
  "placeholder" VARCHAR(200),
  "options" JSONB,
  "order" INTEGER NOT NULL DEFAULT 0,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL
);

CREATE INDEX IF NOT EXISTS "registration_questions_order_idx" ON "public"."registration_questions"("order");
CREATE INDEX IF NOT EXISTS "registration_questions_active_idx" ON "public"."registration_questions"("active");
