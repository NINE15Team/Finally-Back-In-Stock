import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import {
  useActionData,
  useLoaderData,
} from "@remix-run/react";
import { authenticate } from "../shopify.server";
import { countOfSubscribers, findAllSubscribers, findTotalPotentialRevenue } from "../services/customer-subscriber.service";
import { findSubscribedProducts } from "../services/product-info.service";
import { upsertEmail } from "../services/email.service";
import { updateStoreInfo, isInitilized, getStoreInfoShopify, activateWebPixel } from "../services/store-info.service";
import Instructions from "./app.instructions";
import SubscriberList from "./app.subscriberList";
import { useState } from "react";

import { Layout, Page } from "@shopify/polaris";
import Checklist from "~/components/checklist";
import NumRequest from "~/components/num-request";
import Request from "~/components/request";
import { sumNoOfNotifications } from "~/services/notification-history.service";


export const loader = async ({ request }: LoaderFunctionArgs) => {
  let { admin, session } = await authenticate.admin(request);
  let initilized = await isInitilized(admin);
  if (false && !initilized) {
    await activateWebPixel(admin);
  }
  let { myshopify_domain, name }: any = await getStoreInfoShopify(admin);
  const subscribedProducts = await findSubscribedProducts({ shopifyURL: myshopify_domain });
  const totalNotifications = await sumNoOfNotifications(myshopify_domain);
  const newSubscribers = await countOfSubscribers(myshopify_domain);
  const data2 = await findAllSubscribers({
    shopifyURL: myshopify_domain,
    isNotified: false,
  });
  const { potentialRevenue } = await findTotalPotentialRevenue(myshopify_domain);
  return { subscribedProducts, data2, totalNotifications, newSubscribers, shopifyURL: myshopify_domain, storeName: name, potentialRevenue, initilized };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  let { admin, session } = await authenticate.admin(request);
  let formData = await request.formData();
  let shopInfo: any = await updateStoreInfo(admin);
  await upsertEmail({
    storeId: shopInfo.id,
    shopifyURL: shopInfo.myshopify_domain,
    title: shopInfo.name,
    senderEmail: shopInfo.email
  });
  await activateWebPixel(admin);
  return await isInitilized(admin);
};

export default function Index() {
  const actionData = useActionData<typeof action>();
  let { initilized } = useLoaderData<typeof loader>();
  const [appInit, setAppInit] = useState(initilized);


  return (
    <Page>
      <Layout>
        <Checklist />
        <NumRequest />
        <Request />
      </Layout>
    </Page>
  );
}
