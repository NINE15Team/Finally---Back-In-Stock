import type { EmailVerificationStatus } from "~/enum/EmailVerificationStatus";
import type { ProductInfoDTO } from "./product-info.dto";

export interface TextDTO extends BaseDTO {
  id?: number;
  from?: string;
  to?: string;
  title?: string;
  body?: string;
}
