import type { HeadersFunction, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, Outlet, useLoaderData, useRouteError } from "@remix-run/react";
import { boundary } from "@shopify/shopify-app-remix/server";
import { AppProvider } from "@shopify/shopify-app-remix/react";
import "@shopify/polaris/build/esm/styles.css";

import { authenticate } from "../shopify.server";
import { isInitilized } from "~/services/store-info.service";
import { I18nContext, I18nManager } from '@shopify/react-i18n';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  let { admin } = await authenticate.admin(request);
  let initilized = await isInitilized(admin);
  return json({ apiKey: process.env.SHOPIFY_API_KEY || "", initilized: initilized });
};

export default function App() {
  const { apiKey, initilized } = useLoaderData<typeof loader>();

  const locale = 'en';
  const i18nManager = new I18nManager({
    locale,
    onError(error) {
    },
  });

  return (
    <I18nContext.Provider value={i18nManager}>
      <AppProvider isEmbeddedApp apiKey={apiKey} >
        <ui-nav-menu>
          <Link to="/app" rel="home">
            Home
          </Link>
          <Link to="/app/reports">
            Reports
          </Link>
          <Link to="/app/email" >
            Preferences
          </Link>
          <Link to="/app/instructions">
            Support
          </Link>
        </ui-nav-menu>
        <Outlet />
      </AppProvider>
    </I18nContext.Provider>
  );
}

// Shopify needs Remix to catch some thrown responses, so that their headers are included in the response.
export function ErrorBoundary() {
  return boundary.error(useRouteError());
}

export const headers: HeadersFunction = (headersArgs) => {
  return boundary.headers(headersArgs);
};
