import { ActionFunction, json } from "@remix-run/node"; // or cloudflare/deno
import { setCustomerNotified, findAll as findAllSubscribers, subscribeProduct } from "~/services/customer-subscriber.service";
import { findEmailConfigByStoreURL } from "~/services/email.service";
import { sendEmail } from "../services/email.service";

export const action: ActionFunction = async ({ request }) => {
    if (request.method == 'POST') {
        let requestBody = await request.json();
        let subscribers = await findAllSubscribers({ isNotified: false, isSubscribed: true, shopifyURL: requestBody.shopifyURL, inStock: true });
        let emailInfo = await findEmailConfigByStoreURL(requestBody.shopifyURL);
        subscribers.forEach(async sub => {
            if (sub.customerEmail?.toLowerCase() == emailInfo?.senderEmail.toLowerCase()) {
                console.error(`Sender and Receiever can't be same ${sub.customerEmail} - ${emailInfo?.senderEmail}`);
            } else {
                let resp = await sendEmail({
                    title: `Product Restock ${sub.productInfo.productTitle}`,
                    toEmail: sub.customerEmail,
                    senderEmail: emailInfo?.senderEmail,
                    subscriberId: sub.id,
                    bodyContent: emailInfo?.bodyContent,
                    headerContent: emailInfo?.headerContent,
                    footerContent: emailInfo?.footerContent,
                    buttonContent: emailInfo?.buttonContent,
                    shopifyURL: requestBody.shopifyURL,
                    storeName: requestBody.storeName,
                    productInfo: {
                        productTitle: sub.productInfo.productTitle,
                        productHandle: sub.productInfo.productHandle,
                        variantId: sub.productInfo.variantId,
                        price: sub.productInfo.price,
                        imageURL: sub.productInfo.imageURL,
                        variantTitle: sub.productInfo.variantTitle
                    }
                })
                await setCustomerNotified(sub.customerEmail, sub.productInfo.id);
                console.log(`Notified to ${sub.customerEmail}`, resp);
            }
        })
    }
    return json({ nice: "jokess" });
};