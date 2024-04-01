import { Card, Text } from "@shopify/polaris";
import './num-request.scss'
import { useLoaderData } from "@remix-run/react";

export default function NumRequest() {

  let { totalNotifications, newSubscribers } = useLoaderData<any>();

  return (
    <div className="num-wrapper">
      <Card roundedAbove="xs" padding={'800'}>
        <div>
          <p>New Requests</p>
          <Text as="h2" variant="bodyMd">{newSubscribers}</Text>
        </div>
        <div>
          <p>Notification</p>
          <Text as="h2" variant="bodyMd">{totalNotifications}</Text>
        </div>
      </Card>
    </div>
  );
}
