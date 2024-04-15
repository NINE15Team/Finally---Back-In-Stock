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

const findByEmailAndProductInfo = async (params: CustomerSubscriptionDTO) => {
    return await prisma.customerSubscription.findFirst({
        where: {
            productInfo: {
                id: params.productInfoId
            },
            customerEmail: params.customerEmail,
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
    let clause = {} as Partial<CustomerSubscription>;
    if (params.isNotified !== undefined) {
        clause.isNotified = params.isNotified
    }
    let count = await prisma.customerSubscription.count({
        where: {
            productInfo: {
                store: {
                    shopifyURL: params.shopifyURL
                }
            },
            ...clause
        }
    })
    let items = await prisma.customerSubscription.findMany({
        skip: params.skip || 0,
        take: params.take || 5,
        where: {
            productInfo: {
                store: {
                    shopifyURL: params.shopifyURL
                }
            },
            ...clause
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
    return { items, count }
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
            customerPhone: subscribeItem.customerPhone
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
            },
            customerTel: subscribeItem.tel
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

const notifyToCustomers = async (subscriberList: CustomerSubscriptionDTO[]) => {
    let emailInfo = await findEmailConfigByStoreURL(subscriberList[0].shopifyURL);
    for (const subscriber of subscriberList) {
        let sub;
        if (subscriber.id) {
            sub = await findById(subscriber);
        } else if (subscriber.customerEmail) {
            sub = await findByEmailAndProductInfo(subscriber);
        }
        if (sub != undefined && sub != null) {
            let uuid = randomUUID();
            let { productInfo } = sub;
            if (sub?.customerEmail?.toLowerCase() == emailInfo?.senderEmail.toLowerCase()) {
                console.error(`Sender and Receiever can't be same ${sub.customerEmail} - ${emailInfo?.senderEmail}`);
                return false
            } else {
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
    }
    return subscriberList;
}

const updateSubscribtionStatus = async (ids: number[], isSubscribed: boolean) => {
    return await prisma.$executeRaw`UPDATE customer_subscription SET is_subscribed = ${isSubscribed} WHERE id IN (${Prisma.join(ids)})`;
};


export {
    findById,
    findAll as findAllSubscribers,
    subscribeProduct,
    setCustomerNotified,
    findTotalPotentialRevenue,
    unSubscribeProduct,
    updateSubscribtionStatus,
    countOfSubscribers,
    notifyToCustomers,
    findByEmailAndProductInfo
}