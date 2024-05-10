import { BlockStack, Box, Text, Layout } from '@shopify/polaris';
import CustomCheckBox from './checkbox';

export default function Checklist() {
  return (
    <Box paddingBlockStart="800" paddingBlockEnd="2000">
      <BlockStack gap="500">
        <Text variant='headingLg' as='h2'>Checklist</Text>

        <Box paddingInlineEnd="600">
          <BlockStack gap='200'>
            <Text variant="headingMd" as='h4'>1. Widget configuration</Text>
            <Text as='p'>First, install and configure the Finally! widget on the product details page.</Text>
          </BlockStack>
        </Box>

        <Box paddingInlineEnd="600">
          <BlockStack gap='200'>
            <Text variant="headingMd" as='h4'>2. Email notification</Text>
            <Text as='p'>Review and customize the email notification that gets sent to your customers when the products they are interested in are back in stock.</Text>
          </BlockStack>
        </Box>

        <Box paddingInlineEnd="600">
          <BlockStack gap='200'>
            <Text variant="headingMd" as='h4'>3. Test your setup</Text>
            <Text as='p'>Test and request to receive a notification when a product is back in stock, modify the stock to test what your customer’s experience would look like.</Text>
          </BlockStack>
        </Box>

        <Box paddingInlineEnd="600">
          <BlockStack gap='200'>
            <Text variant="headingMd" as='h4'>4. Share your thoughts</Text>
            <Text as='p'>Have questions? Comments? Or suggestions? We would love to hear for you, email us at <span style={{ 'color': 'orange' }}> support@nine15.com </span> </Text>
          </BlockStack>
        </Box>

        {/* <CustomCheckBox title="1. Widget configuration" description="First, install and configure the Finally! widget on the product details page." /> */}
        {/* <CustomCheckBox title="2. Email notification" description="Review and customize the email notification that gets sent to your customers when the products they are interested in are back in stock." /> */}
        {/* <CustomCheckBox title="3. Test your setup" description="Test and request to receive a notification when a product is back in stock, modify
the stock to test what your customer’s experience would look like."/> */}
        {/* <CustomCheckBox title="4. Share your thoughts" description="Have questions? Comments? Or suggestions? We would love to hear for you, email us at support@nine15.com" /> */}
      </BlockStack >
    </Box >
  );
}
