import { LoaderFunctionArgs } from "@remix-run/node";
import { Layout, Page, Text } from "@shopify/polaris";
import { authenticate } from "../shopify.server";

import Report from "~/components/report";
import Request from "~/components/request";
import { findSubscribedProducts } from "~/services/product-info.service";
import { getStoreInfoShopify } from "~/services/store-info.service";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  let { admin } = await authenticate.admin(request);
  let { myshopify_domain }: any = await getStoreInfoShopify(admin);
  const subscribedProducts = await findSubscribedProducts({ shopifyURL: myshopify_domain });
  return { subscribedProducts, shopifyURL: myshopify_domain};
};

export default function Index() {
  return (
    <Page>
      <Layout>
        <Text variant="heading3xl" as="h2">Reports</Text>
        <Report title="Overview" pagination={true} />
        <Request title="Requests" label="Pending" />
        <Request title="Requests" label="Notification Sent" />
      </Layout>
    </Page>
  );
}
