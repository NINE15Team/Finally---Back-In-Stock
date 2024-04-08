import { Text, Link, Layout, InlineStack } from '@shopify/polaris';
import { useLoaderData } from "@remix-run/react";
import NoRequest from './no_request';
import Checklist from "~/components/checklist";
import Report from "~/components/report";
import CountRequest from './count-request';

export default function HomeBanner() {
  let { totalNotifications, newSubscribers, subscribedProducts } = useLoaderData<any>();
  const isRequested = totalNotifications || newSubscribers;
  return (
    <>
      <Layout.Section>
        <InlineStack align='space-between'>
          <Text variant="headingXl" as="h1">Dashboard</Text>
          <div style={{ color: '#005BD3' }}>
            <Link removeUnderline monochrome url="/app/instructions">View installation guide</Link>
          </div>
        </InlineStack>
        <div style={{ marginBottom: "32px" }}>
          <Text alignment='start' as='p'>Welcome to Finally! Back in stock. </Text>
        </div>
        {isRequested ?
          <>
            <CountRequest countPending={newSubscribers} countSentNotification={totalNotifications} />
            <Report title="Popular Products" pagination={false} data={subscribedProducts} />
          </>
          :
          <>
            <NoRequest />
            <Checklist />
          </>
        }
      </Layout.Section>
    </>
  );
}
