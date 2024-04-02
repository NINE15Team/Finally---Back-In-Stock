import { IndexTable, useIndexResourceState, Text, ButtonGroup, Button, Popover, ActionList } from "@shopify/polaris";
import './request.scss'
import { useState } from "react";
import { ChevronDownIcon } from '@shopify/polaris-icons';

export default function Request({ title, label, data, actions }: {
  title: string,
  label: string,
  data: any[],
  actions: any[]

}) {
  const resourceName = {
    singular: 'order',
    plural: 'orders',
  };

  let rows = [] as any;
  data.forEach((elm: any) => {
    rows.push({
      id: elm.id,
      product: elm?.productInfo.productTitle,
      email: elm?.customerEmail,
      date: elm?.updatedAt
    })
  });

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

  const [active, setActive] = useState<boolean>(false);

  const toggleActive = () => {
    setActive(!active);
  };


  return (
    <div className="requests-wrapper second-underlined">
      <Text as="h3" variant="bodyMd">{title} - <span>{label}</span></Text>
      <IndexTable
        itemCount={data.length}
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
      <div className="btnContainer">
        <ButtonGroup variant="segmented">
          <div className="my-button">
            <Button variant="primary">Actions</Button>
          </div>

          <Popover
            active={active}
            preferredAlignment="right"
            activator={
              <Button
                variant="primary"
                onClick={() => toggleActive()}
                icon={ChevronDownIcon}
                accessibilityLabel="Other save actions"
              />
            }
            autofocusTarget="first-node"
            onClose={() => toggleActive()}
          >
            <ActionList
              actionRole="menuitem"
              items={actions}
            />
          </Popover>
        </ButtonGroup>
      </div>
    </div >
  );
}
