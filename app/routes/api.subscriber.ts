import { ActionFunction, json, LoaderFunction } from "@remix-run/node"; // or cloudflare/deno
import { findByProductAndVariantId, isProductAlreadyAdded, addProductInfo } from "~/services/product-info.service";
import { subscribeProduct } from "~/services/customer-subscriber.service";

export const loader: LoaderFunction = async ({ request }) => {
    console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&");
    return json(
        { hello: "world" },
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
            let result = await addProductInfo(requstBody);
            console.log(`New Product ${requstBody.productTitle} - ${requstBody.variantTitle} aded`)
        }
        console.log("Finding Product By Variant Id");
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
        console.log("Add to subscription", subscribeItem);
        let result = await subscribeProduct(subscribeItem);
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

