import { BlockStack, Box, InlineGrid, Layout, Text } from "@shopify/polaris";

export default function InstructionCard({ title, description, img_url }: {
  title: string,
  description: any,
  img_url: string
}) {
  return (
    <Layout.Section>
      <Box paddingBlockEnd="800">
        <InlineGrid columns={['oneThird', 'twoThirds']} gap="1600">
            <BlockStack gap="400">
              <Text variant='headingLg' as='h2'>{title}</Text>
              <Box padding="500">
                <Text as="p">{description}</Text>
              </Box>
            </BlockStack>
          <Box>
            <img src={img_url} alt="step" style={{width: '100%'}} />
          </Box>
        </InlineGrid>
      </Box>
    </Layout.Section>
  );
}
