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
    "store_name" TEXT NOT NULL,
    "shopify_url" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "store_info_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_info" (
    "id" SERIAL NOT NULL,
    "store_id" INTEGER NOT NULL,
    "product_id" TEXT NOT NULL,
    "product_title" TEXT NOT NULL DEFAULT 'Default Product',
    "product_handle" TEXT NOT NULL DEFAULT 'DefaultHandle',
    "variant_id" TEXT NOT NULL,
    "variant_title" TEXT NOT NULL DEFAULT 'Default Variant',
    "status" BOOLEAN NOT NULL DEFAULT false,
    "inStock" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "product_info_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customer_subscription" (
    "id" SERIAL NOT NULL,
    "product_info_id" INTEGER NOT NULL,
    "customer_email" TEXT NOT NULL DEFAULT 'Default Email',
    "status" BOOLEAN NOT NULL DEFAULT false,
    "is_notified" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "customer_subscription_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "store_info_store_name_key" ON "store_info"("store_name");

-- CreateIndex
CREATE UNIQUE INDEX "product_info_product_id_variant_id_key" ON "product_info"("product_id", "variant_id");

-- CreateIndex
CREATE UNIQUE INDEX "customer_subscription_customer_email_product_info_id_key" ON "customer_subscription"("customer_email", "product_info_id");

-- AddForeignKey
ALTER TABLE "product_info" ADD CONSTRAINT "product_info_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "store_info"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer_subscription" ADD CONSTRAINT "customer_subscription_product_info_id_fkey" FOREIGN KEY ("product_info_id") REFERENCES "product_info"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
