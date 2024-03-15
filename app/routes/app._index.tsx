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
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import { findAll } from "../services/customer-subscriber.service";
import { isEmailVerified, updateEmail } from "../services/email.service";
import { EmailDTO } from "../dto/email.dto";
import { useRef, useEffect, useState, useCallback } from "react";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  let authObj = await authenticate.admin(request);
  const data = await findAll({ storeName: authObj.session.shop });
  const emailVerified = await isEmailVerified(authObj.session.shop);
  let rows = [];
  for (let i = 0; i < data.length; i++) {
    const subscription = data[i];
    rows.push([
      subscription.customerEmail,
      subscription.productInfo?.productTitle,
      subscription.productInfo?.variantTitle,
      subscription.isNotified + "",
    ]);
  }
  return { rows, storeName: authObj.session.shop, emailVerified };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  let { session } = await authenticate.admin(request);
  let formData = await request.formData();
  let obj = Object.fromEntries(formData) as any;
  // return json({ msg: "Please Verify your Email" });
  return await updateEmail({ senderEmail: obj.email, storeName: session.shop, senderName: session.shop })
};

export default function Index() {
  const nav = useNavigation();
  const actionData = useActionData<typeof action>();
  let { rows, storeName, emailVerified } = useLoaderData<typeof loader>();
  let { revalidate } = useRevalidator();
  const [email, setEmail] = useState("");

  const handleEmailChange = useCallback((value: string) => setEmail(value), []);

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
      body: JSON.stringify({}),
    });
    console.log(response);
  };

  console.log(actionData, "0000000000000000000000000000000000");


  return (
    <Page>
      oyyis {emailVerified}
      {(emailVerified == undefined || emailVerified == "NO") &&
        (
          <Card padding="400">
            <Form method="POST">
              <BlockStack gap="200">
                <TextField
                  value={email}
                  onChange={handleEmailChange}
                  name="email"
                  label="Email"
                  type="email"
                  autoComplete="email"
                />
              </BlockStack>
              <InlineStack align="end">
                <ButtonGroup>
                  <Button variant="primary" submit={true}>Verify Email</Button>
                </ButtonGroup>
              </InlineStack>
            </Form>
          </Card>
        )}

      {emailVerified == "PENDING" &&
        (
          <div>Please Verify your email Address</div>
        )}


      {emailVerified == "YES" &&
        (<div >
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
                      columnContentTypes={["text", "text", "text", "text"]}
                      headings={["Customer", "Product", "Variant", "Is Notified"]}
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
                        <Form method="POST">
                          <button variant="primary" type="submit">
                            Perform Action
                          </button>
                        </Form>
                      </BlockStack>
                    </BlockStack>
                  </Card>
                </BlockStack>
              </Layout.Section>
            </Layout>
          </BlockStack>
        </div>)}
    </Page>
  );
}
