import { useSubmit, useActionData, useSearchParams } from "@remix-run/react";
import { ActionList, Badge, Card } from "@shopify/polaris";

import type { IndexFiltersProps } from "@shopify/polaris";
import { IndexTable, useIndexResourceState, Text, IndexFilters, useSetIndexFiltersMode, Box, InlineStack, ButtonGroup, Popover, Button } from "@shopify/polaris";
import { useCallback, useState } from "react";
import { } from "@remix-run/react";
import { useAppBridge } from "@shopify/app-bridge-react";
import { ChevronDownIcon } from '@shopify/polaris-icons';

export default function SentRequest({ data, count }: { data: any[], count: any }) {
  const shopifyBridge = useAppBridge();
  const [sortSelected, setSortSelected] = useState(["A-Z"]);
  const [queryValue, setQueryValue] = useState("");
  const [selected, setSelected] = useState(0);
  const { mode, setMode } = useSetIndexFiltersMode();
  const [searchParams] = useSearchParams();
  const submit = useSubmit();
  const [active, setActive] = useState<boolean>(false);

  const handleFiltersQueryChange = useCallback(
    (value: string) => setQueryValue(value),
    []
  );
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

  const filters: any[] = [
  ];

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
    let selected = [];
    for (let d of data) {
      let idx = selectedRow.findIndex((sr: any) => d.id == sr);
      if (idx != -1) {
        selected.push(data[idx]);
      }
    }
    const formData = new FormData();
    formData.append("data", JSON.stringify(selected));
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
      case 'view':
        return <Badge tone="success">Clicked</Badge>
      case 'add_to_cart':
        return <Badge tone="info">Added to Cart</Badge>
      case 'completed':
        return <Badge>Sent</Badge>
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


  const sortOptions: IndexFiltersProps["sortOptions"] = [
    { label: "Product", value: "Product asc", directionLabel: "A-Z" },
    { label: "Product", value: "Product desc", directionLabel: "Z-A" },
    { label: "Contact", value: "Contact asc", directionLabel: "A-Z" },
    { label: "Contact", value: "Contact desc", directionLabel: "Z-A" },
    { label: "Requested On", value: "Requested On asc", directionLabel: "A-Z" },
    { label: "Requested On", value: "Requested On desc", directionLabel: "Z-A" },
    { label: "Vendor", value: "Vendor asc", directionLabel: "A-Z" },
    { label: "Vendor", value: "Vendor desc", directionLabel: "Z-A" }
  ];

  function triggerPagination(type: string, operation: string) {
    let pageParam = 'ppage';
    if (type == 'sent') {
      pageParam = 'spage';
    }
    let page: any = searchParams.get(pageParam);
    if (page == null || isNaN(page)) {
      page = 1;
    } else {
      if (operation == "+") {
        ++page;
      } else {
        --page;
      }
    }
    if (page >= 0) {
      const formData = new FormData();
      formData.append("page", page);
      formData.set('name', type.toUpperCase());
      submit(formData, { method: "post" });
    }
  }

  const hasNext = (param: any, count: any) => {
    let page: any = searchParams.get(param);
    if (page == 0) {
      page = 1;
    }
    const maxPages = Math.ceil(count / 5);
    return page < maxPages;
  }

  return (
    <>
      <Box paddingBlockEnd="500" paddingBlockStart="500">
        <Text variant='headingLg' as='h2'>Sent Requests</Text>
      </Box>
      <Box
        background="bg-surface"
      >
        <InlineStack align="space-between" wrap={false}>
          {selectedResources.length ?
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
          onSelectionChange={handleSelectionChange}
          headings={[
            { title: 'Product' },
            { title: 'Contact' },
            { title: 'Sent On' },
            { title: 'Status' }
          ]}
          pagination={{
            hasNext: hasNext('sent', count),
            hasPrevious: true,
            onNext: () => {
              triggerPagination("sent", "+");
            },
            onPrevious: () => {
              triggerPagination("sent", "-");
            },
          }}
        >
          {rowMarkup}
        </IndexTable>
      </Card>

    </>
  );



}
