import prisma from "~/db.server";

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

const addProductInfo = async (req: any) => {
    return await prisma.productInfo.upsert({
        where: {
            productId_variantId: {
                productId: req.productId,
                variantId: req.variantId
            }
        },
        update: {
            productTitle: req.productTitle,
            variantTitle: req.variantTitle,
            status: true,
            inStock: false,
            updatedAt: new Date(),
            isActive: true,
        },
        create: {
            productId: req.productId,
            productTitle: req.productTitle,
            productHandle: req.productHandle,
            variantId: req.variantId,
            variantTitle: req.variantTitle,
            status: true,
            inStock: false,
            createdAt: new Date(),
            updatedAt: new Date(),
            isActive: true,
            store: {
                connect: {
                    id: 1
                }
            }

        }
    });
}

const upsertProduct = async (req: any) => {
    let prodcutInfos = [] as any[];
    req.variants.forEach((elm: any) => {
        if (elm.inventory_policy == 'deny')
            prodcutInfos.push({
                productId: elm.product_id + "",
                productTitle: req.title,
                productHandle: req.handle,
                variantId: elm.id + "",
                variantTitle: elm.title,
                status: true,
                inStock: elm.inventory_quantity > 0 ? true : false,
                createdAt: new Date(),
                updatedAt: new Date(),
                isActive: req.status == 'active' ? true : false,
                store: {
                    connect: {
                        id: 1
                    }
                }
            })
    });
    console.log(prodcutInfos);
    prodcutInfos.forEach(async elm => {
        return await prisma.productInfo.upsert({
            where: {
                productId_variantId: {
                    productId: elm.productId,
                    variantId: elm.variantId
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
                inStock: false,
                createdAt: new Date(),
                updatedAt: new Date(),
                isActive: true,
                store: {
                    connect: {
                        id: 1
                    }
                }

            }
        });

    })
    return prodcutInfos;
};

export { findAll, upsertProduct, addProductInfo, findByProductAndVariantId, countProductAndVariantId, isProductAlreadyAdded }