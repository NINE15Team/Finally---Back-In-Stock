/*
  Warnings:

  - You are about to drop the column `body_bg_color` on the `email_configuartion` table. All the data in the column will be lost.
  - You are about to drop the column `body_font_family` on the `email_configuartion` table. All the data in the column will be lost.
  - You are about to drop the column `body_font_size` on the `email_configuartion` table. All the data in the column will be lost.
  - You are about to drop the column `footer_bg_color` on the `email_configuartion` table. All the data in the column will be lost.
  - You are about to drop the column `footer_font_family` on the `email_configuartion` table. All the data in the column will be lost.
  - You are about to drop the column `footer_font_size` on the `email_configuartion` table. All the data in the column will be lost.
  - You are about to drop the column `header_bg_color` on the `email_configuartion` table. All the data in the column will be lost.
  - You are about to drop the column `header_font_family` on the `email_configuartion` table. All the data in the column will be lost.
  - You are about to drop the column `header_font_size` on the `email_configuartion` table. All the data in the column will be lost.
  - You are about to drop the column `sender_email` on the `email_configuartion` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "email_configuartion" DROP COLUMN "body_bg_color",
DROP COLUMN "body_font_family",
DROP COLUMN "body_font_size",
DROP COLUMN "footer_bg_color",
DROP COLUMN "footer_font_family",
DROP COLUMN "footer_font_size",
DROP COLUMN "header_bg_color",
DROP COLUMN "header_font_family",
DROP COLUMN "header_font_size",
DROP COLUMN "sender_email",
ADD COLUMN     "button_content" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "email_title" TEXT NOT NULL DEFAULT '';
