import { Box, EmptySearchResult } from "@shopify/polaris";

export const emptyStateMarkup = (
    <Box padding="1600">
        < EmptySearchResult
            title="No Requests found."
            description="Try changing the filters or search term"
            withIllustration={true}
        />
    </Box>
);