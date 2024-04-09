import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Layout, Page, Text, Link, Box, InlineStack, BlockStack } from "@shopify/polaris";
import { authenticate } from "../shopify.server";

import { getStoreInfoShopify } from "~/services/store-info.service";
import { findAllSubscribers, findByEmailAndProductInfo, notifyToCustomers, updateSubscribtionStatus } from "~/services/customer-subscriber.service";
import { findAllActivities } from "~/services/customer-activity.service";
import { useLoaderData } from "@remix-run/react";
import { CustomerActivityDTO } from "~/dto/customer-activity.dto";
import { CustomerSubscriptionDTO } from "~/dto/customer-subscription.dto";
import PendingRequest from "~/components/pending-request";
import SentRequest from "~/components/sent-request";
import CountRequest from "~/components/count-request";
import { sumNoOfNotifications } from "~/services/notification-history.service";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  let { admin } = await authenticate.admin(request);
  let { myshopify_domain }: any = await getStoreInfoShopify(admin);
  const url = new URL(request.url)
  let pendingPage = Number(url.searchParams.get("ppage")) || 0;
  let sentPage = Number(url.searchParams.get("spage")) || 0;
  if (isNaN(pendingPage) || pendingPage < 0) {
    pendingPage = 1;
  }
  if (isNaN(sentPage) || sentPage < 0) {
    sentPage = 1;
  }
  const pendingSubscrbers = await findAllSubscribers({ shopifyURL: myshopify_domain, isNotified: false, take: 5, skip: pendingPage * 5 });
  const customerActivities = await findAllActivities({ shopifyURL: myshopify_domain, take: 5, skip: sentPage * 5 });
  const totalNotifications = await sumNoOfNotifications(myshopify_domain);

  return { pendingSubscrbers, customerActivities, totalNotifications, shopifyURL: myshopify_domain };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  let { admin } = await authenticate.admin(request);
  let { myshopify_domain, name }: any = await getStoreInfoShopify(admin);
  let formData = await request.formData();
  let obj = Object.fromEntries(formData) as any;
  if (formData.get('name') == 'SEND_EMAIL') {
    let ids = obj['ids'].split(',').map((d: any) => ({ id: Number(d), shopifyURL: myshopify_domain, storeName: name }))
    await notifyToCustomers(ids);
    return json({ 'action': 'send_email', status: true });

  } else if (formData.get('name') == 'SEND_EMAIL_AGAIN') {
    let activities = JSON.parse(obj['data']) as CustomerActivityDTO[];
    let subscriptions = [] as CustomerSubscriptionDTO[];
    for (let elm of activities) {
      subscriptions.push({
        customerEmail: elm.customerEmail,
        productInfoId: elm.productId,
        shopifyURL: myshopify_domain,
        storeName: name
      })
    }
    await notifyToCustomers(subscriptions);
    return json({ 'action': 'send_email', status: true });

  } else if (formData.get('name') == 'UNSUBSCRIBE') {

    let ids = obj['ids'].split(',').map((Number));
    await updateSubscribtionStatus(ids, false);
    return json({ 'action': 'unsubscribe', status: true });

  } else if (formData.get('name') == 'SUBSCRIBE') {
    let activities = JSON.parse(obj['data']) as CustomerActivityDTO[];
    let subscriptionIds = [] as any[];
    for (let elm of activities) {
      let subscription = await findByEmailAndProductInfo({ customerEmail: elm.customerEmail, productInfoId: elm.productId })
      subscriptionIds.push(subscription?.id);
    }

    await updateSubscribtionStatus(subscriptionIds, true);
    return json({ 'action': 'subscribe', status: true });

  } else if (formData.get('name') == 'PENDING') {
    if (obj.skip == undefined || isNaN(obj.skip)) {
      obj.skip = 0;
    }
    return redirect(`/app/reports?ppage=${obj.page}`);
  } else if (formData.get('name') == 'SENT') {
    if (obj.skip == undefined || isNaN(obj.skip)) {
      obj.skip = 0;
    }
    return redirect(`/app/reports?spage=${obj.page}`);
  }

};


export default function Index() {
  let { pendingSubscrbers, customerActivities, totalNotifications } = useLoaderData<any>();

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
          <Box paddingBlockEnd="2000" paddingBlockStart="1000">
            <BlockStack gap="300">
              {pendingSubscrbers.count > 0 || totalNotifications ?
                <PendingRequest data={pendingSubscrbers.items} count={pendingSubscrbers.count} />
                :
                <CountRequest countPending={pendingSubscrbers.count} countSentNotification={totalNotifications} />
              }
              <SentRequest data={customerActivities.items} count={customerActivities.count} />
            </BlockStack>
          </Box>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
