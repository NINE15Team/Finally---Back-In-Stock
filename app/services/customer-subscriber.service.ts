import { CustomerSubscription } from "@prisma/client";
import prisma from "~/db.server";

const findAll = async (params: any = {}) => {
    return await prisma.customerSubscription.findMany({
        where: {
            isNotified: params?.isNotified
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


export { findAll, subscribeProduct, setCustomerNotified }