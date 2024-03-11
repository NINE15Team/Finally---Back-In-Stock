export interface ProductInfoDTO {
    id: number;
    storeId: string;
    storeName: string;
    productId: string;
    productTitle: string;
    productHandle: string;
    variantId: string;
    variantTitle: string;
    status: boolean;
    inStock: boolean;
    createdAt: Date;
    updatedAt: Date;
    isActive: boolean;
}
