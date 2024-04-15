import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node"; // or cloudflare/deno
import { findByProductAndVariantId, isProductAlreadyAdded, addProductInfo } from "~/services/product-info.service";
import { subscribeProduct } from "~/services/customer-subscriber.service";
import type { CustomerSubscriptionDTO } from "../dto/customer-subscription.dto";

export const loader: LoaderFunction = async ({ request }) => {
    return json(
        { success: true },
        {
            headers: {
                "Access-Control-Allow-Origin": "*",
            },
        }
    );
};


export const action: ActionFunction = async ({ request }) => {
    if (request.method == 'POST') {
        let requstBody = await request.json();
        console.log("****************Check If Product Exist");
        let isProductExist = await isProductAlreadyAdded(requstBody.productId, requstBody.variantId);
        if (!isProductExist) {
            await addProductInfo(requstBody);
            console.log(`New Product ${requstBody.productTitle} - ${requstBody.variantTitle} aded`)
        }
        console.log("Finding Product By Variant Id");
        let productInfo = await findByProductAndVariantId(requstBody.productId, requstBody.variantId);
        let subscribeItem: CustomerSubscriptionDTO = {
            customerEmail: requstBody.email,
            customerPhone: requstBody.customerPhone ?? "",
            isNotified: false,
            isActive: false,
            productInfoId: productInfo?.id,
        };

        console.log("Add to subscription", requstBody.email);
        await subscribeProduct(subscribeItem);
        return json(
            { status: true },
            {
                headers: {
                    "Access-Control-Allow-Origin": "*",
                },
            }
        );
    } else {

        return json({ status: "success" }, 200);
    }
};

