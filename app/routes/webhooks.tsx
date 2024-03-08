import type { ActionFunctionArgs } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import db from "../db.server";
import { addOutOfStockProduct } from "../services/product-info.service";

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
        await db.session.deleteMany({ where: { shop } });
      }

      break;
    case "PRODUCTS_UPDATE":
      console.log("_______________-PRODUCTS_UPDATE______________");
      // console.log('^^^^^^^^^^^^^^^^^^^^^^^6');
      // let result = await addOutOfStockProduct(payload);
      break;
    case "INVENTORY_ITEMS_UPDATE":
      console.log("INVENTORY_ITEMS_UPDATE", payload);
      break;
    case "INVENTORY_ITEMS_CREATE":
      console.log("INVENTORY_ITEMS_CREATE", payload);
      break;
    case "INVENTORY_ITEMS_DELETE":
      console.log("INVENTORY_ITEMS_DELETED", payload);
      break;
    case "INVENTORY_LEVELS_CONNECT":
      console.log("INVENTORY_LEVELS_CONNECT", payload);
      break;
    case "INVENTORY_LEVELS_DISCONNECT":
      console.log("INVENTORY_LEVELS_DISCONNECT", payload);
      break;
    case "INVENTORY_LEVELS_UPDATE":
      console.log("INVENTORY_LEVELS_UPDATE", payload);
      break;
    case "CUSTOMERS_DATA_REQUEST":
      console.log("CUSTOMERS_DATA_REQUEST", payload);
      break;
    case "CUSTOMERS_REDACT":
      console.log("CUSTOMERS_DATA_REQUEST", payload);
      break;
    case "SHOP_REDACT":
      console.log("SHOP_REDACT", payload);
      break;
    default:
      throw new Response("Unhandled webhook topic", { status: 404 });
  }

  throw new Response();
};
