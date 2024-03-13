import { ActionFunction, json } from "@remix-run/node"; // or cloudflare/deno
import { ShopifyUtils } from "@shopify/shopify-api/lib/utils";
import { ProductInfo } from "~/models/product-info.model";
import { setCustomerNotified, findAll, subscribeProduct } from "~/services/customer-subscriber.service";
import { sendEmail } from "../services/email.service";
import { EmailDTO } from "~/dto/email.dto";

export const action: ActionFunction = async ({ request }) => {
    if (request.method == 'POST') {
        let requstBody = await request.json();
        let subscribers = await findAll({ isNotified: false });
        subscribers.forEach(async sub => {
            let prodInfo: any = sub.productInfo;
            let resp = await sendEmail({
                title: `Product Restock ${sub.productInfo.productTitle}`,
                email: sub.customerEmail,
                name: "Finally Back in Stock",
                productInfo: prodInfo
            } as unknown as EmailDTO)
            setCustomerNotified(sub.customerEmail, sub.productInfo.id);
            console.log(`Notified to ${sub.customerEmail}`, resp);
        })
    }
    return json({ nice: "jokess" });
};