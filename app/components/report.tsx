import { Box, DataTable, IndexTable, InlineStack, Text } from "@shopify/polaris";
import { useI18n } from '@shopify/react-i18n';

export default function Report({ title, pagination, data }: {
  title: string,
  pagination: boolean | undefined,
  data: any[]

}) {
  const [i18n] = useI18n();
  const rows: any = [];
  const resourceName = {
    singular: 'Request',
    plural: 'Requests',
  };

  const options: any = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };

  data.forEach((prodInfo, index) => {
    const price = i18n.formatCurrency(prodInfo.price, {
      currency: 'USD',
      form: 'short',
    });
    const potentialPrice = i18n.formatCurrency(Number(prodInfo.price) * prodInfo.customerSubscription?.length, {
      currency: 'USD',
      form: 'short',
    });
    rows.push({
      id: prodInfo.id,
      imageURL: prodInfo?.imageURL,
      title: prodInfo?.productTitle,
      totalSubscribers: prodInfo.customerSubscription?.length,
      price: price,
      potentialPrice: potentialPrice,
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
          {ImageTitle(element.imageURL, element.title)}
        </IndexTable.Cell>
        <IndexTable.Cell><Text variant="headingSm" as="h6" alignment="justify">{element.totalSubscribers}</Text></IndexTable.Cell>
        <IndexTable.Cell> <Text as="p" alignment="justify"> {element.price} </Text> </IndexTable.Cell>
        <IndexTable.Cell> <Text as="p" alignment="justify">{element.potentialPrice}</Text>  </IndexTable.Cell>
      </IndexTable.Row>
    ),
  );

  function ImageTitle(url: string, title: string) {
    return (
      <InlineStack gap="300" blockAlign="center">
        <Box>
          <img src={url} height="40px" width="40px" alt="product" />
        </Box>
        <Text as="p">{title}</Text>
      </InlineStack>
    );
  }

  return (
    <>
      <Box paddingBlockStart="800" paddingBlockEnd="800">
        <Text variant='headingLg' as='h2'>{title}</Text>
      </Box>
      <Box paddingBlockEnd="2000">
        <IndexTable
          resourceName={resourceName}
          itemCount={data.length}
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
      </Box>
    </>

  );
}
