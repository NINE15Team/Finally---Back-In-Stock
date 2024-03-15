-- DropForeignKey
ALTER TABLE "customer_subscription" DROP CONSTRAINT "customer_subscription_product_info_id_fkey";

-- DropForeignKey
ALTER TABLE "email_configuartion" DROP CONSTRAINT "email_configuartion_store_id_fkey";

-- DropForeignKey
ALTER TABLE "product_info" DROP CONSTRAINT "product_info_store_id_fkey";

-- AddForeignKey
ALTER TABLE "product_info" ADD CONSTRAINT "product_info_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "store_info"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer_subscription" ADD CONSTRAINT "customer_subscription_product_info_id_fkey" FOREIGN KEY ("product_info_id") REFERENCES "product_info"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "email_configuartion" ADD CONSTRAINT "email_configuartion_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "store_info"("id") ON DELETE CASCADE ON UPDATE CASCADE;
