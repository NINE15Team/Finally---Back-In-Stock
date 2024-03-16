import { ActionFunction, json, LoaderFunction } from "@remix-run/node"; // or cloudflare/deno
import { findByProductAndVariantId, isProductAlreadyAdded, addProductInfo } from "~/services/product-info.service";
import { subscribeProduct } from "~/services/customer-subscriber.service";
import { cors } from "remix-utils/cors";

export const loader: LoaderFunction = async ({ request }) => {
    console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&");
    console.log(request);
    return await json({ hello: "world" },{
            headers: {
                "Access-Control-Allow-Origin": "*",
            },
        });
};


export const action: ActionFunction = async ({ request }) => {
    console.log("****************Subscribe to Product__________________");
    if (request.method == 'POST') {
        let requstBody = await request.json();
        console.log("****************Subscribe to Product", requstBody);
        let isProductExist = await isProductAlreadyAdded(requstBody.productId, requstBody.variantId);
        if (!isProductExist) {
            console.log("Request Body For API Subscription", requstBody);
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
        return await cors(request, json({ data: result }, 200));
    }
    return await cors(request, json({ status: "success" }, 200));
};

