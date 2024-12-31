/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Seat` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Seat_name_key" ON "Seat"("name");
