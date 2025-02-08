-- CreateEnum
CREATE TYPE "TopListKind" AS ENUM ('TIME', 'POINT');

-- CreateTable
CREATE TABLE "TopList" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "title" TEXT NOT NULL,
    "kind" "TopListKind" NOT NULL,
    "descending" BOOLEAN NOT NULL,
    "competitionId" TEXT NOT NULL,

    CONSTRAINT "TopList_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TopListEntry" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "userId" TEXT NOT NULL,
    "topListId" TEXT NOT NULL,
    "value" INTEGER NOT NULL,

    CONSTRAINT "TopListEntry_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TopList" ADD CONSTRAINT "TopList_competitionId_fkey" FOREIGN KEY ("competitionId") REFERENCES "Competition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TopListEntry" ADD CONSTRAINT "TopListEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TopListEntry" ADD CONSTRAINT "TopListEntry_topListId_fkey" FOREIGN KEY ("topListId") REFERENCES "TopList"("id") ON DELETE CASCADE ON UPDATE CASCADE;
