-- CreateTable
CREATE TABLE "pricing_plan" (
    "id" SERIAL NOT NULL,
    "plan_name" VARCHAR(30) NOT NULL DEFAULT '',
    "frequency" INTEGER NOT NULL,
    "trail_period" INTEGER NOT NULL,
    "per_sms_price" DOUBLE PRECISION NOT NULL,
    "per_email_price" DOUBLE PRECISION NOT NULL,
    "monthly_price" DOUBLE PRECISION NOT NULL,
    "yearly_price" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "shopifyStoreInfoId" INTEGER,

    CONSTRAINT "pricing_plan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "store_pricing_plan" (
    "id" SERIAL NOT NULL,
    "pricing_plan_id" INTEGER NOT NULL,
    "store_id" INTEGER NOT NULL,
    "sms_count" INTEGER NOT NULL,
    "started_at" TIMESTAMP(3) NOT NULL,
    "end_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "store_pricing_plan_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "pricing_plan" ADD CONSTRAINT "pricing_plan_shopifyStoreInfoId_fkey" FOREIGN KEY ("shopifyStoreInfoId") REFERENCES "store_info"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "store_pricing_plan" ADD CONSTRAINT "store_pricing_plan_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "store_info"("id") ON DELETE CASCADE ON UPDATE CASCADE;
