import type { IndexFiltersProps } from "@shopify/polaris";
import { IndexTable, useIndexResourceState, Text, IndexFilters, useSetIndexFiltersMode, Box, InlineStack, ButtonGroup, Popover, Button} from "@shopify/polaris";
import { useCallback, useState } from "react";
import { useActionData, useSearchParams, useSubmit } from "@remix-run/react";
import { useAppBridge } from "@shopify/app-bridge-react";
import { ChevronDownIcon } from '@shopify/polaris-icons';

export default function Request({ title, data, type, dateAttribute, attributeName, lastColName, lastColValue, lastColKey, actionsList }: {
  title: string,
  data: any[],
  type: string,
  count: number,
  dateAttribute: string,
  attributeName: string,
  lastColName: string,
  lastColValue: (value:any) => any,
  lastColKey: string,
  actionsList: (selectedRow: any[]) => any,

}) {
  const shopifyBridge = useAppBridge();
  let actionResponse: any = useActionData<any>();
  const [sortSelected, setSortSelected] = useState(["A-Z"]);
  const [queryValue, setQueryValue] = useState("");
  const [selected, setSelected] = useState(0);
  const { mode, setMode } = useSetIndexFiltersMode();
  const [searchParams] = useSearchParams();
  const submit = useSubmit();

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
    const date: any = elm[dateAttribute];
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
        <IndexTable.Cell>{lastColValue(element[lastColKey])}</IndexTable.Cell>
      </IndexTable.Row>
    ),
  );

  const [active, setActive] = useState<boolean>(false);

  const toggleActive = () => {
    setActive(!active);
  };

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

  function fetchNext(type: string) {
    let pageParam = 'ppage';
    if (type == 'sent') {
      pageParam = 'spage';
    }
    let page: any = searchParams.get(pageParam);
    if (page == null || isNaN(page)) {
      page = 1;
    } else {
      ++page;
    }
    const formData = new FormData();
    formData.append("page", page);
    formData.set('name', type.toUpperCase());
    submit(formData, { method: "post" });
  }

  function fetchPrev(type: string) {
    let pageParam = 'ppage';
    if (type == 'sent') {
      pageParam = 'spage';
    }
    let page: any = searchParams.get(pageParam);
    if (page == null || isNaN(page)) {
      page = 1;
    } else {
      --page;
    }
    const formData = new FormData();
    formData.append("page", page);
    formData.set('name', type.toUpperCase());
    submit(formData, { method: "post" });
  }

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
              borderBlockEndWidth="050"
              borderColor="border"
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
                  {actionsList(selectedResources)}
                </Popover>
              </ButtonGroup> </Box> : <></>}
          {data.length ? <IndexFilters
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
          /> : <></>}
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
          { title: dateAttribute },
          { title: lastColName }
        ]}
        pagination={{
          hasNext: true,
          hasPrevious: true,
          onNext: () => {
            fetchNext(type);
          },
          onPrevious: () => {
            fetchPrev(type);
          }
        }}
      >
        {rowMarkup}
      </IndexTable>

    </>
  );
}
