import { PrismaClient } from '@prisma/client'
import { storeInfoData, customerSubscriptionData } from '../app/services/data.service'

const prisma = new PrismaClient()
async function seed() {
    console.log(`Start Inserting Stores...`);
    storeInfoData.forEach(async elm => {
        let result = await prisma.shopifyStoreInfo.create({
            data: elm,
        })
        console.log('Insert .....................', result)
    })


    setTimeout(() => {
        console.log(`Start Inserting Customer Subscriber...`);
        customerSubscriptionData.forEach(async elm => {
            let result = await prisma.customerSubscription.create({
                data: elm
            })
            console.log('Insert Customer Subscriber .....................', result)
        })

    }, 1000)

    // setTimeout(() => {
    //     console.log(`Start Inserting Product Info ...`);
    //     productInfoData.forEach(async elm => {
    //         let result = await prisma.productInfo.create({
    //             data: elm
    //         })
    //         console.log('Insert Product .....................', result)
    //     })

    // }, 3000)
}

seed()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })