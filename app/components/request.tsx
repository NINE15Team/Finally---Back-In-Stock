import { DataTable, Text } from "@shopify/polaris";
import './request.scss'

export default function Request() {
  const rows: any = [
    ['Product Name', 50, '$50', '$50'],
    ['Product Name', 50, '$50', '$50'],
    ['Product Name', 50, '$50', '$50'],
    ['Product Name', 50, '$50', '$50'],
  ];
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
