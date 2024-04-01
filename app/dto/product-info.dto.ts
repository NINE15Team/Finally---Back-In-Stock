import { BaseDTO } from "./base.dto";
import { CustomerSubscriptionDTO } from "./customer-subscription.dto";

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
    createdAt?: Date;
    updatedAt?: Date;
    isActive?: boolean;
}
