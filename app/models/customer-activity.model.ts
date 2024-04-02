import type { ProductInfo, ShopifyStoreInfo } from "@prisma/client";

export class CustomerActivity {
    id?: number = 0;
    status: string;
    productInfo: ProductInfo;
    store: ShopifyStoreInfo;
    browserTrackId: string;
    createdAt: Date;
    updatedAt: Date;

    constructor(
        id: number,
        status: string,
        productInfo: ProductInfo,
        store: ShopifyStoreInfo,
        browserTrackId: string,
        createdAt: Date,
        updatedAt: Date
    ) {
        this.id = id;
        this.status = status;
        this.productInfo = productInfo;
        this.store = store;
        this.browserTrackId = browserTrackId;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
