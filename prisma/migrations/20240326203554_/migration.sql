/*
  Warnings:

  - Changed the type of `variant_id` on the `product_info` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `store_id` on the `store_info` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "product_info" DROP COLUMN "variant_id",
ADD COLUMN     "variant_id" BIGINT NOT NULL;

-- AlterTable
ALTER TABLE "store_info" DROP COLUMN "store_id",
ADD COLUMN     "store_id" BIGINT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "product_info_product_id_variant_id_key" ON "product_info"("product_id", "variant_id");
