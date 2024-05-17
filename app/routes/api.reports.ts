import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node"; // or cloudflare/deno
import { findByProductAndVariantId, isProductAlreadyAdded, addProductInfo } from "~/services/product-info.service";
import { findAllSubscribers, subscribeProduct } from "~/services/customer-subscriber.service";
import type { CustomerSubscriptionDTO } from "../dto/customer-subscription.dto";
import { authenticate } from "../shopify.server";
import { getStoreInfoShopify } from "~/services/store-info.service";

export const loader: LoaderFunction = async ({ request }) => {
    console.log("________________- hello");
    let { admin } = await authenticate.admin(request);
    let { myshopify_domain }: any = await getStoreInfoShopify(admin);
    const pendingSubscrbers = await findAllSubscribers({ shopifyURL: myshopify_domain, isNotified: false, take: 5, skip: 0 });

    return json(
        pendingSubscrbers,
        {
            headers: {
                "Access-Control-Allow-Origin": "*",
            },
        }
    );
};


export const action: ActionFunction = async ({ request }) => {
    return json({ status: "success" }, 200);
};

