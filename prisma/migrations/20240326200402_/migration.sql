/*
  Warnings:

  - You are about to alter the column `customer_email` on the `customer_subscription` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `email_verified` on the `email_configuartion` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(5)`.
  - You are about to alter the column `sender_email` on the `email_configuartion` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `product_handle` on the `product_info` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `store_name` on the `store_info` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `shopify_url` on the `store_info` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.

*/
-- AlterTable
ALTER TABLE "customer_subscription" ALTER COLUMN "customer_email" SET DATA TYPE VARCHAR(50);

-- AlterTable
ALTER TABLE "email_configuartion" ALTER COLUMN "email_verified" SET DATA TYPE VARCHAR(5),
ALTER COLUMN "sender_email" SET DATA TYPE VARCHAR(50);

-- AlterTable
ALTER TABLE "product_info" ALTER COLUMN "product_title" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "variant_title" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "product_handle" SET DATA TYPE VARCHAR(50);

-- AlterTable
ALTER TABLE "store_info" ALTER COLUMN "store_name" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "shopify_url" SET DATA TYPE VARCHAR(100);
