import prisma from "../db.server";

const saveStoreInfo = async (data: any) => {
    return await prisma.shopifyStoreInfo.upsert({
        where: {
            storeName: data.storeName
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

const deleteStoreByName = async (storeName: string) => {
    return await prisma.shopifyStoreInfo.delete({
        where: {
            storeName: storeName
        },
    });
};

const deleteStoreByURL = async (storeName: string) => {
    return await prisma.shopifyStoreInfo.delete({
        where: {
            storeName: storeName
        },
    });
};

const findStoreByName = async (name: string = "") => {
    return await prisma.shopifyStoreInfo.findUnique({
        where: {
            storeName: name
        }
    });
};

export { saveStoreInfo, findStoreByName, deleteStoreByName, deleteStoreByURL }