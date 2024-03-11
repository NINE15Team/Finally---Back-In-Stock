import { ActionFunction, LoaderFunction, json } from "@remix-run/node"; // or cloudflare/deno
import { setCustomerNotified, findAll, subscribeProduct } from "~/services/customer-subscriber.service";
import { authenticate } from "~/shopify.server";
import { cors } from "remix-utils/cors";

export const loader: LoaderFunction = async ({ request }) => {
    return await cors(request, json({}));
};


export const action: ActionFunction = async ({ request }) => {
    return await cors(request, json({ nice: "test" }, 200));
};