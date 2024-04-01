/*
  Warnings:

  - You are about to alter the column `product_title` on the `product_info` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(40)`.
  - You are about to alter the column `variant_title` on the `product_info` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(40)`.

*/
-- AlterTable
ALTER TABLE "product_info" ALTER COLUMN "product_title" SET DATA TYPE VARCHAR(40),
ALTER COLUMN "variant_title" SET DATA TYPE VARCHAR(40);
