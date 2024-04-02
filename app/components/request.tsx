import { IndexTable, useIndexResourceState, Text, ButtonGroup, Button, Popover, ActionList } from "@shopify/polaris";
import './request.scss'
import { useState } from "react";
import {ChevronDownIcon} from '@shopify/polaris-icons';

export default function Request({title, label, rows, actions} : {
  title: string,
  label: string,
  rows: any[],
  actions: any[]

}) {
  rows= [
    {id: `0ra${label}`, product: 'Product Name', email: 'amine@ouahidi.com', date: '1/1/2024'},
    {id: `0rb${label}`, product: 'Product Name', email: 'amine@ouahidi.com', date: '1/1/2024'},
    {id: `0rc${label}`, product: 'Product Name', email: 'amine@ouahidi.com', date: '1/1/2024'},
    {id: `0rd${label}`, product: 'Product Name', email: 'amine@ouahidi.com', date: '1/1/2024'},
  ];
  const resourceName = {
    singular: 'order',
    plural: 'orders',
  };

  const {selectedResources, allResourcesSelected, handleSelectionChange} = useIndexResourceState(rows);

  const rowMarkup = rows.map(
    (
      {id, product, email, date},
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
        itemCount={rows.length}
        resourceName={resourceName}
        selectedItemsCount={
          allResourcesSelected ? 'All' : selectedResources.length
        }
        onSelectionChange={handleSelectionChange}
        headings={[
          {title: 'Product'},
          {title: 'Contact'},
          {title: 'Request Date'}
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
    </div>
  );
}
