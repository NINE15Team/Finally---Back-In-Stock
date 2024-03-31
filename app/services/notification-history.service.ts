import prisma from "~/db.server";
import { NotificationHistoryDTO } from "~/dto/notification-history.dto";

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
    findAll as findAllNotificationHistory
}