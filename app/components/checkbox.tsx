import { Checkbox } from "@shopify/polaris";

export default function CustomCheckBox({ label } : { label: string }) {
  return (
    <div className="check-container">
      <Checkbox
        label={label}
      />
    </div>
  );
}
