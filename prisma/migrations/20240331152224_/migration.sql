/*
  Warnings:

  - You are about to drop the column `no_of_notifications` on the `customer_activity` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "customer_activity" DROP COLUMN "no_of_notifications",
ADD COLUMN     "activity" VARCHAR(20) NOT NULL DEFAULT '';
