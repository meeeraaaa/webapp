/*
  Warnings:

  - A unique constraint covering the columns `[title]` on the table `Designation` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Designation_title_key" ON "Designation"("title");
