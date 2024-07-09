import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node"; // or cloudflare/deno
import { activateWebhookForPubSub } from "~/services/store-info.service";
import { authenticate } from "../shopify.server";

export const loader: LoaderFunction = async ({ request }) => {
    let { admin } = await authenticate.admin(request);
    await activateWebhookForPubSub(admin);
    return await json({ status: "Hello" });
};


export const action: ActionFunction = async ({ request }) => {
    let resp;
    if (request.method == "POST") {
        let d = await request.json();
        console.log(d);
        // resp = await updateEmail({
        //     senderEmail: "khair.naqvi@gmail.com",
        //     storeName: "app-bis2.myshopify.com"
        // } as EmailDTO);
    }
    console.log("hello")
    return await json(resp, 200);
};
