import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { useActionData, useNavigation, useSubmit, useLoaderData, useRevalidator, json } from "@remix-run/react";
import {
  Page,
  Layout,
  Text,
  Card,
  BlockStack,
  Link,
  InlineStack,
  DataTable
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import { findAll } from "../services/customer-subscriber.service";
import { isEmailVerified, updateEmail } from "../services/email.service";
import { EmailDTO } from "../dto/email.dto";



export const loader = async ({ request }: LoaderFunctionArgs) => {
  let authObj = await authenticate.admin(request);
  const data = await findAll({ storeName: authObj.session.shop });
  const em = await isEmailVerified(authObj.session.shop);
  console.log(em)
  let rows = [];
  for (let i = 0; i < data.length; i++) {
    const subscription = data[i];
    rows.push([
      subscription.customerEmail,
      subscription.productInfo?.productTitle,
      subscription.productInfo?.variantTitle,
      subscription.isNotified + ""
    ]);
  }
  return { rows, storeName: authObj.session.shop };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { admin } = await authenticate.admin(request);
  const color = ["Red", "Orange", "Yellow", "Green"][
    Math.floor(Math.random() * 4)
  ];
  const response = await admin.graphql(
    `#graphql
      mutation populateProduct($input: ProductInput!) {
        productCreate(input: $input) {
          product {
            id
            title
            handle
            status
            variants(first: 10) {
              edges {
                node {
                  id
                  price
                  barcode
                  createdAt
                }
              }
            }
          }
        }
      }`,
    {
      variables: {
        input: {
          title: `${color} Snowboard`,
          variants: [{ price: Math.random() * 100 }],
        },
      },
    },
  );
  const responseJson = await response.json();

  return json({
    product: responseJson.data?.productCreate?.product,
  });
};

export default function Index() {
  const nav = useNavigation();
  const actionData = useActionData<typeof action>();
  let { rows, storeName } = useLoaderData<typeof loader>();
  let { revalidate } = useRevalidator();

  const refreshData = async () => {
    console.log('storeName', storeName);
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({})
    };
    let resp = await fetch('/api/email/update-email', {})
      .then(response => response.json())
    console.log(resp)
    revalidate();
  }

  const onNotifyCustomer = async () => {
    console.log('notify start');
    const response = await fetch(`/api/notify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });
    console.log(response);
  }

  return (
    <Page>
      <ui-title-bar title="Back In Stock">
        <button variant="primary" onClick={refreshData}>
          Reload Data
        </button>
      </ui-title-bar>
      <BlockStack gap="500">
        <Layout>
          <Layout.Section>
            <Card>
              <BlockStack gap="200">
                <DataTable
                  columnContentTypes={[
                    'text',
                    'text',
                    'text',
                    'text',
                  ]}
                  headings={[
                    'Customer',
                    'Product',
                    'Variant',
                    'Is Notified',
                  ]}
                  rows={rows}
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
                  <Text as="h2" variant="headingMd">
                    Summary
                  </Text>
                  <BlockStack gap="200">
                    <InlineStack align="space-between">
                      <Text as="span" variant="bodyMd">
                        Customers
                      </Text>
                      <Link
                        url="https://remix.run"
                        target="_blank"
                        removeUnderline
                      >
                        100
                      </Link>
                    </InlineStack>
                    <InlineStack align="space-between">
                      <Text as="span" variant="bodyMd">
                        Out of Stock Items
                      </Text>
                      <Link
                        url="https://www.prisma.io/"
                        target="_blank"
                        removeUnderline
                      >
                        200
                      </Link>
                    </InlineStack>
                    <button variant="primary" onClick={onNotifyCustomer}>
                      Notify Customers
                    </button>
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
