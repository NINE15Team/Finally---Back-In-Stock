import { Text, Link } from '@shopify/polaris';
import '../components/home.scss';
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
      <div className='b-section'>
        <div className="header">
          <Text variant="headingXl" as="h1">Dashboard</Text>
          <Link url="/app/instructions">View installation guide</Link>
        </div>
        <div className='full-width'>
          <Text alignment='start' as='p'>Welcome to Finally! Back in stock. </Text>
        </div>
      </div>
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
