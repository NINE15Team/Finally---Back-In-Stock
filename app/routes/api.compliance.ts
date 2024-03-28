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
        console.log('Compliance Headers', request.headers);
        console.log('Compliance Request body', requstBody);
        await deleteStoreByURL(requstBody?.shop_domain);
        console.log(requstBody);
    }
    return json(
        { status: true },
        {
            status: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
            },
        }
    );
};