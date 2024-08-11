/*
  Warnings:

  - Added the required column `category` to the `AuditLog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `clientAddress` to the `AuditLog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `clientUserAgent` to the `AuditLog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `severity` to the `AuditLog` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AuditLog" ADD COLUMN     "category" TEXT NOT NULL,
ADD COLUMN     "clientAddress" TEXT NOT NULL,
ADD COLUMN     "clientUserAgent" TEXT NOT NULL,
ADD COLUMN     "severity" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Session" ALTER COLUMN "expiresAt" SET DEFAULT now() + '1 day'::interval;
