import { EmailVerificationStatus } from "~/enum/EmailVerificationStatus";
import { ProductInfo } from "~/models/product-info.model";

export interface EmailDTO {
  toEmail: string;
  name: string;
  title: string;
  html: string;
  productInfo: Partial<ProductInfo>;
  id: number;
  storeId: number;
  storeName: string;
  shopifyURL: string;
  senderEmail: string;
  isEmailVerified: EmailVerificationStatus | string;
  senderId: number;
  headerContent: string;
  bodyContent: string;
  footerContent: string;
  buttonContent: string;

  createdAt: Date;
  updatedAt: Date;
}
