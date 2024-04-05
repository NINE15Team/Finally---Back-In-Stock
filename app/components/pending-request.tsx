import { useLoaderData, useSubmit } from "@remix-run/react";
import Request from "./request";
import { ActionList } from "@shopify/polaris";

export default function PendingRequest() {
  let { pendingSubscrbers } = useLoaderData<any>();

  const PendingActionList = ({ selectedRow }: { selectedRow: any }) => {
    const submit = useSubmit();
    const onSend = () => {
      console.log("Send Manually", selectedRow);
      const formData = new FormData();
      formData.append("ids", selectedRow);
      formData.set('name', 'SEND_EMAIL');
      submit(formData, { method: "post" });
    }
    const onUnSubscribe = () => {
      console.log("UnSubscribe", selectedRow);
      const formData = new FormData();
      formData.append("ids", selectedRow);
      formData.set('name', 'UNSUBSCRIBE');
      submit(formData, { method: "post" });
    }
    return (<ActionList
      actionRole="menuitem"
      items={[{ content: 'Send Manually', onAction: onSend }, { content: 'Unsubscribe', onAction: onUnSubscribe }]}
    />)
  }

  return (
    <Request
      title="Pending Requests"
      data={pendingSubscrbers.items}
      count={pendingSubscrbers.count}
      type="pending"
      attributeName="Requested On"
      dateAttribute="createdAt"
      lastColName="Vendor"
      lastColValue={(value: any) => value}
      lastColKey="vendor"
      actionsList={(selectedRow: any[]) => <PendingActionList selectedRow={selectedRow} />}
    />
  );
}
