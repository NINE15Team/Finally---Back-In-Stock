import { CustomerSubscription, Prisma } from "@prisma/client";
import prisma from "~/db.server";
import { findStoreByURL } from "./store-info.service";
import { CustomerSubscriptionDTO } from "~/dto/customer-subscription.dto";
import { findEmailConfigByStoreURL, sendEmail } from "./email.service";
import { randomUUID } from "crypto";
import { saveNotificationHistory } from "./notification-history.service";

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

const notifyToCustomer = async (subscriberList: CustomerSubscriptionDTO[]) => {
    let emailInfo = await findEmailConfigByStoreURL(subscriberList[0].shopifyURL);
    for (const subscriber of subscriberList) {
        let sub = await findById(subscriber);
        let uuid = randomUUID();
        let { productInfo } = sub;
        let resp = await sendEmail({
            title: `Product Restock ${productInfo.productTitle}`,
            toEmail: sub?.customerEmail,
            senderEmail: emailInfo?.senderEmail,
            subscriberId: sub?.id,
            bodyContent: emailInfo?.bodyContent,
            headerContent: emailInfo?.headerContent,
            footerContent: emailInfo?.footerContent,
            buttonContent: emailInfo?.buttonContent,
            shopifyURL: subscriberList[0].shopifyURL,
            storeName: subscriberList[0].storeName,
            uuid: uuid,
            productInfo: {
                productTitle: productInfo.productTitle,
                productHandle: productInfo.productHandle,
                variantId: productInfo.variantId,
                price: productInfo.price,
                imageURL: productInfo.imageURL,
                variantTitle: productInfo.variantTitle
            }
        })
        await setCustomerNotified(sub?.customerEmail!, productInfo.id);
        console.log(`Notified to ${sub?.customerEmail}`, resp);
        await saveNotificationHistory({
            uuid: uuid,
            noOfNotifications: 1,
            productInfoId: productInfo.id
        });

    }


}

const unSubscribeProducts = async (subscribeItems: CustomerSubscriptionDTO[]) => {
    let isSubscribed = false;
    const ids = subscribeItems.map(item => item.id);
    return await prisma.$executeRaw`UPDATE customer_subscription SET is_subscribed = ${isSubscribed} WHERE id IN (${Prisma.join(ids)})`;
};


export {
    findById,
    findAll as findAllSubscribers,
    subscribeProduct,
    setCustomerNotified,
    findTotalPotentialRevenue,
    unSubscribeProduct,
    unSubscribeProducts,
    countOfSubscribers,
}