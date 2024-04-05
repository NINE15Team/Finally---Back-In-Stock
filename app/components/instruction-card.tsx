import { BlockStack, Box, Grid, Text } from "@shopify/polaris";

export default function InstructionCard({ title, description, img_url }: {
  title: string,
  description: any,
  img_url: string
}) {
  return (
    <BlockStack gap={{ xs: "800", sm: "400" }}>
      <Grid columns={{ xs: "1fr", md: "2fr 5fr" }} gap="400">
        <Box
          as="section"
          paddingInlineStart={{ xs: 400, sm: 0 }}
          paddingInlineEnd={{ xs: 400, sm: 0 }}
        >
          <BlockStack gap="400">
            <Text as='h2'>{title}</Text>
            <Text as="p">{description}</Text>
          </BlockStack>
        </Box>
        <Box as="section">
          <img src={img_url} alt="step" />
        </Box>
      </Grid>
    </BlockStack>
  );
}
