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
  useNavigate,
} from "@remix-run/react";
import { authenticate } from "../shopify.server";
import { findTotalPotentialRevenue } from "../services/customer-subscriber.service";
import { findSubscribedProducts, totalCount } from "../services/product-info.service";
import { upsertEmail } from "../services/email.service";
import { updateStoreInfo, isInitilized, getStoreInfoShopify } from "../services/store-info.service";
import Instructions from "./app.instructions";
import SubscriberList from "./app.subscriberList";
import { useEffect, useState } from "react";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  let { admin, session } = await authenticate.admin(request);
  let initilized = await isInitilized(admin);
  let shopInfo: any = await getStoreInfoShopify(admin);
  const urlParams = new URLSearchParams(request.url.split('?')[1]);
  let page = parseInt(urlParams.get('page') || '') || 1;
  let pageSize = 10;

  const totalItems = await totalCount(shopInfo.myshopify_domain);
  const maxPage = Math.ceil(totalItems / pageSize);
  if (page > maxPage) {
    page = 1;
  }

  const data = await findSubscribedProducts(
    { shopifyURL: shopInfo.myshopify_domain },
      page,
      pageSize
    );
  const { potentialRevenue } = await findTotalPotentialRevenue(shopInfo.myshopify_domain);
  return { data, page, maxPage, loading: false, findSubscribedProducts, shopifyURL: shopInfo.myshopify_domain, storeName: shopInfo.name, potentialRevenue, initilized };
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
  console.log("I am parrent");
  return await isInitilized(admin);
};

export default function Index() {
  let { initilized, page } = useLoaderData<typeof loader>();
  const [currentPage, setCurrentPage] = useState(page);
  const navigate = useNavigate();

  const handlePageChange = async (page: number) => {
    setCurrentPage(page);
    navigate(`?page=${page}`);
  };

  const renderContent = () => {
    console.log('rendered');
    if (initilized) {
      return <SubscriberList currentPage={currentPage} onPageChange={handlePageChange}/>;
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
