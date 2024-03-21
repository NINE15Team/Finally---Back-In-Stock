import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { useNavigation } from "@remix-run/react";
import {
  Page,
  Text,
  BlockStack,
  Box,
  TextField,
  Button,
} from "@shopify/polaris";
import { useState } from "react";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return {};
};

export const action = async ({ request }: ActionFunctionArgs) => {
  return {};
};

export default function Index() {
  const [form, setForm] = useState({
    name: "",
    title: "",
    headerContent: "",
    bodyContent: "",
    footerContent: "",
    buttonContent: "",
  });

  const handleChange = (key: string, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  return (
    <Page>
      <Box paddingBlockEnd="400">
        <Text as="h1" fontWeight="bold" variant="headingXl">
          Email Configuration
        </Text>
      </Box>
      <BlockStack gap="200">
        <TextField
          value={form.name}
          onChange={(val) => handleChange("name", val)}
          label="Name"
          autoComplete="off"
        />
        <TextField
          value={form.title}
          onChange={(val) => handleChange("title", val)}
          label="Email Title"
          autoComplete="off"
        />
        <TextField
          value={form.headerContent}
          onChange={(val) => handleChange("headerContent", val)}
          label="Header Content"
          placeholder="Good News!"
          autoComplete="off"
        />
        <TextField
          value={form.bodyContent}
          onChange={(val) => handleChange("bodyContent", val)}
          label="Body Content"
          placeholder="Your product is back in stock"
          autoComplete="off"
        />
        <TextField
          value={form.footerContent}
          onChange={(val) => handleChange("footerContent", val)}
          label="Footer Content"
          placeholder="If you have any concerns,please email xyz"
          autoComplete="off"
        />
        <TextField
          value={form.buttonContent}
          onChange={(val) => handleChange("buttonContent", val)}
          label="Button Content"
          placeholder="Checkout Now!"
          autoComplete="off"
        />
        <Box paddingBlockStart="200">
          <Button variant="primary">Save</Button>
        </Box>
      </BlockStack>
    </Page>
  );
}
