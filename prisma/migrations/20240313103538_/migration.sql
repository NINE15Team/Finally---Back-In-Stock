/*
  Warnings:

  - You are about to drop the column `product_uri` on the `product_info` table. All the data in the column will be lost.
  - Added the required column `product_handle` to the `product_info` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "product_info" DROP COLUMN "product_uri",
ADD COLUMN     "product_handle" TEXT NOT NULL;
