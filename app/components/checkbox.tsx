import { Card, Text } from "@shopify/polaris";

export default function CustomCheckBox({ title, description } : { title: string, description: string }) {
  return (
    <div className="check-container">
      <div className="content">
        <Text as='h4'>{title}</Text>
        <Text as='p'>{description}</Text>
      </div>
      <Card />
    </div>
  );
}
