import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import {
    useActionData,
    useLoaderData,
} from "@remix-run/react";
import { authenticate } from "../shopify.server";
import { findAllNotificationHistory, getConversionRate } from "../services/notification-history.service";
import { findSubscribedProducts } from "../services/product-info.service";
import { upsertEmail } from "../services/email.service";
import { updateStoreInfo, isInitilized, getStoreInfoShopify, activateWebPixel } from "../services/store-info.service";
import { DataTable, Page } from "@shopify/polaris";

export const loader = async ({ request }: LoaderFunctionArgs) => {
    let { admin, session } = await authenticate.admin(request);
    let shopInfo: any = await getStoreInfoShopify(admin);
    const data = await getConversionRate(shopInfo.myshopify_domain);
    return { data };
};

export const action = async ({ request }: ActionFunctionArgs) => {
    let { admin, session } = await authenticate.admin(request);
    let formData = await request.formData();
    let shopInfo: any = await updateStoreInfo(admin);
    await upsertEmail({
        storeId: shopInfo.id,
        shopifyURL: shopInfo.myshopify_domain,
        title: shopInfo.name,
        senderEmail: shopInfo.email
    });
    await activateWebPixel(admin);
    return await isInitilized(admin);
};

export default function Index() {
    const { data } = useLoaderData<typeof loader>();
    const actionData = useActionData<typeof action>();
    let rows: any = [];
    for (let i = 0; i < data.length; i++) {
        const item = data[i];
        rows.push([
            item.createdAt,
            item.noOfNotifications,
            item.viewCount,
            item.addToCartCount,
            item.completedCount
        ]);
    }


    return (
        <Page>
            <DataTable
                columnContentTypes={["text", "text", "text", "text"]}
                headings={["Date", "Notifications", "View", "Add to Cart", "Complete"]}
                rows={rows}
                showTotalsInFooter
                pagination={{
                    hasNext: true,
                    onNext: () => { },
                }}
            />


        </Page>
    );
}
