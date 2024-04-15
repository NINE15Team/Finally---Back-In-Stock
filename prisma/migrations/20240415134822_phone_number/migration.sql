/*
  Warnings:

  - You are about to drop the column `customer_tel` on the `customer_subscription` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "customer_subscription" DROP COLUMN "customer_tel",
ADD COLUMN     "customer_phone" VARCHAR(15) NOT NULL DEFAULT '';
