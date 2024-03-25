import prisma from "../db.server";
import { authenticate } from "../shopify.server";

const saveStoreInfo = async (data: any) => {
    return await prisma.shopifyStoreInfo.upsert({
        where: {
            shopifyURL: data.shopifyURL
        },
        update: {
            storeName: data.storeName,
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

const deleteStoreByURL = async (shopifyURL: string) => {
    return await prisma.shopifyStoreInfo.delete({
        where: {
            shopifyURL: shopifyURL
        },
    });
};

const findStoreByURL = async (shopifyURL: string = "") => {
    return await prisma.shopifyStoreInfo.findUnique({
        where: {
            shopifyURL: shopifyURL
        }
    });
};
const updateStoreInfo = async (admin: any) => {
    const { shop } = await admin.rest.get({ path: `shop` }).then((response: any) => response.json());
    let appStoreInfo = await prisma.shopifyStoreInfo.findFirst({
        where: {
            shopifyURL: shop.myshopify_domain
        },
    });
    await prisma.shopifyStoreInfo.update({
        where: {
            id: appStoreInfo?.id
        },
        data: {
            storeId: shop.id + "",
            storeName: shop.name,
            shopifyURL: shop.myshopify_domain,
            isInitilized: true,
            updatedAt: new Date()
        }
    });
    return shop;
};


const isInitilized = async (admin: any) => {
    const { shop } = await admin.rest.get({ path: `shop` }).then((response: any) => response.json());
    let count = await prisma.shopifyStoreInfo.count({
        where: {
            shopifyURL: shop.myshopify_domain,
            isInitilized: true
        }
    });
    return count > 0;
};

const getStoreInfoShopify = async (admin: any) => {
    const { shop } = await admin.rest.get({ path: `shop` }).then((response: any) => response.json());
    return shop;
};

const activateWebPixel = async (admin: any) => {
    const response = await admin.graphql(
        `#graphql
        mutation webPixelCreate($webPixel: WebPixelInput!) {
                webPixelCreate(webPixel: $webPixel) {
                    userErrors {
                        code
                        field
                        message
                    }
                    webPixel {
                        id
                        settings
                    }
                }
            }`, {
        variables: {
            webPixel: {
                settings: JSON.stringify({ accountID: "234" })
            }
        }
    },
    );
    const data = await response.json();
    return response;
};


export { saveStoreInfo, findStoreByURL, deleteStoreByURL, updateStoreInfo, getStoreInfoShopify, activateWebPixel, isInitilized }