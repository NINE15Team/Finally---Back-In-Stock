import { ActionFunction, json } from "@remix-run/node"; // or cloudflare/deno
import { setCustomerNotified, findAll, subscribeProduct } from "~/services/customer-subscriber.service";
import { sendEmail } from "~/services/email.service";

export const action: ActionFunction = async ({ request }) => {
    return json({ todayDate: new Date() });
};