import { ProductInfo } from "~/models/product-info.model";

export interface EmailDTO {
    email: String,
    name: String,
    title: String,
    html: String,
    productInfo: ProductInfo
    id: number;
    storeId: number;
    storeName: string;
    senderName: string;
    senderEmail: string;
    isEmailVerified: boolean;
    headerContent: string;
    bodyContent: string;
    footerContent: string;
    createdAt: Date;
    updatedAt: Date;

}