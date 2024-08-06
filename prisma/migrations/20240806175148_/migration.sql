/*
  Warnings:

  - You are about to drop the column `shopifyStoreInfoId` on the `pricing_plan` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "pricing_plan" DROP CONSTRAINT "pricing_plan_shopifyStoreInfoId_fkey";

-- AlterTable
ALTER TABLE "pricing_plan" DROP COLUMN "shopifyStoreInfoId";
