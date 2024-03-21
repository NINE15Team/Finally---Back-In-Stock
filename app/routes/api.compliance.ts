import { ActionFunction, LoaderFunction, json } from "@remix-run/node"; // or cloudflare/deno
import { deleteStoreByURL } from "../services/store-info.service";

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
        await deleteStoreByURL(requstBody?.shop_domain);
        console.log(requstBody);
    }
    return json({ data: "removed" });
};