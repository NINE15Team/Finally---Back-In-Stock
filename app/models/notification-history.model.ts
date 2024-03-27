import { ProductInfo } from "@prisma/client";

export class NotificationHistory {
    id: number;
    noOfNotifications: number;
    productInfo: ProductInfo;
    createdAt: Date;
    updatedAt: Date;

    constructor(
        id: number,
        noOfNotifications: number,
        productInfo: ProductInfo,
        createdAt: Date,
        updatedAt: Date,
    ) {
        this.id = id;
        this.noOfNotifications = noOfNotifications;
        this.productInfo = productInfo;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
