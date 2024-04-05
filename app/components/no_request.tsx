import { Text, Box, BlockStack, Layout } from '@shopify/polaris';
import no_request from "../image/no-request.png";

export default function NoRequest() {
  return (
    <Layout.Section>
      <Box borderRadius="300" borderWidth="025" borderColor="border" paddingBlockEnd="1200">
        <BlockStack gap="150" align='center' inlineAlign='center'>
          <img className='home-image' src={no_request} height="226px" width="226px" alt="customize" />
          <Text variant="headingMd" as="h2">You haven't had any requests yet.</Text>
          <div style={{maxWidth: "400px"}}>
            <Text alignment='center' as="p"> Please make sure you have the Finally! widget installed and configured.</Text>
          </div>
        </BlockStack>
      </Box>
    </Layout.Section>
  );
}
