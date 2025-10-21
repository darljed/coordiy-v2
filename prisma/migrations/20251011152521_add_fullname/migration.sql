/*
  Warnings:

  - Added the required column `fullName` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN "fullName" TEXT NOT NULL DEFAULT 'User';

-- Update existing users to use email prefix as fullName
UPDATE "users" SET "fullName" = SPLIT_PART(email, '@', 1) WHERE "fullName" = 'User';

-- Remove default value
ALTER TABLE "users" ALTER COLUMN "fullName" DROP DEFAULT;
