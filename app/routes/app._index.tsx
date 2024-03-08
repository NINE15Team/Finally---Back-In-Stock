import { useEffect } from "react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useActionData, useNavigation, useSubmit, useLoaderData } from "@remix-run/react";
import {
  Page,
  Layout,
  Text,
  Card,
  Button,
  BlockStack,
  Box,
  List,
  Link,
  InlineStack,
  DataTable
} from "@shopify/polaris";
import React from 'react';
import { authenticate } from "../shopify.server";
import { findAll } from "~/services/customer-subscriber.service";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate.admin(request);
  const data = await findAll();
  let rows = [];;
  for (let i = 0; i < data.length; i++) {
    const subscription = data[i];
    rows.push([
      subscription.customerEmail,
      subscription.productInfo?.productTitle,
      subscription.productInfo?.variantTitle,
      subscription.isNotified + ""
    ]);
  }
  return rows;
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
  let rows = useLoaderData<typeof loader>();
  const refreshData = () => {
    rows = useLoaderData<typeof loader>();
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
