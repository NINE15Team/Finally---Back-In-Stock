import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import {
  Page,
  Text,
  BlockStack,
  Box,
  TextField,
  Button,
} from "@shopify/polaris";
import { useState } from "react";
import { findEmailConfigByStoreURL, saveOrUpdate } from "../services/email.service";
import { getStoreInfoShopify } from "../services/store-info.service";
import { authenticate } from "../shopify.server";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { Modal, TitleBar, useAppBridge } from "@shopify/app-bridge-react";


export const loader = async ({ request }: LoaderFunctionArgs) => {
  let { admin, session } = await authenticate.admin(request);
  let shop = await getStoreInfoShopify(admin);
  let shopifyURL = shop.myshopify_domain;
  let emailConfig = await findEmailConfigByStoreURL(shopifyURL);
  return { emailConfig, shopifyURL };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  let { admin, session } = await authenticate.admin(request);
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
      <Box paddingBlockEnd="400">
        <Text as="h1" fontWeight="bold" variant="headingXl">
          Email Configuration
        </Text>
      </Box>
      <Form method="POST">
        <input type="hidden" name="shopifyURL" value={shopifyURL} />
        <BlockStack gap="200">
          <TextField
            value={form.title}
            onChange={(val) => handleChange("title", val)}
            label="Email Title"
            autoComplete="off"
            name="title"
          />
          <TextField
            value={form.headerContent}
            onChange={(val) => handleChange("headerContent", val)}
            label="Header Content"
            placeholder="Good News!"
            autoComplete="off"
            name="headerContent"
          />
          <TextField
            value={form.bodyContent}
            onChange={(val) => handleChange("bodyContent", val)}
            label="Body Content"
            placeholder="Your product is back in stock"
            autoComplete="off"
            name="bodyContent"
          />
          <TextField
            value={form.footerContent}
            onChange={(val) => handleChange("footerContent", val)}
            label="Footer Content"
            placeholder="If you have any concerns,please email xyz"
            autoComplete="off"
            name="footerContent"
          />
          <TextField
            value={form.buttonContent}
            onChange={(val) => handleChange("buttonContent", val)}
            label="Button Content"
            placeholder="Checkout Now!"
            autoComplete="off"
            name="buttonContent"
          />
          <Box paddingBlockStart="200">
            <Button variant="primary" submit={true}>Save</Button>
          </Box>
        </BlockStack>
      </Form>
      <Modal id="info-modal">
        <p style={{ padding: '20px' }}>Email Configuration Updated!</p>
        <TitleBar title="Info Message"></TitleBar>
      </Modal>

    </Page >
  );
}
