import { ActionFunction, json, LoaderFunction } from "@remix-run/node"; // or cloudflare/deno
import { findByProductAndVariantId, isProductAlreadyAdded, addProductInfo } from "~/services/product-info.service";
import { subscribeProduct } from "~/services/customer-subscriber.service";
import { CustomerSubscriptionDTO } from "../dto/customer-subscription.dto";
import { saveCustomerActivity } from "~/services/customer-activity.service";
import { CustomerActivityDTO } from "~/dto/customer-activity.dto";

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
        let activity = {
            status: requstBody.status,
            productId: requstBody.productId,
            variantId: requstBody.variantId,
            shopifyURL: requstBody.shopifyURL,
            browserTrackId: requstBody.browserTrackId,
            uuid: requstBody.uuid,
        } as CustomerActivityDTO
        await saveCustomerActivity(activity);
    }
    return json(
        { success: true },
        {
            headers: {
                "Access-Control-Allow-Origin": "*",
            },
        }
    );

};

