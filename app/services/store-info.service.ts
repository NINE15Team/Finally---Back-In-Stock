import prisma from "../db.server";
import { authenticate } from "../shopify.server";

const saveStoreInfo = async (data: any) => {
    return await prisma.shopifyStoreInfo.upsert({
        where: {
            shopifyURL: data.shopifyURL
        },
        update: {
            storeName: data.storeName,
            shopifyURL: data.shopifyURL,
            updatedAt: new Date(),
        },
        create: {
            storeId: data.storeName,
            storeName: data.storeName,
            shopifyURL: data.shopifyURL,
            updatedAt: new Date(),
        }

    });
};

const deleteStoreByURL = async (storeURL: string) => {
    return await prisma.shopifyStoreInfo.delete({
        where: {
            shopifyURL: storeURL
        },
    });
};

const findStoreByURL = async (url: string = "") => {
    return await prisma.shopifyStoreInfo.findUnique({
        where: {
            shopifyURL: url
        }
    });
};
const updateStoreInfo = async (admin: any) => {
    const { shop } = await admin.rest.get({
        path: `shop`,
    }).then((response: any) => response.json());
    console.log(shop);
    let appStoreInfo = await prisma.shopifyStoreInfo.findFirst({
        where: {
            shopifyURL: shop.myshopify_domain
        },
    });

    return await prisma.shopifyStoreInfo.update({
        where: {
            id: appStoreInfo?.id
        },
        data: {
            storeId: shop.id + "",
            storeName: shop.name,
            updatedAt: new Date()
        }
    });

};

export { saveStoreInfo, findStoreByURL, deleteStoreByURL, updateStoreInfo }