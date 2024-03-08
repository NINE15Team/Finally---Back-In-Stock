import { CustomerSubscription } from "@prisma/client";
import prisma from "~/db.server";

const findAll = async () => {
    return await prisma.customerSubscription.findMany({
        include: {
            productInfo: true,
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


export { findAll, subscribeProduct }