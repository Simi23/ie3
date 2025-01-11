/*
  Warnings:

  - You are about to drop the column `imageName` on the `Competition` table. All the data in the column will be lost.
  - Added the required column `imageId` to the `Competition` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Competition"
RENAME COLUMN "imageName" TO "imageId";
