import type { BaseDTO } from "./base.dto";

export interface CustomerSubscriptionDTO extends BaseDTO {
    id?: number;
    productInfoId?: number;
    customerEmail?: string;
    inStock?: boolean;
    status?: boolean;
    isNotified?: boolean;
    isSubscribed?: boolean;
    isActive?: boolean;
    customerPhone?: string;
}
