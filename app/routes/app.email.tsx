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
  RangeSlider,
  ColorPicker,
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import { findAll } from "../services/customer-subscriber.service";
import { isEmailVerified, updateEmail } from "../services/email.service";
import { EmailDTO } from "../dto/email.dto";
import { useRef, useEffect, useState, useCallback } from "react";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return {};
};

export const action = async ({ request }: ActionFunctionArgs) => {
  return {};
};

export default function Index() {
  const nav = useNavigation();
  const [email, setEmail] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    headerContent: "",
    headerFontFamily: "",
    headerFontSize: "",
    headerBgColor: "",
    bodyContent: "",
    bodyFontFamily: "",
    bodyFontSize: "",
    bodyBgColor: "",
    footerContent: "",
    footerFontFamily: "",
    footerFontSize: "",
    footerBgColor: "",
  });

  const handleChange = (key, value) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  

  return (
    <Page>
      <Text as="h1" fontWeight="bold" variant="heading2xl">
        Email Configuration
      </Text>
      <TextField value={form.name} onChange={(val)=>handleChange(form.name,val)} label="Name" autoComplete="off" />
      <TextField value={form.email} onChange={(val)=>handleChange(form.email,val)} label="Email" autoComplete="off" />
      <TextField value={form.headerContent} onChange={(val)=>handleChange(form.headerContent,val)} label="Header Content" autoComplete="off" />
      <TextField value={form.headerFontFamily} onChange={(val)=>handleChange(form.headerFontFamily,val)} label="Header Font Family" autoComplete="off" />
      <RangeSlider value={+form.headerFontSize} label="Header Font Size" onChange={(val)=>handleChange(form.headerFontSize,val.toString())} min={1} max={30}/>
      <ColorPicker/>
      <TextField value={form.headerFontFamily} onChange={(val)=>handleChange(form.headerFontFamily,val)} label="Header Font Family" autoComplete="off" />
    </Page>
  );
}
