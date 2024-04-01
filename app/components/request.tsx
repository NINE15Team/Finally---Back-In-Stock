import { DataTable, Text } from "@shopify/polaris";
import './request.scss'
import { useLoaderData } from "@remix-run/react";

export default function Request() {
  let { subscribedProducts, potentialRevenue } = useLoaderData<any>();
  const rows: any = [
  ];
  for (let i = 0; i < subscribedProducts.length; i++) {
    const productInfo = subscribedProducts[i];
    rows.push([
      `${productInfo.productTitle} - ${productInfo.variantTitle}`,
      BoldText(productInfo.customerSubscription?.length),
      `$${productInfo.price}`,
      `$${(Number(productInfo.price) * productInfo.customerSubscription?.length)}`,
    ]);
  }

  function BoldText(content: any) {
    return (
      <Text variant="headingSm" as="h6">
        {content}
      </Text>
    )
  }

  return (
    <div className="requests-wrapper">
      <Text as="h3" variant="bodyMd">Requests</Text>
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
      />

    </div>
  );
}
