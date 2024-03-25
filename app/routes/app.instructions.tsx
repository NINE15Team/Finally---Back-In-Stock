import { BlockStack, Box, Button, Card, Frame, List, Loading, Page, Scrollable, Spinner, Text } from '@shopify/polaris';
import { PlusIcon } from '@shopify/polaris-icons';
import { Form, unstable_useViewTransitionState, useNavigation } from '@remix-run/react';

import step1 from "../image/step_1.png";
import step2 from "../image/step_2.png";
import step3_4 from "../image/step_3_4.png";
import step5_6 from "../image/step_5_6.png";

export default function Instructions() {
    const navigation = useNavigation();

    return (
        <Page>
            <Form method='POST'>
                <Card>
                    <Text variant="headingXl" as="h2">Installation Instructions</Text>
                    <Text variant="headingXl" as="h4">Follow these steps to install the application:</Text>
                    <List type="bullet">
                        <List.Item>
                            <Text variant="headingMd" as="p">
                                Click "customize" on your theme
                            </Text>
                        </List.Item>
                        <img src={step1}></img>
                        <List.Item>
                            <Text variant="headingMd" as="p">
                                On the left hand side, click "Add Block"
                            </Text>
                        </List.Item>
                        <img src={step2}></img>
                        <List.Item>
                            <Text variant="headingMd" as="p">
                                Click on Apps and select "Back in Stock Form"
                            </Text>
                        </List.Item>
                        <img src={step3_4}></img>
                        <List.Item>
                            <Text variant="headingMd" as="p">
                                Choose customization options of how the widget will display"
                            </Text>
                        </List.Item>
                        <img src={step5_6}></img>
                    </List>
                </Card>
                <BlockStack inlineAlign="end">
                    <Box paddingBlockStart="200">
                        {navigation.state == 'idle' ?
                            <Button variant="primary" tone="critical" submit={true}>Proceed</Button> :
                            <Spinner accessibilityLabel="Spinner example" size="small" />
                        }
                    </Box>
                </BlockStack>
            </Form>
        </Page >
    );
}