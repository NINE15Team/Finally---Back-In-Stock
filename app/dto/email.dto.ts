import { ProductInfo } from "~/models/product-info.model";

export interface EmailDTO {
    email: String,
    name: String,
    title: String,
    html: String,
    productInfo: ProductInfo
}