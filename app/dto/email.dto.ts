import { EmailVerificationStatus } from "~/enum/EmailVerificationStatus";
import { ProductInfo } from "~/models/product-info.model";

export interface EmailDTO {
    email: String;
    name: String;
    title: String;
    html: String;
    productInfo: ProductInfo;
    id: number;
    storeId: number;
    storeName: string;
    senderName: string;
    senderEmail: string;
    isEmailVerified: EmailVerificationStatus | string;
    senderId: number;
    headerContent: string;
    headerFontFamily: string;
    headerFontSize: string;
    headerBgColor: string;
    bodyContent: string;
    bodyFontFamily: string;
    bodyFontSize: string;
    bodyBgColor: string;
    footerContent: string;
    footerFontFamily: string;
    footerFontSize: string;
    footerBgColor: string;

    createdAt: Date;
    updatedAt: Date;

}