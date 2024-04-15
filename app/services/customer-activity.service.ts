import { findByProductAndVariantId, } from "./product-info.service";
import prisma from "~/db.server";
import { findStoreByURL } from "./store-info.service";
import { CustomerActivityDTO } from "~/dto/customer-activity.dto";
import { findNotificationHistoryByUUId } from "./notification-history.service";
import { CustomerActivity } from "@prisma/client";

const save = async (customerActivity: CustomerActivityDTO) => {
    console.log(customerActivity);
    const storeInfo = await findStoreByURL(customerActivity.shopifyURL);
    const productInfo = await findByProductAndVariantId(customerActivity.productId, customerActivity.variantId);
    const notificationHistory = await findNotificationHistoryByUUId(customerActivity.uuid);
    return await prisma.customerActivity.create({
        data: {
            status: customerActivity.status,
            browserTrackId: customerActivity.browserTrackId,
            notificationHistory: {
                connect: {
                    id: notificationHistory?.id
                }
            },
            productInfo: {
                connect: {
                    id: productInfo?.id
                }
            },
            store: {
                connect: {
                    id: storeInfo?.id
                }
            },
            updatedAt: new Date(),
            createdAt: new Date(),
        }
    })
};

const saveAll = async (customerActivities: CustomerActivityDTO[]) => {
    const storeInfo = await findStoreByURL(customerActivities[0]?.shopifyURL);
    let data = [] as CustomerActivity[];
    for (const activity of customerActivities) {
        const productInfo = await findByProductAndVariantId(activity.productId, activity.variantId);
        const notificationHistory = await findNotificationHistoryByUUId(activity.uuid);
        console.log("______________________", notificationHistory)
        if (notificationHistory == null) {
            throw new Error('Invalid UUID');
        }
        if (productInfo == null) {
            throw new Error('Product Not Found');
        }
        data.push({
            status: activity.status!,
            browserTrackId: activity.browserTrackId,
            notificationHistoryId: notificationHistory?.id!,
            productInfoId: productInfo?.id!,
            storeId: storeInfo?.id!,
            customerEmail: activity.customerEmail,
            updatedAt: new Date(),
            createdAt: new Date(),
        } as CustomerActivity);
        console.log('------saveAll-----', data);
    }
    return await prisma.customerActivity.createMany({
        data: data
    })
};

const findAll = async (customerActivity: CustomerActivityDTO) => {
    const storeInfo = await findStoreByURL(customerActivity.shopifyURL);
    let count = await prisma.customerActivity.count({
        where: {
            store: {
                id: storeInfo?.id
            },
        },
    })
    let items = await prisma.customerActivity.findMany({
        skip: customerActivity.skip || 0,
        take: customerActivity.take || 5,
        where: {
            store: {
                id: storeInfo?.id
            },
        },
        include: {
            productInfo: {

            }
        }
    })
    return { count, items }
};

export { save as saveCustomerActivity, saveAll as saveCustomerActivities, findAll as findAllActivities }