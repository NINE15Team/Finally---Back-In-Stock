import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import {
    useLoaderData,
    useRevalidator,
} from "@remix-run/react";
import {
    Page,
    Layout,
    Card,
    BlockStack,
    Link,
    DataTable,
    Button,
    List,
    Text,
} from "@shopify/polaris";
import { Modal, TitleBar, useAppBridge } from '@shopify/app-bridge-react';
import { useState } from "react";

export default function SubscriberList() {
    const shopifyBridge = useAppBridge();
    let { revalidate } = useRevalidator();
    let { data, shopifyURL, storeName, potentialRevenue } = useLoaderData<any>();
    let rows: any = [];
    const [selectedProductInfo, setSelectedProductInfo] = useState({} as any);


    for (let i = 0; i < data.length; i++) {
        const productInfo = data[i];
        rows.push([
            `${productInfo.productTitle} - ${productInfo.variantTitle}`,
            `$${productInfo.price}`,
            RenderLink(productInfo.customerSubscription?.length, productInfo.id),
            BoldText(`$${(Number(productInfo.price) * productInfo.customerSubscription?.length)}`),
            productInfo.inStock ? 'Yes' : 'No'
        ]);
    }
    const refreshData = async () => {
        revalidate();
    };

    const onNotifyCustomer = async () => {
        console.log("notify start");
        const response = await fetch(`/api/notify`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                shopifyURL: shopifyURL,
                storeName: storeName,
            }),
        });
        shopifyBridge.modal.show('info-modal');
        revalidate();
    };

    function RenderLink(content: any, productInfoId: any) {
        const handleClick = () => {
            let productInfo: any = data.filter(d => d.id == productInfoId)[0];
            setSelectedProductInfo(productInfo)
            shopifyBridge.modal.show('email-list-modal');
        };
        // Return the Link component with the onClick handler attached
        return <Link onClick={handleClick}>{content}</Link>;
    }
    function BoldText(content: any) {
        return (
            <Text variant="headingSm" as="h6">
                {content}
            </Text>
        )
    }

    return (
        <Page>
            <ui-title-bar title="Finally Back In Stock">
                <button variant="primary" onClick={refreshData}>
                    Reload Data
                </button>
            </ui-title-bar>
            <Modal id="info-modal">
                <p style={{ padding: '20px' }}>Email notification has been processed </p>
                <TitleBar title="Notification Message"></TitleBar>
            </Modal>

            <Modal id="email-list-modal">
                <List type="bullet">
                    <ul>
                        {selectedProductInfo?.customerSubscription?.map((elm: any) => (
                            <List.Item key={elm.customerEmail}>{elm.customerEmail} -  {elm.isNotified ? 'Notified' : 'Not Notify Yet'}</List.Item>
                        ))}
                    </ul>
                </List>
                <TitleBar title="Subscribers List"></TitleBar>
            </Modal>


            <BlockStack gap="400">
                <Layout>
                    <Layout.Section>
                        <Card>
                            <BlockStack gap="200">
                                <DataTable
                                    columnContentTypes={["text", "text", "text", "text"]}
                                    headings={["Product", "Price", "Subscribers", BoldText("Potential Revenue"), "In stock"]}
                                    rows={rows}
                                    totals={['', '', '', `${potentialRevenue ? `$${Math.round(potentialRevenue)}` : 'No customers at this time'}`, '']}
                                    showTotalsInFooter
                                    pagination={{
                                        hasNext: true,
                                        onNext: () => { },
                                    }}
                                />
                            </BlockStack>
                        </Card>
                    </Layout.Section>

                    <Layout.Section variant="oneThird">
                        <BlockStack gap="500">
                            <Card>
                                <BlockStack gap="200">
                                    <BlockStack gap="200">
                                        <Button variant="primary" onClick={onNotifyCustomer}>
                                            Notify Customers
                                        </Button>
                                    </BlockStack>
                                </BlockStack>
                            </Card>
                        </BlockStack>
                    </Layout.Section>
                </Layout>
            </BlockStack>

        </Page>
    );
}
