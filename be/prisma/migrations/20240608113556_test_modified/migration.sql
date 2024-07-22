/*
  Warnings:

  - You are about to drop the column `chapter_id` on the `Test` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Test" DROP CONSTRAINT "Test_chapter_id_fkey";

-- AlterTable
ALTER TABLE "Test" DROP COLUMN "chapter_id";
