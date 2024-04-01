import { Layout, Page, Text } from "@shopify/polaris";
import Report from "~/components/report";
import Request from "~/components/request";


export default function Index() {
  return (
    <Page>
      <Layout>
      <Text variant="heading3xl" as="h2">Reports</Text>
        <Report title="Overview" rows={[]} pagination={true} />
        <Request title="Requests" label="Pending" rows={[]}/>
        <Request title="Requests" label="Notification Sent" rows={[]}/>
      </Layout>
    </Page>
  );
}
