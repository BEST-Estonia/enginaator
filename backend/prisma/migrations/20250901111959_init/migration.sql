-- CreateTable
CREATE TABLE "public"."teams" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "field" VARCHAR(100) NOT NULL,
    "leaderName" VARCHAR(100) NOT NULL,
    "leaderEmail" VARCHAR(255) NOT NULL,
    "leaderPhone" VARCHAR(20),
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "teams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."team_members" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "age" VARCHAR(20) NOT NULL,
    "email" VARCHAR(255),
    "phone" VARCHAR(20),
    "teamId" TEXT NOT NULL,

    CONSTRAINT "team_members_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "teams_name_key" ON "public"."teams"("name");

-- CreateIndex
CREATE INDEX "teams_field_idx" ON "public"."teams"("field");

-- CreateIndex
CREATE INDEX "teams_leaderEmail_idx" ON "public"."teams"("leaderEmail");

-- CreateIndex
CREATE INDEX "teams_createdAt_idx" ON "public"."teams"("createdAt");

-- CreateIndex
CREATE INDEX "team_members_email_idx" ON "public"."team_members"("email");

-- AddForeignKey
ALTER TABLE "public"."team_members" ADD CONSTRAINT "team_members_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "public"."teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;
