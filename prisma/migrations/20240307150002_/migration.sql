/*
  Warnings:

  - A unique constraint covering the columns `[store_name]` on the table `store_info` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "store_info_store_name_key" ON "store_info"("store_name");
