import { useLoaderData, useSubmit } from "@remix-run/react";
import Request from "./request";
import { ActionList, Badge } from "@shopify/polaris";

export default function SentRequest() {
  let { customerActivities } = useLoaderData<any>();

  const NotificationSentActionList = ({ selectedRow }: { selectedRow: any }) => {
    const submit = useSubmit();
    const onSend = () => {
      console.log("Re-Send", selectedRow);
      const formData = new FormData();
      formData.append("ids", selectedRow);
      formData.set('name', 'SEND_EMAIL');
      submit(formData, { method: "post" });

    }
    const onSubscribe = () => {
      console.log("Re subscribe", selectedRow);
      const formData = new FormData();
      formData.append("ids", selectedRow);
      formData.set('name', 'SUBSCRIBE');
      submit(formData, { method: "post" });

    }
    return (<ActionList
      actionRole="menuitem"
      items={[{ content: 'Send Again', onAction: onSend }, { content: 'Re-subscribe', onAction: onSubscribe }]}
    />)
  }

  function StatusBadge({ status }: { status: string }) {
    switch (status) {
      case 'view':
        return <Badge>View</Badge>
      case 'add_to_cart':
        return <Badge tone="info">Added to Cart</Badge>
      case 'completed':
        return <Badge tone="success">Completed</Badge>
      default:
        return <></>
    }
  }
  return (
    <Request
      title="Sent Requests"
      data={customerActivities.items}
      count={customerActivities.count}
      type="sent"
      attributeName="Sent On"
      dateAttribute="updatedAt"
      lastColName="Status"
      lastColValue={(value: any) => <StatusBadge status={'view'}/>}
      lastColKey="status"
      actionsList={(selectedRow: any[]) => <NotificationSentActionList selectedRow={selectedRow} />}
    />
  );
}
