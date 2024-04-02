import { Layout, Page, Text } from "@shopify/polaris";
import Report from "~/components/report";
import Request from "~/components/request";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import { findSubscribedProducts } from "../services/product-info.service";
import { upsertEmail } from "../services/email.service";
import { isInitilized, getStoreInfoShopify } from "../services/store-info.service";


export const loader = async ({ request }: LoaderFunctionArgs) => {
  let { admin } = await authenticate.admin(request);
  let initilized = await isInitilized(admin);
  let { id, myshopify_domain, name, email }: any = await getStoreInfoShopify(admin);
  if (!initilized) {
    await upsertEmail({
      storeId: id,
      shopifyURL: myshopify_domain,
      title: name,
      senderEmail: email
    });
  }
  const subscribedProducts = await findSubscribedProducts({ shopifyURL: myshopify_domain });
  return { subscribedProducts };
};

export default function Index() {
  return (
    <Page>
      <Layout>
      <Text variant="heading3xl" as="h2" alignment="start">Reports</Text>
        <Report title="Requests" pagination={false} />
        <Request title="Requests" label="Pending" rows={[]} actions={[{content: 'Send Manually'}, {content: 'Unsubscribe'}]}/>
        <Request title="Requests" label="Notification Sent" rows={[]} actions={[{content: 'Send Again'}, {content: 'Re-subscribe'}]}/>
      </Layout>
    </Page>
  );
}
