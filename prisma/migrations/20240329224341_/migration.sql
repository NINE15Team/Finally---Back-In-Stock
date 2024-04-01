/*
  Warnings:

  - Added the required column `browser_track_id` to the `customer_activity` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "customer_activity_notification_history_id_key";

-- DropIndex
DROP INDEX "customer_activity_product_info_id_key";

-- DropIndex
DROP INDEX "customer_activity_store_id_key";

-- AlterTable
ALTER TABLE "customer_activity" ADD COLUMN     "browser_track_id" TEXT NOT NULL;
