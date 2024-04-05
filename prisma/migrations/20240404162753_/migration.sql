/*
  Warnings:

  - You are about to alter the column `vendor` on the `product_info` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.

*/
-- AlterTable
ALTER TABLE "product_info" ALTER COLUMN "vendor" SET DATA TYPE VARCHAR(50);
