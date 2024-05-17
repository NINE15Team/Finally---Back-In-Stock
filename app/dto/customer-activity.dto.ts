import type { BaseDTO } from "./base.dto";

export interface CustomerActivityDTO extends BaseDTO {
    id?: number;
    customerEmail?: string;
    productInfoId?: number;
    productId?: number;
    variantId?: number;
    status?: string;
    uuid?: string;
    browserTrackId?: string;
}
