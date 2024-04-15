/*
  Warnings:

  - You are about to drop the column `isActive` on the `customer_subscription` table. All the data in the column will be lost.
  - You are about to drop the column `inStock` on the `product_info` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `product_info` table. All the data in the column will be lost.
  - You are about to drop the `email_configuartion` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "email_configuartion" DROP CONSTRAINT "email_configuartion_store_id_fkey";

-- AlterTable
ALTER TABLE "customer_subscription" DROP COLUMN "isActive",
ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "product_info" DROP COLUMN "inStock",
DROP COLUMN "isActive",
ADD COLUMN     "in_stock" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true;

-- DropTable
DROP TABLE "email_configuartion";

-- CreateTable
CREATE TABLE "email_configuration" (
    "id" SERIAL NOT NULL,
    "sender_email" VARCHAR(50) NOT NULL DEFAULT '',
    "store_id" INTEGER NOT NULL,
    "email_verified" VARCHAR(5) NOT NULL DEFAULT 'NO',
    "header_content" TEXT NOT NULL DEFAULT '',
    "body_content" TEXT NOT NULL DEFAULT '',
    "footer_content" TEXT NOT NULL DEFAULT '',
    "sender_id" INTEGER NOT NULL DEFAULT 0,
    "button_content" TEXT NOT NULL DEFAULT '',
    "email_title" TEXT NOT NULL DEFAULT '',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "email_configuration_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "email_configuration_store_id_key" ON "email_configuration"("store_id");

-- AddForeignKey
ALTER TABLE "email_configuration" ADD CONSTRAINT "email_configuration_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "store_info"("id") ON DELETE CASCADE ON UPDATE CASCADE;
