import { ActionFunctionArgs, LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import { Layout, Page, Text } from "@shopify/polaris";
import { authenticate } from "../shopify.server";

import Report from "~/components/report";
import Request from "~/components/request";
import { findSubscribedProducts } from "~/services/product-info.service";
import { getStoreInfoShopify } from "~/services/store-info.service";
import { findAllSubscribers, notifyToCustomers, updateSubscribtionStatus } from "~/services/customer-subscriber.service";
import { useLoaderData } from "@remix-run/react";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  let { admin } = await authenticate.admin(request);
  let { myshopify_domain }: any = await getStoreInfoShopify(admin);
  const url = new URL(request.url)
  const $skip = Number(url.searchParams.get("skip")) || 0;
  const $take = Number(url.searchParams.get("take")) || 10;
  const subscribedProducts = await findSubscribedProducts({ shopifyURL: myshopify_domain, take: $take, skip: $skip });
  const pendingSubscrbers = await findAllSubscribers({ shopifyURL: myshopify_domain, isNotified: false, take: 100, skip: 0 });
  const notifiedSubscrbers = await findAllSubscribers({ shopifyURL: myshopify_domain, isNotified: true, take: 100, skip: 0 });
  console.log("loader Called");
  return { subscribedProducts, pendingSubscrbers, notifiedSubscrbers, shopifyURL: myshopify_domain };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  let { admin } = await authenticate.admin(request);
  let { myshopify_domain }: any = await getStoreInfoShopify(admin);
  let formData = await request.formData();
  let obj = Object.fromEntries(formData) as any;
  if (formData.get('name') == 'SEND_EMAIL') {
    let ids = obj['ids'].split(',').map((d: any) => ({ id: Number(d), shopifyURL: myshopify_domain }))
    console.log(formData.get('name'), ids);
    await notifyToCustomers(ids);
    return json({ 'action': 'send_email', status: true });

  } else if (formData.get('name') == 'UNSUBSCRIBE') {

    let ids = obj['ids'].split(',').map((Number));
    console.log(formData.get('name'), ids);
    await updateSubscribtionStatus(ids, false);
    return json({ 'action': 'unsubscribe', status: true });

  } else if (formData.get('name') == 'SUBSCRIBE') {

    let ids = obj['ids'].split(',').map((Number));
    console.log(formData.get('name'), ids);
    await updateSubscribtionStatus(ids, true);
    return json({ 'action': 'subscribe', status: true });

  } else {
    console.log("Action Called", obj, formData.get('name'));
    if (obj.skip == undefined || isNaN(obj.skip)) {
      obj.skip = 0;
    }
    return redirect(`/app/reports?take=${obj.take}&skip=${obj.skip}`);;
  }

};


export default function Index() {
  let { pendingSubscrbers, notifiedSubscrbers, subscribedProducts } = useLoaderData<typeof loader>();
  return (
    <Page>
      <Layout>
        <Text variant="headingXl" as="h2" alignment="start">Reports</Text>
        {/* <Report title="Requests" pagination={true} data={subscribedProducts} /> */}
        {/* <Request title="Requests" label="Pending" data={pendingSubscrbers} type="pending" /> */}
        {/* <Request title="Requests" label="Notification Sent" data={notifiedSubscrbers} type="sent" /> */}
      </Layout>
    </Page>
  );
}
