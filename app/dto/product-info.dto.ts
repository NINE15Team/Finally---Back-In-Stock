import { CustomerSubscriptionDTO } from "./customer-subscription.dto";

export interface ProductInfoDTO {
    id?: number;
    storeId?: string;
    storeName?: string;
    shopifyURL?: string;
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
    createdAt?: Date;
    updatedAt?: Date;
    isActive?: boolean;
}
