import prisma from "~/db.server";

const findAll = async () => {
    return await prisma.productInfo.findMany();
};

const findByProductAndVariantId = async (productId: any, variantId: any) => {
    return await prisma.productInfo.findFirst({
        where: {
            productId: productId,
            variantId: variantId
        }
    });
};


const addOutOfStockProduct = async (req: any) => {
    console.log(req);
    let prodcutInfos = [] as any[];
    req.variants.forEach((elm: any) => {
        if (elm.inventory_policy == 'deny' && elm.inventory_quantity == 0)
            prodcutInfos.push({
                productId: elm.product_id + "",
                productTitle: req.title,
                variantId: elm.id + "",
                variantTitle: elm.title,
                status: true,
                inStock: false,
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
                inStock: false,
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
        })
    })
    return prodcutInfos
};


export { findAll, addOutOfStockProduct, findByProductAndVariantId }