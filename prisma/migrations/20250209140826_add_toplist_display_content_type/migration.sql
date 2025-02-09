-- AlterEnum
ALTER TYPE "DisplayContentType" ADD VALUE 'TopList';

-- AlterTable
ALTER TABLE "DisplayContent" ADD COLUMN     "topListId" TEXT;

-- AddForeignKey
ALTER TABLE "DisplayContent" ADD CONSTRAINT "DisplayContent_topListId_fkey" FOREIGN KEY ("topListId") REFERENCES "TopList"("id") ON DELETE CASCADE ON UPDATE CASCADE;
