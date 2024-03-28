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
import { findSubscribedProducts, totalCount } from "../services/product-info.service";
import { upsertEmail } from "../services/email.service";
import { updateStoreInfo, isInitilized, getStoreInfoShopify } from "../services/store-info.service";
import Instructions from "./app.instructions";
import SubscriberList from "./app.subscriberList";
import { useState } from "react";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  let { admin, session } = await authenticate.admin(request);
  let initilized = await isInitilized(admin);
  let shopInfo: any = await getStoreInfoShopify(admin);
  let { page = 1, pageSize = 5 } = params;
  console.log(params);

  const totalItems = await totalCount(shopInfo.myshopify_domain);
  const maxPage = Math.ceil(totalItems / pageSize);

  const data = await findSubscribedProducts(
    { shopifyURL: shopInfo.myshopify_domain },
    parseInt(page),
    parseInt(pageSize)
    );
  const { potentialRevenue } = await findTotalPotentialRevenue(shopInfo.myshopify_domain);
  return { data, maxPage, findSubscribedProducts, shopifyURL: shopInfo.myshopify_domain, storeName: shopInfo.name, potentialRevenue, initilized };
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
  let { initilized, data, shopifyURL } = useLoaderData<typeof loader>();
  const [appInit, setAppInit] = useState(initilized);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize:number = 5;
  const [pageData, setPageData] = useState(data);
  const [isLoading, setIsLoading] = useState(false);

  const handlePageChange = async (page: number) => {
    if (isLoading) return;
    setCurrentPage(page);
    setIsLoading(true);
    const newData = await findSubscribedProducts(
      { shopifyURL: shopifyURL },
      page,
      pageSize
    );
    setPageData(newData);
    setIsLoading(false);
  };

  const renderContent = () => {
    if (initilized) {
      return <SubscriberList data={pageData} currentPage={currentPage}  onPageChange={handlePageChange}/>;
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
