/*
  Warnings:

  - A unique constraint covering the columns `[flutterwaveCustomerId]` on the table `Profile` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "flagCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "flagReason" TEXT,
ADD COLUMN     "flutterwaveCustomerId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Profile_flutterwaveCustomerId_key" ON "Profile"("flutterwaveCustomerId");
