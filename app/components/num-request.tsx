import { Text, Box, InlineGrid, Layout } from "@shopify/polaris";
import { useLoaderData } from "@remix-run/react";

export default function NumRequest() {

  let { totalNotifications, newSubscribers } = useLoaderData<any>();

  return (
    <Layout.Section>
      <Box padding="500" borderRadius="150" background="bg-surface">
        <InlineGrid gap="400" columns={2}>
          <Box minHeight="100px">
            <Text as="p">New Requests</Text>
            <Box paddingBlockStart="500">
              <Text as="h1" variant="heading3xl">{newSubscribers || 0}</Text>
            </Box>
          </Box>
          <Box minHeight="100px">
            <Text as="p">Sent Notifications</Text>
            <Box paddingBlockStart="500">
              <Text as="h1" variant="heading3xl">{totalNotifications || 0}</Text>
             </Box>
          </Box>
        </InlineGrid>
      </Box>
    </Layout.Section>
  );
}
