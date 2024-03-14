import { ShopifyStoreInfo } from "./shopify-store-info.model";

export class ProductInfo {
    id: number;
    store: ShopifyStoreInfo;
    productHandle: string;
    productId: number;
    productTitle: string;
    variantId: number;
    variantTitle: string;
    price: string;
    imageURL: string;
    status: boolean;
    inStock: boolean;
    createdAt: Date;
    updatedAt: Date;
    isActive: boolean;

    constructor(
        id: number,
        store: ShopifyStoreInfo,
        productHandle: string,
        productId: number,
        productTitle: string,
        variantId: number,
        variantTitle: string,
        price: string,
        imageURL: string,
        status: boolean,
        inStock: boolean,
        createdAt: Date,
        updatedAt: Date,
        isActive: boolean
    ) {
        this.id = id;
        this.store = store;
        this.productHandle = productHandle;
        this.productId = productId;
        this.productTitle = productTitle;
        this.variantId = variantId;
        this.variantTitle = variantTitle;
        this.price = price;
        this.imageURL = imageURL;
        this.status = status;
        this.inStock = inStock;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.isActive = isActive;
    }
}
