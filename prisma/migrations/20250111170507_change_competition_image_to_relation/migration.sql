-- AddForeignKey
ALTER TABLE "Competition" ADD CONSTRAINT "Competition_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Media"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
