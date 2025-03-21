/*
  Warnings:

  - Added the required column `isTracked` to the `BracketPart` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BracketPart" ADD COLUMN     "isTracked" BOOLEAN NOT NULL;
