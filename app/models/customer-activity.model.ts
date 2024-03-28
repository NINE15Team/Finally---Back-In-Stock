import { NotificationHistory, ShopifyStoreInfo } from "@prisma/client";

class CustomerActivity {
    id: number;
    status: string;
    notificationHistory: NotificationHistory;
    store: ShopifyStoreInfo;
    customerSubscriptionId: number;
    createdAt: Date;
    updatedAt: Date;

    constructor(
        id: number,
        status: string,
        notificationHistory: NotificationHistory,
        customerSubscriptionId: number,
        store: ShopifyStoreInfo,
        createdAt: Date,
        updatedAt: Date
    ) {
        this.id = id;
        this.status = status;
        this.notificationHistory = notificationHistory;
        this.customerSubscriptionId = customerSubscriptionId;
        this.store = store;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
