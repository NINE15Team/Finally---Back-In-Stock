import { Card, Text } from "@shopify/polaris";
import './num-request.scss'

export default function NumRequest() {
  return (
    <div className="num-wrapper">
      <Card  roundedAbove="xs" padding={'800'}>
        <div>
          <p>New Requests</p>
          <Text as="h2" variant="bodyMd">3</Text>
        </div>
        <div>
          <p>Notification</p>
          <Text as="h2" variant="bodyMd">3</Text>
        </div>
      </Card>
    </div>
  );
}
