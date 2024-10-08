import "@shopify/shopify-app-remix/adapters/node";
import {
  AppDistribution,
  DeliveryMethod,
  shopifyApp,
  LATEST_API_VERSION,
} from "@shopify/shopify-app-remix/server";
import { PrismaSessionStorage } from "@shopify/shopify-app-session-storage-prisma";
import { restResources } from "@shopify/shopify-api/rest/admin/2024-01";
import prisma from "./db.server";
import { saveStoreInfo } from "../app/services/store-info.service";
import { features } from "process";
const shopify = shopifyApp({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET || "",
  apiVersion: LATEST_API_VERSION,
  scopes: process.env.SCOPES?.split(","),
  appUrl: process.env.SHOPIFY_APP_URL || "",
  authPathPrefix: "/auth",
  sessionStorage: new PrismaSessionStorage(prisma),
  distribution: AppDistribution.AppStore,
  features: {
    v3_lineItemBilling: true
  },
  restResources,
  webhooks: {
    APP_UNINSTALLED: {
      deliveryMethod: DeliveryMethod.Http,
      callbackUrl: "/webhooks",
    },
    PRODUCTS_UPDATE: {
      deliveryMethod: DeliveryMethod.PubSub,
      pubSubProject: "hazel-sky-431216-d5",
      pubSubTopic: "finally-topic",
    },
    PRODUCTS_DELETE: {
      deliveryMethod: DeliveryMethod.PubSub,
      pubSubProject: "hazel-sky-431216-d5",
      pubSubTopic: "finally-topic",
    },
    APP_SUBSCRIPTIONS_UPDATE: {
      deliveryMethod: DeliveryMethod.Http,
      callbackUrl: "/webhooks",
    },
    APP_PURCHASES_ONE_TIME_UPDATE: {
      deliveryMethod: DeliveryMethod.Http,
      callbackUrl: "/webhooks",
    },
    
    CUSTOMERS_DATA_REQUEST: {
      deliveryMethod: DeliveryMethod.PubSub,
      pubSubProject: "hazel-sky-431216-d5",
      pubSubTopic: "finally-topic",
    },
    CUSTOMERS_REDACT: {
      deliveryMethod: DeliveryMethod.PubSub,
      pubSubProject: "hazel-sky-431216-d5",
      pubSubTopic: "finally-topic",
    },
    SHOP_REDACT: {
      deliveryMethod: DeliveryMethod.PubSub,
      pubSubProject: "hazel-sky-431216-d5",
      pubSubTopic: "finally-topic",
    },

  },
  hooks: {
    afterAuth: async ({ session }: any) => {
      shopify.registerWebhooks({ session });
      let storeInfo = await saveStoreInfo({
        storeId: session.shop,
        storeName: session.shop,
        shopifyURL: session.shop,
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true
      });
    },
  },
  future: {
    v3_webhookAdminContext: true,
    v3_authenticatePublic: true,
    unstable_newEmbeddedAuthStrategy: true,
  },
  ...(process.env.SHOP_CUSTOM_DOMAIN
    ? { customShopDomains: [process.env.SHOP_CUSTOM_DOMAIN] }
    : {}),
});

export default shopify;
export const apiVersion = LATEST_API_VERSION;
export const addDocumentResponseHeaders = shopify.addDocumentResponseHeaders;
export const authenticate = shopify.authenticate;
export const unauthenticated = shopify.unauthenticated;
export const login = shopify.login;
export const registerWebhooks = shopify.registerWebhooks;
export const sessionStorage = shopify.sessionStorage;
