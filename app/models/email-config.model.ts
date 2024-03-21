import { Prisma } from "@prisma/client";
import { ShopifyStoreInfo } from "./shopify-store-info.model";
import { EmailVerificationStatus } from "~/enum/EmailVerificationStatus";

export class EmailConfiguration {
    id: number = 0;
    store: ShopifyStoreInfo = {} as ShopifyStoreInfo;
    title: string = '';
    senderId: number = 0;
    isEmailVerified: EmailVerificationStatus = EmailVerificationStatus.NO;
    headerContent: string = '';
    bodyContent: string = '';
    footerContent: string = '';
    buttonContent: string = '';
    createdAt: Date = new Date();
    updatedAt: Date = new Date();
}
