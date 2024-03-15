import { ActionFunction, json } from "@remix-run/node"; // or cloudflare/deno

export const action: ActionFunction = async ({ request }) => {
    if (request.method == 'POST') {
        let requstBody = await request.json();
        console.log(requstBody);
    }
    return json({ data: "removed" });
};