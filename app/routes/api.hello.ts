import { ActionFunction, json } from "@remix-run/node"; // or cloudflare/deno
import { setCustomerNotified, findAll, subscribeProduct } from "~/services/customer-subscriber.service";
import { sendEmail } from "~/services/email.service";
import { authenticate } from "~/shopify.server";

export const action: ActionFunction = async ({ request }) => {
    const { session } = await authenticate.public.appProxy(request);
    console.log(session);
    return json({ todayDate: new Date() });
};