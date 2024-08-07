import { useLoaderData } from "@remix-run/react";
import { Box, Card, DataTable, IndexTable, InlineStack, Link, Text } from "@shopify/polaris";
import { useI18n } from '@shopify/react-i18n';
import { emptyStateMarkup } from "./empty-state";

export default function Report({ title, pagination, data }: {
  title: string,
  pagination: boolean | undefined,
  data: any[]

}) {
  const [i18n] = useI18n();
  const rows: any = [];
  const resourceName = {
    singular: 'Report',
    plural: 'Reports',
  };
  let { shopifyURL } = useLoaderData<any>();


  data.forEach((prodInfo, index) => {
    rows.push({
      id: prodInfo.id,
      imageURL: prodInfo?.imageURL,
      title: prodInfo?.productTitle,
      totalSubscribers: prodInfo.totalSubscribers,
      price: toPriceFormat(prodInfo.price),
      potentialPrice: toPriceFormat(prodInfo.potentialPrice),
      productId: prodInfo.productId
    });
  });

  const rowMarkup = rows.map(
    (element: any, index: any) => (
      <IndexTable.Row
        id={element.id}
        key={element.id}
        position={index}
      >
        <IndexTable.Cell>
          {ImageTitle(element.productId, element.imageURL, element.title)}
        </IndexTable.Cell>
        <IndexTable.Cell><Text variant="headingSm" as="h6" alignment="justify">{element.totalSubscribers}</Text></IndexTable.Cell>
        <IndexTable.Cell> <Text as="p" alignment="justify"> {element.price} </Text> </IndexTable.Cell>
        <IndexTable.Cell> <Text as="p" alignment="justify">{element.potentialPrice}</Text>  </IndexTable.Cell>
      </IndexTable.Row>
    ),
  );

  function ImageTitle(productId: string, url: string, title: string) {
    let productURL = `https://${shopifyURL}/admin/products/${productId}`
    return (
      <Link
        target="_blank"
        url={productURL}
      >
        <InlineStack gap="300" blockAlign="center">
          <Box>
            <img src={url} height="40px" width="40px" alt="product" />
          </Box>
          <Text as="p">{title}</Text>
        </InlineStack>
      </Link>
    );
  }

  function toPriceFormat(price: any) {
    return i18n.formatCurrency(price, {
      currency: 'USD',
      form: 'short',
    });
  }

  return (
    <>
      <Box paddingBlockStart="800" paddingBlockEnd="800">
        <Text variant='headingLg' as='h2'>{title}</Text>
      </Box>
      <Card padding="0">
        <IndexTable
          resourceName={resourceName}
          itemCount={data.length}
          emptyState={emptyStateMarkup}
          headings={[
            { title: 'Product', alignment: 'start' },
            { title: 'Requests', alignment: 'start' },
            { title: 'Price', alignment: 'start' },
            { title: 'Potential Income', alignment: 'start' },
          ]}
          selectable={false}
        >
          {rowMarkup}
        </IndexTable>
      </Card>
    </>

  );
}
