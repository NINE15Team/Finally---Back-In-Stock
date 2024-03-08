import { ActionFunction, json, LoaderFunction } from "@remix-run/node"; // or cloudflare/deno
import { findByProductAndVariantId } from "~/services/product-info.service";
import { subscribeProduct } from "~/services/customer-subscriber.service";
import { sendEmail } from "~/services/email.service";

// export const loader = async () => {
//     return json(
//         { hello: "world" },
//         {
//             headers: {
//                 "Access-Control-Allow-Origin": "*",
//             },
//         }
//     );
// };

export const action: ActionFunction = async ({ request }) => {
    if (request.method == 'POST') {
        let requstBody = await request.json();
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