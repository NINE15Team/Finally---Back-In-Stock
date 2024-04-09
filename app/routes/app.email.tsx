import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import {
  Page,
  Text,
  BlockStack,
  Box,
  TextField,
  Button,
  Link,
  Layout,
  InlineGrid,
  InlineStack,
  Divider,
} from "@shopify/polaris";
import { useEffect, useState } from "react";
import { findEmailConfigByStoreURL, saveOrUpdate } from "../services/email.service";
import { getStoreInfoShopify } from "../services/store-info.service";
import { authenticate } from "../shopify.server";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { Modal, TitleBar, useAppBridge } from "@shopify/app-bridge-react";


export const loader = async ({ request }: LoaderFunctionArgs) => {
  let { admin } = await authenticate.admin(request);
  let shop = await getStoreInfoShopify(admin);
  let shopifyURL = shop.myshopify_domain;
  let emailConfig = await findEmailConfigByStoreURL(shopifyURL);
  return { emailConfig, shopifyURL };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  await authenticate.admin(request);
  let formData = await request.formData();
  let obj = Object.fromEntries(formData) as any;
  return await saveOrUpdate(obj);
};

export default function Index() {
  let { emailConfig, shopifyURL } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const shopifyBridge = useAppBridge();

  const [form, setForm] = useState(emailConfig);

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  if (actionData?.id) {
    shopifyBridge.modal.show('info-modal');
  }

  return (
    <Page>
      <Layout>
        <Layout.Section >
          <Box paddingBlockEnd="800" background="--p-color-bg-fill-brand">
            <InlineStack align='space-between'>
              <Text variant="headingXl" as="h1">Settings</Text>
              <div style={{ color: '#005BD3' }}>
                <Link removeUnderline monochrome url="/app/instructions">View installation guide</Link>
              </div>
            </InlineStack>
            <Text as="p">
              Use this page to customize the notification email customers receive as well as future settings
            </Text>
          </Box>
          <Box paddingBlockEnd="2000">
            <InlineGrid columns={['oneThird', 'twoThirds']}>
              <Box paddingInlineEnd="2000">
                <Box paddingBlockEnd="800">
                  <Text variant='headingLg' as='h2'>Notification Email</Text>
                </Box>
                <Text as="p">Customize notification emails customers receive when products are back in stock.</Text>
              </Box>
              <Box borderColor="border" borderWidth="025" borderRadius="300" paddingBlock="500" paddingInline="1200" background="bg-fill">
                <Form method="POST">
                  <input type="hidden" name="shopifyURL" value={shopifyURL} />
                  <BlockStack gap="200">
                    <TextField
                      value={form.title}
                      onChange={(val) => handleChange("title", val)}
                      label="Email Subject"
                      autoComplete="off"
                      name="title"
                    />
                    <Box paddingBlock="200">
                      <Divider borderColor="border" borderWidth="025" />
                    </Box>
                    <Box paddingBlock="200">
                      <TextField
                        value={form.headerContent}
                        onChange={(val) => handleChange("headerContent", val)}
                        label="Header Content"
                        placeholder="Good News!"
                        autoComplete="off"
                        name="headerContent"
                      />
                    </Box>
                    <Box paddingBlock="200">
                      <TextField
                        value={form.bodyContent}
                        onChange={(val) => handleChange("bodyContent", val)}
                        label="Body Message"
                        placeholder="Your product is back in stock"
                        autoComplete="off"
                        multiline={true}
                        name="bodyContent"
                        ariaExpanded
                      />
                    </Box>
                    <Box paddingBlock="200">
                      <TextField
                        value={form.footerContent}
                        onChange={(val) => handleChange("footerContent", val)}
                        label="Footer Content"
                        placeholder="If you have any concerns,please email xyz"
                        autoComplete="off"
                        name="footerContent"
                      />
                    </Box>
                    <Box paddingBlock="200">

                      <TextField
                        value={form.buttonContent}
                        onChange={(val) => handleChange("buttonContent", val)}
                        label="Buy Button Label"
                        placeholder="Checkout Now!"
                        autoComplete="off"
                        name="buttonContent"
                      />
                    </Box>
                    <Box paddingBlockStart="200">
                      <Button variant="primary" submit={true}>Save</Button>
                    </Box>
                  </BlockStack>
                </Form>
              </Box>
            </InlineGrid>
          </Box>
        </Layout.Section>
        <Modal id="info-modal">
          <p style={{ padding: '20px' }}>Email Configuration Updated!</p>
          <TitleBar title="Info Message"></TitleBar>
        </Modal>
      </Layout>
    </Page >
  );
}
