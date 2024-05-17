import type { BaseDTO } from "./base.dto";
import type { CustomerSubscriptionDTO } from "./customer-subscription.dto";

export interface ProductInfoDTO extends BaseDTO {
    id?: number;
    storeId?: string;
    storeName?: string;
    productHandle?: string;
    productId?: number;
    productTitle?: string;
    variantId?: number;
    variantTitle?: string;
    price?: number;
    imageURL?: string;
    status?: boolean;
    inStock?: boolean;
    customerSubscribe: CustomerSubscriptionDTO;
    vendor?: string;
    createdAt?: Date;
    updatedAt?: Date;
    isActive?: boolean;
}
