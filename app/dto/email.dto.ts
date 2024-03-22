import { EmailVerificationStatus } from "~/enum/EmailVerificationStatus";
import { ProductInfo } from "~/models/product-info.model";
import { ProductInfoDTO } from "./product-info.dto";

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

  createdAt?: Date;
  updatedAt?: Date;
}
