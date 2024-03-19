import { EmailVerificationStatus } from "~/enum/EmailVerificationStatus";
import { ProductInfo } from "~/models/product-info.model";

export interface EmailDTO {
  toEmail: String;
  name: String;
  title: String;
  html: String;
  productInfo: Partial<ProductInfo>;
  id: number;
  storeId: number;
  storeName: string;
  senderName: string;
  senderEmail: string;
  emailTitle: string;
  isEmailVerified: EmailVerificationStatus | string;
  senderId: number;
  headerContent: string;
  bodyContent: string;
  footerContent: string;
  buttonContent: string;

  createdAt: Date;
  updatedAt: Date;
}
