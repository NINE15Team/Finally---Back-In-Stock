import prisma from "~/db.server";
import { NotificationHistoryDTO } from "~/dto/notification-history.dto";
import { NotificationHistory } from "~/models/notification-history.model";

const save = async (historyDTO: NotificationHistoryDTO) => {
    return await prisma.notificationHistory.create({
        data: {
            noOfNotifications: historyDTO.noOfNotifications,
            uuid: historyDTO.uuid,
            productInfo: {
                connect: {
                    id: historyDTO.productInfoId
                }
            },
            updatedAt: new Date(),
            createdAt: new Date(),
        }
    })
};

const findAll = async (historyDTO: NotificationHistoryDTO) => {
    return await prisma.notificationHistory.findMany({
        where: {
            productInfo: {
                store: {
                    shopifyURL: historyDTO.shopifyURL
                }
            }
        },
        include: {
            customerActivity: {

            }
        }
    })
};

const getConversionRate = async (shopifyURL: string) => {
    const results = await prisma.$queryRaw`SELECT 
    nh.id,nh.no_of_notifications,pi2.product_title,pi2.variant_title,nh.created_at,
    COUNT(CASE WHEN ca.activity = 'view' THEN 1 END) AS view_count,
    COUNT(CASE WHEN ca.activity = 'add_to_cart' THEN 1 END) AS add_to_cart_count,
    COUNT(CASE WHEN ca.activity = 'completed' THEN 1 END) AS completed_count
    FROM notification_history nh
    LEFT JOIN customer_activity ca ON ca.notification_history_id = nh.id
    LEFT JOIN store_info si ON si.id = ca.store_id
    Left JOIN product_info pi2 ON pi2.id  = nh.product_info_id 
    WHERE si.shopify_url = ${shopifyURL}
    GROUP BY nh.id,pi2.id` as any[];
    let histories = [] as NotificationHistoryDTO[];
    if (results) {
        for (const result of results) {
            let productTitle = `${result['product_title']} - ${result['variant_title']}`;
            histories.push({
                productTitle: productTitle,
                noOfNotifications: result['no_of_notifications'],
                viewCount: result['view_count'],
                addToCartCount: result['add_to_cart_count'],
                completedCount: result['completed_count'],
                createdAt: result['created_at'],
            });
        }
    }
    return histories;
};

const findByUUID = async (uuid: any) => {
    return await prisma.notificationHistory.findFirst({
        where: {
            uuid: uuid,
        }
    })
};

export {
    save as saveNotificationHistory,
    findByUUID as findNotificationHistoryByUUId,
    findAll as findAllNotificationHistory,
    getConversionRate
}