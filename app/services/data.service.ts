
const storeInfoData =
    [{
        id: 1,
        storeId: '74725032224',
        storeName: 'App BIS',
        shopifyURL: 'app-bis.myshopify.com',
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
        productInfo: {
            create: [
                {
                    productId: '8339514786082',
                    productTitle: 'A Pox on You - Katahdin - Babettess',
                    variantId: '45396012859682',
                    variantTitle: 'Default Title',
                    status: true,
                    inStock: true,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    isActive: true
                },
                {
                    productId: '8339514851618',
                    productTitle: 'Asael - 2-Ply Toes   ',
                    variantId: '45396013646114',
                    variantTitle: 'Default Title',
                    status: true,
                    inStock: true,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    isActive: true
                }
            ]
        },

    }]


const productInfoData = [{
    productId: '8339515146530',
    productTitle: 'Combo 1 - Mad for Plaid Set',
    variantId: '45396013973794',
    variantTitle: 'Default Title',
    status: true,
    inStock: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    isActive: true,
    store: {
        connect: {
            id: 1
        }
    },


}]

const customerSubscriptionData =
    [{
        customerEmail: 'khair@nine15.com',
        status: true,
        isNotified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
        productInfo: {
            connect: {
                id: 1
            }
        },
    }]


export { storeInfoData, customerSubscriptionData, productInfoData }