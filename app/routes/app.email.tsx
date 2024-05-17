import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import {
  Page,
  Text,
  BlockStack,
  Box,
  TextField,
  Button,
  InlineGrid,
  InlineStack,
  Card,
} from "@shopify/polaris";
import { useState } from "react";
import { findEmailConfigByStoreURL, saveOrUpdate } from "../services/email.service";
import { getStoreInfoShopify } from "../services/store-info.service";
import { authenticate } from "../shopify.server";
import { json, useActionData, useFetcher, useLoaderData } from "@remix-run/react";
import { Modal, TitleBar, useAppBridge } from "@shopify/app-bridge-react";
import { EmailDTO } from "~/dto/email.dto";
import {
  BtnBold,
  BtnBulletList,
  BtnClearFormatting,
  BtnItalic,
  BtnLink,
  BtnNumberedList,
  BtnRedo,
  BtnStrikeThrough,
  BtnStyles,
  BtnUnderline,
  BtnUndo,
  HtmlButton,
  Separator,
  Toolbar,
  Editor,
  EditorProvider
} from 'react-simple-wysiwyg';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  let { admin } = await authenticate.admin(request);
  let shop = await getStoreInfoShopify(admin);
  let shopifyURL = shop.myshopify_domain;
  let emailConfig = await findEmailConfigByStoreURL(shopifyURL);
  return { emailConfig };
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
  let { admin } = await authenticate.admin(request);
  let shop = await getStoreInfoShopify(admin);
  let shopifyURL = shop.myshopify_domain;
  let formData = await request.formData();
  let obj = Object.fromEntries(formData) as any;
  let emailObj = JSON.parse(obj.data);
  let isEmpty = (data: any) => Object.keys(data).length == 0;
  if (!isEmpty(validateForm(emailObj))) {
    return json({ status: false, error: validateForm(obj) })
  } else {
    emailObj.shopifyURL = shopifyURL;
    let resp = await saveOrUpdate(emailObj)
    return json({ status: true, data: resp });
  }
};

export default function Index() {
  let { emailConfig } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const fetcher = useFetcher();
  const shopifyBridge = useAppBridge();

  const [form, setForm] = useState(emailConfig);

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  if (fetcher.state == 'loading' && fetcher.data?.status) {
    shopifyBridge.modal.show('info-modal');
  }

  const onSave = () => {
    console.log(form);

    const formData = new FormData();
    formData.append("intent", "save_email");
    formData.set('data', JSON.stringify(form));
    fetcher.submit(formData, { method: "post" });
  }

  return (
    <Page>
      <Box paddingBlockEnd="800" >
        <InlineStack align='space-between'>
          <Text variant="headingXl" as="h2">Preferences</Text>
        </InlineStack>
      </Box>

      <Box paddingBlockEnd="2000" >
        <Card>
          <InlineGrid columns={['oneThird', 'twoThirds']}>

            <Box paddingInlineEnd="2000" paddingBlockStart="200" paddingBlockEnd="200">
              <Box paddingBlockEnd="300">
                <Text variant='headingLg' as='h2'>Notification Email</Text>
              </Box>
              <Text as="p">Customize notification emails customers receive when products are back in stock.</Text>
            </Box>

            <Box id="email_form" paddingBlockStart="200" paddingBlockEnd="200">
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
                  <EditorProvider>
                    <Toolbar>
                      <BtnUndo />
                      <BtnRedo />
                      <Separator />
                      <BtnBold />
                      <BtnItalic />
                      <BtnUnderline />
                      <BtnStrikeThrough />
                      <Separator />
                      <BtnNumberedList />
                      <BtnBulletList />
                      <Separator />
                      <BtnLink />
                      <BtnClearFormatting />
                      <HtmlButton />
                      <Separator />
                      <BtnStyles />
                    </Toolbar>
                    <Editor
                      value={form.bodyContent}
                      onChange={(val) => handleChange("bodyContent", val.target.value)}
                      name="bodyContent"
                    />
                  </EditorProvider>
                  {/* <TextField
                      value={form.bodyContent}
                      label="Body Message"
                      labelHidden
                      placeholder="Your product is back in stock"
                      autoComplete="off"
                      multiline={5}
                      name="bodyContent"
                      ariaExpanded
                      error={fetcher.state == 'idle' && fetcher.data?.error?.bodyContent && !form.bodyContent}
                    /> */}
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
            <Button variant="primary" loading={fetcher.state != 'idle' && !fetcher?.data?.status} onClick={onSave} >Save</Button>
          </Box>
        </InlineStack>
      </Box>

      <Modal id="info-modal">
        <p style={{ padding: '20px' }}>Email Configuration Updated!</p>
        <TitleBar title="Settings"></TitleBar>
      </Modal>
    </Page >
  );
}