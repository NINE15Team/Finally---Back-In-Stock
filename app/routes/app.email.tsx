import {
  Page,
  FormLayout,
  TextField,
} from "@shopify/polaris";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { useActionData, useNavigation, useSubmit, useLoaderData, useRevalidator, json, redirect } from "@remix-run/react";
import { authenticate } from "../shopify.server";
import { findAll } from "../services/customer-subscriber.service";
import { isEmailVerified, updateEmail } from "../services/email.service";
import { EmailDTO } from "../dto/email.dto";
import { useState } from "react";
import { Form } from "@remix-run/react";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  console.log(" i am loaded");
  let authObj = await authenticate.admin(request);
  const data = await isEmailVerified(authObj.session.shop);
  return data;
};

export const action = async ({ request }: ActionFunctionArgs) => {
  let formData = await request.formData();
  let value = Object.fromEntries(formData);
  console.log(value);
  return redirect(`/app/email`);
};

export default function EmailConfiguration() {
  const [config, setConfig] = useState({
    senderName: 'hello',
    headerContent: 'how are you',
    bodyContent: 'I am getting stick',
    footerContent: 'Not really to say',
  });

  return (
    <Page>
      <FormLayout>
        <Form method="post">
          <TextField label="Sender Name" name="senderName" value={config.senderName} onChange={() => { }} autoComplete="off" />
          <FormLayout.Group>
            <TextField label="Header Content" name="headerContent" value={config.headerContent} onChange={() => { }} autoComplete="off" />
          </FormLayout.Group>

          <FormLayout.Group>
            <TextField label="Body Content" name="bodyContent" value={config.bodyContent} onChange={() => { }} autoComplete="off" />
          </FormLayout.Group>


          <FormLayout.Group>
            <TextField label="Footer Content" name="footerContent" value={config.footerContent} onChange={() => { }} autoComplete="off" />
          </FormLayout.Group>
          <TextField
            type="email"
            label="Account email"
            onChange={() => { }}
            autoComplete="email"
          />
          <button variant="primary" type="submit">Save Configuration</button>
        </Form>
      </FormLayout>
    </Page>
  );
}


