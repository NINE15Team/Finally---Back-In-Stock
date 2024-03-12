import { ActionFunction, LoaderFunction, json } from "@remix-run/node"; // or cloudflare/deno
import { setCustomerNotified, findAll, subscribeProduct } from "~/services/customer-subscriber.service";
import { authenticate } from "~/shopify.server";
import { save, sendEmail, updateEmail, isEmailVerified } from "../services/email.service";
import { EmailDTO } from "~/dto/email.dto";

export const loader: LoaderFunction = async ({ request }) => {
    return await json({});
};


export const action: ActionFunction = async ({ request }) => {
    let resp;
    if (request.method == "POST") {
        resp = await isEmailVerified("app-bis2.myshopify.com");
    }
    console.log("hello")
    return await json(resp, 200);
};