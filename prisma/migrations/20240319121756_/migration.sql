/*
  Warnings:

  - A unique constraint covering the columns `[store_id]` on the table `store_info` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "store_info_shopify_url_store_id_key";

-- CreateIndex
CREATE UNIQUE INDEX "store_info_store_id_key" ON "store_info"("store_id");
