import { Text, Box, InlineGrid } from "@shopify/polaris";

export default function CountRequest({ countPending, countSentNotification }: { countPending: any, countSentNotification: any }) {

  return (
    <Box borderRadius="150" borderColor="border" borderWidth="025" background="bg-fill">
      <InlineGrid gap="400" columns={2}>
        <Box padding="500" minHeight="179px" borderInlineEndWidth="025" borderColor="border">
          <Text as="p">New Requests</Text>
          <Box paddingBlockStart="500">
            <Text as="h1" variant="headingXl">{countPending || 0}</Text>
          </Box>
        </Box>
        <Box padding="500" minHeight="179px">
          <Text as="p">Sent Notifications</Text>
          <Box paddingBlockStart="500">
            <Text as="h1" variant="headingXl">{countSentNotification || 0}</Text>
          </Box>
        </Box>
      </InlineGrid>
    </Box>
  );
}
