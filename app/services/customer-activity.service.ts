import { findByProductAndVariantId, } from "./product-info.service";
import prisma from "~/db.server";
import { findStoreByURL } from "./store-info.service";
import { CustomerSubscriptionDTO } from "~/dto/customer-subscription.dto";
import { CustomerActivityDTO } from "~/dto/customer-activity.dto";
import { findNotificationHistoryByUUId } from "./notification-history.service";

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


export { save as saveCustomerActivity }