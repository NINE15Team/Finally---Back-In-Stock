import { BaseDTO } from "./base.dto";

export interface TextDTO extends BaseDTO {
  id?: number;
  from?: string;
  to?: string;
  title?: string;
  body?: string;
}
