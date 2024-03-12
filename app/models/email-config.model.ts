import { ShopifyStoreInfo } from "./shopify-store-info.model";

class EmailConfiguration {
    id: number = 0;
    store: ShopifyStoreInfo = {} as ShopifyStoreInfo;
    senderName: string = '';
    senderEmail: string = '';
    isEmailVerified: boolean = false;
    headerContent: string = '';
    headerFontFamily: string = '';
    headerFontSize: string = '';
    headerBgColor: string = '';
    bodyContent: string = '';
    bodyFontFamily: string = '';
    bodyFontSize: string = '';
    bodyBgColor: string = '';
    footerContent: string = '';
    footerFontFamily: string = '';
    footerFontSize: string = '';
    footerBgColor: string = '';
    createdAt: Date = new Date();
    updatedAt: Date = new Date();
}
