import { ProductInfo } from './product-info.model';

export class ShopifyStoreInfo {
    id: number;
    storeId: string;
    storeName: string;
    shopifyURL: string;
    createdAt: Date;
    updatedAt: Date;
    isInitilized: boolean;
    isActive: boolean;
    productInfo?: ProductInfo[];

    constructor(
        id: number,
        storeId: string,
        storeName: string,
        shopifyURL: string,
        createdAt: Date,
        updatedAt: Date,
        isInitilized: boolean,
        isActive: boolean,
        productInfo: ProductInfo[]
    ) {
        this.id = id;
        this.storeId = storeId;
        this.storeName = storeName;
        this.shopifyURL = shopifyURL;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.isInitilized = isInitilized;
        this.isActive = isActive;
        this.productInfo = productInfo;

    }
}