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
  Card,
} from "@shopify/polaris";
import { useState } from "react";
import { findEmailConfigByStoreURL, saveOrUpdate } from "../services/email.service";
import { getStoreInfoShopify } from "../services/store-info.service";
import { authenticate } from "../shopify.server";
import { Form, json, useActionData, useFetcher, useLoaderData } from "@remix-run/react";
import { Modal, TitleBar, useAppBridge } from "@shopify/app-bridge-react";
import { EmailDTO } from "~/dto/email.dto";


export const loader = async ({ request }: LoaderFunctionArgs) => {
  let { admin } = await authenticate.admin(request);
  let shop = await getStoreInfoShopify(admin);
  let shopifyURL = shop.myshopify_domain;
  let emailConfig = await findEmailConfigByStoreURL(shopifyURL);
  return { emailConfig, shopifyURL };
};

function validateForm(data: EmailDTO) {
  let errors = {} as any;
  if (data.title == undefined || data.title.length == 0) {
    errors.title = "Title is missing";
  }
  if (data.headerContent == undefined || data.headerContent.length == 0) {
    errors.headerContent = "Header Content is missing";
  }
  if (data.bodyContent == undefined || data.bodyContent.length == 0) {
    errors.bodyContent = "Body Content is missing";
  }
  if (data.footerContent == undefined || data.footerContent.length == 0) {
    errors.footerContent = "Footer Content is missing";
  }
  if (data.buttonContent == undefined || data.buttonContent.length == 0) {
    errors.buttonContent = "Button Content is missing";
  }
  return errors;
}

export const action = async ({ request }: ActionFunctionArgs) => {
  await authenticate.admin(request);
  let formData = await request.formData();
  let obj = Object.fromEntries(formData) as any;
  let isEmpty = (data: any) => Object.keys(data).length == 0;
  if (!isEmpty(validateForm(obj))) {
    return json({ status: false, error: validateForm(obj) })
  } else {
    console.log(obj);
    let resp = await saveOrUpdate(obj)
    return json({ status: true, data: resp });
  }
};

export default function Index() {
  let { emailConfig, shopifyURL } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const shopifyBridge = useAppBridge();
  const fetcher = useFetcher();

  const [form, setForm] = useState(emailConfig);

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  console.log(fetcher)

  if (fetcher.state == 'loading' && fetcher.data?.status) {
    shopifyBridge.modal.show('info-modal');
  }

  return (
    <Page>
      <Box paddingBlockEnd="800" >
        <InlineStack align='space-between'>
          <Text variant="headingXl" as="h2">Preferences</Text>
        </InlineStack>
      </Box>

      <Box paddingBlockEnd="2000" >
        <fetcher.Form method="POST" name="save_email">
          <Card>
            <InlineGrid columns={['oneThird', 'twoThirds']}>

              <Box paddingInlineEnd="2000" paddingBlockStart="200" paddingBlockEnd="200">
                <Box paddingBlockEnd="300">
                  <Text variant='headingLg' as='h2'>Notification Email</Text>
                </Box>
                <Text as="p">Customize notification emails customers receive when products are back in stock.</Text>
              </Box>

              <Box id="email_form" paddingBlockStart="200" paddingBlockEnd="200">
                <input type="hidden" name="shopifyURL" value={shopifyURL} />
                <BlockStack gap="300">
                  <Box paddingBlock="200">
                    <Text variant="headingXs" as="h6">
                      Email Subject
                    </Text>
                    <TextField
                      value={form.title}
                      onChange={(val) => handleChange("title", val)}
                      label="Email Subject"
                      labelHidden
                      autoComplete="off"
                      name="title"
                      error={fetcher.state == 'idle' && fetcher.data?.error?.title && !form.title}
                    />
                  </Box>

                  <Box paddingBlock="200">
                    <Text variant="headingXs" as="h6">
                      Header Content
                    </Text>
                    <TextField
                      value={form.headerContent}
                      onChange={(val) => handleChange("headerContent", val)}
                      label="Header Content"
                      labelHidden
                      placeholder="Good News!"
                      autoComplete="off"
                      name="headerContent"
                      error={fetcher.state == 'idle' && fetcher.data?.error?.headerContent && !form.headerContent}
                    />
                  </Box>
                  <Box paddingBlock="200">
                    <Text variant="headingXs" as="h6">
                      Body Message
                    </Text>
                    <TextField
                      value={form.bodyContent}
                      onChange={(val) => handleChange("bodyContent", val)}
                      label="Body Message"
                      labelHidden
                      placeholder="Your product is back in stock"
                      autoComplete="off"
                      multiline={5}
                      name="bodyContent"
                      ariaExpanded
                      error={fetcher.state == 'idle' && fetcher.data?.error?.bodyContent && !form.bodyContent}
                    />
                  </Box>
                  <Box paddingBlock="200">
                    <Text variant="headingXs" as="h6">
                      Footer Content
                    </Text>
                    <TextField
                      value={form.footerContent}
                      onChange={(val) => handleChange("footerContent", val)}
                      label="Footer Content"
                      labelHidden
                      placeholder="If you have any concerns,please email xyz"
                      autoComplete="off"
                      name="footerContent"
                      error={fetcher.state == 'idle' && fetcher.data?.error?.footerContent && !form.footerContent}
                    />
                  </Box>
                  <Box paddingBlock="200">
                    <Text variant="headingXs" as="h6">
                      Buy Button Label
                    </Text>
                    <TextField
                      value={form.buttonContent}
                      onChange={(val) => handleChange("buttonContent", val)}
                      label="Buy Button Label"
                      labelHidden
                      placeholder="Checkout Now!"
                      autoComplete="off"
                      name="buttonContent"
                      error={fetcher.state == 'idle' && fetcher.data?.error?.buttonContent && !form.buttonContent}
                    />
                  </Box>
                </BlockStack>
              </Box>

            </InlineGrid>
          </Card>

          <InlineStack align="end">
            <Box paddingBlockStart="200">
              <Button variant="primary" submit={true} loading={fetcher.state != 'idle' && !fetcher?.data?.status} >Save</Button>
            </Box>
          </InlineStack>
        </fetcher.Form>
      </Box>

      <Modal id="info-modal">
        <p style={{ padding: '20px' }}>Email Configuration Updated!</p>
        <TitleBar title="Settings"></TitleBar>
      </Modal>
    </Page >
  );
}