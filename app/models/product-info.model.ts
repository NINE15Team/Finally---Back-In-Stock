import { ShopifyStoreInfo } from "./shopify-store-info.model";

export class ProductInfo {
    id: number;
    store: ShopifyStoreInfo;
    productId: number;
    productTitle: String;
    variantId: number;
    variantTitle: String;
    status: boolean;
    inStock: boolean;
    createdAt: Date;
    updatedAt: Date;
    isActive: boolean;

    constructor(
        id: number,
        store: ShopifyStoreInfo,
        productId: number,
        productTitle: String,
        variantId: number,
        variantTitle: String,
        status: boolean,
        inStock: boolean,
        createdAt: Date,
        updatedAt: Date,
        isActive: boolean
    ) {
        this.id = id;
        this.store = store;
        this.productId = productId;
        this.productTitle = productTitle;
        this.variantId = variantId;
        this.variantTitle = variantTitle;
        this.status = status;
        this.inStock = inStock;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.isActive = isActive;
    }
}
