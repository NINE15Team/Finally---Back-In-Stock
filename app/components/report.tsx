import { Box, DataTable, Layout, Text } from "@shopify/polaris";
import { useSearchParams, useSubmit } from "@remix-run/react";

export default function Report({ title, pagination, data }: {
  title: string,
  pagination: boolean | undefined,
  data: any[]

}) {
  const submit = useSubmit();
  const [searchParams] = useSearchParams();
  const rows: any = [];
  data.forEach(prodInfo => {
    rows.push([
      ImageTitle(prodInfo.imageURL, prodInfo.productTitle),
      BoldText(prodInfo.customerSubscription?.length),
      `$${prodInfo.price}`,
      `$${(Number(prodInfo.price) * prodInfo.customerSubscription?.length)}`,
    ]);
  });

  function ImageTitle(url: string, title: string) {
    return <div className="row-image-container">
      <div className="image-container">
        <img src={url} height="40px" width="40px" alt="product"/>
      </div>
      <Text as="p">{title}</Text>
    </div>
  }

  function BoldText(content: any) {
    return (
      <Text variant="headingSm" as="h6">
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
            'Requests',
            'Price',
            'Potential Income',
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
