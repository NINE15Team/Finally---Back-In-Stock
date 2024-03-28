import { BaseDTO } from "./base.dto";

export interface CustomerActivityDTO extends BaseDTO {
    id?: number;
    customerEmail?: string;
    productInfo?: string;
    status?: string;
}
