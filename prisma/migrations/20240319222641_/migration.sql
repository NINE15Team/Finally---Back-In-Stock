/*
  Warnings:

  - The `price` column on the `product_info` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "product_info" DROP COLUMN "price",
ADD COLUMN     "price" BIGINT NOT NULL DEFAULT 0;
