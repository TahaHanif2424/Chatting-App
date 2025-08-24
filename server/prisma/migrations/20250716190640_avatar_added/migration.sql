/*
  Warnings:

  - Added the required column `adminId` to the `Group` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Group" ADD COLUMN     "adminId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Avatar" (
    "name" TEXT NOT NULL,
    "avatarURL" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Avatar_avatarURL_key" ON "Avatar"("avatarURL");
