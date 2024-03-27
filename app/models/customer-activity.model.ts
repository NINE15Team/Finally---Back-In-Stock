import { NotificationHistory } from "@prisma/client";

class CustomerActivity {
    id: number;
    status: string;
    notificationHistory: NotificationHistory; 
    customerSubscriptionId: number;
    createdAt: Date;
    updatedAt: Date;

    constructor(
        id: number,
        status: string,
        notificationHistory: NotificationHistory,
        customerSubscriptionId: number,
        createdAt: Date,
        updatedAt: Date
    ) {
        this.id = id;
        this.status = status;
        this.notificationHistory = notificationHistory;
        this.customerSubscriptionId = customerSubscriptionId;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
