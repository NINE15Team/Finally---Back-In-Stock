import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import {
  useLoaderData,
} from "@remix-run/react";
import { authenticate } from "../shopify.server";
import { findAllSubscribers, findTotalPotentialRevenue } from "../services/customer-subscriber.service";
import { findSubscribedProducts } from "../services/product-info.service";
import { upsertEmail } from "../services/email.service";
import { updateStoreInfo, isInitilized, getStoreInfoShopify, activateWebPixel } from "../services/store-info.service";
import Instructions from "./app.instructions";
import SubscriberList from "./app.subscriberList";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  let { admin } = await authenticate.admin(request);
  let initilized = await isInitilized(admin);
  if (false && !initilized) {
    await activateWebPixel(admin);
  }
  let shopInfo: any = await getStoreInfoShopify(admin);
  const data = await findSubscribedProducts({ shopifyURL: shopInfo.myshopify_domain });
  const data2 = await findAllSubscribers({
    shopifyURL: shopInfo.myshopify_domain,
    isNotified: false,
  });
  const { potentialRevenue } = await findTotalPotentialRevenue(shopInfo.myshopify_domain);
  return { data, data2, shopifyURL: shopInfo.myshopify_domain, storeName: shopInfo.name, potentialRevenue, initilized };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  let { admin } = await authenticate.admin(request);
  await request.formData();
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
  let { initilized } = useLoaderData<typeof loader>();
  const renderContent = () => {
    if (initilized) {
      return <SubscriberList />;
    } else {
      return <Instructions showButton={true} />;
    }
  };


  return (
    <>
      {renderContent()}
    </>
  );
}
