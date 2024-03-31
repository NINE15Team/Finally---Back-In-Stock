import { ActionFunction, json } from "@remix-run/node"; // or cloudflare/deno
import { setCustomerNotified, findAll as findAllSubscribers, subscribeProduct } from "~/services/customer-subscriber.service";
import { findAllProducts } from "~/services/product-info.service";
import { findEmailConfigByStoreURL } from "~/services/email.service";
import { sendEmail } from "../services/email.service";
import { saveNotificationHistory } from "../services/notification-history.service";
import { randomUUID } from "crypto";

export const action: ActionFunction = async ({ request }) => {
    if (request.method == 'POST') {
        try {
            let requestBody = await request.json();
            let products = await findAllProducts({ shopifyURL: requestBody.shopifyURL, inStock: true, customerSubscribe: { isNotified: false } });
            let emailInfo = await findEmailConfigByStoreURL(requestBody.shopifyURL);
            console.log("____________________________-", products);
            products.forEach(async product => {
                let uuid = randomUUID();
                product.customerSubscription.forEach(async sub => {
                    if (sub.customerEmail?.toLowerCase() == emailInfo?.senderEmail.toLowerCase()) {
                        console.error(`Sender and Receiever can't be same ${sub.customerEmail} - ${emailInfo?.senderEmail}`);
                    } else {
                        let resp = await sendEmail({
                            title: `Product Restock ${product.productTitle}`,
                            toEmail: sub.customerEmail,
                            senderEmail: emailInfo?.senderEmail,
                            subscriberId: sub.id,
                            bodyContent: emailInfo?.bodyContent,
                            headerContent: emailInfo?.headerContent,
                            footerContent: emailInfo?.footerContent,
                            buttonContent: emailInfo?.buttonContent,
                            shopifyURL: requestBody.shopifyURL,
                            storeName: requestBody.storeName,
                            uuid: uuid,
                            productInfo: {
                                productTitle: product.productTitle,
                                productHandle: product.productHandle,
                                variantId: product.variantId,
                                price: product.price,
                                imageURL: product.imageURL,
                                variantTitle: product.variantTitle
                            }
                        })
                        await setCustomerNotified(sub.customerEmail, product.id);
                        console.log(`Notified to ${sub.customerEmail}`, resp);
                    }
                });
                if (product.customerSubscription.length > 0) {
                    await saveNotificationHistory({
                        uuid: uuid,
                        noOfNotifications: product.customerSubscription.length,
                        productInfoId: product.id
                    });
                }
            });
        } catch (error) {
            console.log(error)
        }
    }
    return json({ nice: "jokess" });
};