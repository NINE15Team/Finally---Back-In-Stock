import { IndexTable, useIndexResourceState, Text } from "@shopify/polaris";
import './request.scss'
import { useLoaderData } from "@remix-run/react";

export default function Request({ title, label, data }: { title: string, label: string, data: any[] }) {

  let rows = [] as any;
  data.forEach((elm: any) => {
    rows.push({
      product: elm?.productInfo.productTitle,
      email: elm?.customerEmail,
      date: elm?.updatedAt
    })

  });
  const resourceName = {
    singular: 'order',
    plural: 'orders',
  };

  const { selectedResources, allResourcesSelected, handleSelectionChange } = useIndexResourceState(rows);

  const rowMarkup = rows.map(
    (
      { id, product, email, date },
      index,
    ) => (
      <IndexTable.Row
        id={id}
        key={id}
        selected={selectedResources.includes(id)}
        position={index}
      >
        <IndexTable.Cell>
          <Text variant="bodyMd" fontWeight="bold" as="span">
            {product}
          </Text>
        </IndexTable.Cell>
        <IndexTable.Cell>{email}</IndexTable.Cell>
        <IndexTable.Cell>{date}</IndexTable.Cell>
      </IndexTable.Row>
    ),
  );


  return (
    <div className="requests-wrapper second-underlined">
      <Text as="h3" variant="bodyMd">{title} - <span>{label}</span></Text>
      <IndexTable
        itemCount={rows.length}
        resourceName={resourceName}
        selectedItemsCount={
          allResourcesSelected ? 'All' : selectedResources.length
        }
        onSelectionChange={handleSelectionChange}
        headings={[
          { title: 'Product' },
          { title: 'Contact' },
          { title: 'Request Date' }
        ]}
      >
        {rowMarkup}
      </IndexTable>

    </div>
  );
}
