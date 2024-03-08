import { ActionFunction, json, LoaderFunction } from "@remix-run/node"; // or cloudflare/deno
import { findByProductAndVariantId, isProductAlreadyAdded, addProductInfo } from "~/services/product-info.service";
import { findAll } from "~/services/customer-subscriber.service";
import { sendEmail } from "~/services/email.service";

export const action: ActionFunction = async ({ request }) => {
    if (request.method == 'POST') {
        let requstBody = await request.json();
        let subscribers = await findAll({ isNotified: false });
        console.log('khair', subscribers);
    }
    return json({ nice: "jokess" });
};