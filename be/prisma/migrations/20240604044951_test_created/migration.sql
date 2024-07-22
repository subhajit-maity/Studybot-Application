/*
  Warnings:

  - You are about to drop the column `test` on the `Test` table. All the data in the column will be lost.
  - Added the required column `qattempted` to the `Test` table without a default value. This is not possible if the table is not empty.
  - Added the required column `qcorrect` to the `Test` table without a default value. This is not possible if the table is not empty.
  - Added the required column `qwrong` to the `Test` table without a default value. This is not possible if the table is not empty.
  - Added the required column `testname` to the `Test` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalq` to the `Test` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Test" DROP COLUMN "test",
ADD COLUMN     "qattempted" INTEGER NOT NULL,
ADD COLUMN     "qcorrect" INTEGER NOT NULL,
ADD COLUMN     "qwrong" INTEGER NOT NULL,
ADD COLUMN     "testname" TEXT NOT NULL,
ADD COLUMN     "totalq" INTEGER NOT NULL;
