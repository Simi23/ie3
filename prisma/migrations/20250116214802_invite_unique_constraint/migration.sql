/*
  Warnings:

  - A unique constraint covering the columns `[teamId,inviteeId]` on the table `Invite` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE INDEX "Invite_inviteeId_idx" ON "Invite"("inviteeId");

-- CreateIndex
CREATE UNIQUE INDEX "Invite_teamId_inviteeId_key" ON "Invite"("teamId", "inviteeId");
