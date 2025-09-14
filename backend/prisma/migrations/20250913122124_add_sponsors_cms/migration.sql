/*
  Warnings:

  - You are about to drop the column `logo` on the `sponsors` table. All the data in the column will be lost.
  - Added the required column `imageUrl` to the `sponsors` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."sponsors" DROP COLUMN "logo",
ADD COLUMN     "imageUrl" VARCHAR(500) NOT NULL,
ALTER COLUMN "tier" DROP NOT NULL;
