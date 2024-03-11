import { ActionFunction, json } from "@remix-run/node"; // or cloudflare/deno
import { setCustomerNotified, findAll, subscribeProduct } from "~/services/customer-subscriber.service";
import { authenticate } from "~/shopify.server";

export const action: ActionFunction = async ({ request }) => {
    const { cors } = await import("remix-utils/cors");
    return json({ nice: "jokess" });
};