/*
  Warnings:

  - Changed the type of `product_id` on the `product_info` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "product_info" DROP COLUMN "product_id",
ADD COLUMN     "product_id" BIGINT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "product_info_product_id_variant_id_key" ON "product_info"("product_id", "variant_id");
