import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import { countOfSubscribers, } from "../services/customer-subscriber.service";
import { findSubscribedProducts } from "../services/product-info.service";
import { upsertEmail } from "../services/email.service";
import { updateStoreInfo, isInitilized, getStoreInfoShopify } from "../services/store-info.service";

import { Layout, Page } from "@shopify/polaris";
import { sumNoOfNotifications } from "~/services/notification-history.service";
import HomeBanner from "~/components/home-banner";


export const loader = async ({ request }: LoaderFunctionArgs) => {
  let { admin } = await authenticate.admin(request);
  let initilized = await isInitilized(admin);
  let { id, myshopify_domain, name, email }: any = await getStoreInfoShopify(admin);
  if (!initilized) {
    await updateStoreInfo(admin);
    await upsertEmail({
      storeId: id,
      shopifyURL: myshopify_domain,
      title: name,
      senderEmail: email
    });
  }
  const subscribedProducts = await findSubscribedProducts({ shopifyURL: myshopify_domain });
  const totalNotifications = await sumNoOfNotifications(myshopify_domain);
  const newSubscribers = await countOfSubscribers(myshopify_domain);
  return { subscribedProducts, totalNotifications, newSubscribers, shopifyURL: myshopify_domain, storeName: name, initilized };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  let { admin } = await authenticate.admin(request);
  let shopInfo: any = await updateStoreInfo(admin);
  await upsertEmail({
    storeId: shopInfo.id,
    shopifyURL: shopInfo.myshopify_domain,
    title: shopInfo.name,
    senderEmail: shopInfo.email
  });
  // await activateWebPixel(admin);
  return await isInitilized(admin);
};

export default function Index() {


  return (
    <Page>
      <Layout>
        <HomeBanner />
      </Layout>
    </Page>
  );
}
