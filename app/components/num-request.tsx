import { Card, Text } from "@shopify/polaris";
import { useLoaderData } from "@remix-run/react";

export default function NumRequest() {

  let { totalNotifications, newSubscribers } = useLoaderData<any>();

  return (
    <div className="b-section full-width num-wrapper">
      <Card roundedAbove="xs" padding={'800'}>
        <div>
          <Text as="p">New Requests</Text>
          <Text as="h1" variant="bodyMd">{newSubscribers || 0}</Text>
        </div>
        <div>
          <Text as="p">Sent Notifications</Text>
          <Text as="h1" variant="bodyMd">{totalNotifications || 0}</Text>
        </div>
      </Card>
    </div>
  );
}
