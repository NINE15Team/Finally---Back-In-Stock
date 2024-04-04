import { DataTable, Text } from "@shopify/polaris";
import './request.scss'
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
    <div className="requests-wrapper full-width b-section">
      <Text as="h2" variant="bodyMd">{title}</Text>
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
    </div>
  );
}
