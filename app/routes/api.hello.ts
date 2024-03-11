import { ActionFunction, json } from "@remix-run/node"; // or cloudflare/deno
import { setCustomerNotified, findAll, subscribeProduct } from "~/services/customer-subscriber.service";
import { authenticate } from "~/shopify.server";

function withCors(request: any) {
    request.headers.append('Access-Control-Allow-Origin', '*');

    request.headers.append(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, referer-path'
    );
}

export const action: ActionFunction = async ({ request }) => {
    withCors(request);
    return new Response(null, {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, HEAD, POST, PUT, DELETE',
        },
    });
};