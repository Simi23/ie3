/*
  Warnings:

  - Added the required column `displayTimeMs` to the `DisplayContent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `showProgress` to the `DisplayContent` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DisplayContent" ADD COLUMN     "displayTimeMs" INTEGER NOT NULL,
ADD COLUMN     "showProgress" BOOLEAN NOT NULL;
