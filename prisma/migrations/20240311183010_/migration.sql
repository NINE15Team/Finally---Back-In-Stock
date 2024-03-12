/*
  Warnings:

  - You are about to drop the column `footerContent` on the `email_configuartion` table. All the data in the column will be lost.
  - Added the required column `footer_content` to the `email_configuartion` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "email_configuartion" DROP COLUMN "footerContent",
ADD COLUMN     "footer_content" TEXT NOT NULL,
ALTER COLUMN "header_content" SET DEFAULT '',
ALTER COLUMN "body_content" SET DEFAULT '';
