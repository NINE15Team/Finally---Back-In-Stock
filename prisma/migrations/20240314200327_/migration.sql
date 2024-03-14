/*
  Warnings:

  - The `sender_id` column on the `email_configuartion` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "email_configuartion" DROP COLUMN "sender_id",
ADD COLUMN     "sender_id" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "product_info" ADD COLUMN     "image_url" TEXT NOT NULL DEFAULT 'Default Variant',
ADD COLUMN     "price" TEXT NOT NULL DEFAULT 'Default Variant';
