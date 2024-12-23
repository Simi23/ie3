/*
  Warnings:

  - You are about to drop the `BracketPartTeam` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `BracketPartUser` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_CompetitionToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "BracketPartTeam" DROP CONSTRAINT "BracketPartTeam_bracketId_fkey";

-- DropForeignKey
ALTER TABLE "BracketPartTeam" DROP CONSTRAINT "BracketPartTeam_teamId_fkey";

-- DropForeignKey
ALTER TABLE "BracketPartUser" DROP CONSTRAINT "BracketPartUser_bracketId_fkey";

-- DropForeignKey
ALTER TABLE "BracketPartUser" DROP CONSTRAINT "BracketPartUser_userId_fkey";

-- DropForeignKey
ALTER TABLE "_CompetitionToUser" DROP CONSTRAINT "_CompetitionToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_CompetitionToUser" DROP CONSTRAINT "_CompetitionToUser_B_fkey";

-- DropTable
DROP TABLE "BracketPartTeam";

-- DropTable
DROP TABLE "BracketPartUser";

-- DropTable
DROP TABLE "_CompetitionToUser";

-- CreateTable
CREATE TABLE "BracketPart" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "round" INTEGER NOT NULL,
    "roundLocation" INTEGER NOT NULL,
    "upper" BOOLEAN NOT NULL,
    "startLocation" BOOLEAN NOT NULL,
    "points" INTEGER[],
    "won" BOOLEAN NOT NULL,
    "started" BOOLEAN NOT NULL,
    "ended" BOOLEAN NOT NULL,
    "bracketId" TEXT NOT NULL,
    "teamId" TEXT,

    CONSTRAINT "BracketPart_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "BracketPart" ADD CONSTRAINT "BracketPart_bracketId_fkey" FOREIGN KEY ("bracketId") REFERENCES "Bracket"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BracketPart" ADD CONSTRAINT "BracketPart_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;
