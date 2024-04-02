import { ActionFunctionArgs, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { Layout, Page, Text } from "@shopify/polaris";
import { authenticate } from "../shopify.server";

import Report from "~/components/report";
import Request from "~/components/request";
import { findSubscribedProducts } from "~/services/product-info.service";
import { getStoreInfoShopify } from "~/services/store-info.service";
import { findAllSubscribers } from "~/services/customer-subscriber.service";
import { useActionData, useLoaderData } from "@remix-run/react";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  let { admin } = await authenticate.admin(request);
  let { myshopify_domain }: any = await getStoreInfoShopify(admin);
  const url = new URL(request.url)
  const $skip = Number(url.searchParams.get("skip")) || 0;
  const $take = Number(url.searchParams.get("take")) || 2;
  const subscribedProducts = await findSubscribedProducts({ shopifyURL: myshopify_domain, take: $take, skip: $skip });
  const pendingSubscrbers = await findAllSubscribers({ shopifyURL: myshopify_domain, isNotified: false });
  const notifiedSubscrbers = await findAllSubscribers({ shopifyURL: myshopify_domain, isNotified: true });
  console.log("loader Called");
  return { subscribedProducts, pendingSubscrbers, notifiedSubscrbers, shopifyURL: myshopify_domain };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  let formData = await request.formData();
  let obj = Object.fromEntries(formData) as any;
  if (obj.skip == undefined || isNaN(obj.skip)) {
    obj.skip = 0;
  }
  console.log("Action Called", obj);
  return redirect(`/app/reports?take=${obj.take}&skip=${obj.skip}`);;
};


export default function Index() {
  let { pendingSubscrbers, notifiedSubscrbers, subscribedProducts } = useLoaderData<typeof loader>();
  return (
    <Page>
      <Layout>
        <Text variant="heading3xl" as="h2" alignment="start">Reports</Text>
        <Report title="Requests" pagination={true} data={subscribedProducts} />
        <Request title="Requests" label="Pending" data={pendingSubscrbers} actions={[{ content: 'Send Manually' }, { content: 'Unsubscribe' }]} />
        <Request title="Requests" label="Notification Sent" data={notifiedSubscrbers} actions={[{ content: 'Send Again' }, { content: 'Re-subscribe' }]} />
      </Layout>
    </Page>
  );
}
