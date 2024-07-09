import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import { countOfSubscribers, } from "../services/customer-subscriber.service";
import { findSubscribedProducts } from "../services/product-info.service";
import { upsertEmail } from "../services/email.service";
import { updateStoreInfo, isInitilized, getStoreInfoShopify, activateWebPixel, activateWebhookForPubSub } from "../services/store-info.service";
import { Box, InlineStack, Layout, Link, Page, Text } from "@shopify/polaris";
import { sumNoOfNotifications } from "~/services/notification-history.service";
import { useLoaderData } from "@remix-run/react";
import CountRequest from "~/components/count-request";
import Report from "~/components/report";
import NoRequest from "~/components/no_request";


export const loader = async ({ request }: LoaderFunctionArgs) => {
  let { admin } = await authenticate.admin(request);
  let initilized = await isInitilized(admin);
  let { id, myshopify_domain, name, email, domain }: any = await getStoreInfoShopify(admin);
  if (!initilized) {
    await updateStoreInfo(admin);
    await upsertEmail({
      headerContent: 'Great News',
      bodyContent: 'Finally! Your {{product}} is back in stock!',
      footerContent: `If you have any questions, please feel free to ask by emailing ${email}`,
      buttonContent: 'CHECKOUT NOW',
      storeId: id,
      shopifyURL: myshopify_domain,
      title: 'Finally! Your {{product}} is back in stock!',
      senderEmail: email
    });
  }
  const subscribedProducts = await findSubscribedProducts(myshopify_domain);
  const totalNotifications = await sumNoOfNotifications(myshopify_domain);
  const newSubscribers = await countOfSubscribers(myshopify_domain);
  return { subscribedProducts, totalNotifications, newSubscribers, shopifyURL: myshopify_domain, storeName: name, initilized, domain };
};


export const action = async ({ request }: ActionFunctionArgs) => {
  let { admin } = await authenticate.admin(request);
  return await isInitilized(admin);
};

export default function Index() {
  let { totalNotifications, newSubscribers, subscribedProducts, domain } = useLoaderData<any>();
  console.log('shah', subscribedProducts);
  return (
    <Page>
      <Layout>
        <Layout.Section>
          <Box paddingBlockEnd="800">
            <InlineStack align='space-between'>
              <Text variant="headingXl" as="h1">Dashboard</Text>
            </InlineStack>
          </Box>
          {totalNotifications || newSubscribers ?
            <Box>
              <CountRequest countPending={newSubscribers} countSentNotification={totalNotifications} />
              <Report title="Popular Products" pagination={false} data={subscribedProducts} />
            </Box>
            :
            <Box>
              <NoRequest domain={domain} />
            </Box>
          }
        </Layout.Section>
      </Layout>
    </Page>
  );
}
