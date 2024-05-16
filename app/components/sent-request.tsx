import { useSubmit, useActionData, useSearchParams } from "@remix-run/react";
import { ActionList, Badge, Card } from "@shopify/polaris";

import type { IndexFiltersProps } from "@shopify/polaris";
import { IndexTable, useIndexResourceState, Text, IndexFilters, useSetIndexFiltersMode, Box, InlineStack, ButtonGroup, Popover, Button } from "@shopify/polaris";
import { useCallback, useContext, useState } from "react";
import { } from "@remix-run/react";
import { useAppBridge } from "@shopify/app-bridge-react";
import { ChevronDownIcon } from '@shopify/polaris-icons';
import Nine15Context from "~/context/nin15.context";
import { emptyStateMarkup } from "./empty-state";

export default function SentRequest({ data, count }: { data: any[], count: any }) {
  const context = useContext(Nine15Context);
  const totalPages = Math.ceil(count / context.offset);
  const [page, setPage] = useState(0);
  const shopifyBridge = useAppBridge();
  const [searchParams, setSearchParams] = useSearchParams();
  const submit = useSubmit();
  const [active, setActive] = useState<boolean>(false);

  const showToast = (message: string) => {
    shopifyBridge.toast.show(message, { duration: 3000 });
  }
  const resourceName = {
    singular: 'Request',
    plural: 'Requests',
  };

  const options: any = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };

  let rows = [] as any;

  data.forEach((elm: any) => {
    rows.push({
      id: elm.id,
      product: elm?.productInfo.productTitle,
      imageURL: elm?.productInfo.imageURL,
      email: elm?.customerEmail,
      date: new Intl.DateTimeFormat('en-US', options).format(new Date(elm.updatedAt)),
      status: elm?.status
    })
  });
  const { selectedResources, allResourcesSelected, handleSelectionChange } = useIndexResourceState(rows);



  const onSend = (selectedRow: any) => {
    const selectedRowObj = data.filter(item => selectedRow.includes(item.id));
    const formData = new FormData();
    formData.append("data", JSON.stringify(selectedRowObj));
    formData.set('name', 'SEND_EMAIL_AGAIN');
    submit(formData, { method: "post" });
    showToast('Message sent');
  }

  const onSubscribe = (selectedRow: any) => {
    console.log("Re-Subscribe", selectedRow);
    let selected = [];
    for (let d of data) {
      let idx = selectedRow.findIndex((sr: any) => d.id == sr);
      if (idx != -1) {
        selected.push(data[idx]);
      }
    }
    const formData = new FormData();
    formData.append("data", JSON.stringify(selected));
    formData.set('name', 'SUBSCRIBE');
    submit(formData, { method: "post" });
    showToast('Customer Subscribed');
  }


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
  function StatusBadge(status: string) {
    switch (status) {
      case 'send':
        return <Badge>Email Sent</Badge>
      case 'view':
        return <Badge tone="success">Clicked</Badge>
      case 'add_to_cart':
        return <Badge tone="info">Added to Cart</Badge>
      case 'completed':
        return <Badge>Completed</Badge>
      default:
        return <></>
    }
  }

  const rowMarkup = rows.map(
    (element: any, index: any) => (
      <IndexTable.Row
        id={element.id}
        key={element.id}
        selected={selectedResources.includes(element.id)}
        position={index}
      >
        <IndexTable.Cell>
          {ImageTitle(element.imageURL, element.product)}
        </IndexTable.Cell>
        <IndexTable.Cell>{element.email}</IndexTable.Cell>
        <IndexTable.Cell>{element.date}</IndexTable.Cell>
        <IndexTable.Cell>{StatusBadge(element.status)}</IndexTable.Cell>
      </IndexTable.Row>
    ),
  );

  const toggleActive = () => {
    setActive(!active);
  };

  function triggerPagination(type: string, operation: string) {
    setPage((prevPage) => {
      const updatedPage = operation === "+" ? prevPage + 1 : Math.max(0, prevPage - 1);
      console.log(updatedPage);
      setSearchParams((prevParams) => {
        prevParams.set("spage", updatedPage.toString());
        return prevParams;
      });
      return updatedPage;
    });
  }


  return (
    <>
      <Box paddingBlockStart="500">
        <Text variant='headingLg' as='h2'>Sent Requests</Text>
      </Box>
      <Box
        background="bg-surface"
      >
        <InlineStack align="space-between" wrap={false}>
          {selectedResources.length && false ?
            <Box
              padding="200"
            >
              <ButtonGroup variant="segmented">
                <Button onClick={() => toggleActive()} variant="primary">Actions</Button>

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
                    items={[
                      { content: 'Send again', onAction: () => onSend(selectedResources) },
                      { content: 'Re-subscribe', onAction: () => onSubscribe(selectedResources) }]}
                  />
                </Popover>
              </ButtonGroup> </Box> : <></>}
        </InlineStack>
      </Box>
      <Card padding="0">
        <IndexTable
          itemCount={data.length}
          resourceName={resourceName}
          sortColumnIndex={0}
          selectedItemsCount={
            allResourcesSelected ? 'All' : selectedResources.length
          }
          emptyState={emptyStateMarkup}
          onSelectionChange={handleSelectionChange}
          headings={[
            { title: 'Product' },
            { title: 'Contact' },
            { title: 'Sent On' },
            { title: 'Status' }
          ]}
          pagination={{
            hasNext: (page + 1) < totalPages,
            hasPrevious: page > 0,
            onNext: () => {
              triggerPagination("sent", "+");
            },
            onPrevious: () => {
              triggerPagination("sent", "-");
            },
          }}
          selectable={false}
        >
          {rowMarkup}
        </IndexTable>
      </Card>

    </>
  );



}
