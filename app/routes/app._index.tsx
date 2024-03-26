import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import {
  useActionData,
  useNavigation,
  useSubmit,
  useLoaderData,
  useRevalidator,
  json,
  Form,
  ClientActionFunctionArgs,
} from "@remix-run/react";
import { authenticate } from "../shopify.server";
import { findTotalPotentialRevenue } from "../services/customer-subscriber.service";
import { findSubscribedProducts } from "../services/product-info.service";
import { upsertEmail } from "../services/email.service";
import { updateStoreInfo, isInitilized, getStoreInfoShopify } from "../services/store-info.service";
import Instructions from "./app.instructions";
import SubscriberList from "./app.subscriberList";
import { useState } from "react";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  let { admin, session } = await authenticate.admin(request);
  let initilized = await isInitilized(admin);
  let shopInfo: any = await getStoreInfoShopify(admin);
  const data = await findSubscribedProducts({ shopifyURL: shopInfo.myshopify_domain });
  const { potentialRevenue } = await findTotalPotentialRevenue(shopInfo.myshopify_domain);
  return { data, shopifyURL: shopInfo.myshopify_domain, storeName: shopInfo.name, potentialRevenue, initilized };
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
  console.log("I am parrent");
  return await isInitilized(admin);
};

export default function Index() {
  const actionData = useActionData<typeof action>();
  let { initilized } = useLoaderData<typeof loader>();
  const [appInit, setAppInit] = useState(initilized);

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
