import { ActionFunction, json, LoaderFunction } from "@remix-run/node"; // or cloudflare/deno
import { saveCustomerActivities } from "~/services/customer-activity.service";
import { CustomerActivityDTO } from "~/dto/customer-activity.dto";

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
        let requstBody = await request.json() as CustomerActivityDTO[];
        let result = await saveCustomerActivities(requstBody);
        console.log(result);
    }
    return json(
        { success: true },
        {
            headers: {
                "Access-Control-Allow-Origin": "*",
            },
        }
    );

};

