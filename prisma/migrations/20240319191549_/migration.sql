/*
  Warnings:

  - You are about to drop the column `sender_name` on the `email_configuartion` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "email_configuartion" DROP COLUMN "sender_name",
ADD COLUMN     "sender_email" TEXT NOT NULL DEFAULT '';
