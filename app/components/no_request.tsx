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

      <InlineGrid gap="400" columns={1}>

        <Card roundedAbove="sm" >
          <BlockStack>
            <Text as="h2" variant="headingSm">
              Step 1 - Widget configuration
            </Text>
            <Box paddingBlock="200">
              <Box paddingBlockEnd="200">
                <Text as="p" variant="bodyLg" alignment="start">
                  This is the form customers will see if a product is out of stock, they can use the form to subscribe to get notified once the product is back in stock.
                </Text>
              </Box>
              <Text as="p" variant="bodyLg" alignment="start">
                First, install and configure the Finally! Widget on the product page.
              </Text>
            </Box>
          </BlockStack>
          <BlockStack >
            <ButtonGroup>
              <Button variant='primary' tone="success" url='/app/instructions'> Configure </Button>
            </ButtonGroup>
          </BlockStack>
        </Card>

        <Card roundedAbove="sm" >
          <BlockStack>
            <Text as="h2" variant="headingSm">
              Step 2 - Email notification
            </Text>
            <Box paddingBlock="200">

              <Box paddingBlockEnd="200">
                <Text as="p" variant="bodyLg" alignment="start">
                  This is the message your customers will receive when the product they subscribed to is back in stock.
                </Text>
              </Box>

              <Text as="p" variant="bodyLg" alignment="start">
                Review and customize the email message that your customers will receive once the products they are interested in are back in stock.
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
              <Box paddingBlockEnd="200">
                <Text as="p" variant="bodyLg" alignment="start">
                  This is not required but you can test app if you would like by acting as a customer
                  to see what their experience will look like.
                </Text>
              </Box>
              <Text as="p" variant="bodyLg" alignment="start">
                Visit your online store and check a product page that is out of stock, use the
                Finally! Widget to enter your email address to request to be notified once the
                product is back in stock. Then, go in the admin and add stock, you should receive
                an email informing you that the product is back in stock and ready to purchase.
              </Text>
            </Box>
            <ButtonGroup>
              <Button variant='primary' tone="success" url='/app/reports'> Test </Button>
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
