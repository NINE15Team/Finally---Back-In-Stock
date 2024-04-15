import type { EmailVerificationStatus } from "~/enum/EmailVerificationStatus";
import type { ProductInfoDTO } from "./product-info.dto";

export interface EmailDTO {
  id?: number;
  toEmail?: string;
  title?: string;
  html?: string;
  productInfo?: ProductInfoDTO;
  storeId?: number;
  storeName?: string;
  shopifyURL?: string;
  senderEmail?: string;
  isEmailVerified?: EmailVerificationStatus | string;
  senderId?: number;
  subscriberId?: number;
  headerContent?: string;
  bodyContent?: string;
  footerContent?: string;
  buttonContent?: string;
  uuid?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
