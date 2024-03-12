-- AlterTable
ALTER TABLE "email_configuartion" ADD COLUMN     "body_bg_color" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "body_font_family" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "body_font_size" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "footer_bg_color" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "footer_font_family" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "footer_font_size" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "header_bg_color" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "header_font_family" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "header_font_size" TEXT NOT NULL DEFAULT '';
