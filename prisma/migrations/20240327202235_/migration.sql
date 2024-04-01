-- CreateTable
CREATE TABLE "notification_history" (
    "id" SERIAL NOT NULL,
    "no_of_notifications" INTEGER NOT NULL DEFAULT 0,
    "product_info_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notification_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customer_activity" (
    "id" SERIAL NOT NULL,
    "no_of_notifications" VARCHAR(20) NOT NULL DEFAULT '',
    "notification_history_id" INTEGER NOT NULL,
    "customer_subscription_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "customer_activity_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "notification_history_product_info_id_key" ON "notification_history"("product_info_id");

-- CreateIndex
CREATE UNIQUE INDEX "customer_activity_notification_history_id_key" ON "customer_activity"("notification_history_id");

-- CreateIndex
CREATE UNIQUE INDEX "customer_activity_customer_subscription_id_key" ON "customer_activity"("customer_subscription_id");

-- AddForeignKey
ALTER TABLE "notification_history" ADD CONSTRAINT "notification_history_product_info_id_fkey" FOREIGN KEY ("product_info_id") REFERENCES "product_info"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer_activity" ADD CONSTRAINT "customer_activity_notification_history_id_fkey" FOREIGN KEY ("notification_history_id") REFERENCES "notification_history"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer_activity" ADD CONSTRAINT "customer_activity_customer_subscription_id_fkey" FOREIGN KEY ("customer_subscription_id") REFERENCES "customer_subscription"("id") ON DELETE CASCADE ON UPDATE CASCADE;
