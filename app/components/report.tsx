import { Box, DataTable, InlineStack, Layout, Text } from "@shopify/polaris";
import { useSearchParams, useSubmit } from "@remix-run/react";
import { I18nContext, useI18n } from '@shopify/react-i18n';

export default function Report({ title, pagination, data }: {
  title: string,
  pagination: boolean | undefined,
  data: any[]

}) {
  const [i18n] = useI18n();
  const submit = useSubmit();
  const [searchParams] = useSearchParams();
  const rows: any = [];

  data.forEach((prodInfo, index) => {
    const price = i18n.formatCurrency(prodInfo.price, {
      currency: 'USD',
      form: 'short',
    });
    const potentialPrice = i18n.formatCurrency(Number(prodInfo.price) * prodInfo.customerSubscription?.length, {
      currency: 'USD',
      form: 'short',
    });
    rows.push([
      ImageTitle(prodInfo.imageURL, prodInfo.productTitle),
      BoldText(prodInfo.customerSubscription?.length),
      <Text key={index} as="p" alignment="center">{price}</Text>,
      <Text key={index} as="p" alignment="end">{potentialPrice}</Text>,
    ]);
  });

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

  function BoldText(content: any) {
    return (
      <Text variant="headingSm" as="h6" alignment="center">
        {content}
      </Text>
    )
  }

  return (
    <Layout.Section>
      <Box paddingBlockStart="800" paddingBlockEnd="800">
        <Text variant='headingLg' as='h2'>{title}</Text>
      </Box>
      <Box paddingBlockEnd="2000">
        <DataTable
          columnContentTypes={[
            'text',
            'numeric',
            'text',
            'text',
          ]}
          headings={[
            'Product',
            <Text key={1} as="p" alignment="center">Requests</Text>,
            <Text key={1} as="p" alignment="center">Price</Text>,
            <Text key={1} as="p" alignment="end">Potential Income</Text>
          ]}
          rows={rows}
          pagination={pagination ? {
            hasNext: true,
            onNext: () => {
              let take: any = searchParams.get('take') || 2;
              let skip: any = searchParams.get('skip');
              if (skip == null || isNaN(skip)) {
                skip = 1;
              }
              skip = (skip * take);
              if (isNaN(skip)) {
                skip = 0
              }
              const formData = new FormData();
              formData.append("take", take);
              formData.append("skip", skip);
              submit(formData, { method: "post" });
            },
          } : undefined}

        />
      </Box>
    </Layout.Section>
  );
}
