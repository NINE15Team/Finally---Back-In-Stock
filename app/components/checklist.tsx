import { Layout, Link, Page, Text, Card } from '@shopify/polaris';
import CustomCheckBox from './checkbox';

export default function Checklist() {
  return (
    <Page>
      <Layout>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Text variant="heading3xl" as="h2">Welcome to Finally!</Text>
          <Link url="#">
            View installation guide
          </Link>
        </div>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu.
        </p>
        <Card background="bg-surface-brand">
        <Text as="h3" variant="bodyMd">
          Checklist
      </Text>
      <div>
      <CustomCheckBox
      label="Install the Finally! back in stock notification widget."
    />
    <CustomCheckBox
      label="View and test the Finally! back in stock notification widget."
    />
    <CustomCheckBox
      label="Install the Finally! back in stock notification widget."
    />
    <CustomCheckBox
      label="Install the Finally! back in stock notification widget."
    />
      </div>
        </Card>
      </Layout>
    </Page>
  );
}
