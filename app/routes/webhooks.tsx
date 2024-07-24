import type { ActionFunctionArgs } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import db from "../db.server";
import { upsertProduct } from "../services/product-info.service";
import { deleteStoreByURL } from "../services/store-info.service";


export const action = async ({ request }: ActionFunctionArgs) => {
  const { topic, shop, session, admin, payload } = await authenticate.webhook(
    request
  );

  if (!admin) {
    // The admin context isn't returned if the webhook fired after a shop was uninstalled.
    throw new Response();
  }

  switch (topic) {
    case "APP_UNINSTALLED":
      if (session) {
        console.log("_______________-App Uninstalled______________");
        await db.session.deleteMany({ where: { shop } });
      }
    default:
      throw new Response("Unhandled webhook topic", { status: 404 });
  }

  throw new Response();
};
