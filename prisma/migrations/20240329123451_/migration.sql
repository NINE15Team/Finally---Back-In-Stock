/*
  Warnings:

  - You are about to drop the column `customer_subscription_id` on the `customer_activity` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[store_id]` on the table `customer_activity` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[product_info_id]` on the table `customer_activity` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `product_info_id` to the `customer_activity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `store_id` to the `customer_activity` table without a default value. This is not possible if the table is not empty.
  - The required column `uuid` was added to the `notification_history` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "customer_activity" DROP CONSTRAINT "customer_activity_customer_subscription_id_fkey";

-- DropIndex
DROP INDEX "customer_activity_customer_subscription_id_key";

-- AlterTable
ALTER TABLE "customer_activity" DROP COLUMN "customer_subscription_id",
ADD COLUMN     "product_info_id" INTEGER NOT NULL,
ADD COLUMN     "store_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "notification_history" ADD COLUMN     "uuid" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "customer_activity_store_id_key" ON "customer_activity"("store_id");

-- CreateIndex
CREATE UNIQUE INDEX "customer_activity_product_info_id_key" ON "customer_activity"("product_info_id");

-- AddForeignKey
ALTER TABLE "customer_activity" ADD CONSTRAINT "customer_activity_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "store_info"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer_activity" ADD CONSTRAINT "customer_activity_product_info_id_fkey" FOREIGN KEY ("product_info_id") REFERENCES "product_info"("id") ON DELETE CASCADE ON UPDATE CASCADE;
