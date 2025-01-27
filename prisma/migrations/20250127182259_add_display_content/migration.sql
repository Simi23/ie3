-- CreateEnum
CREATE TYPE "DisplayContentType" AS ENUM ('ShortText', 'FormattedText', 'Bracket', 'Media');

-- CreateTable
CREATE TABLE "DisplayContent" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "order" INTEGER NOT NULL,
    "type" "DisplayContentType" NOT NULL,
    "name" TEXT NOT NULL,
    "shortText" TEXT,
    "formattedTextId" TEXT,
    "bracketId" TEXT,
    "mediaId" TEXT,

    CONSTRAINT "DisplayContent_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DisplayContent" ADD CONSTRAINT "DisplayContent_formattedTextId_fkey" FOREIGN KEY ("formattedTextId") REFERENCES "MdContent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DisplayContent" ADD CONSTRAINT "DisplayContent_bracketId_fkey" FOREIGN KEY ("bracketId") REFERENCES "Bracket"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DisplayContent" ADD CONSTRAINT "DisplayContent_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;
