import { Checkbox } from "@shopify/polaris";

export default function CustomCheckBox({ label } : { label: string }) {
  return (
    <Checkbox
      label={label}
    />
  );
}
