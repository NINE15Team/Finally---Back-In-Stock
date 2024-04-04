import { Text, Link, Layout, InlineStack } from '@shopify/polaris';
import { useLoaderData } from "@remix-run/react";
import NumRequest from './num-request';
import NoRequest from './no_request';
import Checklist from "~/components/checklist";
import Report from "~/components/report";

export default function HomeBanner() {
  let { totalNotifications, newSubscribers, subscribedProducts } = useLoaderData<any>();
  const isRequested = totalNotifications || newSubscribers;
  return (
    <>
      <Layout.Section>
        <InlineStack align='space-between'>
          <Text variant="heading2xl" as="h1">Dashboard</Text>
          <div style={{color: '#005BD3'}}>
            <Link removeUnderline monochrome url="/app/instructions">View installation guide</Link>
          </div>
        </InlineStack>
        <div style={{marginBottom: "32px"}}>
          <Text alignment='start' as='p'>Welcome to Finally! Back in stock. </Text>
        </div>
      </Layout.Section>
      {isRequested ?
        <>
          <NumRequest />
          <Report title="Popular Products" pagination={false} data={subscribedProducts} />

        </>
        :
        <>
          <NoRequest />
          <Checklist />
        </>
      }

    </>
  );
}
