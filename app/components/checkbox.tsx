import { BlockStack, Box, InlineGrid, Text } from "@shopify/polaris";

export default function CustomCheckBox({ title, description } : { title: string, description: string }) {
  return (
    <InlineGrid columns={['oneThird', 'twoThirds']}>
      <Box paddingInlineEnd="600">
        <BlockStack gap='200'>
          <Text variant="headingMd" as='h4'>{title}</Text>
          <Text as='p'>{description}</Text>
        </BlockStack>
      </Box>
      <Box borderRadius="100" background="bg-fill-secondary-hover">
        <div style={{height: '92px'}}></div>
      </Box>
    </InlineGrid>
  );
}
