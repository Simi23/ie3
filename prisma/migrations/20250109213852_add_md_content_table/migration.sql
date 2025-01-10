-- CreateTable
CREATE TABLE "MdContent" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "name" TEXT NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "MdContent_pkey" PRIMARY KEY ("id")
);
