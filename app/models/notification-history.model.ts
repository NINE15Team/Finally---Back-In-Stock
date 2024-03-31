import { CustomerActivity, ProductInfo } from "@prisma/client";

export class NotificationHistory {
    id: number;
    noOfNotifications: number;
    productInfo: ProductInfo;
    uuid: string;
    customerActivity: CustomerActivity[];
    createdAt: Date;
    updatedAt: Date;

    constructor(
        id: number,
        noOfNotifications: number,
        productInfo: ProductInfo,
        uuid: string,
        customerActivity: CustomerActivity[],
        createdAt: Date,
        updatedAt: Date,
    ) {
        this.id = id;
        this.noOfNotifications = noOfNotifications;
        this.productInfo = productInfo;
        this.uuid = uuid;
        this.customerActivity = customerActivity;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
