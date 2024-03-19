export interface ProductInfoDTO {
    id: number;
    storeId: string;
    storeName: string;
    storeURL: string;
    productHandle: string;
    productId: string;
    productTitle: string;
    variantId: string;
    variantTitle: string;
    price: string;
    imageURL: string;
    status: boolean;
    inStock: boolean;
    createdAt: Date;
    updatedAt: Date;
    isActive: boolean;
}
