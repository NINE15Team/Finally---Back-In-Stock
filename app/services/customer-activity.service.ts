import { CustomerSubscription } from "@prisma/client";
import { findAll as findProducts } from "./product-info.service";
import prisma from "~/db.server";
import { findStoreByURL } from "./store-info.service";
import { CustomerSubscriptionDTO } from "~/dto/customer-subscription.dto";
import { CustomerActivityDTO } from "~/dto/customer-activity.dto";

const save = async (customerActivity: CustomerActivityDTO) => {
    // return await prisma.customerActivity.upsert({
    //     where: {
    //         store:{
    //             storeId:customerActivity.
    //         } 
    //     },
    //     update: {
    //         updatedAt: new Date(),
    //     },
    //     create: {
    //     }
    // })
};


export {  }