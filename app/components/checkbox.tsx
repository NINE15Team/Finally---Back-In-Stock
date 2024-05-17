import { BlockStack, Box, InlineGrid, Text } from "@shopify/polaris";

export default function CustomCheckBox({ title, description }: { title: string, description: string }) {
  return (
    <Box paddingInlineEnd="600">
      <BlockStack gap='200'>
        <Text variant="headingMd" as='h4'>{title}</Text>
        <Text as='p'>{description}</Text>
      </BlockStack>
    </Box>
  );
}
