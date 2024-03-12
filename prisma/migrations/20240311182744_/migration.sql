-- CreateTable
CREATE TABLE "email_configuartion" (
    "id" SERIAL NOT NULL,
    "store_id" INTEGER NOT NULL,
    "sender_name" TEXT NOT NULL,
    "sender_email" TEXT NOT NULL,
    "email_verified" TEXT NOT NULL,
    "header_content" TEXT NOT NULL DEFAULT 'Default Variant',
    "body_content" TEXT NOT NULL DEFAULT 'Default Variant',
    "footerContent" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "email_configuartion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "email_configuartion_store_id_key" ON "email_configuartion"("store_id");

-- AddForeignKey
ALTER TABLE "email_configuartion" ADD CONSTRAINT "email_configuartion_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "store_info"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
