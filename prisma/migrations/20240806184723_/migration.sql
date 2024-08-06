/*
  Warnings:

  - Changed the type of `started_at` on the `store_pricing_plan` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `end_at` on the `store_pricing_plan` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "store_pricing_plan" DROP COLUMN "started_at",
ADD COLUMN     "started_at" BIGINT NOT NULL,
DROP COLUMN "end_at",
ADD COLUMN     "end_at" BIGINT NOT NULL;
