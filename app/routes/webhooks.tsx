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
        await db.session.deleteMany({ where: { shop } });
      }

      break;
    case "PRODUCTS_UPDATE":
      console.log("_______________-PRODUCTS_UPDATE______________");
      await upsertProduct(payload, shop);
      break;
    case "CUSTOMERS_DATA_REQUEST":
      console.log("CUSTOMERS_DATA_REQUEST", payload);
      break;
    case "CUSTOMERS_REDACT":
      console.log("CUSTOMERS_DATA_REQUEST", payload);
      break;
    case "SHOP_REDACT":
      console.log("Starting shop data delete......");
      await deleteStoreByURL(payload.shop_domain);
      console.log("End shop data delete......");
      break;
    default:
      throw new Response("Unhandled webhook topic", { status: 404 });
  }

  throw new Response();
};
