import { IndexTable, useIndexResourceState, Text, ButtonGroup, Button, Popover, ActionList } from "@shopify/polaris";
import './request.scss'
import { useState } from "react";
import { ChevronDownIcon } from '@shopify/polaris-icons';
import { useSubmit } from "@remix-run/react";

export default function Request({ title, label, data, type }: {
  title: string,
  label: string,
  data: any[],
  type: string

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
    ({ id, product, email, date }: { id: any, product: any, email: any, date: any }, index: any) => (
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

  const PendingActionList = ({ selectedRow }: { selectedRow: any }) => {

    const onSend = () => {
      console.log("Send Manually", selectedRow);
      const submit = useSubmit();
      const formData = new FormData();
      formData.append("pendingSubscribers", selectedRow);
      formData.set('name', 'pendingSubscribers');
      submit(formData, { method: "post" });
    }
    const onUnSubscribe = () => {
      console.log("Unsubscribe", selectedRow);
    }
    return (<ActionList
      actionRole="menuitem"
      items={[{ content: 'Send Manually', onAction: onSend }, { content: 'Unsubscribe', onAction: onUnSubscribe }]}
    />)
  }

  const NotificationSentActionList = ({ selectedRow }: { selectedRow: any }) => {

    const onSend = () => {
      console.log("Send Again", selectedRow);
    }
    const onSubscribe = () => {
      console.log("Re subscribe", selectedRow);
    }
    return (<ActionList
      actionRole="menuitem"
      items={[{ content: 'Send Again', onAction: onSend }, { content: 'Re-subscribe', onAction: onSubscribe }]}
    />)
  }


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
            {type == 'pending' ?
              <PendingActionList selectedRow={selectedResources} /> :
              <NotificationSentActionList selectedRow={selectedResources} />
            }
          </Popover>
        </ButtonGroup>
      </div>
    </div >
  );
}
