import { ProductInfo } from "./product-info.model";

export class CustomerSubscription {
    id: number;
    productInfo: ProductInfo;
    customerEmail: string;
    status: boolean;
    isNotified: boolean;
    createdAt: Date;
    updatedAt: Date;
    isActive: boolean;
    constructor(
        id: number,
        productInfo: ProductInfo,
        customerEmail: string,
        status: boolean,
        isNotified: boolean,
        createdAt: Date,
        updatedAt: Date,
        isActive: boolean,
    ) {
        this.id = id;
        this.productInfo = productInfo;
        this.customerEmail = customerEmail;
        this.status = status;
        this.isNotified = isNotified;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.isActive = isActive;
    }


}
