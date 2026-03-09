CREATE TABLE IF NOT EXISTS "public"."faq_items" (
  "id" TEXT PRIMARY KEY,
  "category" VARCHAR(120) NOT NULL,
  "question" VARCHAR(500) NOT NULL,
  "answer" TEXT NOT NULL,
  "order" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL
);

CREATE INDEX IF NOT EXISTS "faq_items_category_idx" ON "public"."faq_items"("category");
CREATE INDEX IF NOT EXISTS "faq_items_order_idx" ON "public"."faq_items"("order");
