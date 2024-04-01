import { DataTable, Text } from "@shopify/polaris";
import './request.scss'

export default function Report({title, rows, pagination} : {
  title: string,
  rows: any[];
  pagination: boolean | undefined,

}) {
  rows = [
    ['Product Name', 50, '$50', '$50'],
    ['Product Name', 50, '$50', '$50'],
    ['Product Name', 50, '$50', '$50'],
    ['Product Name', 50, '$50', '$50'],
  ];

  return (
    <div className="requests-wrapper">
      <Text as="h3" variant="bodyMd">{title}</Text>
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
          onNext: () => { },
      } : undefined}
      />

    </div>
  );
}
