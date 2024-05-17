import { Text, Box, BlockStack, Layout, Card, Divider, Button, InlineGrid, InlineStack, ButtonGroup } from '@shopify/polaris';
import no_request from "../image/no-request.png";

export default function NoRequest() {
  return (
    <>
      <Card roundedAbove="sm">
        <Text as="h2" variant="headingSm">
          You haven't had any requests yet
        </Text>
        <Box paddingBlockStart="200">
          <Text as="p" variant="bodyMd">
            Please make sure you have the Finally! widget installed and configured.
          </Text>
        </Box>
      </Card>

      <Box paddingBlockStart="200" paddingBlockEnd="300">

      </Box>

      <InlineGrid gap="400" columns={3}>

        <Card roundedAbove="sm" >
          <BlockStack>
            <Text as="h2" variant="headingSm">
              Step 1 - Widget configuration
            </Text>
            <Box paddingBlock="200">
              <Text as="p" variant="bodyMd">
                First, install and configure the Finally! widget on the product details page.
              </Text>
            </Box>
            <Box paddingBlock="500">
            </Box>
          </BlockStack>
          <BlockStack >
            <ButtonGroup>
              <Button variant='primary' tone="success" url='/app/instructions'> Support </Button>
            </ButtonGroup>
          </BlockStack>
        </Card>

        <Card roundedAbove="sm" >
          <BlockStack>
            <Text as="h2" variant="headingSm">
              Step 2 - Email notification
            </Text>
            <Box paddingBlock="200">
              <Text as="p" variant="bodyMd">
                Review and customize the email notification that gets sent to your customers when the products they are interested in are back in stock.
              </Text>
            </Box>
            <ButtonGroup>
              <Button variant='primary' tone="success" url='/app/email'> Customize </Button>
            </ButtonGroup>
          </BlockStack>
        </Card>

        <Card roundedAbove="sm" >
          <BlockStack>
            <Text as="h2" variant="headingSm">
              Step 3 - Test your setup
            </Text>
            <Box paddingBlock="200">
              <Text as="p" variant="bodyMd">
                Test and request to receive a notification when a product is back in stock, modify the stock to test what your customer’s experience would look like.
              </Text>
            </Box>
            <ButtonGroup>
              <Button variant='primary' tone="success" url='/app/reports'> Customize </Button>
            </ButtonGroup>
          </BlockStack>
        </Card>
      </InlineGrid>
      <InlineStack align='center'>
        <Box paddingBlockStart="1000" >
          <Text as='p'>Have questions? Comments? Or suggestions? We would love to hear for you, email us at <a href="#"> support@nine15.com </a> </Text>
        </Box>
      </InlineStack >

    </>
  )

}
