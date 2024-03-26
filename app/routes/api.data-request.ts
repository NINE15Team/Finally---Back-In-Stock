import { ActionFunction, LoaderFunction, json } from "@remix-run/node"; // or cloudflare/deno

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
    }
    return json(
        { status: true },
        {
            headers: {
                "Access-Control-Allow-Origin": "*",
            },
        }
    );
};