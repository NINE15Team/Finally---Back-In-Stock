import { ActionFunctionArgs } from '@remix-run/node';
import { BlockStack, Box, Button, Card, List, Page } from '@shopify/polaris';
import { updateStoreInfo, isInitilized } from "../services/store-info.service";
import { authenticate } from "../shopify.server";
import { upsertEmail } from "../services/email.service";
import { Form } from '@remix-run/react';


export default function Instructions() {

    return (
        <Page>
            <Form method='POST' navigate={false} fetcherKey="init-key" >
                <Card>
                    <p>Follow these steps to install the application:</p>
                    <h1>Installation Instructions</h1>
                    <List type="bullet">
                        <List.Item>Click "customize" on your theme.</List.Item>
                        <List.Item>On the left hand side, click "Add Block".</List.Item>
                        <List.Item>Click on Apps and select "Back in Stock Form"</List.Item>
                        <List.Item>Choose customization options of how the widget will display"</List.Item>
                    </List>
                    <Box paddingBlockStart="200">
                        <Button variant="primary" submit={true}>Proceed</Button>
                    </Box>
                </Card>
            </Form>
        </Page >
    );
}