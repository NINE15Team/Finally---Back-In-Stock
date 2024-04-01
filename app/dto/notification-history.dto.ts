import { BaseDTO } from "./base.dto";

export interface NotificationHistoryDTO extends BaseDTO {
    id?: number;
    noOfNotifications?: number;
    productInfoId?: number;
    productTitle?: string;
    storeId?: number;
    uuid?: string;
    viewCount?: number;
    addToCartCount?: number;
    completedCount?: number;
}
