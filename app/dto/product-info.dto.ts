export interface ProductInfoDTO {
    id: number;
    storeId: string;
    storeName: string;
    productURI: string;
    productId: string;
    productTitle: string;
    variantId: string;
    variantTitle: string;
    status: boolean;
    inStock: boolean;
    createdAt: Date;
    updatedAt: Date;
    isActive: boolean;
}
