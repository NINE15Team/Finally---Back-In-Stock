import { BaseDTO } from "./base.dto";

export interface CustomerSubscriptionDTO extends BaseDTO {
    id?: number;
    productInfoId?: number;
    customerEmail?: string;
    status?: boolean;
    isNotified?: boolean;
    isSubscribed?: boolean;
    isActive?: boolean;
}
