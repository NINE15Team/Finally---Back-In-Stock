import { BlockStack, Box, Text, Layout } from '@shopify/polaris';
import CustomCheckBox from './checkbox';

export default function Checklist() {
  return (
    <Layout.Section>
      <Box paddingBlockStart="800" paddingBlockEnd="2000">
        <BlockStack gap="500">
          <Text variant='headingLg' as='h2'>Checklist</Text>
          <CustomCheckBox title="Widget configuration" description="Make sure you install and configure the Finally! widget on the product details page." />
          <CustomCheckBox title="Email notification" description="Review and customize the email notification that gets sent to your customers when the products they are interested in are back in stock. " />
          <CustomCheckBox title="Test your setup" description="Test and request to receive a notification when a product is back in stock, modify the stock or send a request manually to test what your customer’s experience would look like. " />
          <CustomCheckBox title="Share your thoughts" description="Have questions? Comments? Or suggestions? We would love to hear for you. " />
        </BlockStack>
      </Box>
    </Layout.Section>
  );
}
