/*
  Warnings:

  - You are about to drop the column `monthly_price` on the `pricing_plan` table. All the data in the column will be lost.
  - You are about to drop the column `yearly_price` on the `pricing_plan` table. All the data in the column will be lost.
  - Added the required column `price` to the `pricing_plan` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "pricing_plan" DROP COLUMN "monthly_price",
DROP COLUMN "yearly_price",
ADD COLUMN     "description" VARCHAR(200) NOT NULL DEFAULT '',
ADD COLUMN     "price" DOUBLE PRECISION NOT NULL;
