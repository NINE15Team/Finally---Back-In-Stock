import { CustomerSubscription } from "@prisma/client";
import { findAll as findProducts } from "../services/product-info.service";
import prisma from "~/db.server";
import { findStoreByURL } from "./store-info.service";

const findAll = async (params: any = {}) => {
    return await prisma.customerSubscription.findMany({
        where: {
            isNotified: params?.isNotified,
            productInfo: {
                inStock: false,
                store: {
                    storeName: params.storeName
                }
            }
        },
        include: {
            productInfo: {
                include: {
                    store: true
                }
            },
        },
    });
};

const subscribeProduct = async (subscribeItem: any) => {
    return await prisma.customerSubscription.upsert({
        where: {
            customerEmail_productInfoId: {
                customerEmail: subscribeItem.customerEmail,
                productInfoId: subscribeItem.productInfo.connect.id
            }
        },
        update: {
            isNotified: false,
            updatedAt: new Date(),
        },
        create: {
            customerEmail: subscribeItem.customerEmail,
            createdAt: new Date(),
            updatedAt: new Date(),
            productInfo: {
                connect: {
                    id: subscribeItem.productInfo.connect.id
                }
            }

        }
    })
};

const setCustomerNotified = async (email: string, productInfoId: number) => {
    return await prisma.customerSubscription.update({
        where: {
            customerEmail_productInfoId: {
                customerEmail: email,
                productInfoId: productInfoId
            }
        },
        data: {
            isNotified: true,
            updatedAt: new Date(),
        },
    })
};

const findTotalPotentialRevenue = async (storeURL: string): Promise<{ potentialRevenue: any }> => {
    let storeInfo = await findStoreByURL(storeURL);
    let result: any[] = await prisma.$queryRaw`SELECT  SUM(pi2.price) FROM  customer_subscription cs Left join  product_info pi2  on pi2.id = cs.product_info_id  left join store_info si on pi2.store_id = si.id  where si.id = ${storeInfo?.id}`
    return { potentialRevenue: result[0].sum }
};


export { findAll, subscribeProduct, setCustomerNotified, findTotalPotentialRevenue }