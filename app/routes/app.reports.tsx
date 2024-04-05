import type { ActionFunctionArgs, LoaderFunctionArgs} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Layout, Page, Text, Link, Box, InlineStack } from "@shopify/polaris";
import { authenticate } from "../shopify.server";

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
  return { subscribedProducts, pendingSubscrbers, notifiedSubscrbers, shopifyURL: myshopify_domain };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  let { admin } = await authenticate.admin(request);
  let { myshopify_domain }: any = await getStoreInfoShopify(admin);
  let formData = await request.formData();
  let obj = Object.fromEntries(formData) as any;
  if (formData.get('name') == 'SEND_EMAIL') {
    let ids = obj['ids'].split(',').map((d: any) => ({ id: Number(d), shopifyURL: myshopify_domain }))
    await notifyToCustomers(ids);
    return json({ 'action': 'send_email', status: true });

  } else if (formData.get('name') == 'UNSUBSCRIBE') {

    let ids = obj['ids'].split(',').map((Number));
    await updateSubscribtionStatus(ids, false);
    return json({ 'action': 'unsubscribe', status: true });

  } else if (formData.get('name') == 'SUBSCRIBE') {

    let ids = obj['ids'].split(',').map((Number));
    await updateSubscribtionStatus(ids, true);
    return json({ 'action': 'subscribe', status: true });

  } else {
    if (obj.skip == undefined || isNaN(obj.skip)) {
      obj.skip = 0;
    }
    return redirect(`/app/reports?take=${obj.take}&skip=${obj.skip}`);;
  }

};


export default function Index() {
  let { pendingSubscrbers, notifiedSubscrbers } = useLoaderData<typeof loader>();
  return (
    <Page>
      <Layout>
        <Layout.Section>
          <Box>
            <InlineStack align='space-between'>
              <Text variant="heading2xl" as="h1">Reports</Text>
              <div style={{ color: '#005BD3' }}>
                <Link removeUnderline monochrome url="/app/instructions">View installation guide</Link>
              </div>
            </InlineStack>
            <Text as="p">
              Use this page to navigate through different reports.
            </Text>
          </Box>
        </Layout.Section>
        <Layout.Section>
          <Box paddingBlockEnd="2000">
            <Request title="Pending Requests" data={pendingSubscrbers} type="pending" />
            <Request title="Sent Requests" data={notifiedSubscrbers} type="sent" />
          </Box>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
