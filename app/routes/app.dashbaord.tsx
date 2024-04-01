import { Layout, Page } from "@shopify/polaris";
import Checklist from "~/components/checklist";
import NumRequest from "~/components/num-request";
import Request from "~/components/request";


export default function Index() {
  return (
    <Page>
      <Layout>
        <Checklist />
        <NumRequest />
        <Request />
      </Layout>
    </Page>
  );
}
