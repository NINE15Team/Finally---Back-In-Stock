import prisma from "~/db.server";

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
            storeId: '12345',
            storeName: data.storeName,
            shopifyURL: data.shopifyURL,
            updatedAt: new Date(),

        }

    });
};


export { saveStoreInfo }