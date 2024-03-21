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
import { Form, json, useActionData, useLoaderData } from "@remix-run/react";
import { Modal, TitleBar, useAppBridge } from "@shopify/app-bridge-react";


export const loader = async ({ request }: LoaderFunctionArgs) => {
  return json({ status: true })
};

export const action = async ({ request }: ActionFunctionArgs) => {
};

export default function Index() {
  return (
    <Page>
      Hello I am going to un-subscribe
    </Page>
  );
}
