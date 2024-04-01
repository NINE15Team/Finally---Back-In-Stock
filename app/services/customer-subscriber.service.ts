import { CustomerSubscription } from "@prisma/client";
import prisma from "~/db.server";
import { findStoreByURL } from "./store-info.service";
import { CustomerSubscriptionDTO } from "~/dto/customer-subscription.dto";

const findById = async (params: CustomerSubscriptionDTO) => {
    return await prisma.customerSubscription.findFirst({
        where: {
            id: params.id
        },
        include: {
            productInfo: {
                include: {
                    store: {

                    }
                }
            }
        }
    });
};


const findAll = async (params: CustomerSubscriptionDTO) => {
    return await prisma.customerSubscription.findMany({
        skip: params.skip || 0,
        take: params.take || 5,
        where: {
            productInfo: {
                inStock: params.inStock,
                store: {
                    shopifyURL: params.shopifyURL
                }
            },
            isNotified: params?.isNotified,
        },
        include: {
            productInfo: {
                include: {
                    store: true
                }
            },
        },
        orderBy: {
            updatedAt: 'desc',
        }
    });
};

const subscribeProduct = async (subscribeItem: CustomerSubscriptionDTO) => {
    return await prisma.customerSubscription.upsert({
        where: {
            customerEmail_productInfoId: {
                customerEmail: subscribeItem.customerEmail!,
                productInfoId: subscribeItem.productInfoId!
            }
        },
        update: {
            isNotified: false,
            isSubscribed: true,
            updatedAt: new Date(),
        },
        create: {
            customerEmail: subscribeItem.customerEmail,
            isSubscribed: true,
            isNotified: false,
            createdAt: new Date(),
            updatedAt: new Date(),
            productInfo: {
                connect: {
                    id: subscribeItem.productInfoId
                }
            }

        }
    })
};

const unSubscribeProduct = async (subscribeItem: CustomerSubscriptionDTO) => {
    return await prisma.customerSubscription.update({
        where: {
            id: subscribeItem.id
        },
        data: {
            isSubscribed: false,
            updatedAt: new Date(),
        },
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

const countOfSubscribers = async (storeURL: string) => {
    const count = await prisma.customerSubscription.count({
        where: {
            productInfo: {
                store: {
                    shopifyURL: storeURL
                }
            },
            AND: [
                { isSubscribed: true },
                { isNotified: false },
            ],
        },
    });
    return count;
};


export { findById, findAll as findAllSubscribers, subscribeProduct, setCustomerNotified, findTotalPotentialRevenue, unSubscribeProduct, countOfSubscribers }