-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "shop" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "isOnline" BOOLEAN NOT NULL DEFAULT false,
    "scope" TEXT,
    "expires" TIMESTAMP(3),
    "accessToken" TEXT NOT NULL,
    "userId" TEXT,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "store_info" (
    "id" SERIAL NOT NULL,
    "store_id" TEXT NOT NULL,
    "store_name" VARCHAR(50) NOT NULL,
    "shopify_url" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_initilized" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "store_info_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_info" (
    "id" SERIAL NOT NULL,
    "store_id" INTEGER NOT NULL,
    "product_id" BIGINT NOT NULL,
    "product_title" VARCHAR(150) NOT NULL DEFAULT 'Default Product',
    "variant_id" BIGINT NOT NULL,
    "variant_title" VARCHAR(150) NOT NULL DEFAULT 'Default Variant',
    "status" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "product_handle" VARCHAR(150) NOT NULL,
    "image_url" TEXT NOT NULL DEFAULT 'Default Variant',
    "price" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "vendor" VARCHAR(80) NOT NULL DEFAULT '',
    "in_stock" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_info_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customer_subscription" (
    "id" SERIAL NOT NULL,
    "product_info_id" INTEGER NOT NULL,
    "customer_phone" VARCHAR(15) NOT NULL DEFAULT '',
    "customer_email" VARCHAR(50) NOT NULL DEFAULT 'Default Email',
    "status" BOOLEAN NOT NULL DEFAULT false,
    "is_notified" BOOLEAN NOT NULL DEFAULT false,
    "is_subscribed" BOOLEAN NOT NULL DEFAULT true,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "customer_subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "email_configuration" (
    "id" SERIAL NOT NULL,
    "sender_email" VARCHAR(50) NOT NULL DEFAULT '',
    "store_id" INTEGER NOT NULL,
    "email_verified" VARCHAR(5) NOT NULL DEFAULT 'NO',
    "header_content" TEXT NOT NULL DEFAULT '',
    "body_content" TEXT NOT NULL DEFAULT '',
    "footer_content" TEXT NOT NULL DEFAULT '',
    "sender_id" INTEGER NOT NULL DEFAULT 0,
    "button_content" TEXT NOT NULL DEFAULT '',
    "email_title" TEXT NOT NULL DEFAULT '',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "email_configuration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notification_history" (
    "id" SERIAL NOT NULL,
    "no_of_notifications" INTEGER NOT NULL DEFAULT 0,
    "product_info_id" INTEGER NOT NULL,
    "uuid" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notification_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customer_activity" (
    "id" SERIAL NOT NULL,
    "activity" VARCHAR(20) NOT NULL DEFAULT '',
    "store_id" INTEGER NOT NULL,
    "product_info_id" INTEGER NOT NULL,
    "browser_track_id" TEXT NOT NULL,
    "notification_history_id" INTEGER NOT NULL,
    "customer_email" TEXT NOT NULL DEFAULT '',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "customer_activity_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "store_info_shopify_url_key" ON "store_info"("shopify_url");

-- CreateIndex
CREATE UNIQUE INDEX "product_info_product_id_variant_id_key" ON "product_info"("product_id", "variant_id");

-- CreateIndex
CREATE UNIQUE INDEX "customer_subscription_customer_email_product_info_id_key" ON "customer_subscription"("customer_email", "product_info_id");

-- CreateIndex
CREATE UNIQUE INDEX "email_configuration_store_id_key" ON "email_configuration"("store_id");

-- AddForeignKey
ALTER TABLE "product_info" ADD CONSTRAINT "product_info_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "store_info"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer_subscription" ADD CONSTRAINT "customer_subscription_product_info_id_fkey" FOREIGN KEY ("product_info_id") REFERENCES "product_info"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "email_configuration" ADD CONSTRAINT "email_configuration_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "store_info"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification_history" ADD CONSTRAINT "notification_history_product_info_id_fkey" FOREIGN KEY ("product_info_id") REFERENCES "product_info"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer_activity" ADD CONSTRAINT "customer_activity_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "store_info"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer_activity" ADD CONSTRAINT "customer_activity_notification_history_id_fkey" FOREIGN KEY ("notification_history_id") REFERENCES "notification_history"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer_activity" ADD CONSTRAINT "customer_activity_product_info_id_fkey" FOREIGN KEY ("product_info_id") REFERENCES "product_info"("id") ON DELETE CASCADE ON UPDATE CASCADE;
