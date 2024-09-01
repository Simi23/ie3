/*
  Warnings:

  - You are about to drop the column `class` on the `User` table. All the data in the column will be lost.
  - Added the required column `hidden` to the `Class` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hidden` to the `ClassGroup` table without a default value. This is not possible if the table is not empty.
  - Added the required column `classId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Class" ADD COLUMN     "hidden" BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE "ClassGroup" ADD COLUMN     "hidden" BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "class",
ADD COLUMN     "classId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE CASCADE ON UPDATE CASCADE;
