/*
  Warnings:

  - A unique constraint covering the columns `[apiKey]` on the table `Resource` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Resource" ADD COLUMN     "apiKey" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Resource_apiKey_key" ON "Resource"("apiKey");
