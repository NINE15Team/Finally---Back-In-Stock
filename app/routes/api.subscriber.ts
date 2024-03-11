import { ActionFunction, json, LoaderFunction } from "@remix-run/node"; // or cloudflare/deno
import { findByProductAndVariantId, isProductAlreadyAdded, addProductInfo } from "~/services/product-info.service";
import { subscribeProduct } from "~/services/customer-subscriber.service";
import { authenticate } from "~/shopify.server";

export const action: ActionFunction = async ({ request }) => {
    const { session } = await authenticate.public.appProxy(request);
    console.log(session);
    if (request.method == 'POST') {
        let requstBody = await request.json();
        let isProductExist = await isProductAlreadyAdded(requstBody.productId, requstBody.variantId);
        if (!isProductExist) {
            let result = await addProductInfo(requstBody);
            console.log(`New Product ${requstBody.productTitle} - ${requstBody.variantTitle} aded`)
        }
        let productInfo = await findByProductAndVariantId(requstBody.productId, requstBody.variantId);
        let subscribeItem = {
            customerEmail: requstBody.email,
            isNotified: false,
            createdAt: new Date(),
            updatedAt: new Date(),
            isActive: false,
            productInfo: {
                connect: {
                    id: productInfo?.id
                }
            }


        }
        let result = await subscribeProduct(subscribeItem)
        console.log(result);
    }
    return json({ nice: "jokess" });
};