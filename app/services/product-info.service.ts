import prisma from "~/db.server";
import { findStoreByName } from "../services/store-info.service";
import { ProductInfoDTO } from "~/dto/product-info.dto";

const findAll = async () => {
    return await prisma.productInfo.findMany();
};

const isProductAlreadyAdded = async (productId: any, variantId: any) => {
    let count = await countProductAndVariantId(productId, variantId);
    return count > 0;
};

const countProductAndVariantId = async (productId: any, variantId: any) => {
    return await prisma.productInfo.count({
        where: {
            productId: productId,
            variantId: variantId
        }
    });
};


const findByProductAndVariantId = async (productId: any, variantId: any) => {
    return await prisma.productInfo.findFirst({
        where: {
            productId: productId,
            variantId: variantId
        }
    });
};

const addProductInfo = async (prodInfo: ProductInfoDTO) => {
    let storeInfo = await findStoreByName(prodInfo.storeName);
    return await prisma.productInfo.upsert({
        where: {
            productId_variantId: {
                productId: prodInfo.productId,
                variantId: prodInfo.variantId
            }
        },
        update: {
            productTitle: prodInfo.productTitle,
            variantTitle: prodInfo.variantTitle,
            status: true,
            inStock: false,
            updatedAt: new Date(),
            isActive: true,
        },
        create: {
            productId: prodInfo.productId,
            productTitle: prodInfo.productTitle,
            variantId: prodInfo.variantId,
            variantTitle: prodInfo.variantTitle,
            status: true,
            inStock: false,
            createdAt: new Date(),
            updatedAt: new Date(),
            isActive: true,
            store: {
                connect: {
                    id: storeInfo?.id
                }
            }

        }
    });
}

const upsertProduct = async (req: any, store: string) => {
    let prodcutInfos = [] as any[];
    req.variants.forEach((elm: any) => {
        if (elm.inventory_policy == 'deny')
            prodcutInfos.push({
                productId: elm.product_id + "",
                productTitle: req.title,
                variantId: elm.id + "",
                variantTitle: elm.title,
                status: true,
                inStock: elm.inventory_quantity > 0 ? true : false,
                createdAt: new Date(),
                updatedAt: new Date(),
                isActive: req.status == 'active' ? true : false,
            })
    });
    let storeInfo = await findStoreByName(store);
    prodcutInfos.forEach(async elm => {
        console.log(elm)
        return await prisma.productInfo.upsert({
            where: {
                productId_variantId: {
                    productId: elm.productId,
                    variantId: elm.variantId,
                }
            },
            update: {
                productTitle: elm.productTitle,
                variantTitle: elm.variantTitle,
                status: true,
                inStock: elm.inStock,
                updatedAt: new Date(),
                isActive: true,
            },
            create: {
                productId: elm.productId,
                productTitle: elm.productTitle,
                variantId: elm.variantId,
                variantTitle: elm.variantTitle,
                status: true,
                inStock: elm.inStock,
                createdAt: new Date(),
                updatedAt: new Date(),
                isActive: true,
                store: {
                    connect: {
                        id: storeInfo?.id
                    }
                }

            }
        });

    })
    return prodcutInfos;
};

export { findAll, upsertProduct, addProductInfo, findByProductAndVariantId, countProductAndVariantId, isProductAlreadyAdded }