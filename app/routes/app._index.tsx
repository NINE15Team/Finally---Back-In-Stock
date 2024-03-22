import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import {
  useActionData,
  useNavigation,
  useSubmit,
  useLoaderData,
  useRevalidator,
  json,
  Form,
} from "@remix-run/react";
import {
  Page,
  Layout,
  Text,
  Card,
  BlockStack,
  Link,
  InlineStack,
  DataTable,
  Box,
  FormLayout,
  TextField,
  Button,
  ButtonGroup,
  List,
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import { findTotalPotentialRevenue } from "../services/customer-subscriber.service";
import { findSubscribedProducts } from "../services/product-info.service";
import { upsertEmail } from "../services/email.service";
import { updateStoreInfo } from "../services/store-info.service";
import { Modal, TitleBar, useAppBridge } from '@shopify/app-bridge-react';
import { useState } from "react";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  let { admin, session } = await authenticate.admin(request);

  let shopInfo: any = await updateStoreInfo(admin);
  await upsertEmail({
    storeId: shopInfo.id,
    shopifyURL: shopInfo.myshopify_domain,
    title: shopInfo.name,
    senderEmail: shopInfo.email
  });

  const data = await findSubscribedProducts({ inStock: false, shopifyURL: shopInfo.myshopify_domain });
  const { potentialRevenue } = await findTotalPotentialRevenue(shopInfo.myshopify_domain);
  return { data, shopifyURL: shopInfo.myshopify_domain, storeName: shopInfo.name, potentialRevenue };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  let { admin, session } = await authenticate.admin(request);
  let formData = await request.formData();
  let obj = Object.fromEntries(formData) as any;
};

export default function Index() {
  const nav = useNavigation();
  const actionData = useActionData<typeof action>();
  const shopifyBridge = useAppBridge();
  let { revalidate } = useRevalidator();
  let { data, shopifyURL, storeName, potentialRevenue } = useLoaderData<typeof loader>();
  let rows: any = [];
  const [selectedProductInfo, setSelectedProductInfo] = useState({} as any);


  for (let i = 0; i < data.length; i++) {
    const productInfo = data[i];
    rows.push([
      productInfo.variantTitle,
      productInfo.price,
      RenderLink(productInfo.customerSubscription?.length, productInfo.id),
      (Number(productInfo.price) * productInfo.customerSubscription?.length),
    ]);
  }
  const refreshData = async () => {
    revalidate();
  };

  const onNotifyCustomer = async () => {
    console.log("notify start");
    const response = await fetch(`/api/notify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        shopifyURL: shopifyURL,
        storeName: storeName,
      }),
    });
    shopifyBridge.modal.show('info-modal');
    revalidate();
  };

  function RenderLink(content: any, productInfoId: any) {
    const handleClick = () => {
      let productInfo: any = data.filter(d => d.id == productInfoId)[0];
      console.log(productInfo);
      setSelectedProductInfo(productInfo)
      shopifyBridge.modal.show('email-list-modal');
    };
    // Return the Link component with the onClick handler attached
    return <Link onClick={handleClick}>{content}</Link>;
  }

  return (
    <Page>
      <ui-title-bar title="Back In Stock">
        <button variant="primary" onClick={refreshData}>
          Reload Data
        </button>
      </ui-title-bar>
      <Modal id="info-modal">
        <p style={{ padding: '20px' }}>Email notification has been processed </p>
        <TitleBar title="NotificaPtion Message"></TitleBar>
      </Modal>

      <Modal id="email-list-modal">
        <List type="bullet">
          <ul>
            {selectedProductInfo?.customerSubscription?.map((elm: any) => (
              <List.Item key={elm.customerEmail}>{elm.customerEmail} -  {elm.isNotified ? 'Notified' : 'Not Notify Yet'}</List.Item>
            ))}
          </ul>
        </List>
        <TitleBar title="Subscribers List"></TitleBar>
      </Modal>


      <BlockStack gap="400">
        <Layout>
          <Layout.Section>
            <Card>
              <BlockStack gap="200">
                <DataTable
                  columnContentTypes={["text", "text", "text", "text"]}
                  headings={["Product Variant", "Price", "Subscribers", "Potential Revenue"]}
                  rows={rows}
                  totals={['', '', '', `${potentialRevenue ? `$${potentialRevenue}` : 'NILL'}`]}
                  pagination={{
                    hasNext: true,
                    onNext: () => { },
                  }}
                />
              </BlockStack>
            </Card>
          </Layout.Section>

          <Layout.Section variant="oneThird">
            <BlockStack gap="500">
              <Card>
                <BlockStack gap="200">
                  <BlockStack gap="200">
                    <Button variant="primary" onClick={onNotifyCustomer}>
                      Notify Customers
                    </Button>
                  </BlockStack>
                </BlockStack>
              </Card>
            </BlockStack>
          </Layout.Section>
        </Layout>
      </BlockStack>
    </Page>
  );
}
