-- AlterTable
ALTER TABLE "_CompetitionToUser" ADD CONSTRAINT "_CompetitionToUser_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_CompetitionToUser_AB_unique";
