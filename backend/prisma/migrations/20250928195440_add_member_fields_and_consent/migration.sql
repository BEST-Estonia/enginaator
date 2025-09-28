-- CreateEnum
CREATE TYPE "public"."ShirtSize" AS ENUM ('XS', 'S', 'M', 'L', 'XL', 'XXL');

-- AlterTable
ALTER TABLE "public"."team_members" ADD COLUMN     "accommodation" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "consent" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "diet" VARCHAR(255),
ADD COLUMN     "school" VARCHAR(120),
ADD COLUMN     "shirtSize" "public"."ShirtSize";
