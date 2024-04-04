import { Text } from "@shopify/polaris";

export default function InstructionCard({ title, description, img_url }: {
  title: string,
  description: any,
  img_url: string
}) {
  return (
    <div className="b-section instruction-card">
      <div className="info-wrapper">
        <Text as='h2'>{title}</Text>
        <Text as="p">{description}</Text>
      </div>
      <div className="img-wrapper">
        <img src={img_url} alt="step" />
      </div>
    </div>
  );
}
