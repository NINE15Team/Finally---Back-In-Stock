import type { IndexFiltersProps } from "@shopify/polaris";
import { IndexTable, useIndexResourceState, Text, ActionList, IndexFilters, useSetIndexFiltersMode, Badge, Box, InlineStack, ButtonGroup, Popover, Button} from "@shopify/polaris";
import { useCallback, useState } from "react";
import { useActionData, useSearchParams, useSubmit } from "@remix-run/react";
import { useAppBridge } from "@shopify/app-bridge-react";

export default function Request({ title, data, type }: {
  title: string,
  data: any[],
  type: string

}) {
  const shopifyBridge = useAppBridge();
  let actionResponse: any = useActionData<any>();
  const [sortSelected, setSortSelected] = useState(["A-Z"]);
  const [queryValue, setQueryValue] = useState("");
  const [selected, setSelected] = useState(0);
  const { mode, setMode } = useSetIndexFiltersMode();
  const submit = useSubmit();
  const [searchParams] = useSearchParams();

  const handleFiltersQueryChange = useCallback(
    (value: string) => setQueryValue(value),
    []
  );
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
    const date: any = type == 'sent' ? elm?.updatedAt : elm?.createdAt;
    rows.push({
      id: elm.id,
      product: elm?.productInfo.productTitle,
      imageURL: elm?.productInfo.imageURL,
      email: elm?.customerEmail,
      date: new Intl.DateTimeFormat('en-US', options).format(new Date(date)),
      vendor: elm?.productInfo.vendor
    })
  });

  const { selectedResources, allResourcesSelected, handleSelectionChange } = useIndexResourceState(rows);

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

  function StatusBadge({ status }: { status: string }) {
    switch (status) {
      case 'view':
        return <Badge>View</Badge>
      case 'add_to_cart':
        return <Badge tone="info">Added to Cart</Badge>
      case 'completed':
        return <Badge tone="success">Completed</Badge>
      default:
        return <></>
    }
  }


  const rowMarkup = rows.map(
    ({ id, product, email, date, imageURL, vendor }: { id: any, product: any, email: any, date: any, imageURL: any, vendor: any }, index: any) => (
      <IndexTable.Row
        id={id}
        key={id}
        selected={selectedResources.includes(id)}
        position={index}
      >
        <IndexTable.Cell>
          {ImageTitle(imageURL, product)}
        </IndexTable.Cell>
        <IndexTable.Cell>{email}</IndexTable.Cell>
        <IndexTable.Cell>{date}</IndexTable.Cell>
        <IndexTable.Cell>{type == 'sent' ? <StatusBadge status="completed" /> : vendor}</IndexTable.Cell>
      </IndexTable.Row>
    ),
  );

  const [active, setActive] = useState<boolean>(false);

  const toggleActive = () => {
    setActive(!active);
  };

  const PendingActionList = ({ selectedRow }: { selectedRow: any }) => {
    const submit = useSubmit();
    const onSend = () => {
      console.log("Send Manually", selectedRow);
      const formData = new FormData();
      formData.append("ids", selectedRow);
      formData.set('name', 'SEND_EMAIL');
      submit(formData, { method: "post" });
    }
    const onUnSubscribe = () => {
      console.log("UnSubscribe", selectedRow);
      const formData = new FormData();
      formData.append("ids", selectedRow);
      formData.set('name', 'UNSUBSCRIBE');
      submit(formData, { method: "post" });
    }
    return (<ActionList
      actionRole="menuitem"
      items={[{ content: 'Send Manually', onAction: onSend }, { content: 'Unsubscribe', onAction: onUnSubscribe }]}
    />)
  }

  const NotificationSentActionList = ({ selectedRow }: { selectedRow: any }) => {
    const submit = useSubmit();
    const onSend = () => {
      console.log("Re-Send", selectedRow);
      const formData = new FormData();
      formData.append("ids", selectedRow);
      formData.set('name', 'SEND_EMAIL');
      submit(formData, { method: "post" });

    }
    const onSubscribe = () => {
      console.log("Re subscribe", selectedRow);
      const formData = new FormData();
      formData.append("ids", selectedRow);
      formData.set('name', 'SUBSCRIBE');
      submit(formData, { method: "post" });

    }
    return (<ActionList
      actionRole="menuitem"
      items={[{ content: 'Send Again', onAction: onSend }, { content: 'Re-subscribe', onAction: onSubscribe }]}
    />)
  }

  const showToast = (message: string) => {
    shopifyBridge.toast.show(message, { duration: 3000 });
  }

  if (actionResponse?.action == 'send_email') {
    showToast('Message sent');
  } else if (actionResponse?.action == 'subscribe') {
    showToast('Customer Subscribed');
  } else if (actionResponse?.action == 'unsubscribe') {
    showToast('Customer Unsubscribed');
  }

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

  return (
    <>
      <Box paddingBlockEnd="800">
        <Text variant='headingLg' as='h2'>{title}</Text>
      </Box>
      <Box
        background="bg-surface"
        borderStartEndRadius="200"
        borderStartStartRadius="200"
      >
      <InlineStack align="space-between" wrap={false}>
        {selectedResources.length ?
        <Box
          borderBlockEndWidth="025"
          borderColor="border"
          padding="200"
        >
         <ButtonGroup variant="segmented">
          <Popover
            active={active}
            preferredAlignment="right"
            activator={
              <Button
                variant="secondary"
                onClick={() => toggleActive()}
                disclosure={active ? 'up' : 'down'}
              >
                Actions
              </Button>
            }
            autofocusTarget="first-node"
            onClose={() => toggleActive()}
          >
            {type === 'pending' ? (
              <PendingActionList selectedRow={selectedResources} />
            ) : (
              <NotificationSentActionList selectedRow={selectedResources} />
            )}
          </Popover>
        </ButtonGroup> </Box> : <></>}
        <IndexFilters
          sortOptions={sortOptions}
          sortSelected={sortSelected}
          queryValue={queryValue}
          queryPlaceholder="Searching in all"
          onQueryChange={handleFiltersQueryChange}
          onQueryClear={() => setQueryValue("")}
          onSort={setSortSelected}
          canCreateNewView={false}
          cancelAction={{
            onAction: () => { },
            disabled: false,
            loading: false,
          }}
          tabs={[]}
          selected={selected}
          onSelect={setSelected}
          filters={filters}
          appliedFilters={[]}
          onClearAll={() => { }}
          mode={mode}
          setMode={setMode}
        />
      </InlineStack>
      </Box>
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
          { title: type == 'sent' ? 'Sent On' : 'Requested On' },
          { title: type == 'sent' ? 'Status' : 'Vendor' }
        ]}
        pagination={{
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
          }
        }}
      >
        {rowMarkup}
      </IndexTable>

    </>
  );
}
