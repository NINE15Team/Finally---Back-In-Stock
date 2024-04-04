import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import { countOfSubscribers, } from "../services/customer-subscriber.service";
import { findSubscribedProducts } from "../services/product-info.service";
import { upsertEmail } from "../services/email.service";
import { updateStoreInfo, isInitilized, getStoreInfoShopify, activateWebPixel } from "../services/store-info.service";
import '../components/base.scss';

import { Layout, Page } from "@shopify/polaris";
import { sumNoOfNotifications } from "~/services/notification-history.service";
import HomeBanner from "~/components/home-banner";


export const loader = async ({ request }: LoaderFunctionArgs) => {
  let { admin } = await authenticate.admin(request);
  let initilized = await isInitilized(admin);
  let { id, myshopify_domain, name, email }: any = await getStoreInfoShopify(admin);
  if (!initilized) {
    // await activateWebPixel(admin);
    await updateStoreInfo(admin);
    await upsertEmail({
      headerContent: 'Good News!',
      bodyContent: 'Your product is back in stock and now available.',
      footerContent: `If you have any questions, please feel free to ask by emailing ${email}`,
      buttonContent: 'CHECKOUT NOW',
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
