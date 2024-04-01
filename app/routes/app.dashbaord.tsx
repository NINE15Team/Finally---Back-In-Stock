import { Layout, Page } from "@shopify/polaris";
import Checklist from "~/components/checklist";
import NumRequest from "~/components/num-request";
import Report from "~/components/report";


export default function Index() {
  return (
    <Page>
      <Layout>
        <Checklist />
        <NumRequest />
        <Report title="Requests" rows={[]} pagination={false} />
      </Layout>
    </Page>
  );
}
